$appJsPath = 'saleshub\app.js'
$content = [System.IO.File]::ReadAllText($appJsPath, [System.Text.Encoding]::UTF8)

$pmCode = @'
// --- PROPERTY MANAGEMENT LOGIC (Sales User View) ---
window.userDisplayPreferences = window.userDisplayPreferences || {};
window.currentUserRole = window.currentUserRole || 'Sales'; // Mock role for testing

class PropertyManager {
  static init() {
    if (document.getElementById('pm-overlay')) return;
    
    // Inject HTML for Property Manager
    const html = `
      <div class="overlay" id="pm-overlay" style="z-index: 2000;"></div>
      <div class="drawer right" id="pm-drawer" style="width: 800px; z-index: 2001; display: flex; flex-direction: column;">
        <div class="drawer-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding: 16px 24px;">
          <h2 style="font-size: 20px; margin: 0;" id="pm-title">View All Properties</h2>
          <button class="btn-close" onclick="PropertyManager.close()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text-light);"><i class="ph ph-x"></i></button>
        </div>
        
        <div class="drawer-body" style="padding: 24px; flex-grow: 1; overflow-y: auto; background-color: #F8FAFC;">
          <div style="margin-bottom: 24px;">
            <p style="color: var(--text-light); margin: 0 0 16px 0;">Select which properties to show on your detail panel. System fields cannot be hidden.</p>
            <div class="search-box" style="margin-bottom: 16px;">
              <i class="ph ph-magnifying-glass"></i>
              <input type="text" id="pm-search" placeholder="Search properties..." style="width: 100%;" onkeyup="PropertyManager.filterProperties()">
            </div>
          </div>
          
          <div class="table-wrapper">
            <table class="data-table" style="width: 100%;">
              <thead>
                <tr>
                  <th>Field Label</th>
                  <th>Internal Name</th>
                  <th>Type</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th style="text-align: center;">Show on panel</th>
                </tr>
              </thead>
              <tbody id="pm-properties-body">
                <!-- Populated dynamically -->
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="drawer-footer" style="padding: 16px 24px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 12px; background: white;">
          <button class="btn btn-secondary" onclick="PropertyManager.close()">Cancel</button>
          <button class="btn btn-primary" onclick="PropertyManager.savePreferences()">Save Preferences</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    
    document.getElementById('pm-overlay').addEventListener('click', PropertyManager.close);
  }

  static getFixedFields(entityType) {
    if (entityType === 'Contact') {
      return ['contact_id', 'first_name', 'last_name', 'email', 'phone', 'owner'];
    }
    if (entityType === 'Company') {
      return ['company_name', 'domain', 'owner', 'industry'];
    }
    if (entityType === 'Deal') {
      return ['deal_name', 'pipeline', 'stage', 'amount', 'close_date'];
    }
    return [];
  }

  static open(entityType) {
    PropertyManager.init();
    PropertyManager.currentEntity = entityType;
    document.getElementById('pm-title').innerText = `View All Properties: ${entityType}`;
    
    // Fetch schema for entity from mock admin settings
    const schema = window.mockSettingsSchema ? window.mockSettingsSchema[entityType] : [];
    const fixedFields = PropertyManager.getFixedFields(entityType);
    
    // Load preferences
    const prefs = window.userDisplayPreferences[entityType] || [];
    
    const tbody = document.getElementById('pm-properties-body');
    tbody.innerHTML = '';
    
    if (!schema || schema.length === 0) {
       tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-light);">No properties configured for ${entityType}</td></tr>`;
    } else {
       schema.forEach(field => {
         const isFixed = fixedFields.includes(field.internalName);
         // If not fixed, it's visible if it's in user prefs OR if user has no prefs and it's active
         let isChecked = isFixed;
         if (!isFixed) {
            if (window.userDisplayPreferences[entityType]) {
               isChecked = prefs.includes(field.internalName);
            } else {
               isChecked = (field.status === 'Active'); // Default show active if no prefs
            }
         }
         
         const tr = document.createElement('tr');
         tr.className = 'pm-prop-row';
         tr.innerHTML = `
           <td style="font-weight: 500;">${field.label}</td>
           <td style="color: var(--text-light); font-family: monospace; font-size: 12px;">${field.internalName}</td>
           <td><span class="badge b-grey">${field.type}</span></td>
           <td>${field.source === 'System' ? '<span style="color: var(--primary-teal); font-weight: 500;"><i class="ph ph-lock" style="margin-right:4px;"></i>System</span>' : 'Admin Custom'}</td>
           <td><span class="badge ${field.status === 'Active' ? 'b-green' : 'b-red'}">${field.status}</span></td>
           <td style="text-align: center;">
             ${isFixed ? 
               '<i class="ph ph-check-circle" style="color: var(--primary-teal); font-size: 18px;" title="Fixed field (Always shown)"></i>' : 
               `<input type="checkbox" class="pm-toggle-cb" data-internal="${field.internalName}" ${isChecked ? 'checked' : ''} ${field.status === 'Archived' ? 'disabled' : ''}>`
             }
           </td>
         `;
         tbody.appendChild(tr);
       });
    }

