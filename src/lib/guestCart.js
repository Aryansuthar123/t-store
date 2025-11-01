
// export function getGuestCart() {
//   if (typeof window === "undefined") return [];
//   try {
//     const stored = localStorage.getItem("guest_cart");
//     return stored ? JSON.parse(stored) : [];
//   } catch {
//     return [];
//   }
// }

// export function setGuestCart(items) {
//   if (typeof window === "undefined") return;
//   localStorage.setItem("guest_cart", JSON.stringify(items || []));
// }

// export function addToGuestCart(product, quantity = 1) {
//   if (typeof window === "undefined") return;
//   const cart = getGuestCart();
//   const existing = cart.find((item) => item.product._id === product._id);
//   if (existing) {
//     existing.quantity += quantity;
//   } else {
//     cart.push({ product, quantity });
//   }
//   setGuestCart(cart);
// }

// export function removeFromGuestCart(productId) {
//   if (typeof window === "undefined") return;
//   const cart = getGuestCart().filter((i) => i.product._id !== productId);
//   setGuestCart(cart);
// }

// export function updateGuestCartQuantity(productId, newQty) {
//   if (typeof window === "undefined") return;
//   const cart = getGuestCart();
//   const item = cart.find((i) => i.product._id === productId);
//   if (item) item.quantity = newQty > 0 ? newQty : 1;
//   setGuestCart(cart);
// }

// export function clearGuestCart() {
//   if (typeof window === "undefined") return;
//   localStorage.removeItem("guest_cart");
// }
