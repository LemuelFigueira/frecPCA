

const api = 'https://mjygk5o4o8.execute-api.sa-east-1.amazonaws.com/dev/room'




export default {
    async createRoom(Event) {
        
        const params = {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                
            },
            body: JSON.stringify(Event)
        }
        return fetch(api, params)
    },

    async deleteEvent(Event) {
        let url = 'https://mjygk5o4o8.execute-api.sa-east-1.amazonaws.com/dev/delete/room'
        const params = {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                
            },
            body: JSON.stringify(Event)
         
        }
        return fetch(url, params)
    },

    async getroom(Event) {
        const api = 'https://mjygk5o4o8.execute-api.sa-east-1.amazonaws.com/dev/room' + Event
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

        const api = 'https://mjygk5o4o8.execute-api.sa-east-1.amazonaws.com/dev/room/user'
        
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
