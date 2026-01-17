const GITHUB_USERNAME = 'jvisualschool';
const GITHUB_API = 'https://api.github.com';

// Language colors (GitHub standard)
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Python': '#3572A5',
    'Java': '#b07219',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Ruby': '#701516'
};

// Fetch user data
async function fetchUserData() {
    try {
        const response = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`);
        const data = await response.json();

        document.getElementById('totalRepos').textContent = data.public_repos;
        document.getElementById('followers').textContent = data.followers;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Fetch repositories and calculate stats
async function fetchRepos() {
    try {
        const response = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        const repos = await response.json();

        // Calculate total stars and forks
        let totalStars = 0;
        let totalForks = 0;
        let languages = {};

        repos.forEach(repo => {
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;

            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });

        document.getElementById('totalStars').textContent = totalStars;
        document.getElementById('totalForks').textContent = totalForks;

        // Display language stats
        displayLanguageStats(languages);

        // Display top projects
        displayProjects(repos.slice(0, 6));

        return repos;
    } catch (error) {
        console.error('Error fetching repos:', error);
    }
}

// Display language statistics
function displayLanguageStats(languages) {
    const container = document.getElementById('languageStats');
    const sortedLangs = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const total = sortedLangs.reduce((sum, [, count]) => sum + count, 0);

    container.innerHTML = sortedLangs.map(([lang, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        const color = LANGUAGE_COLORS[lang] || '#8b949e';

        return `
            <div class="language-item">
                <div class="language-header">
                    <span class="language-name">
                        <span class="lang-dot" style="background: ${color};"></span>
                        ${lang}
                    </span>
                    <span class="language-percent">${percentage}%</span>
                </div>
                <div class="language-bar">
                    <div class="language-bar-fill" style="width: ${percentage}%; background: ${color};"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Display projects
function displayProjects(repos) {
    const container = document.getElementById('projectsGrid');

    container.innerHTML = repos.map(repo => {
        const color = LANGUAGE_COLORS[repo.language] || '#8b949e';

        return `
            <article class="project-card">
                <div class="project-title">${repo.name}</div>
                <p class="project-desc">${repo.description || 'No description available'}</p>
                <div class="project-meta">
                    <div class="lang-tag">
                        <span class="lang-dot" style="background: ${color};"></span>
                        ${repo.language || 'Unknown'}
                    </div>
                    <a href="${repo.html_url}" class="project-link" target="_blank">
                        View Code <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }).join('');
}

// Fetch recent activity
async function fetchRecentActivity() {
    try {
        const response = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/events/public?per_page=10`);
        const events = await response.json();

        const container = document.getElementById('recentActivity');

        const activityHTML = events.slice(0, 5).map(event => {
            const date = new Date(event.created_at);
            const timeAgo = getTimeAgo(date);

            let action = '';
            let icon = 'fa-circle';

            switch (event.type) {
                case 'PushEvent':
                    action = `Pushed to ${event.repo.name}`;
                    icon = 'fa-code-commit';
                    break;
                case 'CreateEvent':
                    action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
                    icon = 'fa-plus';
                    break;
                case 'WatchEvent':
                    action = `Starred ${event.repo.name}`;
                    icon = 'fa-star';
                    break;
                case 'ForkEvent':
                    action = `Forked ${event.repo.name}`;
                    icon = 'fa-code-fork';
                    break;
                default:
                    action = `${event.type.replace('Event', '')} on ${event.repo.name}`;
            }

            return `
                <div class="activity-item">
                    <i class="fas ${icon} activity-icon"></i>
                    <div class="activity-content">
                        <div class="activity-text">${action}</div>
                        <div class="activity-time">${timeAgo}</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = activityHTML;
    } catch (error) {
        console.error('Error fetching activity:', error);
        document.getElementById('recentActivity').innerHTML = '<p>Unable to load activity</p>';
    }
}

// Helper function to get time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();
    fetchRepos();
    fetchRecentActivity();
});
