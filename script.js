// ============================
// STORAGE (INDEX)
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
// CART COUNT
// ============================

function updateCartCount() {
  const cart = getCart();
  const badge = document.getElementById("cart-count");

  if (!badge) return;

  let count = cart.length;

  badge.innerText = count;
  badge.style.visibility = count > 0 ? "visible" : "hidden";
}

// ============================
// ADD TO CART
// ============================

function addToCart(product) {
  if (!product || !product.name) return;

  let cart = getCart();

  let existing = cart.findIndex(item => item.name === product.name);

  if (existing !== -1) {
    cart[existing].qty += product.qty;
  } else {
    cart.push(product);
  }

  saveCart(cart);
  updateCartCount();
  showToast(`${product.name} added (${product.qty}kg)`);
}

// ============================
// INDEX PAGE LOGIC
// ============================

document.addEventListener("DOMContentLoaded", () => {

  updateCartCount();

  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {

    const name = card.dataset.name;
    const local = card.dataset.local;
    const price = parseFloat(card.dataset.price);
    const img = card.dataset.img;

    const input = card.querySelector("input");
    const minusBtn = card.querySelector(".minus");
    const plusBtn = card.querySelector(".plus");
    const addBtn = card.querySelector(".add-btn");

    // MINUS
    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        let val = parseFloat(input.value) || 0.5;
        if (val > 0.5) {
          input.value = (val - 0.5).toFixed(1);
        }
      });
    }

    // PLUS
    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        let val = parseFloat(input.value) || 0.5;
        input.value = (val + 0.5).toFixed(1);
      });
    }

    // ADD TO CART
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
          img
        };

        addToCart(product);
      });
    }

  });

});

// ============================
// INFO PAGE FUNCTIONS
// ============================

function openWhatsApp() {
  const url = "https://wa.me/917093470823";
  window.open(url, "_blank");
}

function callNow() {
  window.location.href = "tel:7093470823";
}

function openInstagram() {
  const url = "https://www.instagram.com/jrs_fincuts";
  window.open(url, "_blank");
}

function openWhatsApp() {
  showToast("Opening WhatsApp...");
  window.open("https://wa.me/917093470823", "_blank");
}

// ============================
// CART PAGE LOGIC (FINAL)
// ============================

