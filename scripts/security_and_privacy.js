import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- SUPABASE SETUP ---
const SUPABASE_URL = 'https://mqosqiucfkrmscfkacto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xb3NxaXVjZmtybXNjZmthY3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTQ4MDMsImV4cCI6MjA3NTQzMDgwM30.b6PYbitm8uUcQPd_Yc1qGbV6WGfZSQlDI_RxrHjzZC0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: window.sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// --- NAVBAR LOGIC (Required for page initialization and authentication) ---
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
}

async function initNavbar(activePage = 'profile') {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Redirect if not authenticated
    if (!session) {
        window.location.href = 'index.html';
        return null;
    }

    const user = session.user;
    
    // Fetch profile data for the navbar
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

    const fullName = profile?.full_name || user.user_metadata?.full_name || user.email.split('@')[0];
    const avatarUrl = profile?.avatar_url;
    
    const initials = getInitials(fullName);

    const navbarHTML = `
        <nav class="navbar">
            <div class="navbar-brand">
                <div class="navbar-logo">T+</div>
                <div class="navbar-text">
                    <h1 class="navbar-title">ThinkPlus</h1>
                    <p class="navbar-subtitle">Exam Portal</p>
                </div>
            </div>
            <div class="navbar-menu">
                <a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a>
                <a href="insights.html" class="${activePage === 'insights' ? 'active' : ''}">Insights</a>
                <a href="profile.html" class="${activePage === 'profile' ? 'active' : ''}">Profile</a>
            </div>
            <div class="user-menu">
                <div class="user-info">
                    <div class="user-avatar" id="navUserAvatar">
                        ${avatarUrl ? 
                            `<img src="${avatarUrl}" alt="${fullName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : 
                            initials
                        }
                    </div>
                    <span class="user-name">${fullName}</span>
                </div>
                <button class="btn-logout" id="navLogoutBtn">Logout</button>
            </div>
        </nav>
    `;

    // Inject Navbar Styles 
    if (!document.getElementById('navbar-styles')) {
        const style = document.createElement('style');
        style.id = 'navbar-styles';
        style.textContent = `
            .navbar { position: sticky; top: 0; z-index: 100; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(20px) saturate(180%); padding: 1rem 2rem; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(167, 139, 250, 0.25); width: 100%; }
            .navbar-brand { display: flex; align-items: center; gap: 0.875rem; }
            .navbar-logo { width: 48px; height: 48px; background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 1.4rem; box-shadow: 0 8px 25px rgba(167, 139, 250, 0.5); flex-shrink: 0; position: relative; }
            .navbar-logo::after { content: ''; position: absolute; inset: -2px; border-radius: 12px; background: linear-gradient(135deg, #a78bfa, #ec4899); opacity: 0.3; filter: blur(10px); animation: navPulse 3s ease-in-out infinite; z-index: -1; }
            @keyframes navPulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.05); } }
            .navbar-text { display: flex; flex-direction: column; gap: 0.125rem; }
            .navbar-title { font-size: 1.5rem; background: linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f59e0b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 800; letter-spacing: -0.5px; line-height: 1; margin: 0; }
            .navbar-subtitle { font-size: 0.75rem; color: #94a3b8; font-weight: 500; letter-spacing: 0.025em; margin: 0; }
            .navbar-menu { display: flex; gap: 2rem; align-items: center; }
            .navbar-menu a { text-decoration: none; color: #cbd5e1; font-weight: 600; transition: all 0.3s ease; position: relative; padding: 0.5rem 0; }
            .navbar-menu a:hover { color: #a78bfa; }
            .navbar-menu a.active { color: #a78bfa; }
            .navbar-menu a.active::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, #a78bfa, #ec4899); border-radius: 2px; }
            .user-menu { display: flex; align-items: center; gap: 1rem; }
            .user-info { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; background: rgba(30, 41, 59, 0.5); border-radius: 50px; border: 1px solid rgba(167, 139, 250, 0.2); backdrop-filter: blur(10px); }
            .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.95rem; box-shadow: 0 4px 15px rgba(167, 139, 250, 0.4); flex-shrink: 0; }
            .user-name { color: #e2e8f0; font-size: 0.95rem; font-weight: 600; white-space: nowrap; }
            .btn-logout { padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3); }
            .btn-logout:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(239, 68, 68, 0.5); }
            @media (max-width: 968px) { .navbar { flex-wrap: wrap; gap: 1rem; padding: 1rem 1.5rem; } .navbar-menu { order: 3; width: 100%; justify-content: center; gap: 1.5rem; } }
            @media (max-width: 640px) { .navbar-logo { width: 40px; height: 40px; font-size: 1.2rem; } .navbar-title { font-size: 1.25rem; } .navbar-subtitle { font-size: 0.7rem; } }
        `;
        document.head.appendChild(style);
    }

    // Inject Navbar HTML
    const existingNav = document.querySelector('.navbar');
    if (existingNav) {
        existingNav.outerHTML = navbarHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    }

    // Setup Logout Listener
    document.getElementById('navLogoutBtn').addEventListener('click', async () => {
        try {
            await supabase.auth.signOut();
            window.location.href = 'index.html';
        } catch (err) {
            console.error('Logout error:', err);
            alert('Failed to logout. Please try again.');
        }
    });

    return { user, profile, fullName };
}
// --- END NAVBAR LOGIC ---

// --- MODAL 1: Change Password Logic ---
const changePasswordModal = document.getElementById("changePasswordModal");
const openChangePassBtn = document.getElementById("openChangePasswordModalBtn");
const closeChangePassBtn = document.querySelector(".change-pass-close");
const cancelChangePassBtn = document.getElementById("cancelChangePasswordBtn");
const saveNewPassBtn = document.getElementById("saveNewPasswordBtn");

if(openChangePassBtn) openChangePassBtn.addEventListener('click', () => changePasswordModal.style.display = "block");
if(closeChangePassBtn) closeChangePassBtn.addEventListener('click', () => changePasswordModal.style.display = "none");
if(cancelChangePassBtn) cancelChangePassBtn.addEventListener('click', () => changePasswordModal.style.display = "none");

if (saveNewPassBtn) {
    saveNewPassBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const currentPass = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmNewPassword').value;

        if (!currentPass || !newPass || !confirmPass) {
            alert("All password fields are required.");
            return;
        }
        
        if (newPass !== confirmPass) {
            alert("New password and confirmation do not match!");
            return;
        }

        if (newPass.length < 6) {
            alert("New password must be at least 6 characters long.");
            return;
        }

        // Attempt to update the user's password
        try {
            // NOTE: Supabase's updateUser function handles the complexity of password change 
            // but usually requires a fresh session or special policies. We use it directly here.
            
            const { error } = await supabase.auth.updateUser({ password: newPass });

            if (error) throw error;
            
            alert('Password changed successfully! You will be logged out and asked to sign in with your new password.');
            await supabase.auth.signOut();
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Error changing password:', error.message);
            alert('Failed to change password. This may be due to an expired session or invalid current password. Please log in again and try.');
        } finally {
            // Clear inputs and close
            document.getElementById('changePasswordForm').reset();
            changePasswordModal.style.display = "none";
        }
    });
}


// --- MODAL 2: Delete Account Logic ---
const deleteAccountModal = document.getElementById("deleteAccountModal");
const openDeleteBtn = document.getElementById("openDeleteAccountModalBtn");
const closeDeleteBtn = document.querySelector(".delete-account-close");
const cancelDeleteBtn = document.getElementById("cancelDeleteAccountBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteAccountBtn");

if(openDeleteBtn) openDeleteBtn.addEventListener('click', () => deleteAccountModal.style.display = "block");
if(closeDeleteBtn) closeDeleteBtn.addEventListener('click', () => deleteAccountModal.style.display = "none");
if(cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => deleteAccountModal.style.display = "none");

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const password = document.getElementById('deleteAccountPassword').value;

        if (!password) {
            alert("Please enter your password to confirm deletion.");
            return;
        }

        try {
            // WARNING: A real application would require a secure server-side function
            // to verify the password and delete the user from the database. 
            // This is a client-side placeholder for demonstration.
            
            // Simulate deletion attempt
            // NOTE: If using a real Supabase setup, you'd need an admin key or an Edge Function.
            
            // Clear inputs and close the modal
            document.getElementById('deleteAccountPassword').value = '';
            deleteAccountModal.style.display = "none";
            
            // Log out and notify user (since we can't truly delete client-side)
            await supabase.auth.signOut();
            
            alert('Account deletion initiated. Please check your email for confirmation steps (simulated). You have been logged out.');
            window.location.href = 'index.html'; 

        } catch (error) {
            console.error('Error deleting account:', error.message);
            alert('Failed to initiate account deletion. Please try again.');
            deleteAccountModal.style.display = "none";
        }
    });
}


// --- Toggle Switch Logic ---
const toggle2FA = document.getElementById('toggle2FA');
const toggleDataConsent = document.getElementById('toggleDataConsent');

async function updateToggleState(columnName, isChecked, settingName) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
             console.error("Session expired. Cannot update settings.");
             return;
        }

        // We assume a 'profiles' table exists to store these settings
        const { error } = await supabase
            .from('profiles')
            .update({ [columnName]: isChecked })
            .eq('id', session.user.id);
        
        if (error) throw error;
        
        const status = isChecked ? 'Enabled' : 'Disabled';
        console.log(`${settingName} updated successfully. Status: ${status}`);

    } catch (error) {
        console.error(`Error updating ${settingName}:`, error);
        alert(`Failed to save ${settingName} setting. Please try again.`);
        // Revert UI on failure
        if (document.getElementById(columnName)) {
            document.getElementById(columnName).checked = !isChecked;
        }
    }
}

if (toggle2FA) {
    toggle2FA.addEventListener('change', () => {
        updateToggleState('has_2fa', toggle2FA.checked, 'Two-Factor Authentication');
    });
}

if (toggleDataConsent) {
    toggleDataConsent.addEventListener('change', () => {
        updateToggleState('data_consent', toggleDataConsent.checked, 'Data Usage Consent');
    });
}


// --- Global Close Modal Logic (Clicking outside) ---
window.addEventListener('click', (event) => {
    if (event.target === changePasswordModal) {
        changePasswordModal.style.display = "none";
    }
    if (event.target === deleteAccountModal) {
        deleteAccountModal.style.display = "none";
    }
});

// --- Initialization ---
async function initPage() {
    // Initialize the navbar, making the 'Profile' link active.
    const navData = await initNavbar('profile');

    if (navData) {
        // Fetch current settings to populate toggles
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('has_2fa, data_consent')
            .eq('id', navData.user.id)
            .single();

        if (profile) {
            // Set initial state based on fetched data, defaulting to checked if null/undefined
            if (toggle2FA) toggle2FA.checked = profile.has_2fa !== false; 
            if (toggleDataConsent) toggleDataConsent.checked = profile.data_consent !== false; 
        } else if (error && error.code !== 'PGRST116') { // PGRST116 is no rows found
             console.error('Error fetching initial settings:', error);
        }
    }
}

// Start the page initialization
initPage();