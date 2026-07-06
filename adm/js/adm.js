import { logout } from "../../js/services/useAuth.js";
import { useProducts } from "../../js/services/useProducts.js"

// ===== DOM ELEMENTS =====
const cardProdutoTemp = document.querySelector(".cardProdutoTemp")
const produtosContainer = document.querySelector(".produtosContainer")

// Modal Criar/Editar
const modalProduto = document.getElementById("modalProduto")
const modalProdutoTitle = document.getElementById("modalProdutoTitle")
const formProduto = document.getElementById("formProduto")
const btnCriarProduto = document.getElementById("btnCriarProduto")
const btnVoltarProduto = document.getElementById("btnVoltarProduto")
const btnSubmitProduto = document.getElementById("btnSubmitProduto")
const btnImagePreview = document.getElementById("btnImagePreview")
const imagePreviewContainer = document.getElementById("imagePreviewContainer")
const imagePreview = document.getElementById("imagePreview")

// Inputs do form
const inputImage = document.getElementById("produtoImage")
const inputNome = document.getElementById("produtoNome")
const inputCategoria = document.getElementById("produtoCategoria")
const inputPreco = document.getElementById("produtoPreco")
const inputDesconto = document.getElementById("produtoDesconto")
const inputDescricao = document.getElementById("produtoDescricao")

// Opcionais
const btnAddTipoAdicional = document.getElementById("btnAddTipoAdicional")
const inputNovoTipo = document.getElementById("novoTipoAdicional")
const opcionaisContainer = document.getElementById("opcionaisContainer")
const templateGrupoOpcional = document.getElementById("templateGrupoOpcional")
const templateOpcaoRow = document.getElementById("templateOpcaoRow")

// Modal Excluir
const modalExcluir = document.getElementById("modalExcluir")
const btnCancelarExcluir = document.getElementById("btnCancelarExcluir")
const btnConfirmarExcluir = document.getElementById("btnConfirmarExcluir")

// Toast
const toastContainer = document.getElementById("toastContainer")
const toastMessage = document.getElementById("toastMessage")
const toastText = document.getElementById("toastText")

// ===== STATE =====
let editingProductId = null  // null = criar, ID = editar
let deletingProductId = null
let opcionaisData = []       // Array de grupos de opcionais no modal

// ===== NAVIGATION =====
addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navLink');
    const pedidosSection = document.getElementById('gerenciarPedidos');
    const produtosSection = document.getElementById('gerenciarProdutos');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            if (this.textContent === 'Gerenciar Pedidos') {
                pedidosSection.classList.remove('hidden');
                pedidosSection.classList.add('visible');
                produtosSection.classList.remove('visible');
                produtosSection.classList.add('hidden');
            } else {
                produtosSection.classList.remove('hidden');
                produtosSection.classList.add('visible');
                pedidosSection.classList.remove('visible');
                pedidosSection.classList.add('hidden');
            }
        });
    });
});

// ===== SEARCH =====
document.getElementById("searchInput").addEventListener("input", async (ev) => {
    produtos = await useProducts.findProdutos(ev.target.value)
    renderProdutos()
})

// ===== LOGOUT =====
document.querySelector(".logoutButton").addEventListener("click", async (ev) => {
    logout()
    location.href = "/"
})

// ===== INITIAL LOAD =====
var produtos = await useProducts.findProdutos()
renderProdutos()

// ===== RENDER PRODUCTS =====
function renderProdutos() {
    produtosContainer.innerHTML = ""
    if (produtos.length <= 0) {
        produtosContainer.innerHTML = "<h3>Nenhum produto cadastrado</h3>"
    }
    produtos.forEach((prod, index) => createProdutoCard(prod, index))
}

function createProdutoCard(prod, index) {
    const produtoComp = cardProdutoTemp.content.cloneNode(true).firstElementChild

    produtoComp.setAttribute("id", `prod-${prod.id}`)
    produtoComp.querySelector("img").src = prod.image
    produtoComp.querySelector(".titleProduto").textContent = prod.name
    produtoComp.querySelector(".priceProduto").textContent = `${prod.initialPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`

    // Botão Editar
    produtoComp.querySelector(".btnEditar").addEventListener("click", () => {
        openEditModal(prod)
    })

    // Botão Excluir
    produtoComp.querySelector(".btnExcluir").addEventListener("click", () => {
        openDeleteModal(prod.id)
    })

    produtosContainer.appendChild(produtoComp)
}

