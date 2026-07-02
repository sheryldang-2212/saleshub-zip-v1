document.addEventListener('DOMContentLoaded', () => {
  // Global error handling to capture uncaught exceptions
  window.addEventListener('error', (event) => {
    console.error('[SalesHub] Unhandled error:', event.message, 'at', event.filename + ':' + event.lineno);
  });

  try {
  // --- UTILS ---
  window.parseAmount = function(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.-]/g, '');
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  window.formatCurrency = function(value, currency = 'USD') {
    const amount = window.parseAmount(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // --- MOCK DATA ---
  window.mockContacts = [
    { id: "C-0001", name: "Brian Halligan", email: "brian@hubspot.com", phone: "+1 888 482 7768", owner: "John Doe", company: "HubSpot", activity: "Yesterday", status: "Subscribed", created: "Jan 1, 2026", isMy: true },
    { id: "C-0002", name: "Sundar Pichai", email: "sundar@google.com", phone: "--", owner: "Unassigned", company: "Google", activity: "3 days ago", status: "Unsubscribed", created: "Feb 15, 2026", isMy: false },
    { id: "C-0003", name: "Elon Musk", email: "elon@tesla.com", phone: "--", owner: "Jane Smith", company: "Tesla", activity: "1 hr ago", status: "Subscribed", created: "Mar 10, 2026", isMy: false },
    { id: "C-0004", name: "Satya Nadella", email: "satya@microsoft.com", phone: "--", owner: "Unassigned", company: "Microsoft", activity: "Just now", status: "Non-marketing", created: "Apr 5, 2026", isMy: false },
    { id: "C-0005", name: "Tim Cook", email: "tim@apple.com", phone: "+1 408 996 1010", owner: "John Doe", company: "Apple", activity: "2 weeks ago", status: "Subscribed", created: "May 20, 2026", isMy: true }
  ];

  window.mockRevenueTargets = [
    { year: '2026', team: 'Total', bookingTarget: 4117022, invoiceTarget: 6108663 },
    { year: '2026', team: 'Hanoi Sales', bookingTarget: 2290249, invoiceTarget: 3665048 },
    { year: '2026', team: 'HCMC Sales', bookingTarget: 1826773, invoiceTarget: 2443614 },
    { year: '2026', team: 'Team HÃ  Ná»™i', bookingTarget: 1000000, invoiceTarget: 1500000 },
    { year: '2026', team: 'Team HCM', bookingTarget: 800000, invoiceTarget: 1000000 },
    { year: '2026', team: 'Team ÄÃ  Náºµng', bookingTarget: 500000, invoiceTarget: 600000 }
  ];

  window.mockTargetAuditLogs = [];

  window.mockDeals = [
    {
      id: "deal-hubspot-closed-won-001",
      dealId: "D-626-0000999",
      dealName: "HubSpot - CRM Expansion 2026",
      name: "HubSpot - CRM Expansion 2026",
      companyId: "company-hubspot",
      companyName: "HubSpot",
      company: "HubSpot",
      dealOwner: "John Doe",
      owner: "John Doe",
      creator: "John Doe",
      pipeline: "Sales Pipeline",
      dealStage: "Closed Won",
      stage: "Closed Won",
      stageProbability: 100,
      amount: 620000,
      currency: "USD",
      closeDate: "2026-03-31",
      dealType: "Existing business",
      projectType: "ODC",
      serviceProvider: "Techvify Software",
      countryRegion: "United States",
      clientSegmentation: "Whale Class (Hunting)",
      status: "Closed Won"
    },
    { id: 'D-626-0000034', name: 'Nurture - HealthCo', pipeline: 'Sales Pipeline', stage: 'Nurture (0%)', amount: '$40,000', closeDate: '12/01/2026', company: 'HealthCo', avatar: 'H', badges: ['ADD MORE CONTACTS', '<10 Touch Points', 'Missing information'], owner: 'Sarah Smith', team: 'Team HÃ  Ná»™i', country: 'US', projectType: 'Project based', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 20000, aug: 20000, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-626-0000037', name: 'New deal - AI Startup', pipeline: 'Sales Pipeline', stage: 'Nurture (0%)', amount: '$80,000', closeDate: '11/30/2026', company: 'AI Startup', avatar: 'AS', badges: ['ADD MORE CONTACTS'], owner: 'John Doe', team: 'Team HCM', country: 'UK', projectType: 'ODC', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 40000, aug: 40000, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-626-0000041', name: 'Test 345', pipeline: 'Outbound Target Account', stage: 'Target Account Identified', amount: '$0', closeDate: '06/13/2026', company: 'Test 345', avatar: 'T3', badges: ['CLOSING OR OVERDUE'], owner: 'Sarah Smith', team: 'Team HÃ  Ná»™i', country: 'US', projectType: 'T&M', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-626-0000027', name: 'Meeting - GreenEnergy', pipeline: 'Sales Pipeline', stage: '1st Meeting (10%)', amount: '$200,000', closeDate: '08/20/2026', company: 'GreenEnergy', avatar: 'G', badges: ['ADD MORE CONTACTS'], owner: 'Jane Smith', team: 'Team ÄÃ  Náºµng', country: 'Germany', projectType: 'Project based', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 100000, aug: 100000, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-626-0000039', name: 'Test 1306', pipeline: 'Outbound Target Account', stage: 'Outreach - Engage', amount: '$123,699,789', closeDate: '06/13/2026', company: 'Unknown', avatar: 'U', badges: ['CLOSING OR OVERDUE'], owner: 'Sarah Smith', team: 'Team HÃ  Ná»™i', country: 'US', projectType: 'ODC', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 61849894, aug: 61849895, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-426-0000012', name: 'Enterprise SaaS rollout', pipeline: 'Sales Pipeline', stage: 'Solution Design (Synced)', amount: '$398,123', closeDate: '09/01/2026', company: 'Global Fin', avatar: 'GF', badges: ['ADD MORE CONTACTS'], owner: 'John Doe', team: 'Team HCM', country: 'Vietnam', projectType: 'Project based', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 199061, aug: 199062, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-426-0000009', name: 'ODC proposal - TechVN', pipeline: 'Sales Pipeline', stage: 'Draft Proposal (Synced)', amount: '$120,000', closeDate: '10/15/2026', company: 'TechVN Ltd', avatar: 'TL', badges: ['ADD MORE CONTACTS'], owner: 'Mike Johnson', team: 'Team ÄÃ  Náºµng', country: 'Vietnam', projectType: 'ODC', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 60000, aug: 60000, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-226-0000004', name: 'SGH - RE - City Developments', pipeline: 'Sales Pipeline', stage: 'Proposal Presented (Synced)', amount: '$180,000', closeDate: '07/15/2026', company: 'City Developments Limited', avatar: 'CD', badges: ['ADD MORE CONTACTS'], owner: 'Sarah Smith', team: 'Team HÃ  Ná»™i', country: 'Singapore', projectType: 'Project based', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 90000, aug: 90000, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-326-0000005', name: 'Proposal - FinServ EU', pipeline: 'Sales Pipeline', stage: 'Proposal Presented (Synced)', amount: '$520,000', closeDate: '08/30/2026', company: 'FinServ EU', avatar: 'FE', badges: ['ADD MORE CONTACTS'], owner: 'John Doe', team: 'Team HCM', country: 'Germany', projectType: 'ODC', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 260000, aug: 260000, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-326-0000008', name: 'Negotiation - InsurTech', pipeline: 'Sales Pipeline', stage: 'Negotiation (90%)', amount: '$123,699,789', closeDate: '06/30/2026', company: 'InsurTech Asia', avatar: 'IA', badges: ['ADD MORE CONTACTS'], owner: 'Sarah Smith', team: 'Team HÃ  Ná»™i', country: 'Singapore', projectType: 'Project based', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 61849894, aug: 61849895, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-1125-0000001', name: 'Won - Retail SG', pipeline: 'Sales Pipeline', stage: 'Closed Won (100%)', amount: '$398,123', closeDate: '05/20/2026', company: 'Retail SG', avatar: 'RS', badges: ['ADD MORE CONTACTS'], owner: 'Sarah Smith', team: 'Team HÃ  Ná»™i', country: 'Singapore', projectType: 'ODC', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 199061, aug: 199062, sep: 0, oct: 0, nov: 0, dec: 0 } },
    { id: 'D-326-0000006', name: 'Lost - Legacy ERP', pipeline: 'Outbound Target Account', stage: 'Close Lost', amount: '$240,000', closeDate: '04/01/2026', company: 'Legacy Corp', avatar: 'LC', badges: ['ADD MORE CONTACTS'], owner: 'John Doe', team: 'Team HCM', country: 'US', projectType: 'T&M', forecast: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 120000, aug: 120000, sep: 0, oct: 0, nov: 0, dec: 0 } }
  ];

  window.mockCompanies = [
    { id: "company-hubspot", name: "HubSpot", domain: "hubspot.com", phone: "+1 888 482 7768", owner: "John Doe", city: "Cambridge", country: "United States", industry: "Software", motion: "Hunting", activity: "Yesterday", created: "Jan 1, 2026", isMy: true,
      annualRevenue: 500000000, itSpendPercent: 5, outsourceablePercent: 30, captureRatePercent: 10,
      potentialTag: "Mega-potential", whaleFlag: false, health: { revenueConfidence: 'A*', relationshipHealth: 'Green', reason: '' },
      gates: { serviceFit: 'pass', legal: 'pass', capacity: 'pass', financial: 'pass', conflict: 'pass' }, matrixScores: [3, 2, 4, 3, 3, 2, 2, 1] },
    { id: "COM-002", name: "Google", domain: "google.com", phone: "--", owner: "Unassigned", city: "Mountain View", country: "United States", industry: "Technology", motion: "Farming", activity: "3 days ago", created: "Feb 15, 2026", isMy: false,
      annualRevenue: 200000000000, itSpendPercent: 5, outsourceablePercent: 20, captureRatePercent: 5,
      potentialTag: "Apex-potential", whaleFlag: true, health: { revenueConfidence: 'B', relationshipHealth: 'Yellow', reason: 'Competitor pressure' },
      gates: { serviceFit: 'pass', legal: 'pass', capacity: 'pass', financial: 'pass', conflict: 'pass' }, matrixScores: [4, 4, 4, 4, 4, 3, 3, 4] },
    { id: "COM-003", name: "Tesla", domain: "tesla.com", phone: "--", owner: "Jane Smith", city: "Austin", country: "United States", industry: "Automotive", motion: "Hunting", activity: "1 hr ago", created: "Mar 10, 2026", isMy: false,
      annualRevenue: 80000000000, itSpendPercent: 5, outsourceablePercent: 25, captureRatePercent: 10,
      potentialTag: "None", whaleFlag: true, health: { revenueConfidence: 'D', relationshipHealth: 'Red', reason: 'No executive sponsor' },
      gates: { serviceFit: 'pending', legal: 'pending', capacity: 'pending', financial: 'pending', conflict: 'pending' }, matrixScores: [0, 0, 0, 0, 0, 0, 0, 0] },
    { id: "COM-004", name: "Microsoft", domain: "microsoft.com", phone: "--", owner: "Unassigned", city: "Redmond", country: "United States", industry: "Technology", motion: "Farming", activity: "Just now", created: "Apr 5, 2026", isMy: false,
      annualRevenue: 150000000000, itSpendPercent: 5, outsourceablePercent: 15, captureRatePercent: 5,
      potentialTag: "Apex-potential", whaleFlag: true, health: { revenueConfidence: 'A', relationshipHealth: 'Green', reason: '' },
      gates: { serviceFit: 'pass', legal: 'pass', capacity: 'pass', financial: 'pass', conflict: 'pass' }, matrixScores: [4, 4, 4, 4, 4, 4, 4, 4] },
    { id: "COM-005", name: "Apple", domain: "apple.com", phone: "+1 408 996 1010", owner: "John Doe", city: "Cupertino", country: "United States", industry: "Technology", motion: "Hunting", activity: "2 weeks ago", created: "May 20, 2026", isMy: true,
      annualRevenue: 300000000000, itSpendPercent: 5, outsourceablePercent: 25, captureRatePercent: 10,
      potentialTag: "Mega-potential", whaleFlag: true, health: { revenueConfidence: 'C', relationshipHealth: 'Yellow', reason: 'Delayed rollout' },
      gates: { serviceFit: 'review', legal: 'pass', capacity: 'pass', financial: 'pass', conflict: 'pass' }, matrixScores: [4, 4, 4, 4, 3, 2, 2, 4] }
  ];
  
  // --- INTELLIGENCE CALCULATION ENGINE ---
  window.calculateCompanyIntelligence = function(companyId) {
    const comp = window.mockCompanies.find(c => c.id === companyId);
    if (!comp) return null;
    
    // 1. Account Motion & TTM Revenue
    const wonDeals = window.mockDeals.filter(d => 
        (d.companyId === companyId || d.company === comp.name) && 
        (d.stage === 'Closed Won' || d.stage === 'Closed Won (100%)' || d.dealStage === 'Closed Won')
    );
    comp.ttmRevenue = wonDeals.reduce((sum, d) => sum + window.parseAmount(d.amount || d.val || 0), 0);
    comp.motion = wonDeals.length > 0 ? 'Farming' : 'Hunting';
    
    // 2. Account Tier (Farming)
    if (comp.motion === 'Farming') {
      if (comp.ttmRevenue >= 5000000) comp.accountTier = 'Apex Account';
      else if (comp.ttmRevenue >= 1000000) comp.accountTier = 'Mega Account';
      else if (comp.ttmRevenue >= 500000) comp.accountTier = 'Established';
      else if (comp.ttmRevenue >= 100000) comp.accountTier = 'Growth';
      else comp.accountTier = 'Emerging';
    } else {
      comp.accountTier = 'N/A';
    }
    
    // 3. Wallet Math
    if (comp.annualRevenue) {
      comp.estItBudget = comp.annualRevenue * (comp.itSpendPercent / 100);
      comp.outsourceableWallet = comp.estItBudget * (comp.outsourceablePercent / 100);
      comp.addressableWallet = comp.outsourceableWallet * (comp.captureRatePercent / 100);
    } else {
      comp.estItBudget = 0;
      comp.outsourceableWallet = 0;
      comp.addressableWallet = 0;
    }
    
    // 4. Qualifying Gates
    if (comp.gates) {
      const gVals = Object.values(comp.gates);
      if (gVals.includes('fail')) comp.pursueRecommendation = 'Do Not Pursue';
      else if (gVals.includes('pending') || gVals.includes('review')) comp.pursueRecommendation = 'Need Qualification';
      else comp.pursueRecommendation = 'Pursue';
    } else {
      comp.pursueRecommendation = 'Need Qualification';
    }
    
    // 5. Matrix Score
    if (comp.matrixScores && comp.matrixScores.length > 0) {
      comp.totalScore = comp.matrixScores.reduce((a,b) => a+b, 0);
      if (comp.matrixScores[2] === 0 || comp.matrixScores[3] === 0 || comp.matrixScores[4] === 0) {
        comp.prospectClassification = 'Not Evaluated';
      } else {
        if (comp.totalScore >= 18) comp.prospectClassification = 'Whale Prospect';
        else if (comp.totalScore >= 12) comp.prospectClassification = 'Tuna Prospect';
        else comp.prospectClassification = 'Minnow Prospect';
      }
    } else {
      comp.totalScore = 0;
      comp.prospectClassification = 'Not Evaluated';
    }
    
    // 6. Action
    if (comp.health?.relationshipHealth === 'Critical') comp.nextAction = 'CEO Escalation Required';
    else if (comp.health?.relationshipHealth === 'Red') comp.nextAction = 'Weekly Review with Commercial Director';
    else if (comp.health?.relationshipHealth === 'Yellow') comp.nextAction = 'Bi-weekly Review with Sales Director';
    else comp.nextAction = 'Create/Update Deal or Proceed Discovery';
    
    return comp;
  };

  // Run initial calculations for all companies
  window.mockCompanies.forEach(c => window.calculateCompanyIntelligence(c.id));

  window.mockBids = [
    { id: 'BID-00800', client: 'TechCorp Solutions', opp: 'Digital Dynamics', status: 'Discovery', val: '$180,000', deadline: '2023-11-15', owner: 'Alex Thompson', deal: 'D-426-0000012 - Enterprise SaaS rollout', isMy: false },
    { id: 'BID-00001', client: 'City Developments Limited', opp: 'SGH - RE - City Developments', status: 'Proposal Presented', val: '$180,000', deadline: '2026-07-15', owner: 'Alex Sales', deal: 'D-226-0000004 - SGH - RE - City Developments', isMy: true },
    { id: 'BID-00002', client: 'TechVN Ltd', opp: 'ODC proposal â€” TechVN', status: 'Draft Proposal', val: '$240,000', deadline: '2026-10-15', owner: 'Jane Smith', deal: 'D-426-0000009 - ODC proposal â€” TechVN', isMy: false },
    { id: 'BID-00801', client: 'Global Fin', opp: 'OB - Sievo - Finland', status: 'Discovery', val: '$85,000', deadline: '2026-08-01', owner: 'Alex Sales', deal: 'D-526-0000026 - OB - Sievo - Finland', isMy: true }
  ];

  window.mockDeliverables = [
    {
      id: "group-solution",
      name: "Solution Design",
      assignee: "Delivery",
      isRequired: true,
      deadline: "2023-10-25",
      subItems: [
        { name: "Scope", checked: true },
        { name: "Architecture", checked: true },
        { name: "Estimate", checked: false },
        { name: "Staffing", checked: false },
        { name: "Delivery Plan", checked: false }
      ],
      versions: [
        {
          versionNumber: "V1",
          fileName: "Solution_Architecture_v1.docx",
          uploadedBy: "Minh Tran",
          uploadedDate: "2023-10-20",
          note: "Initial draft",
          isLatest: false
        },
        {
          versionNumber: "V2",
          fileName: "Solution_Architecture_v3.docx",
          uploadedBy: "Minh Tran",
          uploadedDate: "2023-10-24",
          note: "Addressed review comments",
          isLatest: true
        }
      ]
    },
    {
      id: "group-strategic",
      name: "Strategic Review",
      assignee: "Technology Consulting",
      isRequired: false, // Calculated dynamically later
      deadline: "2023-10-26",
      subItems: [
        { name: "Architecture", checked: false },
        { name: "AI", checked: false },
        { name: "Governance", checked: false },
        { name: "Standards", checked: false }
      ],
      versions: []
    },
    {
      id: "group-proposal",
      name: "Proposal",
      assignee: "Sales / Bid Manager",
      isRequired: true,
      deadline: "2023-10-28",
      versions: []
    },
    {
      id: "group-other",
      name: "Other Docs",
      assignee: "--",
      isRequired: false,
      deadline: "--",
      versions: [
        {
          versionNumber: "V1",
          fileName: "Client_RFP_Document.pdf",
          uploadedBy: "Alex Thompson",
          uploadedDate: "2023-10-15",
          note: "Original RFP",
          isLatest: true
        }
      ]
    },
    {
      id: "group-price",
      name: "Price",
      assignee: "Sales",
      isRequired: true,
      isRestricted: true,
      deadline: "2023-10-30",
      versions: [
        {
          versionNumber: "V1",
          fileName: "Pricing_Estimation.xlsx",
          uploadedBy: "Alex Thompson",
          uploadedDate: "2023-10-26",
          note: "Initial Pricing",
          isLatest: true
        }
      ]
    }
  ];

  window.mockWorkspaceMembers = [];
  window.mockExecutionDecision = {
    ownerType: "Delivery + TC",
    status: "Pending Decision",
    date: "",
    by: "",
    note: ""
  };
  window.mockResponsibleManagers = {
    deliveryManager: "",
    tcManager: "",
    primaryManager: ""
  };

  window.forecastWeights = {
    'Nurture (0%)': 0,
    'Nurture': 0,
    '1st Meeting (10%)': 10,
    'Discovery (10%)': 10,
    'Solution Design (Synced)': 40,
    'Draft Proposal (Synced)': 40,
    'Proposal Presented (Synced)': 70,
    'Negotiation (90%)': 90,
    'Closed Won (100%)': 100,
    'Closed Lost (0%)': 0,
    'Target Account Identified': 0,
    'Account Research': 0,
    'Account Mapping': 0,
    'Outreach - Engage': 10,
    'Responded': 10,
    'Discovery Call': 10,
    'Close Lost': 0
  };

  const salesPipelineStages = [
    'Nurture (0%)', '1st Meeting (10%)', 'Discovery (10%)', 'Solution Design (Synced)',
    'Draft Proposal (Synced)', 'Proposal Presented (Synced)', 'Negotiation (90%)',
    'Closed Won (100%)', 'Closed Lost (0%)'
  ];

  const outboundPipelineStages = [
    'Target Account Identified', 'Account Research', 'Account Mapping', 'Outreach - Engage', 
    'Responded', 'Discovery Call', 'Close Lost', 'Nurture'
  ];
  
  // Default pipeline initialization
  let currentPipeline = sessionStorage.getItem('selectedPipeline') || 'Sales Pipeline';

  const mockAuditLogs = [];

  // --- CUSTOM FIELDS DATA MODEL ---
  window.mockFieldDefinitions = [
    { key: "firstname", label: "First Name", type: "text", isSystem: true, scope: "all" },
    { key: "lastname", label: "Last Name", type: "text", isSystem: true, scope: "all" },
    { key: "email", label: "Email", type: "text", isSystem: true, scope: "all" },
    { key: "phone", label: "Phone Number", type: "text", isSystem: true, scope: "all" },
    { key: "owner", label: "Contact owner", type: "text", isSystem: true, scope: "all" },
    { key: "last_contacted", label: "Last Contacted", type: "date", isSystem: true, scope: "all" },
    { key: "lifecycle_stage", label: "Lifecycle Stage", type: "dropdown", isSystem: true, scope: "all", options: ["Lead", "MQL", "SQL", "Customer", "Evangelist", "Other"] },
    { key: "date_mql", label: "Date entered MQL", type: "date", isSystem: true, scope: "all" },
    { key: "date_sql", label: "Date entered SQL", type: "date", isSystem: true, scope: "all" },
    { key: "lead_status", label: "Lead Status", type: "dropdown", isSystem: true, scope: "all", options: ["New", "Open", "In Progress", "Unqualified", "Attempted to contact", "Connected", "Bad Timing"] },
    { key: "city", label: "City", type: "text", isSystem: true, scope: "all" },
    { key: "create_date", label: "Create Date", type: "date", isSystem: true, scope: "all" },
    { key: "country", label: "Country/Region", type: "text", isSystem: true, scope: "all" },
    { key: "twitter", label: "Twitter Username", type: "text", isSystem: true, scope: "all" },
    { key: "website", label: "Website URL", type: "text", isSystem: true, scope: "all" },
    { key: "status", label: "Status", type: "dropdown", isSystem: true, scope: "all", options: ["Active", "Inactive"] }
  ];

  window.mockFieldValues = [
    { contactId: "contact-001", fieldKey: "firstname", value: "Test" },
    { contactId: "contact-001", fieldKey: "lastname", value: "Test" },
    { contactId: "contact-001", fieldKey: "email", value: "test@example.com" },
    { contactId: "contact-001", fieldKey: "phone", value: "--" },
    { contactId: "contact-001", fieldKey: "owner", value: "Duong Dang Thuy" },
    { contactId: "contact-001", fieldKey: "last_contacted", value: "--" },
    { contactId: "contact-001", fieldKey: "lifecycle_stage", value: "Lead" },
    { contactId: "contact-001", fieldKey: "date_mql", value: "--" },
    { contactId: "contact-001", fieldKey: "date_sql", value: "--" },
    { contactId: "contact-001", fieldKey: "lead_status", value: "New" },
    { contactId: "contact-001", fieldKey: "city", value: "--" },
    { contactId: "contact-001", fieldKey: "create_date", value: "Jun 22, 2026" },
    { contactId: "contact-001", fieldKey: "country", value: "--" },
    { contactId: "contact-001", fieldKey: "twitter", value: "--" },
    { contactId: "contact-001", fieldKey: "website", value: "--" },
    { contactId: "contact-001", fieldKey: "status", value: "Active" }
  ];
  // --- 1. CONTACT LIST (index.html) ---
  const tbody = document.getElementById('contacts-tbody');
  const recordCount = document.getElementById('total-contacts');
  const btnExportContact = document.getElementById('btn-export-contact');
  const btnDeleteContact = document.getElementById('btn-delete-contact');
  const contactSelectAll = document.getElementById('contact-select-all');

  function updateContactActions() {
    if (!tbody) return;
    const checked = tbody.querySelectorAll('.contact-cb:checked').length;
    if (btnExportContact && btnDeleteContact) {
      btnExportContact.disabled = checked === 0;
      btnDeleteContact.disabled = checked === 0;
    }
  }

  function renderContacts(filter = 'all') {
    if (!tbody) return;
    
    let filtered = mockContacts;
    if (filter === 'my') {
      filtered = mockContacts.filter(c => c.isMy);
    } else if (filter === 'unassigned') {
      filtered = mockContacts.filter(c => c.owner === 'Unassigned');
    }
    
    tbody.innerHTML = '';
    filtered.forEach(c => {
      const contactId = c.id || `C-${Math.floor(10000 + Math.random() * 90000)}`;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox" class="contact-cb"></td>
        <td style="font-family: monospace; color: var(--text-muted);">${contactId}</td>
        <td><a href="contact.html" style="font-weight: 500;">${c.name}</a></td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>${c.owner}</td>
        <td>${c.company}</td>
        <td>${c.activity}</td>
        <td>${c.status}</td>
        <td>${c.created}</td>
      `;
      tbody.appendChild(tr);
    });
    
    if (recordCount) recordCount.innerText = `(${filtered.length} records)`;

    const checkboxes = tbody.querySelectorAll('.contact-cb');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        updateContactActions();
        if (contactSelectAll) {
          const allChecked = tbody.querySelectorAll('.contact-cb:checked').length === checkboxes.length;
          contactSelectAll.checked = allChecked && checkboxes.length > 0;
        }
      });
    });
    updateContactActions();
  }

  if (contactSelectAll) {
    contactSelectAll.addEventListener('change', (e) => {
      if (!tbody) return;
      const checkboxes = tbody.querySelectorAll('.contact-cb');
      checkboxes.forEach(cb => cb.checked = e.target.checked);
      updateContactActions();
    });
  }
  
  // Initial render
  if (tbody) renderContacts();
  
  // View Tabs logic
  const viewTabs = document.querySelectorAll('.page-header .view-tabs .tab-item');
  viewTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      if (tab.querySelector('#link-create-view')) return; // Ignore the link container
      
      viewTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const view = tab.getAttribute('data-view');
      renderContacts(view);
    });
  });

  // Filter search mockup
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      if (!tbody) return;
      const rows = tbody.querySelectorAll('tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // --- 2. DRAWERS & MODALS GLOBAL LOGIC ---
  const overlay = document.getElementById('main-overlay');
  
  function openDrawer(id) {
    const d = document.getElementById(id);
    if(d) {
      d.classList.add('active');
      if(overlay) overlay.classList.add('active');
    }
  }
  
  function closeDrawer(id) {
    const d = document.getElementById(id);
    if(d) {
      d.classList.remove('active');
    }
    // Check if any drawer is still open, if not hide overlay
    const anyOpen = document.querySelectorAll('.drawer.active').length;
    if(anyOpen === 0 && overlay) {
      overlay.classList.remove('active');
    }
  }
  
  if (overlay) {
    overlay.addEventListener('click', () => {
      document.querySelectorAll('.drawer.active').forEach(d => d.classList.remove('active'));
      const cm = document.getElementById('modal-create-view');
      if (cm) cm.style.display = 'none';
      overlay.classList.remove('active');
    });
  }

  // --- 3. CREATE VIEW MODAL ---
  const linkCreateView = document.getElementById('link-create-view');
  const modalCreateView = document.getElementById('modal-create-view');
  const cancelView = document.getElementById('cancel-view');
  const closeViewModal = document.getElementById('close-view-modal');
  const viewNameInput = document.getElementById('view-name-input');
  const confirmViewBtn = document.getElementById('confirm-view');
  const viewNameError = document.getElementById('view-name-error');
  
  if (linkCreateView && modalCreateView) {
    linkCreateView.addEventListener('click', (e) => {
      e.preventDefault();
      modalCreateView.style.display = 'block';
      if(overlay) overlay.classList.add('active');
      viewNameInput.focus();
    });
    
    const closeModal = () => {
      modalCreateView.style.display = 'none';
      if(overlay) overlay.classList.remove('active');
      viewNameInput.value = '';
      viewNameInput.parentElement.classList.remove('has-error');
      confirmViewBtn.disabled = true;
    };
    
    cancelView.addEventListener('click', closeModal);
    closeViewModal.addEventListener('click', closeModal);
    
    // Validation
    viewNameInput.addEventListener('input', () => {
      if (viewNameInput.value.trim() === '') {
        viewNameInput.parentElement.classList.add('has-error');
        confirmViewBtn.disabled = true;
      } else {
        viewNameInput.parentElement.classList.remove('has-error');
        confirmViewBtn.disabled = false;
      }
    });
  }

  // --- 4. CREATE CONTACT DRAWER ---
  const btnCreateContact = document.getElementById('btn-create-contact');
  if (btnCreateContact) {
    btnCreateContact.addEventListener('click', () => openDrawer('drawer-create-contact'));
    
    document.getElementById('close-create-contact')?.addEventListener('click', () => closeDrawer('drawer-create-contact'));
    document.getElementById('cancel-create-contact')?.addEventListener('click', () => closeDrawer('drawer-create-contact'));
    
    // Email Validation
    const emailInput = document.getElementById('contact-email');
    const submitBtn = document.getElementById('submit-create-contact');
    const emailGroup = document.getElementById('email-group');
    
    if (emailInput && submitBtn) {
      const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

      emailInput.addEventListener('input', () => {
        const val = emailInput.value.trim();
        if (val === '') {
          emailGroup.classList.remove('has-error');
          submitBtn.disabled = true;
        } else if (!validateEmail(val)) {
          emailGroup.classList.add('has-error');
          submitBtn.disabled = true;
        } else {
          emailGroup.classList.remove('has-error');
          submitBtn.disabled = false;
        }
      });
    }
  }

  // --- 5. CONTACT DETAIL TABS (contact.html) ---
  const detailTabs = document.querySelectorAll('.detail-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (detailTabs.length > 0) {
    detailTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        detailTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const target = tab.getAttribute('data-target');
        document.querySelector(target).classList.add('active');
      });
    });
  }

  // --- 6. ADD COMPANY DRAWER CONTROLLERS & ASSOCIATIONS ---
  // Initialize associated companies for the current page
  let associatedCompanies = [];
  
  if (window.location.pathname.includes('deal.html')) {
    // For deal.html, get the current deal's associated company
    const urlParams = new URLSearchParams(window.location.search);
    const dealId = urlParams.get('id') || (mockDeals[0] ? mockDeals[0].id : null);
    if (dealId) {
      const deal = mockDeals.find(d => d.id === dealId);
      if (deal && deal.company) {
        let comp = mockCompanies.find(c => c.name.toLowerCase() === deal.company.toLowerCase());
        if (!comp) {
          comp = {
            id: 'COM-' + Date.now(),
            name: deal.company,
            domain: (deal.company.replace(/\s+/g, '').toLowerCase()) + '.com',
            phone: '--',
            owner: deal.owner || 'Alex Sales',
            city: '--',
            country: 'United States',
            industry: 'Technology',
            motion: 'Hunting',
            activity: 'Yesterday',
            created: 'Jan 1, 2026',
            isMy: true
          };
          mockCompanies.push(comp);
        }
        associatedCompanies = [comp];
      }
    }
  } else {
    associatedCompanies = [];
  }

  function showToast(message, type = 'success') {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '6px';
      toast.style.color = 'white';
      toast.style.fontSize = '14px';
      toast.style.fontWeight = '500';
      toast.style.zIndex = '9999';
      toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      toast.style.transition = 'all 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.style.backgroundColor = type === 'success' ? '#00A4BD' : '#DC2626';
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
    }, 3000);
  }

  function renderAssociatedCompanies() {
    const card = document.getElementById('card-companies');
    if (!card) return;
    
    if (associatedCompanies.length === 0) {
      card.innerHTML = `
        <div class="card-header">
          <strong>Companies (0)</strong>
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" id="btn-add-company"><i class="ph ph-plus"></i> Add</button>
        </div>
        <div class="empty-state">
          <i class="ph ph-buildings" style="font-size: 24px; margin-bottom: 8px; color: var(--text-light);"></i>
          <div style="font-size: 13px;">See the businesses or organizations associated with this record.</div>
        </div>
      `;
    } else {
      let itemsHtml = '';
      associatedCompanies.forEach(comp => {
        itemsHtml += `
          <div style="padding: 12px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 500; color: var(--text-dark);">${comp.name}</div>
              <div style="font-size: 13px; color: var(--text-muted);">${comp.domain}</div>
            </div>
            <button class="btn-unlink-company" data-id="${comp.id}" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;" title="Unassociate"><i class="ph ph-x"></i></button>
          </div>
        `;
      });
      
      card.innerHTML = `
        <div class="card-header">
          <strong>Companies (${associatedCompanies.length})</strong>
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" id="btn-add-company"><i class="ph ph-plus"></i> Add</button>
        </div>
        <div>
          ${itemsHtml}
        </div>
      `;
    }
  }

  // Handle unlink click
  document.addEventListener('click', (e) => {
    const unlinkBtn = e.target.closest('.btn-unlink-company');
    if (unlinkBtn) {
      const compId = unlinkBtn.getAttribute('data-id');
      associatedCompanies = associatedCompanies.filter(c => c.id !== compId);
      renderAssociatedCompanies();
      showToast('Company unassociated successfully');
    }
  });

  let drawerState = {
    currentTab: 'add-existing', // 'add-existing' | 'create-new'
    currentStep: 1, // 1 | 2
    selectedCompanies: [], // Array of selected company IDs
    newCompanyFields: { name: '', domain: '', owner: '', industry: '', country: '', city: '' },
    currentPage: 1,
    pageSize: 3,
    searchQuery: ''
  };

  function openAddCompanyDrawer() {
    drawerState.currentTab = 'add-existing';
    drawerState.currentStep = 1;
    drawerState.selectedCompanies = [];
    drawerState.newCompanyFields = { name: '', domain: '', owner: '', industry: '', country: '', city: '' };
    drawerState.currentPage = 1;
    drawerState.searchQuery = '';
    
    const nameInp = document.getElementById('new-company-name');
    const domInp = document.getElementById('new-company-domain');
    const ownerInp = document.getElementById('new-company-owner');
    const indInp = document.getElementById('new-company-industry');
    const countryInp = document.getElementById('new-company-country');
    const cityInp = document.getElementById('new-company-city');
    const searchInp = document.getElementById('search-company-input');
    
    if (nameInp) nameInp.value = '';
    if (domInp) domInp.value = '';
    if (ownerInp) ownerInp.value = '';
    if (indInp) indInp.value = '';
    if (countryInp) countryInp.value = '';
    if (cityInp) cityInp.value = '';
    if (searchInp) searchInp.value = '';
    
    document.querySelectorAll('#form-drawer-create-company .form-group').forEach(grp => {
      grp.classList.remove('has-error');
    });
    
    document.querySelectorAll('#add-company-tabs .drawer-tab').forEach(tab => {
      if (tab.getAttribute('data-tab') === 'add-existing') {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    updateDrawerUI();
    openDrawer('drawer-add-company');
  }

  function updateDrawerUI() {
    const titleEl = document.getElementById('add-company-drawer-title');
    if (titleEl) {
      titleEl.textContent = drawerState.currentTab === 'add-existing' ? 'Add existing Company' : 'Create Company';
    }
    
    document.querySelectorAll('#drawer-add-company .drawer-panel').forEach(panel => {
      panel.style.display = 'none';
    });
    
    const activePanelId = `${drawerState.currentTab}-step${drawerState.currentStep}`;
    const activePanel = document.getElementById(activePanelId);
    if (activePanel) activePanel.style.display = 'block';
    
    const stepInd = document.getElementById('company-step-indicator');
    if (stepInd) {
      stepInd.textContent = `Step ${drawerState.currentStep} of 2`;
    }
    
    const backBtn = document.getElementById('back-company');
    const cancelBtn = document.getElementById('cancel-company');
    const nextBtn = document.getElementById('next-company');
    
    if (backBtn) {
      backBtn.style.display = drawerState.currentStep === 2 ? 'inline-block' : 'none';
    }
    
    if (nextBtn) {
      if (drawerState.currentStep === 1) {
        nextBtn.textContent = 'Next';
        if (drawerState.currentTab === 'add-existing') {
          nextBtn.disabled = drawerState.selectedCompanies.length === 0;
        } else {
          nextBtn.disabled = !isCreateFormValid();
        }
      } else {
        nextBtn.textContent = drawerState.currentTab === 'add-existing' ? 'Save' : 'Create';
        nextBtn.disabled = false;
      }
    }
    
    if (drawerState.currentTab === 'add-existing' && drawerState.currentStep === 1) {
      renderExistingCompaniesList();
    }
    
    if (drawerState.currentStep === 2) {
      if (drawerState.currentTab === 'add-existing') {
        renderConfirmAssociationList();
      } else {
        renderConfirmCreationSummary();
      }
    }
  }

  function isCreateFormValid() {
    const fields = drawerState.newCompanyFields;
    return fields.name.trim() !== '' && fields.owner !== '' && fields.industry !== '' && fields.country !== '';
  }

  function renderConfirmCreationSummary() {
    const summaryEl = document.getElementById('confirm-creation-summary');
    if (!summaryEl) return;
    const fields = drawerState.newCompanyFields;
    summaryEl.innerHTML = `
      <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-muted);">Company Name:</span> <span style="font-weight: 500;">${escapeHtml(fields.name)}</span></div>
      <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-muted);">Domain Name:</span> <span style="font-weight: 500;">${escapeHtml(fields.domain) || '--'}</span></div>
      <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-muted);">Company Owner:</span> <span style="font-weight: 500;">${fields.owner}</span></div>
      <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-muted);">Industry:</span> <span style="font-weight: 500;">${fields.industry}</span></div>
      <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-muted);">Country/Region:</span> <span style="font-weight: 500;">${fields.country}</span></div>
      <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-muted);">City:</span> <span style="font-weight: 500;">${escapeHtml(fields.city) || '--'}</span></div>
    `;
  }

  function renderConfirmAssociationList() {
    const listEl = document.getElementById('confirm-association-list');
    if (!listEl) return;
    const selected = mockCompanies.filter(c => drawerState.selectedCompanies.includes(c.id));
    let listHtml = '';
    selected.forEach(comp => {
      listHtml += `
        <div class="list-item" style="cursor: default; hover: none;">
          <div class="list-item-content">
            <div class="list-item-title" style="color: var(--text-dark);">${comp.name} <span style="font-size: 12px; color: var(--text-muted);">(${comp.domain})</span></div>
          </div>
        </div>
      `;
    });
    listEl.innerHTML = listHtml;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderExistingCompaniesList() {
    const listContainer = document.getElementById('existing-companies-list');
    const countLabel = document.getElementById('company-count-label');
    const paginationContainer = document.getElementById('existing-companies-pagination');
    
    if (!listContainer) return;
    
    const query = drawerState.searchQuery.toLowerCase().trim();
    const filtered = mockCompanies.filter(c => {
      const nameMatch = c.name && c.name.toLowerCase().includes(query);
      const domainMatch = c.domain && c.domain.toLowerCase().includes(query);
      const idMatch = c.id && c.id.toLowerCase().includes(query);
      return nameMatch || domainMatch || idMatch;
    });
    
    if (countLabel) {
      countLabel.textContent = `${filtered.length} Companies`;
    }
    
    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state" style="padding: 32px; text-align: center; color: var(--text-muted);">
          <i class="ph ph-magnifying-glass" style="font-size: 32px; margin-bottom: 8px; opacity: 0.5;"></i>
          <div style="font-size: 14px; font-weight: 500;">No companies found</div>
        </div>
      `;
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }
    
    const totalPages = Math.ceil(filtered.length / drawerState.pageSize);
    if (drawerState.currentPage > totalPages) drawerState.currentPage = Math.max(1, totalPages);
    
    const startIndex = (drawerState.currentPage - 1) * drawerState.pageSize;
    const endIndex = Math.min(startIndex + drawerState.pageSize, filtered.length);
    const paginated = filtered.slice(startIndex, endIndex);
    
    let listHtml = '';
    paginated.forEach(comp => {
      const isChecked = drawerState.selectedCompanies.includes(comp.id) ? 'checked' : '';
      listHtml += `
        <label class="list-item">
          <input type="checkbox" class="company-checkbox" data-id="${comp.id}" ${isChecked}>
          <div class="list-item-content">
            <div class="list-item-title">${comp.name} <span style="font-size:12px; color:var(--text-muted);">(${comp.domain})</span></div>
          </div>
        </label>
      `;
    });
    listContainer.innerHTML = listHtml;
    
    if (paginationContainer) {
      paginationContainer.innerHTML = `
        <span>${startIndex + 1}-${endIndex} of ${filtered.length}</span>
        <button class="btn btn-secondary" id="company-prev-page" ${drawerState.currentPage === 1 ? 'disabled' : ''} style="margin-left: 8px; padding: 4px 8px;"><i class="ph ph-caret-left"></i></button>
        <button class="btn btn-secondary" id="company-next-page" ${drawerState.currentPage === totalPages ? 'disabled' : ''} style="margin-left: 4px; padding: 4px 8px;"><i class="ph ph-caret-right"></i></button>
      `;
      
      document.getElementById('company-prev-page')?.addEventListener('click', () => {
        drawerState.currentPage--;
        renderExistingCompaniesList();
      });
      document.getElementById('company-next-page')?.addEventListener('click', () => {
        drawerState.currentPage++;
        renderExistingCompaniesList();
      });
    }
    
    listContainer.querySelectorAll('.company-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.getAttribute('data-id');
        if (cb.checked) {
          if (!drawerState.selectedCompanies.includes(id)) {
            drawerState.selectedCompanies.push(id);
          }
        } else {
          drawerState.selectedCompanies = drawerState.selectedCompanies.filter(cid => cid !== id);
        }
        
        const nextBtn = document.getElementById('next-company');
        if (nextBtn && drawerState.currentStep === 1 && drawerState.currentTab === 'add-existing') {
          nextBtn.disabled = drawerState.selectedCompanies.length === 0;
        }
      });
    });
  }

  function initAddCompanyEventListeners() {
    const searchCompanyInp = document.getElementById('search-company-input');
    if (searchCompanyInp) {
      searchCompanyInp.addEventListener('input', (e) => {
        drawerState.searchQuery = e.target.value;
        drawerState.currentPage = 1;
        renderExistingCompaniesList();
      });
    }
    
    const tabContainer = document.getElementById('add-company-tabs');
    if (tabContainer) {
      tabContainer.querySelectorAll('.drawer-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const targetTab = tab.getAttribute('data-tab');
          if (targetTab === drawerState.currentTab) return;
          
          drawerState.currentTab = targetTab;
          drawerState.currentStep = 1;
          
          tabContainer.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          updateDrawerUI();
        });
      });
    }
    
    const nextCompanyBtn = document.getElementById('next-company');
    if (nextCompanyBtn) {
      nextCompanyBtn.addEventListener('click', () => {
        if (drawerState.currentStep === 1) {
          if (drawerState.currentTab === 'create-new') {
            if (!isCreateFormValid()) {
              const required = [
                { id: 'new-company-name', grp: 'group-new-company-name' },
                { id: 'new-company-owner', grp: 'group-new-company-owner' },
                { id: 'new-company-industry', grp: 'group-new-company-industry' },
                { id: 'new-company-country', grp: 'group-new-company-country' }
              ];
              required.forEach(item => {
                const inp = document.getElementById(item.id);
                if (inp && inp.value.trim() === '') {
                  document.getElementById(item.grp)?.classList.add('has-error');
                }
              });
              return;
            }
          } else {
            if (drawerState.selectedCompanies.length === 0) {
              showToast('Please select at least one company.', 'error');
              return;
            }
          }
          drawerState.currentStep = 2;
          updateDrawerUI();
        } else {
          // Save / Create
          if (drawerState.currentTab === 'add-existing') {
            drawerState.selectedCompanies.forEach(id => {
              const comp = mockCompanies.find(c => c.id === id);
              if (comp && !associatedCompanies.some(ac => ac.id === comp.id)) {
                associatedCompanies.push(comp);
              }
            });
            renderAssociatedCompanies();
            showToast('Company associated successfully');
            closeDrawer('drawer-add-company');
          } else {
            const fields = drawerState.newCompanyFields;
            const newComp = {
              id: 'COM-' + Date.now(),
              name: fields.name.trim(),
              domain: fields.domain.trim() || (fields.name.replace(/\s+/g, '').toLowerCase() + '.com'),
              phone: '--',
              owner: fields.owner,
              city: fields.city.trim() || '--',
              country: fields.country,
              industry: fields.industry,
              motion: 'Hunting',
              activity: 'Just now',
              created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              isMy: true
            };
            
            mockCompanies.unshift(newComp);
            associatedCompanies.push(newComp);
            
            renderAssociatedCompanies();
            showToast('Company created and associated successfully');
            closeDrawer('drawer-add-company');
          }
        }
      });
    }
    
    const backCompanyBtn = document.getElementById('back-company');
    if (backCompanyBtn) {
      backCompanyBtn.addEventListener('click', () => {
        if (drawerState.currentStep === 2) {
          drawerState.currentStep = 1;
          updateDrawerUI();
        }
      });
    }
    
    const handleCloseAddCompany = () => {
      closeDrawer('drawer-add-company');
    };
    
    document.getElementById('close-add-company')?.addEventListener('click', handleCloseAddCompany);
    document.getElementById('cancel-company')?.addEventListener('click', handleCloseAddCompany);
    
    // Form Inputs Listeners
    const nameInp = document.getElementById('new-company-name');
    const domInp = document.getElementById('new-company-domain');
    const ownerInp = document.getElementById('new-company-owner');
    const indInp = document.getElementById('new-company-industry');
    const countryInp = document.getElementById('new-company-country');
    const cityInp = document.getElementById('new-company-city');
    
    const handleInput = (inp, field, required = false, groupName) => {
      if (!inp) return;
      const updateValue = () => {
        drawerState.newCompanyFields[field] = inp.value;
        const grp = document.getElementById(groupName);
        if (required && inp.value.trim() === '') {
          if (grp) grp.classList.add('has-error');
        } else {
          if (grp) grp.classList.remove('has-error');
        }
        
        const nextBtn = document.getElementById('next-company');
        if (nextBtn && drawerState.currentStep === 1 && drawerState.currentTab === 'create-new') {
          nextBtn.disabled = !isCreateFormValid();
        }
      };
      inp.addEventListener('input', updateValue);
      inp.addEventListener('change', updateValue);
      inp.addEventListener('blur', () => {
        if (required && inp.value.trim() === '') {
          const grp = document.getElementById(groupName);
          if (grp) grp.classList.add('has-error');
        }
      });
    };
    
    handleInput(nameInp, 'name', true, 'group-new-company-name');
    handleInput(domInp, 'domain', false, 'group-new-company-domain');
    handleInput(ownerInp, 'owner', true, 'group-new-company-owner');
    handleInput(indInp, 'industry', true, 'group-new-company-industry');
    handleInput(countryInp, 'country', true, 'group-new-company-country');
    handleInput(cityInp, 'city', false, 'group-new-company-city');
  }

  // Event delegation to catch clicks on dynamically rendered Add Company buttons
  document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'btn-add-company' || e.target.closest('#btn-add-company'))) {
      openAddCompanyDrawer();
    }
  });

  renderAssociatedCompanies();
  initAddCompanyEventListeners();

  // --- 7. CREATE DEAL DRAWER (contact.html) ---
  const btnCreateDeal = document.getElementById('btn-create-deal');
  if (btnCreateDeal) {
    btnCreateDeal.addEventListener('click', () => openDrawer('drawer-create-deal'));
    
    document.getElementById('close-create-deal')?.addEventListener('click', () => closeDrawer('drawer-create-deal'));
    document.getElementById('cancel-deal')?.addEventListener('click', () => closeDrawer('drawer-create-deal'));
  }

  // --- 8. SUB-TABS LOGIC (contact.html) ---
  const subTabs = document.querySelectorAll('.sub-tab');
  subTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      subTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // --- 9. DRAWER TABS LOGIC (contact.html) ---
  const drawerTabs = document.querySelectorAll('.drawer-tab');
  drawerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const parent = tab.parentElement;
      if (parent) {
        parent.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      }
    });
  });

  // --- MOCK DATA FOR COMPANIES ---


  // --- 10. COMPANY LIST (companies.html) ---
  const compTbody = document.getElementById('companies-tbody');
  const compRecordCount = document.getElementById('total-companies');
  const emptyState = document.getElementById('company-empty-state');
  const btnExport = document.getElementById('btn-export-company');
  const btnDelete = document.getElementById('btn-delete-company');
  const searchCompanies = document.getElementById('search-companies');
  
  function updateCompanyActions() {
    if (!compTbody) return;
    const checked = compTbody.querySelectorAll('input[type="checkbox"]:checked').length;
    if (btnExport && btnDelete) {
      btnExport.disabled = checked === 0;
      btnDelete.disabled = checked === 0;
    }
  }

  function renderCompanies(filter = 'all', query = '') {
    if (!compTbody) return;
    
    let filtered = mockCompanies;
    if (filter === 'my') {
      filtered = filtered.filter(c => c.isMy);
    } else if (filter === 'unassigned') {
      filtered = filtered.filter(c => c.owner === 'Unassigned');
    }

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.domain.toLowerCase().includes(q) || 
        c.phone.toLowerCase().includes(q) || 
        c.owner.toLowerCase().includes(q) || 
        c.city.toLowerCase().includes(q) || 
        c.country.toLowerCase().includes(q) || 
        c.industry.toLowerCase().includes(q)
      );
    }
    
    compTbody.innerHTML = '';
    
    if (filtered.length === 0) {
      if(emptyState) emptyState.style.display = 'block';
    } else {
      if(emptyState) emptyState.style.display = 'none';
      filtered.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="checkbox" class="comp-cb"></td>
          <td style="font-family: monospace; color: var(--text-muted);">${c.id}</td>
          <td><a href="company.html?id=${c.id}" style="font-weight: 500;">${c.name}</a></td>
          <td><span class="badge ${c.motion === 'Farming' ? 'b-blue' : 'b-grey'}" style="font-size: 12px; padding: 2px 8px; border-radius: 12px;">${c.motion || 'Hunting'}</span></td>
          <td><span style="font-weight: 500; color: #8B5CF6;">${c.motion === 'Farming' ? (c.accountTier || 'Emerging') : (c.prospectClassification || 'Not Evaluated')}</span></td>
          <td>${c.potentialTag || 'None'}</td>
          <td><span class="badge" style="background-color: ${c.health && c.health.relationshipHealth === 'Red' ? '#FEE2E2' : c.health && c.health.relationshipHealth === 'Yellow' ? '#FEF3C7' : c.health && c.health.relationshipHealth === 'Critical' ? '#991B1B' : '#D1FAE5'}; color: ${c.health && c.health.relationshipHealth === 'Red' ? '#EF4444' : c.health && c.health.relationshipHealth === 'Yellow' ? '#D97706' : c.health && c.health.relationshipHealth === 'Critical' ? '#FEF2F2' : '#10B981'}; font-size: 11px;">${c.health ? c.health.relationshipHealth : 'N/A'}</span></td>
          <td>${c.owner}</td>
          <td>${c.industry}</td>
          <td>${c.domain}</td>
          <td>${c.activity}</td>
        `;
        compTbody.appendChild(tr);
      });
    }
    
    if(compRecordCount) compRecordCount.innerText = `(${filtered.length} records)`;

    // Attach listener to checkboxes
    const cbs = compTbody.querySelectorAll('.comp-cb');
    cbs.forEach(cb => {
      cb.addEventListener('change', updateCompanyActions);
    });
    
    // Check all logic
    const checkAll = document.getElementById('check-all-companies');
    if (checkAll) {
      checkAll.checked = false;
      checkAll.addEventListener('change', (e) => {
        cbs.forEach(cb => cb.checked = e.target.checked);
        updateCompanyActions();
      });
    }
    updateCompanyActions();
  }
  
  if (compTbody) {
    renderCompanies();
    
    // View Tabs
    const compViewTabs = document.querySelectorAll('.page-header .view-tabs .tab-item');
    compViewTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.querySelector('#link-create-view')) return;
        compViewTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const view = tab.getAttribute('data-view');
        renderCompanies(view, searchCompanies ? searchCompanies.value : '');
      });
    });

    // Search
    if (searchCompanies) {
      searchCompanies.addEventListener('input', (e) => {
        const activeTab = document.querySelector('.page-header .view-tabs .tab-item.active');
        const view = activeTab ? activeTab.getAttribute('data-view') : 'all';
        renderCompanies(view, e.target.value);
      });
    }

    // Clear filters
    const clearFilters = document.getElementById('clear-company-filters');
    if (clearFilters) {
      clearFilters.addEventListener('click', () => {
        if (searchCompanies) searchCompanies.value = '';
        renderCompanies('all', '');
        document.querySelectorAll('.page-header .view-tabs .tab-item').forEach(t => t.classList.remove('active'));
        document.querySelector('.page-header .view-tabs .tab-item[data-view="all"]')?.classList.add('active');
      });
    }
  }

  // --- 11. CREATE COMPANY DRAWER ---
  const btnCreateCompany = document.getElementById('btn-create-company');
  if (btnCreateCompany) {
    btnCreateCompany.addEventListener('click', () => openDrawer('drawer-create-company'));
    
    document.getElementById('close-create-company')?.addEventListener('click', () => closeDrawer('drawer-create-company'));
    document.getElementById('cancel-create-company')?.addEventListener('click', () => closeDrawer('drawer-create-company'));
  }

  // --- 12. DEALS KANBAN LOGIC ---
  const dealCheckboxes = document.querySelectorAll('.deal-cb');
  if (dealCheckboxes.length > 0) {
    const btnExport = document.getElementById('btn-export');
    const btnDelete = document.getElementById('btn-delete');
    dealCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const anyChecked = Array.from(dealCheckboxes).some(c => c.checked);
        if (btnExport) btnExport.disabled = !anyChecked;
        if (btnDelete) btnDelete.disabled = !anyChecked;
      });
    });
  }

  const btnCreateDealMain = document.getElementById('btn-create-deal-main');
  if (btnCreateDealMain) {
    btnCreateDealMain.addEventListener('click', () => openDrawer('drawer-create-deal-full'));
    document.getElementById('close-deal-drawer')?.addEventListener('click', () => closeDrawer('drawer-create-deal-full'));
    document.getElementById('cancel-deal-drawer')?.addEventListener('click', () => closeDrawer('drawer-create-deal-full'));
  }

  // --- 13. DEAL DETAIL PAGE & EDIT MODE ---
  const btnEnterEdit = document.getElementById('btn-enter-edit');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  const btnSaveEdit = document.getElementById('btn-save-edit');
  
  // URL Binding Logic
  if (window.location.pathname.includes('deal.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const dealId = urlParams.get('id') || mockDeals[0].id;
    if (dealId) {
      const deal = mockDeals.find(d => d.id === dealId);
      if (deal) {
        // Update Title & Badges
        const titleEl = document.querySelector('.profile-card h2');
        if (titleEl) {
           titleEl.innerHTML = `${deal.name} <span class="badge b-purple" style="font-size: 12px; margin-left: 8px; vertical-align: text-bottom;"><i class="ph ph-star"></i> Whale Prospect</span>`;
        }
        
        const infoEl = document.querySelector('.profile-card div');
        if (infoEl) {
           infoEl.textContent = `${deal.id} Â· Sales Pipeline Â· ${deal.stage}`;
        }
        
        // Update Property List
        const stageDisplay = document.getElementById('deal-stage-display');
        if (stageDisplay) {
           stageDisplay.textContent = deal.stage;
        }

        const amountInput = document.getElementById('deal-amount-input');
        const amountDisplay = document.getElementById('deal-amount-display');
        const sourceBadge = document.getElementById('amount-source-badge');
        if (amountInput && amountDisplay) {
           const val = window.parseAmount(deal.amount);
           amountInput.value = val;
           amountDisplay.textContent = window.formatCurrency(deal.amount);
           
           if (deal.amountSource === 'forecast') {
              amountDisplay.classList.remove('editable');
              if (sourceBadge) {
                 sourceBadge.style.display = 'inline-block';
                 sourceBadge.textContent = 'Forecast';
              }
           } else {
              amountDisplay.classList.add('editable');
              if (sourceBadge) sourceBadge.style.display = 'none';
           }
        }

        // Update Timeline
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer) {
          let timelineHtml = `<div class="timeline-month">${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>`;
          
          // Show relevant audit logs for this deal
          const dealLogs = mockAuditLogs.filter(log => log.includes(deal.id)).reverse();
          dealLogs.forEach(log => {
             // log format: [2026-06-22T16:32:00Z] Deal D-123 moved from A to B
             const timeStr = log.split(']')[0].replace('[', '');
             const msg = log.split(']')[1];
             const tObj = new Date(timeStr);
             timelineHtml += `
               <div class="timeline-item">
                 <div class="timeline-icon"><i class="ph ph-arrows-left-right"></i></div>
                 <div class="timeline-content">
                   <div class="timeline-header">
                     <strong>Stage Updated</strong>
                     <span class="timeline-time">${tObj.toLocaleDateString()} ${tObj.toLocaleTimeString()}</span>
                   </div>
                   <div class="timeline-body">${msg}</div>
                 </div>
               </div>
             `;
          });

          // Always add the creation log
          timelineHtml += `
               <div class="timeline-item">
                 <div class="timeline-icon"><i class="ph ph-plus-circle"></i></div>
                 <div class="timeline-content">
                   <div class="timeline-header">
                     <strong>Deal Created</strong>
                     <span class="timeline-time">${deal.closeDate}</span>
                   </div>
                   <div class="timeline-body">
                     Deal was created in Sales Pipeline by ${deal.owner}.
                   </div>
                 </div>
               </div>
          `;
          timelineContainer.innerHTML = timelineHtml;
        }
      }
    }
  }

  if (btnEnterEdit) {
    btnEnterEdit.addEventListener('click', () => {
      document.body.classList.add('is-editing');
    });
  }
  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', () => {
      document.body.classList.remove('is-editing');
    });
  }
  if (btnSaveEdit) {
    btnSaveEdit.addEventListener('click', () => {
      const propItems = document.querySelectorAll('.property-item');
      propItems.forEach(item => {
        const input = item.querySelector('.property-input');
        const valDiv = item.querySelector('.property-value');
        if (input && valDiv) {
          if (input.tagName === 'SELECT') {
            valDiv.textContent = input.options[input.selectedIndex].text;
          } else {
            if (valDiv.textContent.includes('$')) {
               valDiv.textContent = '$' + Number(input.value).toLocaleString();
            } else if (input.type === 'date') {
               const d = new Date(input.value);
               if (!isNaN(d)) valDiv.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            } else {
               valDiv.textContent = input.value;
            }
          }
        }
      });
      document.body.classList.remove('is-editing');
      if (typeof updateNewBidButtonState === 'function') updateNewBidButtonState();
    });
  }

  // --- 13.5 FORECAST REGISTRATION ---
  const btnOpenForecast = document.getElementById('btn-open-forecast');
  const modalForecastOverlay = document.getElementById('modal-forecast-overlay');
  const btnCloseForecastModal = document.getElementById('close-forecast-modal');
  const btnCancelForecast = document.getElementById('btn-cancel-forecast');
  const btnSaveForecast = document.getElementById('btn-save-forecast');
  const btnAddForecastRow = document.getElementById('btn-add-forecast-row');
  const forecastTbody = document.getElementById('forecast-tbody');
  const forecastTotalDisplay = document.getElementById('forecast-total-display');
  const forecastWarningBanner = document.getElementById('forecast-warning-banner');

  const mockCurrentUser = 'Sarah Smith'; // Mock logged-in user

  let currentForecastDealId = null;
  let tempForecasts = [];

  function formatMoneyStr(num) {
    return '$' + num.toLocaleString();
  }

  function calculateTotalForecast() {
    let total = 0;
    const rows = forecastTbody.querySelectorAll('tr');
    tempForecasts = [];
    rows.forEach(row => {
       const monthInput = row.querySelector('.fc-month');
       const amountInput = row.querySelector('.fc-amount');
       const noteInput = row.querySelector('.fc-note');
       if (monthInput && amountInput) {
          const amt = parseInt(amountInput.value, 10) || 0;
          total += amt;
          tempForecasts.push({
             month: monthInput.value,
             amount: amt,
             note: noteInput ? noteInput.value : ''
          });
       }
    });
    
    if (forecastTotalDisplay) forecastTotalDisplay.textContent = formatMoneyStr(total);

    const deal = mockDeals.find(d => d.id === currentForecastDealId);
    if (deal && forecastWarningBanner) {
       const currentVal = window.parseAmount(deal.amount);
       if (total !== currentVal) {
          forecastWarningBanner.style.display = 'block';
       } else {
          forecastWarningBanner.style.display = 'none';
       }
    }
  }

  function addForecastRow(monthVal = '', amountVal = '', noteVal = '', hasEditPermission = true) {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-color)';
    tr.innerHTML = `
      <td style="padding: 8px 12px;"><input type="month" class="property-input fc-month" value="${monthVal}" style="width: 100%;" ${!hasEditPermission ? 'disabled' : ''}></td>
      <td style="padding: 8px 12px;"><input type="number" class="property-input fc-amount" value="${amountVal}" min="0" style="width: 100%;" ${!hasEditPermission ? 'disabled' : ''}></td>
      <td style="padding: 8px 12px;"><input type="text" class="property-input fc-note" value="${noteVal}" placeholder="Optional note" style="width: 100%;" ${!hasEditPermission ? 'disabled' : ''}></td>
      <td style="padding: 8px 12px; text-align: center;">
         ${hasEditPermission ? `<i class="ph ph-trash" style="cursor: pointer; color: #DC2626; font-size: 16px;" onclick="this.closest('tr').remove(); calculateTotalForecast();"></i>` : ''}
      </td>
    `;
    
    tr.querySelectorAll('input').forEach(inp => {
       inp.addEventListener('input', calculateTotalForecast);
    });
    
    if (forecastTbody) forecastTbody.appendChild(tr);
    calculateTotalForecast();
  }

  function openForecastModal() {
    if (!window.location.pathname.includes('deal.html')) return;
    const urlParams = new URLSearchParams(window.location.search);
    currentForecastDealId = urlParams.get('id') || mockDeals[0].id;
    const deal = mockDeals.find(d => d.id === currentForecastDealId);
    
    if (deal && modalForecastOverlay) {
       document.getElementById('forecast-deal-name').textContent = deal.name;
       document.getElementById('forecast-current-amount').textContent = window.formatCurrency(deal.amount);
       
       // Mock Permission Logic (only Deal Owner or Admin can edit)
       // Let's assume on deal.html the owner is 'Alex Sales' and we are 'Sarah Smith', so it's read-only.
       // However if deal.owner == mockCurrentUser, we have permission.
       const hasEditPermission = (deal.owner === mockCurrentUser || deal.owner === 'Alex Sales'); 
       
       if (!hasEditPermission) {
          if (btnAddForecastRow) btnAddForecastRow.style.display = 'none';
          if (btnSaveForecast) btnSaveForecast.style.display = 'none';
          if (btnCancelForecast) btnCancelForecast.textContent = 'Close';
       } else {
          if (btnAddForecastRow) btnAddForecastRow.style.display = 'inline-flex';
          if (btnSaveForecast) btnSaveForecast.style.display = 'inline-flex';
          if (btnCancelForecast) btnCancelForecast.textContent = 'Cancel';
       }

       if (forecastTbody) forecastTbody.innerHTML = '';
       tempForecasts = [];
       
       if (deal.forecasts && deal.forecasts.length > 0) {
          deal.forecasts.forEach(fc => {
             addForecastRow(fc.month, fc.amount, fc.note, hasEditPermission);
          });
       } else {
          // prefill one row with current amount and close date month
          const amtVal = window.parseAmount(deal.amount);
          let monthStr = '';
          if (deal.closeDate) {
             const d = new Date(deal.closeDate);
             if (!isNaN(d)) {
                monthStr = d.toISOString().slice(0, 7); // YYYY-MM
             }
          }
          if (hasEditPermission) {
             addForecastRow(monthStr, amtVal, '', hasEditPermission);
          } else {
             // If no edit permission, don't auto-create rows for an empty forecast
             forecastTbody.innerHTML = '<tr><td colspan="4" style="padding: 16px; text-align: center; color: var(--text-muted);">No forecast data available.</td></tr>';
          }
       }
       
       modalForecastOverlay.style.display = 'flex';
       calculateTotalForecast();
    }
  }

  if (btnOpenForecast) {
    btnOpenForecast.addEventListener('click', openForecastModal);
  }

  if (btnCloseForecastModal) {
    btnCloseForecastModal.addEventListener('click', () => {
      modalForecastOverlay.style.display = 'none';
    });
  }

  if (btnCancelForecast) {
    btnCancelForecast.addEventListener('click', () => {
      // Basic unsaved check mock
      const confirmCancel = confirm("Any unsaved changes will be lost. Cancel?");
      if (confirmCancel) modalForecastOverlay.style.display = 'none';
    });
  }

  if (btnAddForecastRow) {
    btnAddForecastRow.addEventListener('click', () => addForecastRow());
  }

  if (btnSaveForecast) {
    btnSaveForecast.addEventListener('click', () => {
       // Validate duplicate months
       const months = tempForecasts.map(f => f.month).filter(m => m !== '');
       const uniqueMonths = new Set(months);
       if (months.length !== uniqueMonths.size) {
          alert("Forecast month already exists for this Deal. Please consolidate amounts for the same month.");
          return;
       }
       
       // Validate missing months
       if (tempForecasts.some(f => f.month === '')) {
          alert("Please select a Forecast Month for all rows.");
          return;
       }

       // Calculate new total
       const newTotal = tempForecasts.reduce((sum, f) => sum + f.amount, 0);
       const deal = mockDeals.find(d => d.id === currentForecastDealId);
       
       if (deal) {
          const currentVal = window.parseAmount(deal.amount);
          if (newTotal !== currentVal) {
             const proceed = confirm("Deal Amount will be updated to match the Total Forecast Amount. Proceed?");
             if (!proceed) return;
          }
          
          const oldAmount = deal.amount;
          deal.forecasts = [...tempForecasts];
          deal.amount = newTotal;
          deal.amountSource = 'forecast';
          
          mockAuditLogs.push(`[${new Date().toISOString()}] Deal ${deal.id} forecast registered. Amount updated from ${oldAmount} to ${deal.amount}.`);
          
          modalForecastOverlay.style.display = 'none';
          
          // Re-render Deal details
          const amountDisplay = document.getElementById('deal-amount-display');
          const amountInput = document.getElementById('deal-amount-input');
          const sourceBadge = document.getElementById('amount-source-badge');
          if (amountDisplay) {
             amountDisplay.textContent = window.formatCurrency(deal.amount);
             amountDisplay.classList.remove('editable');
             if (amountInput) amountInput.value = newTotal;
             if (sourceBadge) {
                 sourceBadge.style.display = 'inline-block';
                 sourceBadge.textContent = 'Forecast';
             }
          }
          
          // Render new timeline entry manually to avoid complex refactoring
          const timelineContainer = document.querySelector('.timeline-container');
          if (timelineContainer) {
             const tObj = new Date();
             const newTimelineHtml = `
               <div class="timeline-item">
                 <div class="timeline-icon"><i class="ph ph-calendar-plus"></i></div>
                 <div class="timeline-content">
                   <div class="timeline-header">
                     <strong>Forecast Updated</strong>
                     <span class="timeline-time">${tObj.toLocaleDateString()} ${tObj.toLocaleTimeString()}</span>
                   </div>
                   <div class="timeline-body">Forecast registered. Amount updated from ${oldAmount} to ${deal.amount}.</div>
                 </div>
               </div>
             `;
             // Insert after the month header
             timelineContainer.insertAdjacentHTML('afterbegin', newTimelineHtml);
          }
       }
    });
  }

  // --- 14. NEW BID VALIDATION ---
  const btnNewBid = document.getElementById('btn-new-bid');
  const stageDisplay = document.getElementById('deal-stage-display');
  
  function updateNewBidButtonState() {
    if (!btnNewBid) return;

    // We assume the user has permission for this mock. If they didn't, we would add the disabled state here.
    
    const stageText = stageDisplay ? stageDisplay.textContent : '';
    const contactsStrong = document.querySelector('#card-contacts .card-header strong');
    const contactsCount = contactsStrong ? contactsStrong.textContent : '';
    
    // AC says: "khi user hover hoáº·c click nÃºt táº¡o Bid, then há»‡ thá»‘ng hiá»ƒn thá»‹ lÃ½ do cá»¥ thá»ƒ..."
    // We add a click listener below that handles alerts, but we also set title for hover.
    if (!stageText.includes('Solution Design') && !stageText.includes('Discovery')) {
       btnNewBid.classList.remove('btn-disabled');
       btnNewBid.removeAttribute('title');
    } else if (contactsCount.includes('(0)')) {
       // If it is Solution Design, but missing contacts, we show tooltip.
       btnNewBid.title = "Please add Company and Contact before creating Bid.";
    } else {
       btnNewBid.classList.remove('btn-disabled');
       btnNewBid.removeAttribute('title');
    }
  }

  if (btnNewBid) {
    btnNewBid.addEventListener('click', (e) => {
      const stageText = stageDisplay ? stageDisplay.textContent : '';
      if (!stageText.includes('Solution Design') && !stageText.includes('Discovery')) {
        alert(`Bid can only be created in Discovery or Solution Design stage. Current stage: ${stageText}`);
        return;
      }

      const contactsStrong = document.querySelector('#card-contacts .card-header strong');
      const contactsCount = contactsStrong ? contactsStrong.textContent : '';
      if (contactsCount.includes('(0)')) {
        alert("Please add Company and Contact before creating Bid.");
        return;
      }

      alert('Opening Create Bid modal...');
      
      const relatedBidsCard = document.getElementById('card-related-bids');
      if (relatedBidsCard) {
        const headerStrong = relatedBidsCard.querySelector('.card-header strong');
        if (headerStrong) headerStrong.textContent = 'Related bids (1)';
        
        const contentDiv = relatedBidsCard.querySelector('.empty-state');
        if (contentDiv) {
          contentDiv.classList.remove('empty-state');
          contentDiv.innerHTML = `
            <div style="padding: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: none;">
              <div>
                <a href="#" style="color: var(--primary-teal); font-weight: 500; text-decoration: none;">B-26-00123</a>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Platform Implementation</div>
              </div>
              <span style="background: #FEF08A; color: #A16207; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">Discovery</span>
            </div>
          `;
        }
      }
    });
    
    updateNewBidButtonState();
  }

  // MOCK ADD CONTACT TO TEST VALIDATION
  const btnAddContactMock = document.getElementById('btn-add-contact-mock');
  if (btnAddContactMock) {
    btnAddContactMock.addEventListener('click', () => {
      const cardContacts = document.getElementById('card-contacts');
      if (cardContacts) {
        const headerStrong = cardContacts.querySelector('.card-header strong');
        if (headerStrong) headerStrong.textContent = 'Contacts (1)';
        
        const contentDiv = cardContacts.querySelector('.empty-state');
        if (contentDiv) {
           contentDiv.classList.remove('empty-state');
           contentDiv.innerHTML = `
              <div style="padding: 12px;">
                <div style="font-weight: 500;">John Doe</div>
                <div style="font-size: 13px; color: var(--text-muted);">CTO</div>
              </div>
           `;
        }
      }
      updateNewBidButtonState();
    });
  }

  // --- 13. DEALS SYNCHRONIZATION & STATE MANAGEMENT ---
  const btnViewList = document.getElementById('btn-view-list');
  const btnViewKanban = document.getElementById('btn-view-kanban');
  const kanbanBoardView = document.getElementById('kanban-board-view');
  const dealsTableView = document.getElementById('deals-table-view');
  const dealsTbody = document.getElementById('deals-tbody-dynamic');
  const kanbanNoticeBanner = document.getElementById('kanban-notice-banner');
  const dealSearchInput = document.getElementById('deal-search-input');
  const dealsEmptyState = document.getElementById('deals-empty-state');
  const btnClearFilters = document.getElementById('btn-clear-filters');
  const recordCountEl = document.querySelector('.record-count');

  function updateMetricsCards(dealsList) {
    let totalAmt = 0;
    let weightedAmt = 0;
    let openAmt = 0;
    let closedAmt = 0;
    let newAmt = 0;
    let totalAge = 0;
    
    dealsList.forEach(d => {
      const val = window.parseAmount(d.amount);
      totalAmt += val;
      
      // Calculate weighted (mock logic)
      let weight = 0.5;
      if (d.stage.includes('100%')) weight = 1;
      else if (d.stage.includes('90%')) weight = 0.9;
      else if (d.stage.includes('0%') && d.stage.includes('Lost')) weight = 0;
      weightedAmt += (val * weight);
      
      if (!d.stage.includes('Closed') && !d.stage.includes('Lost')) openAmt += val;
      else closedAmt += val;
      
      // Assume all in mock are "new" for this demo
      newAmt += val;
      totalAge += 2; // mock 2 months per deal
    });

    const avgAmt = dealsList.length > 0 ? totalAmt / dealsList.length : 0;
    const avgWeighted = dealsList.length > 0 ? weightedAmt / dealsList.length : 0;
    const avgAge = dealsList.length > 0 ? (totalAge / dealsList.length).toFixed(1) : 0;

    const formatShort = (num) => {
      if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return '$' + Math.round(num / 1000) + 'K';
      return '$' + num;
    };

    if (document.getElementById('metric-total-amount')) document.getElementById('metric-total-amount').textContent = formatShort(totalAmt);
    if (document.getElementById('metric-avg-amount')) document.getElementById('metric-avg-amount').textContent = `Average per deal ${formatShort(avgAmt)}`;
    if (document.getElementById('metric-weighted-amount')) document.getElementById('metric-weighted-amount').textContent = formatShort(weightedAmt);
    if (document.getElementById('metric-avg-weighted')) document.getElementById('metric-avg-weighted').textContent = `Average per deal ${formatShort(avgWeighted)}`;
    if (document.getElementById('metric-open-amount')) document.getElementById('metric-open-amount').textContent = formatShort(openAmt);
    if (document.getElementById('metric-closed-amount')) document.getElementById('metric-closed-amount').textContent = formatShort(closedAmt);
    if (document.getElementById('metric-new-amount')) document.getElementById('metric-new-amount').textContent = formatShort(newAmt);
    if (document.getElementById('metric-avg-age')) document.getElementById('metric-avg-age').textContent = `${avgAge} months`;
  }

  function renderDeals() {
    if (!kanbanBoardView && !dealsTableView) return;

    // Filter by Pipeline first
    let pipelineDeals = mockDeals.filter(d => (d.pipeline || 'Sales Pipeline') === currentPipeline);

    let term = dealSearchInput ? dealSearchInput.value.toLowerCase() : '';
    let filteredDeals = pipelineDeals.filter(d => 
      d.name.toLowerCase().includes(term) ||
      d.id.toLowerCase().includes(term) ||
      d.company.toLowerCase().includes(term) ||
      d.owner.toLowerCase().includes(term)
    );

    if (recordCountEl) {
      recordCountEl.textContent = filteredDeals.length + ' deals';
    }
    
    updateMetricsCards(filteredDeals);

    const dealPipelineSelect = document.getElementById('deal-pipeline-select');
    if (dealPipelineSelect && dealPipelineSelect.value !== currentPipeline) {
      dealPipelineSelect.value = currentPipeline;
    }

    if (filteredDeals.length === 0) {
      if (dealsEmptyState) dealsEmptyState.style.display = 'flex';
      if (kanbanBoardView) kanbanBoardView.style.setProperty('display', 'none', 'important');
      if (dealsTableView) dealsTableView.style.display = 'none';
    } else {
      if (dealsEmptyState) dealsEmptyState.style.display = 'none';
      if (btnViewKanban && btnViewKanban.classList.contains('active')) {
        if (kanbanBoardView) kanbanBoardView.style.setProperty('display', 'flex', 'important');
        if (dealsTableView) dealsTableView.style.display = 'none';
      }
      if (btnViewList && btnViewList.classList.contains('active')) {
        if (dealsTableView) dealsTableView.style.display = 'block';
        if (kanbanBoardView) kanbanBoardView.style.setProperty('display', 'none', 'important');
      }
    }

    // Render Kanban
    if (kanbanBoardView) {
      kanbanBoardView.innerHTML = '';
      const stagesToRender = currentPipeline === 'Outbound Target Account' ? outboundPipelineStages : salesPipelineStages;
      
      stagesToRender.forEach(stage => {
        const stageDeals = filteredDeals.filter(d => d.stage === stage);
        const colId = stage.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
        
        // Generate header text
        let headerText = stage.toUpperCase();
        let badgeHtml = '';
        if (stage.includes('Synced')) {
           headerText = stage.replace(' (SYNCED)', '...').toUpperCase();
           badgeHtml = `<span class="badge-lock"><i class="ph ph-lock"></i> BID SYNC</span>`;
        }
        
        let colHtml = `
        <div class="kanban-col" data-stage="${stage}">
          <div class="kanban-col-header">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${headerText}</span>
            <div class="col-badges">
              ${badgeHtml}
              <span class="col-count" id="count-${colId}">${stageDeals.length}</span>
              <i class="ph ph-caret-right"></i>
            </div>
          </div>
          <div class="kanban-cards" data-stage="${stage}">
        `;
        
        stageDeals.forEach(d => {
          let badgesHtml = (d.badges || []).map(b => `<span class="badge b-grey">${b}</span>`).join('');
          let compData = null;
          if (d.companyId) {
             compData = window.calculateCompanyIntelligence(d.companyId);
          } else if (d.company) {
             const cMatch = window.mockCompanies.find(c => c.name === d.company);
             if (cMatch) compData = window.calculateCompanyIntelligence(cMatch.id);
          }
          if (compData) {
             if (compData.pursueRecommendation !== 'Pursue') {
                 badgesHtml += `<span title="${compData.pursueRecommendation}" style="color: #EF4444; font-size: 14px; margin-left: 4px; vertical-align: middle;"><i class="ph-fill ph-warning-circle"></i></span>`;
             }
             if (compData.potentialTag && compData.potentialTag !== 'None') {
                badgesHtml += `<span class="badge" style="background: #FEF3C7; color: #D97706; font-size: 10px; margin-left: 4px;">${compData.potentialTag}</span>`;
             }
             if (compData.health && compData.health.relationshipHealth) {
                let bg = '#F3F4F6', col = '#4B5563';
                if (compData.health.relationshipHealth === 'Red' || compData.health.relationshipHealth === 'Critical') { bg = '#FEE2E2'; col = '#EF4444'; }
                else if (compData.health.relationshipHealth === 'Yellow') { bg = '#FEF3C7'; col = '#D97706'; }
                else if (compData.health.relationshipHealth === 'Green') { bg = '#D1FAE5'; col = '#10B981'; }
                badgesHtml += `<span class="badge" style="background: ${bg}; color: ${col}; font-size: 10px; margin-left: 4px;" title="${compData.health.reason || ''}">${compData.health.relationshipHealth}</span>`;
             }
          }
          colHtml += `
            <div class="deal-card visual-card" draggable="true" data-id="${d.id}">
              <div class="card-top">
                <a href="deal.html?id=${d.id}" class="card-title">${d.id} - ${d.name}</a>
                <input type="checkbox" class="deal-cb">
              </div>
              <div class="card-date">Close date: ${d.closeDate}</div>
              <div class="card-badges">${badgesHtml}</div>
              <div class="card-footer">
                <div class="card-company">
                  <div class="company-avatar">${d.avatar || d.company.charAt(0)}</div> ${d.company}
                </div>
                <div class="card-actions">
                  <i class="ph ph-envelope-simple"></i>
                  <i class="ph ph-file-text"></i>
                  <i class="ph ph-floppy-disk"></i>
                </div>
              </div>
            </div>
          `;
        });
        
        colHtml += `</div></div>`;
        kanbanBoardView.innerHTML += colHtml;
      });
      setupDragAndDrop();
    }

    // Render List
    if (dealsTbody) {
      dealsTbody.innerHTML = '';
      filteredDeals.forEach(d => {
        let trHtml = `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px;"><input type="checkbox"></td>
            <td style="padding: 12px;">${d.id}</td>
            <td style="padding: 12px;"><a href="deal.html?id=${d.id}" style="color: var(--primary-teal); text-decoration: none; font-weight: 500;">${d.name}</a></td>
            <td style="padding: 12px;"><span style="background: #F1F5F9; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">${d.stage}</span></td>
            <td style="padding: 12px;">${window.formatCurrency(d.amount)}</td>
            <td style="padding: 12px;">${d.closeDate}</td>
            <td style="padding: 12px;"><a href="company.html" style="color: var(--primary-teal); text-decoration: none;">${d.company}</a></td>
            <td style="padding: 12px;"><a href="contact.html" style="color: var(--primary-teal); text-decoration: none;">Contact</a></td>
            <td style="padding: 12px;">${d.owner}</td>
            <td style="padding: 12px;">01/01/2026</td>
            <td style="padding: 12px;">01/01/2026</td>
          </tr>
        `;
        dealsTbody.innerHTML += trHtml;
      });
    }
  }

  function setupDragAndDrop() {
    const cards = document.querySelectorAll('.deal-card[draggable="true"]');
    const cols = document.querySelectorAll('.kanban-cards');

    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });
    });

    cols.forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-over');
      });
      col.addEventListener('dragleave', () => {
        col.classList.remove('drag-over');
      });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        const dealId = e.dataTransfer.getData('text/plain');
        const newStage = col.getAttribute('data-stage');
        
        if (newStage.includes('Synced')) {
           alert("This stage is synced from Bid status. You cannot manually move deals here.");
           return;
        }

        if (newStage.includes('Discovery')) {
           const overlay = document.getElementById('discovery-modal-overlay');
           const modal = document.getElementById('discovery-modal');
           if(overlay && modal) {
             overlay.style.display='block';
             modal.style.display='block';
           }
           return;
        }

        const deal = mockDeals.find(d => d.id === dealId);
        if (deal && deal.stage !== newStage) {
           mockAuditLogs.push(`[${new Date().toISOString()}] Deal ${deal.id} moved from ${deal.stage} to ${newStage}`);
           deal.stage = newStage;
           renderDeals();
        }
      });
    });
  }

  if (btnViewList && btnViewKanban) {
    btnViewList.addEventListener('click', () => {
      btnViewList.classList.add('active');
      btnViewKanban.classList.remove('active');
      renderDeals();
    });

    btnViewKanban.addEventListener('click', () => {
      btnViewKanban.classList.add('active');
      btnViewList.classList.remove('active');
      renderDeals();
    });
  }

  if (dealSearchInput) {
    dealSearchInput.addEventListener('input', renderDeals);
  }

  if (btnClearFilters) {
    btnClearFilters.addEventListener('click', () => {
      if (dealSearchInput) {
        dealSearchInput.value = '';
        renderDeals();
      }
    });
  }

  // Pipeline Filter Dropdown Listener
  const dealPipelineSelect = document.getElementById('deal-pipeline-select');
  if (dealPipelineSelect) {
    dealPipelineSelect.addEventListener('change', (e) => {
      currentPipeline = e.target.value;
      sessionStorage.setItem('selectedPipeline', currentPipeline);
      renderDeals();
    });
  }

  // Create Deal Full Drawer Logic
  const createDealPipeline = document.getElementById('create-deal-pipeline');
  const createDealStage = document.getElementById('create-deal-stage');
  const submitCreateDealFull = document.getElementById('submit-create-deal-full');
  
  function populateCreateDealStages(pipeline) {
    if (!createDealStage) return;
    createDealStage.innerHTML = '';
    const stages = pipeline === 'Outbound Target Account' ? outboundPipelineStages : salesPipelineStages;
    stages.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      createDealStage.appendChild(opt);
    });
  }

  if (createDealPipeline) {
    createDealPipeline.addEventListener('change', (e) => {
      populateCreateDealStages(e.target.value);
    });
  }
  
  if (btnCreateDealMain) {
    btnCreateDealMain.addEventListener('click', () => {
      if (createDealPipeline) {
        createDealPipeline.value = currentPipeline;
        populateCreateDealStages(currentPipeline);
      }
    });
  }

  if (submitCreateDealFull) {
    submitCreateDealFull.addEventListener('click', () => {
      // Validate Required Fields
      const reqIds = ['create-deal-name', 'create-deal-pipeline', 'create-deal-stage', 'create-deal-currency', 'create-deal-segmentation', 'create-deal-closedate', 'create-deal-owner', 'create-deal-serviceprovider', 'create-deal-country', 'create-deal-leadsource', 'create-deal-type', 'create-deal-projecttype', 'create-deal-tcrequired', 'create-deal-deliveryunit'];
      let isValid = true;
      reqIds.forEach(id => {
        const el = document.getElementById(id);
        const group = document.getElementById('group-' + id);
        if (el && el.value.trim() === '') {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else {
          if (group) group.classList.remove('has-error');
        }
      });
      
      if (!isValid) {
        alert('Please fill in all required fields.');
        return;
      }
      
      alert('Deal created!');
      document.getElementById('close-deal-drawer')?.click();
    });
  }

  // Initial render
  if (kanbanBoardView || dealsTableView) {
     renderDeals();
  }

  // --- 11. BIDDING MODULE ---


  const getBidStatusClass = (status) => {
    switch(status) {
      case 'Discovery': return 'bid-review';
      case 'Solution Design': return 'bid-review';
      case 'Draft Proposal': return 'bid-draft';
      case 'Proposal Presented': return 'bid-presented';
      case 'Done': return 'bid-done';
      case 'Bid Win': return 'bid-win';
      case 'Bid Lost': return 'bid-lost';
      default: return 'bid-review';
    }
  };

  const bidTbody = document.getElementById('bidding-tbody');
  const bidSearch = document.getElementById('search-bids');
  const bidKanbanCols = document.querySelectorAll('#bidding-board-view .kanban-col-body');
  
  function renderBids() {
    if (!bidTbody && bidKanbanCols.length === 0) return;
    
    const query = bidSearch ? bidSearch.value.toLowerCase() : '';
    let filtered = mockBids.filter(b => 
      b.id.toLowerCase().includes(query) || 
      b.client.toLowerCase().includes(query) || 
      b.opp.toLowerCase().includes(query)
    );

    // Table
    if (bidTbody) {
      bidTbody.innerHTML = '';
      filtered.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="checkbox" class="bid-cb"></td>
          <td><a href="bid_detail.html" style="font-weight: 500;">${b.id}</a></td>
          <td>${b.client}</td>
          <td>${b.opp}</td>
          <td><span class="badge ${getBidStatusClass(b.status)}">${b.status}</span></td>
          <td style="font-weight: 600;">${b.val}</td>
          <td>${b.deadline}</td>
          <td>${b.owner}</td>
          <td><a href="deal.html">${b.deal}</a></td>
        `;
        bidTbody.appendChild(tr);
      });
      
      const emptyState = document.getElementById('bid-table-empty');
      if (filtered.length === 0) {
        if(emptyState) emptyState.classList.remove('hidden');
        bidTbody.parentElement.style.display = 'none';
      } else {
        if(emptyState) emptyState.classList.add('hidden');
        bidTbody.parentElement.style.display = 'table';
      }
    }

    // Kanban
    if (bidKanbanCols.length > 0) {
      bidKanbanCols.forEach(col => col.innerHTML = '');
      filtered.forEach(b => {
        const col = document.querySelector(`#bidding-board-view .kanban-col-body[data-stage="${b.status}"]`);
        if (col) {
          const card = document.createElement('div');
          card.className = 'deal-card visual-card';
          card.innerHTML = `
            <div class="card-top">
              <a href="bid_detail.html" class="card-title">${b.id}</a>
              <input type="checkbox" class="deal-cb">
            </div>
            <div class="card-date">Deadline: ${b.deadline}</div>
            <div class="card-badges">
              <span class="badge ${getBidStatusClass(b.status)}" style="border-radius: 12px; padding: 2px 8px; font-size: 11px;">${b.status}</span>
            </div>
            <div style="font-weight: 600; font-size: 14px; margin: 8px 12px 0;">${b.val}</div>
            <div class="card-footer" style="margin-top: 8px;">
              <div class="card-company">
                <div class="company-avatar" style="visibility:hidden; width:0; margin:0"></div> <i class="ph ph-buildings" style="margin-right: 4px;"></i> ${b.client}
              </div>
              <div class="card-actions">
                <i class="ph ph-file-text" style="cursor: pointer;"></i>
                <i class="ph ph-link" style="cursor: pointer;"></i>
              </div>
            </div>
          `;
          col.appendChild(card);
        }
      });
      document.querySelectorAll('#bidding-board-view .kanban-col').forEach(col => {
        const stage = col.querySelector('.kanban-col-body').getAttribute('data-stage');
        const count = filtered.filter(b => b.status === stage).length;
        col.querySelector('.col-count').textContent = count;
      });
    }
    
    const countEl = document.getElementById('total-bids');
    if (countEl) countEl.textContent = `${filtered.length} bids`;
  }

  if (bidTbody || bidKanbanCols.length > 0) {
    renderBids();
    if (bidSearch) bidSearch.addEventListener('input', renderBids);
  }

  const bidViewToggleBtns = document.querySelectorAll('#bid-view-toggle .btn-toggle');
  bidViewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bidViewToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-view');
      if (view === 'table') {
        document.getElementById('bidding-table-view').classList.remove('hidden');
        document.getElementById('bidding-table-view').classList.add('active');
        document.getElementById('bidding-board-view').classList.remove('active');
        document.getElementById('bidding-board-view').classList.add('hidden');
      } else {
        document.getElementById('bidding-board-view').classList.remove('hidden');
        document.getElementById('bidding-board-view').classList.add('active');
        document.getElementById('bidding-table-view').classList.remove('active');
        document.getElementById('bidding-table-view').classList.add('hidden');
      }
    });
  });

  const btnCreateBidMain = document.getElementById('btn-create-bid-main');
  const modalCreateBid = document.getElementById('modal-create-bid');
  const closeCreateBid = document.getElementById('close-modal-create-bid');
  const cancelCreateBid = document.getElementById('cancel-modal-create-bid');
  const submitCreateBid = document.getElementById('submit-create-bid');
  const createBidDealSelect = document.getElementById('create-bid-deal');

  function openCenterModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.add('open');
    if(overlay) overlay.style.display = 'block';
  }
  function closeCenterModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.remove('open');
    if(overlay) overlay.style.display = 'none';
  }

  if (btnCreateBidMain) btnCreateBidMain.addEventListener('click', () => openCenterModal('modal-create-bid'));
  if (closeCreateBid) closeCreateBid.addEventListener('click', () => closeCenterModal('modal-create-bid'));
  if (cancelCreateBid) cancelCreateBid.addEventListener('click', () => closeCenterModal('modal-create-bid'));
  
  if (submitCreateBid && createBidDealSelect) {
    submitCreateBid.addEventListener('click', () => {
      if(createBidDealSelect.value === "") {
        alert('Please select a deal.');
        return;
      }
      const selected = createBidDealSelect.options[createBidDealSelect.selectedIndex].text;
      if (!selected.includes('Solution Design') && !selected.includes('Discovery')) {
        alert('Bid can only be created in Discovery or Solution Design stage. Current stage is not valid.');
        return;
      }
      alert('Bid created successfully! Notifications sent to Bidding Manager.');
      closeCenterModal('modal-create-bid');
    });
  }

  const bidTabs = document.querySelectorAll('#bid-tabs .detail-tab');
  
  // Mock permission system
  const currentUserRole = 'Bid Manager'; // or 'Viewer'
  const tabPermissions = {
    'overview': ['Viewer', 'Bid Manager', 'Sales', 'Delivery', 'TC'],
    'deliverables': ['Viewer', 'Bid Manager', 'Sales', 'Delivery', 'TC'],
    'discussion': ['Viewer', 'Bid Manager', 'Sales', 'Delivery', 'TC'],
    'teamAccess': ['Bid Manager', 'Sales'] // Restrict Team & Access to Managers and Sales
  };

  const hasPermission = (key) => {
    return tabPermissions[key] ? tabPermissions[key].includes(currentUserRole) : true;
  };

  // Initialize tabs and disabled states
  bidTabs.forEach(tab => {
    const key = tab.getAttribute('data-key');
    if (!hasPermission(key)) {
      tab.classList.add('disabled');
      tab.style.opacity = '0.5';
      tab.style.cursor = 'not-allowed';
      tab.setAttribute('title', 'You do not have permission to access this tab.');
    }

    tab.addEventListener('click', () => {
      if (!hasPermission(key)) return;

      bidTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetId = key;
      const target = document.getElementById(targetId);
      
      document.querySelectorAll('.bid-col-mid .tab-content').forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none'; // Fallback in case CSS active class fails
      });
      
      if(target) {
        target.classList.add('active');
        target.style.display = 'block';
      } else {
        console.warn('[SalesHub] Tab content not found for key:', targetId);
      }
    });
  });

  const btnEditBid = document.getElementById('btn-edit-bid');
  const editFooter = document.getElementById('edit-footer');
  const btnCancelEditBid = document.getElementById('btn-cancel-edit');
  const btnSaveEditBid = document.getElementById('btn-save-edit');
  
  if (btnEditBid && editFooter) {
    btnEditBid.addEventListener('click', () => {
      document.querySelectorAll('.request-field-view').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.request-field-edit').forEach(el => el.classList.remove('hidden'));
      editFooter.classList.add('show');
    });
    
    const exitEditMode = () => {
      document.querySelectorAll('.request-field-view').forEach(el => el.classList.remove('hidden'));
      document.querySelectorAll('.request-field-edit').forEach(el => el.classList.add('hidden'));
      editFooter.classList.remove('show');
    };

    if(btnCancelEditBid) btnCancelEditBid.addEventListener('click', exitEditMode);
    if(btnSaveEditBid) btnSaveEditBid.addEventListener('click', () => {
      alert('Changes saved successfully.');
      exitEditMode();
    });
  }

  const btnAddDeliverable = document.getElementById('btn-add-deliverable');
  if (btnAddDeliverable) {
    btnAddDeliverable.style.display = 'none'; // Ensure it's hidden if not removed from HTML yet
  }

  // --- Deliverables Versioning Logic ---
  const deliverablesList = document.getElementById('deliverables-list');
  const kpiTotal = document.getElementById('kpi-deliv-total');
  const kpiSubmitted = document.getElementById('kpi-deliv-submitted');
  const kpiPending = document.getElementById('kpi-deliv-pending');
  const kpiOverdue = document.getElementById('kpi-deliv-overdue');
  
  const uploadModal = document.getElementById('modal-upload-version');
  const uploadClose = document.getElementById('close-modal-upload-version');
  const uploadCancel = document.getElementById('cancel-upload-version');
  const uploadSubmit = document.getElementById('submit-upload-version');
  const uploadTarget = document.getElementById('upload-target-deliverable-id');
  const uploadFileInput = document.getElementById('upload-file-input');
  const uploadNoteInput = document.getElementById('upload-note-input');

  const historyModal = document.getElementById('modal-version-history');
  const historyClose = document.getElementById('close-modal-version-history');
  const historyCancel = document.getElementById('cancel-version-history');
  const historyTbody = document.getElementById('version-history-tbody');

  const updateDeliverableKPIs = () => {
    if (!kpiTotal) return;
    
    const oppTypeEl = document.getElementById('val-opp-type');
    const oppType = oppTypeEl ? oppTypeEl.innerText.trim().toLowerCase() : '';
    const strategicReview = window.mockDeliverables.find(d => d.id === 'group-strategic');
    if (strategicReview) {
      if (['ai transformation program', 'enterprise modernization', 'large digital transformation', 'rfp requiring new offering'].includes(oppType)) {
        strategicReview.isRequired = true;
      } else {
        strategicReview.isRequired = false;
        strategicReview.status = "Not Required";
      }
    }

    let requiredDocs = 0;
    let completed = 0;
    let pending = 0;
    let overdue = 0;
    const now = new Date('2023-10-26');

    window.mockDeliverables.forEach(d => {
      if (d.isRequired) {
        requiredDocs++;
        if (d.versions && d.versions.length > 0) {
          completed++;
          d.status = "Submitted";
        } else {
          const deadline = new Date(d.deadline);
          if (deadline < now) {
            overdue++;
            d.status = "Overdue";
          } else {
            pending++;
            d.status = "Missing";
          }
        }
      } else {
        if (d.versions && d.versions.length > 0) {
          d.status = "Submitted";
        } else if (d.id !== 'group-strategic') {
          d.status = "Missing";
        }
      }
    });

    kpiTotal.innerText = requiredDocs;
    kpiSubmitted.innerText = completed;
    kpiPending.innerText = pending;
    kpiOverdue.innerText = overdue;
  };

  const getFileIcon = (fileName) => {
    if (fileName.includes('.doc')) return '<i class="ph ph-file-doc" style="font-size: 20px; color: #3498DB;"></i>';
    if (fileName.includes('.xls')) return '<i class="ph ph-file-xls" style="font-size: 20px; color: #27AE60;"></i>';
    if (fileName.includes('.ppt')) return '<i class="ph ph-file-ppt" style="font-size: 20px; color: #E67E22;"></i>';
    if (fileName.includes('.pdf')) return '<i class="ph ph-file-pdf" style="font-size: 20px; color: #E74C3C;"></i>';
    return '<i class="ph ph-file" style="font-size: 20px; color: #95A5A6;"></i>';
  };

  const renderDeliverables = () => {
    if (!deliverablesList) return;
    updateDeliverableKPIs();
    deliverablesList.innerHTML = '';
    
    // Simulate user role - Assuming "Sales Owner" for now so we can see the Price group.
    // If you want to simulate "Delivery" to see the block, change this to 'Delivery'.
    const currentUserRole = 'Sales Owner'; 

    window.mockDeliverables.forEach((d, index) => {
      let statusHtml = '';
      let fileBlockHtml = '';
      
      let badgeColor = '';
      let badgeBg = '';
      let badgeBorder = '';
      if (d.status === 'Submitted') { badgeColor = '#27AE60'; badgeBg = '#E8F5E9'; badgeBorder = '#C8E6C9'; }
      else if (d.status === 'Overdue') { badgeColor = '#C0392B'; badgeBg = '#FFEBEE'; badgeBorder = '#FFCDD2'; }
      else if (d.status === 'Missing' || d.status === 'In Progress') { badgeColor = '#E67E22'; badgeBg = '#FFF3E0'; badgeBorder = '#FFE0B2'; }
      else { badgeColor = '#7F8C8D'; badgeBg = '#F2F4F4'; badgeBorder = '#D5D8DC'; } // Not Required
      
      statusHtml = `<span class="badge" style="background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder}; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${d.status}</span>`;

      const isRestrictedForUser = d.isRestricted && !['Sales Owner', 'Sales Manager', 'COO', 'Admin', 'Sales'].includes(currentUserRole);

      if (isRestrictedForUser) {
        fileBlockHtml = `
          <div style="background: #FFF0F2; border: 1px dashed #FFA8B4; padding: 16px; border-radius: 6px; color: #E11D48; font-size: 13px; display: flex; align-items: center; gap: 8px;">
            <i class="ph ph-lock-key" style="font-size: 18px;"></i>
            Restricted Document â€” You do not have permission to view pricing documents.
          </div>
        `;
      } else {
        if (d.versions && d.versions.length > 0) {
          const latest = d.versions.find(v => v.isLatest) || d.versions[d.versions.length - 1];
          fileBlockHtml = `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; padding: 12px; border-radius: 6px; border: 1px solid var(--border-color);">
              <div style="display: flex; gap: 12px; align-items: center; flex: 1;">
                ${getFileIcon(latest.fileName)}
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 13px; color: var(--primary-teal); font-weight: 600;">${latest.fileName}</span>
                    <span style="font-size: 10px; background: var(--primary-teal); color: #FFF; padding: 2px 6px; border-radius: 10px;">Latest (${latest.versionNumber})</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Uploaded by ${latest.uploadedBy} on ${latest.uploadedDate}</div>
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;"><i class="ph ph-eye"></i> Preview</button>
                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;"><i class="ph ph-download-simple"></i> Download</button>
              </div>
            </div>
          `;
        } else {
          if (d.status === 'Overdue') {
            fileBlockHtml = `<div style="font-size: 12px; color: #C0392B; display: flex; align-items: center; gap: 4px; padding: 8px 0;"><i class="ph ph-warning-circle"></i> This request is overdue - no file yet</div>`;
          } else if (d.status === 'Not Required') {
            fileBlockHtml = `<div style="font-size: 12px; color: var(--text-muted); padding: 8px 0;">This deliverable is not required for this opportunity type.</div>`;
          } else {
            fileBlockHtml = `<div style="font-size: 12px; color: var(--text-muted); padding: 8px 0;">No file uploaded yet.</div>`;
          }
        }
      }

      let checklistHtml = '';
      if (d.subItems && d.subItems.length > 0) {
        checklistHtml = `<div style="margin: 12px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">`;
        d.subItems.forEach(item => {
          const icon = item.checked ? '<i class="ph-fill ph-check-square" style="color: #27AE60; font-size: 16px;"></i>' : '<i class="ph ph-square" style="color: #94A3B8; font-size: 16px;"></i>';
          checklistHtml += `<div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-dark);">${icon} ${item.name}</div>`;
        });
        checklistHtml += `</div>`;
      }

      let actionsHtml = '';
      if (!isRestrictedForUser && d.status !== 'Not Required') {
         actionsHtml = `
          <div style="display: flex; gap: 12px; align-items: center; margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 16px;">
            <button class="btn btn-primary btn-upload-version" data-id="${d.id}" style="padding: 6px 12px; font-size: 12px;"><i class="ph ph-upload-simple"></i> Upload File</button>
            <button class="btn btn-secondary btn-view-history" data-id="${d.id}" style="padding: 6px 12px; font-size: 12px;">
              <i class="ph ph-clock-counter-clockwise"></i> View Versions (${d.versions ? d.versions.length : 0})
            </button>
          </div>
         `;
      }

      const reqLabel = d.isRequired ? '<span style="color: #E11D48; font-size: 12px; font-weight: 700; margin-left: 8px;">*REQUIRED</span>' : '';

      deliverablesList.innerHTML += `
        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; background: #FFF;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: var(--text-dark);">${index + 1}. ${d.name} ${reqLabel}</div>
              <div style="font-size: 12px; color: var(--text-muted);">Owner: <span style="color: var(--text-dark);">${d.assignee}</span> &middot; Deadline: ${d.deadline}</div>
            </div>
            ${statusHtml}
          </div>
          ${checklistHtml}
          ${fileBlockHtml}
          ${actionsHtml}
        </div>
      `;
    });

    document.querySelectorAll('.btn-upload-version').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if(uploadTarget) uploadTarget.value = id;
        if(uploadFileInput) uploadFileInput.value = '';
        if(uploadNoteInput) uploadNoteInput.value = '';
        openCenterModal('modal-upload-version');
      });
    });

    document.querySelectorAll('.btn-view-history').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const d = window.mockDeliverables.find(x => x.id === id);
        
        if(historyTbody) {
          historyTbody.innerHTML = '';
          if (!d.versions || d.versions.length === 0) {
            historyTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">No versions uploaded yet.</td></tr>`;
          } else {
            const sorted = [...d.versions].reverse();
            sorted.forEach(v => {
              const isLatestBadge = v.isLatest ? `<span style="font-size: 10px; background: var(--primary-teal); color: #FFF; padding: 2px 6px; border-radius: 10px; margin-left: 8px;">Latest</span>` : '';
              historyTbody.innerHTML += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 12px; font-weight: 500;">${v.versionNumber}</td>
                  <td style="padding: 12px; color: var(--primary-teal); font-weight: 500;">${v.fileName} ${isLatestBadge}</td>
                  <td style="padding: 12px;">${v.uploadedBy}</td>
                  <td style="padding: 12px;">${v.uploadedDate}</td>
                  <td style="padding: 12px; font-size: 11px;">${v.note || '--'}</td>
                  <td style="padding: 12px; text-align: right;">
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;"><i class="ph ph-eye"></i></button>
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;"><i class="ph ph-download-simple"></i></button>
                  </td>
                </tr>
              `;
            });
          }
          openCenterModal('modal-version-history');
        }
      });
    });
  };

  if(uploadClose) uploadClose.addEventListener('click', () => closeCenterModal('modal-upload-version'));
  if(uploadCancel) uploadCancel.addEventListener('click', () => closeCenterModal('modal-upload-version'));
  if(uploadSubmit) uploadSubmit.addEventListener('click', () => {
    const id = uploadTarget.value;
    const file = uploadFileInput.files[0];
    if(!file) {
      alert("Please select a file.");
      return;
    }
    const d = window.mockDeliverables.find(x => x.id === id);
    if(d) {
      d.versions.forEach(v => v.isLatest = false);
      const nextVer = `V${d.versions.length + 1}`;
      d.versions.push({
        versionNumber: nextVer,
        fileName: file.name,
        uploadedBy: "Current User",
        uploadedDate: new Date().toISOString().split('T')[0],
        note: uploadNoteInput.value,
        isLatest: true
      });
      mockAuditLogs.push(`[${new Date().toISOString()}] New version ${nextVer} uploaded for ${d.name}`);
      
      // Mock notification
      alert(`Notification sent to Bid Manager and Assignee: New file "${file.name}" uploaded for "${d.name}"`);
      
      closeCenterModal('modal-upload-version');
      renderDeliverables();
    }
  });

  if(historyClose) historyClose.addEventListener('click', () => closeCenterModal('modal-version-history'));
  if(historyCancel) historyCancel.addEventListener('click', () => closeCenterModal('modal-version-history'));

  // Initial render
  renderDeliverables();

  // --- Workspace Members Logic ---
  const btnAddMember = document.getElementById('btn-add-member');
  const closeAddMember = document.getElementById('close-modal-add-member');
  const cancelAddMember = document.getElementById('cancel-add-member');
  const submitAddMember = document.getElementById('submit-add-member');
  const membersTbody = document.getElementById('workspace-members-tbody');
  const membersEmpty = document.getElementById('workspace-members-empty');

  const renderWorkspaceMembers = () => {
    if (!membersTbody || !membersEmpty) return;
    membersTbody.innerHTML = '';
    if (window.mockWorkspaceMembers.length === 0) {
      membersEmpty.style.display = 'block';
      membersTbody.style.display = 'none';
    } else {
      membersEmpty.style.display = 'none';
      membersTbody.style.display = 'table-row-group';
      window.mockWorkspaceMembers.forEach((m, idx) => {
        membersTbody.innerHTML += `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px; color: var(--primary-teal); font-weight: 500;">${m.name}</td>
            <td style="padding: 12px;">${m.department}</td>
            <td style="padding: 12px;">${m.role}</td>
            <td style="padding: 12px; font-size: 11px;">${m.permission}</td>
            <td style="padding: 12px;">${m.assignedBy}</td>
            <td style="padding: 12px; text-align: right;">
              <button class="btn btn-secondary btn-remove-member" data-index="${idx}" style="padding: 4px 8px; font-size: 11px; color: #DC2626; border-color: #FCA5A5;">Remove</button>
            </td>
          </tr>
        `;
      });
      document.querySelectorAll('.btn-remove-member').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          const removed = window.mockWorkspaceMembers.splice(index, 1)[0];
          mockAuditLogs.push(`[${new Date().toISOString()}] Workspace member removed: ${removed.name}`);
          renderWorkspaceMembers();
        });
      });
    }
  };

  if (btnAddMember) btnAddMember.addEventListener('click', () => openCenterModal('modal-add-member'));
  if (closeAddMember) closeAddMember.addEventListener('click', () => closeCenterModal('modal-add-member'));
  if (cancelAddMember) cancelAddMember.addEventListener('click', () => closeCenterModal('modal-add-member'));
  if (submitAddMember) submitAddMember.addEventListener('click', () => {
    const nameInput = document.getElementById('member-name-input');
    const deptInput = document.getElementById('member-dept-input');
    const roleInput = document.getElementById('member-role-input');
    const permInput = document.getElementById('member-perm-input');
    
    if (!nameInput.value) {
      alert('Please select a member.');
      return;
    }
    
    window.mockWorkspaceMembers.push({
      name: nameInput.value,
      department: deptInput.value,
      role: roleInput.value,
      permission: permInput.value,
      assignedBy: "Bid Manager"
    });
    mockAuditLogs.push(`[${new Date().toISOString()}] Workspace member added: ${nameInput.value} (${roleInput.value})`);
    
    nameInput.value = "";
    deptInput.value = "TC";
    roleInput.value = "Estimator";
    permInput.value = "View / Comment / Upload / Update Task";
    
    closeCenterModal('modal-add-member');
    renderWorkspaceMembers();
  });
  
  renderWorkspaceMembers();

  // --- Account Intelligence Logic ---
  const aiRevInput = document.getElementById('ai-customer-revenue');
  const aiItProfile = document.getElementById('ai-it-profile');
  const aiOutsourceable = document.getElementById('ai-outsourceable');
  const aiCapRate = document.getElementById('ai-capture-rate');
  const calcItBudget = document.getElementById('calc-it-budget');
  const calcOutsource = document.getElementById('calc-outsourceable');
  const calcAddr = document.getElementById('calc-addressable');
  const sizeTierBadge = document.getElementById('customer-size-tier');

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const calcWalletMath = () => {
    if (!aiRevInput) return;
    const rev = parseFloat(aiRevInput.value) || 0;
    const itPct = 0.05; // Hardcoded to 5%
    const outPct = parseFloat(aiOutsourceable.value) / 100 || 0;
    const capPct = parseFloat(aiCapRate.value) / 100 || 0;

    const itBudget = rev * itPct;
    const outsourceable = itBudget * outPct;
    const addressable = outsourceable * capPct;

    calcItBudget.textContent = formatCurrency(itBudget);
    calcOutsource.textContent = formatCurrency(outsourceable);
    calcAddr.textContent = formatCurrency(addressable);

    // Update visual funnel widths
    const outsourceBar = calcOutsource.closest('.ai-wallet-bar.outsource');
    const addressableBar = calcAddr.closest('.ai-wallet-bar.addressable');
    
    if (outsourceBar && addressableBar) {
      const outWidth = itBudget > 0 ? (outsourceable / itBudget) * 100 : 0;
      outsourceBar.style.setProperty('--bar-width', `${Math.min(100, Math.max(5, outWidth))}%`);
      const addrWidth = itBudget > 0 ? (addressable / itBudget) * 100 : 0;
      addressableBar.style.setProperty('--bar-width', `${Math.min(100, Math.max(5, addrWidth))}%`);
    }

    // Value Tier
    let tier = 'N/A';
    if (addressable >= 5000000) { tier = 'Apex'; sizeTierBadge.className = 'badge b-purple'; }
    else if (addressable >= 1000000) { tier = 'Mega'; sizeTierBadge.className = 'badge b-blue'; }
    else if (addressable >= 100000) { tier = 'Growth'; sizeTierBadge.className = 'badge b-grey'; }
    else if (itBudget > 0) { tier = 'Emerging'; sizeTierBadge.className = 'badge b-grey'; }
    sizeTierBadge.textContent = `Value tier: ${tier}`;
    
    // Summary Update
    updateAccountSummary();
  };

  if (aiItProfile && aiOutsourceable) {
    aiItProfile.addEventListener('change', () => {
      let val = 25;
      if (aiItProfile.value === 'cloud') val = 40;
      if (aiItProfile.value === 'traditional') val = 25;
      aiOutsourceable.value = val;
      aiOutsourceable.nextElementSibling.value = val + '%';
      calcWalletMath();
    });
  }

  if (aiRevInput) {
    [aiRevInput, aiOutsourceable, aiCapRate].forEach(el => el.addEventListener('input', calcWalletMath));
  }

  // Scoring Matrix
  const scoreInputs = document.querySelectorAll('.ai-score');
  const totalScoreBadge = document.getElementById('prospect-total-score');
  const classBadge = document.getElementById('prospect-classification-badge');
  
  const calcScore = () => {
    if (scoreInputs.length === 0) return;
    let total = 0;
    let mandatoryFail = false;
    scoreInputs.forEach(input => {
      let val = parseInt(input.value) || 0;
      if (val < 0) { val = 0; input.value = 0; }
      if (val > 4) { val = 4; input.value = 4; }
      total += val;
      if (input.classList.contains('ai-mandatory') && val === 0) {
        mandatoryFail = true;
      }
    });

    let tierLabel = 'Minnow Prospect';
    let badgeClass = 'b-grey';
    if (total >= 18 && !mandatoryFail) { tierLabel = 'Whale Prospect'; badgeClass = 'b-purple'; }
    else if (total >= 12 && !mandatoryFail) { tierLabel = 'Tuna Prospect'; badgeClass = 'b-blue'; }
    else if (mandatoryFail && total >= 12) { tierLabel = 'Tier Unconfirmed'; badgeClass = 'b-outline-red'; }
    
    if (totalScoreBadge) {
      totalScoreBadge.textContent = `Score: ${total}/32`;
    }
    if (classBadge) {
      classBadge.textContent = tierLabel;
      classBadge.style.color = badgeClass === 'b-purple' ? '#8B5CF6' : badgeClass === 'b-blue' ? '#3B82F6' : '#64748B';
    }
    
    updateAccountSummary();
  };

  scoreInputs.forEach(input => input.addEventListener('input', calcScore));
  
  // Qualifying Gates
  const aiGateSelectElements = document.querySelectorAll('.ai-gate-select');
  aiGateSelectElements.forEach(sel => sel.addEventListener('change', () => {
    updateAccountSummary();
  }));
  
  const healthSelect = document.getElementById('ai-account-health');
  const tagSelect = document.getElementById('ai-potential-tag');
  if (healthSelect) healthSelect.addEventListener('change', () => updateAccountSummary());
  if (tagSelect) tagSelect.addEventListener('change', () => updateAccountSummary());

  const updateAccountSummary = () => {
    const sMotion = document.getElementById('summary-motion');
    const sReason = document.getElementById('summary-motion-reason');
    const sPursue = document.getElementById('summary-pursue');
    const sTier = document.getElementById('summary-tier');
    const sWallet = document.getElementById('summary-wallet');
    const sWalletHint = document.getElementById('summary-wallet-hint');
    const sTag = document.getElementById('summary-tag');
    const sHealth = document.getElementById('summary-health');
    const sEscalation = document.getElementById('summary-escalation');
    const sCoverage = document.getElementById('summary-coverage');
    const sAction = document.getElementById('summary-action');
    if (!sMotion) return;

    // Motion
    sMotion.textContent = hasClosedWonDeal ? 'Farming' : 'Hunting';
    sMotion.style.color = hasClosedWonDeal ? '#F59E0B' : '#3B82F6';
    if (sReason) sReason.textContent = hasClosedWonDeal ? 'At least one Closed Won Deal exists' : 'No Closed Won Deal yet';

    // Pursue Recommendation
    let gateFail = false, gateReview = false;
    aiGateSelectElements.forEach(sel => {
      if (sel.value === 'fail') gateFail = true;
      if (sel.value === 'review') gateReview = true;
    });
    if (sPursue) {
      if (gateFail) {
        sPursue.textContent = 'Not Pursuable';
        sPursue.style.color = '#DC2626';
      } else if (gateReview) {
        sPursue.textContent = 'Need Review';
        sPursue.style.color = '#F59E0B';
      } else {
        sPursue.textContent = 'Pursue';
        sPursue.style.color = '#10B981';
      }
    }

    if (sTier) {
      if (hasClosedWonDeal) {
        sTier.textContent = 'Farming: ' + (farmingTier ? farmingTier.textContent : 'Emerging');
        sTier.style.color = '#0F172A';
      } else {
        const classBadge = document.getElementById('prospect-classification-badge');
        const tierPart = classBadge ? classBadge.textContent : 'Not Evaluated';
        sTier.textContent = tierPart;
        sTier.style.color = classBadge && classBadge.textContent === 'Tier Unconfirmed' ? '#DC2626' : '#8B5CF6';
      }
    }

    // Wallet
    if (sWallet) sWallet.textContent = calcAddr ? calcAddr.textContent : '$0';
    const addrVal = calcAddr ? parseFloat(calcAddr.textContent.replace(/[^0-9.-]+/g,"")) : 0;
    if (sWalletHint) {
      if (addrVal >= 5000000) sWalletHint.textContent = 'Apex candidate';
      else if (addrVal >= 1000000) sWalletHint.textContent = 'Mega candidate';
      else if (addrVal >= 100000) sWalletHint.textContent = 'Growth candidate';
      else sWalletHint.textContent = 'Emerging candidate';
    }

    // Tags
    let tags = [];
    if (tagSelect && tagSelect.value) tags.push(tagSelect.value);
    sTag.textContent = tags.length > 0 ? tags.join(', ') : 'None';

    // Health
    sHealth.textContent = healthSelect ? healthSelect.options[healthSelect.selectedIndex].text : 'N/A';
    if (healthSelect) {
      healthSelect.className = 'form-control';
      if (healthSelect.value === 'Green') healthSelect.classList.add('badge-green');
      else if (healthSelect.value === 'Yellow') healthSelect.classList.add('badge-yellow');
      else if (healthSelect.value === 'Red' || healthSelect.value === 'Critical') {
        healthSelect.style.backgroundColor = '#FEE2E2';
        healthSelect.style.color = '#DC2626';
      } else {
        healthSelect.style.backgroundColor = '';
        healthSelect.style.color = '';
      }
      if (healthSelect.value === 'Red' || healthSelect.value === 'Critical') {
        sEscalation.style.display = 'block';
      } else {
        sEscalation.style.display = 'none';
      }
    }

    // Coverage & Action
    if (sCoverage) {
      if (sTier.textContent.includes('Whale')) {
        sCoverage.textContent = 'Weekly + Monthly Steering';
      } else if (sTier.textContent.includes('Tuna')) {
        sCoverage.textContent = 'Bi-weekly';
      } else {
        sCoverage.textContent = 'Monthly Check-in';
      }
    }

    if (sAction) {
      if (gateFail) sAction.textContent = 'Next: Stop pursuit or Request Override';
      else if (gateReview) sAction.textContent = 'Next: Clear Pending/Review Gates';
      else sAction.textContent = 'Next: Proceed Discovery / Create Deal';
    }
  };

  // --- Account Motion & Farming Logic ---
  const aiMotionDisplay = document.getElementById('ai-account-motion-display');
  const aiMotionReason = document.getElementById('ai-motion-reason');
  const farmingOverlay = document.getElementById('farming-locked-overlay');
  const aiTtmRev = document.getElementById('ai-ttm-revenue');
  const farmingTier = document.getElementById('ai-farming-tier');

  // MOCK: In a real app, this would be determined by the backend based on Deal states.
  const currentCompany = window.mockCompanies.find(c => c.name === 'HubSpot') || { id: "company-hubspot" };
  let hasClosedWonDeal = window.mockDeals.some(
    deal => (deal.companyId === currentCompany.id || deal.company === "HubSpot") && 
            (deal.dealStage === "Closed Won" || deal.stage === "Closed Won" || deal.stage === "Closed Won (100%)")
  ); 

  const evaluateAccountMotion = () => {
    if (!aiMotionDisplay) return;

    if (hasClosedWonDeal) {
      aiMotionDisplay.textContent = 'Farming';
      aiMotionDisplay.style.color = '#F59E0B'; // Farming color
      aiMotionDisplay.style.backgroundColor = '#FEF3C7';
      aiMotionDisplay.style.borderColor = '#FDE68A';
      
      if (aiMotionReason) {
        aiMotionReason.innerHTML = '<i class="ph ph-check-circle" style="color: #10B981;"></i> At least one Closed Won Deal exists';
      }

      // Unlock Farming Profile
      if (farmingOverlay) farmingOverlay.style.display = 'none';
      if (aiTtmRev) {
        aiTtmRev.disabled = false;
        aiTtmRev.value = '620000';
        aiTtmRev.style.backgroundColor = '';
        aiTtmRev.style.cursor = '';
      }
      
      // Recalculate tier
      calcFarmingTier();
    } else {
      aiMotionDisplay.textContent = 'Hunting';
      aiMotionDisplay.style.color = '#3B82F6'; // Hunting color
      aiMotionDisplay.style.backgroundColor = '#DBEAFE';
      aiMotionDisplay.style.borderColor = '#BFDBFE';

      if (aiMotionReason) {
        aiMotionReason.innerHTML = '<i class="ph ph-info"></i> No Closed Won Deal yet';
      }

      // Lock Farming Profile
      if (farmingOverlay) farmingOverlay.style.display = 'flex';
      if (aiTtmRev) {
        aiTtmRev.disabled = true;
        aiTtmRev.value = ''; // clear value
        aiTtmRev.style.backgroundColor = '#F8FAFC';
        aiTtmRev.style.cursor = 'not-allowed';
      }
      if (farmingTier) {
        farmingTier.textContent = 'N/A';
        farmingTier.style.color = 'var(--text-muted)';
      }
    }
    
    updateAccountSummary();
  };

  const calcFarmingTier = () => {
    if (!aiTtmRev || !farmingTier || !hasClosedWonDeal) return;
    const rev = parseFloat(aiTtmRev.value) || 0;
    let tier = 'Emerging';
    let color = 'var(--text-muted)';
    if (rev >= 5000000) { tier = 'Apex'; color = 'var(--primary-teal)'; }
    else if (rev >= 1000000) { tier = 'Mega'; color = '#6B21A8'; }
    else if (rev >= 500000) { tier = 'Established'; color = '#1E40AF'; }
    else if (rev >= 100000) { tier = 'Growth'; color = '#0284C7'; }
    
    farmingTier.textContent = tier;
    farmingTier.style.color = color;
    updateAccountSummary();
  };

  if (aiTtmRev) {
    aiTtmRev.addEventListener('input', calcFarmingTier);
  }

  // Initial evaluation
  evaluateAccountMotion();


  // Account Health Reason Toggle
  const aiHealth = document.getElementById('ai-account-health');
  const aiHealthReason = document.getElementById('ai-health-reason-group');
  if (aiHealth) {
    aiHealth.addEventListener('change', () => {
      if (aiHealth.value !== 'Green') {
        aiHealthReason.style.display = 'block';
      } else {
        aiHealthReason.style.display = 'none';
      }
    });
  }

  // Qualifying Gates colors
  const gateColorSelects = document.querySelectorAll('.ai-gate-select');
  const updateGateColor = (select) => {
    const val = select.value;
    if (val === 'pass') {
      select.style.backgroundColor = '#D1FAE5'; select.style.color = '#065F46'; select.style.borderColor = '#A7F3D0';
    } else if (val === 'fail') {
      select.style.backgroundColor = '#FEE2E2'; select.style.color = '#991B1B'; select.style.borderColor = '#FECACA';
    } else if (val === 'review') {
      select.style.backgroundColor = '#FEF3C7'; select.style.color = '#92400E'; select.style.borderColor = '#FDE68A';
    } else {
      select.style.backgroundColor = '#F1F5F9'; select.style.color = '#475569'; select.style.borderColor = '#E2E8F0';
    }
  };
  gateColorSelects.forEach(select => {
    updateGateColor(select);
    select.addEventListener('change', () => updateGateColor(select));
  });

  // Prospect Scoring Matrix
  const scoreSliders = document.querySelectorAll('.ai-score');
  const totalScoreDisplay = document.getElementById('prospect-total-score');
  const updateTotalScore = () => {
    let total = 0;
    let answered = 0;
    scoreSliders.forEach(slider => {
      const val = parseInt(slider.value) || 0;
      total += val;
      if (val > 0) answered++;
      slider.nextElementSibling.textContent = val === 0 ? 'Not Evaluated' : val;
      slider.nextElementSibling.style.fontSize = val === 0 ? '11px' : '13px';
      slider.nextElementSibling.style.fontWeight = val === 0 ? '500' : '600';
    });
    if (totalScoreDisplay) {
      if (answered === 0) {
        totalScoreDisplay.textContent = 'Score: Not Evaluated';
      } else {
        totalScoreDisplay.textContent = `Score: ${total}/32`;
      }
    }
  };
  if (scoreSliders.length > 0) {
    scoreSliders.forEach(slider => slider.addEventListener('input', updateTotalScore));
    updateTotalScore();
  }

  // Discussion - Mark as Decision
  const markDecisionBtns = document.querySelectorAll('.btn-mark-decision');
  const decisionLogContainer = document.getElementById('decision-log-container');
  if (markDecisionBtns.length > 0 && decisionLogContainer) {
    markDecisionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const commentBlock = e.target.closest('div').previousElementSibling;
        const commentText = commentBlock ? commentBlock.textContent.trim() : 'Decision recorded.';
        
        const newDecision = document.createElement('div');
        newDecision.style.cssText = 'font-size: 13px; color: var(--text-dark); background: #FFF; padding: 8px 12px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.2);';
        
        const today = new Date().toISOString().split('T')[0];
        newDecision.innerHTML = `<span style="font-weight: 600; color: var(--text-muted); margin-right: 8px;">${today}</span> ${commentText} <a href="#" style="color: var(--primary-teal); margin-left: 8px; text-decoration: none;">Go to thread</a>`;
        
        decisionLogContainer.appendChild(newDecision);
        
        btn.innerHTML = `<i class="ph ph-check-circle" style="font-weight: fill;"></i> Decision Marked`;
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
        
        alert('Comment marked as a decision and added to the Decision Log.');
      });
    });
  }

  // --- DEAL DETAIL EDIT MODE LOGIC ---
  if (window.location.pathname.includes('deal.html')) {
    const btnEnterEdit = document.getElementById('btn-enter-edit');
    const btnSaveEditDeal = document.getElementById('btn-save-edit');
    const btnCancelEditDeal = document.getElementById('btn-cancel-edit');
    const editModeBanner = document.querySelector('.edit-mode-banner');
    const stickyFooter = document.querySelector('.sticky-footer');
    const propertyItems = document.querySelectorAll('#about-props .property-item');

    if (btnEnterEdit) {
      btnEnterEdit.addEventListener('click', () => {
        if (editModeBanner) editModeBanner.style.display = 'block';
        if (stickyFooter) stickyFooter.style.display = 'flex';
        propertyItems.forEach(item => item.classList.add('is-editing'));
      });
    }

    function exitDealEditMode() {
      if (editModeBanner) editModeBanner.style.display = 'none';
      if (stickyFooter) stickyFooter.style.display = 'none';
      propertyItems.forEach(item => item.classList.remove('is-editing'));
    }

    if (btnCancelEditDeal) btnCancelEditDeal.addEventListener('click', exitDealEditMode);
    
    if (btnSaveEditDeal) {
      btnSaveEditDeal.addEventListener('click', () => {
        const pipelineSelect = document.getElementById('deal-detail-pipeline');
        const stageSelect = document.getElementById('deal-detail-stage');
        if (pipelineSelect && document.getElementById('deal-pipeline-display')) {
          document.getElementById('deal-pipeline-display').textContent = pipelineSelect.value;
        }
        if (stageSelect && document.getElementById('deal-stage-display')) {
          document.getElementById('deal-stage-display').textContent = stageSelect.value;
        }
        
        alert('Deal updated successfully!');
        exitDealEditMode();
      });
    }

    // Pipeline change sync logic
    const dealDetailPipeline = document.getElementById('deal-detail-pipeline');
    const dealDetailStage = document.getElementById('deal-detail-stage');
    
    if (dealDetailPipeline && dealDetailStage) {
      dealDetailPipeline.addEventListener('change', (e) => {
        const selectedPipe = e.target.value;
        const stages = selectedPipe === 'Outbound Target Account' ? outboundPipelineStages : salesPipelineStages;
        
        dealDetailStage.innerHTML = '';
        stages.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s;
          opt.textContent = s;
          dealDetailStage.appendChild(opt);
        });
        
        alert('Deal stage has been reset because pipeline changed.');
      });
    }

    // On load, sync the Deal Detail stage to match current Pipeline if needed
    if (dealDetailPipeline && dealDetailStage && dealDetailStage.options.length === 0) {
       const stages = dealDetailPipeline.value === 'Outbound Target Account' ? outboundPipelineStages : salesPipelineStages;
       stages.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s;
          opt.textContent = s;
          dealDetailStage.appendChild(opt);
       });
    }
  }

  } catch(e) {
    console.error('[SalesHub] Critical error in DOMContentLoaded:', e.message, '\nStack:', e.stack);
    const errBanner = document.createElement('div');
    errBanner.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:12px 20px;background:#DC2626;color:white;z-index:99999;font-size:13px;font-family:monospace;white-space:pre-wrap;';
    errBanner.textContent = 'SalesHub JS Error: ' + e.message + '\n' + (e.stack || '');
    document.body.prepend(errBanner);
  }
});

// ==========================================
// FORECAST REGISTRATION (DEAL DETAIL)
// ==========================================
const initForecastRegistration = () => {
  const btnsOpen = document.querySelectorAll('.btn-open-forecast');
  const modal = document.getElementById('modal-forecast-overlay');
  if (btnsOpen.length === 0 || !modal) return;

  const btnClose = document.getElementById('close-forecast-modal');
  const btnCancel = document.getElementById('btn-cancel-forecast');
  const btnSave = document.getElementById('btn-save-forecast');
  const gridContainer = document.getElementById('forecast-grid-container');
  const totalDisplay = document.getElementById('forecast-total-display');
  const warningBanner = document.getElementById('forecast-warning-banner');
  const currentAmountDisplay = document.getElementById('forecast-current-amount');
  const dealNameDisplay = document.getElementById('forecast-deal-name');
  
  const urlParams = new URLSearchParams(window.location.search);
  const dealId = urlParams.get('id');
  let currentDeal = mockDeals.find(d => d.id === dealId) || mockDeals[1]; // fallback

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let isDirty = false;
  let originalForecast = {};

  const formatCurrency = (val) => '$' + parseInt(val).toLocaleString();
  const parseCurrency = (str) => parseInt(str.replace(/[^0-9]/g, '')) || 0;

  const renderGrid = () => {
    gridContainer.innerHTML = '';
    const f = currentDeal.forecast || {};
    months.forEach((m, idx) => {
      const val = f[m] || 0;
      originalForecast[m] = val;
      const html = `
        <div class="form-group" style="margin-bottom: 0;">
          <label style="font-size: 12px; margin-bottom: 4px;">${monthLabels[idx]}</label>
          <div style="position: relative;">
            <span style="position: absolute; left: 8px; top: 8px; color: var(--text-muted);">$</span>
            <input type="number" class="form-control forecast-input" data-month="${m}" value="${val}" min="0" style="padding-left: 20px;">
          </div>
        </div>
      `;
      gridContainer.innerHTML += html;
    });

    document.querySelectorAll('.forecast-input').forEach(inp => {
      inp.addEventListener('input', () => {
        isDirty = true;
        recalculateTotal();
      });
    });
    
    recalculateTotal();
  };

  const recalculateTotal = () => {
    let total = 0;
    document.querySelectorAll('.forecast-input').forEach(inp => {
      total += parseInt(inp.value) || 0;
    });
    totalDisplay.innerText = formatCurrency(total);
    
    const currentAmount = window.parseAmount(currentDeal.amount);
    if (total !== currentAmount) {
      warningBanner.style.display = 'block';
    } else {
      warningBanner.style.display = 'none';
    }
  };

  const openModal = () => {
    dealNameDisplay.innerText = currentDeal.name;
    currentAmountDisplay.innerText = window.formatCurrency(currentDeal.amount);
    isDirty = false;
    renderGrid();
    modal.style.display = 'flex';
  };

  const closeModal = () => {
    if (isDirty) {
      if (!confirm("Discard changes?")) return;
    }
    modal.style.display = 'none';
  };

  const saveModal = () => {
    let total = 0;
    const newForecast = {};
    let hasValue = false;
    document.querySelectorAll('.forecast-input').forEach(inp => {
      const val = parseInt(inp.value) || 0;
      if (val < 0) {
        alert("Forecast amount cannot be negative.");
        throw new Error("Negative");
      }
      if (val > 0) hasValue = true;
      newForecast[inp.getAttribute('data-month')] = val;
      total += val;
    });

    if (!hasValue) {
      alert("Please enter forecast amount for at least one month.");
      return;
    }

    // Update Deal
    currentDeal.forecast = newForecast;
    currentDeal.amount = total;
    
    // Update UI
    const amountDisplays = document.querySelectorAll('.deal-amount-display, #deal-amount-display, .box-value.text-muted');
    amountDisplays.forEach(el => {
      if (el.innerText.includes('$')) el.innerText = window.formatCurrency(currentDeal.amount);
    });

    // Timeline Log
    const timeline = document.querySelector('.timeline-container');
    if (timeline) {
      const timeItem = document.createElement('div');
      timeItem.className = 'timeline-item';
      timeItem.innerHTML = `
        <div class="timeline-icon"><i class="ph ph-trend-up"></i></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <strong>Forecast Updated</strong>
            <span class="timeline-time">Just now</span>
          </div>
          <div class="timeline-body">
            Deal Amount updated to <strong>${window.formatCurrency(currentDeal.amount)}</strong> based on monthly forecast allocation.
          </div>
        </div>
      `;
      const monthHeader = timeline.querySelector('.timeline-month');
      if (monthHeader) monthHeader.after(timeItem);
      else timeline.prepend(timeItem);
    }

    isDirty = false;
    modal.style.display = 'none';
    updateForecastStatusUI();
  };

  const updateForecastStatusUI = () => {
    const summaries = document.querySelectorAll('.forecast-quick-summary');
    const f = currentDeal.forecast;
    let hasForecast = false;
    if (f) {
      const totalR = Object.values(f).reduce((a, b) => a + b, 0);
      if (totalR > 0) hasForecast = true;
    }
    
    summaries.forEach(summary => {
      summary.style.display = hasForecast ? 'block' : 'none';
    });
    
    btnsOpen.forEach(btn => {
      btn.setAttribute('title', hasForecast ? 'Cáº­p nháº­t Forecast Ä‘á»ƒ phÃ¢n bá»• giÃ¡ trá»‹ Deal theo tá»«ng thÃ¡ng. Tá»•ng Forecast sáº½ cáº­p nháº­t láº¡i Deal Amount.' : 'ÄÄƒng kÃ½ Forecast Ä‘á»ƒ phÃ¢n bá»• giÃ¡ trá»‹ Deal theo tá»«ng thÃ¡ng. Tá»•ng Forecast sáº½ cáº­p nháº­t láº¡i Deal Amount.');
    });
  };

  updateForecastStatusUI();

  btnsOpen.forEach(btn => btn.addEventListener('click', openModal));
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  btnSave.addEventListener('click', () => {
    try { saveModal(); } catch (e) {}
  });
};

// ==========================================
// REVENUE FORECAST MODULE (forecast.html)
// ==========================================
const initForecastModule = () => {
  const tbodyMain = document.getElementById('forecast-tbody-main');
  const weightsTbody = document.getElementById('config-weights-tbody');
  if (!tbodyMain) return; // not on forecast.html

  const formatCurrency = (val) => '$' + parseInt(val).toLocaleString();

  // Tab Switching
  document.querySelectorAll('.tabs-header .tab-link').forEach(link => {
    link.addEventListener('click', (e) => {
      document.querySelectorAll('.tabs-header .tab-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.forecast-layout .tab-pane').forEach(p => p.classList.remove('active'));
      
      e.target.classList.add('active');
      const targetId = e.target.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
      
      if (targetId === 'tab-analytics') renderAnalytics();
      if (targetId === 'tab-config') renderConfig();
    });
  });

  // Toggle Columns
  const btnRaw = document.getElementById('btn-view-raw');
  const btnWtd = document.getElementById('btn-view-weighted');
  const btnBoth = document.getElementById('btn-view-both');

  const setViewMode = (mode) => {
    [btnRaw, btnWtd, btnBoth].forEach(b => {
      b.classList.remove('active');
      b.style.background = 'transparent';
      b.style.boxShadow = 'none';
    });
    
    document.querySelectorAll('.raw-col, .weighted-col').forEach(c => c.style.display = 'none');
    
    if (mode === 'raw') {
      btnRaw.classList.add('active');
      btnRaw.style.background = 'white';
      btnRaw.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      document.querySelectorAll('.raw-col').forEach(c => c.style.display = 'table-cell');
    } else if (mode === 'weighted') {
      btnWtd.classList.add('active');
      btnWtd.style.background = 'white';
      btnWtd.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      document.querySelectorAll('.weighted-col').forEach(c => c.style.display = 'table-cell');
    } else {
      btnBoth.classList.add('active');
      btnBoth.style.background = 'white';
      btnBoth.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      document.querySelectorAll('.raw-col, .weighted-col').forEach(c => c.style.display = 'table-cell');
    }
  };

  btnRaw.addEventListener('click', () => setViewMode('raw'));
  btnWtd.addEventListener('click', () => setViewMode('weighted'));
  btnBoth.addEventListener('click', () => setViewMode('both'));

  const theadMain = document.getElementById('forecast-thead-main');
  const quarterFilter = document.getElementById('forecast-quarter-filter');
  const btnMonthly = document.getElementById('btn-view-monthly');
  const btnQuarterly = document.getElementById('btn-view-quarterly');

  let periodMode = 'monthly'; // 'monthly' or 'quarterly'
  btnMonthly.addEventListener('click', () => {
    periodMode = 'monthly';
    btnMonthly.classList.add('active');
    btnMonthly.style.background = 'white';
    btnMonthly.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
    btnQuarterly.classList.remove('active');
    btnQuarterly.style.background = 'transparent';
    btnQuarterly.style.boxShadow = 'none';
    renderTable();
  });
  btnQuarterly.addEventListener('click', () => {
    periodMode = 'quarterly';
    btnQuarterly.classList.add('active');
    btnQuarterly.style.background = 'white';
    btnQuarterly.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
    btnMonthly.classList.remove('active');
    btnMonthly.style.background = 'transparent';
    btnMonthly.style.boxShadow = 'none';
    renderTable();
  });

  quarterFilter.addEventListener('change', () => {
    renderTable();
  });

  // Render Data Table
  const renderTable = () => {
    theadMain.innerHTML = '';
    tbodyMain.innerHTML = '';
    
    const filterVal = quarterFilter.value; // 'all', 'q1', 'q2', 'q3', 'q4'
    
    let columns = []; // array of { id: 'jan', label: 'Jan' }
    if (periodMode === 'monthly') {
      if (filterVal === 'all') columns = [{id:'jan', label:'Jan'}, {id:'feb', label:'Feb'}, {id:'mar', label:'Mar'}, {id:'apr', label:'Apr'}, {id:'may', label:'May'}, {id:'jun', label:'Jun'}, {id:'jul', label:'Jul'}, {id:'aug', label:'Aug'}, {id:'sep', label:'Sep'}, {id:'oct', label:'Oct'}, {id:'nov', label:'Nov'}, {id:'dec', label:'Dec'}];
      else if (filterVal === 'q1') columns = [{id:'jan', label:'Jan'}, {id:'feb', label:'Feb'}, {id:'mar', label:'Mar'}];
      else if (filterVal === 'q2') columns = [{id:'apr', label:'Apr'}, {id:'may', label:'May'}, {id:'jun', label:'Jun'}];
      else if (filterVal === 'q3') columns = [{id:'jul', label:'Jul'}, {id:'aug', label:'Aug'}, {id:'sep', label:'Sep'}];
      else if (filterVal === 'q4') columns = [{id:'oct', label:'Oct'}, {id:'nov', label:'Nov'}, {id:'dec', label:'Dec'}];
    } else { // quarterly
      if (filterVal === 'all') columns = [{id:'q1', label:'Q1'}, {id:'q2', label:'Q2'}, {id:'q3', label:'Q3'}, {id:'q4', label:'Q4'}];
      else columns = [{id:filterVal, label:filterVal.toUpperCase()}];
    }

    // Build thead
    let ths = `
      <th style="width: 150px; left: 0;">Account Name</th>
      <th style="width: 200px; left: 150px;">Deal Name</th>
      <th>Deal Owner</th>
      <th>Stage</th>
    `;
    columns.forEach(c => {
      ths += `<th class="raw-col" data-type="raw">${c.label} Raw</th>`;
    });
    ths += `<th class="raw-col" data-type="raw" style="font-weight: 700;">Total weighted forecast</th>`;
    
    columns.forEach(c => {
      ths += `<th class="weighted-col" data-type="weighted" style="display:none;">${c.label} Wtd</th>`;
    });
    ths += `<th class="weighted-col" data-type="weighted" style="display:none; font-weight: 700; color: var(--primary-teal);">YTD</th>`;
    ths += `<th>Action</th>`;
    
    theadMain.innerHTML = `<tr>${ths}</tr>`;

    // Build tbody
    mockDeals.forEach(deal => {
      if (!deal.forecast) return;
      const f = deal.forecast;
      const weight = window.forecastWeights[deal.stage] || 0;

      // Calculate the specific columns
      const rowData = {};
      
      // Compute quarters
      const q1r = f.jan + f.feb + f.mar;
      const q2r = f.apr + f.may + f.jun;
      const q3r = f.jul + f.aug + f.sep;
      const q4r = f.oct + f.nov + f.dec;
      const totalR = q1r + q2r + q3r + q4r;
      
      // Compute TOTAL WEIGHTED FORECAST strictly by summing monthly weighted amounts
      const totalW = 
        parseInt(f.jan * weight / 100) + parseInt(f.feb * weight / 100) + parseInt(f.mar * weight / 100) +
        parseInt(f.apr * weight / 100) + parseInt(f.may * weight / 100) + parseInt(f.jun * weight / 100) +
        parseInt(f.jul * weight / 100) + parseInt(f.aug * weight / 100) + parseInt(f.sep * weight / 100) +
        parseInt(f.oct * weight / 100) + parseInt(f.nov * weight / 100) + parseInt(f.dec * weight / 100);

      // Raw cells
      let rawTds = '';
      columns.forEach(c => {
        let valR = 0;
        if (['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].includes(c.id)) {
          valR = f[c.id];
        } else if (c.id === 'q1') valR = q1r;
        else if (c.id === 'q2') valR = q2r;
        else if (c.id === 'q3') valR = q3r;
        else if (c.id === 'q4') valR = q4r;

        rawTds += `<td class="raw-col">${formatCurrency(valR)}</td>`;
      });
      rawTds += `<td class="raw-col" style="font-weight: 700;">${formatCurrency(totalR)}</td>`;

      // Wtd cells
      let wtdTds = '';
      columns.forEach(c => {
        let valR = 0;
        if (['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].includes(c.id)) {
          valR = f[c.id];
        } else if (c.id === 'q1') valR = q1r;
        else if (c.id === 'q2') valR = q2r;
        else if (c.id === 'q3') valR = q3r;
        else if (c.id === 'q4') valR = q4r;
        
        let valW = parseInt(valR * (weight / 100));
        wtdTds += `<td class="weighted-col" style="display:none;">${formatCurrency(valW)}</td>`;
      });
      wtdTds += `<td class="weighted-col" style="display:none; font-weight: 700; color: var(--primary-teal);">${formatCurrency(totalW)}</td>`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><a href="company.html" style="color:var(--text-dark); text-decoration:none;">${deal.company}</a></td>
        <td><a href="deal.html?id=${deal.id}" style="color:var(--text-dark); font-weight:500; text-decoration:none;">${deal.name}</a></td>
        <td>${deal.owner}</td>
        <td>${deal.stage}</td>
        ${rawTds}
        ${wtdTds}
        <td>
          <a href="deal.html?id=${deal.id}" class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px; text-decoration: none;">Update Forecast</a>
        </td>
      `;
      tbodyMain.appendChild(tr);
    });

    // reset view to current mode
    const activeBtn = document.querySelector('.btn-secondary.active[id^="btn-view-raw"], .btn-secondary.active[id^="btn-view-weighted"], .btn-secondary.active[id^="btn-view-both"]');
    if (activeBtn) {
      if (activeBtn.id === 'btn-view-raw') setViewMode('raw');
      else if (activeBtn.id === 'btn-view-weighted') setViewMode('weighted');
      else setViewMode('both');
    }
  };

  // --- ANALYTICS CHARTS LOGIC ---
  let analyticsMeasure = 'weighted';
  const chartInstances = {};

  const getAnalyticsData = (groupByField, overrideType) => {
    let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Filter values
    const qFilter = document.getElementById('analytics-quarter-filter')?.value || 'all';
    const teamFilter = document.getElementById('analytics-team-filter')?.value || 'all';
    const ownerFilter = document.getElementById('analytics-owner-filter')?.value || 'all';
    const marketFilter = document.getElementById('analytics-market-filter')?.value || 'all';
    const stageFilter = document.getElementById('analytics-stage-filter')?.value || 'all';

    if (qFilter === 'q1') { months = ['jan', 'feb', 'mar']; monthLabels = ['Jan', 'Feb', 'Mar']; }
    else if (qFilter === 'q2') { months = ['apr', 'may', 'jun']; monthLabels = ['Apr', 'May', 'Jun']; }
    else if (qFilter === 'q3') { months = ['jul', 'aug', 'sep']; monthLabels = ['Jul', 'Aug', 'Sep']; }
    else if (qFilter === 'q4') { months = ['oct', 'nov', 'dec']; monthLabels = ['Oct', 'Nov', 'Dec']; }

    const filteredDeals = mockDeals.filter(d => {
      if (!d.forecast) return false;
      if (teamFilter !== 'all' && d.team !== teamFilter) return false;
      if (ownerFilter !== 'all' && d.owner !== ownerFilter) return false;
      if (marketFilter !== 'all' && d.country !== marketFilter) return false;
      if (stageFilter !== 'all' && d.stage !== stageFilter) return false;
      return true;
    });

    const groups = {}; // { 'Sarah Smith': [janVal, febVal, ...] }
    
    // Initialize all found groups
    filteredDeals.forEach(d => {
      const groupVal = d[groupByField] || 'Unassigned';
      if (!groups[groupVal]) groups[groupVal] = new Array(months.length).fill(0);
    });

    filteredDeals.forEach(d => {
      const groupVal = d[groupByField] || 'Unassigned';
      const weight = window.forecastWeights[d.stage] || 0;
      
      months.forEach((m, idx) => {
        const rawVal = d.forecast[m] || 0;
        const val = analyticsMeasure === 'weighted' ? parseInt(rawVal * (weight / 100)) : rawVal;
        groups[groupVal][idx] += val;
      });
    });

    // Prepare datasets for Chart.js
    const colors = ['#0EA5E9', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#F43F5E', '#14B8A6', '#84CC16'];

    if (overrideType === 'doughnut' || overrideType === 'pie') {
      const pieData = Object.keys(groups).map(groupName => {
        return groups[groupName].reduce((sum, val) => sum + val, 0);
      });
      const pieLabels = Object.keys(groups);
      
      return {
        labels: pieLabels,
        datasets: [{
          data: pieData,
          backgroundColor: colors.slice(0, pieLabels.length),
          borderWidth: 1
        }],
        hasData: pieData.some(v => v > 0)
      };
    }

    const isGrouped = overrideType === 'bar-grouped';
    const isLine = overrideType === 'line';

    const datasets = Object.keys(groups).map((groupName, idx) => {
      return {
        type: isLine ? 'line' : 'bar',
        label: groupName,
        data: groups[groupName],
        backgroundColor: colors[idx % colors.length],
        borderColor: colors[idx % colors.length],
        borderWidth: isLine ? 2 : 1,
        tension: 0.3,
        fill: !isLine,
        order: 1
      };
    });

    // Add Total Line
    const totals = new Array(months.length).fill(0);
    Object.values(groups).forEach(groupArr => {
      groupArr.forEach((val, i) => { totals[i] += val; });
    });
    
    let hasData = totals.some(v => v > 0);

    if (hasData) {
      datasets.push({
        type: 'line',
        label: 'Total',
        data: totals,
        borderColor: '#334155',
        backgroundColor: '#334155',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#334155',
        order: 0
      });
    }

    return {
      labels: monthLabels,
      datasets: datasets,
      hasData: hasData
    };
  };

  const createChart = (canvasId, title, groupByField, overrideType) => {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }

    const dataObj = getAnalyticsData(groupByField, overrideType);
    
    // Empty state handling
    const parentContainer = ctx.parentElement;
    let emptyState = parentContainer.querySelector('.empty-state');
    
    if (!dataObj.hasData) {
      ctx.style.display = 'none';
      if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); background: #f8fafc; border-radius: 6px; border: 1px dashed #cbd5e1;';
        emptyState.innerHTML = '<i class="ph ph-chart-pie-slice" style="font-size: 32px; margin-bottom: 8px; color: #94a3b8;"></i><span style="font-size: 13px;">No data for selected filters</span>';
        parentContainer.appendChild(emptyState);
      }
      return; // Do not render chart
    } else {
      ctx.style.display = 'block';
      if (emptyState) emptyState.remove();
    }

    const actualChartType = (overrideType === 'bar-grouped') ? 'bar' : (overrideType || 'bar');

    chartInstances[canvasId] = new Chart(ctx, {
      type: actualChartType,
      data: dataObj,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.parsed.y !== null) { label += formatCurrency(context.parsed.y); }
                return label;
              }
            }
          }
        },
        scales: (overrideType === 'doughnut' || overrideType === 'pie') ? {} : {
          x: { stacked: overrideType !== 'line' && overrideType !== 'bar-grouped', grid: { display: false } },
          y: { stacked: overrideType !== 'line' && overrideType !== 'bar-grouped', beginAtZero: true, ticks: { callback: (value) => '$' + (value/1000) + 'k' } }
        },
        onClick: (e, elements) => {
          if (elements.length > 0) {
            const el = elements[0];
            const datasetIndex = el.datasetIndex;
            const groupName = dataObj.datasets[datasetIndex].label;
            
            if (groupName === 'Total') return; // Don't drill down on total line
            
            // Drill down: update Data filters (if mapping exists) and switch tab
            // For example, if it's the Sales chart:
            if (groupByField === 'owner') {
              const ownerSel = document.getElementById('forecast-owner-filter');
              if (ownerSel) ownerSel.value = groupName;
            } else if (groupByField === 'team') {
              const teamSel = document.getElementById('forecast-team-filter');
              if (teamSel) teamSel.value = groupName;
            } else if (groupByField === 'stage') {
              const stageSel = document.getElementById('forecast-stage-filter');
              if (stageSel) stageSel.value = groupName;
            }
            // Trigger Data tab view
            document.querySelector('.tab-link[data-target="tab-data"]').click();
          }
        }
      }
    });
  };

  const renderAnalytics = () => {
    createChart('chart-team', 'Team - Revenue Sales Forecast', 'team'); // Stacked Bar (default)
    createChart('chart-sales', 'Revenue Forecast By Sales', 'owner', 'line'); // Line
    createChart('chart-market', 'Revenue By Market', 'country', 'doughnut'); // Doughnut
    createChart('chart-project', 'Revenue By Type Of Project', 'projectType', 'pie'); // Pie
    createChart('chart-stage', 'Revenue Forecast By Deal Stage', 'stage', 'bar-grouped'); // Grouped Bar
  };

  // Bind filter events
  const analyticsFilters = ['analytics-year-filter', 'analytics-quarter-filter', 'analytics-team-filter', 'analytics-owner-filter', 'analytics-market-filter', 'analytics-stage-filter'];
  analyticsFilters.forEach(fid => {
    const el = document.getElementById(fid);
    if (el) el.addEventListener('change', renderAnalytics);
  });

  const btnAnaRaw = document.getElementById('btn-analytics-raw');
  const btnAnaWtd = document.getElementById('btn-analytics-weighted');
  if (btnAnaRaw && btnAnaWtd) {
    btnAnaRaw.addEventListener('click', () => {
      analyticsMeasure = 'raw';
      btnAnaRaw.classList.add('active');
      btnAnaRaw.style.background = 'white';
      btnAnaRaw.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      btnAnaWtd.classList.remove('active');
      btnAnaWtd.style.background = 'transparent';
      btnAnaWtd.style.boxShadow = 'none';
      renderAnalytics();
    });
    btnAnaWtd.addEventListener('click', () => {
      analyticsMeasure = 'weighted';
      btnAnaWtd.classList.add('active');
      btnAnaWtd.style.background = 'white';
      btnAnaWtd.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      btnAnaRaw.classList.remove('active');
      btnAnaRaw.style.background = 'transparent';
      btnAnaRaw.style.boxShadow = 'none';
      renderAnalytics();
    });
  }

  // Render Config
  const renderConfig = () => {
    weightsTbody.innerHTML = '';
    const stages = [
      'Nurture', 'Nurture (0%)', '1st Meeting (10%)', 'Discovery (10%)', 
      'Solution Design (Synced)', 'Draft Proposal (Synced)', 'Proposal Presented (Synced)', 
      'Negotiation (90%)', 'Closed Won (100%)', 'Closed Lost (0%)'
    ];
    
    stages.forEach(s => {
      if (window.forecastWeights[s] !== undefined) {
        const val = window.forecastWeights[s];
        weightsTbody.innerHTML += `
          <tr>
            <td style="font-weight: 500;">${s}</td>
            <td>
              <input type="number" class="form-control stage-weight-input" data-stage="${s}" value="${val}" min="0" max="100" style="width: 100px;">
            </td>
          </tr>
        `;
      }
    });
  };

  document.getElementById('btn-save-weights').addEventListener('click', () => {
    document.querySelectorAll('.stage-weight-input').forEach(inp => {
      const stage = inp.getAttribute('data-stage');
      const val = parseInt(inp.value) || 0;
      window.forecastWeights[stage] = val;
    });
    alert('Forecast weights updated successfully! Forecast Data has been recalculated.');
    renderTable(); // re-render data
    if (document.getElementById('tab-analytics').classList.contains('active')) renderAnalytics();
  });

  // Init Default
  renderTable();
};

