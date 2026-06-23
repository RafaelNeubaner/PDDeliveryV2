const URL_CLIENTES = "https://6a315f607bc5e1c61265a1c2.mockapi.io/client"

export async function handlerCreateClient(body){

    const checkExistResponseList = await Promise.all([
        await fetch(`${URL_CLIENTES}?email=${body.email}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }),
        await fetch(`${URL_CLIENTES}?cpf=${body.cpf}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
    ]) 
    
    if(checkExistResponseList.map(req=> req.status).includes(200)) throw Error("Este [CPF/E-mail] já está vinculado a uma conta existente.")
        
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

    return client
}

export async function handlerUpdateClient(body){
    
    const response = await fetch(`${URL_CLIENTES}/${body.client_id}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const client = await response.json()

    if(!client) throw Error("Cliente não encontrado")

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

    return novosDados
}

export async function handlerGetClient(id){
    
    const response = await fetch(`${URL_CLIENTES}/${id}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const client = await response.json()

    delete client.password

    return client
}

export async function handlerSignInClient(body){

    let data = body

    var cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/i;
    const response =  await fetch( cpfRegex.test(data.identifier) ?`${URL_CLIENTES}?cpf=${data.identifier}` :`${URL_CLIENTES}?email=${data.identifier}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const client = await response.json()

    if(client.length === 0) throw Error("Invalid Request")

    if (client[0].password === data.password){
        delete client[0].password
        return client[0]
    }

    throw Error("Credenciais inválidas")
}