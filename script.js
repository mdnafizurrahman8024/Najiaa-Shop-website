const state = { cart: [], language: "bn", theme: "system" };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const showcaseProducts = [
  ["🍯", "PURE & RAW", "খাঁটি সুন্দরবনের মধু", "বুনো ফুলের ঘ্রাণে ভরা, ধীরে সংগ্রহ করা মধু।"],
  ["🍂", "NEW HARVEST", "খেজুরের গুড়", "শীতের রস থেকে তৈরি নরম ও সুগন্ধি গুড়।"],
  ["🟤", "HANDCRAFTED", "পাটালি", "ঐতিহ্যবাহী স্বাদে তৈরি ছোট ব্যাচের পাটালি।"],
  ["🍬", "NATURAL SWEET", "আখের চিনি ও গুড়", "কোনো কৃত্রিম রং ছাড়া প্রাকৃতিক মিষ্টতা।"],
  ["🥥", "FRESH PICK", "দেশি নারকেল", "সতেজ, পুষ্টিকর এবং খামার থেকে সরাসরি।"],
  ["🌿", "COLD PRESSED", "সরিষার সোনালি তেল", "কুষ্টিয়ার দানা থেকে ধীরে নিষ্কাশিত তেল।"],
  ["🐉", "SEASONAL", "ড্রাগন ফল", "রঙিন, রসালো ও ভিটামিনে ভরপুর।"],
  ["🥜", "SNACK SMART", "মধু বাদাম", "হালকা মিষ্টি, কুড়মুড়ে এবং শক্তিতে ভরা।"]
];

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
  $$("[data-en]").forEach((item) => { item.innerHTML = item.dataset[language]; });
  $("#email").placeholder = language === "bn" ? "আপনার ইমেইল ঠিকানা" : "Your email address";
  renderCart();
}

function renderCart() {
  const items = $("#cartItems");
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  $("#cartCount").textContent = count;
  $("#cartSubtotal").textContent = `৳ ${subtotal.toLocaleString("en-BD")}`;
  if (!state.cart.length) {
    items.innerHTML = `<div class="empty-cart"><span>⌑</span><p>${state.language === "bn" ? "আপনার কার্টে ভালো কিছু<br />অপেক্ষা করছে।" : "Your cart is waiting<br />for something good."}</p></div>`;
    return;
  }
  items.innerHTML = state.cart.map((item, index) => `<div class="cart-row"><div><strong>${state.language === "bn" ? item.bnName : item.name}</strong><small>৳ ${item.price.toLocaleString("en-BD")} · ${state.language === "bn" ? "পরিমাণ" : "Qty"} ${item.quantity}</small></div><button class="remove-item" data-index="${index}">${state.language === "bn" ? "বাদ দিন" : "Remove"}</button></div>`).join("");
  $$(".remove-item").forEach((button) => button.addEventListener("click", () => { state.cart.splice(Number(button.dataset.index), 1); renderCart(); }));
}

function toggleCart(open) {
  $("#cartDrawer").classList.toggle("open", open);
  $("#drawerOverlay").classList.toggle("open", open);
  $("#cartDrawer").setAttribute("aria-hidden", String(!open));
}

function setTheme(theme) {
  state.theme = theme;
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.body.classList.toggle("dark", dark);
  document.body.classList.toggle("system-theme", theme === "system");
}