// ==========================================
// ASSOCIATION MANAGER (GLOBAL)
// ==========================================
const initAssociationManager = () => {
  // 1. Inject HTML for the global Association Modal
  const modalHTML = `
  <div class="drawer" id="drawer-association-manager" style="width: 700px;">
    <div class="drawer-header teal">
      <h2 id="assoc-modal-title">Add existing</h2>
      <button class="close-drawer" id="close-assoc-modal"><i class="ph ph-x"></i></button>
    </div>
    
    <div class="drawer-tabs" id="assoc-modal-tabs">
      <div class="drawer-tab" data-tab="create-new">Create new</div>
      <div class="drawer-tab active" data-tab="add-existing">Add existing</div>
    </div>

    <div class="drawer-body" style="padding-top: 16px;">
      
      <!-- ADD EXISTING PANEL -->
      <div id="assoc-panel-add-existing" class="drawer-panel" style="display: flex; gap: 24px; height: calc(100vh - 200px);">
        <!-- LEFT: List -->
        <div style="flex: 1; display: flex; flex-direction: column; border-right: 1px solid var(--border-color); padding-right: 24px;">
          <div class="search-box" style="margin-bottom: 16px;">
            <i class="ph ph-magnifying-glass search-icon"></i>
            <input type="text" id="assoc-search-input" placeholder="Search records...">
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 13px;">
            <span class="text-muted" id="assoc-count-label">0 Records</span>
          </div>
          <div class="list-container" id="assoc-existing-list" style="flex: 1; overflow-y: auto;">
            <!-- Dynamically populated -->
          </div>
        </div>
        <!-- RIGHT: Selected -->
        <div style="width: 250px; display: flex; flex-direction: column;">
          <h3 style="font-size: 14px; margin: 0 0 16px 0; font-weight: 600;">Selected (<span id="assoc-selected-count">0</span>)</h3>
          <div id="assoc-selected-list" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
            <div class="text-muted" style="font-size: 13px; font-style: italic;">No records selected.</div>
          </div>
        </div>
      </div>

      <!-- CREATE NEW PANEL -->
      <div id="assoc-panel-create-new" class="drawer-panel" style="display: none;">
        <form id="assoc-create-form" onsubmit="return false;">
          <!-- Dynamically populated based on targetObject type -->
        </form>
      </div>

    </div>
    
    <div class="drawer-footer" style="justify-content: flex-end; align-items: center;">
      <div style="display: flex; gap: 12px;">
        <button class="btn btn-secondary" id="cancel-assoc">Cancel</button>
        <button class="btn btn-primary" id="save-assoc" disabled>Save</button>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const drawer = document.getElementById('drawer-association-manager');
  const overlay = document.getElementById('main-overlay');
  
  // State
  let currentAssocType = null;
  let selectedExistingIds = [];
  let isDirty = false;

  const getMockData = (type) => {
    if (type === 'Company') return [{id:'C1', name:'HubSpot'}, {id:'C2', name:'Salesforce'}];
    if (type === 'Contact') return [{id:'CT1', name:'John Doe', company:'HubSpot'}, {id:'CT2', name:'Jane Smith', company:'Salesforce'}];
    if (type === 'Deal') return [{id:'D1', name:'Enterprise Rollout'}, {id:'D2', name:'Cloud Migration'}];
    return [];
  };

  const associatedRecords = {
    Company: [],
    Contact: [],
    Deal: []
  };

  const openModal = (type) => {
    currentAssocType = type;
    document.getElementById('assoc-modal-title').innerText = `Add ${type}`;
    document.getElementById('assoc-search-input').placeholder = `Search ${type}s...`;
    
    // Switch to Add Existing tab by default
    switchTab('add-existing');
    renderExistingList();
    renderCreateForm();

    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
  };

  const renderExistingList = () => {
    const list = document.getElementById('assoc-existing-list');
    const data = getMockData(currentAssocType);
    list.innerHTML = '';
    
    data.forEach(item => {
      const isAlreadyAssociated = associatedRecords[currentAssocType].includes(item.id);
      const isChecked = selectedExistingIds.some(s => s.id === item.id);
      list.innerHTML += `
        <div class="list-item ${isAlreadyAssociated ? 'disabled' : ''}" style="padding: 12px; border: 1px solid var(--border-color); margin-bottom: 8px; border-radius: 4px; display: flex; align-items: center; gap: 12px;">
          <input type="checkbox" name="assoc_select" value="${item.id}" ${isAlreadyAssociated ? 'disabled' : ''} ${isChecked ? 'checked' : ''} onchange="window.selectAssoc('${item.id}', this.checked, '${item.name}')">
          <div>
            <div style="font-weight: 500;">${item.name}</div>
            ${isAlreadyAssociated ? '<div style="font-size: 11px; color: #DC2626;">Already associated</div>' : ''}
          </div>
        </div>
      `;
    });
    document.getElementById('assoc-count-label').innerText = `${data.length} Records`;
    renderSelectedList();
  };

  const renderSelectedList = () => {
    const selectedList = document.getElementById('assoc-selected-list');
    document.getElementById('assoc-selected-count').innerText = selectedExistingIds.length;
    
    if (selectedExistingIds.length === 0) {
      selectedList.innerHTML = '<div class="text-muted" style="font-size: 13px; font-style: italic;">No records selected.</div>';
    } else {
      selectedList.innerHTML = selectedExistingIds.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; font-size: 13px;">
          <span>${item.name}</span>
          <i class="ph ph-x" style="cursor: pointer; color: var(--text-muted);" onclick="window.selectAssoc('${item.id}', false, '${item.name}')"></i>
        </div>
      `).join('');
    }
  };

  const renderCreateForm = () => {
    const form = document.getElementById('assoc-create-form');
    form.innerHTML = ''; // reset
    if (currentAssocType === 'Company') {
      form.innerHTML = `<div class="form-group"><label>Company Name <span class="required">*</span></label><input type="text" class="form-control assoc-input" required></div><div class="form-group"><label>Company Domain Name</label><input type="text" class="form-control assoc-input"></div>`;
    } else if (currentAssocType === 'Contact') {
      form.innerHTML = `<div class="form-group"><label>First Name <span class="required">*</span></label><input type="text" class="form-control assoc-input" required></div><div class="form-group"><label>Last Name</label><input type="text" class="form-control assoc-input"></div><div class="form-group"><label>Email</label><input type="email" class="form-control assoc-input"></div>`;
    } else if (currentAssocType === 'Deal') {
      form.innerHTML = `<div class="form-group"><label>Deal Name <span class="required">*</span></label><input type="text" class="form-control assoc-input" required></div><div class="form-group"><label>Pipeline <span class="required">*</span></label><select class="form-control assoc-input" required><option>Sales Pipeline</option><option>Outbound Target Account</option></select></div><div class="form-group"><label>Amount</label><input type="number" class="form-control assoc-input"></div>`;
    }

    form.querySelectorAll('.assoc-input').forEach(input => {
      input.addEventListener('input', () => {
        isDirty = true;
        validateForm();
      });
    });
  };

  const validateForm = () => {
    const form = document.getElementById('assoc-create-form');
    const isValid = form.checkValidity();
    document.getElementById('save-assoc').disabled = !isValid;
  };

  window.selectAssoc = (id, checked, name) => {
    if (checked) {
      if (!selectedExistingIds.find(item => item.id === id)) {
        selectedExistingIds.push({id, name});
      }
    } else {
      selectedExistingIds = selectedExistingIds.filter(item => item.id !== id);
    }
    
    // Update checkboxes visually
    const cb = document.querySelector(`input[name="assoc_select"][value="${id}"]`);
    if (cb) cb.checked = checked;
    
    renderSelectedList();
    document.getElementById('save-assoc').disabled = selectedExistingIds.length === 0;
  };

  const switchTab = (tabName) => {
    document.querySelectorAll('#assoc-modal-tabs .drawer-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`#assoc-modal-tabs .drawer-tab[data-tab="${tabName}"]`).classList.add('active');
    
    document.getElementById('assoc-panel-create-new').style.display = tabName === 'create-new' ? 'block' : 'none';
    document.getElementById('assoc-panel-add-existing').style.display = tabName === 'add-existing' ? 'block' : 'none';
    
    document.getElementById('save-assoc').disabled = tabName === 'add-existing' && selectedExistingIds.length === 0;
    if (tabName === 'create-new') validateForm();
  };

  document.querySelectorAll('#assoc-modal-tabs .drawer-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      switchTab(e.target.getAttribute('data-tab'));
    });
  });

  const closeModal = () => {
    if (isDirty || selectedExistingIds.length > 0) {
      if (!confirm("Discard changes?")) return;
    }
    drawer.classList.remove('active');
    if (document.querySelectorAll('.drawer.active').length === 0 && overlay) {
      overlay.classList.remove('active');
    }
    isDirty = false;
    selectedExistingIds = [];
  };

  document.getElementById('close-assoc-modal').addEventListener('click', closeModal);
  document.getElementById('cancel-assoc').addEventListener('click', closeModal);

  document.getElementById('save-assoc').addEventListener('click', () => {
    const isCreateNew = document.querySelector('#assoc-modal-tabs .drawer-tab.active').getAttribute('data-tab') === 'create-new';
    
    let recordName = "New Record";
    if (isCreateNew) {
      recordName = document.querySelector('#assoc-create-form input').value;
    } else {
      const data = getMockData(currentAssocType);
      const record = data.find(d => d.id === selectedExistingId);
      recordName = record ? record.name : "Unknown";
      associatedRecords[currentAssocType].push(selectedExistingId);
    }

    // Refresh UI
    const cardId = `card-${currentAssocType.toLowerCase()}s`;
    const card = document.getElementById(cardId);
    if (card) {
      const emptyState = card.querySelector('.empty-state');
      if (emptyState) emptyState.style.display = 'none';
      
      const newRow = document.createElement('div');
      newRow.style.padding = '12px 16px';
      newRow.style.borderTop = '1px solid var(--border-color)';
      newRow.style.display = 'flex';
      newRow.style.justifyContent = 'space-between';
      newRow.innerHTML = `
        <div><a href="#" style="font-weight: 500; text-decoration: none; color: var(--primary-teal);">${recordName}</a></div>
        <button class="btn-remove-assoc" style="background:none;border:none;color:var(--text-light);cursor:pointer;" title="Remove association"><i class="ph ph-x"></i></button>
      `;
      
      newRow.querySelector('.btn-remove-assoc').addEventListener('click', (e) => {
        if(confirm("This will only remove the association, not delete the record. Continue?")) {
           newRow.remove();
           // Update count
           const header = card.querySelector('.card-header strong');
           if (header) {
             const count = card.querySelectorAll(':scope > div:not(.card-header):not(.empty-state)').length;
             header.innerText = `${currentAssocType}s (${count})`;
           }
           if (card.querySelectorAll(':scope > div:not(.card-header):not(.empty-state)').length === 0) {
              if (emptyState) emptyState.style.display = 'block';
           }
        }
      });
      card.appendChild(newRow);
      
      const header = card.querySelector('.card-header strong');
      if (header) {
        const count = card.querySelectorAll(':scope > div:not(.card-header):not(.empty-state)').length;
        header.innerText = `${currentAssocType}s (${count})`;
      }
    }

    // Append to timeline if available
    const timeline = document.querySelector('.timeline-container');
    if (timeline) {
      const timeItem = document.createElement('div');
      timeItem.className = 'timeline-item';
      timeItem.innerHTML = `
        <div class="timeline-icon"><i class="ph ph-link"></i></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <strong>${currentAssocType} Associated</strong>
            <span class="timeline-time">Just now</span>
          </div>
          <div class="timeline-body">
            Associated ${currentAssocType}: <strong>${recordName}</strong>.
          </div>
        </div>
      `;
      // insert after the month header if it exists, else just prepend
      const monthHeader = timeline.querySelector('.timeline-month');
      if (monthHeader) {
        monthHeader.after(timeItem);
      } else {
        timeline.prepend(timeItem);
      }
    }

    alert(`Successfully associated ${recordName}!`);
    isDirty = false;
    closeModal();
  });

  document.querySelectorAll('.btn-add-assoc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.getAttribute('data-assoc-type');
      openModal(type);
    });
  });
};

