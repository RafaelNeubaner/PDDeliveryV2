
const CART_STORAGE_KEY = "pd-delivery-cart";

/**
 * 
 * @typedef {object} ProductCart
 * 
 * @property {Adicional[]} additions
 * @property {Adicional[]} adicionais
 * @property {number} basePrice
 * @property {string} category
 * @property {string} description
 * @property {number} discount
 * @property {string} id
 * @property {string} image
 * @property {string} name
 * @property {string} productId
 * @property {number} quantity
 * @property {number} total
 * @property {number} unitTotal
 */

/**
 * 
 * @typedef {object} Adicional
 * 
 * @property {number} additionalPrice
 * @property {string} description
 * @property {String} groupTitle
 * @property {string} image
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 * @property {string} title
 */

function parseValor(valorTexto) {
  const normalizado = String(valorTexto || "0")
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const valor = Number.parseFloat(normalizado);
  return Number.isNaN(valor) ? 0 : valor;
}

function parseProduto(nome) {
  return String(nome || "produto")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * 
 * @returns {ProductCart[]}
 */
function getCartStorage() {
  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);
    return rawCart ? JSON.parse(rawCart) : [];
  } catch {
    return [];
  }
}

function setCartStorage(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * 
 * @param {ProductCart} item 
 * @returns {string}
 */
function buildCartItemKey(item) {
  return `${item.productId}::${item.additions.map(e=>`${e.title}x${e.quantity}`).join(":") || ""}`.trim();
}

export const cartApi = {
  parseProduto,
  parseValor,
  getCart: () => getCartStorage(),
  getByCartId: (id)=>{
    return cartApi.getCart().find((cartItem) => cartItem.id === id)
  },
  saveCart: (cart) => setCartStorage(cart),
  addToCart: (produto, quantidade = 1) => {
    console.log(produto)
    const cart = getCartStorage();
    const itemKey = buildCartItemKey(produto);
    const index = cart.findIndex((item) => buildCartItemKey(item) === itemKey);

    if (index >= 0) {
      cart[index].quantity += quantidade;
    } else {
      cart.push({ ...produto, quantity: quantidade, id: itemKey });
    }

    setCartStorage(cart);
    return cart;
  },
  removeFromCart: (item, quantidade = 1) => {
    const cart = getCartStorage();
    const itemKey = buildCartItemKey(item);
    const index = cart.findIndex((item) => buildCartItemKey(item) === itemKey);

    if (index === -1) {
      return cart;
    }

    cart[index].quantity -= quantidade;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    setCartStorage(cart);
    return cart;
  },
  clearCart: () => {
    setCartStorage([]);
  },
  getTotalItens: () =>
    getCartStorage().reduce((total, item) => total + (item.quantity || 0), 0),
  atualizarBadgeGlobal: () => {
    const total = String(cartApi.getTotalItens());
    console.log(total)
    document.querySelectorAll(".cart-badge").forEach((badge) => {
      badge.textContent = total;
    });
  },
  getCartSubtotal: ()=>{
    return getCartStorage().reduce(
      (total, item) => total + Number(item.unitTotal || item.basePrice || 0) * item.quantity,
      0,
    );
  },
  getCheckoutTotal: ()=>{
    const subtotal = getCartSubtotal();
    const serviceTax = getCart().length > 0 ? 0.99 : 0;

    return subtotal + serviceTax + Number(checkoutFreightValue || 0) - discount;
  }
};