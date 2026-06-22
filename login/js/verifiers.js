function setFieldError(input, isInvalid) {
	if (!input) {
		return;
	}

	input.classList.toggle('inputError', isInvalid);
}

function clearAllErrors(requiredInputs, formFeedback) {
	requiredInputs.forEach((input) => setFieldError(input, false));
	formFeedback.textContent = '';
	formFeedback.classList.remove('is-error');
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

function formatarLoginSeForCPF(input) {
	if (!input) {
		return;
	}

	const valorAtual = input.value.trim();

	if (valorAtual.includes('@')) {
		return;
	}

	const apenasNumeros = valorAtual.replace(/\D/g, '');

	if (apenasNumeros.length === 0) {
		return;
	}

	const cpfFormatado = apenasNumeros
		.slice(0, 11)
		.replace(/^(\d{3})(\d)/, '$1.$2')
		.replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

	input.value = cpfFormatado;
}

async function validarFormulario(event, context) {
	const {
		requiredInputs,
		formFeedback,
		passwordInput,
		confirmPasswordInput,
		form,
		cadastrarUsuario,
	} = context;

	event.preventDefault();
	clearAllErrors(requiredInputs, formFeedback);

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
		location.href = '/login/index.html';
		form.reset();
		formFeedback.textContent = 'Cadastro realizado com sucesso.';
		formFeedback.classList.remove('is-error');
	} catch (error) {
		formFeedback.textContent = error.message || 'Não foi possível cadastrar o usuário.';
		formFeedback.classList.add('is-error');
	}
}

function validarLogin(event, context) {
	const { loginInput, loginPasswordInput } = context;

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

export {
	clearAllErrors,
	setFieldError,
	validarEmail,
	validarCPF,
	validarTelefone,
	validarSenha,
	validarLoginEmail,
	validarLoginCpf,
	formatarTelefone,
	formatarCPF,
	formatarLoginSeForCPF,
	validarFormulario,
	validarLogin,
};
