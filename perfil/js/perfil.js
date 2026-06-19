import { getUserAuthenticated } from "../../js/services/useAuth.js"
import { createClient } from "../../js/services/useClients.js"

const user = await getUserAuthenticated();



var btn = document.querySelector(".saveBtn")

btn.addEventListener('click', ()=>{
    createClient({
        celphone: "35910025159",
        cpf: "121.111.111-11",
        dateBirth: "01/03/2005",
        email: "pedro2@gmail.com",
        nome: "Pedro Manoel",
        password: "Pedro123!"
    })
})