document.addEventListener("DOMContentLoaded", () => {

  const cartContainer = document.getElementById("cart-container");
  const emptyCart = document.getElementById("empty-cart");
  const totalEl = document.getElementById("total");
  const orderBtn = document.getElementById("orderBtn");

  if (!cartContainer) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function renderCart() {

    cartContainer.innerHTML = "";

    // ALWAYS SHOW BUTTON
    orderBtn.style.display = "block";

    if (cart.length === 0) {
      emptyCart.style.display = "block";
      totalEl.innerText = "Total: ₹0";
      return;
    }

    emptyCart.style.display = "none";

    let total = 0;

    cart.forEach((item, index) => {

      let itemTotal = item.price * item.qty;
      total += itemTotal;

      const div = document.createElement("div");
      div.className = "cart-item";

      div.innerHTML = `
        <div class="cart-row">
          <img src="${item.img}" class="cart-img">

          <div class="cart-details">
            <h3>${item.name}</h3>
            <p class="local">${item.local}</p>
            <p>₹${item.price} / kg</p>

            <div class="qty">
              <button class="minus">-</button>
              <input type="number" value="${item.qty}" step="0.5" min="0.5">
              <button class="plus">+</button>
            </div>

            <p class="item-total">₹${itemTotal.toFixed(0)}</p>

            <button class="remove-btn">Remove</button>
          </div>
        </div>
      `;

      // EVENTS
      const minus = div.querySelector(".minus");
      const plus = div.querySelector(".plus");
      const input = div.querySelector("input");
      const removeBtn = div.querySelector(".remove-btn");

      minus.onclick = () => {
        if (cart[index].qty > 0.5) {
          cart[index].qty -= 0.5;
          saveCart();
          renderCart();
        }
      };

      plus.onclick = () => {
        cart[index].qty += 0.5;
        saveCart();
        renderCart();
      };

      input.onchange = () => {
        let val = parseFloat(input.value);
        if (val >= 0.5) {
          cart[index].qty = val;
          saveCart();
          renderCart();
        }
      };

      removeBtn.onclick = () => {
        cart.splice(index, 1);
        saveCart();
        renderCart();
        showToast("Item removed");
      };

      cartContainer.appendChild(div);
    });

    totalEl.innerText = "Total: ₹" + total.toFixed(0);
  }

  // ============================
  // WHATSAPP ORDER (UPDATED)
  // ============================

  orderBtn.onclick = () => {

    if (cart.length === 0) {
      showToast("Cart is empty");
      return;
    }

    let message = "🛒 Order Details:\n\n";

    cart.forEach(item => {
      message += `${item.name} (${item.qty}kg) - ₹${item.price * item.qty}\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    message += `\nTotal: ₹${total}`;

    const url = "https://wa.me/917093470823?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
  };

  renderCart();

});

// ============================
// PRODUCT PAGE LOGIC
// ============================

document.addEventListener("DOMContentLoaded", () => {

  // run only on product page
  if (!document.body.classList.contains("product-page")) return;

  // BACK
  window.goBack = function () {
    window.history.back();
  };

  // PRODUCT DATA
  const products = {
    murrel: {
      name: "Murrel",
      local: "Korameenu",
      price: 650,
      display: "₹650 (1kg)",
      desc: "Fresh and hygienic Murrel fish, perfect for curry and fry.",
      images: [
        "images/products/koramennu.png",
        "images/products/korameenu-2.png"
      ]
    },
    tilapia: {
      name: "Tilapia",
      local: "Pilot Fish",
      price: 400,
      display: "₹400 (1kg)",
      desc: "Cleaned and ready-to-cook Tilapia, soft and tasty.",
      images: [
        "images/products/tilapia.png",
        "images/products/tilapia-2.png"
      ]
    },
    prawns: {
      name: "Prawns",
      local: "Royyalu",
      price: 600,
      display: "₹600 (500g)",
      desc: "Premium quality fresh prawns, cleaned and ready.",
      images: [
        "images/products/prawns.png",
        "images/products/prawns-2.png"
      ]
    }
  };

  // GET ID
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const product = products[id];

  // INVALID
  if (!product) {
    document.body.innerHTML = "<h2 style='text-align:center;margin-top:50px;'>Product not found</h2>";
    return;
  }

  // SET DATA
  document.getElementById("product-name").innerText = product.name;
  document.getElementById("local-name").innerText = product.local;
  document.getElementById("price").innerText = product.display;
  document.getElementById("desc").innerText = product.desc;

  const img1 = document.getElementById("img1");
  const img2 = document.getElementById("img2");

  img1.src = product.images[0];
  img2.src = product.images[1];

  // ============================
  // QTY
  // ============================

  window.changeQty = function (val) {
    let input = document.getElementById("qty");
    let qty = parseFloat(input.value);

    qty += val;
    if (qty < 0.5) qty = 0.5;

    input.value = qty.toFixed(1);
  };

  // ============================
  // ADD TO CART
  // ============================

  window.addProduct = function () {
    let qty = parseFloat(document.getElementById("qty").value);

    if (isNaN(qty) || qty < 0.5) {
      showToast("Minimum 0.5kg required");
      return;
    }

    const productData = {
      name: product.name,
      local: product.local,
      price: product.price,
      qty: qty,
      img: product.images[0]
    };

    addToCart(productData);
    updateCartCount();
    showToast(product.name + " added");
  };

  // ============================
  // MORE PRODUCTS
  // ============================

  const moreContainer = document.getElementById("more-products");

  Object.keys(products).forEach(key => {
    if (key !== id) {
      const item = products[key];

      const div = document.createElement("div");
      div.className = "mini-card";

      div.innerHTML = `
        <img src="${item.images[0]}">
        <p>${item.name}</p>
      `;

      div.onclick = () => {
        window.location.href = "product.html?id=" + key;
      };

      moreContainer.appendChild(div);
    }
  });

  // ============================
  // SLIDER
  // ============================

  let currentSlide = 0;

  const slides = [img1, img2];
  const dots = document.querySelectorAll("#dots .dot");

  function showSlide(index) {
    slides.forEach((img, i) => {
      img.style.display = i === index ? "block" : "none";
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  slides.forEach(img => {
    img.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  showSlide(0);

});
