const viewer = document.getElementById('viewer');
const favorites = getFavorites();
const discovered = getDiscovered();
const favList = favorites.filter(img => images.includes(img) && discovered.includes(img));
favList.forEach((img, idx) => {
  const el = document.createElement('img');
  el.src = `images/${img}`;
  el.className = 'image';
  el.style.cursor = 'pointer';
  el.onclick = () => showFullscreen(`images/${img}`, favList, idx);
  viewer.appendChild(el);
});
