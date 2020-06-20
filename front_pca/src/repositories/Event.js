

const api = 'https://17m90thhna.execute-api.sa-east-1.amazonaws.com/dev/room'




export default {
    async createRoom(Event) {

        const params = {
            method: 'POST',
        //    headers: {
        //         "Content-type": "multipart/form-data",
        //         "Accept": "multipart/form-data",
                
        //     },
            body: Event
        }
        return fetch(api, params)
    },

    async getroom(Event) {
        const api = 'https://17m90thhna.execute-api.sa-east-1.amazonaws.com/dev/room/' + Event
        const params = {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                
            }
        }
        return fetch(api, params)
    },

    async getRooms(user) {

        const api = 'https://17m90thhna.execute-api.sa-east-1.amazonaws.com/dev/room/user/'
       
       
        
        const params = {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                
            },
            body:  JSON.stringify(user)
        }
        return fetch(api, params)
    }

}
