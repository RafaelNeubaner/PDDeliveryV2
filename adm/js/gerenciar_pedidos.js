import { usePedidos } from "../../js/services/usePedidos.js"


const status = [
    "Recebido",
    "Confirmado",
    "Em Preparação",
    "A caminho",
    "Entregue",
    "Todos"
]

const state = {
    menuSelected: status[0]
}

const elements = {
    pedidoId: document.querySelector(".idPedido"),
    tempoPedido: document.querySelector(".tempoPedido")
}

var pedidos = await usePedidos.getAllPedidos();
var pedidosCat = {}
pedidos.forEach(pedido=>{
    console.log(!pedidosCat[pedido.status])
    if(!pedidosCat[pedido.status]){
        pedidosCat[pedido.status] = []
    }
    pedidosCat[pedido.status].push(pedido)
})

console.log(pedidosCat)
const statusOptions = document.querySelector(".statusOptionsSec")
const pedidosSec = document.querySelector(".pedidosSec")

status.forEach(s => {
    const el = document.createElement("span")
    const div = document.createElement("div")

    el.textContent = s
    if(s==state.menuSelected){
        el.classList.add("active")
    }
    el.appendChild(div)

    statusOptions.appendChild(el)

});