    document.getElementById('pm-overlay').classList.add('active');
    document.getElementById('pm-drawer').classList.add('active');
  }

  static close() {
    document.getElementById('pm-overlay').classList.remove('active');
    document.getElementById('pm-drawer').classList.remove('active');
  }

  static filterProperties() {
    const term = document.getElementById('pm-search').value.toLowerCase();
    const rows = document.querySelectorAll('.pm-prop-row');
    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  }

  static savePreferences() {
    const entityType = PropertyManager.currentEntity;
    const checkboxes = document.querySelectorAll('.pm-toggle-cb');
    const selected = [];
    checkboxes.forEach(cb => {
      if (cb.checked) {
        selected.push(cb.getAttribute('data-internal'));
      }
    });
    
    window.userDisplayPreferences[entityType] = selected;
    console.log(`Saved preferences for ${entityType}:`, selected);
    
    // Call the respective render function to update the detail panel
    if (typeof window.renderDetailProperties === 'function') {
       window.renderDetailProperties();
    }
    
    PropertyManager.close();
  }
}

window.PropertyManager = PropertyManager;

// Mock Schema definition for properties
window.mockSettingsSchema = {
  'Contact': [
    { label: 'Contact ID', internalName: 'contact_id', type: 'Single Line Text', source: 'System', status: 'Active' },
    { label: 'First Name', internalName: 'first_name', type: 'Single Line Text', source: 'System', status: 'Active' },
    { label: 'Last Name', internalName: 'last_name', type: 'Single Line Text', source: 'System', status: 'Active' },
    { label: 'Email', internalName: 'email', type: 'Email', source: 'System', status: 'Active' },
    { label: 'Phone Number', internalName: 'phone', type: 'Phone', source: 'System', status: 'Active' },
    { label: 'Contact Owner', internalName: 'owner', type: 'User Select', source: 'System', status: 'Active' },
    { label: 'Job Title', internalName: 'job_title', type: 'Single Line Text', source: 'System', status: 'Active' },
    { label: 'Lead Source', internalName: 'lead_source', type: 'Dropdown', source: 'System', status: 'Active' },
    { label: 'LinkedIn Profile', internalName: 'linkedin', type: 'URL', source: 'Admin Custom', status: 'Active' },
    { label: 'Twitter Profile', internalName: 'twitter', type: 'URL', source: 'Admin Custom', status: 'Active' },
    { label: 'Department', internalName: 'department', type: 'Dropdown', source: 'Admin Custom', status: 'Active' },
    { label: 'Role Level', internalName: 'role_level', type: 'Dropdown', source: 'Admin Custom', status: 'Active' },
    { label: 'Secondary Email', internalName: 'secondary_email', type: 'Email', source: 'Admin Custom', status: 'Archived' },
    { label: 'NPS Score', internalName: 'nps_score', type: 'Number', source: 'Admin Custom', status: 'Active' }
  ],
  'Company': [
    { label: 'Company Name', internalName: 'company_name', type: 'Single Line Text', source: 'System', status: 'Active' },
    { label: 'Company Domain', internalName: 'domain', type: 'URL', source: 'System', status: 'Active' },
    { label: 'Company Owner', internalName: 'owner', type: 'User Select', source: 'System', status: 'Active' },
    { label: 'Industry', internalName: 'industry', type: 'Dropdown', source: 'System', status: 'Active' },
    { label: 'Annual Revenue', internalName: 'annual_revenue', type: 'Currency', source: 'System', status: 'Active' },
    { label: 'Number of Employees', internalName: 'employee_count', type: 'Number', source: 'System', status: 'Active' },
    { label: 'City', internalName: 'city', type: 'Single Line Text', source: 'System', status: 'Active' },
    { label: 'Country', internalName: 'country', type: 'Single Line Text', source: 'System', status: 'Active' },
    { label: 'Target Account Tier', internalName: 'target_tier', type: 'Dropdown', source: 'Admin Custom', status: 'Active' },
    { label: 'Tech Stack', internalName: 'tech_stack', type: 'Multi Select', source: 'Admin Custom', status: 'Active' },
    { label: 'Competitor Risk', internalName: 'competitor_risk', type: 'Dropdown', source: 'Admin Custom', status: 'Active' }
  ],
  'Deal': [
    { label: 'Deal Name', internalName: 'deal_name', type: 'Single Line Text', source: 'System', status: 'Active' },
    { label: 'Pipeline', internalName: 'pipeline', type: 'Dropdown', source: 'System', status: 'Active' },
    { label: 'Deal Stage', internalName: 'stage', type: 'Dropdown', source: 'System', status: 'Active' },
    { label: 'Amount', internalName: 'amount', type: 'Currency', source: 'System', status: 'Active' },
    { label: 'Close Date', internalName: 'close_date', type: 'Date', source: 'System', status: 'Active' },
    { label: 'Deal Owner', internalName: 'owner', type: 'User Select', source: 'System', status: 'Active' },
    { label: 'Deal Type', internalName: 'deal_type', type: 'Dropdown', source: 'System', status: 'Active' },
    { label: 'Next Step', internalName: 'next_step', type: 'Single Line Text', source: 'System', status: 'Active' },
    { label: 'Lost Reason', internalName: 'lost_reason', type: 'Dropdown', source: 'System', status: 'Active' },
    { label: 'Competitor', internalName: 'competitor', type: 'Single Line Text', source: 'Admin Custom', status: 'Active' },
    { label: 'Executive Sponsor', internalName: 'exec_sponsor', type: 'User Select', source: 'Admin Custom', status: 'Active' }
  ]
};

