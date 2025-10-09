// navbar-component.js
// Reusable Navbar Component for ThinkPlus
// Usage: Import this file and call initNavbar(supabase, activePage)

export async function initNavbar(supabase, activePage = 'dashboard') {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    const user = session.user;
    
    // Get user profile for avatar
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

    const fullName = profile?.full_name || user.user_metadata?.full_name || user.email.split('@')[0];
    const avatarUrl = profile?.avatar_url;
    
    // Generate initials
    function getInitials(name) {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
    }

    const initials = getInitials(fullName);

    // Create navbar HTML
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

    // Add navbar CSS if not already present
    if (!document.getElementById('navbar-styles')) {
        const style = document.createElement('style');
        style.id = 'navbar-styles';
        style.textContent = `
            .navbar {
                position: relative;
                z-index: 100;
                background: rgba(15, 23, 42, 0.5);
                backdrop-filter: blur(20px) saturate(180%);
                padding: 1rem 2rem;
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(167, 139, 250, 0.25);
                position: sticky;
                top: 0;
            }

            .navbar-brand {
                display: flex;
                align-items: center;
                gap: 0.875rem;
            }

            .navbar-logo {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 900;
                font-size: 1.4rem;
                box-shadow: 0 8px 25px rgba(167, 139, 250, 0.5);
                flex-shrink: 0;
                position: relative;
            }

            .navbar-logo::after {
                content: '';
                position: absolute;
                inset: -2px;
                border-radius: 12px;
                background: linear-gradient(135deg, #a78bfa, #ec4899);
                opacity: 0.3;
                filter: blur(10px);
                animation: navPulse 3s ease-in-out infinite;
                z-index: -1;
            }

            @keyframes navPulse {
                0%, 100% {
                    opacity: 0.3;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.6;
                    transform: scale(1.05);
                }
            }

            .navbar-text {
                display: flex;
                flex-direction: column;
                gap: 0.125rem;
            }

            .navbar-title {
                font-size: 1.5rem;
                background: linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f59e0b 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 800;
                letter-spacing: -0.5px;
                line-height: 1;
                margin: 0;
            }

            .navbar-subtitle {
                font-size: 0.75rem;
                color: #94a3b8;
                font-weight: 500;
                letter-spacing: 0.025em;
                margin: 0;
            }

            .navbar-menu {
                display: flex;
                gap: 2rem;
                align-items: center;
            }

            .navbar-menu a {
                text-decoration: none;
                color: #cbd5e1;
                font-weight: 600;
                transition: all 0.3s ease;
                position: relative;
                padding: 0.5rem 0;
            }

            .navbar-menu a:hover {
                color: #a78bfa;
            }

            .navbar-menu a.active {
                color: #a78bfa;
            }

            .navbar-menu a.active::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, #a78bfa, #ec4899);
                border-radius: 2px;
            }

            .user-menu {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .user-info {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.5rem 1rem;
                background: rgba(30, 41, 59, 0.5);
                border-radius: 50px;
                border: 1px solid rgba(167, 139, 250, 0.2);
                backdrop-filter: blur(10px);
            }

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 700;
                font-size: 0.95rem;
                box-shadow: 0 4px 15px rgba(167, 139, 250, 0.4);
                flex-shrink: 0;
            }

            .user-name {
                color: #e2e8f0;
                font-size: 0.95rem;
                font-weight: 600;
                white-space: nowrap;
            }

            .btn-logout {
                padding: 0.75rem 1.5rem;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
            }

            .btn-logout:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(239, 68, 68, 0.5);
            }

            .btn-logout:active {
                transform: translateY(0);
            }

            @media (max-width: 968px) {
                .navbar {
                    flex-wrap: wrap;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                }

                .navbar-menu {
                    order: 3;
                    width: 100%;
                    justify-content: center;
                    gap: 1.5rem;
                }

                .user-info {
                    padding: 0.4rem 0.8rem;
                }

                .user-name {
                    font-size: 0.85rem;
                }

                .btn-logout {
                    padding: 0.6rem 1.2rem;
                    font-size: 0.85rem;
                }
            }

            @media (max-width: 640px) {
                .navbar-logo {
                    width: 40px;
                    height: 40px;
                    font-size: 1.2rem;
                }

                .navbar-title {
                    font-size: 1.25rem;
                }

                .navbar-subtitle {
                    font-size: 0.7rem;
                }

                .user-avatar {
                    width: 35px;
                    height: 35px;
                    font-size: 0.85rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Insert navbar at the beginning of body or replace existing
    const existingNav = document.querySelector('.navbar');
    if (existingNav) {
        existingNav.outerHTML = navbarHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    }

    // Setup logout handler
    document.getElementById('navLogoutBtn').addEventListener('click', async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            window.location.href = 'index.html';
        } catch (err) {
            console.error('Logout error:', err);
            alert('Failed to logout. Please try again.');
        }
    });

    return { user, profile, fullName };
}

// Standalone initialization for direct script tag usage
if (typeof window !== 'undefined') {
    window.initNavbar = initNavbar;
}