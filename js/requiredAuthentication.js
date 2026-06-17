import { hasUserAuthenticated } from "./services/useAuth.js";


const hasUser = hasUserAuthenticated()

if(!hasUser){
    location.href="/login/index.html"
}