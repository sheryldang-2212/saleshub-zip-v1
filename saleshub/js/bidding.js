const Bidding = {
  render: (container) => {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title">
          <h1>Bidding</h1>
          <span class="record-count">${DB.bids.length} records</span>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="Bidding.openCreateModal()"><i data-lucide="plus"></i> New bid</button>
        </div>
      </div>
      
      <div class="toolbar">
        <div class="toolbar-left" style="gap: 24px;">
          <div style="display: flex; gap: 16px; border-right: 1px solid var(--border-color); padding-right: 24px;">
            <a href="#" style="font-weight: 600; color: var(--primary); text-decoration: none; border-bottom: 2px solid var(--primary); padding-bottom: 4px;">All bids</a>
            <a href="#" style="font-weight: 500; color: var(--text-secondary); text-decoration: none;">My bids</a>
          </div>
          <div class="search-bar" style="max-width: 300px; height: 36px;">
            <input type="text" placeholder="Search by bid ID, client, opportunity...">
            <i data-lucide="search"></i>
          </div>
        </div>
        <div class="toolbar-right">
          <button class="btn btn-secondary" style="height: 36px;"><i data-lucide="filter"></i> Bid Status</button>
        </div>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th class="table-checkbox"><input type="checkbox"></th>
              <th>Bid ID</th>
              <th>Client</th>
              <th>Opportunity</th>
              <th>Status</th>
              <th>Estimated value</th>
              <th>Submission deadline</th>
              <th>Bid owner</th>
            </tr>
          </thead>
          <tbody>
            ${DB.bids.map(b => `
              <tr>
                <td class="table-checkbox"><input type="checkbox"></td>
                <td><a href="#" style="color: var(--primary); font-weight: 500;">${b.id}</a></td>
                <td style="font-weight: 500;">${b.client}</td>
                <td>${b.opportunity}</td>
                <td><span class="badge badge-blue">${b.status}</span></td>
                <td>$${b.value.toLocaleString()}</td>
                <td>${b.deadline}</td>
                <td>${b.owner}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  openCreateModal: () => {
    // Generate deal options. Red text for deals not in Solution Design
    const dealOptions = DB.deals.map(d => {
      const isValid = d.stage === 'Solution Design';
      return `<option value="${d.id}" data-valid="${isValid}" data-stage="${d.stage}">
        ${d.id} - ${d.name} (${d.stage})
      </option>`;
    }).join('');

    const body = `
      <div style="background: #E0E8F9; color: #1E3A8A; padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 16px; font-size: 13px; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="info" style="width: 16px;"></i>
        Associate bid with a deal in Solution Design stage to create a bid.
      </div>
      
      <div class="form-group">
        <label class="form-label">Associate with Deal <span class="required">*</span></label>
        <select id="bid-deal" class="form-control" onchange="Bidding.checkDealValidity(this)">
          <option value="" disabled selected>Select a deal...</option>
          ${dealOptions}
        </select>
        <div id="bid-deal-error" class="form-error" style="display: none; margin-top: 6px;">
          Bid can only be created for Sales pipeline deals in Solution Design stage.
        </div>
      </div>
      
      <div style="display: flex; gap: 16px;">
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Client name <span class="required">*</span></label>
          <input type="text" id="bid-client" class="form-control" placeholder="Client Name">
        </div>
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Opportunity title <span class="required">*</span></label>
          <input type="text" id="bid-opp" class="form-control" placeholder="Opportunity Title">
        </div>
      </div>
      
      <div style="display: flex; gap: 16px;">
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Estimated value</label>
          <input type="number" id="bid-value" class="form-control" placeholder="100000">
        </div>
        <div class="form-group" style="flex: 1;">
          <label class="form-label">Submission deadline <span class="required">*</span></label>
          <input type="date" id="bid-deadline" class="form-control">
        </div>
      </div>
    `;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" id="btn-create-bid" onclick="Bidding.saveBid()" disabled>Create bid</button>
    `;
    UI.openModal('Create Bid', body, footer);
  },

  checkDealValidity: (selectElem) => {
    const selectedOption = selectElem.options[selectElem.selectedIndex];
    const isValid = selectedOption.getAttribute('data-valid') === 'true';
    const errorElem = document.getElementById('bid-deal-error');
    const btnSubmit = document.getElementById('btn-create-bid');
    
    if (!isValid) {
      errorElem.style.display = 'block';
      selectElem.style.borderColor = 'var(--error)';
      btnSubmit.disabled = true;
    } else {
      errorElem.style.display = 'none';
      selectElem.style.borderColor = 'var(--border-color)';
      btnSubmit.disabled = false;
    }
  },

  saveBid: () => {
    const dealId = document.getElementById('bid-deal').value;
    const client = document.getElementById('bid-client').value;
    const opp = document.getElementById('bid-opp').value;
    const deadline = document.getElementById('bid-deadline').value;
    
    if (!dealId || !client || !opp || !deadline) {
      UI.toast('Please fill in all required fields.', 'error');
      return;
    }

    DB.bids.unshift({
      id: generateId('BID'),
      client: client,
      opportunity: opp,
      status: 'New',
      value: parseInt(document.getElementById('bid-value').value) || 0,
      deadline: deadline,
      owner: 'Hara Nguyen',
      dealId: dealId
    });

    UI.closeModal();
    UI.toast('Bid created successfully');
    app.navigate('bidding');
  }
};
