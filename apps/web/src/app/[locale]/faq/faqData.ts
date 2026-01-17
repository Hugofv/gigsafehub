export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const faqData: Record<string, FAQItem[]> = {
  'pt-BR': [
    {
      id: '1',
      question: 'O que é seguro para motoristas de aplicativo?',
      answer: 'Seguro para motoristas de aplicativo é uma apólice de seguro veicular especializada que cobre motoristas que trabalham com plataformas como Uber, 99, iFood e outras. Este tipo de seguro oferece cobertura adicional além do seguro básico, protegendo o motorista durante o período em que está trabalhando.',
      category: 'Seguros',
    },
    {
      id: '2',
      question: 'Qual a diferença entre seguro pessoal e seguro para aplicativo?',
      answer: 'O seguro pessoal cobre apenas o uso particular do veículo. O seguro para aplicativo oferece cobertura específica para quando o motorista está trabalhando, incluindo período online na plataforma, transporte de passageiros ou entregas. Muitas seguradoras tradicionais não cobrem acidentes durante o trabalho.',
      category: 'Seguros',
    },
    {
      id: '3',
      question: 'Freelancers precisam de seguro?',
      answer: 'Sim, freelancers devem considerar seguro de responsabilidade profissional e geral, especialmente se trabalham com clientes ou prestam serviços. Isso protege contra reclamações, erros profissionais e outros riscos do trabalho autônomo.',
      category: 'Seguros',
    },
    {
      id: '4',
      question: 'Quanto custa seguro para motoristas de aplicativo?',
      answer: 'O custo varia conforme o tipo de veículo, uso, localização e cobertura escolhida. Geralmente, seguros especializados para aplicativos podem custar entre R$ 150 a R$ 400 por mês, dependendo dos fatores mencionados.',
      category: 'Preços',
    },
    {
      id: '5',
      question: 'O seguro cobre acidentes durante corridas?',
      answer: 'Sim, o seguro para aplicativo cobre acidentes que ocorrem durante o período de trabalho, incluindo quando você está online na plataforma aguardando corridas, durante o transporte de passageiros ou entregas. É importante verificar as condições específicas da apólice.',
      category: 'Cobertura',
    },
    {
      id: '6',
      question: 'Preciso de seguro se já tenho cobertura da plataforma?',
      answer: 'Sim, é altamente recomendado. A cobertura da plataforma geralmente é limitada e pode não cobrir todos os cenários. Ter um seguro próprio oferece proteção adicional e maior tranquilidade, especialmente em casos de acidentes graves ou danos ao seu veículo.',
      category: 'Cobertura',
    },
    {
      id: '7',
      question: 'Como escolher o melhor seguro para mim?',
      answer: 'Considere fatores como: tipo de veículo, frequência de uso, localização, cobertura desejada e orçamento. Compare diferentes opções, leia as condições e excluições da apólice, e considere buscar orientação de um corretor especializado em seguros para aplicativos.',
      category: 'Geral',
    },
    {
      id: '8',
      question: 'O seguro cobre danos ao meu veículo?',
      answer: 'Depende do tipo de cobertura contratada. Seguros completos geralmente cobrem danos ao seu veículo, enquanto seguros básicos podem cobrir apenas terceiros. Verifique as condições da sua apólice para entender exatamente o que está coberto.',
      category: 'Cobertura',
    },
    {
      id: '9',
      question: 'Posso cancelar o seguro a qualquer momento?',
      answer: 'Geralmente sim, mas pode haver taxas de cancelamento ou regras específicas dependendo da seguradora e do período contratado. Consulte as condições do contrato antes de assinar e verifique as políticas de cancelamento.',
      category: 'Geral',
    },
    {
      id: '10',
      question: 'O que fazer em caso de acidente durante o trabalho?',
      answer: 'Em caso de acidente: 1) Mantenha a calma e verifique se há feridos; 2) Chame a polícia e o serviço de emergência se necessário; 3) Documente o acidente com fotos e informações; 4) Entre em contato com sua seguradora o mais rápido possível; 5) Notifique a plataforma conforme suas políticas.',
      category: 'Geral',
    },
  ],
  'en-US': [
    {
      id: '1',
      question: 'What is rideshare insurance?',
      answer: 'Rideshare insurance is specialized vehicle insurance coverage for drivers who work with platforms like Uber, Lyft, DoorDash, and others. This type of insurance provides additional coverage beyond basic auto insurance, protecting the driver while they are working.',
      category: 'Insurance',
    },
    {
      id: '2',
      question: 'What is the difference between personal insurance and rideshare insurance?',
      answer: 'Personal insurance covers only private vehicle use. Rideshare insurance provides specific coverage for when the driver is working, including the period when online on the platform, transporting passengers, or making deliveries. Many traditional insurers do not cover accidents during work.',
      category: 'Insurance',
    },
    {
      id: '3',
      question: 'Do freelancers need insurance?',
      answer: 'Yes, freelancers should consider professional and general liability insurance, especially if they work with clients or provide services. This protects against claims, professional errors, and other risks of independent work.',
      category: 'Insurance',
    },
    {
      id: '4',
      question: 'How much does rideshare insurance cost?',
      answer: 'Cost varies based on vehicle type, usage, location, and chosen coverage. Generally, specialized rideshare insurance can cost between $50 to $200 per month, depending on the mentioned factors.',
      category: 'Pricing',
    },
    {
      id: '5',
      question: 'Does insurance cover accidents during rides?',
      answer: 'Yes, rideshare insurance covers accidents that occur during work periods, including when you are online on the platform waiting for rides, during passenger transport or deliveries. It is important to check the specific policy conditions.',
      category: 'Coverage',
    },
    {
      id: '6',
      question: 'Do I need insurance if I already have platform coverage?',
      answer: 'Yes, it is highly recommended. Platform coverage is usually limited and may not cover all scenarios. Having your own insurance provides additional protection and greater peace of mind, especially in cases of serious accidents or damage to your vehicle.',
      category: 'Coverage',
    },
    {
      id: '7',
      question: 'How do I choose the best insurance for me?',
      answer: 'Consider factors such as: vehicle type, frequency of use, location, desired coverage, and budget. Compare different options, read policy conditions and exclusions, and consider seeking guidance from a broker specialized in rideshare insurance.',
      category: 'General',
    },
    {
      id: '8',
      question: 'Does insurance cover damage to my vehicle?',
      answer: 'It depends on the type of coverage purchased. Comprehensive insurance generally covers damage to your vehicle, while basic insurance may only cover third parties. Check your policy conditions to understand exactly what is covered.',
      category: 'Coverage',
    },
    {
      id: '9',
      question: 'Can I cancel the insurance at any time?',
      answer: 'Generally yes, but there may be cancellation fees or specific rules depending on the insurer and the contracted period. Review contract conditions before signing and check cancellation policies.',
      category: 'General',
    },
    {
      id: '10',
      question: 'What to do in case of an accident during work?',
      answer: 'In case of an accident: 1) Stay calm and check for injuries; 2) Call police and emergency services if necessary; 3) Document the accident with photos and information; 4) Contact your insurer as soon as possible; 5) Notify the platform according to their policies.',
      category: 'General',
    },
  ],
};
