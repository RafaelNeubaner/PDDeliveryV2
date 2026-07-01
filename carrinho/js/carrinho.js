import { cartApi } from "../../js/services/useCarrinho.js";

const itensCarrinhoSec = document.querySelector(".itensCarrinho")
const templateCarrinho = document.querySelector(".itemCarrinhoTemp")

var carrinho = cartApi.getCart()
renderCart()

document.querySelector(".addProdutos").addEventListener("click", (ev)=>{
     cartApi.addToCart({
        "id": "2",
        "name": "Pão de Queijo Recheado com Lombo",
        "searchName": "pao de queijo recheado com lombo",
        "category": "Lanches",
        "searchCategory": "lanches",
        "initialPrice": 24.5,
        "discount": 2,
        "descricao": "Tradicional pão de queijo mineiro em tamanho especial, assado na hora e recheado com suculento lombo desfiado e requeijão cremoso em abundância.\n\nQuantidade: 250g\nServe: 1 pessoa.",
        "image": "https://s2-casaejardim.glbimg.com/W1fPyFbY1VJ1LZrOLa6-cwgVD10=/0x0:1400x933/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2024/k/g/fQetnlRqCCgARUUVXwXQ/receita-pao-queijo-carne-louca-acem-mococa.jpg",
        "options": [
            {
                "title": "Adicionais",
                "required": false,
                "multiSelection": true,
                "options": [
                    {
                        "title": "Geleia de Pimenta Defumada",
                        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESx5i_IEcEpDb1lC_GdJdbsrlX-bk3zoUDBZxiu3MHdCB2yx0K6ISYyY&s=10",
                        "aditionalPrice": 4.5,
                        "description": "30g"
                    },
                    {
                        "title": "Dobro de Requeijão",
                        "image": "https://blogger.googleusercontent.com/img/a/AVvXsEjutSK4HPPoC64ZW0Do4Ab_4_tpaApbnWxP3HweF1RHrnRQ2LcN2TcfznjPdRJrEkOtGEVvcENlYGjifysxjTP9_sIN4w7ZM0XCOcqGYGZdn4WU8Bu0cm6BUClgvhD2pc_vgmmX-NSNaVls78LmtW7FUEVkzBwfL_B3hAcG3Rq4jsgOuhAwTweL4bkB=w640-h550",
                        "aditionalPrice": 5,
                        "description": "50g"
                    }
                ]
            }
        ]
    }, 1);
    carrinho = cartApi.getCart()
    renderCart()
})

addEventListener("DOMContentLoaded", () => {
  if (cartApi && cartApi.getCart().length === 0) {
    sincronizarStorageComPagina();
  }

  //sincronizarQuantidadeCarrinho();

  if (itensCarrinhoSec) {
    itensCarrinhoSec.addEventListener("click", (event) => {
      const botaoAdicionar = event.target.closest(".incremento");
      if (botaoAdicionar) {
        console.log("clique no adicionar")
        var itemId = parseInt(botaoAdicionar.closest(".item").id.split("-")[1])
        cartApi.addToCart(carrinho[itemId], 1)
        carrinho = cartApi.getCart()
        renderCart()
        return;
      }

      const botaoSubtrair = event.target.closest(".decremento");
      if (botaoSubtrair) {
        console.log("clique no subtrair")
        subtrairItem({ currentTarget: botaoSubtrair });
        return;
      }

      const botaoRemover = event.target.closest(".remover");
      if (botaoRemover) {
        console.log("clique no remover")
        removerItem({ currentTarget: botaoRemover });
      }
    });

    /*const observer = new MutationObserver(() => {
      sincronizarQuantidadeCarrinho();
      atualizarBadge();
      atualizarSubtotal();
    });

    observer.observe(cartItens, { childList: true });*/

    /*const resumo = document.querySelector(".resumo");
    if (cartApi.getCart().length === 0 && resumo) {
      resumo.style.display = "none";
    }*/
  }

  /*carregarCarrinho();
  atualizarBadge();
  atualizarSubtotal();
  calcularTotal();*/
});

function renderCart(){
    if(carrinho.length<=0){
        itensCarrinhoSec.innerHTML = `
        <div class="d-flex flex-column align-items-center">
            <i class="bi bi-cart display-1"></i>
            <span class="fs-3 text-center">Volte às compras! Você ainda não possui nada no seu carrinho</span>
        </div>
        `
        return    
    }

    itensCarrinhoSec.innerHTML=''
    carrinho.forEach((element, index) => {
        renderCartItem(element, index)
    });
}

function renderCartItem(item, index){
    var comp = templateCarrinho.content.cloneNode(true).firstElementChild

    console.log(comp)
    comp.setAttribute("id", `cartItem-${index}`)
    comp.querySelector("img").src = item.image
    comp.querySelector(".cardTitle").textContent = item.nome
    comp.querySelector(".precoProduto").textContent = item.preco
    //comp.querySelector(".adicionais small").textContent = item.adicionais.map((ad)=>ad.name).join(", ")
    //comp.querySelector(".subTotal").textContent = item.adicionais.reduce((acm, cur)=>acm+curr, item.preco)
    comp.querySelector(".quantity").textContent = item.quantity ?? 1

    itensCarrinhoSec.appendChild(comp)
}

