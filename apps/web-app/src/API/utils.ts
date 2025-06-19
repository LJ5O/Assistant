export function getStoredToken():string|null{
    const token = sessionStorage.getItem('jwt')
    if(token){
        //OK, Token was saved, let's check if it's still valid
        const payload:any = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000); // Seconds
        if(payload?.exp > now){ // Payload always have a .exp property if token is valid
            //OK, still valid !
            return token
        }else{
            //Token expired !
            sessionStorage.removeItem('jwt');
            return null
        }
    }else{
        console.warn("Tried to get the JWT token, but it was not saved ! Please, login before playing with this app !")
        return null
    }
}