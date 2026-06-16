
/**
 * 
 * @typedef {Object} Client
 * 
 * @property {string} id
 * @property {string} nome
 * @property {string} email
 * @property {string} password
 * @property {string} celphone
 * @property {string} cpf
 * @property {Date} dateBirth
 * @property {Endereco} endereco
 */

/**
 * 
 * @typedef {Object} Endereco
 * 
 * @property {string} cep
 * @property {string} rua
 * @property {string} numero
 * @property {string} bairro
 * @property {string} complemento
 * @property {string} cidade
 * @property {string} estado
 */

const BASE_URL = ""
const URL_CLIENTS = `${BASE_URL}/clientes`

/**
 * @param {Client} client
 * 
 * @returns {Client}
 */
async function createClient(client){

    //Validações dos dados
    if(!client.nome || client.nome === "") throw Error("Faltam informações: Nome")

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    if(!emailRegex.test(client.email)) throw Error("Formato do email inválido")

    var senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/i;
    if(!senhaRegex.test(client.password)) throw Error("Senha não cumpre os requisitos")

    var cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/i;
    if(!cpfRegex.test(client.cpf)) throw Error("CPF inválido")


    // Requisição para a API
    const response = await fetch("/api/createClient",{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(client)
    })

    return await response.json()
}


/**
 * 
 * @param {string} id 
 * @returns {Client}
 */
async function getClient(id){
    const response = await fetch("/api/getClient?id="+id, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })

    if (response.status != 200){
        return null
    }

    const client = await response.json()
    return client;
}


/**
 * 
 * @param {Object} credenciais 
 * @param {string} credenciais.identifier
 * @param {string} credenciais.password
 * @returns 
 */
async function signInClient(credenciais){

    if(!credenciais.identifier || credenciais.identifier === "") throw Error("Identificador vazio")
    if(!credenciais.password || credenciais.password === "") throw Error("Senha vazia")

    const response = await fetch("/api/signInClient", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credenciais),
    })

    if (response.status===200){
        return await response.json() 
    }

    throw Error("Credenciais inválidas. Verifique seus dados e tente novamente.")
}

/**
 * 
 * @param {string} clientID 
 * @param {Object} updateData 
 * @returns {Client}
 */
async function editClient(clientID, updateData){
    const response = await fetch("/api/editClient", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: clientID,
            data: updateData
        }),
    })

    if(response.status !== 200) throw Error("Ocorreu um erro ao atualizar os dados")

    const client = await response.json()

    return client
}

export { createClient, getClient, signInClient, editClient }