let showcaseIndex = 0;
function renderShowcase() {
  const [icon, type, name, description] = showcaseProducts[showcaseIndex];
  $("#showcaseIcon").textContent = icon;
  $("#showcaseType").textContent = type;
  $("#showcaseName").textContent = state.language === "bn" ? name : ["Pure Sundarban Honey", "Date Palm Jaggery", "Patali Jaggery", "Sugarcane Sugar & Gur", "Fresh Coconut", "Cold-pressed Mustard Oil", "Dragon Fruit", "Honey Nuts"][showcaseIndex];
  $("#showcaseDescription").textContent = state.language === "bn" ? description : ["Wildflower honey, slowly collected and full of character.", "Soft and aromatic jaggery made from winter date sap.", "Small-batch patali made with a traditional recipe.", "Natural sweetness with no artificial colours.", "Fresh, nourishing and sourced straight from the farm.", "Slowly pressed from Kushtia mustard seeds.", "Colourful, juicy and rich in vitamins.", "Lightly sweet, crunchy and full of energy."][showcaseIndex];
  $("#showcaseCount").textContent = `${String(showcaseIndex + 1).padStart(2, "0")} / 08`;
  $("#showcaseDots").innerHTML = showcaseProducts.map((_, index) => `<i class="${index === showcaseIndex ? "active" : ""}"></i>`).join("");
  $("#showcaseCard").classList.remove("showcase-card-refresh");
  void $("#showcaseCard").offsetWidth;
  $("#showcaseCard").classList.add("showcase-card-refresh");
}

$$(".add-button").forEach((button) => button.addEventListener("click", () => {
  const existing = state.cart.find((item) => item.name === button.dataset.product);
  if (existing) existing.quantity += 1;
  else state.cart.push({ name: button.dataset.product, bnName: button.dataset.bnProduct, price: Number(button.dataset.price), quantity: 1 });
  renderCart();
  showToast(state.language === "bn" ? "পণ্যটি কার্টে যোগ হয়েছে" : "Added to your cart");
}));

$("#cartToggle").addEventListener("click", () => toggleCart(true));
$("#closeCart").addEventListener("click", () => toggleCart(false));
$("#drawerOverlay").addEventListener("click", () => toggleCart(false));
$("#checkoutBtn").addEventListener("click", () => {
  if (!state.cart.length) { showToast(state.language === "bn" ? "চেকআউটের আগে কার্টে পণ্য যোগ করুন" : "Add something to your cart first"); return; }
  showToast(state.language === "bn" ? "COD, বিকাশ ও নগদ চেকআউট শীঘ্রই আসছে" : "COD, bKash and Nagad checkout is coming next");
});
$("#langToggle").addEventListener("click", () => setLanguage(state.language === "en" ? "bn" : "en"));
$("#themeSelect").addEventListener("change", (event) => setTheme(event.target.value));
function toggleProfileMenu(open) {
  $("#profileMenu").classList.toggle("open", open);
  $("#profileMenu").setAttribute("aria-hidden", String(!open));
  $("#accountBtn").setAttribute("aria-expanded", String(open));
}
$("#accountBtn").addEventListener("click", (event) => {
  event.stopPropagation();
  toggleProfileMenu(!$("#profileMenu").classList.contains("open"));
});
$("#profileMenu").addEventListener("click", () => toggleProfileMenu(false));
document.addEventListener("click", (event) => {
  if (!event.target.closest(".profile-wrap")) toggleProfileMenu(false);
});
$("#logoutBtn").addEventListener("click", () => showToast(state.language === "bn" ? "আপনি লগআউট করেছেন" : "You have been logged out"));
$("#loginBtn").addEventListener("click", () => showToast(state.language === "bn" ? "নিরাপদ লগইন শীঘ্রই আসছে" : "Secure sign-in is coming next"));
$("#mobileMenu").addEventListener("click", () => document.querySelector(".nav-links").classList.toggle("mobile-open"));
$("#newsletterForm").addEventListener("submit", (event) => { event.preventDefault(); showToast(state.language === "bn" ? "স্বাগতম — আপনার ইনবক্সে দেখা হবে" : "Welcome — see you in your inbox"); event.target.reset(); });

let touchStartX = 0;
$("#cartDrawer").addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
$("#cartDrawer").addEventListener("touchend", (event) => { if (event.changedTouches[0].screenX - touchStartX > 80) toggleCart(false); }, { passive: true });
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (state.theme === "system") setTheme("system"); });

setLanguage("bn");
setTheme("system");
renderShowcase();
window.setInterval(() => { showcaseIndex = (showcaseIndex + 1) % showcaseProducts.length; renderShowcase(); }, 4200);
