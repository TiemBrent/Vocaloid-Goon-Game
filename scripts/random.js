// Random image script without favorite support
document.addEventListener('DOMContentLoaded', () => {
    const imageEl = document.getElementById('randomImage');
    const btn = document.getElementById('showRandom');

    btn.onclick = () => {
        if (!spendCoins(50)) return;
        const n = Math.floor(Math.random() * images.length);
        const imgName = images[n];
        imageEl.src = `images/${imgName}`;
        imageEl.style.display = 'block';

        // Save discovered and move to top
        let discovered = JSON.parse(localStorage.getItem('discovered') || '[]');
        discovered = discovered.filter(x => x !== imgName); // Remove if already present
        discovered.unshift(imgName); // Add to top
        localStorage.setItem('discovered', JSON.stringify(discovered));

        // Update discovered viewer if present
        if (window.updateDiscoveredViewer) updateDiscoveredViewer();
    };
});
