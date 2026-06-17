const URL_CLIENTES = "https://6a315f607bc5e1c61265a1c2.mockapi.io/client"

export default async function handler(req, res){

    const {body} = req

    data = body

    var cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/i;
    const response =  await fetch( cpfRegex.test(data.identifier) ?`${URL_CLIENTES}?cpf=${data.identifier}` :`${URL_CLIENTES}?email=${data.identifier}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const client = await response.json()

    if(client.length === 0) return res.status(403).json("Invalid Request")

    if (client[0].password === data.password){
        delete client[0].password
        return res.status(200).json(client[0])
    }

    return res.status(403).json()
}