import { createClient, getClient, signInClient } from "./useClients.js";

const USER_KEY = "PDDELIVERY_USER_ID"

function hasUserAuthenticated(){
    const user_id = localStorage.getItem(USER_KEY)
    return user_id ? true : false;
}

async function getUserAuthenticated(){
    const user_id = localStorage.getItem(USER_KEY)

    const user = await getClient(user_id)

    return user;
}

/**
 * 
 * @param {string} identifier - CPF ou Email
 * @param {string} password 
 * @returns {import("./useClients").Client}
 */
async function loginCliente(identifier, password){
    try{
        const user = await signInClient({identifier, password})
        localStorage.setItem(USER_KEY, user.id)
        return user;
    }catch(e){
        throw e;
    }
}

/**
 * @param {import("./useClients").Client} client
 * 
 * @return {import("./useClients").Client}
 */
async function registerCliente(client){
    try{
        const user = await createClient(client)
        return user;
    }catch(e){
        throw e
    }
}

async function logout(){
    localStorage.removeItem(USER_KEY)
    location.reload()
}


export {hasUserAuthenticated, getUserAuthenticated, loginCliente, registerCliente, logout}