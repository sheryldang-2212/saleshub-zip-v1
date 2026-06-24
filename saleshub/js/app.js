const app = {
  navigate: (target, param) => {
    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
      el.classList.remove('active');
    });
    
    const navItem = document.querySelector(`.nav-item[data-target="${target}"]`);
    if (navItem) navItem.classList.add('active');

    // Render corresponding view
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // clear

    switch (target) {
      case 'dashboard':
        mainContent.innerHTML = UI.emptyState('Dashboard', 'Dashboard is under construction.', 'layout-dashboard');
        break;
      case 'contacts':
        Contacts.render(mainContent);
        break;
      case 'contactDetail':
        Contacts.renderDetail(mainContent, param);
        break;
      case 'companies':
        Companies.render(mainContent);
        break;
      case 'companyDetail':
        Companies.renderDetail(mainContent, param);
        break;
      case 'deals':
        Deals.render(mainContent);
        break;
      case 'dealDetail':
        Deals.renderDetail(mainContent, param);
        break;
      case 'bidding':
        Bidding.render(mainContent);
        break;
      default:
        mainContent.innerHTML = UI.emptyState('Not Found', 'Module not found.');
    }
    
    // Re-init icons
    lucide.createIcons({ root: mainContent });
  },

  init: () => {
    app.navigate('deals'); // Default view
  }
};

document.addEventListener('DOMContentLoaded', app.init);
