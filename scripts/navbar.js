// Dynamically load navbar and handle active tab & logout
function loadNavbar(activeTab) {
    const navbarContainer = document.getElementById('navbarContainer');
    if (!navbarContainer) return;

    fetch('/components/navbar.html')
        .then(res => res.text())
        .then(html => {
            navbarContainer.innerHTML = html;

            // Highlight active tab
            const tabs = ['dashboard', 'insights', 'profile'];
            tabs.forEach(tab => {
                const el = document.getElementById(`nav-${tab}`);
                if (el) {
                    el.classList.remove('active');
                    if (tab === activeTab) el.classList.add('active');
                }
            });

            // Logout
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('currentExamId');
                    localStorage.removeItem('selectedExamInsights');
                    window.location.href = '/';
                });
            }
        });
}
