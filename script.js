// ============================
// STORAGE
// ============================

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ============================
// TOAST
// ============================

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

// ============================
// CART COUNT (FIXED)
// ============================

function updateCartCount() {
  let cart = getCart();
  let count = cart.length;   // FIXED (not qty sum)

  let badge = document.getElementById("cart-count");
  if (badge) {
    badge.innerText = count;
  }
}

// ============================
// ADD TO CART
// ============================

function addToCart(product) {
  let cart = getCart();

  let existing = cart.findIndex(item => item.name === product.name);

  if (existing !== -1) {
    cart[existing].qty += product.qty;
  } else {
    cart.push(product);
  }

  saveCart(cart);
  updateCartCount();   // FIXED
  showToast("Added to Cart ✓");
}

// ============================
// QUANTITY CONTROLS
// ============================

function increase(input) {
  let val = parseFloat(input.value) || 0.5;
  input.value = (val + 0.5).toFixed(1);
}

function decrease(input) {
  let val = parseFloat(input.value) || 0.5;

  if (val > 0.5) {
    input.value = (val - 0.5).toFixed(1);
  }
}

// ============================
// MAIN INIT (MERGED)
// ============================

document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // HOME PAGE SETUP
  // ============================

  document.querySelectorAll(".card").forEach(card => {

    const name = card.querySelector("h3").innerText;
    const local = card.querySelector(".local").innerText;
    const priceText = card.querySelector(".price").innerText;
    const price = parseInt(priceText.replace(/[^\d]/g, ""));

    const input = card.querySelector("input");

    const minusBtn = card.querySelector(".minus");
    const plusBtn = card.querySelector(".plus");
    const addBtn = card.querySelector(".add-btn");

    if (minusBtn) minusBtn.addEventListener("click", () => decrease(input));
    if (plusBtn) plusBtn.addEventListener("click", () => increase(input));

    if (addBtn) {
      addBtn.addEventListener("click", () => {

        let qty = parseFloat(input.value);

        if (isNaN(qty) || qty < 0.5) {
          showToast("Minimum 0.5kg required");
          input.value = 0.5;
          return;
        }

        const product = {
          name,
          local,
          price,
          qty,
          img: card.querySelector(".slide").src
        };

        addToCart(product);
      });
    }

  });

  // ============================
  // IMAGE SLIDER (MERGED FIX)
  // ============================

  document.querySelectorAll(".card").forEach(card => {

    let slides = card.querySelectorAll(".slide");
    let dots = card.querySelectorAll(".dot");

    let index = 0;

    if (slides.length === 0) return;

    let slider = card.querySelector(".slider");

    if (slider) {
      slider.addEventListener("click", () => {

        slides[index].classList.remove("active");
        if (dots[index]) dots[index].classList.remove("active");

        index = (index + 1) % slides.length;

        slides[index].classList.add("active");
        if (dots[index]) dots[index].classList.add("active");

      });
    }

  });

  // ============================
  // CART INIT
  // ============================

  renderCart();
  updateCartCount();

  const orderBtn = document.getElementById("orderBtn");

  if (orderBtn) {
    orderBtn.addEventListener("click", () => {

      const cart = getCart();

      if (cart.length === 0) {
        showToast("Cart is empty");
        return;
      }

      let message = "Hi, I want to order:\n\n";
      let total = 0;

      cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        message += `${item.name} (${item.local}) - ${item.qty}kg - ₹${itemTotal}\n`;
      });

      message += `\nTotal: ₹${total}`;

      const url = "https://wa.me/917093470823?text=" + encodeURIComponent(message);
      window.open(url);

      localStorage.removeItem("cart");
      renderCart();
      updateCartCount();
    });
  }

});

// ============================
// CART RENDER (COMPACT)
// ============================

function renderCart() {

  const cart = getCart();
  const container = document.getElementById("cart-container");
  const totalEl = document.getElementById("total");

  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty 🛒</p>";
    if (totalEl) totalEl.innerText = "";
    updateCartCount();
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {

    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-row">

        <img src="${item.img}" class="cart-img">

        <div class="cart-details">
          <h3>${item.name}</h3>
          <p class="local">${item.local}</p>
          <p>₹${item.price}/kg</p>

          <div class="qty">
            <button onclick="updateQty(${index}, -0.5)">-</button>
            <input type="number" value="${item.qty}" min="0.5" step="0.5"
              onchange="setQty(${index}, this.value)">
            <button onclick="updateQty(${index}, 0.5)">+</button>
          </div>

          <p class="item-total">₹${itemTotal}</p>

          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>

      </div>
    `;

    container.appendChild(div);
  });

  if (totalEl) {
    totalEl.innerText = "Total: ₹" + total;
  }

  updateCartCount();
}

// ============================
// CART ACTIONS
// ============================

function updateQty(index, change) {
  let cart = getCart();

  let val = parseFloat(cart[index].qty) + change;

  if (val < 0.5) val = 0.5;

  cart[index].qty = val.toFixed(1);

  saveCart(cart);
  renderCart();
}

function setQty(index, value) {
  let cart = getCart();
  let qty = parseFloat(value);

  if (isNaN(qty) || qty < 0.5) qty = 0.5;

  cart[index].qty = qty;

  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// ============================
// CONTACT
// ============================

function openWhatsApp() {
  window.open("https://wa.me/917093470823");
}

function callNow() {
  window.location.href = "tel:7093470823";
}

function openInstagram() {
  window.open("https://instagram.com");
}