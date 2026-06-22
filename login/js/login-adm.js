

// Credenciais Lojista

const ADMIN_CREDENTIALS = {
    email: 'admin@pddelivery.com',
    password: 'adminPdV2'
};

const modalSenha = document.getElementById('modalRecuperarSenha');
const fecharModalSenha = document.getElementById('sairModalSenha');
const verSenha = document.getElementById('verSenha');
const loginInput = document.getElementById('loginUser');
const passwordInput = document.getElementById('loginPassword');
const loginButton = document.getElementById('loginButton');
const btnAbrirSenha = document.getElementById('abrirModalSenha');


if (btnAbrirSenha && modalSenha) {
    btnAbrirSenha.addEventListener('click', function(event) {
        event.preventDefault();
        modalSenha.classList.add('is-open');
    });
}

if (fecharModalSenha && modalSenha) {
    fecharModalSenha.addEventListener('click', function() {
        modalSenha.classList.remove('is-open');
    });
}

if (verSenha) {
    verSenha.addEventListener('click', function() {
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
}


if (loginButton) {
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();

        if (validarFormatacao()) {
            autenticarLojista();
        }
    });
}

function validarFormatacao() {
    const emailValor = loginInput.value.trim();
    const senhaValor = passwordInput.value;

    if (!emailValor || !validarEmail(emailValor)) {
        alert('Por favor, insira um e-mail administrativo válido.');
        return false;
    }

    if (!senhaValor) {
        alert('A senha é obrigatória.');
        return false;
    }
    
    return true;
}

function autenticarLojista() {
    const emailInformado = loginInput.value.trim();
    const senhaInformada = passwordInput.value;

    if (emailInformado === ADMIN_CREDENTIALS.email && senhaInformada === ADMIN_CREDENTIALS.password) {
        
        sessionStorage.setItem('lojistaAutenticado', 'true');
        sessionStorage.setItem('lojistaEmail', emailInformado);

        window.location.href = '../../adm/index.html'; 
        
    } else {

        alert('Credenciais inválidas');
    }
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}