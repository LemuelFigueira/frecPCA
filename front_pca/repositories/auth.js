import Auth from "./_auth"


export default {



    async logIn(project) {
        

        const params = {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",

            },
 
        }
        return fetch(url(), params)
    },
    async signIn(project) {
        

        const params = {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",

            },
          
        }
        return fetch(url(), params)
    }
}