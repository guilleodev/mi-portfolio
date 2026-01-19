document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js");

  /* =========================
     Año footer
  ========================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================
     Parallax 3D
  ========================== */
  const header3d = document.querySelector("header");
  const stage3d = document.getElementById("heroStage");
  const bg3d = document.getElementById("heroBg");

  if (header3d && stage3d && bg3d) {
    header3d.addEventListener("mousemove", (e) => {
      const r = header3d.getBoundingClientRect();

      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      // STAGE (persona + logos)
      const rotateY = x * 10;
      const rotateX = -y * 8;
      const moveX = x * 18;
      const moveY = y * 10;

      stage3d.style.transform =
        `translate(${moveX}px, ${moveY}px) translateZ(90px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

      // FONDO (inverso y suave)
      const bgMoveX = x * -10;
      const bgMoveY = y * -6;

      bg3d.style.transform =
        `translate(${bgMoveX}px, ${bgMoveY}px) translateZ(-40px) scale(1.08)`;
    });

    header3d.addEventListener("mouseleave", () => {
      stage3d.style.transform = "translateZ(90px)";
      bg3d.style.transform = "translateZ(-40px) scale(1.08)";
    });
  }

  /* =========================
     Menú hamburguesa
  ========================== */
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  const menuIcon = document.getElementById("menuIcon");
  const closeIcon = document.getElementById("closeIcon");

  if (btn && menu && menuIcon && closeIcon) {
    const openMenu = () => {
      menu.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      menuIcon.classList.add("hidden");
      closeIcon.classList.remove("hidden");
    };

    const closeMenu = () => {
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      closeIcon.classList.add("hidden");
      menuIcon.classList.remove("hidden");
    };

    const toggleMenu = () => {
      menu.classList.contains("hidden") ? openMenu() : closeMenu();
    };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Cerrar al clicar fuera
    document.addEventListener("click", (e) => {
      if (menu.classList.contains("hidden")) return;
      if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
    });

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Cerrar al clicar un enlace
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    // Si se pasa a desktop, cierra el menú
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeMenu();
    });
  }

  /* =========================
     Ajuste del vídeo
  ========================== */
  const video = document.getElementById("heroBg");
  if (video) video.playbackRate = 0.7;

  /* =========================
     Animación logos
  ========================== */
  document.querySelectorAll(".hero-hand").forEach((hand) => {
    hand.addEventListener("click", (e) => {
      e.preventDefault();

      hand.classList.remove("hero-spin");
      void hand.offsetWidth; // reflow
      hand.classList.add("hero-spin");

      const href = hand.getAttribute("href");
      if (href && href !== "#") {
        setTimeout(() => {
          window.location.href = href;
        }, 700);
      }
    });
  });

  /* =========================
     Cursor
  ========================== */
  const cursor = document.querySelector(".cursor-glass");

  if (cursor) {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      cursor.style.display = "none";
    } else {
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let tx = x;
      let ty = y;

      const anchorOffset = 2; // ajusta 1–3 si quieres

      document.addEventListener("mousemove", (e) => {
        tx = e.clientX;
        ty = e.clientY;
      });

      const loop = () => {
        x += (tx - x) * 0.18;
        y += (ty - y) * 0.18;
        cursor.style.left = (x + anchorOffset) + "px";
        cursor.style.top = (y + anchorOffset) + "px";
        requestAnimationFrame(loop);
      };
      loop();

      // Detectar pointer
      const hoverables = "a, button, [role='button'], [data-cursor='pointer']";
      document.querySelectorAll(hoverables).forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("is-pointer"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("is-pointer"));
      });

      // Click feedback
      document.addEventListener("mousedown", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(0.92)";
      });
      document.addEventListener("mouseup", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
      });

      /* =========================
         Subir
      ========================== */
      const scrollBtn = document.getElementById("scrollTopBtn");

      window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
          scrollBtn.classList.remove("hidden");
        } else {
          scrollBtn.classList.add("hidden");
        }
      });

      scrollBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }

  /* Efectos scroll - Reveal */

  const items = document.querySelectorAll(".reveal[data-reveal]");

  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        io.unobserve(entry.target); // solo una vez
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  items.forEach((el) => {
    // Delay opcional por atributo: data-delay="120"
    const d = el.getAttribute("data-delay");
    if (d) el.style.transitionDelay = `${parseInt(d, 10)}ms`;

    io.observe(el);
  });

  (() => {
    const items = Array.from(document.querySelectorAll("[data-lightbox]"));
    if (!items.length) return;

    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lbImg");
    const lbCaption = document.getElementById("lbCaption");
    const btnClose = document.getElementById("lbClose");
    const btnPrev = document.getElementById("lbPrev");
    const btnNext = document.getElementById("lbNext");

    let index = 0;
    let lastFocus = null;

    const open = (i) => {
      index = i;
      const el = items[index];
      const full = el.getAttribute("data-full");
      const alt = el.getAttribute("data-alt") || el.querySelector("img")?.alt || "Imagen";

      lastFocus = document.activeElement;

      lbImg.src = full;
      lbImg.alt = alt;
      lbCaption.textContent = alt;

      lb.classList.remove("hidden");
      lb.classList.add("flex");
      lb.setAttribute("aria-hidden", "false");

      // Bloquear scroll body
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      // Foco al botón cerrar
      btnClose.focus();
    };

    const close = () => {
      lb.classList.add("hidden");
      lb.classList.remove("flex");
      lb.setAttribute("aria-hidden", "true");

      lbImg.src = "";
      lbImg.alt = "";
      lbCaption.textContent = "";

      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";

      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    };

    const prev = () => open((index - 1 + items.length) % items.length);
    const next = () => open((index + 1) % items.length);

    items.forEach((btn, i) => {
      btn.addEventListener("click", () => open(i));
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(i);
        }
      });
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", prev);
    btnNext.addEventListener("click", next);


    // Teclado
    document.addEventListener("keydown", (e) => {
      if (lb.classList.contains("hidden")) return;

      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });
  })();

});

