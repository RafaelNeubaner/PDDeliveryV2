import { useProducts } from "../../js/services/useProducts.js"

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

const produtos = await useProducts.findProdutos()
console.log(produtos)