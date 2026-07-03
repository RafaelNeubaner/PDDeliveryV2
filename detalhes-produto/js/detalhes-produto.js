import { useProducts } from "/js/services/useProducts.js";

const state = {
  product: null,
  quantity: 1,
  additions: [],
};

const elements = {
  loading: document.getElementById("produtoLoading"),
  detail: document.getElementById("produtoDetalhe"),
  error: document.getElementById("produtoErro"),
  titleName: document.querySelector("#produtoNomeTitulo"),
  summaryNames: document.querySelectorAll(".produtoNomeResumo"),
  image: document.getElementById("produtoImagem"),
  description: document.getElementById("produtoDescricao"),
  additionsList: document.getElementById("listaAdicionais"),
  badges: document.querySelectorAll(".produtoBadges"),
  price: document.getElementById("produtoPreco"),
  productQuantity: document.getElementById("quantidadeProduto"),
  decreaseProduct: document.getElementById("diminuirProduto"),
  increaseProduct: document.getElementById("aumentarProduto"),
  addCart: document.getElementById("adicionarCarrinho"),
  buyNow: document.getElementById("comprarAgora"),
  total: document.getElementById("totalPedido"),
};

function formatCurrency(value) {
  if(value===0) return "Grátis"
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

  elements.badges.forEach(badge=>badge.innerHTML = badges.join(""))
}

function renderAdditions() {
  if (state.additions.length === 0) {
    elements.additionsList.innerHTML =
      '<p class="txtMuted">Nenhum adicional disponível para este produto.</p>';
    return;
  }

  elements.additionsList.innerHTML = state.additions
    .map(
      (addition, indexFullOption) => {
        var content = `<h4 class="subTitleCard">${addition.title}</h4>`
        content += addition.options.map((option, index)=>
          `
          <article class="adicionalItem" data-index="${indexFullOption}-${index}">
            <img src="${option.image}" alt="Imagem de ${option.title}" />
            <div class="adicionalInfo">
              <strong class="adicionalNome">
                ${option.title}${option.description ? ` (${option.description})` : ""}
              </strong>
              <p class="adicionalPreco">${formatCurrency(option.aditionalPrice)}</p>
            </div>
            ${
              addition.multiSelection ?
            `<div class="controleAdicional" data-index="${indexFullOption}-${index}">
              <button type="button" data-action="decrease" aria-label="Remover ${option.title}">
                <i class="bi bi-dash"></i>
              </button>
              <span>${option.quantity}</span>
              <button type="button" data-action="increase" aria-label="Adicionar ${option.title}">
                <i class="bi bi-plus"></i>
              </button>
            <div>`
            :`<input type='radio' id="optional-${indexFullOption}-${index}" name="additional-${indexFullOption}" value="${index}" ${ option===addition.selected ? "checked" : ""}>`
          }
          </article>
        `
      ).join("")

      return content;
    },
      
  )
    .join("");
}

function calculateUnitTotal() {
  const additionsTotal = state.additions.reduce(
    (total, addition) =>
      total + addition.options.reduce((totalItem, curr)=> totalItem+((curr.quantity || 0)*curr.aditionalPrice), 0),
    0,
  );

  return getBasePrice(state.product) + additionsTotal;
}

function updateTotals() {
  elements.productQuantity.textContent = state.quantity;
  elements.total.textContent = formatCurrency(calculateUnitTotal() * state.quantity);
}

/**TODO: reestruturar lógica de seleção dos adicionais para nova estrutura */
function buildCartItem() {
  const selectedAdditions = state.additions
    .filter((addition) => addition.quantity > 0)
    .map((addition) => ({
      title: addition.title,
      name: addition.title,
      image: addition.image,
      additionalPrice: Number(addition.aditionalPrice || 0),
      price: Number(addition.aditionalPrice || 0),
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


/** Utilizar o useCarrinho.js para gerenciar o carrinho */

// function addToCart() {
//   const cart = getCart();
//   const item = buildCartItem();
//   const existingItem = cart.find(
//     (cartItem) => getItemSignature(cartItem) === getItemSignature(item),
//   );

//   if (existingItem) {
//     existingItem.quantity += item.quantity;
//     existingItem.total = existingItem.unitTotal * existingItem.quantity;
//   } else {
//     cart.push(item);
//   }

//   saveCart(cart);
// }

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
    if (!button) {
      const adicional = event.target.closest("article.adicionalItem");

      const dataId = adicional.dataset.index
      const [indexAdditional, indexOption] = dataId.split("-")
      const addition = state.additions[Number(indexAdditional)];

      addition.selected = addition.options[indexOption]
      renderAdditions();
      updateTotals();
      console.log(state.additions)
      return;
    };

    const control = button.closest(".controleAdicional");
    const dataId = control.dataset.index
    const [indexAdditional, indexOption] = dataId.split("-")
    const addition = state.additions[Number(indexAdditional)];

    if (button.dataset.action === "increase") {
      addition.options[indexOption].quantity += 1;
    } else if (button.dataset.action === "decrease") {
      addition.options[indexOption].quantity = Math.max(0, addition.options[indexOption].quantity - 1);
    }

    console.log(state.additions)
    renderAdditions();
    updateTotals();
  });

  

  //elements.addCart.addEventListener("click", addToCart);

  // elements.buyNow.addEventListener("click", () => {
  //   addToCart();
  //   window.location.href = "/carrinho/index.html";
  // });
}

function renderProduct(product) {
  state.product = product;
  state.quantity = 1;
  state.additions = product.options.map((additional) => {
    additional.options = additional.options.map((option)=>({
      ...option,
      quantity: additional.multiSelection ? 0 : null
    }))

    return {
    ...additional,
    selected: additional.multiSelection ? null : additional.required ? additional.options[0] : null
  }});

  console.log(state.additions)

  elements.titleName.textContent = product.name;
  elements.summaryNames.forEach((summaryName) => {
    summaryName.textContent = product.name;
  });
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
    console.log("Produto carregado:", product);
    renderProduct(product);
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    elements.loading.classList.add("d-none");
    elements.error.classList.remove("d-none");
  }
}

setupEvents();
//updateCartBadge();
loadProduct();
