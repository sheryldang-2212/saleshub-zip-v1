const Deals = {
  render: (container) => {
    container.innerHTML = `
      <div class="deals-header-top">
        <h1>Deals <i data-lucide="chevron-down"></i></h1>
        <div class="deals-actions">
          <button class="btn-outline">Actions <i data-lucide="chevron-down" style="width:14px; margin-left:4px;"></i></button>
          <button class="btn-outline-orange">Import</button>
          <button class="btn-orange" onclick="Deals.openCreateModal()">Create deal</button>
        </div>
      </div>
      
      <div class="deals-search-views">
        <div style="display: flex; gap: 8px;">
          <div class="view-tab active">
            <span>All deals</span>
            <i data-lucide="x" style="width: 14px; color: var(--text-muted); cursor: pointer;"></i>
          </div>
          <div class="view-tab" style="color: var(--text-secondary); border-color: transparent; border-bottom: 2px solid transparent;">
            <span>My deals</span>
          </div>
        </div>
        <div class="view-links">
          <span><i data-lucide="plus" style="width: 14px; margin-right: 4px;"></i> Add view (2/50)</span>
          <span>All Views</span>
        </div>
      </div>

      <div class="deals-filter-bar">
        <div class="filter-left">
          <div style="display: flex; background: #F3F4F6; padding: 2px; border-radius: 4px; gap: 2px; margin-right: 8px;">
            <div style="padding: 4px 8px; background: white; border-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"><i data-lucide="layout-grid" style="width:14px;"></i></div>
            <div style="padding: 4px 8px; color: var(--text-muted);"><i data-lucide="list" style="width:14px;"></i></div>
          </div>
          
          <div class="filter-dropdown" style="background: #F3F4F6; padding: 4px 8px; border-radius: 4px;">
            Sales Pipeline <i data-lucide="chevron-down" style="width:14px;"></i>
          </div>
          <div class="filter-dropdown">
            Deal owner <i data-lucide="chevron-down" style="width:14px;"></i>
          </div>
          <div class="filter-dropdown">
            Create date <i data-lucide="chevron-down" style="width:14px;"></i>
          </div>
          <div class="filter-dropdown">
            Last activity date <i data-lucide="chevron-down" style="width:14px;"></i>
          </div>
          <div class="filter-dropdown">
            Close date <i data-lucide="chevron-down" style="width:14px;"></i>
          </div>
          
          <i data-lucide="plus-circle" style="width:16px; color: var(--text-muted); cursor:pointer; margin-left:8px;"></i>
          <i data-lucide="pencil" style="width:14px; color: var(--text-muted); cursor:pointer;"></i>
          
          <div class="filter-dropdown" style="margin-left: 16px;">
            <i data-lucide="settings-2" style="width:14px;"></i> Advanced filters
          </div>
        </div>
        
        <div class="filter-right">
          <div style="display: flex; align-items: center; gap: 4px;">
            Hide Metrics <i data-lucide="info" style="width:14px; color: var(--text-muted);"></i>
          </div>
          <div style="display: flex; gap: 8px; margin-left: 16px;">
            <div style="padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; display:flex; align-items:center; cursor:pointer;"><i data-lucide="corner-up-left" style="width:14px; color: var(--text-muted);"></i></div>
            <div style="padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; display:flex; align-items:center; cursor:pointer;"><i data-lucide="copy" style="width:14px; color: var(--text-muted);"></i></div>
            <div style="padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; display:flex; align-items:center; cursor:pointer;"><i data-lucide="save" style="width:14px; color: var(--text-muted);"></i></div>
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">TOTAL DEAL AMOUNT</div>
          <div class="kpi-value">$35.97M</div>
          <div class="kpi-subtitle">Average per deal</div>
          <div class="kpi-subvalue">$64.8K</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">WEIGHTED DEAL AMOUNT</div>
          <div class="kpi-value">$20.11M</div>
          <div class="kpi-subtitle">Average per deal</div>
          <div class="kpi-subvalue">$36.23K</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">OPEN DEAL AMOUNT</div>
          <div class="kpi-value">$4.16M</div>
          <div class="kpi-subtitle">Average per deal</div>
          <div class="kpi-subvalue">$69.26K</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">CLOSED DEAL AMOUNT</div>
          <div class="kpi-value">$18.27M</div>
          <div class="kpi-subtitle">Average per deal</div>
          <div class="kpi-subvalue">$71.09K</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">NEW DEAL AMOUNT</div>
          <div class="kpi-value">$258.19K</div>
          <div class="kpi-subtitle">Average per deal</div>
          <div class="kpi-subvalue">$32.27K</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">AVERAGE DEAL AGE</div>
          <div class="kpi-value">4.5 months</div>
          <div style="height: 32px;"></div> <!-- Spacer -->
        </div>
      </div>
      
      <div class="board-toolbar">
        <div class="search-bar" style="max-width: 300px; height: 36px;">
          <input type="text" placeholder="Search name or descriptic">
          <i data-lucide="search" style="width: 16px;"></i>
        </div>
        <button class="btn-outline">Board options <i data-lucide="chevron-down" style="width:14px; margin-left:4px;"></i></button>
      </div>

      <div class="kanban-board">
        ${Stages.map((stage, idx) => {
          const stageDeals = DB.deals.filter(d => d.stage === stage);
          const totalAmt = stageDeals.reduce((sum, d) => sum + d.amount, 0);
          const percentage = idx === 0 ? 0 : idx * 10 > 100 ? 100 : idx * 10;
          
          return `
            <div class="kanban-column" ondragover="Deals.allowDrop(event, '${stage}')" ondrop="Deals.drop(event, '${stage}')">
              <div class="kanban-column-header">
                <div class="kanban-column-title">
                  <i data-lucide="chevron-left" style="width: 14px; color: var(--text-muted); cursor:pointer;"></i>
                  ${stage} (${percentage}%) 
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="kanban-count">${stageDeals.length}</div>
                  <i data-lucide="chevron-right" style="width: 14px; color: var(--text-muted); cursor:pointer;"></i>
                </div>
              </div>
              
              <div class="kanban-cards" id="stage-${stage.replace(/\s+/g, '-')}">
                ${stageDeals.map(d => `
                  <div class="kanban-card" draggable="true" ondragstart="Deals.drag(event, '${d.id}')" onclick="app.navigate('dealDetail', '${d.id}')">
                    <div class="card-title">${d.name}</div>
                    
                    <div class="card-subtitle">Close date: ${d.closeDate}</div>
                    
                    <div class="card-badges">
                      <span class="badge-tag badge-yellow" title="Action required: Please add more contacts to this deal.">ADD MORE CONTACTS 🤝</span>
                      <span class="badge-tag badge-pink" title="Warning: This deal has fewer than 10 touch points.">&lt;10 Touch Points 📞</span>
                      ${Math.random() > 0.5 ? '<span class="badge-tag badge-pink" title="Critical: Deal is closing soon or overdue.">CLOSING 🚨 OR OVERDUE</span>' : ''}
                    </div>
                    
                    ${d.company ? `<div style="font-size: 11px; color: #007A8C; display:flex; align-items:center; gap:4px; margin-bottom: 8px;"><i data-lucide="building" style="width:12px;"></i> ${d.company}</div>` : ''}
                    
                    <div class="card-footer" style="display:flex; justify-content:space-between; align-items:center;">
                      <div style="font-size:11px; color:var(--text-muted);">Amount: $${d.amount.toLocaleString()}</div>
                      <div class="quick-actions" style="display:flex; gap:4px;">
                        <button class="btn-icon" title="Preview" onclick="event.stopPropagation(); UI.toast('Preview ${d.id}')" style="padding:4px;"><i data-lucide="eye" style="width:14px; height:14px;"></i></button>
                        <button class="btn-icon" title="Create an Email" onclick="event.stopPropagation(); UI.toast('Create Email for ${d.id}')" style="padding:4px;"><i data-lucide="mail" style="width:14px; height:14px;"></i></button>
                        <button class="btn-icon" title="Create Note" onclick="event.stopPropagation(); UI.toast('Create Note for ${d.id}')" style="padding:4px;"><i data-lucide="file-text" style="width:14px; height:14px;"></i></button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <div class="kanban-footer">
                <strong>$${totalAmt.toLocaleString()}</strong> | Total amount<br/>
                ${percentage === 100 ? `Won (100%) <i data-lucide="info" style="width:10px;"></i>` : percentage === 0 && stage !== 'Nurture' ? `Lost (0%) <i data-lucide="info" style="width:10px;"></i>` : `$${(totalAmt * (percentage/100)).toLocaleString()} (${percentage}%) | Weighted amount <i data-lucide="info" style="width:10px;"></i>`}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  allowDrop: (ev, targetStage) => {
    if (['Draft Proposal', 'Proposal Presented'].includes(targetStage)) return;
    ev.preventDefault();
  },

  drag: (ev, dealId) => {
    ev.dataTransfer.setData("dealId", dealId);
  },

  drop: (ev, targetStage) => {
    ev.preventDefault();
    if (['Draft Proposal', 'Proposal Presented'].includes(targetStage)) {
      UI.toast('Cannot move to a stage synced from Bid Status.', 'error');
      return;
    }
    const dealId = ev.dataTransfer.getData("dealId");
    const deal = DB.deals.find(d => d.id === dealId);
    if (deal && deal.stage !== targetStage) {
      deal.stage = targetStage;
      app.navigate('deals'); // Re-render
      UI.toast('Deal stage updated');
    }
  },

  openCreateModal: () => {
    const body = `
      <div class="form-group">
        <label class="form-label">Deal name <span class="required">*</span></label>
        <input type="text" id="deal-name" class="form-control" placeholder="Q3 Licensing">
      </div>
      <div style="display: flex; gap: 16px;">
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Pipeline <span class="required">*</span></label>
          <select id="deal-pipeline" class="form-control">
            <option value="Sales Pipeline">Sales Pipeline</option>
          </select>
        </div>
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Deal Stage <span class="required">*</span></label>
          <select id="deal-stage" class="form-control">
            ${Stages.map(s => {
              const disabled = ['Draft Proposal', 'Proposal Presented'].includes(s);
              return `<option value="${s}" ${disabled ? 'disabled' : ''}>${s} ${disabled ? '(Synced from Bid)' : ''}</option>`;
            }).join('')}
          </select>
        </div>
      </div>
      <div style="display: flex; gap: 16px;">
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Amount</label>
          <input type="number" id="deal-amount" class="form-control" value="0">
        </div>
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Close Date</label>
          <input type="date" id="deal-date" class="form-control">
        </div>
      </div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" style="background:#FF7A59; border:none;" onclick="Deals.saveDeal()">Create</button>
    `;
    UI.openModal('Create Deal', body, footer);
  },

  saveDeal: () => {
    const name = document.getElementById('deal-name').value;
    const stage = document.getElementById('deal-stage').value;
    
    if (!name) {
      UI.toast('Deal name is required.', 'error');
      return;
    }

    DB.deals.push({
      id: generateId('D'),
      name: name,
      company: '',
      amount: parseInt(document.getElementById('deal-amount').value) || 0,
      stage: stage,
      pipeline: document.getElementById('deal-pipeline').value,
      closeDate: document.getElementById('deal-date').value || '2026-12-31',
      owner: 'Hara Nguyen',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });

    UI.closeModal();
    UI.toast('Deal created successfully');
    app.navigate('deals');
  },

  renderDetail: (container, dealId) => {
    const deal = DB.deals.find(d => d.id === dealId) || DB.deals[0];
    
    container.innerHTML = `
      <div class="detail-header">
        <a href="#" class="back-link" onclick="app.navigate('deals')">
          <i data-lucide="arrow-left" style="width:16px;"></i> Back to Deals
        </a>
        <div class="detail-title-row">
          <div>
            <div style="font-size:12px; color:var(--text-muted); font-family:monospace;">${deal.id}</div>
            <h1 class="detail-title">${deal.name}</h1>
            <div class="detail-subtitle">${deal.company || 'No Company'} • <a href="#" style="color:var(--primary);">${deal.owner}</a></div>
          </div>
          <div style="display:flex; gap:12px;">
            ${deal.stage === 'Solution Design' 
              ? `<button class="btn btn-primary" onclick="app.navigate('bidding')">Create Bid</button>` 
              : `<button class="btn btn-secondary" style="opacity: 0.5; cursor: not-allowed;" title="Create Bid is only allowed when Deal Stage is Solution Design.">Create Bid</button>`
            }
            <button class="btn btn-outline" onclick="UI.toast('Edit functionality not fully implemented.')">Edit Deal</button>
          </div>
        </div>
      </div>
      
      <div class="detail-layout">
        <!-- Left Column -->
        <div class="detail-left">
          <div class="deal-info-card">
            <div class="deal-amount-lg">$${deal.amount.toLocaleString()}</div>
            <div class="info-field">
              <div class="info-field-label">Deal Stage</div>
              <div class="info-field-value">${deal.stage}</div>
            </div>
            <div class="info-field">
              <div class="info-field-label">Pipeline</div>
              <div class="info-field-value">${deal.pipeline || 'Sales Pipeline'}</div>
            </div>
            <div class="info-field">
              <div class="info-field-label">Close Date</div>
              <div class="info-field-value">${deal.closeDate}</div>
            </div>
            <div class="info-field">
              <div class="info-field-label">Created At</div>
              <div class="info-field-value">${deal.createdAt || 'N/A'}</div>
            </div>
          </div>
          
          <div class="deal-info-card" style="margin-top:16px;">
            <div style="font-weight:600; font-size:14px; margin-bottom:16px; display:flex; justify-content:space-between;">
              Upcoming Activities & Tasks
              <i data-lucide="chevron-down" style="width:16px;"></i>
            </div>
            <div style="display:flex; justify-content:center; align-items:center; height:60px; color:var(--text-muted); font-size:13px;">
              No upcoming activities
            </div>
          </div>
        </div>
        
        <!-- Middle Column -->
        <div class="detail-middle">
          <div class="activity-widget">
            <div class="activity-nav">
              <div class="activity-tab active" onclick="Deals.changeActivityTab(this, 'note')">
                <i data-lucide="file-text" style="width:18px;"></i>
                Note
              </div>
              <div class="activity-tab" onclick="Deals.changeActivityTab(this, 'email')">
                <i data-lucide="mail" style="width:18px;"></i>
                Email
              </div>
              <div class="activity-tab" onclick="Deals.changeActivityTab(this, 'call')">
                <i data-lucide="phone" style="width:18px;"></i>
                Call
              </div>
              <div class="activity-tab" onclick="Deals.changeActivityTab(this, 'task')">
                <i data-lucide="check-square" style="width:18px;"></i>
                Task
              </div>
              <div class="activity-tab" onclick="Deals.changeActivityTab(this, 'meeting')">
                <i data-lucide="calendar" style="width:18px;"></i>
                Meeting
              </div>
              <div class="activity-tab" style="position: relative;" onclick="Deals.showMoreMenu(this)">
                <i data-lucide="more-horizontal" style="width:18px;"></i>
                More
                <div id="more-dropdown" style="display:none; position:absolute; top:100%; right:0; background:white; border:1px solid var(--border-color); border-radius:4px; box-shadow:var(--shadow-md); z-index:100; min-width: 150px; text-align:left;">
                  <div style="padding:8px 12px; cursor:pointer;" onclick="Deals.openLogModal('SMS')">Log SMS</div>
                  <div style="padding:8px 12px; cursor:pointer;" onclick="Deals.openLogModal('WhatsApp')">Log WhatsApp message</div>
                  <div style="padding:8px 12px; cursor:pointer;" onclick="Deals.openLogModal('LinkedIn')">Log a LinkedIn message</div>
                </div>
              </div>
            </div>
            
            <div class="activity-body" id="activity-content">
              <!-- Note Form is Default -->
              <div class="activity-editor">
                <textarea placeholder="Start typing to leave a note..."></textarea>
                <div class="editor-toolbar">
                  <i data-lucide="bold" style="width:16px;"></i>
                  <i data-lucide="italic" style="width:16px;"></i>
                  <i data-lucide="underline" style="width:16px;"></i>
                  <span style="font-size:12px; margin-left:8px;">More <i data-lucide="chevron-down" style="width:12px;"></i></span>
                  <i data-lucide="paperclip" style="width:16px; margin-left:16px;"></i>
                  <i data-lucide="image" style="width:16px;"></i>
                </div>
                <div style="margin-bottom: 12px; display:flex; align-items:center; gap:8px; font-size:12px; color:var(--primary); font-weight:500;">
                  <input type="checkbox" id="create-todo">
                  <label for="create-todo">Create a To-do - task to follow up in 3 business days (Friday) <i data-lucide="chevron-down" style="width:12px;"></i></label>
                </div>
                <div class="activity-footer">
                  <div style="font-size:12px; color:var(--primary); font-weight:500;">Associated with 2 records <i data-lucide="chevron-down" style="width:12px;"></i></div>
                  <button class="btn btn-primary" onclick="UI.toast('Note created successfully!')">Create note</button>
                </div>
              </div>
            </div>
          </div>
          
          <div style="margin-top:24px;">
            <div class="timeline-tabs">
              <div class="timeline-tab active">Overview</div>
              <div class="timeline-tab">All Activities</div>
              <div class="timeline-tab">Notes</div>
              <div class="timeline-tab">Emails</div>
              <div class="timeline-tab">Calls</div>
              <div class="timeline-tab">Tasks</div>
              <div class="timeline-tab">Meetings</div>
            </div>
            <div class="timeline-card" style="padding: 24px; text-align:center; color:var(--text-muted); font-size:13px;">
              Activity feed will appear here...
            </div>
          </div>
        </div>
        
        <!-- Right Column -->
        <div class="detail-right">
          <div class="assoc-card">
            <div class="assoc-header">
              Companies
              <button class="btn btn-secondary" style="padding:4px 8px; font-size:12px;" onclick="UI.toast('Add Company flow not implemented')">Add</button>
            </div>
            <div class="assoc-body">
              ${deal.company ? `
                <div class="assoc-item">
                  <div class="assoc-icon"><i data-lucide="building-2"></i></div>
                  <div>
                    <div style="font-weight:500; font-size:13px; color:var(--primary);">${deal.company}</div>
                  </div>
                </div>
              ` : `
                <div style="font-size:13px; color:var(--text-secondary); text-align:center;">No associated company</div>
              `}
            </div>
          </div>
          
          <div class="assoc-card">
            <div class="assoc-header">
              Contacts
              <button class="btn btn-secondary" style="padding:4px 8px; font-size:12px;" onclick="UI.toast('Add Contact flow not implemented')">Add</button>
            </div>
            <div class="assoc-body">
              <div style="font-size:13px; color:var(--text-secondary); text-align:center;">No associated contacts</div>
            </div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons({ root: container });
  },

  changeActivityTab: (el, type) => {
    // Basic tab switching logic
    document.querySelectorAll('.activity-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    
    const content = document.getElementById('activity-content');
    
    if (type === 'note') {
      content.innerHTML = `
        <div class="activity-editor">
          <textarea placeholder="Start typing to leave a note..."></textarea>
          <div class="editor-toolbar">
            <i data-lucide="bold" style="width:16px;"></i>
            <i data-lucide="italic" style="width:16px;"></i>
            <i data-lucide="underline" style="width:16px;"></i>
            <span style="font-size:12px; margin-left:8px;">More <i data-lucide="chevron-down" style="width:12px;"></i></span>
            <i data-lucide="paperclip" style="width:16px; margin-left:16px;"></i>
            <i data-lucide="image" style="width:16px;"></i>
          </div>
          <div style="margin-bottom: 12px; display:flex; align-items:center; gap:8px; font-size:12px; color:var(--primary); font-weight:500;">
            <input type="checkbox" id="create-todo">
            <label for="create-todo">Create a To-do - task to follow up in 3 business days (Friday) <i data-lucide="chevron-down" style="width:12px;"></i></label>
          </div>
          <div class="activity-footer">
            <div style="font-size:12px; color:var(--primary); font-weight:500;">Associated with 2 records <i data-lucide="chevron-down" style="width:12px;"></i></div>
            <button class="btn btn-primary" onclick="UI.toast('Note created successfully!')">Create note</button>
          </div>
        </div>
      `;
    } else if (type === 'email') {
      content.innerHTML = `
        <div class="activity-editor">
          <div style="display:flex; gap:16px; margin-bottom:12px; font-size:13px; color:var(--primary);">
            <span>Templates</span> <span>Sequences</span> <span>Documents</span>
          </div>
          <div style="display:flex; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:8px;">
            <span style="width:50px; font-size:12px; color:var(--text-muted);">To</span>
            <span style="background:#E0E8F9; padding:2px 8px; border-radius:12px; font-size:12px;">John Doe <i data-lucide="x" style="width:10px;"></i></span>
          </div>
          <div style="display:flex; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:8px;">
            <span style="width:50px; font-size:12px; color:var(--text-muted);">From</span>
            <span style="font-size:13px;">TECHVIFY Vietnam</span>
          </div>
          <div style="display:flex; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:12px;">
            <span style="width:50px; font-size:12px; color:var(--text-muted);">Subject</span>
            <input type="text" style="border:none; outline:none; flex:1; font-size:13px;" placeholder="Enter subject...">
          </div>
          <textarea placeholder="Type '/' to ask AI to generate a draft..." style="min-height: 80px; border:none; border-bottom: 1px solid var(--border-color);"></textarea>
          <div class="activity-footer" style="margin-top:12px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <button class="btn btn-primary" onclick="UI.toast('Email sent successfully!')">Send</button>
              <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--primary); font-weight:500;">
                <input type="checkbox" id="create-todo-email">
                <label for="create-todo-email">Create a To-do</label>
              </div>
            </div>
            <div style="font-size:12px; color:var(--primary); font-weight:500;">Associated with 3 records <i data-lucide="chevron-down" style="width:12px;"></i></div>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 12px; display:flex; align-items:center; gap:4px;">
            <i data-lucide="info" style="width:12px;"></i> Note: Email open tracking is for reference only and may be blocked by client security filters.
          </div>
        </div>
      `;
    } else if (type === 'task') {
      content.innerHTML = `
        <div class="activity-editor">
          <input type="text" placeholder="Enter your task" style="width:100%; border:none; border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:16px; outline:none; font-size:14px; font-weight:500;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; font-size:13px;">
            <div>
              <div style="color:var(--text-muted); margin-bottom:4px; font-size:12px;">Activity date</div>
              <div>In 3 business days (Friday) <i data-lucide="chevron-down" style="width:12px;"></i> 8:00 AM</div>
            </div>
            <div>
              <div style="color:var(--text-muted); margin-bottom:4px; font-size:12px;">Send reminder</div>
              <div style="color:var(--primary);">No reminder</div>
            </div>
          </div>
          <div class="activity-footer" style="margin-top:24px;">
            <button class="btn btn-primary" onclick="UI.toast('Task created successfully!')">Create</button>
            <div style="font-size:12px; color:var(--primary); font-weight:500;">Associated with 2 records <i data-lucide="chevron-down" style="width:12px;"></i></div>
          </div>
        </div>
      `;
    } else {
      content.innerHTML = `<div style="padding: 24px; text-align:center; color:var(--text-muted); font-size:13px;">Mockup for ${type} is not fully implemented.</div>`;
    }
    lucide.createIcons({ root: content });
  },
  
  showMoreMenu: (el) => {
    const dropdown = el.querySelector('#more-dropdown');
    if (dropdown.style.display === 'none') {
      dropdown.style.display = 'block';
    } else {
      dropdown.style.display = 'none';
    }
  },

  openLogModal: (type) => {
    const body = `
      <div style="display:flex; gap:16px; margin-bottom:16px; font-size:13px;">
        <div style="flex:1;">
          <label class="form-label" style="font-size:11px;">Contacted</label>
          <div style="color:var(--primary);">0 contacts</div>
        </div>
        <div style="flex:1;">
          <label class="form-label" style="font-size:11px;">Activity date</label>
          <div>06/29/2026 8:11 AM GMT</div>
        </div>
      </div>
      <textarea class="form-control" placeholder="Start typing to log a ${type}..." style="min-height:100px; margin-bottom:16px;"></textarea>
      
      <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--primary); font-weight:500; margin-bottom: 16px;">
        <input type="checkbox" id="create-todo-modal">
        <label for="create-todo-modal">Create a To-do - task to follow up in 3 business days (Friday)</label>
      </div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="UI.closeModal(); UI.toast('${type} logged successfully!');">Log ${type}</button>
    `;
    UI.openModal(`Log ${type}`, body, footer);
  }
};
