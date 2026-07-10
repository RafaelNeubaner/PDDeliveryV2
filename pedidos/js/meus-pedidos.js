import { getUserAuthenticated } from "../../js/services/useAuth.js";
import { usePedidos } from "../../js/services/usePedidos.js";


const pedidosGrid = document.getElementById("pedidosGrid");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const errorState = document.getElementById("errorState");
const btnRetry = document.getElementById("btnRetry");

document.addEventListener("DOMContentLoaded", () => {
  carregarPedidos();
});

btnRetry.addEventListener("click", () => {
  carregarPedidos();
});

// Carrega os pedidos do cliente autenticado
async function carregarPedidos() {
  loadingState.classList.remove("d-none");
  pedidosGrid.classList.add("d-none");
  emptyState.classList.add("d-none");
  errorState.classList.add("d-none");

  try {
    const user = await getUserAuthenticated();
    
    if (!user) return window.location.href = "/login/index.html";

    const historico = await usePedidos.getPedidoByCliente(user.id);

    if (!historico || historico.length === 0) {
      loadingState.classList.add("d-none");
      emptyState.classList.remove("d-none");
      return;
    }
    historico.sort((a, b) => new Date(b.horarioRealizado) - new Date(a.horarioRealizado));

    renderizarGrid(historico);

  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    loadingState.classList.add("d-none");
    errorState.classList.remove("d-none");
  }
}

// renderiza o grid de pedidos
function renderizarGrid(pedidos) {
  pedidosGrid.innerHTML = "";

  pedidos.forEach(pedido => {

    const dataFormatada = new Date(pedido.horarioRealizado).toLocaleDateString("pt-BR");
    const valorTotalFormatado = Number(pedido.resumoValores.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    

    const badge = getStatusBadgeData(pedido.status);


    const imagemDestaque = pedido.listaItens[0]?.imagem || "/assets/media/images/placeholder.jpg";

    // Card do pedido
    const card = document.createElement("article");
    card.classList.add("pedidoCard");
    card.dataset.id = pedido.id; 
    
    card.innerHTML = `
      <div class="pedidoInfoWrapper">
        <img src="${imagemDestaque}" alt="Imagem do Pedido" class="pedidoImage">
        <ul class="pedidoDados">
          <li class="subTitleCard">Pedido: <span> ${pedido.id}</span></li>
          <li class="subTitleCard">Data da compra: <span> ${dataFormatada}</span></li>
          <li class="subTitleCard">Total: <span> ${valorTotalFormatado}</span></li>
        </ul>
      </div>
      
      <div class="pedidoActions d-flex align-items-center gap-3">
        <span class="badgeStatusPedido ${badge.className}">${badge.text}</span>
        <button class="btnSecondary btnDetalhes">Detalhes do pedido</button>
      </div>
    `;

    pedidosGrid.appendChild(card);
  });


  loadingState.classList.add("d-none");
  pedidosGrid.classList.remove("d-none");
}


pedidosGrid.addEventListener("click", (event) => {

  const cardClicado = event.target.closest(".pedidoCard");
  
  if (cardClicado) {
    const pedidoId = cardClicado.dataset.id;
    openPedidoDetails(pedidoId);
  }
});

function openPedidoDetails(pedidoId) {
  window.location.href = `/pedidos/pedido.html?id=${pedidoId}`;
}

// mapear o status do pedido 
function getStatusBadgeData(status) {
  let text = "Em andamento";
  let className = "statusRecebido";

  switch (status.toLowerCase()) {
    case "recebido":
      text = "Em andamento";
      className = "statusRecebido";
      break;
    case "aceito":
      text = "Aceito";
      className = "statusAceito";
      break;
    case "em preparo":
      text = "Em preparo";
      className = "statusEmPreparo";
      break;
    case "saiu para entrega":
    case "a caminho": 
      text = "A caminho";
      className = "statusACaminho";
      break;
    case "finalizado":
    case "entregue": 
      text = "Entregue";
      className = "statusFinalizado";
      break;
    case "cancelado":
    case "recusado": 
      text = "Cancelado";
      className = "statusCancelado";
      break;
  }

  return { text, className };
}