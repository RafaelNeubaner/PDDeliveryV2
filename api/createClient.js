URL_CLIENTES = "https://6a315f607bc5e1c61265a1c2.mockapi.io/client"

export default async function handler(req, res){
    const {body} = req

    const checkExistResponse = await fetch(`${URL_CLIENTES}?email=${body.email}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })

    const checkExist = await checkExistResponse.json()

    if(checkExist.length>0) return res.status(409).json("Este [CPF/E-mail] já está vinculado a uma conta existente.")

    const response = await fetch(`${URL_CLIENTES}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const client = await response.json()

    delete client.password

    return res.status(response.status).json(client)
}