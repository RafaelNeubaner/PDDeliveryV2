import { criaCardProduto } from "../components/productCard.js";
import { cartApi } from "../services/useCarrinho.js";
import { useProducts } from "../services/useProducts.js";

// Função para carregar o cardápio de produtos em oferta
async function carregarCardapio() {
  try {
    const produtos = await useProducts.findProdutos();

    const containerCardapio = document.getElementById("cardapio");
    containerCardapio.innerHTML = "";

    // limita a 15 itenspara exiibr no grid
    const produtosEmOferta = produtos
      .filter((produto) => produto.discount > 0)
      .slice(0, 15);

    if (produtosEmOferta.length === 0) {
      containerCardapio.innerHTML =
        '<p class="text-center mt-4">Nenhuma oferta disponível no momento.</p>';
      return;
    }

    let todosCards = "";

    produtosEmOferta.forEach((produto) => {
      const cardProduto = criaCardProduto(produto);

      todosCards += cardProduto;
    });

    containerCardapio.innerHTML = todosCards;

  } catch (error) {
    console.error("Busca não encontrada:", error);
    document.getElementById("cardapio").innerHTML =
      "<p>Erro ao carregar as ofertas.</p>";
  }
}

carregarCardapio();


document.querySelectorAll(".cardProduto").forEach((e => e.addEventListener((ev)=>{
  cartApi.addToCart({}, 1)
})))