// profile.js - Handles all logic for the user profile page.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- SUPABASE CLIENT SETUP ---
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

// --- GLOBAL VARIABLES ---
let currentUser = null;
let userProfile = null;

// --- CORE FUNCTIONS ---

/**
 * Checks if a user is authenticated. Redirects to index.html if not.
 * @returns {object|null} The user object or null.
 */
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'index.html';
        return null;
    }
    return session.user;
}

/**
 * Fetches the full user profile from the 'profiles' table.
 * @param {string} userId - The UUID of the user.
 * @returns {object|null} The profile data or null on error.
 */
async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*') // Selects all columns, including student_id and bio
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    return data;
}

/**
 * Fetches user statistics (placeholder function).
 * @param {string} userId - The UUID of the user.
 * @returns {object} An object with user stats.
 */
async function getUserStats(userId) {
    // In a real app, you would fetch this from your database.
    return {
        examsCompleted: 12,
        totalPoints: 847,
        averageScore: 85
    };
}

/**
 * Generates initials from a full name.
 * @param {string} name - The user's full name.
 * @returns {string} The generated initials.
 */
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
}


// --- NAVBAR INITIALIZATION ---

/**
 * Injects and configures the standard navbar component.
 * @param {string} activePage - The name of the current page ('dashboard', 'profile', etc.).
 * @returns {object|null} Data about the user and session, or null if not logged in.
 */
