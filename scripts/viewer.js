// Viewer script to display all images in a grid with fullscreen support
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('viewer');

    function showFullscreen(imgSrc) {
        // Remove any existing overlay
        const old = document.getElementById('fullscreenOverlay');
        if (old) old.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.id = 'fullscreenOverlay';

        // Create image
        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = 'fullscreen-img';

        // Close on overlay click (not image)
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };

        overlay.appendChild(img);
        document.body.appendChild(overlay);
    }

    images.forEach(imgName => {
        const containerDiv = document.createElement('div');
        containerDiv.className = 'image-container';
        const img = document.createElement('img');
        img.src = `images/${imgName}`;
        img.className = 'image';
        img.style.cursor = 'pointer';
        img.onclick = () => showFullscreen(`images/${imgName}`);
        containerDiv.appendChild(img);
        container.appendChild(containerDiv);
    });
});
