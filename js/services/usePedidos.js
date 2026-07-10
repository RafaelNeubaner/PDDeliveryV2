/**
 * @typedef {Object} ResumoValores
 * @property {number} subtotal - Soma do valor dos produtos
 * @property {number} taxaServico - Taxa de serviço aplicada
 * @property {number} desconto - Valor total de descontos
 * @property {number} frete - Custo de entrega calculado no checkout
 * @property {number} total - Valor final cobrado do cliente
 */

/**
 * @typedef {Object} ItemPedido
 * @property {string} idProduto - ID do produto no banco
 * @property {string} nome - Nome do produto
 * @property {string} imagem - URL da imagem principal
 * @property {number} quantidade - Quantidade comprada
 * @property {string} adicionais - Lista em texto dos adicionais escolhidos
 * @property {number} precoTotalItem - (Preço base + adicionais) * quantidade
 */

/**
 * @typedef {Object} PedidoPayload
 * @property {string} idCliente - ID do cliente logado
 * @property {string} nomeCliente - Nome do cliente
 * @property {string} telefone - Telefone de contato
 * @property {string} endereco - Endereço completo formatado
 * @property {string} formaPagamento - Ex: "PIX" ou "Cartão de Crédito"
 * @property {string} horarioRealizado - Data/hora em formato ISO
 * @property {string|null} horarioEntregue - Data/hora da entrega (null ao criar)
 * @property {string} status - Ex: "Recebido"
 * @property {ResumoValores} resumoValores - Valores financeiros detalhados
 * @property {ItemPedido[]} listaItens - Array com os produtos do carrinho
 */

const API_URL_PEDIDOS =
  "https://6a3149ec7bc5e1c612657d26.mockapi.io/api/pddeliveryv2/pedidos";

export const usePedidos = {
  // FUNÇÕES CLIENTE

  // Cria novo pedido feito pelo cliente
  createPedido: async (pedido) => {
    try {
      const response = await fetch(API_URL_PEDIDOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });
      if (!response.ok) throw new Error("Falha ao criar o pedido");
      return await response.json();
    } catch (error) {
      console.error("Erro na API de Pedidos (POST):", error);
      throw error;
    }
  },

  // Busca a lista de pedidos do cliente
  getPedidoByCliente: async (idCliente) => {
    try {
      const response = await fetch(
        `${API_URL_PEDIDOS}?idCliente=${idCliente}`,
        {
          method: "GET",
        },
      );

      if (response.status === 404) {
        return [];
      }

      if (!response.ok)
        throw new Error("Falha ao buscar os pedidos do cliente.");

      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar pedidos do cliente:", error);
      throw error;
    }
  },

  // FUNÇÕES DO LOJISTA (E COMPARTILHADAS)

    // Busca todos pedidos (Painel do Lojista)
    getAllPedidos: async () => {
      try {
        const response = await fetch(API_URL_PEDIDOS, {
          method: "GET",
        });
        if (!response.ok) throw new Error("Falha ao buscar a lista geral de pedidos.");
        return await response.json();
      } catch (error) {
        console.error("Erro ao buscar todos os pedidos:", error);
        throw error;
      }
    },

    // Atualiza os dados/status do pedido 
    updatePedido: async (idPedido, dadosAtualizados) => {
      try {
        const response = await fetch(`${API_URL_PEDIDOS}/${idPedido}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosAtualizados),
        });
        if (!response.ok) throw new Error("Falha ao atualizar o pedido.");
        return await response.json();
      } catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        throw error;
      }
    },

    // Busca os dados de um pedido pelo seu id (Tela de Detalhes)

    getPedidoById: async (idPedido) => {
      try {
        const response = await fetch(`${API_URL_PEDIDOS}/${idPedido}`, {
          method: "GET",
        });
        if (!response.ok) throw new Error("Detalhes do pedido não encontrados.");
        return await response.json();
      } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
        throw error;
      }
    },

    atualizarStatus: async (pedido, isRecusado=false)=>{
      if(pedido.status == "Finalizado" || pedido.status=="Recusado"){
        throw new Error("Esse pedido já está em estado final e não pode ser modificado")
      }

      if(pedido.status == "Recebido" && isRecusado){
        pedido.status = "Recusado"
      }else if(pedido.status == "Recebido"){
        pedido.status = "Aceito"
      } else if(pedido.status == "Aceito"){
        pedido.status = "Em Preparo"
      } else if(pedido.status == "Em Preparo"){
        pedido.status = "Saiu para Entrega"
      } else if(pedido.status=="Saiu para Entrega"){
        pedido.horarioEntregue = new Date().toISOString()
        pedido.status = "Finalizado"
      }

      await usePedidos.updatePedido(pedido.id, pedido)
    }
  },

  // Atualiza os dados/status do pedido
  updatePedido: async (idPedido, dadosAtualizados) => {
    try {
      const response = await fetch(`${API_URL_PEDIDOS}/${idPedido}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados),
      });
      if (!response.ok) throw new Error("Falha ao atualizar o pedido.");
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      throw error;
    }
  },

  // Busca os dados de um pedido pelo seu id (Tela de Detalhes)

  getPedidoById: async (idPedido) => {
    try {
      const response = await fetch(`${API_URL_PEDIDOS}/${idPedido}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Detalhes do pedido não encontrados.");
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido:", error);
      throw error;
    }
  },
};