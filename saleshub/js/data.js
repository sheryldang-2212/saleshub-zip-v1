// Mock Data Store

const DB = {
  contacts: [
    { id: 'CON-20260621-0001', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+123456789', owner: 'Hara Nguyen', company: 'COM-001', deal: 'D-20260621-0001', createdAt: '2026-06-20 10:00' },
    { id: 'CON-20260621-0002', firstName: 'Jane', lastName: 'Smith', email: 'jane@acme.com', phone: '+987654321', owner: 'Alex Sales', company: 'COM-002', deal: 'D-20260621-0002', createdAt: '2026-06-21 09:30' }
  ],
  companies: [
    { id: 'COM-20230110-0001', name: 'Acme Corp', owner: 'Alex Sales', createdAt: '1/10/2023 at 8:14 AM', industry: 'Technology', location: 'San Francisco, United States', contacts: 1, deals: 0, lastActivityDate: '8/1/2025 at 4:31 PM', phone: '+1 234 567 8900' },
    { id: 'COM-20230218-0001', name: 'TechVN Ltd', owner: 'Jane Smith', createdAt: '2/18/2023 at 10:00 AM', industry: 'IT Services', location: 'Ho Chi Minh City, Vietnam', contacts: 0, deals: 1, lastActivityDate: '6/2/2025 at 11:00 AM', phone: '+84 28 1234 5678' },
    { id: 'COM-20230322-0001', name: 'TechCorp Solutions', owner: 'Alex Thompson', createdAt: '3/22/2023 at 9:50 AM', industry: 'Financial Services', location: 'New York, United States', contacts: 0, deals: 0, lastActivityDate: '5/28/2025 at 2:20 PM', phone: '+1 212 555 0100' },
    { id: 'COM-20230605-0001', name: 'City Developments Limited', owner: 'Alex Sales', createdAt: '6/5/2023 at 8:00 AM', industry: 'Real Estate', location: 'Singapore, Singapore', contacts: 0, deals: 2, lastActivityDate: '6/3/2025 at 8:14 AM', phone: '+65 6123 4567' },
    { id: 'COM-20230812-0001', name: 'Global Fin', owner: 'Alex Sales', createdAt: '8/12/2023 at 11:20 AM', industry: 'Financial Services', location: 'Singapore', contacts: 0, deals: 1, lastActivityDate: '--', phone: '--' }
  ],
  deals: [
    { id: 'D-20260621-0001', name: 'Example Q3 License', company: 'Example Corp', amount: 50000, stage: 'Discovery', pipeline: 'Sales Pipeline', closeDate: '2026-09-30', owner: 'Hara Nguyen', createdAt: '2026-06-20 10:05' },
    { id: 'D-20260621-0002', name: 'Acme Implementation', company: 'Acme Inc', amount: 120000, stage: 'Solution Design', pipeline: 'Sales Pipeline', closeDate: '2026-08-15', owner: 'Alex Sales', createdAt: '2026-06-21 09:35' },
    { id: 'D-20260621-0003', name: 'Techvify Partnership', company: '', amount: 80000, stage: 'Draft Proposal', pipeline: 'Sales Pipeline', closeDate: '2026-07-30', owner: 'Hara Nguyen', createdAt: '2026-06-21 11:00' }
  ],
  bids: [
    { id: 'BID-001', client: 'Acme Inc', opportunity: 'Acme Implementation', status: 'Under Review', value: 120000, deadline: '2026-07-01', owner: 'Alex Sales', dealId: 'D-20260621-0002' }
  ],
  users: ['Hara Nguyen (TECHVIFY.D2)', 'Alex Sales (TECHVIFY.D1)']
};

const Stages = [
  'Nurture', '1st Meeting', 'Discovery', 'Solution Design', 'Draft Proposal', 'Proposal Presented', 'Negotiation', 'Closed Won', 'Closed Lost'
];

// Helper to generate IDs
const generateId = (prefix) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  if (prefix === 'CON') return `CON-${date}-${rand}`;
  if (prefix === 'D') return `D-${date}-${rand}`;
  return `${prefix}-${rand}`;
};
