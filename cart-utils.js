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

// Expose for global use (for inline onclick handlers)
window.loadCart = loadCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal; 