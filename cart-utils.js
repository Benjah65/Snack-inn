// cart-utils.js
// Shared cart utility for Snack Inn

// Get user UID from localStorage (if logged in)
function getUserUID() {
  try {
    const user = JSON.parse(localStorage.getItem('snack_user'));
    return user && user.uid ? user.uid : null;
  } catch {
    return null;
  }
}

// Get the correct cart key
function getCartKey() {
  const uid = getUserUID();
  return uid ? `snack_cart_${uid}` : 'snack_cart';
}

// Load cart from localStorage
export function loadCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(getCartKey()));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

// Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
}

// Add item to cart
export function addToCart(id, name, price, image) {
  const cart = loadCart();
  const idStr = String(id);
  const existing = cart.find(item => String(item.id) === idStr);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: idStr, name, price, image, quantity: 1 });
  }
  saveCart(cart);
}

// Remove item from cart
export function removeFromCart(id) {
  const idStr = String(id);
  let cart = loadCart();
  cart = cart.filter(item => String(item.id) !== idStr);
  saveCart(cart);
  window.dispatchEvent(new Event('cartUpdated'));
}

// Clear cart
export function clearCart() {
  localStorage.removeItem(getCartKey());
  window.dispatchEvent(new Event('cartUpdated'));
}

// Get cart total
export function getCartTotal() {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Migrate guest cart to user cart on login
export function migrateGuestCartToUserCart() {
  const uid = getUserUID();
  if (!uid) return;
  const guestCart = JSON.parse(localStorage.getItem('snack_cart')) || [];
  const userCartKey = `snack_cart_${uid}`;
  const userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
  // Merge carts (by id)
  guestCart.forEach(guestItem => {
    const existing = userCart.find(item => String(item.id) === String(guestItem.id));
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      userCart.push(guestItem);
    }
  });
  localStorage.setItem(userCartKey, JSON.stringify(userCart));
  localStorage.removeItem('snack_cart');
  window.dispatchEvent(new Event('cartUpdated'));
}

