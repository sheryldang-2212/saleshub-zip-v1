const fs = require('fs');
const appJsPath = 'app.js';
let content = fs.readFileSync(appJsPath, 'utf8');

const urlBindingOld =         const amountInput = document.querySelector('input[value="120000"]');
        if (amountInput) {
           const val = parseInt(deal.amount.replace(/[^0-9]/g, ''), 10) || 0;
           amountInput.value = val;
           amountInput.previousElementSibling.textContent = deal.amount;
        };

const urlBindingNew =         const amountInput = document.getElementById('deal-amount-input');
        const amountDisplay = document.getElementById('deal-amount-display');
        const sourceBadge = document.getElementById('amount-source-badge');
        if (amountInput && amountDisplay) {
           const val = parseInt(deal.amount.replace(/[^0-9]/g, ''), 10) || 0;
           amountInput.value = val;
           amountDisplay.textContent = deal.amount;
           
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
        };

content = content.replace(urlBindingOld, urlBindingNew);

const forecastLogic = 
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
       const currentVal = parseInt(deal.amount.replace(/[^0-9]/g, ''), 10) || 0;
       if (total !== currentVal) {
          forecastWarningBanner.style.display = 'block';
       } else {
          forecastWarningBanner.style.display = 'none';
       }
    }
  }

  function addForecastRow(monthVal = '', amountVal = '', noteVal = '') {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-color)';
    tr.innerHTML = \
      <td style="padding: 8px 12px;"><input type="month" class="property-input fc-month" value="\" style="width: 100%;"></td>
      <td style="padding: 8px 12px;"><input type="number" class="property-input fc-amount" value="\" min="0" style="width: 100%;"></td>
      <td style="padding: 8px 12px;"><input type="text" class="property-input fc-note" value="\" placeholder="Optional note" style="width: 100%;"></td>
      <td style="padding: 8px 12px; text-align: center;"><i class="ph ph-trash" style="cursor: pointer; color: #DC2626; font-size: 16px;" onclick="this.closest('tr').remove(); calculateTotalForecast();"></i></td>
    \;
    
    tr.querySelectorAll('input').forEach(inp => {
       inp.addEventListener('input', calculateTotalForecast);
    });
    
    if (forecastTbody) forecastTbody.appendChild(tr);
    calculateTotalForecast();
  }

  function openForecastModal() {
    if (!window.location.pathname.includes('deal.html')) return;
    const urlParams = new URLSearchParams(window.location.search);
    currentForecastDealId = urlParams.get('id');
    const deal = mockDeals.find(d => d.id === currentForecastDealId);
    
    if (deal && modalForecastOverlay) {
       document.getElementById('forecast-deal-name').textContent = deal.name;
       document.getElementById('forecast-current-amount').textContent = deal.amount;
       
       if (forecastTbody) forecastTbody.innerHTML = '';
       tempForecasts = [];
       
       if (deal.forecasts && deal.forecasts.length > 0) {
          deal.forecasts.forEach(fc => {
             addForecastRow(fc.month, fc.amount, fc.note);
          });
       } else {
          // prefill one row with current amount and close date month
          const amtVal = parseInt(deal.amount.replace(/[^0-9]/g, ''), 10) || 0;
          let monthStr = '';
          if (deal.closeDate) {
             const d = new Date(deal.closeDate);
             if (!isNaN(d)) {
                monthStr = d.toISOString().slice(0, 7); // YYYY-MM
             }
          }
          addForecastRow(monthStr, amtVal, '');
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
          const currentVal = parseInt(deal.amount.replace(/[^0-9]/g, ''), 10) || 0;
          if (newTotal !== currentVal) {
             const proceed = confirm("Deal Amount will be updated to match the Total Forecast Amount. Proceed?");
             if (!proceed) return;
          }
          
          const oldAmount = deal.amount;
          deal.forecasts = [...tempForecasts];
          deal.amount = formatMoneyStr(newTotal);
          deal.amountSource = 'forecast';
          
          mockAuditLogs.push(\[\] Deal \ forecast registered. Amount updated from \ to \.\);
          
          modalForecastOverlay.style.display = 'none';
          
          // Re-render Deal details
          const amountDisplay = document.getElementById('deal-amount-display');
          const amountInput = document.getElementById('deal-amount-input');
          const sourceBadge = document.getElementById('amount-source-badge');
          if (amountDisplay) {
             amountDisplay.textContent = deal.amount;
             amountDisplay.classList.remove('editable');
             if (amountInput) amountInput.value = newTotal;
             if (sourceBadge) {
                 sourceBadge.style.display = 'inline-block';
                 sourceBadge.textContent = 'Forecast';
             }
          }
          
          // trigger re-render of timelines to show the new audit log
          // A bit hacky, but we can simulate the URL load
          window.dispatchEvent(new Event('load')); 
       }
    });
  }

  // --- 14. NEW BID VALIDATION ---
;

content = content.replace('  // --- 14. NEW BID VALIDATION ---', forecastLogic);
fs.writeFileSync(appJsPath, content);
console.log('Successfully added Forecast Logic to app.js');
