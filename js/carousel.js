// Simple slider with fade effect
function initSlider() {
  const slider = document.getElementById('slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');
  const dotsContainer = slider.querySelector('.slider-dots');

  if (slides.length === 0) return;

  let current = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    
    current = index;
    if (current >= slides.length) current = 0;
    if (current < 0) current = slides.length - 1;
    
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-slide every 5 seconds
  setInterval(() => goTo(current + 1), 5000);
}
