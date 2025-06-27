
// Click to earn coins
document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('clicker');
    if (!img) return;
    img.onclick = () => {
        addCoins(1);
    };
});