// --- ALL PROPERTIES & CUSTOM FIELDS LOGIC ---

window.currentContactId = "contact-001";
window.currentPropFilter = "all";

window.renderAllProperties = function() {
  const listEl = document.getElementById('all-properties-list');
  const searchInput = document.getElementById('search-properties-input');
  if (!listEl) return;
  
  let q = searchInput ? searchInput.value.toLowerCase() : "";
  
  let filteredDefs = window.mockFieldDefinitions.filter(def => {
    if (q && !def.label.toLowerCase().includes(q)) return false;
    if (window.currentPropFilter === 'system' && !def.isSystem) return false;
    if (window.currentPropFilter === 'custom' && def.isSystem) return false;
    return true;
  });

  listEl.innerHTML = '';
  filteredDefs.forEach(def => {
    let valObj = window.mockFieldValues.find(v => v.fieldKey === def.key && v.contactId === window.currentContactId);
    let val = valObj ? valObj.value : '--';
    
    let icon = def.isSystem ? '<i class="ph ph-lock-key" style="color: var(--text-light); margin-left: 8px;" title="System Field"></i>' : '';
    
    let html = `
      <div style="padding: 12px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: flex-start; position: relative;" class="prop-item-row">
        <div style="flex: 1;">
          <div style="font-size: 13px; font-weight: 500; color: var(--text-dark); margin-bottom: 4px; display: flex; align-items: center;">
            ${def.label} ${icon}
          </div>
          <div style="font-size: 13px; color: var(--text-muted);">${val}</div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.openEditPropModal('${def.key}')">Edit</button>
      </div>
    `;
    listEl.insertAdjacentHTML('beforeend', html);
  });
};