window.renderDetailProperties = function() {
  const container = document.getElementById('dynamic-properties-container');
  if (!container) return;
  
  const entityType = container.getAttribute('data-entity-type'); // e.g., 'Contact'
  if (!entityType) return;
  
  const schema = window.mockSettingsSchema[entityType] || [];
  const fixedFields = PropertyManager.getFixedFields(entityType);
  const prefs = window.userDisplayPreferences[entityType];
  
  // Example dummy data mapper
  let mockData = {};
  if (entityType === 'Contact') {
     mockData = {
       contact_id: 'CON-1002', first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com',
       phone: '+1 555-0198', owner: 'Sarah Smith', job_title: 'VP of Engineering',
       lead_source: 'Organic Search', linkedin: 'https://linkedin.com/in/johndoe', nps_score: 9
     };
  } else if (entityType === 'Company') {
     mockData = {
       company_name: 'Example Corp', domain: 'example.com', owner: 'Sarah Smith', industry: 'Software',
       annual_revenue: '$50,000,000', employee_count: '250', city: 'San Francisco', country: 'United States',
       target_tier: 'Tier 1', tech_stack: 'AWS, React, Node', competitor_risk: 'Low'
     };
  } else if (entityType === 'Deal') {
     mockData = {
       deal_name: 'Enterprise License Expansion', pipeline: 'Sales Pipeline', stage: 'Solution Design',
       amount: '$150,000', close_date: 'Oct 31, 2026', owner: 'Sarah Smith', deal_type: 'Existing Business',
       next_step: 'Send proposal', competitor: 'None known', exec_sponsor: 'Mike Johnson'
     };
  }

  container.innerHTML = '';
  
  schema.forEach(field => {
    const isFixed = fixedFields.includes(field.internalName);
    let shouldShow = isFixed;
    if (!isFixed) {
       if (prefs) {
          shouldShow = prefs.includes(field.internalName);
       } else {
          shouldShow = (field.status === 'Active');
       }
    }
    
    if (shouldShow) {
       const val = mockData[field.internalName] || '--';
       const div = document.createElement('div');
       div.className = 'info-item';
       div.style.marginBottom = '12px';
       div.innerHTML = `
         <div class="label" style="font-size: 12px; color: var(--text-light); margin-bottom: 4px;">${field.label}</div>
         <div class="value" style="font-weight: 500; display: flex; justify-content: space-between; align-items: center;">
           <span>${val}</span>
           ${!isFixed ? `<i class="ph ph-pencil-simple" style="color: var(--text-light); cursor: pointer; opacity: 0.5;"></i>` : ''}
         </div>
       `;
       container.appendChild(div);
    }
  });
};
'@

