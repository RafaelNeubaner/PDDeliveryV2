const URL_CLIENTES = "https://6a315f607bc5e1c61265a1c2.mockapi.io/client"

export default async function handler(req, res){

    const { body } = req
    
    const response = await fetch(`${URL_CLIENTES}/${body.client_id}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const client = await response.json()

    if(!client) return res.status(404).json("Cliente não encontrado")

    const novosDados = {
        ...client,
        ...body.data
    }

    const responseUpdate = await fetch(`${URL_CLIENTES}/${body.client_id}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novosDados)
    })

    delete novosDados.password

    return res.status(response.status).json(novosDados)
}