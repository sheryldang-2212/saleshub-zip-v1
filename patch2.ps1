$appJsPath = 'saleshub\app.js'
$content = Get-Content $appJsPath -Raw

$content = $content -replace '(?<=document.addEventListener\(''DOMContentLoaded'', \(\) => \{\r?\n)', "
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
        recordCountEl.innerText = '0 records';
      } else {
        recordCountEl.innerText = '(' + totalCount + ' records)';
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
         paginationDiv.innerHTML = '<span>Showing 0-0 of 0</span><div class=\\"pagination-controls\\" style=\\"display:inline-flex;gap:4px;\\"><button class=\\"btn btn-secondary\\" style=\\"padding: 4px 8px;\\" disabled><i class=\\"ph ph-caret-left\\"></i></button><button class=\\"btn btn-secondary\\" style=\\"padding: 4px 8px;\\" disabled><i class=\\"ph ph-caret-right\\"></i></button></div>';
      } else {
         paginationDiv.innerHTML = '<span>Showing ' + (startIdx + 1) + '-' + endIdx + ' of ' + totalCount + '</span><div class=\\"pagination-controls\\" style=\\"display:inline-flex;gap:4px;\\"><button class=\\"btn btn-secondary btn-prev-page\\" style=\\"padding: 4px 8px;\\" ' + (state.currentPage === 1 ? 'disabled' : '') + '><i class=\\"ph ph-caret-left\\"></i></button><button class=\\"btn btn-secondary btn-next-page\\" style=\\"padding: 4px 8px;\\" ' + (state.currentPage === totalPages ? 'disabled' : '') + '><i class=\\"ph ph-caret-right\\"></i></button></div>';
         
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
"

$newRenderContacts = "function renderContacts(filter = 'all') {
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
        tr.innerHTML = \
          <td><input type=\\"checkbox\\" class=\\"contact-cb\\"></td>
          <td><a href=\\"contact.html\\" style=\\"font-weight: 500;\\">\</a></td>
          <td>\</td>
          <td>\</td>
          <td>\</td>
          <td>\</td>
          <td>\</td>
          <td>\</td>
          <td>\</td>
        \;
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
      tbody.innerHTML = '<tr><td colspan=\\"9\\" style=\\"color:red;text-align:center;\\">Error rendering contacts. <a href=\\"#\\" onclick=\\"renderContacts(); return false;\\">Retry</a></td></tr>';
    }
  }"
$content = [regex]::Replace($content, "(?s)function renderContacts\(filter = 'all'\) \{.*?updateContactActions\(\);\s*\}", $newRenderContacts, 1)

$newRenderCompanies = "function renderCompanies(filter = 'all', query = '') {
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

          tr.innerHTML = \
            <td><input type=\\"checkbox\\" class=\\"comp-cb\\"></td>
            <td><a href=\\"company.html?id=\\\" style=\\"font-weight: 500;\\">\</a></td>
            <td><span class=\\"badge \\\" style=\\"font-size: 12px; padding: 2px 8px; border-radius: 12px;\\">\</span></td>
            <td><span style=\\"font-weight: 500; color: #8B5CF6;\\">\</span></td>
            <td>\</td>
            <td><span class=\\"badge\\" style=\\"background-color: \; color: \; font-size: 11px;\\">\</span></td>
            <td>\</td>
            <td>\</td>
            <td>\</td>
            <td>\</td>
          \;
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
      compTbody.innerHTML = '<tr><td colspan=\\"10\\" style=\\"color:red;text-align:center;\\">Error rendering companies. <a href=\\"#\\" onclick=\\"renderCompanies(); return false;\\">Retry</a></td></tr>';
    }
  }"
$content = [regex]::Replace($content, "(?s)function renderCompanies\(filter = 'all', query = ''\) \{.*?updateCompanyActions\(\);\s*\}", $newRenderCompanies, 1)

