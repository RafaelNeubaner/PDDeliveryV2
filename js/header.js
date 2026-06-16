import {signOut} from "./services/useClients.js"
import {cartApi} from "./carrinho/useCart.js"

document.querySelectorAll(".logoutBtn").forEach(btn=>{
    btn.addEventListener("click", (event)=>{
        event.preventDefault()
        signOut()
        window.location.href = "/login/index.html"
    })
})

cartApi.atualizarBadgeGlobal()