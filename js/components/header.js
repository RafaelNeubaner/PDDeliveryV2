import {logout} from "../services/useAuth.js"
//import {cartApi} from "./carrinho/useCart.js"

document.querySelectorAll(".logoutBtn").forEach(btn=>{
    btn.addEventListener("click", (event)=>{
        event.preventDefault()
        logout()
        window.location.href = "/login/index.html"
    })
})

//cartApi.atualizarBadgeGlobal()