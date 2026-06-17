import { loginCliente } from "../../js/services/useAuth.js";

const loading = document.querySelector(".loading")
const modalTermos = document.getElementById('termosModal');
const modalSenha = document.getElementById('modalRecuperarSenha');
const fecharModalTermos = document.getElementById('fecharModalTermos');
const fecharModalSenha = document.getElementById('sairModalSenha');
const verSenha = document.getElementById('verSenha');
const login = document.getElementById('loginUser');
const cpf = document.getElementById('loginUser');
const loginButton = document.getElementById('loginButton');

fecharModalTermos.addEventListener('click', function() {
    modalTermos.classList.remove('is-open');
});

fecharModalSenha.addEventListener('click', function() {
    modalSenha.classList.remove('is-open');
});

document.getElementById('abrirModalTermos').addEventListener('click', function(event) {
    event.preventDefault();
    modalTermos.classList.add('is-open');
});

document.getElementById('abrirModalSenha').addEventListener('click', function(event) {
    event.preventDefault();
    modalSenha.classList.add('is-open');
});

verSenha.addEventListener('click', function() {
    const passwordInput = document.getElementById('loginPassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        verSenha.classList.remove('bi-eye-slash');
        verSenha.classList.add('bi-eye');
    } else {
        passwordInput.type = 'password';
        verSenha.classList.remove('bi-eye');
        verSenha.classList.add('bi-eye-slash');
    }
});

loginButton.addEventListener('click', async function(event) {
    event.preventDefault();
    validarLogin()

    try{
        loading.classList.remove("hide")
        const result = await loginCliente(login.value.trim(), document.getElementById('loginPassword').value)
        loading.classList.add("hide")
        location.href="/"
        
    } catch(e){
        loading.classList.add("hide")
        alert(e.message)
    }
});

function validarLogin() {
    const valorLogin = login.value.trim();

    if (valorLogin.includes('@')) {
        if (!validarEmail(valorLogin)) {
            alert('Por favor, insira um Email ou CPF válido.');
            return false;
        }
    } else {
        if (!validarCPF(valorLogin)) {
            alert('Por favor, insira um CPF ou Emailválido.');
            return false;
        }
    }
    //adicionar a função de verificação da API aqui
    return true;
}

function validarCPF(cpf) {
    // Remove tudo que não for número
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica tamanho ou sequência inválida
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // Validação do primeiro dígito
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;

    if (digito1 !== parseInt(cpf.charAt(9))) {
        return false;
    }

    // Validação do segundo dígito
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;

    if (digito2 !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
