const USERNAME = 'jvisualschool';
const API_BASE = 'https://api.github.com';

const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Shell': '#89e051',
    'Hack': '#878787',
    'PHP': '#4F5D95',
    'SCSS': '#c6538c',
    'Mermaid': '#ff3670'
};

async function fetchUserData() {
    const response = await fetch(`${API_BASE}/users/${USERNAME}`);
    return await response.json();
}

async function fetchRepos() {
    const response = await fetch(`${API_BASE}/users/${USERNAME}/repos?per_page=100&sort=updated`);
    return await response.json();
}

async function fetchEvents() {
    const response = await fetch(`${API_BASE}/users/${USERNAME}/events/public?per_page=100`);
    return await response.json();
}

function renderProfile(user) {
    const joinedDate = new Date(user.created_at);
    const yearsAgo = Math.floor((Date.now() - joinedDate) / (365.25 * 24 * 60 * 60 * 1000));

    return `
        <div class="profile-header">
            <img src="${user.avatar_url}" alt="${user.login}" class="profile-avatar">
            <a href="${user.html_url}" class="profile-name" target="_blank">${user.login}</a>
        </div>
        <div class="profile-info">
            <div class="profile-info-item">
                <svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.471.696l2.5 1a.75.75 0 00.557-1.392L8.5 7.742V4.75z"/></svg>
                Joined GitHub ${yearsAgo} years ago
            </div>
            <div class="profile-info-item">
                <svg viewBox="0 0 16 16"><path d="M2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"/></svg>
                Followed by ${user.followers} users
            </div>
        </div>
    `;
}

function calculateLanguageStats(repos) {
    const langBytes = {};
    repos.forEach(repo => {
        if (repo.language) {
            langBytes[repo.language] = (langBytes[repo.language] || 0) + (repo.size * 1024);
        }
    });

    const total = Object.values(langBytes).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(langBytes)
        .map(([lang, bytes]) => ({
            name: lang,
            bytes: bytes,
            percent: ((bytes / total) * 100).toFixed(2)
        }))
        .sort((a, b) => b.bytes - a.bytes);

    return sorted;
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' kB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function renderLanguages(repos) {
    const languages = calculateLanguageStats(repos);
    const top8 = languages.slice(0, 8);

    const grid = top8.map(lang => `
        <div class="language-item">
            <span class="language-dot" style="background: ${LANGUAGE_COLORS[lang.name] || '#ccc'}"></span>
            <span class="language-name">${lang.name}</span>
            <span class="language-size">${formatBytes(lang.bytes)}</span>
            <span class="language-percent">${lang.percent}%</span>
        </div>
    `).join('');

    return `
        <div class="languages-section">
            <div class="languages-title">📊 ${languages.length} Languages</div>
            <div class="languages-subtitle">Most used languages</div>
            <div class="languages-grid">${grid}</div>
        </div>
    `;
}

function renderStats(user, repos) {
    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
    const totalSize = repos.reduce((sum, r) => sum + r.size, 0);

    return `
        <div class="stats-grid">
            <div class="stats-section">
                <div class="stats-section-title">📘 Activity</div>
                <div class="stat-item">
                    <svg viewBox="0 0 16 16"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>
                    <span class="stat-value">${repos.filter(r => !r.fork).length}</span> Repositories
                </div>
                <div class="stat-item">
                    <svg viewBox="0 0 16 16"><path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/><path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/></svg>
                    <span class="stat-value">0</span> Issues opened
                </div>
                <div class="stat-item">
                    <svg viewBox="0 0 16 16"><path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/><path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/></svg>
                    <span class="stat-value">${formatBytes(totalSize * 1024)}</span> used
                </div>
            </div>
            
            <div class="stats-section">
                <div class="stats-section-title">🏘️ Community stats</div>
                <div class="stat-item">
                    <svg viewBox="0 0 16 16"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>
                    Contributed to <span class="stat-value">${repos.length}</span> repositories
                </div>
                <div class="stat-item">
                    <svg viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"/></svg>
                    <span class="stat-value">${totalStars}</span> Stargazers
                </div>
                <div class="stat-item">
                    <svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/></svg>
                    <span class="stat-value">${totalForks}</span> Forkers
                </div>
            </div>
        </div>
    `;
}