$content = $content -replace "(?s)// --- PROPERTY MANAGEMENT LOGIC.*?(?=document\.addEventListener\('DOMContentLoaded')", ""
$content = [regex]::Replace($content, "(?=document\.addEventListener\('DOMContentLoaded')", ($pmCode + "`r`n`r`n"), 1)

$paginationCode = @'
  // --- GLOBALS AND UTILS ---
  window.appPagination = {
    contacts: { currentPage: 1, pageSize: 10 },
    companies: { currentPage: 1, pageSize: 10 },
    deals: { currentPage: 1, pageSize: 10 },
    bids: { currentPage: 1, pageSize: 10 },
  };

  window.updatePaginationUI = function(type, totalCount, containerEl, recordCountEl) {
    const state = window.appPagination[type];
    const totalPages = Math.ceil(totalCount / state.pageSize) || 1;
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    if (state.currentPage < 1) state.currentPage = 1;
    
    const startIdx = (state.currentPage - 1) * state.pageSize;
    const endIdx = Math.min(startIdx + state.pageSize, totalCount);
    
    if (recordCountEl) {
      if (totalCount === 0) {
        recordCountEl.innerText = `0 records`;
      } else {
        recordCountEl.innerText = `(${totalCount} records)`;
      }
    }
    
    let container = containerEl;
    if (typeof container === 'string') container = document.getElementById(container);
    if (!container) return { startIdx, endIdx };
    
    let paginationDiv = container.querySelector('.pagination');
    if (!paginationDiv) {
       const tableWrapper = container.closest('.table-wrapper') || container.parentElement;
       if (tableWrapper) paginationDiv = tableWrapper.querySelector('.pagination');
    }

    if (paginationDiv) {
      if (totalCount === 0) {
         paginationDiv.innerHTML = `<span>Showing 0-0 of 0</span>
           <div class="pagination-controls" style="display:inline-flex;gap:4px;">
             <button class="btn btn-secondary" style="padding: 4px 8px;" disabled><i class="ph ph-caret-left"></i></button>
             <button class="btn btn-secondary" style="padding: 4px 8px;" disabled><i class="ph ph-caret-right"></i></button>
           </div>`;
      } else {
         paginationDiv.innerHTML = `<span>Showing ${startIdx + 1}-${endIdx} of ${totalCount}</span>
           <div class="pagination-controls" style="display:inline-flex;gap:4px;">
             <button class="btn btn-secondary btn-prev-page" style="padding: 4px 8px;" ${state.currentPage === 1 ? 'disabled' : ''}><i class="ph ph-caret-left"></i></button>
             <button class="btn btn-secondary btn-next-page" style="padding: 4px 8px;" ${state.currentPage === totalPages ? 'disabled' : ''}><i class="ph ph-caret-right"></i></button>
           </div>`;
         
         const btnPrev = paginationDiv.querySelector('.btn-prev-page');
         const btnNext = paginationDiv.querySelector('.btn-next-page');
         
         if (btnPrev) btnPrev.addEventListener('click', () => { window.appPagination[type].currentPage--; window.renderLists(type); });
         if (btnNext) btnNext.addEventListener('click', () => { window.appPagination[type].currentPage++; window.renderLists(type); });
      }
    }
    return { startIdx, endIdx };
  };

  window.renderLists = function(type) {
     if (type === 'contacts' && typeof renderContacts === 'function') renderContacts();
     if (type === 'companies' && typeof renderCompanies === 'function') renderCompanies();
     if (type === 'deals' && typeof renderDeals === 'function') renderDeals();
     if (type === 'bids' && typeof renderBids === 'function') renderBids();
  };
'@
$content = [regex]::Replace($content, "(?<=document\.addEventListener\('DOMContentLoaded', \(\) => \{\r?\n)", ("`n" + $paginationCode), 1)


