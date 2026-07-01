import { useProducts } from "/js/services/useProducts.js";

const CART_KEY = "pdDeliveryCart";
const LEGACY_CART_KEY = "carrinho";

const state = {
  product: null,
  quantity: 1,
  additions: [],
};

const elements = {
  loading: document.getElementById("produtoLoading"),
  detail: document.getElementById("produtoDetalhe"),
  error: document.getElementById("produtoErro"),
  titleName: document.getElementById("produtoNomeTitulo"),
  summaryName: document.getElementById("produtoNomeResumo"),
  image: document.getElementById("produtoImagem"),
  description: document.getElementById("produtoDescricao"),
  additionsList: document.getElementById("listaAdicionais"),
  badges: document.getElementById("produtoBadges"),
  price: document.getElementById("produtoPreco"),
  productQuantity: document.getElementById("quantidadeProduto"),
  decreaseProduct: document.getElementById("diminuirProduto"),
  increaseProduct: document.getElementById("aumentarProduto"),
  addCart: document.getElementById("adicionarCarrinho"),
  buyNow: document.getElementById("comprarAgora"),
  total: document.getElementById("totalPedido"),
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getBasePrice(product) {
  return Number(product.initialPrice || 0) - Number(product.discount || 0);
}

function getProductId() {
  return new URLSearchParams(window.location.search).get("id");
}

function getProductOptions(product) {
  return product.options?.flatMap((group) => group.options || []) || [];
}

function renderDescription(description = "") {
  const parts = description
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const paragraph = parts.shift() || "Sem descrição disponível.";
  const details = parts.map((part) => part.replace(/^[-•]\s*/, ""));

  return `
    <p>${paragraph}</p>
    ${
      details.length
        ? `<ul>${details.map((detail) => `<li>${detail}</li>`).join("")}</ul>`
        : ""
    }
  `;
}

function getDiscountPercent(product) {
  const initialPrice = Number(product.initialPrice || 0);
  const discount = Number(product.discount || 0);

  if (!initialPrice || !discount) return 0;

  return Math.round((discount / initialPrice) * 100);
}

function renderBadges(product) {
  const discountPercent = getDiscountPercent(product);
  const badges = [];

  if (discountPercent > 0) {
    badges.push(`
      <span class="badgeProduto badgeDesconto">
        <i class="bi bi-patch-percent"></i>
        ${discountPercent}% OFF
      </span>
    `);
  }

  if (product.category) {
    badges.push(`
      <span class="badgeProduto badgeCategoria">${product.category}</span>
    `);
  }

  elements.badges.innerHTML = badges.join("");
}

function renderAdditions() {
  if (state.additions.length === 0) {
    elements.additionsList.innerHTML =
      '<p class="txtMuted">Nenhum adicional disponível para este produto.</p>';
    return;
  }

  elements.additionsList.innerHTML = state.additions
    .map(
      (addition, index) => `
        <article class="adicionalItem">
          <img src="${addition.image}" alt="Imagem de ${addition.title}" />
          <div class="adicionalInfo">
            <strong class="adicionalNome">
              ${addition.title}${addition.description ? ` (${addition.description})` : ""}
            </strong>
            <p class="adicionalPreco">${formatCurrency(addition.additionalPrice)}</p>
          </div>
          <div class="controleAdicional" data-index="${index}">
            <button type="button" data-action="decrease" aria-label="Remover ${addition.title}">
              <i class="bi bi-dash"></i>
            </button>
            <span>${addition.quantity}</span>
            <button type="button" data-action="increase" aria-label="Adicionar ${addition.title}">
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function calculateUnitTotal() {
  const additionsTotal = state.additions.reduce(
    (total, addition) =>
      total + Number(addition.additionalPrice || 0) * addition.quantity,
    0,
  );

  return getBasePrice(state.product) + additionsTotal;
}

function updateTotals() {
  elements.productQuantity.textContent = state.quantity;
  elements.total.textContent = formatCurrency(calculateUnitTotal() * state.quantity);
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);

  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.textContent = totalItems;
  });
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  localStorage.setItem(LEGACY_CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function buildCartItem() {
  const selectedAdditions = state.additions
    .filter((addition) => addition.quantity > 0)
    .map((addition) => ({
      title: addition.title,
      name: addition.title,
      image: addition.image,
      additionalPrice: Number(addition.additionalPrice || 0),
      price: Number(addition.additionalPrice || 0),
      description: addition.description || "",
      quantity: addition.quantity,
    }));

  const unitTotal = calculateUnitTotal();

  return {
    id: `${state.product.id}-${Date.now()}`,
    productId: state.product.id,
    name: state.product.name,
    category: state.product.category,
    image: state.product.image,
    description: state.product.descricao || state.product.description || "",
    basePrice: getBasePrice(state.product),
    initialPrice: Number(state.product.initialPrice || 0),
    discount: Number(state.product.discount || 0),
    quantity: state.quantity,
    additions: selectedAdditions,
    adicionais: selectedAdditions,
    unitTotal,
    total: unitTotal * state.quantity,
  };
}

function getItemSignature(item) {
  const additions = (item.additions || [])
    .map((addition) => `${addition.title}:${addition.quantity}`)
    .sort()
    .join("|");

  return `${item.productId}|${additions}`;
}

function addToCart() {
  const cart = getCart();
  const item = buildCartItem();
  const existingItem = cart.find(
    (cartItem) => getItemSignature(cartItem) === getItemSignature(item),
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
    existingItem.total = existingItem.unitTotal * existingItem.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}

function setupEvents() {
  elements.decreaseProduct.addEventListener("click", () => {
    state.quantity = Math.max(1, state.quantity - 1);
    updateTotals();
  });

  elements.increaseProduct.addEventListener("click", () => {
    state.quantity += 1;
    updateTotals();
  });

  elements.additionsList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const control = button.closest(".controleAdicional");
    const addition = state.additions[Number(control.dataset.index)];

    if (button.dataset.action === "increase") {
      addition.quantity += 1;
    } else {
      addition.quantity = Math.max(0, addition.quantity - 1);
    }

    renderAdditions();
    updateTotals();
  });

  elements.addCart.addEventListener("click", addToCart);

  elements.buyNow.addEventListener("click", () => {
    addToCart();
    window.location.href = "/carrinho/index.html";
  });
}

function renderProduct(product) {
  state.product = product;
  state.quantity = 1;
  state.additions = getProductOptions(product).map((option) => ({
    ...option,
    quantity: 0,
  }));

  elements.titleName.textContent = product.name;
  elements.summaryName.textContent = product.name;
  elements.image.src = product.image;
  elements.image.alt = `Imagem do produto ${product.name}`;
  elements.description.innerHTML = renderDescription(product.descricao || product.description);
  elements.price.textContent = formatCurrency(getBasePrice(product));

  renderBadges(product);
  renderAdditions();
  updateTotals();

  elements.loading.classList.add("d-none");
  elements.detail.classList.remove("d-none");
}

async function loadProduct() {
  const id = getProductId();

  if (!id) {
    elements.loading.classList.add("d-none");
    elements.error.classList.remove("d-none");
    return;
  }

  try {
    const product = await useProducts.getProdutoById(id);
    renderProduct(product);
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    elements.loading.classList.add("d-none");
    elements.error.classList.remove("d-none");
  }
}

setupEvents();
updateCartBadge();
loadProduct();
