const api =  'https://x29x40ex17.execute-api.sa-east-1.amazonaws.com/dev/participant'


export default {
    async createParticipant(Event) {

        const params = {
            method: 'POST',
            // headers: {
            //     "Content-type": "multipart/form-data",
            //     "Accept": "multipart/form-data",
                
            // },
            body: Event
        }
        return fetch(api, params)
    }
}