async function initNavbar(activePage = 'profile') {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return null;
    }

    const user = session.user;
    
    // Fetch minimal data needed for the navbar
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

    // Inject CSS for the navbar if it doesn't already exist
    if (!document.getElementById('navbar-styles')) {
        const style = document.createElement('style');
        style.id = 'navbar-styles';
        style.textContent = `
            .navbar { position: sticky; top: 0; z-index: 100; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(20px) saturate(180%); padding: 1rem 2rem; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(167, 139, 250, 0.25); width: 100%; }
            .navbar-brand { display: flex; align-items: center; gap: 0.875rem; }
            .navbar-logo { width: 48px; height: 48px; background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 1.4rem; box-shadow: 0 8px 25px rgba(167, 139, 250, 0.5); flex-shrink: 0; position: relative; }
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
            
            /* Student ID styling moved to profile.html styles or removed from here */
            .profile-id {
                color: #a78bfa;
                font-size: 0.95rem;
                font-weight: 500;
                background: rgba(167, 139, 250, 0.1);
                padding: 0.25rem 0.75rem;
                border-radius: 50px;
                display: inline-block;
                margin-top: 0.5rem;
                margin-bottom: 1.5rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Inject HTML for the navbar
    const existingNav = document.querySelector('.navbar');
    if (existingNav) {
        existingNav.outerHTML = navbarHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    }

    // Attach logout functionality
    document.getElementById('navLogoutBtn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
    });

    return { user, profile };
}

/**
 * Attaches click listeners to the menu items for navigation.
 */
function attachNavigationListeners() {
    const navigationMap = {
        'personalInfoLink': 'personalinfo.html',
        // Add other links here when their pages are ready
        'securityPrivacyLink': '#',
        'settingsLink': '#',
        'helpSupportLink': '#',
        'aboutThinkPlusLink': '#',
    };

    for (const [id, url] of Object.entries(navigationMap)) {
        const linkElement = document.getElementById(id);
        if (linkElement) {
            linkElement.addEventListener('click', (e) => {
                // Prevent default navigation for placeholder links
                if (url === '#') {
                    e.preventDefault();
                    console.log(`Navigation for ${id} is not yet implemented.`);
                    // Optionally, show a temporary message to the user
                    // alert('This feature is coming soon!');
                    return;
                }
                window.location.href = url;
            });
        }
    }
}

/**
 * Handles the logic for avatar uploading.
 */
function setupAvatarUpload() {
    // This function remains the same, no changes needed here.
    const avatarUploadBtn = document.getElementById('avatarUploadBtn');
    const avatarInput = document.getElementById('avatarInput');

    if (!avatarUploadBtn || !avatarInput) return;

    avatarUploadBtn.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            return alert('Please select an image file.');
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            return alert('Image size should be less than 2MB.');
        }

        avatarUploadBtn.innerHTML = '⏳';
        avatarUploadBtn.style.pointerEvents = 'none';

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(`public/${currentUser.id}_${Date.now()}`, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            alert('Error uploading image.');
            console.error(error);
            avatarUploadBtn.innerHTML = '📷';
            avatarUploadBtn.style.pointerEvents = 'auto';
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', currentUser.id);

        if (updateError) {
            alert('Error saving avatar URL.');
            console.error(updateError);
        } else {
            location.reload();
        }
    });
}

/**
 * Main function to load and render the profile page content.
 */
async function loadProfile() {
    const mainContent = document.getElementById('mainContent');
    const navData = await initNavbar('profile'); 
    
    if (!navData) {
        await checkAuth(); // Fallback check and redirect
        return;
    }

    currentUser = navData.user;
    
    // Fetch the complete, updated profile from the database
    // This is crucial to get the latest bio and other profile data.
    userProfile = await getUserProfile(currentUser.id);

    // If fetching the full profile failed, use the minimal one from initNavbar
    if (!userProfile) {
        userProfile = navData.profile;
    }

    const stats = await getUserStats(currentUser.id);

    // Prepare data for rendering, with fallbacks for new users
    const fullName = userProfile?.full_name || currentUser.user_metadata?.full_name || 'User';
    const email = currentUser.email;
    const avatarUrl = userProfile?.avatar_url;
    // Ensure bio and studentId use the fetched userProfile data
    const bio = userProfile?.bio || 'No bio yet. Click "Personal Information" to add one.';
    const initials = getInitials(fullName);
    const studentId = userProfile?.student_id || 'Not Assigned';


    // Generate the HTML for the main profile content
    const contentHTML = `
        <div class="profile-header">
            <div class="profile-top">
                <div class="avatar-container">
                    <div class="user-avatar-large" id="userAvatarLarge">
                        ${avatarUrl ? 
                            `<img src="${avatarUrl}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : 
                            initials
                        }
                    </div>
                    <div class="avatar-upload-btn" id="avatarUploadBtn">📷</div>
                </div>
                <div class="profile-info">
                    <div class="profile-name">${fullName}</div>
                    <div class="profile-email">${email}</div>
                    <div class="profile-id">Student ID: ${studentId}</div>
                    <div class="profile-stats">
                        <div class="stat-item"><span class="stat-value">${stats.examsCompleted}</span><span class="stat-label">exams</span></div>
                        <div class="stat-item"><span class="stat-value">${stats.totalPoints}</span><span class="stat-label">points</span></div>
                        <div class="stat-item"><span class="stat-value">${stats.averageScore}%</span><span class="stat-label">avg score</span></div>
                    </div>
                    <div class="profile-bio">${bio}</div>
                </div>
            </div>
        </div>
        <div class="menu-section">
            <div class="menu-item" id="personalInfoLink"><div class="menu-item-content"><div class="menu-icon personal">👤</div><div class="menu-text"><h4>Personal Information</h4><p>Update your name, email, and bio</p></div></div><div class="menu-arrow">›</div></div>
            <div class="menu-item" id="securityPrivacyLink"><div class="menu-item-content"><div class="menu-icon security">🔒</div><div class="menu-text"><h4>Security & Privacy</h4><p>Change password and privacy settings</p></div></div><div class="menu-arrow">›</div></div>
            <div class="menu-item" id="settingsLink"><div class="menu-item-content"><div class="menu-icon settings">⚙️</div><div class="menu-text"><h4>Settings</h4><p>Manage notifications and preferences</p></div></div><div class="menu-arrow">›</div></div>
            <div class="menu-item" id="helpSupportLink"><div class="menu-item-content"><div class="menu-icon help">❓</div><div class="menu-text"><h4>Help & Support</h4><p>Get help and view FAQs</p></div></div><div class="menu-arrow">›</div></div>
            <div class="menu-item" id="aboutThinkPlusLink"><div class="menu-item-content"><div class="menu-icon about">ℹ️</div><div class="menu-text"><h4>About ThinkPlus</h4><p>Learn more about our platform</p></div></div><div class="menu-arrow">›</div></div>
        </div>
    `;

    // Render the content and attach event listeners
    mainContent.innerHTML = contentHTML;
    setupAvatarUpload();
    attachNavigationListeners();
}

// --- INITIALIZATION ---
// This starts the entire process when the script is loaded.
loadProfile();