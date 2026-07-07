# PD Delivery V2 - Sistema de Controle de Atendimentos para Lanchonete (delivery)

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)

## 📝 Descrição do Projeto
O **PD Delivery V2** é uma plataforma desenvolvida para modernizar a operação de estabelecimentos alimentícios. O sistema é dividido em duas áreas principais: a Área do Cliente, focada na realização de pedidos, e a Área do Lojista, voltada para a gerência de pedidos e do cardápio. O objetivo principal é criar uma plataforma onde os clientes possam fazer pedidos online, enquanto os lojistas gerenciam esses pedidos em tempo real e controlam o fluxo completo do atendimento.

O projeto está sendo desenvolvido pela equipe **Q1 Vênus – Manhã**:
* **Pablo Perdigão**
* **Rafael Neubaner**
* **Pedro Manoel**

---

## 🚀 Funcionalidades

### 👤 Área do Cliente
* **Cadastro e Login:** Criação de conta e autenticação de usuários na plataforma.
* **Visualização de Cardápio:** Listagem de todos os produtos disponíveis, exibindo nome, preço, descrição e imagem de cada item.
* **Realização de Pedidos:** Adição e remoção de itens no carrinho, alteração de quantidades, personalização de ingredientes extras e cálculo automático do valor total.
* **Acompanhamento de Pedidos:** Visualização do histórico dividido em seções de pedidos "Em andamento" e pedidos "Finalizados", com detalhes completos de status.
* **Gestão de Perfil:** Edição de dados cadastrais do cliente, como nome, email, senha e endereço.

### 🏪 Área do Lojista (Restrita)
* **Gestão de Cardápio (CRUD):** Formulários para cadastrar, editar, listar e excluir produtos do cardápio do estabelecimento.
* **Recepção de Pedidos:** Dashboard para visualizar a listagem de pedidos recém-chegados com o status "recebido".
* **Triagem:** Opção para o lojista aceitar ou recusar pedidos.
* **Atualização de Status:** Controle linear e sequencial do andamento do pedido, avançando pelas etapas: em preparo, saiu para entrega e finalizado.

---

## 🛠 Tecnologias Utilizadas
* **Linguagens:** HTML5, CSS3, JavaScript (ES6+)
* **Framework CSS:** Bootstrap 5
* **Persistência de Dados:** MockAPI
* **Comunicação:** Fetch API (Async/Await)
* **Versionamento:** Git & GitHub
* **Hospedagem:** Vercel

---

## 🔌 Integrações e APIs
1. **MockAPI:** Utilizada para persistência de dados de usuários, cardápio e controle de pedidos.

---

## 🏗 Arquitetura e Padrões

### Padrões de Nomenclatura
Definimos padrões a serem adotados para garantir a manutenibilidade do código:
* **Código:** Variáveis, funções e classes utilizam `camelCase`.
* **Estrutura:** Pastas, arquivos e branches utilizam `kebab-case`.

### 🗂️ Estrutura de Pastas
```text
📂 Lanchonete-App/
├── 📂 assets/  # Imagens e ícones
├── 📂 css/     # Arquivos de estilização
│   └── styles.css
├── 📂 js/      # Módulos e lógica de clientes e lojistas
│   └── script.js
├── 📂 pages/  # Páginas secundárias (kebab-case)
├── 📄 index.html  # Página principal
└── 📄 README.md   # Arquivo de docs
```
---

## 🚥 Governança e Fluxo de Trabalho
**Git Flow**
Seguimos o fluxo de branches para organização:

- `main:` Versão de produção (estável).
- `develop:` Integração de novas funcionalidades.
- `feat/*:` Desenvolvimento de funcionalidades específicas.

**Commits (Conventional Commits)**
As mensagens de commit devem seguir o padrão:
*tipo(escopo): descrição objetiva*

- `feat:` Nova funcionalidade.
- `fix:` Correção de erro.
- `docs:` Alteração em documentação.

# Acesso Cliente & Lojista

### 🧑‍💻 Acesso do Cliente
Para acessar a área do cliente, é necessário preencher os campos obrigatórios de cadastro: nome, email, senha, telefone e endereço.  PDF

- O email deve possuir um formato válido (usuário@dominio).  PDF
- A senha deve ter no mínimo 6 caracteres.  PDF
- O telefone deve conter apenas números e ter no mínimo 11 dígitos.  PDF

### 🏪 Acesso do Lojista
Para acessar a área administrativa, o lojista deve ter credenciais pré-cadastradas (fixas) no sistema. Utilize os dados abaixo para testes de homologação:  PDF

JSON

```
	{
		"email": "admin@pddelivery.com",
		"senha": "adminPdV2*"
	}
```

O login redirecionará automaticamente para o dashboard, garantindo a separação de responsabilidades, onde o lojista visualiza todos os pedidos, mas não pode fazer pedidos como cliente.  PDF

## 🔗 Links Úteis

- **Repositório:** [Link do Repositório]
- **Protótipos no Figma:** [Link do Figma]
- **Deploy (Vercel):** [Link do Deploy]