// ===== TOAST =====
function showToast(message) {
    toastText.textContent = message
    toastMessage.classList.remove("closing")
    toastMessage.classList.add("active")

    setTimeout(() => {
        toastMessage.classList.add("closing")
        setTimeout(() => {
            toastMessage.classList.remove("active", "closing")
        }, 350)
    }, 3000)
}

// ===== MODAL HELPERS =====
function openModal(modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
}

function closeModal(modal) {
    modal.classList.remove("active")
    document.body.style.overflow = ""
}

// ===== MODAL CRIAR PRODUTO =====
btnCriarProduto.addEventListener("click", () => {
    editingProductId = null
    modalProdutoTitle.textContent = "Criar Produto"
    btnSubmitProduto.textContent = "Cadastrar"
    resetForm()
    openModal(modalProduto)
})

// ===== MODAL EDITAR PRODUTO =====
function openEditModal(product) {
    editingProductId = product.id
    modalProdutoTitle.textContent = "Editar Produto"
    btnSubmitProduto.textContent = "Confirmar"
    resetForm()

    // Preencher campos com dados existentes
    inputImage.value = product.image || ""
    inputNome.value = product.name || ""
    inputCategoria.value = product.category || ""
    inputPreco.value = product.initialPrice || ""
    inputDesconto.value = product.discount || ""
    inputDescricao.value = product.description || product.descricao || ""

    // Preencher opcionais se existirem (API usa product.options com title/multiSelection/aditionalPrice)
    const productOptions = product.options || product.additionalOptions || []
    if (Array.isArray(productOptions) && productOptions.length > 0) {
        productOptions.forEach(group => {
            const groupData = {
                name: group.title || group.name || "",
                multiSelect: group.multiSelection !== undefined ? group.multiSelection : (group.multiSelect || false),
                required: group.required || false,
                options: (group.options || []).map(opt => ({
                    name: opt.title || opt.name || "",
                    description: opt.description || "",
                    price: opt.aditionalPrice || opt.price || "",
                    image: opt.image || "",
                    confirmed: true
                }))
            }
            opcionaisData.push(groupData)
            renderGrupoOpcional(groupData, opcionaisData.length - 1)
        })
    }

    // Mostrar preview da imagem se existir
    if (product.image) {
        imagePreview.src = product.image
        imagePreviewContainer.classList.add("active")
    }

    openModal(modalProduto)
}

// ===== FECHAR MODAL PRODUTO =====
btnVoltarProduto.addEventListener("click", () => {
    closeModal(modalProduto)
})

// Fechar ao clicar fora
modalProduto.addEventListener("click", (e) => {
    if (e.target === modalProduto) closeModal(modalProduto)
})

// ===== PREVIEW DE IMAGEM =====
btnImagePreview.addEventListener("click", () => {
    const url = inputImage.value.trim()
    if (url) {
        imagePreview.src = url
        imagePreviewContainer.classList.add("active")
        imagePreview.onerror = () => {
            imagePreviewContainer.classList.remove("active")
        }
    } else {
        imagePreviewContainer.classList.remove("active")
    }
})

// ===== RESET FORM =====
function resetForm() {
    formProduto.reset()
    inputImage.value = ""
    inputNome.value = ""
    inputCategoria.value = ""
    inputPreco.value = ""
    inputDesconto.value = ""
    inputDescricao.value = ""
    imagePreviewContainer.classList.remove("active")
    opcionaisContainer.innerHTML = ""
    opcionaisData = []
}

