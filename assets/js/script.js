document.addEventListener("DOMContentLoaded", () => {

  console.log("gsap:", typeof window.gsap !== "undefined");
  console.log("ScrollTrigger:", typeof window.ScrollTrigger !== "undefined");


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
  if (video) video.playbackRate = 0.9;

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

      if (scrollBtn) {
        window.addEventListener("scroll", () => {
          if (window.scrollY > 400) scrollBtn.classList.remove("hidden");
          else scrollBtn.classList.add("hidden");
        });

        scrollBtn.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }

      scrollBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }

  /* =========================
   Fix: hash en carga (/#Proyectos)
   ========================== */
  const jumpToHash = () => {
    const hash = window.location.hash;
    if (!hash) return;

    const target = document.querySelector(hash);
    if (!target) return;

    target.scrollIntoView({ behavior: "auto", block: "start" });
  };

  window.addEventListener("load", () => {
    if (window.ScrollTrigger) {
      try { window.ScrollTrigger.refresh(true); } catch (e) { }
    }

    setTimeout(jumpToHash, 120);
  });

  window.addEventListener("hashchange", () => {
    setTimeout(jumpToHash, 60);
  });

  /* =========================
   Galerías + Lightbox (multi)
========================== */

  // Lightbox único (global)
  const lightbox = document.querySelector("[data-lightbox]");
  const lbImg = document.querySelector("[data-lightbox-img]");
  const closeBtns = document.querySelectorAll("[data-lightbox-close]");

  const openLightboxWith = (src, alt) => {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || "Imagen ampliada";
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
    document.documentElement.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox || !lbImg) return;
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    lbImg.src = "";
    document.documentElement.style.overflow = "";
  };

  closeBtns.forEach((b) => b.addEventListener("click", closeLightbox));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // Inicializar CADA galería
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const mainImg = gallery.querySelector("[data-gallery-main]");
    const thumbsWrap = gallery.querySelector("[data-gallery-thumbs]");
    const thumbBtns = gallery.querySelectorAll("[data-gallery-thumb]");
    const openBtn = gallery.querySelector("[data-lightbox-open]");

    if (!mainImg || !thumbsWrap || !thumbBtns.length) return;

    const setActiveThumb = (btn) => {
      thumbBtns.forEach((b) => {
        b.classList.remove("ring-2", "ring-cyan-300", "ring-offset-2", "ring-offset-black");
        b.removeAttribute("data-active");
      });
      btn.classList.add("ring-2", "ring-cyan-300", "ring-offset-2", "ring-offset-black");
      btn.setAttribute("data-active", "true");
    };

    const initial =
      [...thumbBtns].find((b) => b.getAttribute("data-active") === "true") || thumbBtns[0];

    setActiveThumb(initial);

    // Cambiar imagen al clicar miniatura
    thumbsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-gallery-thumb]");
      if (!btn) return;

      const src = btn.getAttribute("data-src");
      const alt = btn.getAttribute("data-alt") || "Imagen de galería";
      if (!src) return;

      mainImg.src = src;
      mainImg.alt = alt;
      setActiveThumb(btn);
    });

    // Abrir lightbox de ESTA galería
    if (openBtn) {
      openBtn.addEventListener("click", () => {
        openLightboxWith(mainImg.src, mainImg.alt);
      });
    }
  });



});

