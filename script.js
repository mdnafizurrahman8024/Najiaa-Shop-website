const state = { cart: [], language: "en" };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setLanguage(language) {
  state.language = language;
  document.documentElement.lang = language;
  $$(".lang-switch span").forEach((item, index) => item.classList.toggle("lang-active", (language === "en" && index === 0) || (language === "bn" && index === 1)));
  $$("[data-en]").forEach((item) => {
    item.innerHTML = item.dataset[language];
  });
  $("#email").placeholder = language === "bn" ? "আপনার ইমেইল ঠিকানা" : "Your email address";
}

function renderCart() {
  const items = $("#cartItems");
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  $("#cartCount").textContent = count;
  $("#cartSubtotal").textContent = `৳ ${subtotal.toLocaleString("en-BD")}`;
  if (!state.cart.length) {
    items.innerHTML = `<div class="empty-cart"><span>⌑</span><p>${state.language === "bn" ? "আপনার ব্যাগে ভালো কিছু<br />অপেক্ষা করছে।" : "Your bag is waiting<br />for something good."}</p></div>`;
    return;
  }
  items.innerHTML = state.cart.map((item, index) => `<div class="cart-row"><div><strong>${item.name}</strong><small>৳ ${item.price.toLocaleString("en-BD")} · Qty ${item.quantity}</small></div><button class="remove-item" data-index="${index}">Remove</button></div>`).join("");
  $$(".remove-item").forEach((button) => button.addEventListener("click", () => {
    state.cart.splice(Number(button.dataset.index), 1);
    renderCart();
  }));
}

function toggleCart(open) {
  $("#cartDrawer").classList.toggle("open", open);
  $("#drawerOverlay").classList.toggle("open", open);
  $("#cartDrawer").setAttribute("aria-hidden", String(!open));
}

$$(".add-button").forEach((button) => button.addEventListener("click", () => {
  const existing = state.cart.find((item) => item.name === button.dataset.product);
  if (existing) existing.quantity += 1;
  else state.cart.push({ name: button.dataset.product, price: Number(button.dataset.price), quantity: 1 });
  renderCart();
  showToast(state.language === "bn" ? "পণ্যটি ব্যাগে যোগ হয়েছে" : "Added to your bag");
}));

$("#cartToggle").addEventListener("click", () => toggleCart(true));
$("#closeCart").addEventListener("click", () => toggleCart(false));
$("#drawerOverlay").addEventListener("click", () => toggleCart(false));
$("#checkoutBtn").addEventListener("click", () => {
  if (!state.cart.length) {
    showToast(state.language === "bn" ? "চেকআউটের আগে ব্যাগে পণ্য যোগ করুন" : "Add something to your bag first");
    return;
  }
  showToast(state.language === "bn" ? "নিরাপদ চেকআউট শীঘ্রই আসছে" : "Secure checkout is coming next");
});
$("#langToggle").addEventListener("click", () => setLanguage(state.language === "en" ? "bn" : "en"));
$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  $("#themeToggle").textContent = document.body.classList.contains("dark") ? "☾" : "☼";
});
$("#accountBtn").addEventListener("click", () => showToast(state.language === "bn" ? "অ্যাকাউন্ট সাইন-ইন শীঘ্রই আসছে" : "Account sign-in is coming next"));
$("#mobileMenu").addEventListener("click", () => document.querySelector(".nav-links").classList.toggle("mobile-open"));
$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast(state.language === "bn" ? "স্বাগতম — আপনার ইনবক্সে দেখা হবে" : "Welcome — see you in your inbox");
  event.target.reset();
});
setLanguage("en");
renderCart();
