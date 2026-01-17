function generateIsometricCalendarSVG(events) {
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

    // Generate calendar data
    const days = [];
    const currentDate = new Date(sixMonthsAgo);

    while (currentDate <= today) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = commitsByDate[dateStr] || 0;
        let level = 0;
        if (count > 0) level = 1;
        if (count > 2) level = 2;
        if (count > 5) level = 3;
        if (count > 10) level = 4;

        days.push({ date: dateStr, count, level });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create isometric 3D visualization
    const width = 600;
    const height = 300;
    const blockSize = 12;
    const spacing = 2;

    // Isometric projection parameters
    const isoX = (x, y) => (x - y) * Math.cos(Math.PI / 6) * blockSize;
    const isoY = (x, y, z) => (x + y) * Math.sin(Math.PI / 6) * blockSize - z * blockSize;

    let svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background: #0d1117;">`;

    // Group days by week
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    // Draw blocks
    weeks.forEach((week, weekIdx) => {
        week.forEach((day, dayIdx) => {
            if (day.level === 0) return;

            const x = weekIdx;
            const y = dayIdx;
            const z = day.level;

            const baseX = isoX(x, y) + 50;
            const baseY = isoY(x, y, 0) + 200;

            // Draw stack of blocks
            for (let h = 0; h < z; h++) {
                const blockY = baseY - h * blockSize;

                // Color based on level
                const colors = ['#0e4429', '#006d32', '#26a641', '#39d353'];
                const color = colors[Math.min(h, 3)];
                const topColor = adjustBrightness(color, 20);
                const sideColor = adjustBrightness(color, -20);

                // Top face
                svgContent += `<polygon points="${baseX},${blockY} ${baseX + blockSize * Math.cos(Math.PI / 6)},${blockY - blockSize * Math.sin(Math.PI / 6)} ${baseX},${blockY - blockSize} ${baseX - blockSize * Math.cos(Math.PI / 6)},${blockY - blockSize * Math.sin(Math.PI / 6)}" fill="${topColor}" stroke="#000" stroke-width="0.5"/>`;

                // Left face
                svgContent += `<polygon points="${baseX},${blockY} ${baseX - blockSize * Math.cos(Math.PI / 6)},${blockY - blockSize * Math.sin(Math.PI / 6)} ${baseX - blockSize * Math.cos(Math.PI / 6)},${blockY + blockSize * Math.sin(Math.PI / 6)} ${baseX},${blockY + blockSize}" fill="${color}" stroke="#000" stroke-width="0.5"/>`;

                // Right face
                svgContent += `<polygon points="${baseX},${blockY} ${baseX + blockSize * Math.cos(Math.PI / 6)},${blockY - blockSize * Math.sin(Math.PI / 6)} ${baseX + blockSize * Math.cos(Math.PI / 6)},${blockY + blockSize * Math.sin(Math.PI / 6)} ${baseX},${blockY + blockSize}" fill="${sideColor}" stroke="#000" stroke-width="0.5"/>`;
            }
        });
    });

    svgContent += '</svg>';
    return svgContent;
}

function adjustBrightness(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

function generateContributionCalendar(events) {
    const svgContent = generateIsometricCalendarSVG(events);

    return `
        <div class="calendar-section">
            <div class="stats-section-title">📅 Contributions calendar</div>
            <div class="calendar-3d">${svgContent}</div>
        </div>
    `;
}