window.toggleCfOptions = function() {
  const type = document.getElementById('cf-type').value;
  const optGroup = document.getElementById('cf-options-group');
  if (optGroup) {
    optGroup.style.display = type === 'dropdown' ? 'block' : 'none';
  }
};

window.saveCustomField = function() {
  const label = document.getElementById('cf-label').value.trim();
  const type = document.getElementById('cf-type').value;
  const scope = document.getElementById('cf-scope').value;
  const opts = document.getElementById('cf-options').value;
  
  if (!label) {
    alert("Field label is required.");
    return;
  }
  
  let key = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
  if (window.mockFieldDefinitions.find(d => d.key === key)) {
    alert("This property already exists.");
    return;
  }
  
  let newDef = {
    key: key,
    label: label,
    type: type,
    isSystem: false,
    scope: scope
  };
  
  if (type === 'dropdown') {
    newDef.options = opts.split(',').map(o => o.trim()).filter(o => o);
  }
  
  window.mockFieldDefinitions.push(newDef);
  
  window.mockAuditLogs.push({
    action: "Create Custom Field",
    field: label,
    timestamp: new Date().toISOString()
  });
  console.log("[Audit] Custom Field created:", newDef);
  
  alert("Custom field created successfully!");
  
  document.getElementById('cf-label').value = '';
  document.getElementById('cf-options').value = '';
  document.getElementById('cf-type').value = 'text';
  window.toggleCfOptions();
  
  document.getElementById('drawer-add-custom-field').classList.remove('active');
  window.renderAllProperties();
};

