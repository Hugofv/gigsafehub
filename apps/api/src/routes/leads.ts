import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { dispatchToProviders } from '../services/providers/index';

export const leadsRouter: Router = Router();

const vehicleSchema = z.object({
  year: z.string(),
  make: z.string(),
  model: z.string(),
  trim: z.string().optional().default(''),
  ownership: z.string(),
  primaryUse: z.string(),
  annualMileage: z.string().optional().default(''),
  garageType: z.string().optional().default(''),
  hasAntiTheft: z.boolean().optional().default(false),
});

const leadSchema = z.object({
  country: z.enum(['US', 'BR']),
  gigType: z.enum(['rideshare', 'delivery', 'both']),
  platforms: z.array(z.string()).min(1),

  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  dateOfBirth: z.string().min(1),
  zipCode: z.string().min(1),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),

  vehicles: z.array(vehicleSchema).min(1),

  yearsLicensed: z.string(),
  accidentsLast5Years: z.number().int().min(0).default(0),
  violationsLast5Years: z.number().int().min(0).default(0),
  sr22Required: z.boolean().optional().default(false),
  hoursPerWeek: z.string(),
  fullTime: z.boolean().optional().default(false),
  creditTier: z.string().optional().default(''),
  maritalStatus: z.string().optional().default(''),
  homeOwner: z.boolean().optional().default(false),

  currentInsured: z.boolean().optional().default(false),
  currentProvider: z.string().optional().default(''),
  liabilityLimit: z.string(),
  deductiblePreference: z.string(),
  wantsFullCoverage: z.boolean().optional().default(false),
  ssnLast4: z.string().optional().default(''),
  militaryStatus: z.boolean().optional().default(false),
  cpf: z.string().optional().default(''),
  cnhNumber: z.string().optional().default(''),

  termsAccepted: z.boolean().refine((v) => v === true),
  privacyAccepted: z.boolean().refine((v) => v === true),
  marketingOptIn: z.boolean().optional().default(false),
});

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Create a new insurance lead and dispatch to providers
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Lead created and dispatched
 *       400:
 *         description: Validation error
 */
leadsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = leadSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          country: data.country,
          language: data.country === 'BR' ? 'pt-BR' : 'en-US',
          productType: 'auto',
          status: 'created',
          meta: { gigType: data.gigType },
        },
      });

      await tx.leadPerson.create({
        data: {
          leadId: lead.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: new Date(data.dateOfBirth),
        },
      });

      await tx.leadAddress.create({
        data: {
          leadId: lead.id,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
      });

      for (const v of data.vehicles) {
        await tx.vehicle.create({
          data: {
            leadId: lead.id,
            year: parseInt(v.year) || 0,
            make: v.make,
            model: v.model,
            trim: v.trim || null,
            ownership: v.ownership,
            primaryUse: v.primaryUse,
            annualMileage: parseInt(v.annualMileage) || null,
            garageType: v.garageType || null,
            hasAntiTheft: v.hasAntiTheft,
          },
        });
      }

      await tx.driver.create({
        data: {
          leadId: lead.id,
          yearsLicensed: parseInt(data.yearsLicensed) || null,
          maritalStatus: data.maritalStatus || null,
          homeOwner: data.homeOwner,
          creditTier: data.creditTier || null,
          accidentsLast5Years: data.accidentsLast5Years,
          violationsLast5Years: data.violationsLast5Years,
          sr22Required: data.sr22Required,
        },
      });

      await tx.gigProfile.create({
        data: {
          leadId: lead.id,
          gigType: data.gigType,
          hoursPerWeek: parseInt(data.hoursPerWeek) || null,
          fullTime: data.fullTime,
          platforms: data.platforms,
          incomeDependency: data.fullTime ? 'primary' : 'secondary',
        },
      });

      await tx.coverageRequest.create({
        data: {
          leadId: lead.id,
          currentInsured: data.currentInsured,
          currentProvider: data.currentProvider || null,
          liabilityLimit: data.liabilityLimit,
          deductiblePreference: parseInt(data.deductiblePreference) || null,
          wantsFullCoverage: data.wantsFullCoverage,
        },
      });

      await tx.countryExtension.create({
        data: {
          leadId: lead.id,
          ssnLast4: data.ssnLast4 || null,
          militaryStatus: data.militaryStatus,
          cpf: data.cpf || null,
          cnhNumber: data.cnhNumber || null,
        },
      });

      const utmSource = (req.query.utm_source as string) || req.headers['x-utm-source'] as string || null;
      const utmMedium = (req.query.utm_medium as string) || null;
      const utmCampaign = (req.query.utm_campaign as string) || null;

      await tx.leadTracking.create({
        data: {
          leadId: lead.id,
          utmSource,
          utmMedium,
          utmCampaign,
          referrer: req.headers.referer || null,
          ipAddress: req.ip || null,
          userAgent: req.headers['user-agent'] || null,
        },
      });

      await tx.leadConsent.create({
        data: {
          leadId: lead.id,
          termsAccepted: data.termsAccepted,
          privacyAccepted: data.privacyAccepted,
          marketingOptIn: data.marketingOptIn,
          consentIp: req.ip || null,
          consentTimestamp: new Date(),
        },
      });

      await tx.leadPayloadSnapshot.create({
        data: {
          leadId: lead.id,
          payload: data as any,
        },
      });

      const partners = await tx.partner.findMany({
        where: { country: data.country, active: true },
      });

      const dispatches = [];
      for (const partner of partners) {
        const dispatch = await tx.partnerDispatch.create({
          data: {
            leadId: lead.id,
            partnerId: partner.id,
            status: 'queued',
          },
        });
        dispatches.push({
          id: dispatch.id,
          partnerId: partner.id,
          partnerName: partner.name,
          partnerLogo: (partner.meta as any)?.logoUrl || '',
          status: 'queued' as const,
          quote: null,
          errorMessage: null,
        });
      }

      return { lead, dispatches };
    });

    // Fire-and-forget: dispatch to providers asynchronously
    dispatchToProviders(result.lead.id).catch((err: unknown) => {
      console.error('Provider dispatch error:', err);
    });

    res.status(201).json({
      id: result.lead.id,
      dispatches: result.dispatches,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Lead creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/leads/{id}/quotes:
 *   get:
 *     summary: Get quote results for a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quote results
 *       404:
 *         description: Lead not found
 */
leadsRouter.get('/:id/quotes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const dispatches = await prisma.partnerDispatch.findMany({
      where: { leadId: id },
      include: { partner: true },
      orderBy: { createdAt: 'asc' },
    });

    if (dispatches.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const terminalStatuses = ['success', 'failed', 'timeout'];
    const allResolved = dispatches.every((d) => terminalStatuses.includes(d.status));

    const result = dispatches.map((d) => ({
      id: d.id,
      partnerId: d.partnerId,
      partnerName: d.partner.name,
      partnerLogo: (d.partner.meta as any)?.logoUrl || '',
      status: d.status,
      quote: d.status === 'success' && d.responsePayload ? d.responsePayload : null,
      errorMessage: d.errorMessage,
    }));

    res.json({
      leadId: id,
      dispatches: result,
      allResolved,
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
