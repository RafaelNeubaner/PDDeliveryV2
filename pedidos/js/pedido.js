

const elements = {
    cardProdutoTemplate: document.querySelector(".cardProdutoPedidoTemp"),
    produtosSec: document.querySelector(".produtosPedidos"),
    stars: document.querySelectorAll(".star"),
    statusPedido: document.querySelector(".statusContent"),
    pedidoId: document.querySelector(".pedidoId"),
    dataCompra: document.querySelector(".dataCompra"),
    totalPedido: document.querySelectorAll(".totalPedido"),
    pedidoRealizado: document.querySelectorAll(".pedidoRealizado"),
    pedidoEntregue: document.querySelectorAll(".pedidoEntregue"),
    nomeCliente: document.querySelectorAll(".nomeCliente"),
    enderecoCliente: document.querySelectorAll(".enderecoCliente"),
    formaPagamento: document.querySelectorAll(".formaPagamento"),
    totalPedido: document.querySelectorAll(".totalPedido"),
    resumoContent: document.querySelectorAll(".resumoContent"),
}

const state = {
    stars: null,
    pedido: null,
    loading: true
}

const produtos = [
  {
    "productId": "25",
    "name": "Beirute de Rosbife Completo",
    "category": "Lanches",
    "image": "https://www.estadao.com.br/resizer/v2/UPDNCZXZEBBFTJ2F7MFB3M4YOM.jpg?quality=80&auth=e2dcf0852f250f37f5bddf53a31e8d9b5b3b33bea36909d1f255e0c9c8fd24cc&width=550&height=925&focal=967,719",
    "description": "Pão sírio gigante tostado, recheado com rosbife artesanal fininho, queijo prato derretido, presunto, ovo, alface, tomate, orégano e maionese.\n\nQuantidade: 450g\nServe: 1 pessoa (fome grande).",
    "basePrice": 34,
    "initialPrice": 42,
    "discount": 8,
    "quantity": 1,
    "additions": [],
    "adicionais": [],
    "unitTotal": 34,
    "total": 34,
    "id": "25::"
  },
  {
    "productId": "2",
    "name": "Pão de Queijo Recheado com Lombo",
    "category": "Lanches",
    "image": "https://s2-casaejardim.glbimg.com/W1fPyFbY1VJ1LZrOLa6-cwgVD10=/0x0:1400x933/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2024/k/g/fQetnlRqCCgARUUVXwXQ/receita-pao-queijo-carne-louca-acem-mococa.jpg",
    "description": "Tradicional pão de queijo mineiro em tamanho especial, assado na hora e recheado com suculento lombo desfiado e requeijão cremoso em abundância.\n\nQuantidade: 250g\nServe: 1 pessoa.",
    "basePrice": 22.5,
    "initialPrice": 24.5,
    "discount": 2,
    "quantity": 1,
    "additions": [
      {
        "title": "Geleia de Pimenta Defumada",
        "name": "Geleia de Pimenta Defumada",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESx5i_IEcEpDb1lC_GdJdbsrlX-bk3zoUDBZxiu3MHdCB2yx0K6ISYyY&s=10",
        "additionalPrice": 4.5,
        "price": 4.5,
        "description": "30g",
        "quantity": 1,
        "groupTitle": "Adicionais"
      },
      {
        "title": "Dobro de Requeijão",
        "name": "Dobro de Requeijão",
        "image": "https://blogger.googleusercontent.com/img/a/AVvXsEjutSK4HPPoC64ZW0Do4Ab_4_tpaApbnWxP3HweF1RHrnRQ2LcN2TcfznjPdRJrEkOtGEVvcENlYGjifysxjTP9_sIN4w7ZM0XCOcqGYGZdn4WU8Bu0cm6BUClgvhD2pc_vgmmX-NSNaVls78LmtW7FUEVkzBwfL_B3hAcG3Rq4jsgOuhAwTweL4bkB=w640-h550",
        "additionalPrice": 5,
        "price": 5,
        "description": "50g",
        "quantity": 2,
        "groupTitle": "Adicionais"
      }
    ],
    "adicionais": [
      {
        "title": "Geleia de Pimenta Defumada",
        "name": "Geleia de Pimenta Defumada",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESx5i_IEcEpDb1lC_GdJdbsrlX-bk3zoUDBZxiu3MHdCB2yx0K6ISYyY&s=10",
        "additionalPrice": 4.5,
        "price": 4.5,
        "description": "30g",
        "quantity": 1,
        "groupTitle": "Adicionais"
      },
      {
        "title": "Dobro de Requeijão",
        "name": "Dobro de Requeijão",
        "image": "https://blogger.googleusercontent.com/img/a/AVvXsEjutSK4HPPoC64ZW0Do4Ab_4_tpaApbnWxP3HweF1RHrnRQ2LcN2TcfznjPdRJrEkOtGEVvcENlYGjifysxjTP9_sIN4w7ZM0XCOcqGYGZdn4WU8Bu0cm6BUClgvhD2pc_vgmmX-NSNaVls78LmtW7FUEVkzBwfL_B3hAcG3Rq4jsgOuhAwTweL4bkB=w640-h550",
        "additionalPrice": 5,
        "price": 5,
        "description": "50g",
        "quantity": 2,
        "groupTitle": "Adicionais"
      }
    ],
    "unitTotal": 37,
    "total": 37,
    "id": "2::Geleia de Pimenta Defumadax1:Dobro de Requeijãox2"
  }
]

