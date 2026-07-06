import { useProducts } from "/js/services/useProducts.js";
import {cartApi} from "../../js/services/useCarrinho.js"

const state = {
  product: null,
  quantity: 1,
  optionGroups: [],
};

const elements = {
  loading: document.getElementById("produtoLoading"),
  detail: document.getElementById("produtoDetalhe"),
  error: document.getElementById("produtoErro"),
  titleName: document.querySelector("#produtoNomeTitulo"),
  summaryName: document.querySelector(".produtoCompra .produtoNomeResumo"),
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
  return product.options || [];
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

function formatOptionPrice(value) {
  if (Number(value || 0) === 0) return "Grátis";

  return formatCurrency(value);
}

function renderOptionGroup(group, groupIndex) {
  if (!group.options || group.options.length === 0) return "";

  if (group.multiSelection === false) {
    return `
      <section class="opcaoGrupo opcaoGrupoUnica">
        <h3 class="opcaoGrupoTitulo">${group.title || "Opções"}</h3>
        <div class="opcaoLista opcaoListaUnica" data-group-index="${groupIndex}">
          ${group.options
            .map(
              (option, optionIndex) => `
                <label class="opcaoItem opcaoItemRadio">
                  <img src="${option.image}" alt="Imagem de ${option.title}" />
                  <div class="opcaoInfo">
                    <strong class="opcaoNome">${option.title}</strong>
                    <p class="opcaoPreco">${formatOptionPrice(option.aditionalPrice)}</p>
                  </div>
                  <input
                    type="radio"
                    name="option-group-${groupIndex}"
                    value="${optionIndex}"
                    ${group.required && optionIndex === 0 ? "checked" : ""}
                    data-action="single-option"
                    data-group-index="${groupIndex}"
                    data-option-index="${optionIndex}"
                  />
                </label>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  return `
    <section class="opcaoGrupo">
      <h3 class="opcaoGrupoTitulo">${group.title || "Adicionais"}</h3>
      <div class="listaAdicionais" data-group-index="${groupIndex}">
        ${group.options
          .map(
            (option, optionIndex) => `
              <article class="adicionalItem" data-option-index="${optionIndex}">
                <img src="${option.image}" alt="Imagem de ${option.title}" />
                <div class="adicionalInfo">
                  <strong class="adicionalNome">
                    ${option.title}${option.description ? ` (${option.description})` : ""}
                  </strong>
                  <p class="adicionalPreco">${formatOptionPrice(option.aditionalPrice)}</p>
                </div>
                <div class="controleAdicional" data-action="multi-option" data-group-index="${groupIndex}" data-option-index="${optionIndex}">
                  <button type="button" data-action="decrease" aria-label="Remover ${option.title}">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span>${option.quantity || 0}</span>
                  <button type="button" data-action="increase" aria-label="Adicionar ${option.title}">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderAdditions() {
  if (state.optionGroups.length === 0) {
    elements.additionsList.innerHTML =
      '<p class="txtMuted">Nenhum adicional disponível para este produto.</p>';
    return;
  }

  elements.additionsList.innerHTML = state.optionGroups
    .map((group, groupIndex) => renderOptionGroup(group, groupIndex))
    .join("");
}

function calculateUnitTotal() {
  const additionsTotal = state.optionGroups.reduce((total, group) => {
    if (group.multiSelection === false) {
      const selectedIndex = group.selectedIndex ?? (group.required ? 0 : -1);
      const selectedOption = group.options?.[selectedIndex];

      return total + Number(selectedOption?.aditionalPrice || 0);
    }

    const groupTotal = (group.options || []).reduce(
      (groupSum, option) => groupSum + Number(option.aditionalPrice || 0) * Number(option.quantity || 0),
      0,
    );

    return total + groupTotal;
  }, 0);

  return getBasePrice(state.product) + additionsTotal;
}

function updateTotals() {
  elements.productQuantity.textContent = state.quantity;
  elements.total.textContent = formatCurrency(calculateUnitTotal() * state.quantity);
}

function buildCartItem() {
  const selectedAdditions = [];

  state.optionGroups.forEach((group) => {
    if (group.multiSelection === false) {
      const selectedIndex = group.selectedIndex ?? (group.required ? 0 : -1);
      const selectedOption = group.options?.[selectedIndex];

      if (selectedOption) {
        selectedAdditions.push({
          title: `${group.title}: ${selectedOption.title}`,
          name: `${group.title}: ${selectedOption.title}`,
          image: selectedOption.image,
          additionalPrice: Number(selectedOption.aditionalPrice || 0),
          price: Number(selectedOption.aditionalPrice || 0),
          description: selectedOption.description || "",
          quantity: 1,
          groupTitle: group.title,
        });
      }

      return;
    }

    (group.options || [])
      .filter((option) => Number(option.quantity || 0) > 0)
      .forEach((option) => {
        selectedAdditions.push({
          title: option.title,
          name: option.title,
          image: option.image,
          additionalPrice: Number(option.aditionalPrice || 0),
          price: Number(option.aditionalPrice || 0),
          description: option.description || "",
          quantity: Number(option.quantity || 0),
          groupTitle: group.title,
        });
      });
  });

  const unitTotal = calculateUnitTotal();

  return {
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

function addToCart() {
  const item = buildCartItem();

  const alertCont = document.getElementById("addToCartAlert")
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-success alert-dismissible" role="alert">`,
    `   <div>Produto adicionado ao Carrinho!</div>`,
    '</div>'
  ].join('')
  
  alertCont.append(wrapper)

  setTimeout(()=>{
    wrapper.innerHTML=""
  }, 3000)

  cartApi.addToCart(item, 1)
  cartApi.atualizarBadgeGlobal()
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
    if (!control) return;

    const group = state.optionGroups[Number(control.dataset.groupIndex)];
    if (!group || group.multiSelection === false) return;

    const addition = group.options?.[Number(control.dataset.optionIndex)];
    if (!addition) return;

    if (button.dataset.action === "increase") {
      addition.options[indexOption].quantity += 1;
    } else if (button.dataset.action === "decrease") {
      addition.options[indexOption].quantity = Math.max(0, addition.options[indexOption].quantity - 1);
    }

    console.log(state.additions)
    renderAdditions();
    updateTotals();
  });

  elements.additionsList.addEventListener("change", (event) => {
    const radio = event.target.closest('input[data-action="single-option"]');
    if (!radio) return;

    const groupIndex = Number(radio.dataset.groupIndex);
    const optionIndex = Number(radio.dataset.optionIndex);
    const group = state.optionGroups[groupIndex];

    if (!group || group.multiSelection !== false) return;

    group.selectedIndex = optionIndex;
    updateTotals();
  });

  elements.addCart.addEventListener("click", addToCart);

  //elements.addCart.addEventListener("click", addToCart);

  // elements.buyNow.addEventListener("click", () => {
  //   addToCart();
  //   window.location.href = "/carrinho/index.html";
  // });
}

function renderProduct(product) {
  state.product = product;
  state.quantity = 1;
  state.optionGroups = getProductOptions(product).map((group) => ({
    ...group,
    selectedIndex: group.multiSelection === false && group.required !== false ? 0 : -1,
    options: (group.options || []).map((option, optionIndex) => ({
      ...option,
      quantity: 0,
      optionIndex,
    })),
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
    console.log("Produto carregado:", product);
    renderProduct(product);
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    elements.loading.classList.add("d-none");
    elements.error.classList.remove("d-none");
  }
}

setupEvents();
loadProduct();
