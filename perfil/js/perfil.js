import { getUserAuthenticated } from "../../js/services/useAuth.js"
import { getLocationByCEP } from "../../js/services/useCep.js"
import { createClient, updateClient } from "../../js/services/useClients.js"
import { validarCPF, validarEmail, validarSenha, validarTelefone } from "../../login/js/verifiers.js"

const loading = document.querySelector(".loading")
const nameInp = document.getElementById("nomeInp")
const cpfInp = document.getElementById("cpfInp")
const cellInp = document.getElementById("celInp")
const emailInp = document.getElementById("emailInp")
const dateBirthInp = document.getElementById("birthdayInp")
const datePlaceholder = document.querySelector(".inputData").querySelector("p")

const passwordCont = document.querySelector(".passwordCont")
const confirmPasswordCont = document.querySelector(".confirmPasswordCont")
const newPasswordInp = document.getElementById("newPasswordInp")
const confirmPasswordInp = document.getElementById("confirmPasswordInp")

const cepInp = document.getElementById("cepInp")
const ruaInp = document.getElementById("ruaInp")
const bairroInp = document.getElementById("bairroInp")
const cidadeInp = document.getElementById("cidadeInp")
const estadoInp = document.getElementById("estadoInp")
const numeroInp = document.getElementById("numeroInp")
const complementoInp = document.getElementById("complementoInp")

loading.classList.remove("hide")
var user = await getUserAuthenticated();
console.log(user)
updateFields(user)
loading.classList.add("hide")

dateBirthInp.max = new Date().toISOString().split("T")[0]

var btn = document.querySelector(".saveBtn")
btn.addEventListener('click', saveData)

const changePassBtn = document.querySelector(".changePassBtn")
changePassBtn.addEventListener('click', changePassword)

cepInp.addEventListener("change", async (ev)=>{
    const cep = ev.target.value.replace("-", "")
    if(cep.length !== 8) return alert("Digite um cep válido")
    
    const location = await getLocationByCEP(cep)
    if(location.error) alert("CEP não encontrado")

    updateEndereco(location)
})

