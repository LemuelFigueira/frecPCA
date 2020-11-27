const apiP =  'https://sz7o081ir7.execute-api.sa-east-1.amazonaws.com/dev/participant'
const apiPC = 'https://sz7o081ir7.execute-api.sa-east-1.amazonaws.com/dev/room/participant'
const apiC =  'https://recface-api.herokuapp.com/face_rec'
const apiUP = 'https://sz7o081ir7.execute-api.sa-east-1.amazonaws.com/dev/room/updateparticipant'



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
    async getAllParticipantRooms(Participant) {

        const api = 'https://sz7o081ir7.execute-api.sa-east-1.amazonaws.com/dev/room/getParticipantEvents'
        
        const params = {
            method: 'POST',
            // headers: {
            //     "Content-type": "application/json",
            //     "Accept": "application/json",
                
            // },
            body:  JSON.stringify(Participant)
        }
        return fetch(api, params)
    },
}
