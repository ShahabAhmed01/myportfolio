document.addEventListener("DOMContentLoaded", async () => {
    const config = window.PORTFOLIO_CONFIG;
    if (!config) return;

    // Show loading indicator in the projects container
    const projectsContainer = document.querySelector('[data-projects-container]');
    if (projectsContainer) {
        projectsContainer.innerHTML = `
            <div class="projects-loading" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div class="loading-spinner"></div>
                <p style="color: var(--text-muted, #888); margin-top: 1rem; font-size: 0.9rem;">Loading projects from GitHub…</p>
            </div>
        `;
    }

    try {
        // Fetch User Data & Repos in parallel
        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${config.githubUsername}`),
            fetch(`https://api.github.com/users/${config.githubUsername}/repos?per_page=100&sort=updated`)
        ]);

        if (!userRes.ok || !reposRes.ok) {
            throw new Error(`GitHub API error: user=${userRes.status}, repos=${reposRes.status}`);
        }

        const userData = await userRes.json();
        const reposData = await reposRes.json();

        // Guard: GitHub rate limit returns an object with "message", not an array
        if (!Array.isArray(reposData)) {
            throw new Error(reposData.message || 'Unexpected GitHub API response');
        }

        // 1. Update Location
        const locationEl = document.querySelector('[data-location]');
        if (locationEl) {
            locationEl.textContent = config.location || userData.location || 'Not Specified';
        }

        // 2. Update Semester
        const semesterEl = document.querySelector('[data-about="semester"]');
        if (semesterEl) {
            const s = config.currentSemester;
            const suffix = s === 1 ? 'st' : s === 2 ? 'nd' : s === 3 ? 'rd' : 'th';
            semesterEl.textContent = `${s}${suffix} semester`;
        }

        // 3. Update Stats
        const repoStat = document.querySelector('[data-stat="repos"]');
        if (repoStat) {
            const count = userData.public_repos || reposData.length;
            repoStat.setAttribute('data-target', count);
            repoStat.textContent = count;
        }

        const techStat = document.querySelector('[data-stat="technologies"]');
        if (techStat) {
            techStat.setAttribute('data-target', config.skills.length);
            techStat.textContent = config.skills.length;
        }

        const semStat = document.querySelector('[data-stat="semesters"]');
        if (semStat) {
            semStat.setAttribute('data-target', config.currentSemester);
            semStat.textContent = config.currentSemester;
        }

        // 4. Render Skills
        const skillsContainer = document.querySelector('[data-skills-container]');
        if (skillsContainer) {
            skillsContainer.innerHTML = '';
            config.skills.forEach(skill => {
                const tag = document.createElement('div');
                tag.className = `skill-tag skill-${skill.level}`;
                tag.textContent = skill.name;
                skillsContainer.appendChild(tag);
            });
        }

        // 5. Render Projects
        if (projectsContainer) {
            projectsContainer.innerHTML = '';

            // Filter out forks and the portfolio repo itself, then sort
            const filteredRepos = reposData
                .filter(repo => !repo.fork && repo.name !== `${config.githubUsername}.github.io`)
                .sort((a, b) => {
                    // Sort by stars first, then by most recently updated
                    if (b.stargazers_count !== a.stargazers_count) {
                        return b.stargazers_count - a.stargazers_count;
                    }
                    return new Date(b.updated_at) - new Date(a.updated_at);
                });

            if (filteredRepos.length === 0) {
                projectsContainer.innerHTML = `
                    <div class="projects-empty" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <p style="color: var(--text-muted, #888); font-size: 1rem;">No projects found.</p>
                    </div>
                `;
                return;
            }

            filteredRepos.forEach((repo, index) => {
                const card = document.createElement('div');
                card.className = 'project-card glass-card';
                card.style.setProperty('--delay', `${index * 0.1}s`);

                // Format the repo name: replace hyphens/underscores with spaces, title-case
                const displayName = repo.name
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase());

                card.innerHTML = `
                    <div class="project-header">
                        <div class="project-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View ${repo.name} on GitHub">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                    </div>
                    <h3 class="project-title">${displayName}</h3>
                    <p class="project-desc">${repo.description || 'No description provided.'}</p>
                    <div class="project-tags">
                        ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                        <span class="tag">⭐ ${repo.stargazers_count}</span>
                    </div>
                `;
                projectsContainer.appendChild(card);
            });

            // CRITICAL: Make cards visible.
            // The reveal-up IntersectionObserver in script.js has already run before
            // these cards existed. Instead of adding reveal-up and hoping the observer
            // picks them up, we animate them ourselves with a staggered entrance.
            requestAnimationFrame(() => {
                const cards = projectsContainer.querySelectorAll('.project-card');
                cards.forEach((card, i) => {
                    // Start hidden
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

                    // Stagger the animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 80 + 50);
                });
            });
        }
    } catch (error) {
        console.error("Error syncing with GitHub:", error);

        // Show error state with retry option
        if (projectsContainer) {
            projectsContainer.innerHTML = `
                <div class="projects-error" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted, #888)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; opacity: 0.5;">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p style="color: var(--text-muted, #888); font-size: 0.95rem; margin-bottom: 1rem;">Could not load projects from GitHub.</p>
                    <button onclick="location.reload()" style="
                        padding: 0.6rem 1.5rem;
                        background: rgba(99, 102, 241, 0.15);
                        border: 1px solid rgba(99, 102, 241, 0.3);
                        border-radius: 8px;
                        color: var(--accent-1, #6366f1);
                        cursor: pointer;
                        font-size: 0.85rem;
                        font-weight: 500;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='rgba(99, 102, 241, 0.25)'" onmouseout="this.style.background='rgba(99, 102, 241, 0.15)'">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
});
