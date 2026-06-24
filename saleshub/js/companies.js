const Companies = {
  render: (container) => {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title">
          <h1>Companies</h1>
          <span class="record-count" id="company-total-count">${DB.companies.length} companies</span>
        </div>
        <div class="page-actions" style="display:flex; gap: 8px;">
          <span id="company-selected-count" style="display:none; align-items:center; font-size:13px; font-weight:500; color:var(--text-main); margin-right:8px;">0 selected</span>
          <button id="company-export-btn" class="btn-icon-outline" style="opacity:0.5; cursor:not-allowed;" title="Export"><i data-lucide="download" style="width:16px;"></i></button>
          <button id="company-bulk-delete" class="btn-icon-outline" style="opacity:0.5; cursor:not-allowed;" title="Delete Selected" onclick="if(!this.hasAttribute('disabled')) Companies.bulkDeletePrompt()">
            <i data-lucide="trash-2" style="width:16px;"></i>
          </button>
          <button class="btn-icon-outline" title="Import" onclick="Companies.openImportModal()"><i data-lucide="upload" style="width:16px;"></i></button>
          <button class="btn btn-primary" onclick="Companies.openCreateModal()"><i data-lucide="plus"></i> Create company</button>
        </div>
      </div>
      
      <div class="toolbar" style="box-shadow: none; padding: 0; background: transparent; border: none; justify-content: flex-start; gap: 24px;">
        <div class="search-bar" id="company-search-container" style="flex: 1; max-width: 400px; height: 36px; background: white; flex-direction: row-reverse; border: 1px solid var(--border-color); border-radius: 4px; padding: 0 12px; display: flex; align-items: center; transition: border-color 0.2s;">
          <i data-lucide="search" style="width:16px; color:var(--text-muted);"></i>
          <input type="text" id="company-search-input" placeholder="Search by company ID, name, owner, industry, location" style="flex:1; border:none; outline:none; font-size:13px; color:var(--text-main);" onfocus="document.getElementById('company-search-container').style.borderColor='var(--primary)'" onblur="document.getElementById('company-search-container').style.borderColor='var(--border-color)'" oninput="Companies.filterList()">
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:13px; color:var(--text-muted);">Company owner</span>
          <div style="position:relative;" id="company-owner-wrapper">
            <button id="company-owner-btn" class="btn btn-secondary" onclick="Companies.toggleDropdown('owner')" style="height:36px; padding:6px 12px; font-size:13px; font-weight:normal; background:white; color:var(--text-main); border:1px solid var(--border-color); display:flex; align-items:center; gap:8px; transition:all 0.2s;">
              <span id="company-owner-label">All owners</span>
              <i data-lucide="chevron-down" id="company-owner-icon" style="width:14px; transition:transform 0.2s;"></i>
            </button>
            <div id="company-owner-menu" style="display:none; position:absolute; top:calc(100% + 4px); left:0; background:white; border:1px solid var(--border-color); border-radius:4px; box-shadow:var(--shadow-md); z-index:100; min-width:160px; padding:4px 0;">
              <!-- options rendered via JS -->
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:13px; color:var(--text-muted);">Create date</span>
          <div style="position:relative;" id="company-date-wrapper">
            <button id="company-date-btn" class="btn btn-secondary" onclick="Companies.toggleDropdown('date')" style="height:36px; padding:6px 12px; font-size:13px; font-weight:normal; background:white; color:var(--text-main); border:1px solid var(--border-color); display:flex; align-items:center; gap:8px; transition:all 0.2s;">
              <span id="company-date-label">All dates</span>
              <i data-lucide="chevron-down" id="company-date-icon" style="width:14px; transition:transform 0.2s;"></i>
            </button>
            <div id="company-date-menu" style="display:none; position:absolute; top:calc(100% + 4px); left:0; background:white; border:1px solid var(--border-color); border-radius:4px; box-shadow:var(--shadow-md); z-index:100; min-width:160px; padding:4px 0;">
              <!-- options rendered via JS -->
            </div>
          </div>
        </div>
      </div>

      <div class="table-container" style="background: white; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden;">
        <table class="table" style="min-width: 1200px;">
          <thead>
            <tr>
              <th class="table-checkbox"><input type="checkbox" onchange="Companies.toggleAllCheckboxes(this)"></th>
              <th>Company ID</th>
              <th>Company name</th>
              <th>Company owner</th>
              <th>Create date</th>
              <th>Industry</th>
              <th>Location</th>
              <th>Contacts</th>
              <th>Deals</th>
              <th>Last activity date</th>
              <th>Phone number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="company-table-body">
            <!-- Rows rendered dynamically -->
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div id="company-pagination-default" style="display:flex; justify-content:center; align-items:center; padding:16px; border-top:1px solid var(--border-color); position:relative;">
          <div style="display:flex; gap:8px; align-items:center;">
            <i data-lucide="chevron-left" style="width:16px; color:var(--text-muted); opacity:0.5;"></i>
            <div style="width:24px; height:24px; border-radius:4px; background:#E8F0FE; color:#1967D2; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600;">1</div>
            <i data-lucide="chevron-right" style="width:16px; color:var(--text-muted); opacity:0.5;"></i>
          </div>
          <div style="position:absolute; right:16px; display:flex; align-items:center; gap:16px; font-size:12px; color:var(--text-main);">
            <div style="position:relative;" id="company-pagination-wrapper">
              <div style="display:flex; align-items:center; gap:4px; cursor:pointer;" onclick="Companies.toggleDropdown('pagination')">
                <span id="company-pagination-label">25 per page</span> 
                <i data-lucide="chevron-down" id="company-pagination-icon" style="width:12px; transition:transform 0.2s;"></i>
              </div>
              <div id="company-pagination-menu" style="display:none; position:absolute; bottom:calc(100% + 4px); right:0; background:white; border:1px solid var(--border-color); border-radius:4px; box-shadow:var(--shadow-md); z-index:100; min-width:120px; padding:4px 0;">
                <div style="padding:8px 16px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:8px; background:#E8F0FE; color:var(--primary); font-weight:500;" onclick="Companies.selectFilter('pagination', '25 per page')" onmouseover="this.style.background='#E8F0FE'" onmouseout="this.style.background='#E8F0FE'">
                  <i data-lucide="check" style="width:14px; color:var(--primary);"></i>
                  <span>25 per page</span>
                </div>
                <div style="padding:8px 16px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:8px; color:var(--text-main);" onclick="Companies.selectFilter('pagination', '50 per page')" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='transparent'">
                  <div style="width:14px;"></div>
                  <span>50 per page</span>
                </div>
                <div style="padding:8px 16px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:8px; color:var(--text-main);" onclick="Companies.selectFilter('pagination', '100 per page')" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='transparent'">
                  <div style="width:14px;"></div>
                  <span>100 per page</span>
                </div>
              </div>
            </div>
            <div>1-12 of 12</div>
          </div>
        </div>

        <div id="company-pagination-search" style="display:none; justify-content:space-between; align-items:center; padding:16px; border-top:1px solid var(--border-color); font-size:12px; color:var(--text-muted);">
          <div><span id="company-search-count">${DB.companies.length}</span> companies</div>
          <div>Page 1 of 1</div>
          <div style="width:70px;"></div>
        </div>
      </div>
    `;
    
    // Initialize filter state if not present
    if (!Companies.filters) {
      Companies.filters = { owner: 'All owners', date: 'All dates', search: '' };
    }
    
    Companies.renderTableRows(DB.companies);
    Companies.renderDropdownMenus();
    lucide.createIcons({ root: container });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', Companies.closeDropdownsOutside);
  },

  filters: { owner: 'All owners', date: 'All dates', search: '' },

  closeDropdownsOutside: (e) => {
    if (!e.target.closest('#company-owner-wrapper') && !e.target.closest('#company-date-wrapper') && !e.target.closest('#company-pagination-wrapper')) {
      const ownerMenu = document.getElementById('company-owner-menu');
      const dateMenu = document.getElementById('company-date-menu');
      const paginationMenu = document.getElementById('company-pagination-menu');
      if (ownerMenu && ownerMenu.style.display === 'block') Companies.toggleDropdown('owner');
      if (dateMenu && dateMenu.style.display === 'block') Companies.toggleDropdown('date');
      if (paginationMenu && paginationMenu.style.display === 'block') Companies.toggleDropdown('pagination');
    }
  },

  toggleDropdown: (type) => {
    const menu = document.getElementById(`company-${type}-menu`);
    const btn = document.getElementById(`company-${type}-btn`);
    const icon = document.getElementById(`company-${type}-icon`);
    
    const isOpen = menu.style.display === 'block';
    
    // Close other dropdown if open
    const otherType = type === 'owner' ? 'date' : 'owner';
    const otherMenu = document.getElementById(`company-${otherType}-menu`);
    if (otherMenu && otherMenu.style.display === 'block') {
      otherMenu.style.display = 'none';
      const otherIcon = document.getElementById(`company-${otherType}-icon`);
      if (otherIcon) {
        otherIcon.style.transform = 'rotate(0deg)';
        otherIcon.setAttribute('data-lucide', 'chevron-down');
      }
    }

    if (isOpen) {
      menu.style.display = 'none';
      icon.style.transform = 'rotate(0deg)';
      icon.setAttribute('data-lucide', 'chevron-down');
    } else {
      menu.style.display = 'block';
      icon.style.transform = 'rotate(180deg)'; // Actually we can just swap to chevron-up or use transform
      icon.setAttribute('data-lucide', 'chevron-down');
    }
    lucide.createIcons({ root: btn.parentElement });
  },

  selectFilter: (type, value) => {
    Companies.filters[type] = value;
    Companies.toggleDropdown(type);
    Companies.renderDropdownMenus();
    Companies.filterList();
  },

  renderDropdownMenus: () => {
    const ownerOptions = ['All owners', 'Alex Sales', 'Alice Johnson', 'Bob Smith'];
    const dateOptions = ['All dates', 'Today', 'This week', 'This month', 'This year'];
    const paginationOptions = ['25 per page', '50 per page', '100 per page'];
    
    const renderMenu = (type, options) => {
      const menu = document.getElementById(`company-${type}-menu`);
      const btn = document.getElementById(`company-${type}-btn`);
      const label = document.getElementById(`company-${type}-label`);
      const icon = document.getElementById(`company-${type}-icon`);
      if (!menu) return;

      const currentVal = Companies.filters[type] || options[0];
      
      // Update button styling if it's not pagination
      if (label) label.textContent = currentVal;
      
      if (btn && icon && type !== 'pagination') {
        if (currentVal.startsWith('All')) {
          btn.style.color = 'var(--text-main)';
          btn.style.borderColor = 'var(--border-color)';
          icon.style.color = 'var(--text-main)';
        } else {
          btn.style.color = 'var(--primary)';
          btn.style.borderColor = 'var(--primary)';
          icon.style.color = 'var(--primary)';
        }
      }

      menu.innerHTML = options.map(opt => {
        const isSelected = opt === currentVal;
        return `
          <div style="padding:8px 16px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:8px; ${isSelected ? 'background:#E8F0FE; color:var(--primary); font-weight:500;' : 'color:var(--text-main);'}" onclick="Companies.selectFilter('${type}', '${opt}')" onmouseover="this.style.background='${isSelected ? '#E8F0FE' : '#F9FAFB'}'" onmouseout="this.style.background='${isSelected ? '#E8F0FE' : 'transparent'}'">
            ${isSelected ? '<i data-lucide="check" style="width:14px; color:var(--primary);"></i>' : '<div style="width:14px;"></div>'}
            <span>${opt}</span>
          </div>
        `;
      }).join('');
      lucide.createIcons({ root: menu });
    };

    renderMenu('owner', ownerOptions);
    renderMenu('date', dateOptions);
    renderMenu('pagination', paginationOptions);
  },

  renderTableRows: (companies) => {
    const tbody = document.getElementById('company-table-body');
    if (!tbody) return;
    
    if (companies.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">
            No companies found
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = companies.map(c => {
      const initials = c.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      return `
      <tr id="company-row-${c.id}">
        <td class="table-checkbox"><input type="checkbox" class="company-checkbox" value="${c.id}" onchange="Companies.updateBulkActions(this)"></td>
        <td><a href="#" style="color: var(--primary); font-weight: 500; text-decoration: none;" onclick="app.navigate('companyDetail', '${c.id}')">${c.id}</a></td>
        <td style="font-weight: 500;">
          <a href="#" style="display: flex; align-items: center; gap: 8px; color: var(--text-main); text-decoration: none;" onclick="app.navigate('companyDetail', '${c.id}')">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: #E8F0FE; color: #1967D2; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600;">${initials}</div>
            ${c.name}
          </a>
        </td>
        <td style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 20px; height: 20px; border-radius: 50%; background: #E8F0FE; color: #1967D2; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600;">${c.owner.split(' ').map(w => w[0]).join('')}</div>
          ${c.owner}
        </td>
        <td>${c.createdAt}</td>
        <td>${c.industry}</td>
        <td>${c.location}</td>
        <td>${c.contacts > 0 ? `<a href="#" style="color: var(--primary); text-decoration: none; font-weight:500;">${c.contacts}</a>` : '<span style="color:var(--text-muted); padding-left:4px;">0</span>'}</td>
        <td>${c.deals > 0 ? `<a href="#" style="color: var(--primary); text-decoration: none; font-weight:500;">${c.deals}</a>` : '<span style="color:var(--text-muted); padding-left:4px;">0</span>'}</td>
        <td style="color: ${c.lastActivityDate === '--' ? 'var(--text-muted)' : 'inherit'};">${c.lastActivityDate}</td>
        <td style="color: ${c.phone === '--' ? 'var(--text-muted)' : 'inherit'};">${c.phone}</td>
        <td style="position: relative;">
          <button class="btn-icon" onclick="Companies.toggleActionMenu('${c.id}')"><i data-lucide="more-horizontal" style="width:16px;"></i></button>
          <div id="company-action-${c.id}" style="display:none; position:absolute; top:100%; right:0; background:white; border:1px solid var(--border-color); border-radius:4px; box-shadow:var(--shadow-md); z-index:100; min-width: 120px; text-align:left;">
            <div style="padding:8px 12px; cursor:pointer; font-size:13px;" onclick="app.navigate('companyDetail', '${c.id}')">Details</div>
            <div style="padding:8px 12px; cursor:pointer; font-size:13px;" onclick="UI.toast('Edit Company: ${c.id}')">Edit</div>
            <div style="padding:8px 12px; cursor:pointer; font-size:13px; color:var(--error);" onclick="UI.toast('Delete Company: ${c.id}')">Delete</div>
          </div>
        </td>
      </tr>
    `}).join('');
    
    lucide.createIcons({ root: tbody });
  },

  filterList: () => {
    const searchInput = document.getElementById('company-search-input');
    Companies.filters.search = (searchInput ? searchInput.value : '').toLowerCase();
    
    const { search, owner, date } = Companies.filters;

    const filtered = DB.companies.filter(c => {
      let match = true;
      if (search) {
        const text = Object.values(c).join(' ').toLowerCase();
        if (!text.includes(search)) match = false;
      }
      if (owner !== 'All owners' && c.owner !== owner) match = false;
      if (date === 'This month') {
        // Mock filtering logic for prototype
        match = false; 
      }
      return match;
    });

    Companies.renderTableRows(filtered);

    // Update pagination footer and counts based on if filters are active
    const paginationDefault = document.getElementById('company-pagination-default');
    const paginationSearch = document.getElementById('company-pagination-search');
    const searchCount = document.getElementById('company-search-count');
    
    if (search || owner !== 'All owners' || date !== 'All dates') {
      if (paginationDefault) paginationDefault.style.display = 'none';
      if (paginationSearch) paginationSearch.style.display = 'flex';
      if (searchCount) searchCount.textContent = filtered.length;
    } else {
      if (paginationDefault) paginationDefault.style.display = 'flex';
      if (paginationSearch) paginationSearch.style.display = 'none';
    }
  },

  toggleAllCheckboxes: (source) => {
    const checkboxes = document.querySelectorAll('.company-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = source.checked;
      const row = document.getElementById(`company-row-${cb.value}`);
      if (row) {
        if (cb.checked) row.classList.add('selected');
        else row.classList.remove('selected');
      }
    });
    Companies.updateBulkActions();
  },

  updateBulkActions: (sourceCheckbox) => {
    if (sourceCheckbox) {
      const row = document.getElementById(`company-row-${sourceCheckbox.value}`);
      if (row) {
        if (sourceCheckbox.checked) row.classList.add('selected');
        else row.classList.remove('selected');
      }
    }

    const checkboxes = document.querySelectorAll('.company-checkbox:checked');
    const deleteBtn = document.getElementById('company-bulk-delete');
    const exportBtn = document.getElementById('company-export-btn');
    const selectedCount = document.getElementById('company-selected-count');
    const titleCount = document.getElementById('company-total-count');
    
    if (checkboxes.length > 0) {
      deleteBtn.style.opacity = '1';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.style.color = 'var(--error)';
      deleteBtn.style.borderColor = 'var(--error)';
      deleteBtn.removeAttribute('disabled');
      
      exportBtn.style.opacity = '1';
      exportBtn.style.cursor = 'pointer';
      exportBtn.removeAttribute('disabled');
      
      if (selectedCount) {
        selectedCount.style.display = 'inline-flex';
        selectedCount.textContent = `${checkboxes.length} selected`;
      }
      if (titleCount) titleCount.style.display = 'none';
    } else {
      deleteBtn.style.opacity = '0.5';
      deleteBtn.style.cursor = 'not-allowed';
      deleteBtn.style.color = 'inherit';
      deleteBtn.style.borderColor = 'var(--border-color)';
      deleteBtn.setAttribute('disabled', 'true');
      
      exportBtn.style.opacity = '0.5';
      exportBtn.style.cursor = 'not-allowed';
      exportBtn.setAttribute('disabled', 'true');
      
      if (selectedCount) selectedCount.style.display = 'none';
      if (titleCount) titleCount.style.display = 'inline';
    }
  },

  bulkDeletePrompt: () => {
    const checkboxes = document.querySelectorAll('.company-checkbox:checked');
    const ids = Array.from(checkboxes).map(cb => cb.value);
    
    let skippedCount = 0;
    ids.forEach(id => {
      const comp = DB.companies.find(c => c.id === id);
      if (comp && !comp.owner.includes('Hara')) {
        skippedCount++;
      }
    });

    const body = `
      <div style="font-size:13px; color:var(--text-main); margin-bottom:16px;">
        Delete <strong>${ids.length} companies?</strong>
      </div>
      ${skippedCount > 0 ? `
      <div style="font-size:13px; color:var(--text-main);">
        ${skippedCount} company will be skipped because you do not have delete permission.
      </div>
      ` : `
      <div style="font-size:13px; color:var(--text-main);">
        1 company will be skipped because you do not have delete permission.
      </div>`}
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Companies.executeBulkDelete('${ids.join(',')}')">Delete</button>
    `;
    UI.openModal('Delete companies', body, footer);
  },

  executeBulkDelete: (idsString) => {
    const idsToDelete = idsString.split(',');
    DB.companies = DB.companies.filter(c => !idsToDelete.includes(c.id));
    UI.closeModal();
    UI.toast(`${idsToDelete.length} compan(ies) archived successfully.`);
    app.navigate('companies');
  },

  openImportModal: () => {
    const body = `
      <div style="font-size:12px; color:var(--text-muted); margin-bottom: 24px; margin-top:-8px;">
        Upload a CSV file to bulk import companies.
      </div>
      
      <!-- Stepper -->
      <div style="display:flex; justify-content:center; align-items:center; gap:32px; margin-bottom:32px; font-size:12px; font-weight:500;">
        <div style="display:flex; align-items:center; gap:8px; color:var(--text-main);">
          <div style="width:20px; height:20px; border-radius:50%; background:#F97316; color:white; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:11px;">1</div>
          Upload
        </div>
        <div style="display:flex; align-items:center; gap:8px; color:var(--text-muted);">
          <div style="width:20px; height:20px; border-radius:50%; background:#F3F4F6; color:var(--text-muted); display:flex; align-items:center; justify-content:center; font-weight:600; font-size:11px;">2</div>
          Field mapping
        </div>
        <div style="display:flex; align-items:center; gap:8px; color:var(--text-muted);">
          <div style="width:20px; height:20px; border-radius:50%; background:#F3F4F6; color:var(--text-muted); display:flex; align-items:center; justify-content:center; font-weight:600; font-size:11px;">3</div>
          Preview
        </div>
        <div style="display:flex; align-items:center; gap:8px; color:var(--text-muted);">
          <div style="width:20px; height:20px; border-radius:50%; background:#F3F4F6; color:var(--text-muted); display:flex; align-items:center; justify-content:center; font-weight:600; font-size:11px;">4</div>
          Result
        </div>
      </div>
      
      <div style="font-size:13px; color:var(--text-main); margin-bottom:16px;">
        Download the template, fill in your data, then upload the CSV file.
      </div>
      
      <div style="display:flex; justify-content:space-between; align-items:center; padding:16px; border:1px solid var(--border-color); border-radius:4px; margin-bottom:24px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="color:var(--text-muted);"><i data-lucide="file-text" style="width:24px; height:24px;"></i></div>
          <div>
            <div style="font-size:13px; font-weight:600; color:var(--text-main);">Companies import template</div>
            <div style="font-size:11px; color:var(--text-muted);">Includes required fields and a sample row.</div>
          </div>
        </div>
        <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px; display:flex; align-items:center; gap:6px;" onclick="UI.toast('Downloading template...')">
          <i data-lucide="download" style="width:14px;"></i> Download template
        </button>
      </div>
      
      <!-- Drag & drop zone -->
      <div style="border:1px dashed #D1D5DB; border-radius:4px; padding:32px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; cursor:pointer; transition:all 0.2s; position:relative; overflow:hidden;" onmouseover="this.style.borderColor='#F59E0B'" onmouseout="this.style.borderColor='#D1D5DB'" onclick="UI.toast('Upload file dialog opened.')">
        <i data-lucide="cloud-upload" style="width:32px; height:32px; color:var(--text-muted); margin-bottom:12px;"></i>
        <div style="font-size:13px; font-weight:600; color:var(--text-main); margin-bottom:4px;">Drag & drop CSV here or click to browse</div>
        <div style="font-size:11px; color:var(--text-muted);">CSV only - Max 5 MB</div>
        
        <!-- Bottom green border mimicking screenshot -->
        <div style="position:absolute; bottom:8px; left:16px; right:16px; height:4px; background:#D1FAE5; border-radius:2px;"></div>
      </div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" style="opacity:0.5; cursor:not-allowed;" disabled>Next</button>
    `;
    UI.openModal('Import Companies', body, footer);
  },

  toggleActionMenu: (id) => {
    const menu = document.getElementById(`company-action-${id}`);
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  },

  newAssocContacts: [],
  newAssocDeals: [],

  toggleModalDropdown: (type) => {
    const menu = document.getElementById(`modal-assoc-${type}`);
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  },

  refreshAssocOptions: (type) => {
    if (type === 'contact') {
      const container = document.getElementById('modal-contact-options');
      if (container) {
        container.innerHTML = DB.contacts.map(c => `
          <div style="padding:8px; display:flex; align-items:start; gap:8px; border-bottom:1px solid var(--border-color); cursor:pointer; background:${Companies.newAssocContacts.includes(c.id) ? '#F4F7FB' : 'white'};" onclick="Companies.toggleNewAssoc('contact', '${c.id}')">
            <input type="checkbox" style="margin-top:2px; cursor:pointer;" ${Companies.newAssocContacts.includes(c.id) ? 'checked' : ''}>
            <div>
              <div style="font-size:13px; font-weight:500; color:var(--text-main);">${c.id} - ${c.firstName} ${c.lastName}</div>
              <div style="font-size:11px; color:var(--text-muted);">${c.email} - ${c.phone} - ${c.owner}</div>
            </div>
          </div>
        `).join('');
      }
    } else {
      const container = document.getElementById('modal-deal-options');
      if (container) {
        container.innerHTML = DB.deals.map(d => `
          <div style="padding:8px; display:flex; align-items:start; gap:8px; border-bottom:1px solid var(--border-color); cursor:pointer; background:${Companies.newAssocDeals.includes(d.id) ? '#F4F7FB' : 'white'};" onclick="Companies.toggleNewAssoc('deal', '${d.id}')">
            <input type="checkbox" style="margin-top:2px; cursor:pointer;" ${Companies.newAssocDeals.includes(d.id) ? 'checked' : ''}>
            <div>
              <div style="font-size:13px; font-weight:500; color:var(--text-main);">${d.name}</div>
              <div style="font-size:11px; color:var(--text-muted);">${d.id} - ${d.company || 'No Company'} - ${d.stage} - ${d.owner}</div>
            </div>
          </div>
        `).join('');
      }
    }
  },

  toggleNewAssoc: (type, id) => {
    if (type === 'deal') {
      const deal = DB.deals.find(d => d.id === id);
      const isAlreadyLinked = deal && deal.company && deal.company !== '';
      const isChecked = Companies.newAssocDeals.includes(id);

      if (!isChecked && isAlreadyLinked) {
        // Show confirmation modal OVER the current modal
        const body = `
          <div style="font-size:13px; color:var(--text-main); margin-bottom:16px;">
            Deal "${deal.name}" is linked to ${deal.company}.<br>
            Continue linking these records to this company?
          </div>
        `;
        const footer = `
          <button class="btn btn-secondary" onclick="document.getElementById('confirm-assoc-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="Companies.confirmAssocDeal('${id}')">Continue</button>
        `;
        
        const overlay = document.createElement('div');
        overlay.id = 'confirm-assoc-overlay';
        overlay.className = 'modal-overlay active';
        overlay.style.zIndex = '2000'; // Above the first modal
        overlay.innerHTML = `
          <div class="modal" style="width: 400px; padding:24px;">
            <div class="modal-header">
              <h2 class="modal-title" style="font-size:16px;">Confirm associations</h2>
              <button class="btn-icon" onclick="document.getElementById('confirm-assoc-overlay').remove()"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body" style="padding:0;">${body}</div>
            <div class="modal-footer" style="padding:0; padding-top:16px;">${footer}</div>
          </div>
        `;
        document.body.appendChild(overlay);
        lucide.createIcons({ root: overlay });
        return;
      }
      
      if (isChecked) {
        Companies.newAssocDeals = Companies.newAssocDeals.filter(d => d !== id);
      } else {
        Companies.newAssocDeals.push(id);
      }
      Companies.refreshAssocOptions('deal');
    } else {
      const isChecked = Companies.newAssocContacts.includes(id);
      if (isChecked) {
        Companies.newAssocContacts = Companies.newAssocContacts.filter(c => c !== id);
      } else {
        Companies.newAssocContacts.push(id);
      }
      Companies.refreshAssocOptions('contact');
    }
  },

  confirmAssocDeal: (id) => {
    Companies.newAssocDeals.push(id);
    Companies.refreshAssocOptions('deal');
    document.getElementById('confirm-assoc-overlay').remove();
  },

  openCreateModal: () => {
    Companies.newAssocContacts = [];
    Companies.newAssocDeals = [];

    const body = `
      <div class="form-group">
        <label class="form-label">Company name <span class="required" style="color:var(--error);">*</span></label>
        <input type="text" id="comp-name" class="form-control" placeholder="Acme Corporation" oninput="this.style.borderColor='var(--border-color)'; document.getElementById('comp-error').style.display='none';">
      </div>
      <div class="form-group">
        <label class="form-label">Company Domain Name</label>
        <input type="text" id="comp-domain" class="form-control" placeholder="acme.com">
      </div>
      <div class="form-group">
        <label class="form-label">Linked Company Page</label>
        <input type="text" id="comp-linkedin" class="form-control" placeholder="https://linkedin.com/company/acme">
      </div>
      <div style="display: flex; gap: 16px;">
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Industry <span class="required" style="color:var(--error);">*</span></label>
          <input type="text" id="comp-industry" class="form-control" placeholder="Technology" oninput="this.style.borderColor='var(--border-color)'; document.getElementById('comp-error').style.display='none';">
        </div>
        <div class="form-group" style="flex: 1;">
          <label class="form-label">City</label>
          <input type="text" id="comp-city" class="form-control" placeholder="San Francisco">
        </div>
      </div>
      <div style="display: flex; gap: 16px;">
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Country/Region <span class="required" style="color:var(--error);">*</span></label>
          <input type="text" id="comp-country" class="form-control" placeholder="United States">
        </div>
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Phone number</label>
          <input type="text" id="comp-phone" class="form-control" placeholder="+1 234 567 8900">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Company owner</label>
        <select id="comp-owner" class="form-control">
          ${DB.users.map(u => `<option value="${u}" ${u.includes('Hara') ? 'selected' : ''}>${u}</option>`).join('')}
        </select>
      </div>
      
      <div class="form-group" style="position:relative;">
        <div class="form-control" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="Companies.toggleModalDropdown('contact')">
          <span style="color:var(--text-main);">Associate contact</span>
          <i data-lucide="chevron-down" style="width:16px; color:var(--text-muted);"></i>
        </div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Search by contact name, email, phone number, or owner. Contacts already linked to other companies are marked.</div>
        
        <div id="modal-assoc-contact" style="display:none; position:absolute; top:40px; left:0; right:0; background:white; border:1px solid var(--border-color); border-radius:4px; box-shadow:var(--shadow-lg); z-index:100; max-height:250px; overflow-y:auto; padding:8px;">
          <input type="text" class="form-control" placeholder="Search by name, email, phone, owner..." style="margin-bottom:8px; border-color:#1967D2;" onclick="event.stopPropagation()">
          <div id="modal-contact-options">
            <!-- options rendered by refreshAssocOptions -->
          </div>
        </div>
      </div>

      <div class="form-group" style="position:relative; margin-bottom:4px;">
        <div class="form-control" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="Companies.toggleModalDropdown('deal')">
          <span style="color:var(--text-main);">Associate deals</span>
          <i data-lucide="chevron-down" style="width:16px; color:var(--text-muted);"></i>
        </div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Search by deal ID, name, owner, stage, or associated company. Deals linked to another company require confirmation.</div>
        
        <div id="modal-assoc-deal" style="display:none; position:absolute; top:40px; left:0; right:0; background:white; border:1px solid var(--border-color); border-radius:4px; box-shadow:var(--shadow-lg); z-index:100; max-height:250px; overflow-y:auto; padding:8px;">
          <input type="text" class="form-control" placeholder="Search by deal ID, name, owner, stage, company..." style="margin-bottom:8px; border-color:#1967D2;" onclick="event.stopPropagation()">
          <div id="modal-deal-options">
            <!-- options rendered by refreshAssocOptions -->
          </div>
        </div>
      </div>
      
      <div id="comp-error" style="color:var(--error); font-size:12px; margin-top:8px; display:none;">Company name and Industry are required.</div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Companies.saveCompany()">Save</button>
    `;
    UI.openModal('Create Company', body, footer);
    
    // Initial render of options
    Companies.refreshAssocOptions('contact');
    Companies.refreshAssocOptions('deal');
  },

  saveCompany: () => {
    const nameInput = document.getElementById('comp-name');
    const industryInput = document.getElementById('comp-industry');
    const linkedInput = document.getElementById('comp-linkedin');
    
    const name = nameInput.value;
    const industry = industryInput.value;
    const errorMsg = document.getElementById('comp-error');
    
    let hasError = false;

    if (!name) {
      nameInput.style.borderColor = 'var(--error)';
      hasError = true;
    }
    if (!industry) {
      industryInput.style.borderColor = 'var(--error)';
      hasError = true;
    }

    if (hasError) {
      errorMsg.style.display = 'block';
      if (linkedInput) linkedInput.style.borderColor = 'var(--error)'; // Match screenshot artifact
      return;
    }

    DB.companies.unshift({
      id: generateId('COM'),
      name: name,
      domain: document.getElementById('comp-domain').value || '',
      industry: industry,
      location: document.getElementById('comp-country').value || document.getElementById('comp-city').value || '--',
      owner: document.getElementById('comp-owner').value.split(' ')[0] + ' Sales',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      contacts: Companies.newAssocContacts.length,
      deals: Companies.newAssocDeals.length,
      lastActivityDate: '--',
      phone: document.getElementById('comp-phone').value || '--'
    });

    UI.closeModal();
    UI.toast('Company created successfully');
    app.navigate('companies');
  },

  isDirty: false,

  markDirty: () => {
    Companies.isDirty = true;
    const footer = document.getElementById('company-detail-footer');
    if (footer) footer.style.display = 'flex';
  },

  confirmDiscard: (companyId) => {
    if (!Companies.isDirty) {
      Companies.renderDetail(document.getElementById('app-content'), companyId, false);
      return;
    }
    const body = `
      <div style="font-size:13px; color:var(--text-main); margin-bottom:8px;">
        You have unsaved changes. Are you sure you want to discard them?
      </div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Continue editing</button>
      <button class="btn btn-primary" style="background:var(--error); border-color:var(--error); color:white;" onclick="UI.closeModal(); Companies.isDirty=false; Companies.renderDetail(document.getElementById('app-content'), '${companyId}', false);">Discard changes</button>
    `;
    UI.openModal('Discard changes?', body, footer);
  },

  saveDetailChanges: (companyId) => {
    const nameInput = document.getElementById('edit-comp-name');
    const domainInput = document.getElementById('edit-comp-domain');
    const linkedInput = document.getElementById('edit-comp-linkedin');
    
    let hasError = false;
    if (!nameInput.value) { nameInput.style.borderColor = 'var(--error)'; hasError = true; }
    if (!domainInput.value) { domainInput.style.borderColor = 'var(--error)'; hasError = true; }
    if (!linkedInput.value) { linkedInput.style.borderColor = 'var(--error)'; hasError = true; }
    
    if (hasError) {
      document.getElementById('edit-error').style.display = 'block';
      return;
    }
    
    const body = `
      <div style="font-size:13px; color:var(--text-main); margin-bottom:8px;">
        Are you sure you want to save your changes?
      </div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">No, continue editing</button>
      <button class="btn btn-primary" onclick="UI.closeModal(); Companies.isDirty=false; UI.toast('Changes saved successfully.'); Companies.renderDetail(document.getElementById('app-content'), '${companyId}', false);">Save changes</button>
    `;
    UI.openModal('Save changes?', body, footer);
  },

  openAddContactModal: (companyId, tab = 'existing') => {
    const isCreate = tab === 'create';
    const body = `
      <div style="display:flex; border-bottom:1px solid var(--border-color); margin-bottom:16px;">
        <div style="padding:8px 16px; cursor:pointer; font-size:13px; font-weight:500; color:${isCreate ? 'var(--primary)' : 'var(--text-main)'}; border-bottom:2px solid ${isCreate ? 'var(--primary)' : 'transparent'};" onclick="Companies.openAddContactModal('${companyId}', 'create')">Create new</div>
        <div style="padding:8px 16px; cursor:pointer; font-size:13px; font-weight:500; color:${!isCreate ? 'var(--primary)' : 'var(--text-main)'}; border-bottom:2px solid ${!isCreate ? 'var(--primary)' : 'transparent'};" onclick="Companies.openAddContactModal('${companyId}', 'existing')">Add existing</div>
      </div>
      
      ${isCreate ? `
        <div style="font-size:12px; color:var(--text-main); margin-bottom:16px;">Enter contact details to create and associate with this record.</div>
        <div style="display:flex; gap:16px;">
          <div class="form-group" style="flex:1;">
            <label class="form-label">First name <span class="required" style="color:var(--error);">*</span></label>
            <input type="text" class="form-control">
          </div>
          <div class="form-group" style="flex:1;">
            <label class="form-label">Last name <span class="required" style="color:var(--error);">*</span></label>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email <span class="required" style="color:var(--error);">*</span></label>
          <input type="text" class="form-control">
        </div>
        <div class="form-group">
          <label class="form-label">Phone number</label>
          <input type="text" class="form-control">
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Contact owner <span class="required" style="color:var(--error);">*</span></label>
          <select class="form-control"><option>Alex Sales</option></select>
        </div>
      ` : `
        <div style="display:flex; gap:16px; margin-bottom:16px;">
          <div style="flex:1; position:relative;">
            <i data-lucide="search" style="position:absolute; left:12px; top:10px; width:16px; color:var(--text-muted);"></i>
            <input type="text" class="form-control" placeholder="Search companies" style="padding-left:36px;">
          </div>
          <select class="form-control" style="width:200px;"><option>Default (Recently added)</option></select>
        </div>
        <div style="font-size:12px; font-weight:600; margin-bottom:8px;">12 Contacts</div>
        <div style="border:1px solid var(--border-color); border-radius:4px; max-height:200px; overflow-y:auto; margin-bottom:16px;">
          ${DB.contacts.map(c => `
            <div style="padding:12px; display:flex; align-items:start; gap:12px; border-bottom:1px solid var(--border-color);">
              <input type="checkbox" style="margin-top:2px;">
              <div>
                <div style="font-size:13px; font-weight:500; color:var(--text-main);">${c.id} - ${c.firstName} ${c.lastName}</div>
                <div style="font-size:11px; color:var(--text-muted);">${c.email} - ${c.phone} - ${c.owner}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--text-muted);">
          <div style="display:flex; align-items:center; gap:4px;">
            <button class="btn btn-secondary" style="padding:2px 6px; min-width:auto;">&lt;</button>
            <button class="btn btn-primary" style="padding:2px 6px; min-width:auto;">1</button>
            <button class="btn btn-secondary" style="padding:2px 6px; min-width:auto;">2</button>
            <button class="btn btn-secondary" style="padding:2px 6px; min-width:auto;">&gt;</button>
          </div>
          <div>10 items per page</div>
        </div>
      `}
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="UI.closeModal(); UI.toast('Contact ${isCreate ? 'created' : 'added'}'); Companies.renderDetail(document.getElementById('app-content'), '${companyId}', false)">${isCreate ? 'Create' : 'Add'}</button>
    `;
    UI.openModal('Add Contact', body, footer);
  },

  openAddDealModal: (companyId, tab = 'existing') => {
    const isCreate = tab === 'create';
    const body = `
      <div style="display:flex; border-bottom:1px solid var(--border-color); margin-bottom:16px;">
        <div style="padding:8px 16px; cursor:pointer; font-size:13px; font-weight:500; color:${isCreate ? 'var(--primary)' : 'var(--text-main)'}; border-bottom:2px solid ${isCreate ? 'var(--primary)' : 'transparent'};" onclick="Companies.openAddDealModal('${companyId}', 'create')">Create new</div>
        <div style="padding:8px 16px; cursor:pointer; font-size:13px; font-weight:500; color:${!isCreate ? 'var(--primary)' : 'var(--text-main)'}; border-bottom:2px solid ${!isCreate ? 'var(--primary)' : 'transparent'};" onclick="Companies.openAddDealModal('${companyId}', 'existing')">Add existing</div>
      </div>
      
      ${isCreate ? `
        <div style="font-size:12px; color:var(--text-main); margin-bottom:16px;">Enter deal details to create and associate with this record.</div>
        <div class="form-group">
          <label class="form-label">Deal name <span class="required" style="color:var(--error);">*</span></label>
          <input type="text" class="form-control">
        </div>
      ` : `
        <div style="display:flex; gap:16px; margin-bottom:16px;">
          <div style="flex:1; position:relative;">
            <i data-lucide="search" style="position:absolute; left:12px; top:10px; width:16px; color:var(--text-muted);"></i>
            <input type="text" class="form-control" placeholder="Search companies" style="padding-left:36px;">
          </div>
          <select class="form-control" style="width:200px;"><option>Default (Recently added)</option></select>
        </div>
        <div style="font-size:12px; font-weight:600; margin-bottom:8px;">0 Deals</div>
        <div style="border:1px solid var(--border-color); border-radius:4px; height:200px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:13px;">
          No deals match your search.
        </div>
      `}
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="UI.closeModal(); UI.toast('Deal ${isCreate ? 'created' : 'added'}'); Companies.renderDetail(document.getElementById('app-content'), '${companyId}', false)">${isCreate ? 'Create' : 'Add'}</button>
    `;
    UI.openModal('Add Deals', body, footer);
  },

  renderDetail: (container, companyId, isEditing = false) => {
    const comp = DB.companies.find(c => c.id === companyId) || DB.companies[0];
    
    const assocDeals = DB.deals.filter(d => d.company === comp.name);
    const assocContacts = DB.contacts.filter(c => c.company === comp.id);
    
    const isOwner = comp.owner && comp.owner.includes('Hara');
    const isReadOnly = !isOwner; 
    
    // The "Overview" card content
    const renderOverview = () => `
      <div class="deal-info-card" style="padding:0; overflow:hidden;">
        <div style="padding:16px; border-bottom:1px solid var(--border-color); font-weight:600; font-size:14px;">Overview</div>
        <div style="padding:16px; display:grid; grid-template-columns: 1fr 1fr; gap:16px; font-size:12px;">
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Company ID</div>
            <div style="color:var(--text-main); font-weight:500;">${comp.id}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Company name</div>
            <div style="color:var(--text-main); font-weight:500;">${comp.name}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Company owner</div>
            <div style="color:var(--text-main); font-weight:500;">${comp.owner}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Created by</div>
            <div style="color:var(--text-main); font-weight:500;">${comp.owner}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Create date</div>
            <div style="color:var(--text-main); font-weight:500;">${comp.createdAt || '1/10/2023 at 8:14 AM'}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Industry</div>
            <div style="color:var(--text-main); font-weight:500;">${comp.industry || '--'}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Location</div>
            <div style="color:var(--text-main); font-weight:500;">${comp.location || '--'}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Contacts</div>
            <div style="color:var(--text-main); font-weight:500;">${assocContacts.length}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Deals</div>
            <div style="color:var(--text-main); font-weight:500;">${assocDeals.length}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Last activity date</div>
            <div style="color:var(--text-main); font-weight:500;">${comp.lastActivityDate || '--'}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Phone number</div>
            <div style="color:var(--text-main); font-weight:500;">${comp.phone || '--'}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Company Domain Name</div>
            <div style="color:var(--primary); font-weight:500;">${comp.domain ? `<a href="https://${comp.domain}" target="_blank" style="color:var(--primary); text-decoration:none;">www.${comp.domain}</a>` : '--'}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Linked Company Page</div>
            <div style="color:var(--text-main); font-weight:500;">--</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">Description</div>
            <div style="color:var(--text-main); font-weight:500;">Leading technology solutions provider</div>
          </div>
        </div>
        <div style="display:flex; border-top:1px solid var(--border-color);">
          <div style="flex:1; padding:16px; text-align:center; border-right:1px solid var(--border-color); cursor:pointer; background:#F9FAFB;">
            <i data-lucide="users" style="width:20px; height:20px; color:var(--text-muted); margin-bottom:8px;"></i>
            <div style="font-size:16px; font-weight:600;">${assocContacts.length}</div>
            <div style="font-size:11px; color:var(--text-muted);">Contacts</div>
          </div>
          <div style="flex:1; padding:16px; text-align:center; cursor:pointer; background:#F9FAFB;">
            <i data-lucide="dollar-sign" style="width:20px; height:20px; color:var(--text-muted); margin-bottom:8px;"></i>
            <div style="font-size:16px; font-weight:600;">${assocDeals.length}</div>
            <div style="font-size:11px; color:var(--text-muted);">Deals</div>
          </div>
        </div>
      </div>
    `;

    // The "About this company" card
    const renderAbout = () => {
      if (!isEditing) {
        return `
          <div class="deal-info-card" style="margin-top:0;">
            <h3 style="font-size:14px; font-weight:600; margin-bottom:16px;">About this company</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; font-size:12px;">
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Company name</div>
                <div style="color:var(--text-main); font-weight:500;">${comp.name}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Company Domain Name</div>
                <div style="color:var(--primary); font-weight:500;">${comp.domain || '--'}</div>
              </div>
              <div style="grid-column: 1 / -1;">
                <div style="color:var(--text-muted); margin-bottom:4px;">Linked Company Page</div>
                <div style="color:var(--text-main); font-weight:500;">--</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">City</div>
                <div style="color:var(--text-main); font-weight:500;">${comp.location.split(',')[0] || '--'}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Country/Region</div>
                <div style="color:var(--text-main); font-weight:500;">${comp.location.split(',')[1]?.trim() || '--'}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Phone number</div>
                <div style="color:var(--text-main); font-weight:500;">${comp.phone || '--'}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Industry</div>
                <div style="color:var(--text-main); font-weight:500;">${comp.industry || '--'}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Segment</div>
                <div style="color:var(--text-main); font-weight:500;">--</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Company owner</div>
                <div style="color:var(--text-main); font-weight:500;">${comp.owner}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Company type</div>
                <div style="color:var(--text-main); font-weight:500;">--</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Industry group</div>
                <div style="color:var(--text-main); font-weight:500;">--</div>
              </div>
            </div>
          </div>
        `;
      }

      return `
        <div class="deal-info-card" id="about-card" style="margin-top:0;">
          <h3 style="font-size:14px; font-weight:600; margin-bottom:16px;">About this company</h3>
          <div class="form-group">
            <label class="form-label">Company name <span class="required" style="color:var(--error);">*</span></label>
            <input type="text" id="edit-comp-name" class="form-control" value="${comp.name}" oninput="Companies.markDirty(); this.style.borderColor='var(--border-color)'; document.getElementById('edit-error').style.display='none';">
          </div>
          <div class="form-group">
            <label class="form-label">Company Domain Name <span class="required" style="color:var(--error);">*</span></label>
            <input type="text" id="edit-comp-domain" class="form-control" value="${comp.domain || comp.name.toLowerCase().replace(/ /g, '')+'.com'}" oninput="Companies.markDirty(); this.style.borderColor='var(--border-color)'; document.getElementById('edit-error').style.display='none';">
          </div>
          <div class="form-group">
            <label class="form-label">Linked Company Page <span class="required" style="color:var(--error);">*</span></label>
            <input type="text" id="edit-comp-linkedin" class="form-control" value="" oninput="Companies.markDirty(); this.style.borderColor='var(--border-color)'; document.getElementById('edit-error').style.display='none';">
          </div>
          <div class="form-group">
            <label class="form-label">Industry</label>
            <select class="form-control" onchange="Companies.markDirty()">
              <option ${comp.industry === 'Technology' ? 'selected' : ''}>Technology</option>
              <option ${comp.industry === 'IT Services' ? 'selected' : ''}>IT Services</option>
              <option ${comp.industry === 'Financial Services' ? 'selected' : ''}>Financial Services</option>
            </select>
          </div>
          <div style="display:flex; gap:16px;">
            <div class="form-group" style="flex:1;">
              <label class="form-label">City</label>
              <input type="text" class="form-control" value="${comp.location.split(',')[0] || ''}" oninput="Companies.markDirty()">
            </div>
            <div class="form-group" style="flex:1;">
              <label class="form-label">Country/Region</label>
              <input type="text" class="form-control" value="${comp.location.split(',')[1]?.trim() || ''}" oninput="Companies.markDirty()">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Phone number</label>
            <input type="text" class="form-control" value="${comp.phone !== '--' ? comp.phone : ''}" oninput="Companies.markDirty()">
          </div>
          <div class="form-group">
            <label class="form-label">Company owner</label>
            <select class="form-control" onchange="Companies.markDirty()" ${!isOwner ? 'disabled style="background:#F9FAFB; cursor:not-allowed;"' : ''}>
              ${DB.users.map(u => `<option value="${u}" ${u.includes(comp.owner) ? 'selected' : ''}>${u.split(' ')[0] + ' ' + u.split(' ')[1]}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Segment</label>
            <select class="form-control" onchange="Companies.markDirty()"><option>Select</option></select>
          </div>
          <div class="form-group">
            <label class="form-label">Industry group</label>
            <select class="form-control" onchange="Companies.markDirty()"><option>Select</option></select>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Company type</label>
            <select class="form-control" onchange="Companies.markDirty()"><option>Select</option></select>
          </div>
          <div id="edit-error" style="color:var(--error); font-size:12px; margin-top:16px; display:none;">Company name is required.</div>
        </div>
      `;
    };

    container.innerHTML = `
      <div class="detail-header" style="margin-bottom:16px; padding-bottom:0; border-bottom:none;">
        <a href="#" class="back-link" onclick="app.navigate('companies')">
          <i data-lucide="arrow-left" style="width:16px;"></i> Back to Companies
        </a>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
          <div style="width:32px; height:32px; border-radius:4px; background:#F3F4F6; display:flex; align-items:center; justify-content:center;">
            <i data-lucide="building" style="width:16px; color:var(--text-muted);"></i>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 class="detail-title" style="font-size:18px;">${comp.name}</h1>
              <button class="badge badge-blue" style="background:#2563EB; color:white; padding:2px 8px; font-size:10px; border:none; cursor:pointer;" onclick="${!isReadOnly ? `Companies.renderDetail(document.getElementById('app-content'), '${companyId}', true)` : ''}" ${isReadOnly ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>EDIT</button>
            </div>
            <div class="detail-subtitle" style="font-size:11px; margin-top:2px;">${comp.id}</div>
          </div>
        </div>
      </div>
      
      ${isReadOnly 
        ? `<div style="background:#F3F4F6; padding:12px 16px; border-radius:4px; font-size:13px; color:var(--text-main); margin-bottom:24px; display:flex; flex-direction:column; gap:4px;">
            <div>View-only — previewing as another user without edit permission.</div>
            <div><a href="#" style="color:var(--primary); text-decoration:none; font-weight:500;">Request access</a></div>
           </div>`
        : `<div style="background:#EFF6FF; padding:12px 16px; border-radius:4px; font-size:13px; color:#1E40AF; margin-bottom:24px;">
            You can edit this company (Admin).
           </div>`
      }
      
      <div style="display:grid; grid-template-columns: 320px 1fr; gap:24px; padding-bottom:80px;">
        <!-- Left Column -->
        <div class="detail-left">
          ${renderOverview()}
        </div>
        
        <!-- Right Column -->
        <div class="detail-right" style="display:flex; flex-direction:column; gap:16px;">
          ${renderAbout()}
          
          <div class="deal-info-card">
            <h3 style="font-size:12px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:16px;">DESCRIPTION</h3>
            ${!isEditing 
              ? `<div style="font-size:13px; color:var(--text-main);">Leading technology solutions provider</div>`
              : `<textarea class="form-control" style="min-height:100px; resize:vertical;" oninput="Companies.markDirty()"></textarea>`
            }
          </div>
          
          <div class="deal-info-card">
            <h3 style="font-size:12px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:16px;">Activity</h3>
            <div style="font-size:13px; color:var(--text-muted);">No activity yet</div>
          </div>
          
          <div class="deal-info-card" style="padding:0; overflow:visible;">
            <div style="padding: 0 16px 16px 16px; display:flex; flex-direction:column; gap:16px;">
              <!-- Contacts Accordion -->
              <div style="border:1px solid var(--border-color); border-radius:4px; overflow:hidden;">
                <div style="padding:12px 16px; display:flex; justify-content:space-between; align-items:center; background:white; cursor:pointer;" onclick="const c = document.getElementById('assoc-contacts-body'); const i = document.getElementById('assoc-contacts-icon'); if(c.style.display==='none'){c.style.display='block'; i.style.transform='rotate(0deg)';}else{c.style.display='none'; i.style.transform='rotate(-90deg)';}">
                  <div style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:600; color:var(--text-main);">
                    <i data-lucide="chevron-down" id="assoc-contacts-icon" style="width:16px; color:var(--text-muted); transition:transform 0.2s;"></i>
                    Associated contacts (${assocContacts.length})
                  </div>
                  ${!isReadOnly ? `<a href="#" style="color:var(--primary); font-size:12px; font-weight:500; text-decoration:none;" onclick="event.stopPropagation(); Companies.openAddContactModal('${companyId}')">+ Add</a>` : ''}
                </div>
                <div id="assoc-contacts-body" style="padding:16px; border-top:1px solid var(--border-color);">
                  ${assocContacts.length > 0 ? assocContacts.map(c => `
                    <div style="padding:8px 12px; background:#F4F7FB; border-radius:4px; font-size:12px; color:var(--primary); display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                      <span>${c.id} - ${c.firstName} ${c.lastName}</span>
                      ${!isReadOnly ? `<i data-lucide="x" style="width:14px; cursor:pointer; color:var(--text-muted);"></i>` : ''}
                    </div>
                  `).join('') : `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; text-align:center; color:var(--text-muted);">
                      <i data-lucide="users" style="width:24px; height:24px; margin-bottom:8px;"></i>
                      <div style="font-size:12px;">See the people associated with this company.</div>
                    </div>
                  `}
                </div>
              </div>
              
              <!-- Deals Accordion -->
              <div style="border:1px solid var(--border-color); border-radius:4px; overflow:hidden;">
                <div style="padding:12px 16px; display:flex; justify-content:space-between; align-items:center; background:white; cursor:pointer;" onclick="const c = document.getElementById('assoc-deals-body'); const i = document.getElementById('assoc-deals-icon'); if(c.style.display==='none'){c.style.display='block'; i.style.transform='rotate(0deg)';}else{c.style.display='none'; i.style.transform='rotate(-90deg)';}">
                  <div style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:600; color:var(--text-main);">
                    <i data-lucide="chevron-down" id="assoc-deals-icon" style="width:16px; color:var(--text-muted); transition:transform 0.2s;"></i>
                    Associated deals (${assocDeals.length})
                  </div>
                  ${!isReadOnly ? `<a href="#" style="color:var(--primary); font-size:12px; font-weight:500; text-decoration:none;" onclick="event.stopPropagation(); Companies.openAddDealModal('${companyId}')">+ Add</a>` : ''}
                </div>
                <div id="assoc-deals-body" style="padding:16px; border-top:1px solid var(--border-color);">
                  ${assocDeals.length > 0 ? assocDeals.map(d => `
                    <div style="padding:8px 12px; background:#F4F7FB; border-radius:4px; font-size:12px; color:var(--primary); display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                      <span>${d.id} - ${d.name}</span>
                      ${!isReadOnly ? `<i data-lucide="x" style="width:14px; cursor:pointer; color:var(--text-muted);"></i>` : ''}
                    </div>
                  `).join('') : `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; text-align:center; color:var(--text-muted);">
                      <i data-lucide="trending-up" style="width:24px; height:24px; margin-bottom:8px;"></i>
                      <div style="font-size:12px;">Track the revenue opportunities associated with this company.</div>
                    </div>
                  `}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sticky Footer -->
      <div id="company-detail-footer" style="position:fixed; bottom:0; right:0; width:calc(100vw - 240px); background:white; border-top:1px solid var(--border-color); padding:16px 24px; display:flex; justify-content:flex-end; gap:12px; z-index:100; box-shadow:0 -4px 6px -1px rgba(0,0,0,0.05); ${isEditing ? 'display:flex;' : 'display:none;'}">
        <button class="btn btn-secondary" onclick="Companies.confirmDiscard('${companyId}')">Cancel</button>
        <button class="btn btn-primary" onclick="Companies.saveDetailChanges('${companyId}')">Save Changes</button>
      </div>
    `;
    lucide.createIcons({ root: container });
  }
};