// ===== SUBMIT FORM (CRIAR OU EDITAR) =====
formProduto.addEventListener("submit", async (e) => {
    e.preventDefault()

    const nome = inputNome.value.trim()
    const preco = parseFloat(inputPreco.value)

    if (!nome) {
        inputNome.classList.add("inputError")
        return
    }
    inputNome.classList.remove("inputError")

    if (!preco || preco <= 0) {
        inputPreco.classList.add("inputError")
        return
    }
    inputPreco.classList.remove("inputError")

    // Montar objeto do produto (salvar no formato que a API/detalhes-produto espera)
    const productData = {
        name: nome,
        initialPrice: preco,
        image: inputImage.value.trim() || "",
        category: inputCategoria.value.trim() || "",
        discount: parseFloat(inputDesconto.value) || 0,
        description: inputDescricao.value.trim() || "",
        options: opcionaisData.map(group => ({
            title: group.name,
            multiSelection: group.multiSelect,
            required: group.required,
            options: group.options.map(opt => ({
                title: opt.name,
                description: opt.description,
                aditionalPrice: parseFloat(opt.price) || 0,
                image: opt.image || ""
            }))
        }))
    }

    try {
        if (editingProductId) {
            // EDITAR
            await useProducts.updateProduto(editingProductId, productData)
            closeModal(modalProduto)
            showToast("Dados atualizados!")
        } else {
            // CRIAR
            await useProducts.createProduto(productData)
            closeModal(modalProduto)
            showToast("Produto cadastrado!")
        }

        // Recarregar lista
        produtos = await useProducts.findProdutos()
        renderProdutos()
    } catch (error) {
        console.error("Erro ao salvar produto:", error)
        alert("Erro ao salvar produto. Tente novamente.")
    }
})

// ===== MODAL EXCLUIR =====
function openDeleteModal(productId) {
    deletingProductId = productId
    openModal(modalExcluir)
}

btnCancelarExcluir.addEventListener("click", () => {
    deletingProductId = null
    closeModal(modalExcluir)
})

modalExcluir.addEventListener("click", (e) => {
    if (e.target === modalExcluir) {
        deletingProductId = null
        closeModal(modalExcluir)
    }
})

btnConfirmarExcluir.addEventListener("click", async () => {
    if (!deletingProductId) return

    try {
        await useProducts.deleteProduto(deletingProductId)
        closeModal(modalExcluir)
        showToast("Produto excluído!")

        // Recarregar lista
        produtos = await useProducts.findProdutos()
        renderProdutos()
    } catch (error) {
        console.error("Erro ao excluir produto:", error)
        alert("Erro ao excluir produto. Tente novamente.")
    } finally {
        deletingProductId = null
    }
})

// ===== GERENCIAMENTO DE OPCIONAIS =====

// Adicionar novo tipo adicional
btnAddTipoAdicional.addEventListener("click", () => {
    const tipoNome = inputNovoTipo.value.trim()
    if (!tipoNome) {
        inputNovoTipo.classList.add("inputError")
        return
    }
    inputNovoTipo.classList.remove("inputError")

    const groupData = {
        name: tipoNome,
        multiSelect: false,
        required: false,
        options: []
    }

    opcionaisData.push(groupData)
    renderGrupoOpcional(groupData, opcionaisData.length - 1)
    inputNovoTipo.value = ""
})

// Renderizar grupo opcional no DOM
function renderGrupoOpcional(groupData, groupIndex) {
    const grupoEl = templateGrupoOpcional.content.cloneNode(true).firstElementChild
    grupoEl.setAttribute("data-group-index", groupIndex)

    // Nome do grupo
    grupoEl.querySelector(".grupoNome").textContent = groupData.name

    // Toggle collapse
    const toggleBtn = grupoEl.querySelector(".grupoToggleBtn")
    toggleBtn.addEventListener("click", () => {
        grupoEl.classList.toggle("collapsed")
    })

    // Toggle Multi Seleção
    const multiToggle = grupoEl.querySelector(".toggleMultiSelecao")
    multiToggle.checked = groupData.multiSelect
    multiToggle.addEventListener("change", () => {
        opcionaisData[groupIndex].multiSelect = multiToggle.checked
    })

    // Toggle Obrigatório
    const obrigToggle = grupoEl.querySelector(".toggleObrigatorio")
    obrigToggle.checked = groupData.required
    obrigToggle.addEventListener("change", () => {
        opcionaisData[groupIndex].required = obrigToggle.checked
    })

    // Contador de opções
    updateGroupCount(grupoEl, groupData)

    // Botão adicionar opção
    grupoEl.querySelector(".btnAddOpcao").addEventListener("click", () => {
        addOpcaoRow(grupoEl, groupIndex)
    })

    // Botão remover grupo
    grupoEl.querySelector(".btnRemoveGrupo").addEventListener("click", () => {
        opcionaisData.splice(groupIndex, 1)
        grupoEl.remove()
        reindexGroups()
    })

    // Renderizar opções existentes
    if (groupData.options && groupData.options.length > 0) {
        groupData.options.forEach((opt, optIndex) => {
            addOpcaoRow(grupoEl, groupIndex, opt)
        })
    }

    opcionaisContainer.appendChild(grupoEl)
}

