import {logout} from "../services/useAuth.js"
//import {cartApi} from "./carrinho/useCart.js"

const searchPlaceholderMedia = window.matchMedia("(max-width: 556px)")
const searchPlaceholderDefault = "O que você está procurando?"
const searchPlaceholderMobile = "Pesquisar..."

function updateSearchPlaceholders() {
    const placeholder = searchPlaceholderMedia.matches
        ? searchPlaceholderMobile
        : searchPlaceholderDefault

    document
        .querySelectorAll('header .containerSearch input[name="query"]')
        .forEach(input => {
            input.placeholder = placeholder
        })
}

updateSearchPlaceholders()

searchPlaceholderMedia.addEventListener("change", updateSearchPlaceholders)

document.querySelectorAll(".logoutBtn").forEach(btn=>{
    btn.addEventListener("click", (event)=>{
        event.preventDefault()
        logout()
        window.location.href = "/login/index.html"
    })
})

//cartApi.atualizarBadgeGlobal()