function generateContributionCalendar(events) {
    // Get last 6 months of dates
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    // Count commits per day
    const commitsByDate = {};
    events.forEach(event => {
        if (event.type === 'PushEvent') {
            const date = new Date(event.created_at).toISOString().split('T')[0];
            commitsByDate[date] = (commitsByDate[date] || 0) + (event.payload.commits?.length || 1);
        }
    });

    // Generate calendar data - group by week
    const weeks = [];
    const currentDate = new Date(sixMonthsAgo);
    let currentWeek = [];

    while (currentDate <= today) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = commitsByDate[dateStr] || 0;
        let level = 0;
        if (count > 0) level = 1;
        if (count > 2) level = 2;
        if (count > 5) level = 3;
        if (count > 10) level = 4;

        currentWeek.push({ date: dateStr, count, level });

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    // Create isometric 3D visualization SVG
    const width = 520;
    const height = 180;
    const blockSize = 6;

    // Isometric projection helpers
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);

    const isoX = (x, y) => (x - y) * cos30 * blockSize;
    const isoY = (x, y, z) => (x + y) * sin30 * blockSize - z * blockSize;

    let svgParts = [];
    svgParts.push(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background: #0d1117; border-radius: 6px;">`);

    // Draw blocks from back to front for proper layering
    for (let weekIdx = weeks.length - 1; weekIdx >= 0; weekIdx--) {
        const week = weeks[weekIdx];
        for (let dayIdx = 0; dayIdx < week.length; dayIdx++) {
            const day = week[dayIdx];
            if (day.level === 0) continue;

            const baseX = isoX(weekIdx, dayIdx) + width / 2;
            const baseY = isoY(weekIdx, dayIdx, 0) + height - 40;

            // Draw stack of blocks
            for (let h = 0; h < day.level; h++) {
                const z = h;
                const bx = baseX;
                const by = baseY - z * blockSize;

                const colors = ['#0e4429', '#006d32', '#26a641', '#39d353'];
                const baseColor = colors[Math.min(h, 3)];

                // Simple color adjustment
                const lighten = (col) => {
                    const num = parseInt(col.slice(1), 16);
                    const r = Math.min(255, ((num >> 16) & 0xff) + 40);
                    const g = Math.min(255, ((num >> 8) & 0xff) + 40);
                    const b = Math.min(255, (num & 0xff) + 40);
                    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
                };

                const darken = (col) => {
                    const num = parseInt(col.slice(1), 16);
                    const r = Math.max(0, ((num >> 16) & 0xff) - 20);
                    const g = Math.max(0, ((num >> 8) & 0xff) - 20);
                    const b = Math.max(0, (num & 0xff) - 20);
                    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
                };

                const topColor = lighten(baseColor);
                const sideColor = darken(baseColor);

                const dx = cos30 * blockSize;
                const dy = sin30 * blockSize;

                // Top face
                svgParts.push(`<polygon points="${bx},${by - blockSize} ${bx + dx},${by - dy - blockSize} ${bx},${by - blockSize * 2} ${bx - dx},${by - dy - blockSize}" fill="${topColor}" stroke="#000" stroke-width="0.5" opacity="0.95"/>`);

                // Left face
                svgParts.push(`<polygon points="${bx},${by - blockSize} ${bx - dx},${by - dy - blockSize} ${bx - dx},${by + dy - blockSize} ${bx},${by}" fill="${baseColor}" stroke="#000" stroke-width="0.5" opacity="0.95"/>`);

                // Right face
                svgParts.push(`<polygon points="${bx},${by - blockSize} ${bx + dx},${by - dy - blockSize} ${bx + dx},${by + dy - blockSize} ${bx},${by}" fill="${sideColor}" stroke="#000" stroke-width="0.5" opacity="0.95"/>`);
            }
        }
    }

    svgParts.push('</svg>');

    return `
        <div class="calendar-section">
            <div class="stats-section-title">📅 Contributions calendar</div>
            <div class="calendar-3d">${svgParts.join('')}</div>
        </div>
    `;
}

