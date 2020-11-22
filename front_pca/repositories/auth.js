import Auth from "./_auth"

const api = 'https://mjygk5o4o8.execute-api.sa-east-1.amazonaws.com'
const stage = 'dev'



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