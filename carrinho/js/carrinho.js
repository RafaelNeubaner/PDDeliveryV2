const CART_KEY = "pdDeliveryCart";

const cartContainer = document.getElementById("carrinho");
const itemsContainer = document.querySelector(".itensCarrinho");
const subtotalElement = document.querySelector(".subtotal");
const discountElement = document.querySelector(".precoDesconto");
const totalElement = document.querySelector(".precoTotal");
const serviceTaxElement = document.querySelector(".taxaServico");
const finishButton = document.querySelector(".finalizar-compra");
let discount = 0;


function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
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
  localStorage.setItem("carrinho", JSON.stringify(cart));
  renderCart();
}

function getAdditionsText(item) {
  const additions = item.additions || item.adicionais || [];

  if (additions.length === 0) return "Sem adicionais";

  return additions
    .map((addition) =>
      addition.quantity > 1
        ? `${addition.title || addition.name} (${addition.quantity}x)`
        : addition.title || addition.name,
    )
    .join(", ");
}

function updateBadges(cart) {
  const totalItems = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);

  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.textContent = totalItems;
  });
}

function renderItems(cart) {
  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML =
      '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
    return;
  }

  itemsContainer.innerHTML = cart
    .map(
      (item) => `
        <article class="item" data-id="${item.id}">
          <div class="cardInfo">
            <img src="${item.image}" alt="Imagem do produto ${item.name}" />
            <hgroup class="detalhesItem">
              <h3 class="cardTitle">${item.name}</h3>
              <p class="adicionais">
                Adicionais:
                <small>${getAdditionsText(item)}</small>
              </p>
              <p class="precoProduto txtDark">${formatCurrency(item.unitTotal || item.basePrice)}</p>
            </hgroup>
          </div>

          <div class="d-flex justify-content-between">
            <div class="controleQtd d-flex">
              <div class="controle">
                <button class="decremento btnOutline" data-action="decrease" aria-label="Diminuir">
                  <i class="bi bi-dash"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="incremento btnOutline" data-action="increase" aria-label="Aumentar">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
              <button class="remover btnOutline" data-action="remove" aria-label="Remover">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <p class="subTotal red subTitleCard">${formatCurrency((item.unitTotal || item.basePrice) * item.quantity)}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderSummary(cart) {
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.unitTotal || item.basePrice || 0) * item.quantity,
    0,
  );
  const serviceTax = cart.length > 0 ? 0.99 : 0;
  const total = subtotal + serviceTax - discount;

  subtotalElement.textContent = formatCurrency(subtotal);
  serviceTaxElement.textContent = formatCurrency(serviceTax);
  discountElement.textContent = `- ${formatCurrency(discount)}`;
  totalElement.textContent = formatCurrency(total);
}

function renderCart() {
  const cart = getCart();

  updateBadges(cart);
  renderItems(cart);
  renderSummary(cart);
}

itemsContainer?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const itemElement = button.closest(".item");
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === itemElement.dataset.id);

  if (!item) return;

  if (button.dataset.action === "increase") {
    item.quantity += 1;
  }

  if (button.dataset.action === "decrease") {
    item.quantity -= 1;
  }

  const nextCart =
    button.dataset.action === "remove" || item.quantity <= 0
      ? cart.filter((cartItem) => cartItem.id !== item.id)
      : cart;

  saveCart(nextCart);
});

finishButton?.addEventListener("click", () => {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem("carrinho");
  cartContainer?.classList.add("checkout-completed");
  updateBadges([]);
});

const desconto = document.getElementById("descontoInput");
const descontoButton = document.getElementById("descontoButton");
const descontoForm = descontoButton?.closest("form");

descontoForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

descontoButton?.addEventListener("click", (event) => {
  event.preventDefault();

  const discountCode = desconto.value.trim();

  if (discountCode === "PROMO10") {
    discount = 10;
    alert("Cupom aplicado! Você recebeu R$ 10,00 de desconto.");
    desconto.classList.remove("inputError");
  } else {
    discount = 0;
    alert("Cupom inválido.");
    desconto.classList.add("inputError");
  }


  renderCart();
});

renderCart();