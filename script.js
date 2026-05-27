// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const photoCards = document.querySelectorAll('.photo-card');

// Click on photo to open lightbox
photoCards.forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img');
        lightboxImg.src = img.src;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Close lightbox
document.querySelector('.close').addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Create floating hearts in background
function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = ['❤', '💕', '💗', '💖', '💓'][Math.floor(Math.random() * 5)];
    heart.style.cssText = `
        position: fixed;
        font-size: ${Math.random() * 20 + 10}px;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        color: rgba(194, 24, 91, ${Math.random() * 0.3 + 0.1});
        pointer-events: none;
        z-index: -1;
        animation: float-up ${Math.random() * 10 + 10}s linear forwards;
    `;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 20000);
}

// Add floating animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes float-up {
        to {
            transform: translateY(-110vh) rotate(${Math.random() * 720}deg);
        }
    }
`;
document.head.appendChild(style);

// Create hearts periodically
setInterval(createHeart, 2000);

// Initial hearts
for (let i = 0; i < 5; i++) {
    setTimeout(createHeart, i * 400);
}