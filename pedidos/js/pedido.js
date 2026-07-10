import { getUserAuthenticated } from "../../js/services/useAuth.js";
import { usePedidos } from "../../js/services/usePedidos.js";
import { cartApi } from "../../js/services/useCarrinho.js";

const elements = {
  cardProdutoTemplate: document.querySelector(".cardProdutoPedidoTemp"),
  produtosSec: document.querySelector(".produtosPedidos"),
  stars: document.querySelectorAll(".star"),
  statusPedido: document.querySelector(".statusContent"),
  pedidoId: document.querySelector(".pedidoId"),
  dataCompra: document.querySelector(".dataCompra"),
  totalPedido: document.querySelectorAll(".totalPedido"),
  pedidoRealizado: document.querySelector(".pedidoRealizado"),
  pedidoEntregue: document.querySelector(".pedidoEntregue"),
  nomeCliente: document.querySelector(".nomeCliente"),
  enderecoCliente: document.querySelector(".enderecoCliente"),
  formaPagamento: document.querySelector(".formaPagamento"),
  totalPedido: document.querySelectorAll(".totalPedido"),
  resumoContent: document.querySelector(".resumoContent"),
  subtotal: document.querySelector(".subtotal"),
  taxaServico: document.querySelector(".taxaServiço"),
  descontos: document.querySelector(".descontos"),
  frete: document.querySelector(".frete"),
  loading: document.querySelector(".loading"),
  btnComprarNovamente: document.querySelector(".btnComprarNovamente"),
};

const state = {
  stars: null,
  pedido: null,
  loading: true,
};

const params = new URLSearchParams(location.search);
const pedido = await usePedidos.getPedidoById(params.get("id"));
elements.loading.classList.add("hide");
const formatDataNumber = (number) => {
  return number >= 10 ? number : `0${number}`;
};
const user = await getUserAuthenticated();
if (user.id === pedido.idCliente) {
  renderPedido(pedido);
} else {
  document.querySelector("main").classList.add("hide");
  document.querySelector(".acessoNegado").classList.remove("hide");
}

function renderBadgeStatusPedido(status) {
  switch (status.toLowerCase()) {
    case "recebido":
      elements.statusPedido.textContent = "Em andamento";
      elements.statusPedido.classList.add("statusRecebido");
      break;
    case "aceito":
      elements.statusPedido.textContent = "Aceito";
      elements.statusPedido.classList.add("statusAceito");
      break;
    case "em preparo":
      elements.statusPedido.textContent = "Em preparo";
      elements.statusPedido.classList.add("statusEmPreparo");
      break;
    case "saiu para entrega":
      elements.statusPedido.textContent = "A caminho";
      elements.statusPedido.classList.add("statusACaminho");
      break;
    case "finalizado":
      elements.statusPedido.textContent = "Entregue";
      elements.statusPedido.classList.add("statusFinalizado");
      break;
    case "cancelado":
      elements.statusPedido.textContent = "Cancelado";
      elements.statusPedido.classList.add("statusCancelado");
      break;
  }
}

