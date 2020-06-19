const api =  'https://x29x40ex17.execute-api.sa-east-1.amazonaws.com/dev/participant'
const apiCheck =  'https://recface-api.herokuapp.com/face_rec'



export default {
    async createParticipant(Participant) {

        const params = {
            method: 'POST',
            // headers: {
            //     "Content-type": "multipart/form-data",
            //     "Accept": "multipart/form-data",
                
            // },
            body: Participant
        }
        return fetch(api, params)
    },
    async checkParticipant(Participant) {

        const params = {
            method: 'POST',
            // headers: {
            //     "Content-type": "multipart/form-data",
            //     "Accept": "multipart/form-data",
                
            // },
            body: Participant
        }
        return fetch(apiCheck, params)
    }
}