window.openEditPropModal = function(key) {
  const def = window.mockFieldDefinitions.find(d => d.key === key);
  if (!def) return;
  
  document.getElementById('edit-prop-title').innerText = `Edit ${def.label}`;
  document.getElementById('edit-prop-key').value = key;
  
  let valObj = window.mockFieldValues.find(v => v.fieldKey === key && v.contactId === window.currentContactId);
  let currentVal = valObj ? valObj.value : '';
  if (currentVal === '--') currentVal = '';
  
  const container = document.getElementById('edit-prop-input-container');
  container.innerHTML = '';
  
  if (def.type === 'dropdown' && def.options) {
    let select = document.createElement('select');
    select.className = 'form-control';
    select.id = 'edit-prop-input';
    select.innerHTML = `<option value="">-- None --</option>`;
    def.options.forEach(opt => {
      let isSel = (opt === currentVal) ? 'selected' : '';
      select.innerHTML += `<option value="${opt}" ${isSel}>${opt}</option>`;
    });
    container.appendChild(select);
  } else if (def.type === 'date') {
    let input = document.createElement('input');
    input.type = 'date';
    input.className = 'form-control';
    input.id = 'edit-prop-input';
    input.value = currentVal; 
    container.appendChild(input);
  } else if (def.type === 'number') {
    let input = document.createElement('input');
    input.type = 'number';
    input.className = 'form-control';
    input.id = 'edit-prop-input';
    input.value = currentVal;
    container.appendChild(input);
  } else if (def.type === 'textarea') {
    let textarea = document.createElement('textarea');
    textarea.className = 'form-control';
    textarea.id = 'edit-prop-input';
    textarea.value = currentVal;
    container.appendChild(textarea);
  } else if (def.type === 'checkbox') {
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'edit-prop-input';
    input.checked = currentVal === 'true' || currentVal === true;
    container.appendChild(input);
  } else {
    let input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.id = 'edit-prop-input';
    input.value = currentVal;
    container.appendChild(input);
  }
  
  document.getElementById('modal-edit-property').style.display = 'flex';
};