renderProdutos(produtos)

function renderBadgeStatusPedido(status){
    switch(status.toLowerCase()){
        case "recebido":
            elements.statusPedido.textContent = "Em andamento"
            elements.statusPedido.classList.add("statusRecebido")
            break;
        case "aceito":
            elements.statusPedido.textContent = "Aceito"
            elements.statusPedido.classList.add("statusAceito")
            break;
        case "em preparo":
            elements.statusPedido.textContent = "Em preparo"
            elements.statusPedido.classList.add("statusEmPreparo")
            break;
        case "saiu para entrega":
            elements.statusPedido.textContent = "A caminho"            
            elements.statusPedido.classList.add("statusACaminho")
            break;
        case "finalizado":
            elements.statusPedido.textContent = "Entregue"
            elements.statusPedido.classList.add("statusFinalizado")
            break;
        case "cancelado":
            elements.statusPedido.textContent = "Cancelado"
            elements.statusPedido.classList.add("statusCancelado")
            break;
    }
}

function renderPedido(pedido){
    elements.pedidoId.textContent = pedido.idPedido;
    elements.totalPedido.forEach(total=>total.textContent = pedido.totalPrice);
    elements.enderecoCliente.textContent = pedido.address

    renderBadgeStatusPedido(pedido.status)
    renderProdutos(pedido.listaItens)
}

function renderProdutos(produtos){
    elements.produtosSec.innerHTML=""
    produtos.forEach(produto => {
        const produtoElem = elements.cardProdutoTemplate.content.cloneNode(true)

        produtoElem.querySelector("img").src = produto.image
        produtoElem.querySelector(".produtoTitle").textContent = produto.name
        produtoElem.querySelector(".produtoAdicionais").textContent = produto.adicionais.map(ad=>`${ad.title} (x${ad.quantity})`).join(", ")
        produtoElem.querySelector(".produtoQtd").textContent = produto.quantity

        elements.produtosSec.appendChild(produtoElem)
    });
}

elements.stars.forEach(star=>{
    star.addEventListener("mouseenter",(ev)=>{
        const value = ev.target.dataset.value
        elements.stars.forEach((star)=>{
            if(value>=star.dataset.value){
                star.classList.add("bi-star-fill")
                star.classList.remove("bi-star")
            }else{
                star.classList.remove("bi-star-fill")
                star.classList.add("bi-star")
            }
        })
    })

    star.addEventListener("mouseleave",(ev)=>{
        elements.stars.forEach((star)=>{
            if(state.stars>=star.dataset.value){
                star.classList.add("bi-star-fill")
                star.classList.remove("bi-star")
            }else{
                star.classList.remove("bi-star-fill")
                star.classList.add("bi-star")
            }
        })
    })

    star.addEventListener("click", (ev)=>{
        const value = ev.target.dataset.value
        state.stars=value;
        elements.stars.forEach(star=>{
            if(value>=star.dataset.value){
                star.classList.add("bi-star-fill")
                star.classList.remove("bi-star")
            }else{
                star.classList.remove("bi-star-fill")
                star.classList.add("bi-star")
            }
        })
    })
}
)