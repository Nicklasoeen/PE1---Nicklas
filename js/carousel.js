function initCarousel(selector) {
	const carousel = document.querySelector(selector);
	if (!carousel) return;

	const track = carousel.querySelector('.carousel-track');
	const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
	const prevBtn = carousel.querySelector('.carousel-btn.prev');
	const nextBtn = carousel.querySelector('.carousel-btn.next');
	const dotsContainer = carousel.querySelector('.carousel-dots');

	if (!track || slides.length === 0) return;

	let currentIndex = 0;

	const update = () => {
		track.style.transform = `translateX(-${currentIndex * 100}%)`;
		if (dotsContainer) {
			dotsContainer.querySelectorAll('button').forEach((dot, idx) => {
				dot.classList.toggle('active', idx === currentIndex);
			});
		}
	};

	if (prevBtn) {
		prevBtn.addEventListener('click', () => {
			currentIndex = (currentIndex - 1 + slides.length) % slides.length;
			update();
		});
	}

	if (nextBtn) {
		nextBtn.addEventListener('click', () => {
			currentIndex = (currentIndex + 1) % slides.length;
			update();
		});
	}

	update();
}