// Adicionar linha de opção
function addOpcaoRow(grupoEl, groupIndex, optData = null) {
    const row = templateOpcaoRow.content.cloneNode(true).firstElementChild
    const tbody = grupoEl.querySelector("tbody")
    const optIndex = tbody.querySelectorAll(".opcaoRow").length

    row.querySelector(".opcaoIndex").textContent = optIndex + 1

    const inputNomeOpt = row.querySelector(".opcaoNome")
    const inputDesc = row.querySelector(".opcaoDescricao")
    const inputPrecoOpt = row.querySelector(".opcaoPreco")

    // Se pré-preenchido (edição)
    if (optData) {
        inputNomeOpt.value = optData.name || ""
        inputDesc.value = optData.description || ""
        inputPrecoOpt.value = optData.price || ""

        if (optData.confirmed) {
            row.classList.add("confirmed")
            inputNomeOpt.readOnly = true
            inputDesc.readOnly = true
            inputPrecoOpt.readOnly = true
        }
    }

    // Adicionar dados ao array
    if (!optData) {
        opcionaisData[groupIndex].options.push({
            name: "",
            description: "",
            price: "",
            confirmed: false
        })
    }

    // Botão confirmar
    row.querySelector(".btnOpcaoConfirmar").addEventListener("click", () => {
        const idx = getCurrentOptIndex(row)
        opcionaisData[groupIndex].options[idx] = {
            name: inputNomeOpt.value.trim(),
            description: inputDesc.value.trim(),
            price: inputPrecoOpt.value.trim(),
            confirmed: true
        }
        row.classList.add("confirmed")
        inputNomeOpt.readOnly = true
        inputDesc.readOnly = true
        inputPrecoOpt.readOnly = true
        updateGroupCount(grupoEl, opcionaisData[groupIndex])
    })

    // Botão editar
    row.querySelector(".btnOpcaoEditar").addEventListener("click", () => {
        row.classList.remove("confirmed")
        inputNomeOpt.readOnly = false
        inputDesc.readOnly = false
        inputPrecoOpt.readOnly = false
        inputNomeOpt.focus()
    })

    // Botão excluir
    row.querySelector(".btnOpcaoExcluir").addEventListener("click", () => {
        const idx = getCurrentOptIndex(row)
        opcionaisData[groupIndex].options.splice(idx, 1)
        row.remove()
        reindexOptions(grupoEl)
        updateGroupCount(grupoEl, opcionaisData[groupIndex])
    })

    tbody.appendChild(row)
    updateGroupCount(grupoEl, opcionaisData[groupIndex])
}

// Obter índice atual da opção na tabela
function getCurrentOptIndex(row) {
    const tbody = row.closest("tbody")
    const rows = Array.from(tbody.querySelectorAll(".opcaoRow"))
    return rows.indexOf(row)
}

// Reindexar opções após exclusão
function reindexOptions(grupoEl) {
    const rows = grupoEl.querySelectorAll(".opcaoRow")
    rows.forEach((row, i) => {
        row.querySelector(".opcaoIndex").textContent = i + 1
    })
}

// Atualizar contador de opções
function updateGroupCount(grupoEl, groupData) {
    const count = groupData.options.length
    grupoEl.querySelector(".grupoOpcaoCount").textContent = `${count} ${count === 1 ? 'opção' : 'opções'}`
}

// Reindexar grupos após remoção
function reindexGroups() {
    const groups = opcionaisContainer.querySelectorAll(".grupoOpcional")
    groups.forEach((g, i) => {
        g.setAttribute("data-group-index", i)
    })
}
