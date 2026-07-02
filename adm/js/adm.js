import { useProducts } from "../../js/services/useProducts.js"

const cardProdutoTemp = document.querySelector(".cardProdutoTemp")
const produtosContainer = document.querySelector(".produtosContainer")



addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navLink');
    const pedidosSection = document.getElementById('gerenciarPedidos');
    const produtosSection = document.getElementById('gerenciarProdutos');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            if (this.textContent === 'Gerenciar Pedidos') {
                pedidosSection.classList.remove('hidden');
                pedidosSection.classList.add('visible');
                produtosSection.classList.remove('visible');
                produtosSection.classList.add('hidden');
            } else {
                produtosSection.classList.remove('hidden');
                produtosSection.classList.add('visible');
                pedidosSection.classList.remove('visible');
                pedidosSection.classList.add('hidden');
            }
        });
    });
});

document.getElementById("searchInput").addEventListener("input", async (ev)=>{
    produtos = await useProducts.findProdutos(ev.target.value)
    renderProdutos()
})

var produtos = await useProducts.findProdutos()
renderProdutos()

function renderProdutos(){
    produtosContainer.innerHTML = ""
    produtos.forEach((prod, index)=> createProdutoCard(prod, index))
}


function createProdutoCard(prod, index){
    const produtoComp = cardProdutoTemp.content.cloneNode(true).firstElementChild

    produtoComp.setAttribute("id", `prod-${prod.id}`)
    produtoComp.querySelector("img").src = prod.image
    produtoComp.querySelector(".titleProduto").textContent = prod.name
    produtoComp.querySelector(".priceProduto").textContent = `R$ ${prod.initialPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`

    produtosContainer.appendChild(produtoComp)
}

