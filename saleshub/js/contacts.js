const Contacts = {
  render: (container) => {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title">
          <h1>Contacts</h1>
          <span class="record-count">${DB.contacts.length} records</span>
        </div>
        <div class="page-actions" style="display:flex; gap: 8px;">
          <span id="contact-selected-count" style="display:none; align-items:center; font-size:13px; font-weight:500; color:var(--text-main); margin-right:8px;">0 selected</span>
          <button id="contact-export-btn" class="btn-icon-outline" style="opacity:0.5; cursor:not-allowed;" title="Export"><i data-lucide="download" style="width:16px;"></i></button>
          <button id="contact-bulk-delete" class="btn-icon-outline" style="opacity:0.5; cursor:not-allowed;" title="Delete Selected" onclick="if(!this.hasAttribute('disabled')) Contacts.bulkDeletePrompt()">
            <i data-lucide="trash-2" style="width:16px;"></i>
          </button>
          <button class="btn-icon-outline" title="Import" onclick="Contacts.openImportModal()"><i data-lucide="upload" style="width:16px;"></i></button>
          <button class="btn btn-primary" onclick="Contacts.openCreateModal()"><i data-lucide="plus"></i> Add contact</button>
        </div>
      </div>
      
      <div class="toolbar" style="box-shadow: none; padding: 0; background: transparent; border: none; justify-content: flex-start; gap: 24px;">
        <div class="search-bar" style="flex: 1; max-width: 400px; height: 36px; background: white; flex-direction: row-reverse;">
          <i data-lucide="search" style="width:16px; color:var(--text-muted); cursor:pointer;"></i>
          <input type="text" placeholder="Search by name, email, phone, contact ID, owner" style="flex:1;">
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:13px; color:var(--text-muted);">Contact owner</span>
          <select style="border: 1px solid var(--border-color); border-radius:4px; padding:6px 12px; font-size:13px; outline:none; background:white; color:var(--text-main);">
            <option>All owners</option>
          </select>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:13px; color:var(--text-muted);">Create date</span>
          <select style="border: 1px solid var(--border-color); border-radius:4px; padding:6px 12px; font-size:13px; outline:none; background:white; color:var(--text-main);">
            <option>All dates</option>
          </select>
        </div>
      </div>

      <div class="table-container" style="background: white; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden;">
        <table class="table">
          <thead>
            <tr>
              <th class="table-checkbox"><input type="checkbox" onchange="Contacts.toggleAllCheckboxes(this)"></th>
              <th>Contact ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone number</th>
              <th>Contact owner</th>
              <th>Create date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${DB.contacts.map(c => `
              <tr>
                <td class="table-checkbox"><input type="checkbox" class="contact-checkbox" value="${c.id}" onchange="Contacts.updateBulkActions()"></td>
                <td><a href="#" style="color: var(--primary); font-weight: 500;" onclick="app.navigate('contactDetail', '${c.id}')">${c.id}</a></td>
                <td><a href="#" style="font-weight: 500; color: var(--text-main); text-decoration: none;" onclick="app.navigate('contactDetail', '${c.id}')">${c.firstName} ${c.lastName}</a></td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>${c.owner}</td>
                <td>${c.createdAt}</td>
                <td style="position: relative;">
                  <button class="btn-icon" onclick="Contacts.toggleActionMenu('${c.id}')"><i data-lucide="more-horizontal"></i></button>
                  <div id="contact-action-${c.id}" style="display:none; position:absolute; top:100%; right:0; background:white; border:1px solid var(--border-color); border-radius:4px; box-shadow:var(--shadow-md); z-index:100; min-width: 120px; text-align:left;">
                    <div style="padding:8px 12px; cursor:pointer; font-size:13px;" onclick="app.navigate('contactDetail', '${c.id}')">Details</div>
                    <div style="padding:8px 12px; cursor:pointer; font-size:13px;" onclick="UI.toast('Edit Contact clicked')">Edit</div>
                    <div style="padding:8px 12px; cursor:pointer; font-size:13px; color:var(--error);" onclick="UI.toast('Delete Contact clicked')">Delete</div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div style="display:flex; justify-content:center; align-items:center; padding:16px; border-top:1px solid var(--border-color); position:relative;">
          <div style="display:flex; gap:8px; align-items:center;">
            <i data-lucide="chevron-left" style="width:16px; color:var(--text-muted); opacity:0.5;"></i>
            <div style="width:24px; height:24px; border-radius:4px; background:#E8F0FE; color:#1967D2; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600;">1</div>
            <i data-lucide="chevron-right" style="width:16px; color:var(--text-muted); opacity:0.5;"></i>
          </div>
          <div style="position:absolute; right:16px; display:flex; align-items:center; gap:16px; font-size:12px; color:var(--text-main);">
            <div style="display:flex; align-items:center; gap:4px; cursor:pointer;">25 per page <i data-lucide="chevron-down" style="width:12px;"></i></div>
            <div>1-${DB.contacts.length} of ${DB.contacts.length}</div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons({ root: container });
  },

  toggleAllCheckboxes: (source) => {
    const checkboxes = document.querySelectorAll('.contact-checkbox');
    checkboxes.forEach(cb => cb.checked = source.checked);
    Contacts.updateBulkActions();
  },

  updateBulkActions: () => {
    const allCheckboxes = document.querySelectorAll('.contact-checkbox');
    let selectedCount = 0;
    
    allCheckboxes.forEach(cb => {
      const tr = cb.closest('tr');
      if (cb.checked) {
        selectedCount++;
        tr.classList.add('selected');
      } else {
        tr.classList.remove('selected');
      }
    });

    const deleteBtn = document.getElementById('contact-bulk-delete');
    const exportBtn = document.getElementById('contact-export-btn');
    const selectedText = document.getElementById('contact-selected-count');
    
    if (selectedCount > 0) {
      selectedText.style.display = 'inline-flex';
      selectedText.textContent = `${selectedCount} selected`;
      
      deleteBtn.style.opacity = '1';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.style.color = 'var(--error)';
      deleteBtn.style.borderColor = 'var(--error)';
      deleteBtn.removeAttribute('disabled');
      
      exportBtn.style.opacity = '1';
      exportBtn.style.cursor = 'pointer';
      exportBtn.removeAttribute('disabled');
    } else {
      selectedText.style.display = 'none';
      
      deleteBtn.style.opacity = '0.5';
      deleteBtn.style.cursor = 'not-allowed';
      deleteBtn.style.color = 'var(--text-secondary)';
      deleteBtn.style.borderColor = 'var(--border-color)';
      deleteBtn.setAttribute('disabled', 'true');
      
      exportBtn.style.opacity = '0.5';
      exportBtn.style.cursor = 'not-allowed';
      exportBtn.setAttribute('disabled', 'true');
    }
  },

  bulkDeletePrompt: () => {
    const checkboxes = document.querySelectorAll('.contact-checkbox:checked');
    const ids = Array.from(checkboxes).map(cb => cb.value);
    
    let totalAssocDeals = 0;
    let totalAssocCompanies = 0;
    let firstContactName = '';

    ids.forEach((id, index) => {
      const contact = DB.contacts.find(c => c.id === id);
      if (contact) {
        if (index === 0) firstContactName = `${contact.firstName} ${contact.lastName}`;
        if (contact.deal) totalAssocDeals++;
        if (contact.company) totalAssocCompanies++;
      }
    });

    const titleStr = ids.length === 1 ? 'Archive contact' : `Archive ${ids.length} contacts?`;
    const nameStr = ids.length === 1 ? firstContactName : `${ids.length} contacts`;

    const body = `
      ${ids.length > 1 ? `
      <div style="font-size:13px; margin-bottom:16px;">
        1 contact will be skipped — you do not have permission to archive it.
      </div>
      ` : `
      <div style="font-size:14px; margin-bottom:16px;">
        Archive <strong>${nameStr}</strong>? This contact will be hidden from the list.
      </div>
      `}
      ${(totalAssocDeals > 0 || totalAssocCompanies > 0) ? `
      <div style="font-size:14px; margin-bottom:16px;">
        This contact is associated with <strong>${totalAssocCompanies} company</strong> and <strong>${totalAssocDeals} deals</strong>. Associations will be kept.
      </div>` : ''}
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" style="background:var(--error); border-color:var(--error);" onclick="Contacts.executeBulkDelete('${ids.join(',')}')">Archive contact</button>
    `;
    UI.openModal(titleStr, body, footer);
    lucide.createIcons();
  },

  executeBulkDelete: (idsString) => {
    const idsToDelete = idsString.split(',');
    // Soft delete by filtering them out for now
    DB.contacts = DB.contacts.filter(c => !idsToDelete.includes(c.id));
    UI.closeModal();
    UI.toast(`${idsToDelete.length} contact(s) archived successfully.`);
    app.navigate('contacts');
  },

  toggleActionMenu: (id) => {
    const menu = document.getElementById(`contact-action-${id}`);
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  },

  openImportModal: () => {
    Contacts.renderImportStep('upload');
  },

  renderImportStep: (step) => {
    let body = '';
    let footer = '';

    const wizardHeader = (currentStep) => `
      <div style="font-size:13px; color:var(--text-secondary); margin-bottom: 24px;">Upload a CSV file to bulk import contacts.</div>
      <div style="display:flex; justify-content:space-between; margin-bottom:32px; font-size:13px; font-weight:500; padding: 0 16px;">
        <div style="display:flex; align-items:center; gap:8px; color:${currentStep >= 1 ? '#D97706' : 'var(--text-muted)'};">
          <div style="width:24px; height:24px; border-radius:50%; background:${currentStep >= 1 ? (currentStep > 1 ? '#DEF7EC' : '#FEF3C7') : '#F3F4F6'}; color:${currentStep > 1 ? '#03543F' : (currentStep === 1 ? '#D97706' : 'inherit')}; display:flex; align-items:center; justify-content:center;">
            ${currentStep > 1 ? '<i data-lucide="check" style="width:14px;"></i>' : '1'}
          </div>
          Upload
        </div>
        <div style="display:flex; align-items:center; gap:8px; color:${currentStep >= 2 ? '#D97706' : 'var(--text-muted)'};">
          <div style="width:24px; height:24px; border-radius:50%; background:${currentStep >= 2 ? '#FEF3C7' : '#F3F4F6'}; display:flex; align-items:center; justify-content:center;">2</div>
          Field mapping
        </div>
        <div style="display:flex; align-items:center; gap:8px; color:${currentStep >= 3 ? '#D97706' : 'var(--text-muted)'};">
          <div style="width:24px; height:24px; border-radius:50%; background:${currentStep >= 3 ? (currentStep > 3 ? '#DEF7EC' : '#FEF3C7') : '#F3F4F6'}; color:${currentStep > 3 ? '#03543F' : (currentStep === 3 ? '#D97706' : 'inherit')}; display:flex; align-items:center; justify-content:center;">
            ${currentStep > 3 ? '<i data-lucide="check" style="width:14px;"></i>' : '3'}
          </div>
          Preview
        </div>
        <div style="display:flex; align-items:center; gap:8px; color:${currentStep >= 4 ? '#D97706' : 'var(--text-muted)'};">
          <div style="width:24px; height:24px; border-radius:50%; background:${currentStep >= 4 ? '#FEF3C7' : '#F3F4F6'}; color:${currentStep === 4 ? '#D97706' : 'inherit'}; display:flex; align-items:center; justify-content:center;">4</div>
          Result
        </div>
      </div>
    `;

    if (step === 'upload') {
      body = `
        ${wizardHeader(1)}
        <div style="font-size:13px; margin-bottom:12px;">Download the template, fill in your data, then upload the CSV file.</div>
        <div style="border:1px solid var(--border-color); border-radius:8px; padding:16px; display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="width:40px; height:48px; background:#F3F4F6; border-radius:4px; display:flex; align-items:center; justify-content:center;">
              <i data-lucide="file-text" style="color:var(--text-muted);"></i>
            </div>
            <div>
              <div style="font-weight:600; font-size:14px;">Contacts import template</div>
              <div style="font-size:12px; color:var(--text-muted);">Includes required fields and a sample row.</div>
            </div>
          </div>
          <button class="btn btn-secondary"><i data-lucide="download" style="width:16px;"></i> Download template</button>
        </div>
        
        <div id="drag-drop-area" 
             style="border:2px dashed var(--border-color); border-radius:8px; padding:40px 24px; text-align:center; cursor:pointer; transition:all 0.2s; position:relative;"
             onmouseover="this.style.borderColor='#D97706'; this.style.backgroundColor='#FFFBEB';"
             onmouseout="this.style.borderColor='var(--border-color)'; this.style.backgroundColor='transparent';"
             onclick="Contacts.renderImportStep('uploaded')">
          <i data-lucide="upload-cloud" style="width:32px; height:32px; color:var(--text-muted); margin-bottom:12px;"></i>
          <div style="font-weight:600; font-size:14px; margin-bottom:4px;">Drag & drop CSV here or click to browse</div>
          <div style="font-size:12px; color:var(--text-muted);">CSV only - Max 5 MB</div>
          <div style="position:absolute; bottom:0; left:0; right:0; height:4px; background:#E5E7EB; border-radius:0 0 8px 8px; overflow:hidden;">
            <div style="width:0%; height:100%; background:var(--primary);"></div>
          </div>
        </div>
      `;
      footer = `
        <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
        <button class="btn btn-primary" style="opacity:0.5; cursor:not-allowed;" disabled>Next</button>
      `;
    } else if (step === 'uploaded') {
      body = `
        ${wizardHeader(1)}
        <div style="font-size:13px; margin-bottom:12px;">Download the template, fill in your data, then upload the CSV file.</div>
        <div style="border:1px solid var(--border-color); border-radius:8px; padding:16px; display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="width:40px; height:48px; background:#F3F4F6; border-radius:4px; display:flex; align-items:center; justify-content:center;">
              <i data-lucide="file-text" style="color:var(--text-muted);"></i>
            </div>
            <div>
              <div style="font-weight:600; font-size:14px;">Contacts import template</div>
              <div style="font-size:12px; color:var(--text-muted);">Includes required fields and a sample row.</div>
            </div>
          </div>
          <button class="btn btn-secondary"><i data-lucide="download" style="width:16px;"></i> Download template</button>
        </div>
        
        <div style="border:2px dashed #D97706; background:#FFFBEB; border-radius:8px; padding:40px 24px; text-align:center; position:relative; margin-bottom:16px;">
          <i data-lucide="upload-cloud" style="width:32px; height:32px; color:var(--text-muted); margin-bottom:12px;"></i>
          <div style="font-weight:600; font-size:14px; margin-bottom:4px;">Drag & drop CSV here or click to browse</div>
          <div style="font-size:12px; color:var(--text-muted);">CSV only - Max 5 MB</div>
        </div>
        
        <div style="background:#DEF7EC; border:1px solid #31C48D; border-radius:6px; padding:12px 16px; display:flex; align-items:center; gap:8px;">
          <i data-lucide="file-check-2" style="color:#03543F; width:18px;"></i>
          <span style="font-size:13px; color:#03543F; font-weight:500;">cms_notification_MOTION_IMPORT_DATABASE_TASKS_IMPORT.csv — 24 rows</span>
        </div>
      `;
      footer = `
        <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="Contacts.renderImportStep('mapping')">Next</button>
      `;
    } else if (step === 'mapping') {
      body = `
        ${wizardHeader(2)}
        <div style="font-size:13px; margin-bottom:16px;">Map columns from your file to CRM fields. Required fields are marked with <span style="color:var(--error);">*</span>.</div>
        
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-color); text-align:left;">
              <th style="padding:12px 0; font-weight:500; color:var(--text-secondary); width:40%;">CRM field</th>
              <th style="padding:12px 0; font-weight:500; color:var(--text-secondary);">File column</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:12px 0; font-weight:500;">First Name <span style="color:var(--error);">*</span></td>
              <td style="padding:8px 0;">
                <select class="form-control" style="padding:6px 12px; height:auto; background:white;"><option>first_name</option></select>
              </td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:12px 0; font-weight:500;">Last Name <span style="color:var(--error);">*</span></td>
              <td style="padding:8px 0;">
                <select class="form-control" style="padding:6px 12px; height:auto; background:white;"><option>last_name</option></select>
              </td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:12px 0; font-weight:500;">Email</td>
              <td style="padding:8px 0;">
                <select class="form-control" style="padding:6px 12px; height:auto; background:white;"><option>Email</option></select>
              </td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:12px 0; font-weight:500;">Phone</td>
              <td style="padding:8px 0;">
                <select class="form-control" style="padding:6px 12px; height:auto; color:var(--text-muted); background:white;"><option>__ Do not import __</option></select>
              </td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:12px 0; font-weight:500;">Owner <span style="color:var(--error);">*</span></td>
              <td style="padding:8px 0;">
                <select class="form-control" style="padding:6px 12px; height:auto; color:var(--text-muted); background:white;"><option>__ Do not import __</option></select>
              </td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:12px 0; font-weight:500;">Associated Company IDs <span style="color:var(--error);">*</span></td>
              <td style="padding:8px 0;">
                <select class="form-control" style="padding:6px 12px; height:auto; color:var(--text-muted); background:white;"><option>__ Do not import __</option></select>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0; font-weight:500;">Associated Deals IDs <span style="color:var(--error);">*</span></td>
              <td style="padding:8px 0;">
                <select class="form-control" style="padding:6px 12px; height:auto; color:var(--text-muted); background:white;"><option>__ Do not import __</option></select>
              </td>
            </tr>
          </tbody>
        </table>
      `;
      footer = `
        <button class="btn btn-secondary" onclick="Contacts.renderImportStep('uploaded')">Back</button>
        <button class="btn btn-primary" onclick="Contacts.renderImportStep('preview')">Next</button>
      `;
    } else if (step === 'preview') {
      body = `
        ${wizardHeader(3)}
        
        <div style="display:flex; gap:16px; margin-bottom:24px;">
          <div style="flex:1; border:1px solid var(--border-color); border-radius:8px; padding:16px;">
            <div style="font-size:24px; font-weight:600; color:var(--success); margin-bottom:4px;">0</div>
            <div style="font-size:12px; color:var(--text-muted);">Ready to import</div>
          </div>
          <div style="flex:1; border:1px solid var(--border-color); border-radius:8px; padding:16px;">
            <div style="font-size:24px; font-weight:600; color:var(--error); margin-bottom:4px;">24</div>
            <div style="font-size:12px; color:var(--text-muted);">Rows with errors</div>
          </div>
          <div style="flex:1; border:1px solid var(--border-color); border-radius:8px; padding:16px;">
            <div style="font-size:24px; font-weight:600; color:var(--text-main); margin-bottom:4px;">24</div>
            <div style="font-size:12px; color:var(--text-muted);">Total row</div>
          </div>
        </div>
        
        <div style="font-size:13px; margin-bottom:16px; color:var(--text-main);">Rows with errors or duplicates will be skipped. No automatic merge - review suggested actions before confirming.</div>
        
        <div style="border:1px solid var(--border-color); border-radius:8px; overflow:hidden;">
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead style="background:#F9FAFB;">
              <tr style="border-bottom:1px solid var(--border-color); text-align:left;">
                <th style="padding:12px 16px; font-weight:500; color:var(--text-secondary);">Row</th>
                <th style="padding:12px 16px; font-weight:500; color:var(--text-secondary);">First Name</th>
                <th style="padding:12px 16px; font-weight:500; color:var(--text-secondary);">Last Name</th>
                <th style="padding:12px 16px; font-weight:500; color:var(--text-secondary);">Email</th>
                <th style="padding:12px 16px; font-weight:500; color:var(--text-secondary);">Status</th>
                <th style="padding:12px 16px; font-weight:500; color:var(--text-secondary);">Suggested action</th>
              </tr>
            </thead>
            <tbody>
              ${[2, 3, 4, 5, 6].map(row => `
              <tr style="border-bottom:1px solid #F3F4F6; background:#FEF2F2;">
                <td style="padding:12px 16px;">${row}</td>
                <td style="padding:12px 16px;">Đồng bộ</td>
                <td style="padding:12px 16px;">T-SYNCD-BE-01</td>
                <td style="padding:12px 16px;">T-SYNCD-BE-01</td>
                <td style="padding:12px 16px; color:var(--error);">Not a valid<br>email address</td>
                <td style="padding:12px 16px; color:var(--error);">Fix file & re-<br>upload</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      footer = `
        <button class="btn btn-secondary" onclick="Contacts.renderImportStep('mapping')">Back</button>
        <button class="btn btn-primary" onclick="Contacts.renderImportStep('result')">Next</button>
      `;
    } else if (step === 'result') {
      body = `
        ${wizardHeader(4)}
        
        <div style="display:flex; gap:16px; margin-bottom:24px;">
          <div style="flex:1; border:1px solid var(--border-color); border-radius:8px; padding:16px;">
            <div style="font-size:24px; font-weight:600; color:var(--success); margin-bottom:4px;">0</div>
            <div style="font-size:12px; color:var(--text-muted);">Ready to import</div>
          </div>
          <div style="flex:1; border:1px solid var(--border-color); border-radius:8px; padding:16px;">
            <div style="font-size:24px; font-weight:600; color:var(--error); margin-bottom:4px;">24</div>
            <div style="font-size:12px; color:var(--text-muted);">Rows with errors</div>
          </div>
          <div style="flex:1; border:1px solid var(--border-color); border-radius:8px; padding:16px;">
            <div style="font-size:24px; font-weight:600; color:var(--text-main); margin-bottom:4px;">24</div>
            <div style="font-size:12px; color:var(--text-muted);">Total row</div>
          </div>
        </div>
      `;
      footer = `
        <button class="btn btn-secondary" onclick="Contacts.renderImportStep('preview')">Back</button>
        <button class="btn btn-primary" onclick="UI.toast('Import completed', 'success'); UI.closeModal();">Import Contact</button>
      `;
    }

    UI.openModal('Import Contacts', body, footer);
    setTimeout(() => lucide.createIcons(), 0);
  },

  openCreateModal: () => {
    const body = `
      <div class="form-group" id="group-email">
        <label class="form-label">Email <span class="required">*</span></label>
        <input type="email" id="contact-email" class="form-control" placeholder="example@domain.com">
        <div class="form-error" id="error-email" style="display:none; color:var(--error); font-size:12px; margin-top:4px;">Email is required</div>
      </div>
      <div style="display: flex; gap: 16px;">
        <div class="form-group" id="group-fname" style="flex: 1;">
          <label class="form-label">First name <span class="required">*</span></label>
          <input type="text" id="contact-fname" class="form-control" placeholder="First name">
          <div class="form-error" id="error-fname" style="display:none; color:var(--error); font-size:12px; margin-top:4px;">First name is required</div>
        </div>
        <div class="form-group" id="group-lname" style="flex: 1;">
          <label class="form-label">Last name <span class="required">*</span></label>
          <input type="text" id="contact-lname" class="form-control" placeholder="Last name">
          <div class="form-error" id="error-lname" style="display:none; color:var(--error); font-size:12px; margin-top:4px;">Last name is required</div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Phone number</label>
        <input type="text" id="contact-phone" class="form-control" placeholder="+1...">
      </div>
      <div class="form-group">
        <label class="form-label">Contact owner <span class="required">*</span></label>
        <select id="contact-owner" class="form-control" disabled style="background:#F9FAFB; cursor:not-allowed; color:var(--text-muted);">
          <option selected>Alex Sales</option>
        </select>
        <div style="font-size:12px; color:#007A8C; margin-top:4px;">New contacts are assigned to you. Only admins can choose a different contact owner.</div>
      </div>
      <div class="form-group" style="position:relative;">
        <label class="form-label">Associate company</label>
        <div class="form-control" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="document.getElementById('company-dropdown').style.display = document.getElementById('company-dropdown').style.display === 'none' ? 'block' : 'none';">
          <span>Select company</span>
          <i data-lucide="chevron-down" style="width:16px;"></i>
        </div>
        
        <!-- Custom Dropdown -->
        <div id="company-dropdown" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid var(--primary); border-radius:4px; box-shadow:var(--shadow-lg); z-index:1000; margin-top:4px;">
          <div style="padding:12px; border-bottom:1px solid var(--border-color);">
            <div class="search-bar" style="width:100%; height:32px; border:1px solid var(--primary); box-shadow: 0 0 0 2px rgba(15, 98, 254, 0.15);">
              <i data-lucide="search" style="width:14px; color:var(--text-muted);"></i>
              <input type="text" placeholder="Search by name, domain, owner, industry..." style="font-size:13px;">
            </div>
          </div>
          <div style="max-height:200px; overflow-y:auto; padding:8px 0;">
            <div style="display:flex; gap:12px; padding:8px 16px; background:#F3F8FF; cursor:pointer;">
              <input type="checkbox" checked style="margin-top:4px;">
              <div>
                <div style="font-size:13px; font-weight:500; color:var(--text-main);">Acme Corp</div>
                <div style="font-size:11px; color:var(--text-muted);">www.acmecorp.com - Alex Sales - Technology - San Francisco, United States</div>
              </div>
            </div>
            <div style="display:flex; gap:12px; padding:8px 16px; cursor:pointer; border-top:1px solid #F3F4F6;">
              <input type="checkbox" style="margin-top:4px;">
              <div>
                <div style="font-size:13px; font-weight:500; color:var(--text-main);">TechVN Ltd</div>
                <div style="font-size:11px; color:var(--text-muted);">techvn.vn - Jane Smith - IT Services - Ho Chi Minh City, Vietnam</div>
              </div>
            </div>
            <div style="display:flex; gap:12px; padding:8px 16px; cursor:pointer; border-top:1px solid #F3F4F6;">
              <input type="checkbox" style="margin-top:4px;">
              <div>
                <div style="font-size:13px; font-weight:500; color:var(--text-main);">TechVN Ltd</div>
                <div style="font-size:11px; color:var(--text-muted);">techvn.vn - Jane Smith - IT Services - Ho Chi Minh City, Vietnam</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Associate deal</label>
        <select id="contact-deal" class="form-control" onchange="if(this.value){ document.getElementById('deal-warning').style.display='block'; } else { document.getElementById('deal-warning').style.display='none'; }">
          <option value="">Select deal</option>
          <option value="Deal 1">Deal 1 (Demo warning)</option>
        </select>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Associate a company to filter deals. Selected deal should belong to an associated company.</div>
        <div id="deal-warning" style="display:none; font-size:12px; color:var(--error); margin-top:4px;">Deal does not belong to any associated company. Remove it or add the matching company.</div>
      </div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Contacts.saveContact()" style="background:#82C4FF; color:white; border:none; padding:8px 16px;">Create</button>
    `;
    UI.openModal('Create Contact', body, footer);
  },

  saveContact: () => {
    const emailEl = document.getElementById('contact-email');
    const fnameEl = document.getElementById('contact-fname');
    const lnameEl = document.getElementById('contact-lname');
    
    const email = emailEl.value;
    const fname = fnameEl.value;
    const lname = lnameEl.value;
    
    let hasError = false;

    // Reset errors
    ['email', 'fname', 'lname'].forEach(id => {
      document.getElementById(`contact-${id}`).style.borderColor = 'var(--border-color)';
      document.getElementById(`error-${id}`).style.display = 'none';
    });
    
    if (!email) {
      emailEl.style.borderColor = 'var(--error)';
      document.getElementById('error-email').textContent = 'Email is required';
      document.getElementById('error-email').style.display = 'block';
      hasError = true;
    } else {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(email)) {
        emailEl.style.borderColor = 'var(--error)';
        document.getElementById('error-email').textContent = 'Not a valid email address';
        document.getElementById('error-email').style.display = 'block';
        hasError = true;
      } else if (DB.contacts.some(c => c.email === email)) {
        emailEl.style.borderColor = 'var(--error)';
        document.getElementById('error-email').textContent = 'This email address already belongs to a contact';
        document.getElementById('error-email').style.display = 'block';
        hasError = true;
      }
    }
    
    if (!fname) {
      fnameEl.style.borderColor = 'var(--error)';
      document.getElementById('error-fname').style.display = 'block';
      hasError = true;
    }
    
    if (!lname) {
      lnameEl.style.borderColor = 'var(--error)';
      document.getElementById('error-lname').style.display = 'block';
      hasError = true;
    }

    if (hasError) return;

    DB.contacts.unshift({
      id: generateId('CON'),
      firstName: fname,
      lastName: lname,
      email: email,
      phone: document.getElementById('contact-phone').value,
      owner: document.getElementById('contact-owner').value.split(' ')[0] + ' Sales',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });

    UI.closeModal();
    UI.toast('Contact created successfully');
    app.navigate('contacts');
  },

  renderDetail: (container, contactId, isEditing = false) => {
    const contact = DB.contacts.find(c => c.id === contactId) || DB.contacts[0];
    
    // Find associated deals/company
    const compName = contact.company ? (DB.companies.find(c => c.id === contact.company)?.name || 'Acme Corp') : '';
    const dealName = contact.deal ? (DB.deals.find(d => d.id === contact.deal)?.name || 'D-226-0000004 - SCH - RE - City Developments — City Developments Limited : Proposal Presented (70%) : Alex Sales : 2026-07-15') : '';
    
    const isOwner = contact.owner && contact.owner.includes('Hara');
    const isReadOnly = !isOwner;
    
    container.innerHTML = `
      <div style="padding: 24px; max-width: 1200px; margin: 0 auto; color: var(--text-main);">
        <div style="margin-bottom: 24px;">
          <a href="#" class="back-link" onclick="app.navigate('contacts')" style="color:var(--primary); text-decoration:none; display:flex; align-items:center; gap:4px; font-size:13px; font-weight:500;">
            <i data-lucide="arrow-left" style="width:14px;"></i> Back to Contacts
          </a>
        </div>
        
        <div style="display: flex; gap: 16px; margin-bottom: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: #E8F0FE; color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 600;">
            ${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:4px;">
              <h1 style="font-size:24px; font-weight:600; margin:0;">${contact.firstName} ${contact.lastName}</h1>
              <div style="display:flex; align-items:center; gap:12px;">
                ${isReadOnly ? `<span class="badge badge-gray"><i data-lucide="lock" style="width:12px; margin-right:4px;"></i> View-only</span>` : ''}
                ${!isEditing ? `
                <button class="btn btn-outline" ${isReadOnly ? 'disabled style="opacity:0.5; cursor:not-allowed;" title="You do not have permission to edit this record."' : ''} onclick="${isReadOnly ? '' : `Contacts.renderDetail(document.getElementById('app-content'), '${contactId}', true)`}">Edit Contact</button>
                ` : ''}
              </div>
            </div>
            <div style="font-size:13px; color:var(--text-muted);">${contact.id}</div>
          </div>
        </div>
        
        <div style="background:#F9FAFB; padding:12px 16px; border-radius:6px; font-size:13px; color:var(--text-main); margin-bottom:8px;">
          ${isReadOnly ? 'View-only — previewing as another user without edit permission.' : 'You can edit this contact (Admin).'}
        </div>
        ${isReadOnly ? `<a href="#" style="color:var(--primary); font-size:13px; text-decoration:none; margin-bottom:24px; display:block;">Request access</a>` : `<div style="margin-bottom:24px;"></div>`}
        
        <div style="display:flex; gap:24px; align-items: flex-start; padding-bottom: ${isEditing ? '80px' : '0'};">
          <!-- Left Sidebar -->
          <div style="width: 300px; flex-shrink: 0;">
            <h3 style="font-size:16px; font-weight:600; margin-bottom:16px;">Overview</h3>
            <div style="display:flex; flex-direction:column; gap:16px; font-size:13px; margin-bottom:32px;">
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Contact ID</div>
                <div>${contact.id}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">First name</div>
                <div>${contact.firstName}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Last name</div>
                <div>${contact.lastName}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Email</div>
                <div><a href="mailto:${contact.email}" style="color:var(--primary); text-decoration:none;">${contact.email} <i data-lucide="external-link" style="width:12px; vertical-align:middle;"></i></a></div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Phone number</div>
                <div>${contact.phone || '--'}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Contact owner</div>
                <div>${contact.owner}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Created by</div>
                <div>${contact.owner}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Date created</div>
                <div>15/01/2023 09:14</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Last activity date</div>
                <div>01/1/2025 at 4:31 PM</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Associated companies</div>
                <div>${compName ? `<a href="#" style="color:var(--primary); text-decoration:none;">${compName} (${compName.replace(/ /g,'').toLowerCase()}.com)</a>` : '<span style="color:var(--text-muted);">--</span>'}</div>
              </div>
              <div>
                <div style="color:var(--text-muted); margin-bottom:4px;">Associated deals</div>
                <div>${dealName ? `<a href="#" style="color:var(--primary); text-decoration:none;">${dealName}</a>` : '<span style="color:var(--text-muted);">--</span>'}</div>
              </div>
            </div>
            
            <div style="display:flex; gap:12px;">
              <div style="flex:1; border:1px solid var(--border-color); border-radius:8px; padding:16px; text-align:center; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
                <i data-lucide="building-2" style="color:var(--text-main); margin-bottom:8px;"></i>
                <div style="font-size:14px; font-weight:600;">${compName ? '1' : '0'}</div>
                <div style="font-size:12px; color:var(--text-muted);">Companies</div>
              </div>
              <div style="flex:1; border:1px solid var(--border-color); border-radius:8px; padding:16px; text-align:center; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
                <i data-lucide="briefcase" style="color:var(--text-main); margin-bottom:8px;"></i>
                <div style="font-size:14px; font-weight:600;">${dealName ? '1' : '0'}</div>
                <div style="font-size:12px; color:var(--text-muted);">Deals</div>
              </div>
            </div>
          </div>
          
          <!-- Right Content -->
          <div style="flex: 1; display:flex; flex-direction:column; gap:24px;">
            <div style="background:white; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); padding:24px;">
              <h3 style="font-size:16px; font-weight:600; margin-bottom:16px; margin-top:0;">About this contact</h3>
              
              ${isEditing ? `
              <div style="display:flex; gap:16px; margin-bottom:16px;">
                <div style="flex:1;">
                  <div id="edit-fname-container" style="border:1px solid var(--border-color); border-radius:4px; padding:4px 12px; transition: border-color 0.2s;">
                    <label style="font-size:11px; color:var(--text-muted); margin-bottom:2px; display:block;">First name <span style="color:var(--error)">*</span></label>
                    <input id="edit-fname" type="text" value="${contact.firstName}" style="border:none; outline:none; width:100%; font-size:13px; font-family:inherit; color:var(--text-main);">
                  </div>
                  <div id="edit-fname-error" style="display:none; color:var(--error); font-size:11px; margin-top:4px;">First name is required.</div>
                </div>
                <div style="flex:1;">
                  <div style="border:1px solid var(--border-color); border-radius:4px; padding:4px 12px;">
                    <label style="font-size:11px; color:var(--text-muted); margin-bottom:2px; display:block;">Last name <span style="color:var(--error)">*</span></label>
                    <input type="text" value="${contact.lastName}" style="border:none; outline:none; width:100%; font-size:13px; font-family:inherit; color:var(--text-main);">
                  </div>
                </div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="border:1px solid var(--border-color); border-radius:4px; padding:4px 12px; position:relative;">
                  <label style="font-size:11px; color:var(--text-muted); margin-bottom:2px; display:block;">Contact owner <span style="color:var(--error)">*</span></label>
                  <select style="border:none; outline:none; width:100%; font-size:13px; font-family:inherit; color:var(--text-main); appearance:none; background:transparent; cursor:pointer;">
                    <option>${contact.owner}</option>
                  </select>
                  <i data-lucide="chevron-down" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); width:14px; pointer-events:none; color:var(--text-muted);"></i>
                </div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="border:1px solid var(--border-color); border-radius:4px; padding:4px 12px;">
                  <label style="font-size:11px; color:var(--text-muted); margin-bottom:2px; display:block;">Email address</label>
                  <input type="text" value="${contact.email}" style="border:none; outline:none; width:100%; font-size:13px; font-family:inherit; color:var(--text-main);">
                </div>
                <div style="margin-top:8px;"><a href="#" style="color:var(--primary); font-size:12px; text-decoration:none; font-weight:500;">+ Add</a></div>
              </div>
              <div>
                <div style="border:1px solid var(--border-color); border-radius:4px; padding:4px 12px;">
                  <label style="font-size:11px; color:var(--text-muted); margin-bottom:2px; display:block;">Phone number</label>
                  <input type="text" value="${contact.phone || ''}" style="border:none; outline:none; width:100%; font-size:13px; font-family:inherit; color:var(--text-main);">
                </div>
                <div style="margin-top:8px;"><a href="#" style="color:var(--primary); font-size:12px; text-decoration:none; font-weight:500;">+ Add</a></div>
              </div>
              ` : `
              <div style="display:flex; gap:48px; font-size:13px;">
                <div style="flex:1; display:flex; flex-direction:column; gap:16px;">
                  <div>
                    <div style="color:var(--text-muted); margin-bottom:4px;">First name</div>
                    <div>${contact.firstName}</div>
                  </div>
                  <div>
                    <div style="color:var(--text-muted); margin-bottom:4px;">Contact owner</div>
                    <div>${contact.owner}</div>
                  </div>
                  <div>
                    <div style="color:var(--text-muted); margin-bottom:4px;">Phone number</div>
                    <div>${contact.phone || '--'}</div>
                  </div>
                </div>
                <div style="flex:1; display:flex; flex-direction:column; gap:16px;">
                  <div>
                    <div style="color:var(--text-muted); margin-bottom:4px;">Last name</div>
                    <div>${contact.lastName}</div>
                  </div>
                  <div>
                    <div style="color:var(--text-muted); margin-bottom:4px;">Email address</div>
                    <div><a href="mailto:${contact.email}" style="color:var(--primary); text-decoration:none;">${contact.email} <i data-lucide="external-link" style="width:12px; vertical-align:middle;"></i></a></div>
                  </div>
                </div>
              </div>
              `}
            </div>
            
            <div style="background:white; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); padding:24px;">
              <h3 style="font-size:16px; font-weight:600; margin-bottom:16px; margin-top:0;">Activity</h3>
              <div style="font-size:13px; color:var(--text-muted);">No activity yet</div>
            </div>
            
            <div style="background:white; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); padding:24px;">
              <h3 style="font-size:16px; font-weight:600; margin-bottom:16px; margin-top:0;">Associations</h3>
              
              <div style="border:1px solid var(--border-color); border-radius:8px; overflow:hidden; margin-bottom:16px;">
                <div style="padding:12px 16px; background:#F9FAFB; border-bottom:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:600;">
                  <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; const i = this.querySelector('i'); if(this.nextElementSibling.style.display === 'none') { i.setAttribute('data-lucide', 'chevron-right'); } else { i.setAttribute('data-lucide', 'chevron-down'); } lucide.createIcons({root: this});">
                    <i data-lucide="chevron-down" style="width:16px;"></i> Companies (${compName ? '1' : '0'})
                  </div>
                  ${isEditing ? `<a href="#" style="color:var(--primary); font-size:12px; font-weight:500; text-decoration:none;" onclick="Contacts.openAddCompanyModal()">+ Add</a>` : ''}
                </div>
                <div style="padding:16px;">
                  ${compName ? `
                  <div style="border:1px solid var(--border-color); border-radius:4px; padding:12px 16px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                    <a href="#" style="color:var(--primary); text-decoration:none;">${compName} (${compName.replace(/ /g,'').toLowerCase()}.com)</a>
                    ${isEditing ? `<i data-lucide="x" style="width:14px; color:var(--text-muted); cursor:pointer;"></i>` : ''}
                  </div>
                  ` : `
                  <div style="text-align:center; padding:16px 0;">
                    <i data-lucide="building-2" style="width:24px; height:24px; color:var(--text-muted); opacity:0.5; margin-bottom:8px;"></i>
                    <div style="font-size:12px; color:var(--text-muted); max-width:200px; margin:0 auto;">See the businesses or organizations associated with this record.</div>
                  </div>
                  `}
                </div>
              </div>
              
              <div style="border:1px solid var(--border-color); border-radius:8px; overflow:hidden; margin-bottom:16px;">
                <div style="padding:12px 16px; background:#F9FAFB; border-bottom:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:600;">
                  <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; const i = this.querySelector('i'); if(this.nextElementSibling.style.display === 'none') { i.setAttribute('data-lucide', 'chevron-right'); } else { i.setAttribute('data-lucide', 'chevron-down'); } lucide.createIcons({root: this});">
                    <i data-lucide="chevron-down" style="width:16px;"></i> Deals (${dealName ? '1' : '0'})
                  </div>
                  ${isEditing ? `<a href="#" style="color:var(--primary); font-size:12px; font-weight:500; text-decoration:none;" onclick="Contacts.openAddDealModal()">+ Add</a>` : ''}
                </div>
                <div style="padding:16px;">
                  ${dealName ? `
                  <div style="border:1px solid var(--border-color); border-radius:4px; padding:12px 16px; font-size:13px; line-height:1.5; display:flex; justify-content:space-between; align-items:center;">
                    <a href="#" style="color:var(--primary); text-decoration:none;">${dealName}</a>
                    ${isEditing ? `<i data-lucide="x" style="width:14px; color:var(--text-muted); cursor:pointer;"></i>` : ''}
                  </div>
                  ` : `
                  <div style="text-align:center; padding:16px 0;">
                    <i data-lucide="trending-up" style="width:24px; height:24px; color:var(--text-muted); opacity:0.5; margin-bottom:8px;"></i>
                    <div style="font-size:12px; color:var(--text-muted); max-width:200px; margin:0 auto;">Track the revenue opportunities associated with this record.</div>
                  </div>
                  `}
                </div>
              </div>
              
              <div style="font-size:11px; color:var(--text-muted);">${!dealName ? 'Associate a company before linking deals. ' : ''}Deals are filtered by selected company. Selected deal must belong to an associated company.</div>
            </div>
          </div>
        </div>
      </div>
      
      ${isEditing ? `
      <div style="position:fixed; bottom:0; left:240px; right:0; background:white; border-top:1px solid var(--border-color); padding:16px 24px; display:flex; justify-content:flex-end; gap:12px; box-shadow:0 -2px 10px rgba(0,0,0,0.05); z-index:100;">
        <button class="btn btn-secondary" onclick="Contacts.confirmDiscardModal('${contactId}')">Cancel</button>
        <button class="btn btn-primary" onclick="Contacts.saveDetailChanges('${contactId}')">Save Changes</button>
      </div>
      ` : ''}
    `;
    lucide.createIcons({ root: container });
  },

  saveDetailChanges: (contactId) => {
    const fnameInput = document.getElementById('edit-fname');
    const fnameContainer = document.getElementById('edit-fname-container');
    const fnameError = document.getElementById('edit-fname-error');
    
    if (!fnameInput.value.trim()) {
      fnameContainer.style.borderColor = 'var(--error)';
      fnameError.style.display = 'block';
      return;
    }
    
    Contacts.confirmSaveModal(contactId, fnameInput.value);
  },

  confirmSaveModal: (contactId, newFirstName) => {
    const body = `
      <div style="font-size:13px; color:var(--text-main); margin-bottom:24px;">Are you sure you want to save your changes?</div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">No, continue editing</button>
      <button class="btn btn-primary" onclick="UI.closeModal(); Contacts.executeSave('${contactId}', '${newFirstName.replace(/'/g, "\\'")}')">Save changes</button>
    `;
    UI.openModal('Save changes?', body, footer);
  },

  executeSave: (contactId, newFirstName) => {
    const contact = DB.contacts.find(c => c.id === contactId);
    if (contact) {
      contact.firstName = newFirstName;
    }
    UI.toast('Changes saved successfully', 'success');
    Contacts.renderDetail(document.getElementById('app-content'), contactId, false);
  },

  confirmDiscardModal: (contactId) => {
    const body = `
      <div style="font-size:13px; color:var(--text-main); margin-bottom:24px;">You have unsaved changes. Are you sure you want to discard them?</div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Continue editing</button>
      <button class="btn btn-primary" style="background:var(--error); border-color:var(--error); color:white;" onclick="UI.closeModal(); Contacts.renderDetail(document.getElementById('app-content'), '${contactId}', false)">Discard changes</button>
    `;
    UI.openModal('Discard changes?', body, footer);
  },

  openAddCompanyModal: () => {
    const body = `
      <div style="display:flex; gap:16px; border-bottom:1px solid var(--border-color); margin-bottom:16px; padding-bottom:8px;">
        <div style="font-size:13px; color:var(--text-muted); cursor:pointer;">Create new</div>
        <div style="font-size:13px; color:var(--primary); font-weight:500; border-bottom:2px solid var(--primary); padding-bottom:8px; margin-bottom:-9px; cursor:pointer;">Add existing</div>
      </div>
      <div style="display:flex; gap:12px; margin-bottom:16px;">
        <div style="flex:1; position:relative;">
          <i data-lucide="search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); width:14px; color:var(--primary);"></i>
          <input type="text" placeholder="Search companies" style="width:100%; border:1px solid var(--primary); border-radius:4px; padding:8px 12px 8px 32px; font-size:13px; outline:none; color:var(--primary);">
        </div>
        <select style="border:1px solid var(--border-color); border-radius:4px; padding:8px 32px 8px 12px; font-size:13px; outline:none; appearance:none; background:white url('data:image/svg+xml;utf8,<svg fill=%22none%22 height=%2214%22 stroke=%22currentColor%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 viewBox=%220 0 24 24%22 width=%2214%22 xmlns=%22http://www.w3.org/2000/svg%22><polyline points=%226 9 12 15 18 9%22/></svg>') no-repeat right 12px center;">
          <option>Default (Recently added)</option>
        </select>
      </div>
      <div style="font-size:13px; font-weight:600; margin-bottom:12px;">5 Companies</div>
      <div style="border:1px solid var(--border-color); border-radius:4px; max-height:200px; overflow-y:auto; padding:8px 0;">
        <div style="padding:8px 16px; display:flex; align-items:center; gap:12px; cursor:pointer;"><input type="checkbox"> <span style="font-size:13px;">Global Fin (globalfin.com)</span></div>
        <div style="padding:8px 16px; display:flex; align-items:center; gap:12px; cursor:pointer;"><input type="checkbox"> <span style="font-size:13px;">City Developments Limited (citydevelopmentslimited.com)</span></div>
        <div style="padding:8px 16px; display:flex; align-items:center; gap:12px; cursor:pointer;"><input type="checkbox"> <span style="font-size:13px;">TechCorp Solutions (techcorpsolutions.com)</span></div>
        <div style="padding:8px 16px; display:flex; align-items:center; gap:12px; cursor:pointer;"><input type="checkbox"> <span style="font-size:13px;">TechVN Ltd (techvn.vn)</span></div>
        <div style="padding:8px 16px; display:flex; align-items:center; gap:12px; cursor:pointer;"><input type="checkbox"> <span style="font-size:13px;">Acme Corp (acmecorp.com)</span></div>
      </div>
      <div style="font-size:12px; color:var(--text-muted); margin-top:12px;">10 items per page</div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="UI.closeModal(); UI.toast('Company added successfully')">Add</button>
    `;
    UI.openModal('Add Company', body, footer);
    lucide.createIcons();
  },

  openAddDealModal: () => {
    const body = `
      <div style="display:flex; gap:16px; border-bottom:1px solid var(--border-color); margin-bottom:16px; padding-bottom:8px;">
        <div style="font-size:13px; color:var(--text-muted); cursor:pointer;">Create new</div>
        <div style="font-size:13px; color:var(--primary); font-weight:500; border-bottom:2px solid var(--primary); padding-bottom:8px; margin-bottom:-9px; cursor:pointer;">Add existing</div>
      </div>
      <div style="display:flex; gap:12px; margin-bottom:16px;">
        <div style="flex:1; position:relative;">
          <i data-lucide="search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); width:14px; color:var(--primary);"></i>
          <input type="text" placeholder="Search deals" style="width:100%; border:1px solid var(--primary); border-radius:4px; padding:8px 12px 8px 32px; font-size:13px; outline:none; color:var(--primary);">
        </div>
        <select style="border:1px solid var(--border-color); border-radius:4px; padding:8px 32px 8px 12px; font-size:13px; outline:none; appearance:none; background:white url('data:image/svg+xml;utf8,<svg fill=%22none%22 height=%2214%22 stroke=%22currentColor%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 viewBox=%220 0 24 24%22 width=%2214%22 xmlns=%22http://www.w3.org/2000/svg%22><polyline points=%226 9 12 15 18 9%22/></svg>') no-repeat right 12px center;">
          <option>Default (Recently added)</option>
        </select>
      </div>
      <div style="font-size:13px; font-weight:600; margin-bottom:12px;">0 Deals</div>
      <div style="border:1px solid var(--border-color); border-radius:4px; height:120px; display:flex; align-items:center; justify-content:center;">
        <div style="font-size:13px; color:var(--text-muted);">No deals match your search.</div>
      </div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="UI.closeModal(); UI.toast('Deal added successfully')">Add</button>
    `;
    UI.openModal('Add Deal', body, footer);
    lucide.createIcons();
  }
};