function renderPedido(pedido) {
  elements.pedidoId.textContent = `#${pedido.id}`;
  elements.totalPedido.forEach(
    (total) =>
      (total.textContent = pedido.resumoValores.total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })),
  );
  elements.enderecoCliente.textContent = pedido.endereco;
  elements.nomeCliente.textContent = pedido.nomeCliente;
  elements.formaPagamento.textContent = pedido.formaPagamento;

  elements.subtotal.textContent = pedido.resumoValores.subtotal.toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" },
  );
  elements.taxaServico.textContent =
    pedido.resumoValores.taxaServico.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  elements.descontos.textContent = pedido.resumoValores.desconto.toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" },
  );
  elements.frete.textContent = pedido.resumoValores.frete.toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" },
  );

  if (pedido.horarioRealizado) {
    const dataRealizado = new Date(pedido.horarioRealizado);
    const dataFormatada = `${formatDataNumber(dataRealizado.getDate())}/${formatDataNumber(dataRealizado.getMonth() + 1)} - ${formatDataNumber(dataRealizado.getHours())}:${formatDataNumber(dataRealizado.getMinutes())}`;

    elements.dataCompra.textContent = dataFormatada;
    elements.pedidoRealizado.textContent = dataFormatada;
  } else {
    elements.dataCompra.textContent = "--/-- - --:--";
    elements.pedidoRealizado.textContent = "--/-- - --:--";
  }

  if (pedido.horarioEntregue) {
    const dataEntregue = new Date(pedido.horarioEntregue);
    const dataEntregueFormatada = `${formatDataNumber(dataEntregue.getDate())}/${formatDataNumber(dataEntregue.getMonth() + 1)} - ${formatDataNumber(dataEntregue.getHours())}:${formatDataNumber(dataEntregue.getMinutes())}`;

    elements.pedidoEntregue.textContent = dataEntregueFormatada;
  } else {
    elements.pedidoEntregue.textContent = "--/-- - --:--";
  }

  renderBadgeStatusPedido(pedido.status);
  renderProdutos(pedido.listaItens);
}

function renderProdutos(produtos) {
  elements.produtosSec.innerHTML = "";
  produtos.forEach((produto) => {
    const produtoElem = elements.cardProdutoTemplate.content.cloneNode(true);

    produtoElem.querySelector("img").src = produto.imagem;
    produtoElem.querySelector(".produtoTitle").textContent = produto.nome;
    produtoElem.querySelector(".produtoAdicionais").textContent =
      produto.adicionais;
    produtoElem.querySelector(".produtoQtd").textContent = produto.quantidade;

    elements.produtosSec.appendChild(produtoElem);
  });
}

elements.stars.forEach((star) => {
  star.addEventListener("mouseenter", (ev) => {
    const value = ev.target.dataset.value;
    elements.stars.forEach((star) => {
      if (value >= star.dataset.value) {
        star.classList.add("bi-star-fill");
        star.classList.remove("bi-star");
      } else {
        star.classList.remove("bi-star-fill");
        star.classList.add("bi-star");
      }
    });
  });

  star.addEventListener("mouseleave", (ev) => {
    elements.stars.forEach((star) => {
      if (state.stars >= star.dataset.value) {
        star.classList.add("bi-star-fill");
        star.classList.remove("bi-star");
      } else {
        star.classList.remove("bi-star-fill");
        star.classList.add("bi-star");
      }
    });
  });

  star.addEventListener("click", (ev) => {
    const value = ev.target.dataset.value;
    state.stars = value;
    elements.stars.forEach((star) => {
      if (value >= star.dataset.value) {
        star.classList.add("bi-star-fill");
        star.classList.remove("bi-star");
      } else {
        star.classList.remove("bi-star-fill");
        star.classList.add("bi-star");
      }
    });
  });
});

document.querySelector(".btnRetornarPedidos").addEventListener("click", () => {
  location.href = "/pedidos/meus-pedidos.html";
});

// btn "Comprar Novamente" - reconstroi cada item do histórico do pedido
elements.btnComprarNovamente.addEventListener("click", () => {
  cartApi.clearCart();

  pedido.listaItens.forEach((item, index) => {
    const precoUnitario = item.precoTotalItem / item.quantidade;

    let arrayAdicionais = [];
    if (item.adicionais && item.adicionais !== "Sem adicionais") {
      arrayAdicionais = [
        {
          title: item.adicionais,
          name: item.adicionais,
          quantity: 1,
        },
      ];
    }

    const idUnico = `hist-${index}`;

    const produtoParaCarrinho = {
      id: idUnico,
      productId: idUnico,
      name: item.nome,
      image: item.imagem,
      basePrice: precoUnitario,
      unitTotal: precoUnitario,
      additions: arrayAdicionais,
      adicionais: arrayAdicionais,
    };

    cartApi.addToCart(produtoParaCarrinho, item.quantidade);
  });

  window.location.href = "/carrinho/index.html";
});
