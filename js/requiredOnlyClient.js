import { getUserAuthenticated } from "./services/useAuth.js";

var user = await getUserAuthenticated()

if(user.isAdmin){
    document.location.href = "/adm/index.html"
}