// --- Unified Cart System Initialization ---
export function initCart(options = {}) {
  // options: { cartCountSelector, cartPopupSelector, cartSidebarSelector }
  const cartCountSelector = options.cartCountSelector || '#cart-count';
  const cartPopupSelector = options.cartPopupSelector || '#cart-popup';
  const cartSidebarSelector = options.cartSidebarSelector || '#cart-sidebar';

  function updateCartCount() {
    const cart = loadCart();
    const cartCountElem = document.querySelector(cartCountSelector);
    if (cartCountElem) {
      cartCountElem.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
  }

  function renderCart() {
    // Try popup first
    const popup = document.querySelector(cartPopupSelector);
    const sidebar = document.querySelector(cartSidebarSelector);
    const cart = loadCart();
    // You can expand this to update your cart UI as needed
    if (popup) {
      // Example: update popup content
      const itemsElem = popup.querySelector('.cart-items') || popup.querySelector('#cart-items');
      if (itemsElem) {
        itemsElem.innerHTML = cart.length === 0
          ? '<p class="text-gray-500 text-center">Your cart is empty.</p>'
          : cart.map(item => `
            <div class="flex items-center justify-between mb-3">
              <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded mr-3 border" onerror="this.onerror=null;this.src='https://via.placeholder.com/48x48?text=No+Image';">
              <div>
                <div class="font-semibold">${item.name}</div>
                <div class="text-sm text-gray-500">KSh ${item.price} x ${item.quantity}</div>
              </div>
              <div class="flex items-center">
                <button class="decrease-qty text-orange-500 px-2" data-id="${item.id}">-</button>
                <span class="mx-1">${item.quantity}</span>
                <button class="increase-qty text-orange-500 px-2" data-id="${item.id}">+</button>
                <button class="remove-item ml-3 text-red-500" data-id="${item.id}"><i class="fa fa-trash"></i></button>
              </div>
            </div>
          `).join('');
        // --- MOBILE CART ONLY: Attach handler after DOM update ---
        // Remove old event listener if present to prevent multiple triggers
        if (itemsElem._mobileCartHandler) {
          itemsElem.removeEventListener('click', itemsElem._mobileCartHandler);
        }
        const handler = function (e) {
          const id = e.target.getAttribute('data-id');
          let cart = loadCart();
          if (e.target.classList.contains('increase-qty')) {
            const item = cart.find(i => String(i.id) === String(id));
            if (item) {
              item.quantity += 1;
              saveCart(cart);
            }
          }
          if (e.target.classList.contains('decrease-qty')) {
            const item = cart.find(i => String(i.id) === String(id));
            if (item && item.quantity > 1) {
              item.quantity -= 1;
              saveCart(cart);
            } else if (item && item.quantity === 1) {
              cart = cart.filter(i => String(i.id) !== String(id));
              saveCart(cart);
            }
          }
          if (e.target.classList.contains('remove-item')) {
            cart = cart.filter(i => String(i.id) !== String(id));
            saveCart(cart);
          }
        };
        itemsElem.addEventListener('click', handler);
        itemsElem._mobileCartHandler = handler;
      }
      // Update total if present
      const totalElem = popup.querySelector('.cart-total') || popup.querySelector('#cart-total-popup');
      if (totalElem) {
        totalElem.textContent = `KSh ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}`;
      }
    }
    // Example: update sidebar content (similar logic)
    if (sidebar) {
      const itemsElem = sidebar.querySelector('#cart-items');
      if (itemsElem) {
        itemsElem.innerHTML = cart.length === 0
          ? `<div class="text-center py-8 text-gray-500" id="empty-cart-message">
                <i class="fas fa-shopping-cart text-4xl mb-2"></i>
                <p>Your cart is empty</p>
             </div>`
          : cart.map(item => `
            <div class="flex items-center justify-between mb-3">
              <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded mr-3 border" onerror="this.onerror=null;this.src='https://via.placeholder.com/48x48?text=No+Image';">
              <div>
                <div class="font-semibold">${item.name}</div>
                <div class="text-sm text-gray-500">KSh ${item.price} x ${item.quantity}</div>
              </div>
              <div class="flex items-center">
                <button class="decrease-qty text-orange-500 px-2" data-id="${item.id}">-</button>
                <span class="mx-1">${item.quantity}</span>
                <button class="increase-qty text-orange-500 px-2" data-id="${item.id}">+</button>
                <button class="remove-item ml-3 text-red-500" data-id="${item.id}"><i class="fa fa-trash"></i></button>
              </div>
            </div>
          `).join('');
      }

      // Calculate values
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const delivery = subtotal > 0 ? 200 : 0; // Delivery is 200 if there are items
      const tax = Math.round(subtotal * 0.16); // 16% tax
      const total = subtotal + delivery + tax;

      // Update sidebar values
      const subtotalElem = sidebar.querySelector('#cart-subtotal');
      if (subtotalElem) subtotalElem.textContent = `KSh ${subtotal}`;

      const deliveryElem = sidebar.querySelector('#cart-delivery');
      if (deliveryElem) deliveryElem.textContent = `KSh ${delivery}`;

      const taxElem = sidebar.querySelector('#cart-tax');
      if (taxElem) taxElem.textContent = `KSh ${tax}`;

      const totalElem = sidebar.querySelector('#cart-total');
      if (totalElem) totalElem.textContent = `KSh ${total}`;
    }
  }
  

  window.addEventListener('cartUpdated', () => {
    updateCartCount();
    renderCart();
  });
  window.addEventListener('storage', function(e) {
    if (e.key && e.key.startsWith('snack_cart')) {
      updateCartCount();
      renderCart();
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
  });

  // Expose for global use
  window.renderCart = renderCart;
  window.updateCartCount = updateCartCount;
}

// Expose for global use (for inline onclick handlers)
window.loadCart = loadCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
