document.addEventListener("DOMContentLoaded", async () => {
    const config = window.PORTFOLIO_CONFIG;
    if (!config) return;

    try {
        // Fetch User Data
        const userRes = await fetch(`https://api.github.com/users/${config.githubUsername}`);
        const userData = await userRes.json();

        // Fetch Repos
        const reposRes = await fetch(`https://api.github.com/users/${config.githubUsername}/repos?per_page=100`);
        const reposData = await reposRes.json();

        // 1. Update Location
        const locationEl = document.querySelector('[data-location]');
        if (locationEl) {
            locationEl.textContent = config.location || userData.location || 'Not Specified';
        }

        // 2. Update Semester
        const semesterEl = document.querySelector('[data-about="semester"]');
        if (semesterEl) {
            let semSuffix = 'th';
            if (config.currentSemester === 1) semSuffix = 'st';
            else if (config.currentSemester === 2) semSuffix = 'nd';
            else if (config.currentSemester === 3) semSuffix = 'rd';
            semesterEl.textContent = `${config.currentSemester}${semSuffix} semester`;
        }

        // 3. Update Stats
        const repoStat = document.querySelector('[data-stat="repos"]');
        if (repoStat) {
            repoStat.setAttribute('data-target', userData.public_repos || reposData.length);
            repoStat.textContent = userData.public_repos || reposData.length;
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
        const projectsContainer = document.querySelector('[data-projects-container]');
        if (projectsContainer) {
            projectsContainer.innerHTML = '';
            
            // Filter and sort to match pinnedRepos order
            const filteredRepos = [];
            config.pinnedRepos.forEach(repoName => {
                const repo = reposData.find(r => r.name === repoName);
                if (repo) filteredRepos.push(repo);
            });

            filteredRepos.forEach((repo, index) => {
                const card = document.createElement('div');
                card.className = 'project-card glass-card reveal-up';
                card.style.setProperty('--delay', `${index * 0.1}s`);

                card.innerHTML = `
                    <div class="project-header">
                        <div class="project-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View ${repo.name} on GitHub">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                    </div>
                    <h3 class="project-title">${repo.name.replace(/-/g, ' ')}</h3>
                    <p class="project-desc">${repo.description || 'No description provided.'}</p>
                    <div class="project-tags">
                        ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                        <span class="tag">⭐ ${repo.stargazers_count}</span>
                    </div>
                `;
                projectsContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Error syncing with GitHub:", error);
    }
});