$newRenderContacts = @'
function renderContacts(filter = 'all') {
    if (!tbody) return;
    try {
      if (recordCount) recordCount.innerText = 'Loading...';
      let filtered = mockContacts;
      if (filter === 'my') {
        filtered = mockContacts.filter(c => c.isMy);
      } else if (filter === 'unassigned') {
        filtered = mockContacts.filter(c => (c.owner || 'Unassigned') === 'Unassigned');
      }
      
      const { startIdx, endIdx } = window.updatePaginationUI('contacts', filtered.length, tbody, recordCount);
      const paginated = filtered.slice(startIdx, endIdx);
      
      tbody.innerHTML = '';
      paginated.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="checkbox" class="contact-cb"></td>
          <td><a href="contact.html" style="font-weight: 500;">${c.name || '--'}</a></td>
          <td>${c.email || '--'}</td>
          <td>${c.phone || '--'}</td>
          <td>${c.owner || 'Unassigned'}</td>
          <td>${c.company || '--'}</td>
          <td>${c.activity || '--'}</td>
          <td>${c.status || '--'}</td>
          <td>${c.created || '--'}</td>
        `;
        tbody.appendChild(tr);
      });
      
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
    } catch(e) {
      console.error('Error rendering contacts', e);
      tbody.innerHTML = '<tr><td colspan="9" style="color:red;text-align:center;">Error rendering contacts. <a href="#" onclick="renderContacts(); return false;">Retry</a></td></tr>';
    }
  }
'@
$content = [regex]::Replace($content, "(?s)function renderContacts\(filter = 'all'\) \{.*?updateContactActions\(\);\s*\}", $newRenderContacts, 1)

$newRenderCompanies = @'
function renderCompanies(filter = 'all', query = '') {
    if (!compTbody) return;
    try {
      let filtered = mockCompanies;
      if (filter === 'my') {
        filtered = filtered.filter(c => c.isMy);
      } else if (filter === 'unassigned') {
        filtered = filtered.filter(c => (c.owner || 'Unassigned') === 'Unassigned');
      }
  
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(c => 
          (c.name || '').toLowerCase().includes(q) || 
          (c.domain || '').toLowerCase().includes(q) || 
          (c.phone || '').toLowerCase().includes(q) || 
          (c.owner || '').toLowerCase().includes(q) || 
          (c.city || '').toLowerCase().includes(q) || 
          (c.country || '').toLowerCase().includes(q) || 
          (c.industry || '').toLowerCase().includes(q)
        );
      }
      
      const { startIdx, endIdx } = window.updatePaginationUI('companies', filtered.length, compTbody, compRecordCount);
      const paginated = filtered.slice(startIdx, endIdx);
      
      compTbody.innerHTML = '';
      
      if (filtered.length === 0) {
        if(emptyState) emptyState.style.display = 'block';
      } else {
        if(emptyState) emptyState.style.display = 'none';
        paginated.forEach(c => {
          const tr = document.createElement('tr');
          const relHealth = c.health ? c.health.relationshipHealth : 'N/A';
          let healthBg = '#D1FAE5', healthCol = '#10B981';
          if (relHealth === 'Red' || relHealth === 'Critical') { healthBg = '#FEE2E2'; healthCol = '#EF4444'; }
          else if (relHealth === 'Yellow') { healthBg = '#FEF3C7'; healthCol = '#D97706'; }

          tr.innerHTML = `
            <td><input type="checkbox" class="comp-cb"></td>
            <td><a href="company.html?id=${c.id || ''}" style="font-weight: 500;">${c.name || '--'}</a></td>
            <td><span class="badge ${c.motion === 'Farming' ? 'b-blue' : 'b-grey'}" style="font-size: 12px; padding: 2px 8px; border-radius: 12px;">${c.motion || 'Hunting'}</span></td>
            <td><span style="font-weight: 500; color: #8B5CF6;">${c.motion === 'Farming' ? (c.accountTier || 'Emerging') : (c.prospectClassification || 'Not Evaluated')}</span></td>
            <td>${c.potentialTag || 'None'}</td>
            <td><span class="badge" style="background-color: ${healthBg}; color: ${healthCol}; font-size: 11px;">${relHealth}</span></td>
            <td>${c.owner || 'Unassigned'}</td>
            <td>${c.industry || '--'}</td>
            <td>${c.domain || '--'}</td>
            <td>${c.activity || '--'}</td>
          `;
          compTbody.appendChild(tr);
        });
      }
      
      const cbs = compTbody.querySelectorAll('.comp-cb');
      cbs.forEach(cb => cb.addEventListener('change', updateCompanyActions));
      
      const checkAll = document.getElementById('check-all-companies');
      if (checkAll) {
        checkAll.checked = false;
        checkAll.addEventListener('change', (e) => {
          cbs.forEach(cb => cb.checked = e.target.checked);
          updateCompanyActions();
        });
      }
      updateCompanyActions();
    } catch (e) {
      console.error('Error rendering companies', e);
      compTbody.innerHTML = '<tr><td colspan="10" style="color:red;text-align:center;">Error rendering companies. <a href="#" onclick="renderCompanies(); return false;">Retry</a></td></tr>';
    }
  }
'@
$content = [regex]::Replace($content, "(?s)function renderCompanies\(filter = 'all', query = ''\) \{.*?updateCompanyActions\(\);\s*\}", $newRenderCompanies, 1)

$newRenderDeals = @'
function renderDeals() {
    if (!kanbanBoardView && !dealsTableView) return;
    try {
      let pipelineDeals = mockDeals.filter(d => (d.pipeline || 'Sales Pipeline') === currentPipeline);
  
      let term = dealSearchInput ? dealSearchInput.value.toLowerCase() : '';
      let filteredDeals = pipelineDeals.filter(d => 
        (d.name || '').toLowerCase().includes(term) ||
        (d.id || '').toLowerCase().includes(term) ||
        (d.company || '').toLowerCase().includes(term) ||
        (d.owner || '').toLowerCase().includes(term)
      );
  
      const { startIdx, endIdx } = window.updatePaginationUI('deals', filteredDeals.length, dealsTableView, recordCountEl);
      const paginatedDeals = filteredDeals.slice(startIdx, endIdx);
      
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
  
      if (kanbanBoardView) {
        kanbanBoardView.innerHTML = '';
        const stages = ['Appointment Scheduled', 'Qualified to Buy', 'Presentation Scheduled', 'Decision Maker Bought-In', 'Contract Sent', 'Closed Won', 'Closed Lost'];
        stages.forEach(stage => {
          let stageDeals = filteredDeals.filter(d => d.stage === stage);
          let colHtml = `<div class="kanban-col"><div class="kanban-col-header">${stage} <span class="col-count">${stageDeals.length}</span></div><div class="kanban-col-body" data-stage="${stage}">`;
          
          stageDeals.forEach(d => {
            let badgesHtml = '';
            let compId = d.companyId;
            if (!compId) {
                const cMatch = window.mockCompanies.find(c => c.name === d.company);
                if (cMatch) compId = cMatch.id;
            }
            if (compId) {
                const compData = window.calculateCompanyIntelligence(compId);
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
            }
            colHtml += `
              <div class="deal-card visual-card" draggable="true" data-id="${d.id || ''}">
                <div class="card-top">
                  <a href="deal.html?id=${d.id || ''}" class="card-title">${d.id || ''} - ${d.name || '--'}</a>
                  <input type="checkbox" class="deal-cb">
                </div>
                <div class="card-date">Close date: ${d.closeDate || '--'}</div>
                <div class="card-badges">${badgesHtml}</div>
                <div class="card-footer">
                  <div class="card-company">
                    <div class="company-avatar">${d.avatar || (d.company || ' ').charAt(0)}</div> ${d.company || '--'}
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
        if(typeof setupDragAndDrop === 'function') setupDragAndDrop();
      }
  
      if (dealsTbody) {
        dealsTbody.innerHTML = '';
        paginatedDeals.forEach(d => {
          let trHtml = `
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 12px;"><input type="checkbox"></td>
              <td style="padding: 12px;">${d.id || '--'}</td>
              <td style="padding: 12px;"><a href="deal.html?id=${d.id || ''}" style="color: var(--primary-teal); text-decoration: none; font-weight: 500;">${d.name || '--'}</a></td>
              <td style="padding: 12px;"><span style="background: #F1F5F9; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">${d.stage || '--'}</span></td>
              <td style="padding: 12px;">${window.formatCurrency(d.amount)}</td>
              <td style="padding: 12px;">${d.closeDate || '--'}</td>
              <td style="padding: 12px;"><a href="company.html" style="color: var(--primary-teal); text-decoration: none;">${d.company || '--'}</a></td>
              <td style="padding: 12px;"><a href="contact.html" style="color: var(--primary-teal); text-decoration: none;">Contact</a></td>
              <td style="padding: 12px;">${d.owner || 'Unassigned'}</td>
              <td style="padding: 12px;">01/01/2026</td>
              <td style="padding: 12px;">01/01/2026</td>
            </tr>
          `;
          dealsTbody.innerHTML += trHtml;
        });
      }
    } catch(e) {
       console.error('Error rendering deals', e);
       if(dealsTbody) dealsTbody.innerHTML = '<tr><td colspan="11" style="color:red;text-align:center;">Error rendering deals. <a href="#" onclick="renderDeals(); return false;">Retry</a></td></tr>';
    }
  }