window.closeEditPropModal = function() {
  document.getElementById('modal-edit-property').style.display = 'none';
};

window.savePropertyValue = function() {
  const key = document.getElementById('edit-prop-key').value;
  const input = document.getElementById('edit-prop-input');
  
  let val = input.value;
  if (input.type === 'checkbox') {
    val = input.checked ? 'true' : 'false';
  }
  
  let def = window.mockFieldDefinitions.find(d => d.key === key);
  
  let valObj = window.mockFieldValues.find(v => v.fieldKey === key && v.contactId === window.currentContactId);
  let oldVal = valObj ? valObj.value : '--';
  
  if (valObj) {
    valObj.value = val;
  } else {
    window.mockFieldValues.push({ contactId: window.currentContactId, fieldKey: key, value: val });
  }
  
  window.mockAuditLogs.push({
    action: "Update Property Value",
    field: def.label,
    oldValue: oldVal,
    newValue: val,
    timestamp: new Date().toISOString()
  });
  console.log(`[Audit] Property '${def.label}' updated from '${oldVal}' to '${val}'`);
  
  window.closeEditPropModal();
  window.renderAllProperties();
  
  updateLeftPanelProps(key, val);
};

function updateLeftPanelProps(key, val) {
  let def = window.mockFieldDefinitions.find(d => d.key === key);
  if (!def) return;
  const propList = document.getElementById('about-props');
  if (!propList) return;
  
  let labels = propList.querySelectorAll('.property-label');
  labels.forEach(l => {
    if (l.innerText.trim() === def.label) {
      l.nextElementSibling.innerText = val || '--';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-properties-input');
  if (searchInput) {
    searchInput.addEventListener('input', window.renderAllProperties);
  }

  document.querySelectorAll('.filter-prop-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-prop-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      window.currentPropFilter = e.target.getAttribute('data-filter');
      window.renderAllProperties();
    });
  });

  // --- COMPANY INTELLIGENCE UI BINDING ---
  window.initCompanyIntelligenceUI = function() {
    const motionEl = document.getElementById('summary-motion');
    if (!motionEl) return; // Not on company.html
    
    const urlParams = new URLSearchParams(window.location.search);
    let compId = urlParams.get('id') || "company-hubspot";
    let comp = window.mockCompanies.find(c => c.id === compId);
    if(!comp) return;

    // Update Company Name in Header if possible
    const headerTitle = document.querySelector('.page-title h1');
    if (headerTitle) {
      headerTitle.innerHTML = `<i class="ph ph-buildings" style="margin-right: 8px;"></i> ${comp.name}`;
      const domainSpan = document.querySelector('.page-title span');
      if (domainSpan && domainSpan.textContent.includes('hubspot.com')) {
         domainSpan.textContent = comp.domain;
      }
    }

    function render() {
      comp = window.calculateCompanyIntelligence(compId);
      
      // Update Summary
      if(document.getElementById('summary-motion')) document.getElementById('summary-motion').textContent = comp.motion;
      if(document.getElementById('summary-motion-reason')) document.getElementById('summary-motion-reason').textContent = comp.motion === 'Farming' ? "Closed Won deals exist" : "No Closed Won deals yet";
      if(document.getElementById('summary-pursue')) document.getElementById('summary-pursue').textContent = comp.pursueRecommendation;
      if(document.getElementById('summary-tier')) document.getElementById('summary-tier').textContent = comp.motion === 'Farming' ? comp.accountTier : comp.prospectClassification;
      if(document.getElementById('summary-wallet')) document.getElementById('summary-wallet').textContent = window.formatCurrency(comp.addressableWallet || 0);
      if(document.getElementById('summary-tag')) document.getElementById('summary-tag').textContent = comp.potentialTag || "None";
      if(document.getElementById('summary-health')) document.getElementById('summary-health').textContent = comp.health ? `${comp.health.revenueConfidence} - ${comp.health.relationshipHealth}` : "N/A";
      if(document.getElementById('summary-coverage')) document.getElementById('summary-coverage').textContent = comp.accountTier === 'Mega Account' ? 'Weekly + QBR' : 'Monthly';
      if(document.getElementById('summary-action')) document.getElementById('summary-action').textContent = comp.nextAction;
      
      const escalationEl = document.getElementById('summary-escalation');
      if(escalationEl) {
        if (comp.health?.relationshipHealth === 'Critical' || comp.health?.relationshipHealth === 'Red') {
          escalationEl.style.display = 'block';
        } else {
          escalationEl.style.display = 'none';
        }
      }
      
      // Update Hunting Math
      if(document.getElementById('customer-size-tier')) document.getElementById('customer-size-tier').textContent = comp.prospectClassification;
      if(document.getElementById('ai-customer-revenue')) document.getElementById('ai-customer-revenue').value = comp.annualRevenue || '';
      if(document.getElementById('calc-it-budget')) document.getElementById('calc-it-budget').textContent = window.formatCurrency(comp.estItBudget || 0);
      if(document.getElementById('calc-outsourceable')) document.getElementById('calc-outsourceable').textContent = window.formatCurrency(comp.outsourceableWallet || 0);
      if(document.getElementById('calc-addressable')) document.getElementById('calc-addressable').textContent = window.formatCurrency(comp.addressableWallet || 0);
      
      // Matrix Score
      if(document.getElementById('prospect-total-score')) document.getElementById('prospect-total-score').textContent = `Score: ${comp.totalScore}/24`;
      const scoreSliders = document.querySelectorAll('.ai-score');
      if (comp.matrixScores && scoreSliders.length > 0) {
        scoreSliders.forEach((slider, i) => {
          if(comp.matrixScores[i] !== undefined) {
            slider.value = comp.matrixScores[i];
            slider.nextElementSibling.textContent = comp.matrixScores[i];
          }
        });
      }

      // Strategy & Health fields
      const healthReasonGrp = document.getElementById('ai-health-reason-group');
      const healthSelect = document.getElementById('ai-account-health');
      if (healthSelect && comp.health) {
        healthSelect.value = comp.health.relationshipHealth;
        if (comp.health.relationshipHealth === 'Red' || comp.health.relationshipHealth === 'Critical') {
           if(healthReasonGrp) healthReasonGrp.style.display = 'block';
           const reasonInput = healthReasonGrp.querySelector('input');
           if(reasonInput) reasonInput.value = comp.health.reason || '';
        } else {
           if(healthReasonGrp) healthReasonGrp.style.display = 'none';
        }
      }
      if(document.getElementById('ai-revenue-confidence') && comp.health) document.getElementById('ai-revenue-confidence').value = comp.health.revenueConfidence;
      if(document.getElementById('ai-potential-tag')) document.getElementById('ai-potential-tag').value = comp.potentialTag || "";
      if(document.getElementById('ai-whale-flag')) document.getElementById('ai-whale-flag').checked = comp.whaleFlag;

      // Farming panel lock
      const lockOverlay = document.getElementById('farming-locked-overlay');
      if (comp.motion === 'Hunting') {
        if(lockOverlay) lockOverlay.style.display = 'flex';
      } else {
        if(lockOverlay) lockOverlay.style.display = 'none';
        if(document.getElementById('ai-ttm-revenue')) document.getElementById('ai-ttm-revenue').value = comp.ttmRevenue;
        if(document.getElementById('ai-farming-tier')) document.getElementById('ai-farming-tier').textContent = comp.accountTier;
      }
    }

    // Bind listeners
    const revInput = document.getElementById('ai-customer-revenue');
    if(revInput) {
      revInput.addEventListener('input', (e) => {
        comp.annualRevenue = window.parseAmount(e.target.value);
        render();
      });
    }
    
    const outInput = document.getElementById('ai-outsourceable');
    if(outInput) {
      outInput.addEventListener('input', (e) => {
        comp.outsourceablePercent = parseInt(e.target.value);
        render();
      });
    }
    
    const capInput = document.getElementById('ai-capture-rate');
    if(capInput) {
      capInput.addEventListener('input', (e) => {
        comp.captureRatePercent = parseInt(e.target.value);
        render();
      });
    }

    const scoreSliders = document.querySelectorAll('.ai-score');
    scoreSliders.forEach((slider, i) => {
      slider.addEventListener('input', (e) => {
        if (!comp.matrixScores) comp.matrixScores = [0,0,0,0,0,0,0,0];
        comp.matrixScores[i] = parseInt(e.target.value);
        render();
      });
    });

    const healthSelect = document.getElementById('ai-account-health');
    if(healthSelect) {
      healthSelect.addEventListener('change', (e) => {
        if(!comp.health) comp.health = {};
        comp.health.relationshipHealth = e.target.value;
        render();
      });
    }

    const healthReasonGrp = document.getElementById('ai-health-reason-group');
    if(healthReasonGrp) {
        const reasonInput = healthReasonGrp.querySelector('input');
        if(reasonInput) {
            reasonInput.addEventListener('input', (e) => {
                if(!comp.health) comp.health = {};
                comp.health.reason = e.target.value;
            });
            reasonInput.addEventListener('blur', render);
        }
    }

    const revConfSelect = document.getElementById('ai-revenue-confidence');
    if(revConfSelect) {
        revConfSelect.addEventListener('change', (e) => {
            if(!comp.health) comp.health = {};
            comp.health.revenueConfidence = e.target.value;
            render();
        });
    }

    const potentialTagSelect = document.getElementById('ai-potential-tag');
    if(potentialTagSelect) {
        potentialTagSelect.addEventListener('change', (e) => {
            comp.potentialTag = e.target.value;
            render();
        });
    }

    const whaleFlagCb = document.getElementById('ai-whale-flag');
    if(whaleFlagCb) {
        whaleFlagCb.addEventListener('change', (e) => {
            comp.whaleFlag = e.target.checked;
            render();
        });
    }

    render();
  };
  setTimeout(window.initCompanyIntelligenceUI, 200);

  // --- DEAL INTELLIGENCE UI BINDING ---
  window.initDealIntelligenceUI = function() {
    const motionEl = document.getElementById('deal-comp-motion');
    if (!motionEl) return; // Not on deal.html

    const urlParams = new URLSearchParams(window.location.search);
    const dealId = urlParams.get('id') || "D-626-0000037"; // mock default
    const deal = window.mockDeals.find(d => d.id === dealId);
    
    let compId = "company-hubspot";
    if (deal) {
        if (deal.companyId) compId = deal.companyId;
        else if (deal.company) {
            const cMatch = window.mockCompanies.find(c => c.name === deal.company);
            if (cMatch) compId = cMatch.id;
        }
    }

    const comp = window.calculateCompanyIntelligence(compId);
    if (!comp) return;

    if(document.getElementById('deal-comp-motion')) document.getElementById('deal-comp-motion').textContent = comp.motion;
    if(document.getElementById('deal-comp-tier')) document.getElementById('deal-comp-tier').textContent = comp.motion === 'Farming' ? comp.accountTier : comp.prospectClassification;
    if(document.getElementById('deal-comp-tag')) document.getElementById('deal-comp-tag').textContent = comp.potentialTag || "None";
    
    const healthEl = document.getElementById('deal-comp-health');
    if(healthEl && comp.health) {
        healthEl.innerHTML = `<i class="ph-fill ph-warning-circle" style="margin-right: 4px;"></i> ${comp.health.relationshipHealth}`;
        if(comp.health.relationshipHealth === 'Red' || comp.health.relationshipHealth === 'Critical') {
            healthEl.style.color = '#DC2626';
        } else if (comp.health.relationshipHealth === 'Yellow') {
            healthEl.style.color = '#D97706';
        } else {
            healthEl.style.color = '#10B981';
        }
    }
    if(document.getElementById('deal-comp-pursue')) document.getElementById('deal-comp-pursue').textContent = comp.pursueRecommendation;
  };
  // --- FORECAST TARGET DASHBOARD ---
  function getClosedWonDeals(year, team) {
    return window.mockDeals.filter(d => {
      const isWon = (d.stage === 'Closed Won' || d.stage === 'Closed Won (100%)' || d.dealStage === 'Closed Won');
      if (!isWon) return false;
      const dYear = new Date(d.closeDate).getFullYear().toString();
      if (dYear !== year) return false;
      if (team && team !== 'Total' && d.team !== team) return false;
      return true;
    });
  }

  function renderTargetDashboard(year) {
    const container = document.getElementById('target-dashboard-container');
    if (!container) return;
    
    // Total Company Target
    let totalTarget = window.mockRevenueTargets.find(t => t.year === year && t.team === 'Total');
    if (!totalTarget) {
      totalTarget = { bookingTarget: 0, invoiceTarget: 0 };
    }
    
    const totalWon = getClosedWonDeals(year, 'Total').reduce((sum, d) => sum + window.parseAmount(d.amount), 0);
    const bookingAchieved = totalTarget.bookingTarget ? (totalWon / totalTarget.bookingTarget) * 100 : 0;
    
    // Team Targets
    const teams = [...new Set(window.mockDeals.map(d => d.team).filter(Boolean))];
    
    let html = `
      <div class="target-section">
        <div class="target-section-title">Total Revenue Target Level - ${year}</div>
        <div class="target-cards-grid">
          <div class="target-card">
            <div class="target-card-title">Booking Target</div>
            <div class="target-card-value">${totalTarget.bookingTarget ? window.formatCurrency(totalTarget.bookingTarget) : '<span style="color:#94a3b8; font-size: 16px;">Not set</span>'}</div>
            <div class="target-card-subtitle">Yearly goal for ${year}</div>
          </div>
          <div class="target-card">
            <div class="target-card-title">Invoice Target</div>
            <div class="target-card-value">${totalTarget.invoiceTarget ? window.formatCurrency(totalTarget.invoiceTarget) : '<span style="color:#94a3b8; font-size: 16px;">Not set</span>'}</div>
            <div class="target-card-subtitle">Expected billing for ${year}</div>
          </div>
          <div class="target-card" style="border-top: 3px solid var(--primary-teal);">
            <div class="target-card-title" style="color: var(--primary-teal); font-weight: 600;">Current Forecast (Won)</div>
            <div class="target-card-value">${window.formatCurrency(totalWon)}</div>
            <div class="target-card-subtitle">
              <span>Achieved: ${bookingAchieved.toFixed(1)}%</span>
            </div>
            <div class="achievement-bar-bg">
              <div class="achievement-bar-fill" style="width: ${Math.min(bookingAchieved, 100)}%; background-color: ${bookingAchieved < 50 ? '#EF4444' : (bookingAchieved < 80 ? '#F59E0B' : '#10B981')};"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="target-section">
        <div class="target-section-title">Team Revenue Target Level - ${year}</div>
        <div class="target-cards-grid">
    `;
    
    teams.forEach(team => {
      let teamTarget = window.mockRevenueTargets.find(t => t.year === year && t.team === team);
      if (!teamTarget) {
        teamTarget = { bookingTarget: 0, invoiceTarget: 0 };
      }
      const teamWon = getClosedWonDeals(year, team).reduce((sum, d) => sum + window.parseAmount(d.amount), 0);
      const teamAchieved = teamTarget.bookingTarget ? (teamWon / teamTarget.bookingTarget) * 100 : 0;
      
      html += `
        <div class="target-card">
          <div style="font-weight: 600; font-size: 15px; color: var(--text-dark); margin-bottom: 12px; display: flex; justify-content: space-between;">
            ${team}
            <span class="badge-status ${teamAchieved >= 80 ? 'badge-green' : (teamAchieved >= 50 ? 'badge-yellow' : (teamTarget.bookingTarget ? 'badge-red' : 'badge-gray'))}">
              ${teamTarget.bookingTarget ? teamAchieved.toFixed(1) + '%' : 'N/A'}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
            <span style="color: var(--text-muted);">Booking:</span>
            <span style="font-weight: 500;">${teamTarget.bookingTarget ? window.formatCurrency(teamTarget.bookingTarget) : 'Not set'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
            <span style="color: var(--text-muted);">Invoice:</span>
            <span style="font-weight: 500;">${teamTarget.invoiceTarget ? window.formatCurrency(teamTarget.invoiceTarget) : 'Not set'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 8px;">
            <span style="color: var(--text-dark); font-weight: 500;">Current Forecast:</span>
            <span style="font-weight: 600; color: var(--primary-teal);">${window.formatCurrency(teamWon)}</span>
          </div>
          <div class="achievement-bar-bg">
            <div class="achievement-bar-fill" style="width: ${Math.min(teamAchieved, 100)}%; background-color: ${teamAchieved < 50 ? '#EF4444' : (teamAchieved < 80 ? '#F59E0B' : '#10B981')};"></div>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    container.innerHTML = html;
  }

  function initTargetDashboard() {
    const btnEditTargets = document.getElementById('btn-edit-targets');
    const modal = document.getElementById('target-modal');
    const btnCloseModal = document.getElementById('btn-close-target-modal');
    const btnCancel = document.getElementById('btn-cancel-targets');
    const btnSave = document.getElementById('btn-save-targets');
    const yearSelect = document.getElementById('target-modal-year');
    const teamsContainer = document.getElementById('target-modal-teams-container');
    const globalYearFilter = document.querySelector('.forecast-layout select'); // first select is year
    
    if (!btnEditTargets || !modal) return;
    
    let selectedYear = globalYearFilter ? globalYearFilter.value : '2026';
    renderTargetDashboard(selectedYear);
    
    if (globalYearFilter) {
      globalYearFilter.addEventListener('change', (e) => {
        selectedYear = e.target.value;
        renderTargetDashboard(selectedYear);
      });
    }
    
    const openModal = () => {
      yearSelect.value = selectedYear;
      renderModalInputs(selectedYear);
      modal.style.display = 'flex';
    };
    
    const closeModal = () => {
      modal.style.display = 'none';
    };
    
    const renderModalInputs = (year) => {
      // Total
      const totalTarget = window.mockRevenueTargets.find(t => t.year === year && t.team === 'Total') || { bookingTarget: '', invoiceTarget: '' };
      document.getElementById('target-input-total-booking').value = totalTarget.bookingTarget || '';
      document.getElementById('target-input-total-invoice').value = totalTarget.invoiceTarget || '';
      
      // Teams
      const teams = [...new Set(window.mockDeals.map(d => d.team).filter(Boolean))];
      let teamsHtml = '';
      teams.forEach(team => {
        const tTarget = window.mockRevenueTargets.find(t => t.year === year && t.team === team) || { bookingTarget: '', invoiceTarget: '' };
        teamsHtml += `
          <div class="target-input-row team-target-row" data-team="${team}">
            <div style="font-size: 14px;">${team}</div>
            <div><input type="number" class="form-control team-booking" min="0" step="1" value="${tTarget.bookingTarget || ''}"></div>
            <div><input type="number" class="form-control team-invoice" min="0" step="1" value="${tTarget.invoiceTarget || ''}"></div>
          </div>
        `;
      });
      teamsContainer.innerHTML = teamsHtml;
    };
    
    yearSelect.addEventListener('change', (e) => {
      renderModalInputs(e.target.value);
    });
    
    btnEditTargets.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    
    btnSave.addEventListener('click', () => {
      const year = yearSelect.value;
      
      // Parse Total
      const tBooking = parseFloat(document.getElementById('target-input-total-booking').value) || 0;
      const tInvoice = parseFloat(document.getElementById('target-input-total-invoice').value) || 0;
      
      // Update or create
      let tTarget = window.mockRevenueTargets.find(t => t.year === year && t.team === 'Total');
      if (tTarget) {
        tTarget.bookingTarget = tBooking;
        tTarget.invoiceTarget = tInvoice;
      } else {
        window.mockRevenueTargets.push({ year, team: 'Total', bookingTarget: tBooking, invoiceTarget: tInvoice });
      }
      
      // Parse Teams
      const teamRows = teamsContainer.querySelectorAll('.team-target-row');
      teamRows.forEach(row => {
        const team = row.getAttribute('data-team');
        const b = parseFloat(row.querySelector('.team-booking').value) || 0;
        const i = parseFloat(row.querySelector('.team-invoice').value) || 0;
        
        let target = window.mockRevenueTargets.find(t => t.year === year && t.team === team);
        if (target) {
          target.bookingTarget = b;
          target.invoiceTarget = i;
        } else {
          window.mockRevenueTargets.push({ year, team, bookingTarget: b, invoiceTarget: i });
        }
      });
      
      // Push Audit Log
      window.mockTargetAuditLogs.push({
        timestamp: new Date().toISOString(),
        user: 'Admin',
        year: year,
        action: 'Updated revenue targets'
      });
      
      if (globalYearFilter && globalYearFilter.value !== year) {
          globalYearFilter.value = year;
          selectedYear = year;
      }
      
      renderTargetDashboard(selectedYear);
      closeModal();
      if(typeof showToast === 'function') showToast('Revenue targets updated successfully');
    });
  }

  setTimeout(initTargetDashboard, 150);
  
  setTimeout(window.initDealIntelligenceUI, 200);
  setTimeout(initAssociationManager, 100);
  setTimeout(initForecastRegistration, 100);
  setTimeout(initForecastModule, 100);

});

// --- Routing Workspace Logic ---
window.isRoutingConfirmed = false;

window.addRoutingComment = function() {
  if (window.isRoutingConfirmed) {
    alert("Routing is already confirmed. Discussion is locked.");
    return;
  }
  
  const textInput = document.getElementById('routing-comment-text');
  const thread = document.getElementById('routing-discussion-thread');
  const emptyMsg = document.getElementById('empty-routing-discussion');
  
  if (!textInput || !textInput.value.trim()) return;
  
  if (emptyMsg) emptyMsg.style.display = 'none';
  
  const text = textInput.value;
  const time = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const commentId = 'rc-' + Date.now();
  
  let borderColor = 'var(--border-color)';
  let bg = '#F8FAFC';
  let badgeHtml = '';
  
  const html = `
    <div style="display: flex; flex-direction: row-reverse; gap: 12px; margin-bottom: 8px;" id="${commentId}">
      <div class="company-avatar" style="width: 32px; height: 32px; font-size: 14px; flex-shrink: 0; background: var(--primary-teal); color: #fff;">ME</div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; max-width: 80%;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-direction: row-reverse;">
          <span style="font-weight: 600; font-size: 12px; color: var(--text-dark);">Current User</span>
          <span style="font-size: 11px; color: var(--text-light);">${time}</span>
          ${badgeHtml}
        </div>
        <div style="font-size: 13px; color: var(--text-dark); background: ${bg}; padding: 10px 14px; border-radius: 16px 4px 16px 16px; border: 1px solid ${borderColor}; margin-bottom: 4px; text-align: left; box-shadow: 0 1px 2px rgba(0,0,0,0.05);" class="rc-content">
          ${text}
        </div>
        <div style="display: flex; gap: 12px; align-items: center; justify-content: flex-end;">
          <span class="btn-mark-decision" style="font-size: 11px; color: #D97706; cursor: pointer; display: flex; align-items: center; gap: 4px; font-weight: 500;" onclick="window.markRoutingDecision('${commentId}')"><i class="ph ph-check-circle"></i> Mark as Decision</span>
        </div>
      </div>
    </div>
  `;
  
  thread.insertAdjacentHTML('beforeend', html);
  textInput.value = '';
  
  thread.scrollTop = thread.scrollHeight;
  
  if(window.addAuditLog) window.addAuditLog('Routing Comment Added', `User added a comment.`);
};

window.markRoutingDecision = function(id) {
  document.querySelectorAll('.rc-content').forEach(el => el.style.borderWidth = '1px');
  
  const commentEl = document.getElementById(id);
  if (commentEl) {
    const content = commentEl.querySelector('.rc-content');
    content.style.border = '2px solid #D97706';
    
    // Add to Decision Log
    const logList = document.getElementById('decision-log-list');
    const logContainer = document.getElementById('decision-log-container');
    if (logList && logContainer) {
      logContainer.style.display = 'block';
      const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const date = new Date().toISOString().substring(0,10);
      const logHtml = `
        <div style="background: #FFFBEB; border: 1px solid #FCD34D; padding: 8px 12px; border-radius: 4px; font-size: 12px; color: #92400E; display: flex; align-items: flex-start; gap: 8px;">
          <i class="ph ph-check-circle" style="font-size: 16px; color: #D97706; margin-top: 2px;"></i>
          <div>
            <div style="font-weight: 600; margin-bottom: 2px;">Marked as Decision at ${time}</div>
            <div>${content.innerText}</div>
          </div>
        </div>
      `;
      logList.insertAdjacentHTML('beforeend', logHtml);
      
      // Update Execution Ownership sidebar
      const viewExecNote = document.getElementById('view-exec-note');
      if (viewExecNote) viewExecNote.innerText = content.innerText;
      
      const viewExecStatus = document.getElementById('view-exec-status');
      if (viewExecStatus) viewExecStatus.innerHTML = '<span class="badge" style="background: #10B981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Decided</span>';
      
      const viewExecDate = document.getElementById('view-exec-date');
      if (viewExecDate) viewExecDate.innerText = date;
      
      const viewExecBy = document.getElementById('view-exec-by');
      if (viewExecBy) viewExecBy.innerText = 'Current User';
      
      const viewExecDecision = document.getElementById('view-exec-decision');
      if (viewExecDecision) viewExecDecision.innerText = 'Confirmed';
    }
  }
  if(window.addAuditLog) window.addAuditLog('Decision Marked', `User marked comment as Decision.`);
};

window.confirmRoutingDecision = function() {
  const primaryInput = document.getElementById('primary-responsible-input');
  const supportInput = document.getElementById('supporting-responsible-input');
  const primary = primaryInput ? primaryInput.value : '';
  const support = supportInput ? supportInput.value : '';
  
  if (!primary) {
    alert("Please select a Primary Responsible.");
    return;
  }
  
  const overrideReason = document.getElementById('override-reason-input')?.value;
  
  if (primary === 'TC' && (!overrideReason || overrideReason.trim() === '')) {
    alert("OVERRIDE REASON is required because Primary differs from System Suggestion (Delivery BU).");
    return;
  }
  
  window.isRoutingConfirmed = true;
  
  const badge = document.getElementById('routing-status-badge');
  if (badge) {
    badge.className = 'badge b-blue';
    badge.innerText = 'Confirmed';
    badge.style.background = '#E0F2FE';
    badge.style.color = '#0284C7';
    badge.style.border = '1px solid #7DD3FC';
  }
  
  const inputEl = document.getElementById('override-reason-input');
  const btnConfirm = document.getElementById('btn-confirm-routing');
  
  if (primaryInput) primaryInput.disabled = true;
  if (supportInput) supportInput.disabled = true;
  if (inputEl) inputEl.disabled = true;
  if (btnConfirm) btnConfirm.style.display = 'none';
  
  const viewPm = document.getElementById('view-pm');
  const viewSm = document.getElementById('view-sm');
  
  if (viewPm) viewPm.innerText = primary;
  if (viewSm) viewSm.innerText = support || '--';
  
  if(window.addAuditLog) window.addAuditLog('Routing Confirmed', `Primary: ${primary}, Support: ${support}. Reason: ${overrideReason || 'N/A'}`);
};

if (!window.addAuditLog) {
  window.addAuditLog = function(title, desc) {
    const container = document.querySelector('.timeline-container');
    if (container) {
      const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const html = `
        <div class="timeline-item">
          <div class="timeline-icon"><i class="ph ph-info" style="color: #3B82F6;"></i></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <strong>${title}</strong>
              <span class="timeline-time">Today, ${time}</span>
            </div>
            <div class="timeline-body">
              ${desc}
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('afterbegin', html);
    }
  };
}

window.savePostMortem = function() {
  const outcome = document.getElementById('pm-outcome') ? document.getElementById('pm-outcome').value : '';
  if (!outcome) {
    alert("Please select the Final Outcome (Won/Lost) before saving.");
    return;
  }
  
  // Simulate saving to Knowledge Hub
  alert(`Knowledge Record Auto-created in Draft Status!\n\nRedirecting to Case Study Hub...`);
  window.location.href = "case_studies.html";
};

window.validateProposalSubmission = function() {
  if (!window.mockDeliverables) return true;
  const missing = window.mockDeliverables.filter(d => d.isRequired && d.status !== 'Submitted');
  if (missing.length > 0) {
    const missingNames = missing.map(m => m.name).join(', ');
    alert(`Cannot submit proposal. The following required deliverables are incomplete: ${missingNames}`);
    return false;
  }
  return true;
};

document.addEventListener('DOMContentLoaded', () => {
  const bidStatusSelect = document.getElementById('select-bid-status');
  if (bidStatusSelect) {
    let previousValue = bidStatusSelect.value;
    
    bidStatusSelect.addEventListener('change', (e) => {
      const newValue = e.target.value;
      if (['Proposal Presented', 'Done', 'Bid Win'].includes(newValue)) {
        if (!window.validateProposalSubmission()) {
          e.target.value = previousValue;
          return;
        }
      }
      previousValue = newValue;
      if (window.showToast) {
        window.showToast(`Bid status updated to ${newValue}`, 'success');
      } else {
        alert(`Bid status updated to ${newValue}`);
      }
    });
  }
});



