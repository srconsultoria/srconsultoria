const CONFIG = {
 headerHideThreshold: 120,
 revealThreshold: 0.12,
 fadeDurationMs: 280, 
};
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const debounce = (fn, wait = 100) => {
 let timeout;
 return (...args) => {
 clearTimeout(timeout);
 timeout = setTimeout(() => fn(...args), wait);
 };
};
function initNavMenu(){
 const navMenu = document.getElementById("nav-menu");
 const navToggle = document.getElementById("nav-toggle");
 const navClose = document.getElementById("nav-close");
 if(!navMenu || !navToggle) return;
 const open = () => {
 navMenu.classList.add("show-menu");
 document.body.classList.add("nav-open");
 };
 const close = () => {
 navMenu.classList.remove("show-menu");
 document.body.classList.remove("nav-open");
 };
 navToggle.addEventListener("click", open);
 if(navClose) navClose.addEventListener("click", close);
 navMenu.addEventListener("click",(e)=>{
 const dropItem = e.target.closest(".nav__item--has-dropdown > .nav__link");
 if(dropItem){
 e.preventDefault();
 const li = dropItem.closest(".nav__item--has-dropdown");
 if(li) li.classList.toggle("open");
 return;
 }
 const link = e.target.closest(".nav__link, .nav__dropdown a");
 if(link) close();
 });
 document.addEventListener("keydown",(e)=>{
 if(e.key==="Escape" && navMenu.classList.contains("show-menu")) close();
 });
}
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
  let lastFocusedElement = null;

  if (!lightbox || !lightboxImg) return;

  const open = (src, alt = "") => {
    lastFocusedElement = document.activeElement;

    lightboxImg.src = src;
    lightboxImg.alt = alt || "Imagem ampliada";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeBtn = lightbox.querySelector(".lightbox__close");
    if (closeBtn) closeBtn.focus();
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";

    // 🔥 Remove foco antes de esconder
    if (document.activeElement) {
      document.activeElement.blur();
    }

    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";

    // 🔥 Devolve foco para quem abriu
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".compare__img, .zoomable");
    if (!img) return;
    open(img.src, img.alt);
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      close();
    }
  });
}

function initSimpleCompare() {
 const imgBefore = $("#imgBefore");
 const imgAfter = $("#imgAfter");
 const thumbs = $$(".compare__thumb");
 if (!imgBefore || !imgAfter || !thumbs.length) return;
 const fadeSwap = (imgEl, newSrc) => {
 if (!newSrc) return;
 if (imgEl.getAttribute("src") === newSrc) return;
 imgEl.classList.add("is-fading");
 window.setTimeout(() => {
 imgEl.setAttribute("src", newSrc);
 imgEl.addEventListener(
 "load",
 () => imgEl.classList.remove("is-fading"),
 { once: true }
 );
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
 setActive(thumbs[0]);
}
document.addEventListener("DOMContentLoaded", () => {
 initHeaderHide();
 initNavMenu();
 initScrollReveal();
 initSimpleCompare(); 
 initLightbox();
});
function openWhatsApp(msg){
 const phone = "5518991657604";
 const text = encodeURIComponent(`Olá! Tenho interesse: ${msg}`);
 window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
}
