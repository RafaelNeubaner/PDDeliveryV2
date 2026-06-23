import { getLocationByCEP } from "../../js/services/useCep.js";

document.getElementById("loginCep").addEventListener('change', async (ev)=>{
  const cep = ev.target.value;
  if(cep.includes("-") && cep.length==9 || !cep.includes("-") && cep.length==8){
    const location = await getLocationByCEP(cep.replace("-", ""))

    console.log(location)

    document.getElementById('loginEndereco').value = location.logradouro;
    document.getElementById('loginBairro').value = location.bairro;
    document.getElementById('loginCidade').value = location.localidade;
    document.getElementById('loginEstado').value = location.estado;

    document.getElementById('loginNumero').focus()
  }
})