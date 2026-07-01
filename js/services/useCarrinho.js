
const CART_STORAGE_KEY = "pd-delivery-cart";

/**
 * @typedef {object} ProductCart
 * 
 * @property {string} cartId
 * @property {number} id
 * @property {string} nome
 * @property {string} descricao
 * @property {string} preco
 * @property {string} image
 * @property {Opcoes[]} opcoesSelecionadas
 * @property {number} quantidade
 */

/**
 * @typedef {object} Opcoes
 * 
 * @property {boolean} multiselected
 * @property {boolean} required
 * @property {string} title
 * @property {Adicional[]} adicionaisSelecionados
 */

/**
 * @typedef {object} Adicional
 * 
 * @property {number} aditionalPrice
 * @property {string} description
 * @property {string} image
 * @property {string} title
 * @property {number} quantidade
 */


/**
 * Transforma o texto na tela do valor em número
 * @param {string} valorTexto 
 * 
 * @returns {number}
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
  return `${item.id}::${item.opcoesSelecionadas.map((e=>e.title+e.adicionaisSelecionados.map(f=>f.title).join(","))).join(":") || ""}`;
}

export const cartApi = {
  parseProduto,
  parseValor,
  getCart: () => getCartStorage(),
  saveCart: (cart) => setCartStorage(cart),
  addToCart: (produto, quantidade = 1) => {
    const cart = getCartStorage();
    const itemKey = buildCartItemKey(produto);
    const index = cart.findIndex((item) => buildCartItemKey(item) === itemKey);

    if (index >= 0) {
      cart[index].qtd += quantidade;
    } else {
      cart.push({ ...produto, qtd: quantidade, cartKey: itemKey });
    }

    setCartStorage(cart);
    return cart;
  },
  removeFromCart: (id, quantidade = 1, variant = "") => {
    const cart = getCartStorage();
    const itemKey = buildCartItemKey({ id, variant });
    const index = cart.findIndex((item) => buildCartItemKey(item) === itemKey);

    if (index === -1) {
      return cart;
    }

    cart[index].qtd -= quantidade;
    if (cart[index].qtd <= 0) {
      cart.splice(index, 1);
    }

    setCartStorage(cart);
    return cart;
  },
  clearCart: () => {
    setCartStorage([]);
  },
  getTotalItens: () =>
    getCartStorage().reduce((total, item) => total + (item.qtd || 0), 0),
  atualizarBadgeGlobal: () => {
    const total = String(cartApi.getTotalItens());
    document.querySelectorAll(".cart-badge").forEach((badge) => {
      badge.textContent = total;
    });
  },
};