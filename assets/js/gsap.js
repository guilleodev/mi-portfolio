document.addEventListener("DOMContentLoaded", () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const run = (selector, vars, st = {}) => {
        gsap.utils.toArray(selector).forEach((el) => {
            const delayAttr = el.getAttribute("data-delay");
            const delay = delayAttr ? parseInt(delayAttr, 10) / 1000 : 0;

            gsap.from(el, {
                ...vars,
                delay,
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true,
                    ...st,
                },
            });
        });
    };

    // 1) Fade up
    run('[data-anim="fade-up"]', { opacity: 0, y: 24, duration: 0.8, ease: "power2.out" });

    // 2) Fade left/right
    run('[data-anim="fade-left"]', { opacity: 0, x: -28, duration: 0.8, ease: "power2.out" });
    run('[data-anim="fade-right"]', { opacity: 0, x: 28, duration: 0.8, ease: "power2.out" });

    // 3) Zoom in
    run('[data-anim="zoom-in"]', { opacity: 0, scale: 0.96, duration: 0.8, ease: "power2.out" });

    // 4) Stagger: anima hijos directos del contenedor
    gsap.utils.toArray('[data-anim="stagger"]').forEach((wrap) => {
        const children = Array.from(wrap.children).filter((n) => n.nodeType === 1);
        if (!children.length) return;

        gsap.from(children, {
            opacity: 0,
            y: 18,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
                trigger: wrap,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
            },
        });
    });

    // 5) Parallax suave
    gsap.utils.toArray('[data-anim="parallax"]').forEach((el) => {
        gsap.to(el, {
            y: -40,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });
    });

    // =========================
    // Fix: enlaces con #ancla al cargar (index.html#Proyectos)
    // =========================
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            ScrollTrigger.refresh(true);
            setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 80);
        }
    }

});