$newRenderDeals = "function renderDeals() {
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
          let colHtml = \<div class=\\"kanban-col\\"><div class=\\"kanban-col-header\\">\ <span class=\\"col-count\\">\</span></div><div class=\\"kanban-col-body\\" data-stage=\\"\\\">\;
          
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
                       badgesHtml += \<span title=\\"\\\" style=\\"color: #EF4444; font-size: 14px; margin-left: 4px; vertical-align: middle;\\"><i class=\\"ph-fill ph-warning-circle\\"></i></span>\;
                   }
                   if (compData.potentialTag && compData.potentialTag !== 'None') {
                      badgesHtml += \<span class=\\"badge\\" style=\\"background: #FEF3C7; color: #D97706; font-size: 10px; margin-left: 4px;\\">\</span>\;
                   }
                   if (compData.health && compData.health.relationshipHealth) {
                      let bg = '#F3F4F6', col = '#4B5563';
                      if (compData.health.relationshipHealth === 'Red' || compData.health.relationshipHealth === 'Critical') { bg = '#FEE2E2'; col = '#EF4444'; }
                      else if (compData.health.relationshipHealth === 'Yellow') { bg = '#FEF3C7'; col = '#D97706'; }
                      else if (compData.health.relationshipHealth === 'Green') { bg = '#D1FAE5'; col = '#10B981'; }
                      badgesHtml += \<span class=\\"badge\\" style=\\"background: \; color: \; font-size: 10px; margin-left: 4px;\\" title=\\"\\\">\</span>\;
                   }
                }
            }
            colHtml += \
              <div class=\\"deal-card visual-card\\" draggable=\\"true\\" data-id=\\"\\\">
                <div class=\\"card-top\\">
                  <a href=\\"deal.html?id=\\\" class=\\"card-title\\">\ - \</a>
                  <input type=\\"checkbox\\" class=\\"deal-cb\\">
                </div>
                <div class=\\"card-date\\">Close date: \</div>
                <div class=\\"card-badges\\">\</div>
                <div class=\\"card-footer\\">
                  <div class=\\"card-company\\">
                    <div class=\\"company-avatar\\">\</div> \
                  </div>
                  <div class=\\"card-actions\\">
                    <i class=\\"ph ph-envelope-simple\\"></i>
                    <i class=\\"ph ph-file-text\\"></i>
                    <i class=\\"ph ph-floppy-disk\\"></i>
                  </div>
                </div>
              </div>
            \;
          });
          
          colHtml += \</div></div>\;
          kanbanBoardView.innerHTML += colHtml;
        });
        if(typeof setupDragAndDrop === 'function') setupDragAndDrop();
      }
  
      if (dealsTbody) {
        dealsTbody.innerHTML = '';
        paginatedDeals.forEach(d => {
          let trHtml = \
            <tr style=\\"border-bottom: 1px solid var(--border-color);\\">
              <td style=\\"padding: 12px;\\"><input type=\\"checkbox\\"></td>
              <td style=\\"padding: 12px;\\">\</td>
              <td style=\\"padding: 12px;\\"><a href=\\"deal.html?id=\\\" style=\\"color: var(--primary-teal); text-decoration: none; font-weight: 500;\\">\</a></td>
              <td style=\\"padding: 12px;\\"><span style=\\"background: #F1F5F9; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;\\">\</span></td>
              <td style=\\"padding: 12px;\\">\</td>
              <td style=\\"padding: 12px;\\">\</td>
              <td style=\\"padding: 12px;\\"><a href=\\"company.html\\" style=\\"color: var(--primary-teal); text-decoration: none;\\">\</a></td>
              <td style=\\"padding: 12px;\\"><a href=\\"contact.html\\" style=\\"color: var(--primary-teal); text-decoration: none;\\">Contact</a></td>
              <td style=\\"padding: 12px;\\">\</td>
              <td style=\\"padding: 12px;\\">01/01/2026</td>
              <td style=\\"padding: 12px;\\">01/01/2026</td>
            </tr>
          \;
          dealsTbody.innerHTML += trHtml;
        });
      }
    } catch(e) {
       console.error('Error rendering deals', e);
       if(dealsTbody) dealsTbody.innerHTML = '<tr><td colspan=\\"11\\" style=\\"color:red;text-align:center;\\">Error rendering deals. <a href=\\"#\\" onclick=\\"renderDeals(); return false;\\">Retry</a></td></tr>';
    }
  }"
$content = [regex]::Replace($content, "(?s)function renderDeals\(\) \{.*?dealsTbody\.innerHTML \+= trHtml;\s*\}\s*\}", $newRenderDeals, 1)

$newRenderBids = "function renderBids() {
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
          tr.innerHTML = \
            <td><input type=\\"checkbox\\" class=\\"bid-cb\\"></td>
            <td><a href=\\"bid_detail.html\\" style=\\"font-weight: 500;\\">\</a></td>
            <td>\</td>
            <td>\</td>
            <td><span class=\\"badge \\\">\</span></td>
            <td style=\\"font-weight: 600;\\">\</td>
            <td>\</td>
            <td>\</td>
            <td><a href=\\"deal.html\\">\</a></td>
          \;
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
          const col = document.querySelector(\#bidding-board-view .kanban-col-body[data-stage=\\"\\\"]\);
          if (col) {
            const card = document.createElement('div');
            card.className = 'deal-card visual-card';
            card.innerHTML = \
              <div class=\\"card-top\\">
                <a href=\\"bid_detail.html\\" class=\\"card-title\\">\</a>
                <input type=\\"checkbox\\" class=\\"deal-cb\\">
              </div>
              <div class=\\"card-date\\">Deadline: \</div>
              <div class=\\"card-badges\\">
                <span class=\\"badge \\\" style=\\"border-radius: 12px; padding: 2px 8px; font-size: 11px;\\">\</span>
              </div>
              <div style=\\"font-weight: 600; font-size: 14px; margin: 8px 12px 0;\\">\</div>
              <div class=\\"card-footer\\" style=\\"margin-top: 8px;\\">
                <div class=\\"card-company\\">
                  <div class=\\"company-avatar\\" style=\\"visibility:hidden; width:0; margin:0\\"></div> <i class=\\"ph ph-buildings\\" style=\\"margin-right: 4px;\\"></i> \
                </div>
                <div class=\\"card-actions\\">
                  <i class=\\"ph ph-file-text\\" style=\\"cursor: pointer;\\"></i>
                  <i class=\\"ph ph-link\\" style=\\"cursor: pointer;\\"></i>
                </div>
              </div>
            \;
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
      if(bidTbody) bidTbody.innerHTML = '<tr><td colspan=\\"9\\" style=\\"color:red;text-align:center;\\">Error rendering bids. <a href=\\"#\\" onclick=\\"renderBids(); return false;\\">Retry</a></td></tr>';
    }
  }"
$content = [regex]::Replace($content, "(?s)function renderBids\(\) \{.*?countEl\.textContent = \\$\{filtered\.length\} bids\;\s*\}", $newRenderBids, 1)

Set-Content $appJsPath -Value $content -Encoding UTF8
