
// Função para criar o card de produto
export function criaCardProduto(produto) {
  const precoFinal = produto.initialPrice - produto.discount;

  const precoOriginal = produto.initialPrice.toFixed(2).replace(".", ",");
  const precoDesconto = precoFinal.toFixed(2).replace(".", ",");

  return `
    <article class="cardProduto">
        <div class="containerImgProduto">
          <a href="/detalhes-produto/detalhes-produto.html?id=${produto.id}" class="linkCardProduto">
            <img src="${produto.image}" alt="Imagem do produto ${produto.name}" class="imgProduto">
          </a>
        </div>
  
        <hgroup class="infoProduto">
          <h4 class="nomeProduto">${produto.name}</h4>
          
          <p class="precoOriginal mb-0">
            R$ ${precoOriginal}
          </p>
          <p class="precoProduto">R$ ${precoDesconto}</p>
        </hgroup>
    </article>
  `;
}


