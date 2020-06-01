import Auth from "./_auth"

const api = 'https://koriixo1z9.execute-api.us-east-1.amazonaws.com'
const stage = 'dev'



export default {



    async createRoom(project) {
        

        const params = {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",

            },
 
        }
        return fetch(url(), params)
    },
    async getRoomId(project) {
        

        const params = {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",

            },
 
        }
        return fetch(url(), params)
    },
    async uploadPicture(project) {
        

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