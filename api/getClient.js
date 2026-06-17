const URL_CLIENTES = "https://6a315f607bc5e1c61265a1c2.mockapi.io/client"

export default async function handler(req, res){
    
    const response = await fetch(`${URL_CLIENTES}/${req.query.id}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const client = await response.json()

    delete client.password

    return res.status(response.status).json(client)
}