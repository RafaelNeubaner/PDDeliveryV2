import { getUserAuthenticated } from "./services/useAuth";

var user = await getUserAuthenticated()

if(!user.isAdmin){
    document.location.href = "/"
}