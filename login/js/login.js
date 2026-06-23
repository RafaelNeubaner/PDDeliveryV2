
import { loginCliente } from '../../js/services/useAuth.js';
import { getLocationByCEP } from '../../js/services/useCep.js';
import { createClient } from '../../js/services/useClients.js';
import {
  formatarTelefone,
  formatarCPF,
  formatarLoginSeForCPF,
  validarFormulario,
  validarLogin,
  setFieldError,
} from './verifiers.js';
const loading = document.querySelector(".loading")
const modalTermos = document.getElementById('termosModal');
const modalSenha = document.getElementById('modalRecuperarSenha');
const fecharModalTermos = document.getElementById('fecharModalTermos');
const fecharModalSenha = document.getElementById('sairModalSenha');
const abrirModalTermos = document.getElementById('abrirModalTermos');
const abrirModalSenha = document.getElementById('abrirModalSenha');
const form = document.getElementById('registrationForm');
const loginForm = document.querySelector('.login-form');
const formFeedback = document.getElementById('formFeedback');
const passwordInput = document.getElementById('login-password');
const confirmPasswordInput = document.getElementById('login-confirm-password');
const loginInput = document.getElementById('loginUser');
const loginPasswordInput = document.getElementById('loginPassword');
const loginButton = document.getElementById('loginButton');
const verSenha = document.querySelector('.verSenha');
const verSenhaConfirmar = document.getElementById('verSenhaConfirmar');
const telefoneInput = document.getElementById('loginTelefone');
const cpfInput = document.getElementById('loginCPF');

const requiredInputs = [
  'login-name',
  'loginEmail',
  'loginCPF',
  'loginNascimento',
  'loginTelefone',
  'loginCep',
  'loginEndereco',
  'loginNumero',
  'loginBairro',
  'loginCidade',
  'loginEstado',
  'login-password',
  'login-confirm-password',
].map((id) => document.getElementById(id));

document.getElementById("loginCep").addEventListener('change', async (ev)=>{
  const cep = ev.target.value;
  if(cep.includes("-") && cep.length==9 || !cep.includes("-") && cep.length==8){
    const location = await getLocationByCEP(cep.replace("-", ""))

    console.log(location)

    document.getElementById('loginEndereco').value = location.logradouro;
    document.getElementById('loginBairro').value = location.bairro;
    document.getElementById('loginCidade').value = location.localidade;
    document.getElementById('loginEstado').value = location.estado;

    document.getElementById('loginNumero').focus()
  }
})

const abrirModalTermosButton = document.getElementById('abrirModalTermos');
if (abrirModalTermosButton && modalTermos) {
  abrirModalTermosButton.addEventListener('click', function(event) {
    event.preventDefault();
    modalTermos.classList.add('is-open');
  });
}

const abrirModalSenhaButton = document.getElementById('abrirModalSenha');
if (abrirModalSenhaButton && modalSenha) {
  abrirModalSenhaButton.addEventListener('click', function(event) {
    event.preventDefault();
    modalSenha.classList.add('is-open');
  });
}

if (verSenha && loginPasswordInput) {
  verSenha.addEventListener('click', function() {
    if (loginPasswordInput.type === 'password') {
      loginPasswordInput.type = 'text';
      verSenha.classList.remove('bi-eye-slash');
      verSenha.classList.add('bi-eye');
    } else {
      loginPasswordInput.type = 'password';
      verSenha.classList.remove('bi-eye');
      verSenha.classList.add('bi-eye-slash');
    }
  });
}

if (loginButton) {
  loginButton.addEventListener('click', async function(event) {
    event.preventDefault();
    if (!validarLogin(event, { loginInput, loginPasswordInput })) {
      return;
    }

    const user = loginInput.value.trim();
    const password = loginPasswordInput.value.trim();
    const identifier = loginInput.value.trim();
    console.log({identifier, password})

    try {
      if (loading) {
        loading.classList.remove('hide');
      }

      await loginCliente(identifier, password);

      if (loading) {
        loading.classList.add('hide');
      }

      location.href = '/';
    } catch (e) {
      if (loading) {
        loading.classList.add('hide');
      }

      console.log(e);
      alert(e.message);
    }
  });
}


