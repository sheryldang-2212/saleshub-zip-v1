const fs = require('fs');

const content = fs.readFileSync('saleshub/app.js', 'utf-8');

const newLogic = \
// --- PROPERTY MANAGEMENT LOGIC (Sales User View) ---

window.userDisplayPreferences = window.userDisplayPreferences || {};
window.currentUserRole = window.currentUserRole || 'Sales'; // Mock role for testing

class PropertyManager {
  static init() {
    if (document.getElementById('pm-overlay')) return;
    
    // Inject HTML for Property Manager
    const html = \\\
      <div class="overlay" id="pm-overlay" style="z-index: 2000;"></div>
      <div class="drawer right" id="pm-drawer" style="width: 800px; z-index: 2001; display: flex; flex-direction: column;">
        <div class="drawer-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding: 16px 24px;">
          <h2 style="font-size: 20px; margin: 0;" id="pm-title">View All Properties</h2>
          <button class="btn-close" onclick="PropertyManager.close()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text-light);"><i class="ph ph-x"></i></button>
        </div>
        
        <!-- List View -->
        <div id="pm-list-view" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
          <div style="padding: 16px 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: #f8fafc;">
            <div style="display: flex; gap: 12px; flex: 1;">
              <div class="search-box" style="width: 300px;">
                <i class="ph ph-magnifying-glass search-icon"></i>
                <input type="text" id="pm-search" placeholder="Search properties..." oninput="PropertyManager.renderList()">
              </div>
              <select class="form-control" id="pm-filter-type" style="width: 150px;" onchange="PropertyManager.renderList()">
                <option value="all">All Fields</option>
                <option value="system">System Fields</option>
                <option value="custom">Custom Fields</option>
                <option value="shown">Shown on my panel</option>
                <option value="hidden">Hidden fields</option>
              </select>
            </div>
            <button id="pm-btn-manage-settings" class="btn btn-secondary" style="display: none;" onclick="window.location.href='admin_settings.html#mod-' + window.PropertyManager.currentObject.toLowerCase()">Manage properties in Settings</button>
          </div>
          
          <div style="flex: 1; overflow-y: auto; padding: 0;">
            <table class="data-table" style="width: 100%;">
              <thead>
                <tr>
                  <th style="padding-left: 24px; width: 40px;"></th>
                  <th>Field Label</th>
                  <th>Internal Name</th>
                  <th>Type</th>
                  <th>Current Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="pm-tbody"></tbody>
            </table>
          </div>
          
          <!-- Footer Actions -->
          <div style="padding: 16px 24px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: #fff;">
            <button class="btn btn-secondary" onclick="PropertyManager.resetToDefault()">Reset to default</button>
            <div style="display: flex; gap: 12px;">
              <button class="btn btn-secondary" onclick="PropertyManager.close()">Cancel</button>
              <button class="btn btn-primary" onclick="PropertyManager.savePreferences()">Save</button>
            </div>
          </div>
        </div>
      </div>
    \\\;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  static open(objectType) {
    this.init();
    this.currentObject = objectType;
    document.getElementById('pm-title').innerText = \\\View all \\\ properties\\\;
    
    // Toggle admin button
    const manageBtn = document.getElementById('pm-btn-manage-settings');
    if (manageBtn) {
      manageBtn.style.display = window.currentUserRole === 'Admin' ? 'inline-block' : 'none';
    }
    
    // Initialize draft preferences
    this.fixedFields = ['contact_id', 'firstname', 'lastname', 'email', 'phone', 'owner'];
    if (!window.userDisplayPreferences[this.currentObject]) {
      // Default to global visibleOnDetail
      const defaultProps = window.mockFieldDefinitions.filter(p => p.objectType === this.currentObject && p.visibleOnDetail).map(p => p.key);
      window.userDisplayPreferences[this.currentObject] = defaultProps;
    }
    
    // Clone for drafting
    this.draftPreferences = [...window.userDisplayPreferences[this.currentObject]];
    
    // Ensure fixed fields are always in draft
    this.fixedFields.forEach(f => {
      if (!this.draftPreferences.includes(f)) this.draftPreferences.push(f);
    });

    this.showList();
    
    document.getElementById('pm-overlay').classList.add('active');
    document.getElementById('pm-drawer').classList.add('active');
  }

  static close() {
    document.getElementById('pm-overlay').classList.remove('active');
    document.getElementById('pm-drawer').classList.remove('active');
  }

  static showList() {
    document.getElementById('pm-list-view').style.display = 'flex';
    this.renderList();
  }

  static renderList() {
    const tbody = document.getElementById('pm-tbody');
    const search = document.getElementById('pm-search').value.toLowerCase();
    const filter = document.getElementById('pm-filter-type').value;
    
    const props = window.mockFieldDefinitions.filter(p => {
      if (p.objectType !== this.currentObject) return false;
      if (search && !p.label.toLowerCase().includes(search) && !p.key.toLowerCase().includes(search)) return false;
      if (filter === 'system' && !p.isSystem) return false;
      if (filter === 'custom' && p.isSystem) return false;
      if (filter === 'shown' && !this.draftPreferences.includes(p.key)) return false;
      if (filter === 'hidden' && this.draftPreferences.includes(p.key)) return false;
      return true;
    });

    tbody.innerHTML = '';
    if (props.length === 0) {
      tbody.innerHTML = \\\<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--text-muted);">No properties found.</td></tr>\\\;
      return;
    }

    props.forEach(p => {
      const isSystem = p.isSystem;
      const badge = isSystem ? \\\<span style="background: #e2e8f0; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 11px;">System</span>\\\ : \\\<span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Custom</span>\\\;
      const statusBadge = p.status === 'Archived' ? \\\<span style="color: #ef4444; font-weight: 500;">Archived</span>\\\ : \\\<span style="color: #10b981; font-weight: 500;">Active</span>\\\;
      
      const isFixed = this.fixedFields.includes(p.key);
      const isChecked = this.draftPreferences.includes(p.key) || isFixed;
      const disabledAttr = isFixed ? 'disabled' : '';
      
      // Get Current Value Mock
      let valObj = window.mockFieldValues ? window.mockFieldValues.find(v => v.fieldKey === p.key && v.contactId === window.currentContactId) : null;
      let val = valObj ? valObj.value : '--';
      if (p.key === 'contact_id' && window.mockContacts && window.mockContacts[0]) val = window.mockContacts[0].contactId;
      if (p.key === 'email' && window.mockContacts && window.mockContacts[0]) val = window.mockContacts[0].email;
      if (p.key === 'firstname' && window.mockContacts && window.mockContacts[0]) val = window.mockContacts[0].name.split(' ')[0];
      
      const tr = document.createElement('tr');
      tr.innerHTML = \\\
        <td style="padding-left: 24px;">
          <input type="checkbox" class="prop-toggle" data-key="\\\" \\\ \\\ style="cursor: \\\;">
        </td>
        <td style="font-weight: 500; color: var(--text-dark);">\\\ <div style="margin-top: 4px;">\\\</div></td>
        <td style="font-family: monospace; font-size: 12px; color: var(--text-muted);">\\\</td>
        <td style="font-size: 13px;">\\\</td>
        <td style="font-size: 13px; color: var(--text-muted);">\\\</td>
        <td>\\\</td>
      \\\;
      tbody.appendChild(tr);
    });
    
    // Bind toggle events
    document.querySelectorAll('.prop-toggle').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const key = e.target.getAttribute('data-key');
        if (e.target.checked) {
          if (!this.draftPreferences.includes(key)) this.draftPreferences.push(key);
        } else {
          this.draftPreferences = this.draftPreferences.filter(k => k !== key);
        }
      });
    });
  }
  
  static savePreferences() {
    window.userDisplayPreferences[this.currentObject] = [...this.draftPreferences];
    if (typeof window.renderDetailProperties === 'function') {
      window.renderDetailProperties();
    }
    if (typeof window.showToast === 'function') {
      window.showToast('Display preferences saved.', 'success');
    } else {
      alert('Display preferences saved.');
    }
    this.close();
  }
  
  static resetToDefault() {
    if (!confirm('Are you sure you want to reset your panel to the admin default properties?')) return;
    const defaultProps = window.mockFieldDefinitions.filter(p => p.objectType === this.currentObject && p.visibleOnDetail).map(p => p.key);
    window.userDisplayPreferences[this.currentObject] = defaultProps;
    this.draftPreferences = [...defaultProps];
    this.renderList();
    if (typeof window.renderDetailProperties === 'function') {
      window.renderDetailProperties();
    }
    if (typeof window.showToast === 'function') {
      window.showToast('Reset to default preferences.', 'success');
    }
  }
}

