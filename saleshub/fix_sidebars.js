const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'test_debug.html');

const menuItems = [
  { text: 'Dashboards', icon: 'ph-chart-pie-slice', href: 'dashboards.html' },
  { text: 'Contacts', icon: 'ph-address-book', href: 'index.html' },
  { text: 'Company', icon: 'ph-buildings', href: 'companies.html' },
  { text: 'Deal', icon: 'ph-currency-dollar', href: 'deals.html' },
  { text: 'Presale Workspace', icon: 'ph-gavel', href: 'bidding.html' },
  { text: 'Case Study Hub', icon: 'ph-books', href: 'case_studies.html' },
  { text: 'Revenue Forecast', icon: 'ph-trend-up', href: 'forecast.html' }
];

// Wait, the user said "cố định Case study hub ở dưới cuối cùng" (fix Case study hub at the very bottom).
// So Case Study Hub should be after Revenue Forecast.
const finalMenuItems = [
  { text: 'Dashboards', icon: 'ph-chart-pie-slice', href: 'dashboards.html' },
  { text: 'Contacts', icon: 'ph-address-book', href: 'index.html' },
  { text: 'Company', icon: 'ph-buildings', href: 'companies.html' },
  { text: 'Deal', icon: 'ph-currency-dollar', href: 'deals.html' },
  { text: 'Presale Workspace', icon: 'ph-gavel', href: 'bidding.html' },
  { text: 'Revenue Forecast', icon: 'ph-trend-up', href: 'forecast.html' },
  { text: 'Marketing (Coming soon)', icon: 'ph-megaphone', href: '#' },
  { text: 'Report (Coming soon)', icon: 'ph-file-text', href: '#' },
  { text: 'Case Study Hub', icon: 'ph-books', href: 'case_studies.html' }
];

const fileToActive = {
  'dashboards.html': 'Dashboards',
  'index.html': 'Contacts',
  'contact.html': 'Contacts',
  'companies.html': 'Company',
  'company.html': 'Company',
  'deals.html': 'Deal',
  'deal.html': 'Deal',
  'bidding.html': 'Presale Workspace',
  'bid_detail.html': 'Presale Workspace',
  'forecast.html': 'Revenue Forecast',
  'case_studies.html': 'Case Study Hub',
  'case_study_detail.html': 'Case Study Hub',
  'admin_settings.html': 'Settings'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  const activeName = fileToActive[file] || '';

  let newSidebar = `<!-- Sidebar -->
    <aside class="sidebar">
      <div style="color: white; font-size: 24px; margin-bottom: 40px; display: flex; align-items: center; gap: 12px;"><i class="ph ph-hexagon-fill"></i> <span style="font-size: 18px; font-weight: 600;">SalesHub</span></div>
`;

  finalMenuItems.forEach(item => {
    const color = item.text === activeName ? 'white' : '#7C98B6';
    newSidebar += `      <div style="color: ${color}; margin-bottom: 20px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-weight: 500; width: 100%;" onclick="window.location.href='${item.href}'"><i class="ph ${item.icon}" style="font-size: 22px;"></i> ${item.text}</div>\n`;
  });

  const settingsColor = activeName === 'Settings' ? 'white' : '#7C98B6';
  newSidebar += `      <div style="margin-top: auto; color: ${settingsColor}; cursor: pointer; display: flex; align-items: center; gap: 12px; font-weight: 500; width: 100%;" onclick="window.location.href='admin_settings.html'"><i class="ph ph-gear" style="font-size: 22px;"></i> Settings</div>
    </aside>`;

  const regex = /<!--\s*Sidebar\s*-->\s*<aside class="sidebar">[\s\S]*?<\/aside>/;
  if (regex.test(content)) {
    content = content.replace(regex, newSidebar);
    fs.writeFileSync(file, content);
    console.log(`Updated sidebar in ${file}`);
  } else {
    const regex2 = /<aside class="sidebar">[\s\S]*?<\/aside>/;
    if (regex2.test(content)) {
      content = content.replace(regex2, newSidebar.replace('<!-- Sidebar -->\n    ', ''));
      fs.writeFileSync(file, content);
      console.log(`Updated sidebar in ${file} (no comment)`);
    } else {
      console.log(`No sidebar found in ${file}`);
    }
  }
});