function calculateCommitStats(events) {
    const pushEvents = events.filter(e => e.type === 'PushEvent');
    const commitsByDate = {};

    pushEvents.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        commitsByDate[date] = (commitsByDate[date] || 0) + (event.payload.commits?.length || 1);
    });

    const dates = Object.keys(commitsByDate).sort();
    const counts = Object.values(commitsByDate);

    // Calculate streak
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        if (commitsByDate[dateStr]) {
            tempStreak++;
            if (i === 0) currentStreak = tempStreak;
        } else {
            if (tempStreak > bestStreak) bestStreak = tempStreak;
            tempStreak = 0;
        }
    }

    const maxInDay = Math.max(...counts, 0);
    const avgPerDay = counts.length > 0 ? (counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(2) : 0;

    return `
        <div class="stats-grid">
            <div class="stats-section">
                <div class="stats-section-title">🔥 Commits streaks</div>
                <div class="stat-item">
                    <svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 01-1.484.211c-.04-.282-.163-.547-.37-.847a8.695 8.695 0 00-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.75.75 0 01-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75zM6 15.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM5.75 12a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z"/></svg>
                    Current streak <span class="stat-value">${currentStreak}</span> day${currentStreak !== 1 ? 's' : ''}
                </div>
                <div class="stat-item">
                    <svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 01-1.484.211c-.04-.282-.163-.547-.37-.847a8.695 8.695 0 00-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.75.75 0 01-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75zM6 15.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM5.75 12a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z"/></svg>
                    Best streak <span class="stat-value">${bestStreak}</span> day${bestStreak !== 1 ? 's' : ''}
                </div>
            </div>
            
            <div class="stats-section">
                <div class="stats-section-title">📈 Commits per day</div>
                <div class="stat-item">
                    <svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.471.696l2.5 1a.75.75 0 00.557-1.392L8.5 7.742V4.75z"/></svg>
                    Highest in a day at <span class="stat-value">${maxInDay}</span>
                </div>
                <div class="stat-item">
                    <svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.471.696l2.5 1a.75.75 0 00.557-1.392L8.5 7.742V4.75z"/></svg>
                    Average per day at <span class="stat-value">${avgPerDay}</span>
                </div>
            </div>
        </div>
    `;
}

function renderRecentRepos(repos) {
    const starred = repos
        .filter(r => r.stargazers_count > 0)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 3);

    if (starred.length === 0) return '';

    const items = starred.map(repo => {
        const updatedDate = new Date(repo.updated_at);
        const daysAgo = Math.floor((Date.now() - updatedDate) / (24 * 60 * 60 * 1000));

        return `
            <div class="repo-item">
                <a href="${repo.html_url}" class="repo-name" target="_blank">
                    ${repo.owner.login}/${repo.name}
                </a>
                ${repo.description ? `<div class="repo-desc">${repo.description}</div>` : ''}
                <div class="repo-stats">
                    ${repo.language ? `<div class="repo-stat"><span class="language-dot" style="background: ${LANGUAGE_COLORS[repo.language] || '#ccc'}"></span>${repo.language}</div>` : ''}
                    <div class="repo-stat">⭐ ${repo.stargazers_count}</div>
                    <div class="repo-stat">🔀 ${repo.forks_count}</div>
                    <div class="repo-stat">starred ${daysAgo} days ago</div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="repos-section">
            <div class="stats-section-title">⭐ Recently starred repositories</div>
            ${items}
        </div>
    `;
}

async function init() {
    const container = document.getElementById('metrics');
    container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading metrics...</div>';

    try {
        const [user, repos, events] = await Promise.all([
            fetchUserData(),
            fetchRepos(),
            fetchEvents()
        ]);

        const html = `
            ${renderProfile(user)}
            ${renderStats(user, repos)}
            ${renderLanguages(repos)}
            ${generateContributionCalendar(events)}
            ${calculateCommitStats(events)}
            ${renderRecentRepos(repos)}
            <div class="metrics-footer">
                Last updated ${new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Seoul'
        })} (timezone Asia/Seoul) with lowlighter/metrics@3.34.0
            </div>
        `;

        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = '<div class="loading">Error loading metrics</div>';
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', init);
