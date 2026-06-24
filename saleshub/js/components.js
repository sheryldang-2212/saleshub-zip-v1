// Reusable UI Components

const UI = {
  toast: (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `
      <i data-lucide="${icon}"></i>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    lucide.createIcons({ root: toast });
    
    // Animate in
    setTimeout(() => toast.classList.add('active'), 10);
    
    // Remove after 3s
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  openModal: (title, bodyHtml, footerHtml) => {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="modal-overlay" id="active-modal">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="btn-icon" onclick="UI.closeModal()"><i data-lucide="x"></i></button>
          </div>
          <div class="modal-body">
            ${bodyHtml}
          </div>
          <div class="modal-footer">
            ${footerHtml}
          </div>
        </div>
      </div>
    `;
    lucide.createIcons({ root: container });
    
    const overlay = document.getElementById('active-modal');
    setTimeout(() => overlay.classList.add('active'), 10);
  },

  closeModal: () => {
    const overlay = document.getElementById('active-modal');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        document.getElementById('modal-container').innerHTML = '';
      }, 300);
    }
  },

  emptyState: (title, description, icon = 'folder-open', cta = '') => {
    return `
      <div class="empty-state">
        <i data-lucide="${icon}" class="empty-icon" style="width: 48px; height: 48px;"></i>
        <h3 class="empty-title">${title}</h3>
        <p class="empty-desc">${description}</p>
        ${cta}
      </div>
    `;
  }
};
