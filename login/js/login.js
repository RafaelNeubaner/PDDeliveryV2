
import { createClient } from '/js/services/useClients.js';
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
const verSenha = document.getElementById('verSenha');
const verSenhaConfirmar = document.getElementById('verSenhaConfirmar');

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

function clearAllErrors() {
  requiredInputs.forEach((input) => setFieldError(input, false));
  formFeedback.textContent = '';
  formFeedback.classList.remove('is-error');
}

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
    validarLogin()

    try{
      if (loading) {
      loading.classList.remove("hide")
      }
      const result = await loginCliente(loginInput.value.trim(), document.getElementById('loginPassword').value)
      if (loading) {
      loading.classList.add("hide")
      }
      location.href="/"
          
    } catch(e){
      if (loading) {
      loading.classList.add("hide")
      }
      alert(e.message)
    }
  });
}


function setFieldError(input, isInvalid) {
  if (!input) {
    return;
  }

  input.classList.toggle('inputError', isInvalid);
  
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarCPF(cpf) {
  const digitsOnly = cpf.replace(/\D/g, '');

  if (digitsOnly.length !== 11 || /^(\d)\1+$/.test(digitsOnly)) {
    return false;
  }

  let soma = 0;
  for (let index = 0; index < 9; index += 1) {
    soma += Number(digitsOnly.charAt(index)) * (10 - index);
  }

  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;

  if (digito1 !== Number(digitsOnly.charAt(9))) {
    return false;
  }

  soma = 0;
  for (let index = 0; index < 10; index += 1) {
    soma += Number(digitsOnly.charAt(index)) * (11 - index);
  }

  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;

  return digito2 === Number(digitsOnly.charAt(10));
}

function validarTelefone(telefone) {
  const digitsOnly = telefone.replace(/\D/g, '');
  return digitsOnly.length >= 11;
}

function validarSenha(senha) {
  return senha.length >= 6;
}

function validarLoginEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarLoginCpf(cpf) {
  const digitsOnly = cpf.replace(/\D/g, '');
  return validarCPF(digitsOnly);
}

function formatarTelefone(input) {
  const digitsOnly = input.value.replace(/\D/g, '').slice(0, 11);
  const formatted = digitsOnly
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');

  input.value = formatted;
}

function formatarCPF(input) {
  const digitsOnly = input.value.replace(/\D/g, '').slice(0, 11);
  const formatted = digitsOnly
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  input.value = formatted;
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

async function validarFormulario(event) {
  event.preventDefault();
  clearAllErrors();

  if (!validarEmail(document.getElementById('loginEmail').value.trim())) {
    const emailInput = document.getElementById('loginEmail');
    setFieldError(emailInput, true);
    formFeedback.textContent = 'Email inválido. Por favor, insira um email válido.';
    formFeedback.classList.add('is-error');
    return;
  }

  const cpfInput = document.getElementById('loginCPF');
  if (!validarCPF(cpfInput.value)) {
    setFieldError(cpfInput, true);
    formFeedback.textContent = 'CPF inválido. Por favor, insira um CPF válido.';
    formFeedback.classList.add('is-error');
    return;
  }

  const telefoneInput = document.getElementById('loginTelefone');
  if (!validarTelefone(telefoneInput.value)) {
    setFieldError(telefoneInput, true);
    formFeedback.textContent = 'Telefone inválido. Por favor, insira um telefone válido.';
    formFeedback.classList.add('is-error');
    return;
  }

  const senha = passwordInput.value;
  const confirmarSenha = confirmPasswordInput.value;

  if (!validarSenha(senha)) {
    setFieldError(passwordInput, true);
    formFeedback.textContent = 'Sua senha deve ter no mínimo 6 caracteres, incluindo letras e números maiúsculos e minúsculos e caracteres especiais.';
    formFeedback.classList.add('is-error');
    return;
  }

  if (senha !== confirmarSenha) {
    setFieldError(confirmPasswordInput, true);
    formFeedback.textContent = 'As senhas devem ser iguais.';
    formFeedback.classList.add('is-error');
    return;
  }

  try {
    await cadastrarUsuario();
    location.href = "/login/index.html";
    form.reset();
    formFeedback.textContent = 'Cadastro realizado com sucesso.';
    formFeedback.classList.remove('is-error');
  } catch (error) {
    formFeedback.textContent = error.message || 'Não foi possível cadastrar o usuário.';
    formFeedback.classList.add('is-error');
  }
}

function validarLogin(event) {
  if (event) {
    event.preventDefault();
  }

  if (!loginInput || !loginPasswordInput) {
    return;
  }

  const valorLogin = loginInput.value.trim();
  const senha = loginPasswordInput.value.trim();

  loginInput.classList.remove('inputError');
  loginPasswordInput.classList.remove('inputError');

  if (!valorLogin || !senha) {
    if (!valorLogin) {
      loginInput.classList.add('inputError');
    }

    if (!senha) {
      loginPasswordInput.classList.add('inputError');
    }

    return false;
  }

  if (valorLogin.includes('@')) {
    if (!validarLoginEmail(valorLogin)) {
        loginInput.classList.add('inputError');
        alert('Por favor, insira um Email ou CPF válido.');
      return false;
    }
  } else if (!validarLoginCpf(valorLogin)) {
      loginInput.classList.add('inputError');
      alert('Por favor, insira um Email ou CPF válido.');
    return false;
  }
    
  return true;
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

const telefoneInput = document.getElementById('loginTelefone');
const cpfInput = document.getElementById('loginCPF');

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
  form.addEventListener('submit', validarFormulario);
}

if (loginButton) {
  loginButton.addEventListener('click', (event) => {
    if (!validarLogin(event)) {
      event.preventDefault();
    }
  });
}

if (loginForm && !loginButton) {
  loginForm.addEventListener('submit', (event) => {
    if (!validarLogin(event)) {
      event.preventDefault();
    }
  });
}