async function cadastrarUsuario() {
  const nome = document.getElementById('login-name').value.trim();
  const email = document.getElementById('loginEmail').value.trim();
  const cpf = document.getElementById('loginCPF').value.trim();
  const nascimento = document.getElementById('loginNascimento').value.trim();
  const telefone = document.getElementById('loginTelefone').value.trim();
  const cep = document.getElementById('loginCep').value.trim();
  const endereco = document.getElementById('loginEndereco').value.trim();
  const numero = document.getElementById('loginNumero').value.trim();
  const complementoInput = document.getElementById('loginComplemento');
  const bairro = document.getElementById('loginBairro').value.trim();
  const cidade = document.getElementById('loginCidade').value.trim();
  const estadoInput = document.getElementById('loginEstado');
  const senha = document.getElementById('login-password').value.trim();

  const client = {
    nome: nome,
    email: email,
    password: senha,
    celphone: telefone,
    cpf: cpf,
    dateBirth: nascimento,
    endereco: {
      cep: cep,
      rua: endereco,
      numero: numero,
      bairro: bairro,
      complemento: complementoInput ? complementoInput.value.trim() : '',
      cidade: cidade,
      estado: estadoInput ? estadoInput.value.trim() : '',
    },
  };

  return createClient(client);
}

if (fecharModalTermos && modalTermos) {
  fecharModalTermos.addEventListener('click', () => {
    modalTermos.classList.remove('is-open');
  });
}

if (fecharModalSenha && modalSenha) {
  fecharModalSenha.addEventListener('click', () => {
    modalSenha.classList.remove('is-open');
  });
}

if (abrirModalTermos && modalTermos) {
  abrirModalTermos.addEventListener('click', (event) => {
    event.preventDefault();
    modalTermos.classList.add('is-open');
  });
}

if (abrirModalSenha && modalSenha) {
  abrirModalSenha.addEventListener('click', (event) => {
    event.preventDefault();
    modalSenha.classList.add('is-open');
  });
}

if (verSenha && passwordInput) {
  verSenha.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    verSenha.classList.toggle('bi-eye-slash', !isPassword);
    verSenha.classList.toggle('bi-eye', isPassword);
  });
}

if (verSenhaConfirmar && confirmPasswordInput) {
  verSenhaConfirmar.addEventListener('click', () => {
    const isPassword = confirmPasswordInput.type === 'password';
    confirmPasswordInput.type = isPassword ? 'text' : 'password';
    verSenhaConfirmar.classList.toggle('bi-eye-slash', !isPassword);
    verSenhaConfirmar.classList.toggle('bi-eye', isPassword);
  });
}


if (telefoneInput) {
  telefoneInput.addEventListener('input', () => {
    formatarTelefone(telefoneInput);
    setFieldError(telefoneInput, false);
  });
}

if (cpfInput) {
  cpfInput.addEventListener('input', () => {
    formatarCPF(cpfInput);
    setFieldError(cpfInput, false);
  });
}

if (form) {
  form.addEventListener('submit', (event) => {
    validarFormulario(event, {
      requiredInputs,
      formFeedback,
      passwordInput,
      confirmPasswordInput,
      form,
      cadastrarUsuario,
    });
  });
}

if (loginButton) {
  loginButton.addEventListener('click', (event) => {
    if (!validarLogin(event, { loginInput, loginPasswordInput })) {
      event.preventDefault();
    }
  });
}

if (loginForm && !loginButton) {
  loginForm.addEventListener('submit', (event) => {
    if (!validarLogin(event, { loginInput, loginPasswordInput })) {
      event.preventDefault();
    }
  });
}

if (loginPasswordInput) {
  loginPasswordInput.addEventListener('input', () => {
    setFieldError(loginPasswordInput, false);
  });
  loginPasswordInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      loginButton.click();
    }
  });
}

if (loginInput) {
  loginInput.addEventListener('input', () => {
    formatarLoginSeForCPF(loginInput);
    setFieldError(loginInput, false);
  });
}