newPasswordInp.addEventListener("input", (ev)=>{
    setRequisitoSenhaValidated(document.querySelector(".letraMaiuscula"), /[A-Z]/.test(ev.target.value))
    setRequisitoSenhaValidated(document.querySelector(".letraMinuscula"), /[a-z]/.test(ev.target.value))
    setRequisitoSenhaValidated(document.querySelector(".numero"), /\d/.test(ev.target.value))
    setRequisitoSenhaValidated(document.querySelector(".caractereEspecial"), /[!@#$%^&*(),.?":{}|<>]/.test(ev.target.value))
    setRequisitoSenhaValidated(document.querySelector(".qtdCaracteres"), ev.target.value.length>=6)
    setRequisitoSenhaValidated(document.querySelector(".senhasCoincidem"), ev.target.value.length >= 6 && ev.target.value === confirmPasswordInp.value)
})

confirmPasswordInp.addEventListener("input", (ev)=>{
    setRequisitoSenhaValidated(document.querySelector(".senhasCoincidem"), ev.target.value.length >= 6 && ev.target.value === newPasswordInp.value)
})

async function changePassword(){
    if (   !newPasswordInp.value 
        || newPasswordInp.value == "" 
        || !confirmPasswordInp.value 
        || confirmPasswordInp.value==""
    ){
        return alert("Senhas não podem estar vazias")
    }

    if(newPasswordInp.value !== confirmPasswordInp.value){
        return alert("As senhas precisa ser idênticas")
    }

    if(!validarSenha(newPasswordInp.value)){
        return alert("Falta preencher alguns requisitos da senha")
    }

    loading.classList.remove("hide")
    user = await updateClient(user.id, {
        ...user,
        password: newPasswordInp.value
    })
    updateFields(user)
    loading.classList.add("hide")

    alert("Senha alterada com sucesso!");
}

passwordCont.querySelector("i").addEventListener('click', (ev)=>{changePasswordStatus(passwordCont)})
confirmPasswordCont.querySelector("i").addEventListener('click', (ev)=>{changePasswordStatus(confirmPasswordCont)})

const isMobile = /Android|Mobi|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

dateBirthInp.addEventListener("focus", (ev) => {
    if (isMobile) {
        datePlaceholder.style.display = "none";
    }
})

dateBirthInp.addEventListener("blur", (ev) => {
    if (isMobile && ev.target.value === "") {
        datePlaceholder.style.display = "block";
    }
})

dateBirthInp.addEventListener("input", (ev)=>{
    const ua = navigator.userAgent;
    console.log(ev.target.value)
    if(isMobile && ev.target.value=="" && !ev.target == document.activeElement){
        datePlaceholder.style.display="block"
    }else{
        datePlaceholder.style.display="none"
    }
    
})

function changePasswordStatus(comp){
    
    let input = comp.querySelector("input")
    let icon = comp.querySelector("i")
    if(input.type==="password"){
        input.type = 'text'
        icon.classList.remove("bi-eye")
        icon.classList.add("bi-eye-slash")
    }else{
        input.type = 'password'
        icon.classList.add("bi-eye")
        icon.classList.remove("bi-eye-slash")
    }

}

async function saveData(){
    if(!validarEmail(emailInp.value)) return alert("Email inválido")
    if(!validarCPF(cpfInp.value)) return alert("CPF Inválido")
    if(!validarTelefone(cellInp.value)) return alert("Telefone inválido")
    if(dateBirthInp.value === new Date().toISOString().split("T")[0] || dateBirthInp.value=="") return alert("Data de nascimento inválida")
    const userUpdated = {
        id: user.id,
        nome: nameInp.value ?? user.nome,
        email: emailInp.value ?? user.email,
        celphone: cellInp.value ?? user.celphone,
        cpf: cpfInp.value ?? user.cpf,
        dateBirth: dateBirthInp.value != new Date().toISOString().split("T")[0] ? dateBirthInp.value : user.dateBirth,
        password: user.password,
        endereco: {
            cep: cepInp.value ?? user.endereco.cep,
            rua: ruaInp.value ?? user.endereco.rua,
            numero: numeroInp.value ?? user.endereco.numero,
            bairro: bairroInp.value ?? user.endereco.bairro,
            cidade: cidadeInp.value ?? user.endereco.cidade,
            estado: estadoInp.value ?? user.endereco.estado,
            complemento: complementoInp.value ?? user.endereco.complemento
        }
    }

    loading.classList.remove("hide")
    user = await updateClient(user.id, userUpdated)
    console.log(user)
    updateFields(user)

    newPasswordInp.value=""
    confirmPasswordInp.value=""
    loading.classList.add("hide")

    alert("Dados atualizados com sucesso!");
}

function updateFields(user){
    nameInp.value = user.nome
    cpfInp.value = user.cpf
    cellInp.value = user.celphone
    emailInp.value = user.email

    if(user.dateBirth===""){
        document.querySelector(".inputData").querySelector("p").style.display="block"
    }else{
        document.querySelector(".inputData").querySelector("p").style.display="none"
        dateBirthInp.value = user.dateBirth ?? null
    }

    cepInp.value = user.endereco.cep
    ruaInp.value = user.endereco.rua
    bairroInp.value = user.endereco.bairro
    cidadeInp.value = user.endereco.cidade
    estadoInp.value = user.endereco.estado
    numeroInp.value = user.endereco.numero
    complementoInp.value = user.endereco.complemento
}

function updateEndereco(location){
    cepInp.value = location.cep
    ruaInp.value = location.logradouro
    bairroInp.value = location.bairro
    cidadeInp.value = location.localidade
    estadoInp.value = location.estado
}

function setRequisitoSenhaValidated(comp, validated){
    if(validated){
        comp.classList.add("validated")
        comp.querySelector("i").classList.remove("bi-x-circle")
        comp.querySelector("i").classList.add("bi-check-circle")
    }else{
        comp.classList.remove("validated")
        comp.querySelector("i").classList.add("bi-x-circle")
        comp.querySelector("i").classList.remove("bi-check-circle")
    }

}