// Ensure it's available globally
window.PropertyManager = PropertyManager;

// Exporting utility for detail view rendering
window.renderDetailProperties = function() {
  const container = document.getElementById('dynamic-properties-list');
  if (!container) return;
  
  const objType = container.getAttribute('data-object-type') || 'Contact';
  
  // Initialize preferences if not set
  if (!window.userDisplayPreferences) window.userDisplayPreferences = {};
  if (!window.userDisplayPreferences[objType]) {
    window.userDisplayPreferences[objType] = window.mockFieldDefinitions.filter(p => p.objectType === objType && p.visibleOnDetail).map(p => p.key);
  }
  
  const selectedKeys = window.userDisplayPreferences[objType];
  
  const props = window.mockFieldDefinitions.filter(p => p.objectType === objType && selectedKeys.includes(p.key) && p.status !== 'Archived');
  
  // Sort properties by the order in selectedKeys, or just render them as they are
  // We will render them in the order they were defined in definitions for simplicity
  
  container.innerHTML = '';
  props.forEach(p => {
    // Attempt to find a mock value
    let valObj = window.mockFieldValues ? window.mockFieldValues.find(v => v.fieldKey === p.key && v.contactId === window.currentContactId) : null;
    let val = valObj ? valObj.value : '--';
    
    // Specifically handle ID fields to look realistic if they have special formatting
    if (p.key === 'contact_id' && window.mockContacts && window.mockContacts[0]) val = window.mockContacts[0].contactId;
    if (p.key === 'email' && window.mockContacts && window.mockContacts[0]) val = window.mockContacts[0].email;
    if (p.key === 'firstname' && window.mockContacts && window.mockContacts[0]) val = window.mockContacts[0].name.split(' ')[0];
    if (p.key === 'lastname' && window.mockContacts && window.mockContacts[0]) val = window.mockContacts[0].name.split(' ')[1] || '';
    if (p.key === 'phone' && window.mockContacts && window.mockContacts[0]) val = '+1 888 482 7768'; // mockup
    if (p.key === 'owner' && window.mockContacts && window.mockContacts[0]) val = window.mockContacts[0].owner;
    
    const div = document.createElement('div');
    div.className = 'property-item';
    div.innerHTML = \\\
      <div class="property-label">\\\</div>
      <div class="property-value" \\\>\\\</div>
    \\\;
    container.appendChild(div);
  });
};
\;

const startIdx = content.indexOf('class PropertyManager {');
const endIdx = content.indexOf('document.addEventListener(\\'DOMContentLoaded\\', () => {');

if (startIdx !== -1 && endIdx !== -1) {
    const newContent = content.substring(0, startIdx) + newLogic + '\\n' + content.substring(endIdx);
    fs.writeFileSync('saleshub/app.js', newContent, 'utf-8');
    console.log("Successfully patched app.js");
} else {
    console.log("Could not find start or end indices!");
}
