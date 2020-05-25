import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loginUrl: 'https://clvg7ob374.execute-api.sa-east-1.amazonaws.com/dev/login',
        dataUrl: 'https://hjnl4vmgm7.execute-api.us-east-1.amazonaws.com/v1/survey/',
        surveyName: '',
        notAuthenticated: '',
        surveyId: localStorage.getItem('userId') || null
    },
    mutations: {
      
        userAuthenticated(state, id) {
            state.surveyId = id;
        },
        errorUserAuth(state, message) {
            state.notAuthenticated = message;
        },
       
        removeSurveyId: (state) => {
            state.surveyId = null;
        }
    },
    actions: {
        async login({
            state,
            commit
        }, {
            username,
            password
        }) {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let raw = JSON.stringify({
                "username": username,
                "password": password
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(state.loginUrl, requestOptions)
                .then(response => {
                    response.json().then(result => {
                        if (response.status === 200) {
                            commit('errorUserAuth', '')
                            router.push('/About')
                        } else if (response.status === 401) {
                            commit('errorUserAuth', result)
                        }
                    })
                })

                .catch(error => console.log('error', error))
        },
        logOut({
            commit
        }) {
            commit('getSurveyId', localStorage.removeItem('surveyId'));
            commit('removeSurveyId')
            router.push('/Login')
        }

    }
})