const API_URL_PRODUCTS =
  "https://6a3149ec7bc5e1c612657d26.mockapi.io/api/pddeliveryv2/products";

export const useProducts = {
  /*
    Função responsável pela busca dos produtos na API
    Atende ao Cliente (pesquisa e listagem) e ao Lojista (listagem do cardápio).
  */
  findProdutos: async (query = "", queryOptions = {}) => {
    try {
      const response = await fetch(API_URL_PRODUCTS, { method: "GET" });

      if (!response.ok) throw new Error("Erro ao buscar produtos.");

      let products = await response.json();
      const termoBusca = query.trim().toLowerCase();

      if (!queryOptions.isLogista) {
        products = products.filter((p) => p.initialPrice > 0);
      }

      if (termoBusca) {
        products = products.filter((product) => {
          const productName = product.name?.toLowerCase() || "";
          const productCategory = product.category?.toLowerCase() || "";
          const productDescription = product.description?.toLowerCase() || "";
          const productDescricao = product.descricao?.toLowerCase() || "";

          return (
            productName.includes(termoBusca) ||
            productCategory.includes(termoBusca) ||
            productDescription.includes(termoBusca) ||
            productDescricao.includes(termoBusca)
          );
        });
      }

      return products;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  },

  // Função responsável pela busca pelo ID na API
  getProdutoById: async (id) => {
    try {
      const response = await fetch(`${API_URL_PRODUCTS}/${id}`, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Produto não encontrado.");

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar produto por ID:", error);
      throw error;
    }
  },

  // Logista: Cria novo produto na API
  createProduto: async (product) => {
    try {
      if (!product.name || product.initialPrice <= 0) {
        throw new Error(
          "Nome e preço inicial são obrigatórios. O preço inicial deve ser maior que zero.",
        );
      }

      const response = await fetch(API_URL_PRODUCTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar produto.");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      throw error;
    }
  },

  // Logista: Atualiza informações do produto na API
  updateProduto: async (id, product) => {
    try {
      const response = await fetch(`${API_URL_PRODUCTS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error("Erro ao atualizar produto.");

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  },

  // Logista: Deleta produto da API
  deleteProduto: async (id) => {
    try {
      const response = await fetch(`${API_URL_PRODUCTS}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar produto.");

      return await response.json();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      throw error;
    }
  },
};

/* Teste de integração
useProducts.findProdutos().then((produtos) => {
  console.log("Integração concluída! Produtos carregados:", produtos);

});
*/
