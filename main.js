const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// hero video: retry autoplay (some phones block the attribute alone)
const heroV = document.querySelector('.hero-video'); if (heroV) { heroV.muted = true; heroV.play().catch(() => {}); }

// split the manifesto into words for the scroll scrub
const scrub = document.querySelector('.scrub');
scrub.innerHTML = scrub.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');

// restoration video plays only when visible
const motor = document.querySelector('.resto video');
new IntersectionObserver(([e]) => { e.isIntersecting ? motor.play().catch(() => {}) : motor.pause(); }, { threshold: 0.2 }).observe(motor);

if (!reduce && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); lenis.scrollTo(t); }
    }));
  }

  // the one orchestrated moment: wordmark letters rise in on load
  gsap.from('.wordmark span', { yPercent: 105, duration: 1.2, ease: 'expo.out', stagger: 0.06, delay: 0.2 });
  gsap.from('.hero-line', { opacity: 0, y: 16, duration: 1, delay: 0.7 });

  // hero video drifts slower than the page
  gsap.to('.hero-video', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // manifesto words light up as you read
  gsap.to('.scrub .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 60%', scrub: true } });

  // horizontal garage on desktop
  ScrollTrigger.matchMedia({
    '(min-width: 900px)': () => {
      const track = document.querySelector('.track');
      const dist = () => track.scrollWidth - innerWidth;
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.sale', pin: '.sale-pin', start: 'top top', end: () => '+=' + dist(), scrub: 0.6, invalidateOnRefresh: true } });
      gsap.utils.toArray('.car-img img').forEach((img) => gsap.to(img, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.sale', start: 'top top', end: () => '+=' + dist(), scrub: true } }));
    },
  });
} else {
  document.querySelectorAll('.scrub .w').forEach((w) => (w.style.opacity = 1));
}

// make the wordmark span the full width exactly
const mark = document.querySelector('.wordmark');
const fit = () => {
  mark.style.fontSize = '100px';
  const w = [...mark.children].reduce((s, c) => s + c.getBoundingClientRect().width, 0);
  mark.style.fontSize = (100 * mark.clientWidth / w) * 0.94 + 'px';
  if (window.ScrollTrigger) ScrollTrigger.refresh();
};
document.fonts.ready.then(fit);
addEventListener('resize', fit);

// header gets a solid background once the hero is passed
const hdr = document.querySelector('.hdr');
const onScroll = () => hdr.classList.toggle('solid', scrollY > innerHeight * 0.85);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
