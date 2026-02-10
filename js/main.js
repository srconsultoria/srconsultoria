/* ===================== main.js ===================== */

/* ---------- Configuration ---------- */
const CONFIG = {
  headerHideThreshold: 120,
  revealThreshold: 0.12,
  fadeDurationMs: 280, // deve bater com o CSS (.28s)
};

/* ---------- DOM Utilities ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ---------- Debounce ---------- */
const debounce = (fn, wait = 100) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

/* ---------- Header Auto-hide ---------- */
function initHeaderHide() {
  const header = $(".header");
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener(
    "scroll",
    debounce(() => {
      const currentScroll = window.scrollY;

      header.classList.toggle("scrolled", currentScroll > 30);

      if (currentScroll > lastScroll && currentScroll > CONFIG.headerHideThreshold) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }

      lastScroll = currentScroll;
    }, 50)
  );
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const elements = $$(".services__card, .plan__card, .before-after-wrapper, .hero__data, .compare");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: CONFIG.revealThreshold }
  );

  elements.forEach((el) => observer.observe(el));
}
  function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");

  if (!lightbox || !lightboxImg) return;

  const open = (src, alt = "") => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Imagem ampliada";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  };

  // Delegação: qualquer imagem do compare abre (antes/depois e futuras)
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".compare__img, .zoomable");
    if (!img) return;
    open(img.src, img.alt);
  });

  // fechar clicando no backdrop ou no X
  lightbox.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) close();
  });

  // fechar com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
  });
}


/* ---------- Compare simples (ANTES | DEPOIS) ---------- */
function initSimpleCompare() {
  const imgBefore = $("#imgBefore");
  const imgAfter = $("#imgAfter");
  const thumbs = $$(".compare__thumb");
  
  // Se a seção não existir, não faz nada
  if (!imgBefore || !imgAfter || !thumbs.length) return;

  const fadeSwap = (imgEl, newSrc) => {
    if (!newSrc) return;

    // evita re-fade se já estiver na mesma imagem
    if (imgEl.getAttribute("src") === newSrc) return;

    imgEl.classList.add("is-fading");
    window.setTimeout(() => {
      imgEl.setAttribute("src", newSrc);
      // garante que o fade-in funcione depois do load também
      imgEl.addEventListener(
        "load",
        () => imgEl.classList.remove("is-fading"),
        { once: true }
      );
      // fallback (caso load não dispare por cache)
      window.setTimeout(() => imgEl.classList.remove("is-fading"), CONFIG.fadeDurationMs + 50);
    }, 80);
  };

  const setActive = (btn) => {
    thumbs.forEach((t) => t.classList.remove("is-active"));
    btn.classList.add("is-active");
  };

  thumbs.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActive(btn);
      fadeSwap(imgBefore, btn.dataset.before);
      fadeSwap(imgAfter, btn.dataset.after);
    });
  });

  // estado inicial (marca o primeiro como ativo)
  setActive(thumbs[0]);
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initHeaderHide();
  initScrollReveal();
  initSimpleCompare();	
  initLightbox();
});

/* ---------- WhatsApp (botões do plano) ---------- */
function openWhatsApp(msg) {
  const phone = "5518991657604";
  const text = encodeURIComponent(`Olá! Tenho interesse: ${msg}`);
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
}
