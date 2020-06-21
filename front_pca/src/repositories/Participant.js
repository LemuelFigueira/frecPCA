const apiP =  'https://muzvh8tv1h.execute-api.sa-east-1.amazonaws.com/dev/participant'
const apiPC = 'https://muzvh8tv1h.execute-api.sa-east-1.amazonaws.com/dev/room/participant'
const apiC =  'https://recface-api.herokuapp.com/face_rec'
const apiUP = 'https://muzvh8tv1h.execute-api.sa-east-1.amazonaws.com/dev/room/updateparticipant'



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
        return fetch(apiP, params)
    },
    async checkvalidity(Participant) {

        const params = {
            method: 'POST',
            // headers: {
            //     "Content-type": "multipart/form-data",
            //     "Accept": "multipart/form-data",
                
            // },
            body: JSON.stringify(Participant)
        }
        return fetch(apiPC, params)
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
        return fetch(apiC, params)
    },
    async updateParticipant(Participant) {

        const params = {
            method: 'POST',
            // headers: {
            //     "Content-type": "multipart/form-data",
            //     "Accept": "multipart/form-data",
                
            // },
            body: JSON.stringify(Participant)
        }
        return fetch(apiUP, params)
    },
}
