
import Auth from "./_auth"

const api = 'https://clvg7ob374.execute-api.sa-east-1.amazonaws.com/dev'
const stage = 'dev'



export default {
    async createRoom(userId,Room) {

        const params = {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
        return fetch(url(), params)
    }
}