'@
$content = [regex]::Replace($content, "(?s)function renderDeals\(\) \{.*?dealsTbody\.innerHTML \+= trHtml;\s*\}\s*\}", $newRenderDeals, 1)

$newRenderBids = @'
function renderBids() {
    if (!bidTbody && (typeof bidKanbanCols === 'undefined' || bidKanbanCols.length === 0)) return;
    try {
      const query = bidSearch ? bidSearch.value.toLowerCase() : '';
      let filtered = mockBids.filter(b => 
        (b.id || '').toLowerCase().includes(query) || 
        (b.client || '').toLowerCase().includes(query) || 
        (b.opp || '').toLowerCase().includes(query)
      );

      const { startIdx, endIdx } = window.updatePaginationUI('bids', filtered.length, bidTbody, document.getElementById('total-bids'));
      const paginated = filtered.slice(startIdx, endIdx);
  
      if (bidTbody) {
        bidTbody.innerHTML = '';
        paginated.forEach(b => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><input type="checkbox" class="bid-cb"></td>
            <td><a href="bid_detail.html" style="font-weight: 500;">${b.id || '--'}</a></td>
            <td>${b.client || '--'}</td>
            <td>${b.opp || '--'}</td>
            <td><span class="badge ${typeof getBidStatusClass === 'function' ? getBidStatusClass(b.status) : ''}">${b.status || '--'}</span></td>
            <td style="font-weight: 600;">${b.val || '--'}</td>
            <td>${b.deadline || '--'}</td>
            <td>${b.owner || '--'}</td>
            <td><a href="deal.html">${b.deal || '--'}</a></td>
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
  
      if (typeof bidKanbanCols !== 'undefined' && bidKanbanCols.length > 0) {
        bidKanbanCols.forEach(col => col.innerHTML = '');
        filtered.forEach(b => {
          const col = document.querySelector(`#bidding-board-view .kanban-col-body[data-stage="${b.status}"]`);
          if (col) {
            const card = document.createElement('div');
            card.className = 'deal-card visual-card';
            card.innerHTML = `
              <div class="card-top">
                <a href="bid_detail.html" class="card-title">${b.id || '--'}</a>
                <input type="checkbox" class="deal-cb">
              </div>
              <div class="card-date">Deadline: ${b.deadline || '--'}</div>
              <div class="card-badges">
                <span class="badge ${typeof getBidStatusClass === 'function' ? getBidStatusClass(b.status) : ''}" style="border-radius: 12px; padding: 2px 8px; font-size: 11px;">${b.status || '--'}</span>
              </div>
              <div style="font-weight: 600; font-size: 14px; margin: 8px 12px 0;">${b.val || '--'}</div>
              <div class="card-footer" style="margin-top: 8px;">
                <div class="card-company">
                  <div class="company-avatar" style="visibility:hidden; width:0; margin:0"></div> <i class="ph ph-buildings" style="margin-right: 4px;"></i> ${b.client || '--'}
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
    } catch(e) {
      console.error('Error rendering bids', e);
      if(bidTbody) bidTbody.innerHTML = '<tr><td colspan="9" style="color:red;text-align:center;">Error rendering bids. <a href="#" onclick="renderBids(); return false;">Retry</a></td></tr>';
    }
  }
'@
$content = [regex]::Replace($content, "(?s)function renderBids\(\) \{.*?countEl\.textContent = \`\$\{filtered\.length\} bids\`;\s*\}", $newRenderBids, 1)

$content = [regex]::Replace($content, "if \(typeof window\.renderDetailProperties === 'function'\) \{\s*window\.renderDetailProperties\(\);\s*\}", "")
$content = $content -replace 'setTimeout\(initForecastModule, 100\);\r?\n\}\);', ("setTimeout(initForecastModule, 100);`n  if (typeof window.renderDetailProperties === 'function') { window.renderDetailProperties(); }`n});")

[System.IO.File]::WriteAllText($appJsPath, $content, [System.Text.Encoding]::UTF8)
Write-Output "Done"

