import { prisma } from '../../lib/prisma';
import { getAdapter } from './registry';
import { LeadPayload } from './types';

async function buildLeadPayload(leadId: string): Promise<LeadPayload> {
  const lead = await prisma.lead.findUniqueOrThrow({
    where: { id: leadId },
    include: {
      person: true,
      address: true,
      vehicles: true,
      drivers: true,
      gigProfile: true,
      coverageRequest: true,
    },
  });

  return {
    leadId: lead.id,
    country: lead.country,
    gigType: lead.gigProfile?.gigType || 'rideshare',
    platforms: lead.gigProfile?.platforms || [],
    person: {
      firstName: lead.person!.firstName,
      lastName: lead.person!.lastName,
      email: lead.person!.email,
      phone: lead.person!.phone,
      dateOfBirth: lead.person!.dateOfBirth,
    },
    address: {
      city: lead.address!.city,
      state: lead.address!.state,
      zipCode: lead.address!.zipCode,
    },
    vehicles: lead.vehicles.map((v) => ({
      year: v.year,
      make: v.make,
      model: v.model,
      ownership: v.ownership || '',
      primaryUse: v.primaryUse || '',
      annualMileage: v.annualMileage,
    })),
    driver: {
      yearsLicensed: lead.drivers[0]?.yearsLicensed ?? null,
      accidentsLast5Years: lead.drivers[0]?.accidentsLast5Years ?? 0,
      violationsLast5Years: lead.drivers[0]?.violationsLast5Years ?? 0,
      sr22Required: lead.drivers[0]?.sr22Required ?? false,
      creditTier: lead.drivers[0]?.creditTier ?? null,
    },
    coverage: {
      liabilityLimit: lead.coverageRequest?.liabilityLimit || '',
      deductiblePreference: lead.coverageRequest?.deductiblePreference ?? null,
      wantsFullCoverage: lead.coverageRequest?.wantsFullCoverage ?? false,
    },
  };
}

async function processDispatch(dispatchId: string, payload: LeadPayload, partnerName: string) {
  try {
    await prisma.partnerDispatch.update({
      where: { id: dispatchId },
      data: { status: 'pending', sentAt: new Date() },
    });

    const adapter = getAdapter(dispatchId, partnerName);

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Provider timeout')), adapter.timeout)
    );

    const quote = await Promise.race([adapter.fetchQuote(payload), timeoutPromise]);

    await prisma.partnerDispatch.update({
      where: { id: dispatchId },
      data: {
        status: 'success',
        responsePayload: quote as any,
        responseCode: 200,
      },
    });
  } catch (error: any) {
    const isTimeout = error.message === 'Provider timeout';
    await prisma.partnerDispatch.update({
      where: { id: dispatchId },
      data: {
        status: isTimeout ? 'timeout' : 'failed',
        errorMessage: error.message || 'Unknown error',
      },
    });
  }
}

export async function dispatchToProviders(leadId: string) {
  const payload = await buildLeadPayload(leadId);

  const dispatches = await prisma.partnerDispatch.findMany({
    where: { leadId, status: 'queued' },
    include: { partner: true },
  });

  await Promise.allSettled(
    dispatches.map((d) => processDispatch(d.id, payload, d.partner.name))
  );

  const successCount = await prisma.partnerDispatch.count({
    where: { leadId, status: 'success' },
  });

  const totalCount = dispatches.length;
  const leadQualityScore = Math.min(100, Math.round((successCount / Math.max(totalCount, 1)) * 100));

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: 'dispatched',
      leadQualityScore,
    },
  });
}
