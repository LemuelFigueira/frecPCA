

const api = 'https://17m90thhna.execute-api.sa-east-1.amazonaws.com/dev/room'




export default {
    async createRoom(Event) {

        const params = {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                
            },
            body: JSON.stringify(Event)
        }
        return fetch(api, params)
    },

    async getroom(Event) {
        const apii = 'https://17m90thhna.execute-api.sa-east-1.amazonaws.com/dev/room/' + Event
        const params = {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                
            }
        }
        return fetch(apii, params)
    }

}
