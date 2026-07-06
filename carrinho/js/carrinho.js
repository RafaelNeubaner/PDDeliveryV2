import { cartApi } from "../../js/services/useCarrinho.js";
import { getLocationByCEP } from "../../js/services/useCep.js";

const cartContainer = document.getElementById("carrinho");
const itemsContainer = document.querySelector(".itensCarrinho");
const subtotalElement = document.querySelector(".subtotal");
const discountElement = document.querySelector(".precoDesconto");
const totalElement = document.querySelector(".precoTotal");
const serviceTaxElement = document.querySelector(".taxaServico");
const finishButton = document.querySelector(".finalizar-compra");
let discount = 0;

const checkoutModal = document.getElementById("checkoutModal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutClose = document.getElementById("checkoutClose");
const checkoutCep = document.getElementById("checkoutCep");
const checkoutRua = document.getElementById("checkoutRua");
const checkoutNumero = document.getElementById("checkoutNumero");
const checkoutBairro = document.getElementById("checkoutBairro");
const checkoutCidade = document.getElementById("checkoutCidade");
const checkoutEstado = document.getElementById("checkoutEstado");
const checkoutComplemento = document.getElementById("checkoutComplemento");
const paymentPix = document.getElementById("paymentPix");
const paymentCredit = document.getElementById("paymentCredit");
const cardFields = document.getElementById("cardFields");
const checkoutFrete = document.getElementById("checkoutFrete");
const checkoutTotal = document.querySelectorAll(".checkoutTotal");
const checkoutItemCount = document.getElementById("checkoutItemCount");
const checkoutPromoBadge = document.getElementById("checkoutPromoBadge");

let checkoutFreightValue = null;
let lastCepLookup = "";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatCep(cep) {
  const digits = cep.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 5) return digits;

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function randomFreight() {
  return Math.floor(Math.random() * 8) + 3;
}

function updateCheckoutSummary() {
  const cart = cartApi.getCart();
  const subtotal = cartApi.getCartSubtotal();
  const itemCount = cartApi.getTotalItens();

  if (checkoutFrete) {
    checkoutFrete.textContent = checkoutFreightValue === null ? "R$ --,--" : formatCurrency(checkoutFreightValue);
  }

  if (checkoutTotal) {
    for (const totalElement of checkoutTotal) {
      totalElement.textContent = formatCurrency(subtotal + (cart.length > 0 ? 0.99 : 0) + Number(checkoutFreightValue || 0) - discount);
    }
  }

  if (checkoutItemCount) {
    checkoutItemCount.textContent = `${itemCount} qtd`;
  }

  if (checkoutPromoBadge) {
    const discountPercent = subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0;

    checkoutPromoBadge.textContent = `${discountPercent || 15}%`;
    checkoutPromoBadge.classList.toggle("is-hidden", discountPercent <= 0);
  }
}

function toggleCardFields() {
  const pixSelected = Boolean(paymentPix?.checked);

  cardFields?.classList.toggle("is-hidden", pixSelected);

  cardFields?.querySelectorAll("input").forEach((input) => {
    input.required = !pixSelected;
  });
}

function openCheckoutModal() {
  if (!checkoutModal) return;

  checkoutModal.classList.add("is-open");
  checkoutModal.setAttribute("aria-hidden", "false");

  const isMobile = window.matchMedia("(max-width: 992px)").matches;

  if (!isMobile) {
    document.body.classList.add("modal-open");
  } else {
    checkoutModal.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  updateCheckoutSummary();
  toggleCardFields();
  checkoutCep?.focus();
}

function closeCheckoutModal() {
  if (!checkoutModal) return;

  checkoutModal.classList.remove("is-open");
  checkoutModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function showOrderCompleted() {
  clearCart();
  closeCheckoutModal();
  cartContainer?.classList.add("checkout-completed");
}

async function handleCepLookup(cepValue) {
  const cepDigits = cepValue.replace(/\D/g, "");

  if (cepDigits.length !== 8 || cepDigits === lastCepLookup) return;

  lastCepLookup = cepDigits;

  const location = await getLocationByCEP(cepDigits);

  if (location.error) {
    alert("CEP não encontrado.");
    return;
  }

  checkoutRua.value = location.logradouro || "";
  checkoutBairro.value = location.bairro || "";
  checkoutCidade.value = location.localidade || "";
  checkoutEstado.value = location.estado || location.uf || "";
  checkoutFreightValue = randomFreight();
  updateCheckoutSummary();
  checkoutNumero?.focus();
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
  const cart = cartApi.getCart();

  cartContainer?.classList.toggle("empty-cart", cart.length === 0);
  updateBadges(cart);
  renderItems(cart);
  renderSummary(cart);
}

itemsContainer?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const itemElement = button.closest(".item");
  const item = cartApi.getByCartId(itemElement.dataset.id);


  if (!item) return;

  if (button.dataset.action === "increase") {
    cartApi.addToCart(item, 1)
  }

  if (button.dataset.action === "decrease") {
    cartApi.removeFromCart(item, 1)
  }
  
  if(button.dataset.action === "remove" || item.quantity <= 0){
      cartApi.removeFromCart(item, item.quantity);
  }
  renderCart()
});

finishButton?.addEventListener("click", () => {
  openCheckoutModal();
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

checkoutClose?.addEventListener("click", closeCheckoutModal);

checkoutModal?.addEventListener("click", (event) => {
  if (event.target?.dataset?.action === "close") {
    closeCheckoutModal();
  }
});

checkoutForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  showOrderCompleted();
});

paymentPix?.addEventListener("change", toggleCardFields);
paymentCredit?.addEventListener("change", toggleCardFields);

checkoutCep?.addEventListener("input", (event) => {
  const formatted = formatCep(event.target.value);
  event.target.value = formatted;

  handleCepLookup(formatted).catch((error) => {
    console.error("Erro ao buscar CEP:", error);
  });
});

checkoutModal?.querySelectorAll("input, button").forEach((input) => {
  input.addEventListener("input", updateCheckoutSummary);
});

window.addEventListener("resize", () => {
  if (!checkoutModal?.classList.contains("is-open")) return;

  if (window.matchMedia("(max-width: 992px)").matches) {
    document.body.classList.remove("modal-open");
  } else {
    document.body.classList.add("modal-open");
  }
});

renderCart();
toggleCardFields();
updateCheckoutSummary();
