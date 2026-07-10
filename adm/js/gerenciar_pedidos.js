import { usePedidos } from "../../js/services/usePedidos.js"


const status = [
    "Recebido",
    "Aceito",
    "Em Preparo",
    "Saiu para entrega",
    "Finalizado",
    "Recusado"
]

const state = {
    menuSelected: status[0]
}

const elements = {
    cardTemplateTemp: document.querySelector(".cardPedidoTemp"),
    pedidosSec: document.querySelector(".pedidosSec"),
    statusOptions: document.querySelector(".statusOptionsSec"),
    pedidosSec: document.querySelector(".pedidosSec"),
    btnAtualizar: document.querySelector(".btnAtualizarPagina"),
    //btnsSecondaryCardPedido: document.querySelectorAll(".secondaryBtnCardPedido"),
    loadingSec: document.querySelector(".loading")
}

var pedidos = []
var pedidosCat = {}

await getPedidos()

renderOptions()
renderPedidos()

function setActions(){
    
    elements.statusOptions.querySelectorAll("span").forEach(link=>{
        link.addEventListener('click', ev=>{
            state.menuSelected = ev.target.dataset.value
            renderOptions()
            renderPedidos()
        })
    })
    
    document.querySelectorAll(".primaryBtnCardPedido").forEach(btn=>{
        btn.addEventListener('click', async (ev)=>{
            const cardPedido = ev.target.closest(".cardPedido")
            const idPedido = cardPedido.dataset.idPedido
            const index = cardPedido.dataset.index

            const pedido = pedidosCat[state.menuSelected][index]

            if(pedido.id != idPedido){
                console.log("errado")
                return
            }

            switch(pedido.status){
                case "Recebido":
                    pedido.status = "Aceito"
                    break;
            }
            elements.loadingSec.classList.remove("hide")
            await usePedidos.updatePedido(idPedido, pedido)
            await getPedidos()
            renderPedidos()
            elements.loadingSec.classList.add("hide")
        })
    })

    document.querySelectorAll(".secondaryBtnCardPedido").forEach(btn=>{
        btn.addEventListener('click', async (ev)=>{
            const cardPedido = ev.target.closest(".cardPedido")
            const idPedido = cardPedido.dataset.idPedido
            const index = cardPedido.dataset.index

            const pedido = pedidosCat[state.menuSelected][index]

            if(pedido.id != idPedido){
                console.log("errado")
                return
            }

            switch(pedido.status){
                case "Recebido":
                    pedido.status = "Recusado"
                    break;
            }

            elements.loadingSec.classList.remove("hide")
            await usePedidos.updatePedido(idPedido, pedido)
            await getPedidos()
            renderPedidos()
            elements.loadingSec.classList.add("hide")
        })
    })

    elements.btnAtualizar.addEventListener('click', async ()=>{
        elements.loadingSec.classList.remove("hide")
        await getPedidos()
        renderPedidos()
        elements.loadingSec.classList.add("hide")
    })
}

async function getPedidos(){
    pedidos = await usePedidos.getAllPedidos();
    
    pedidosCat={}
    pedidos.forEach(pedido=>{
        if(!pedidosCat[pedido.status]){
            pedidosCat[pedido.status] = []
        }
        pedidosCat[pedido.status].push(pedido)
    })
}

function renderOptions(){
    elements.statusOptions.innerHTML=""
    status.forEach(s => {
        const el = document.createElement("span")
        const div = document.createElement("div")
        
        el.dataset.value=s
        el.textContent = s
        if(s==state.menuSelected){
            el.classList.add("active")
        }
        el.appendChild(div)
        
        elements.statusOptions.appendChild(el) 
    });

    
    setActions()
}

function renderBadgeStatusPedido(status, elem){
    switch(status.toLowerCase()){
        case "recebido":
            elem.textContent = "Em andamento"
            elem.classList.add("statusRecebido")
            break;
        case "aceito":
            elem.textContent = "Aceito"
            elem.classList.add("statusAceito")
            break;
        case "em preparo":
            elem.textContent = "Em preparo"
            elem.classList.add("statusEmPreparo")
            break;
        case "saiu para entrega":
            elem.textContent = "A caminho"            
            elem.classList.add("statusACaminho")
            break;
        case "finalizado":
            elem.textContent = "Entregue"
            elem.classList.add("statusFinalizado")
            break;
        case "recusado":
            elem.textContent = "Cancelado"
            elem.classList.add("statusCancelado")
            break;
    }
}

function renderPedidos(){
    elements.pedidosSec.innerHTML = ""

    const pedidosFiltered = pedidosCat[state.menuSelected]

    if(!pedidosFiltered || pedidosFiltered.length<=0){
        elements.pedidosSec.innerHTML = `<h4>Nenhum pedido encontrado para status ${state.menuSelected}</h4>`
        return;
    }

    pedidosFiltered.forEach((pedido, i)=>{
        const pedidoElem = elements.cardTemplateTemp.content.cloneNode(true).firstElementChild

        pedidoElem.dataset.idPedido = pedido.id
        pedidoElem.dataset.index = i
        pedidoElem.querySelector("img").src = pedido.listaItens[0].imagem
        pedidoElem.querySelector(".idPedido").textContent = pedido.id

        const data = new Date(pedido.horarioRealizado)

        pedidoElem.querySelector(".tempoPedido").textContent = data.toLocaleDateString("pt-BR")
        pedidoElem.querySelector(".precoPedido").textContent = pedido.resumoValores.total.toLocaleString('pt-BR', {style: 'currency', currency: "BRL" })
        pedidoElem.querySelector(".nomeCliente").textContent = pedido.nomeCliente
        renderBadgeStatusPedido(pedido.status, pedidoElem.querySelector(".badgeStatusPedido"))


        const primanryBtn = pedidoElem.querySelector(".primaryBtnCardPedido")
        const secondaryBtn = pedidoElem.querySelector(".secondaryBtnCardPedido")
        
        switch(pedido.status.toLowerCase()){
            case "recebido":
                secondaryBtn.classList.remove("hide")
                break;
            case "aceito":
                primanryBtn.textContent = "Iniciar Preparo"
                break;
            case "em preparo":
                primanryBtn.textContent = "Saiu para Entrega"
                break;
            case "saiu para entrega":
                primanryBtn.textContent = "Finalizar"
                break;

            case "recusado":
                primanryBtn.classList.add("hide")
        }

        elements.pedidosSec.appendChild(pedidoElem)

        
    })

    setActions()
}