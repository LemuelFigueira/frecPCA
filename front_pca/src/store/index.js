import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loginUrl: 'https://clvg7ob374.execute-api.sa-east-1.amazonaws.com/dev/login',
        signInUrl: 'https://clvg7ob374.execute-api.sa-east-1.amazonaws.com/dev/sign',
        notAuthenticated: '',
        notCreated: '',
        userId: localStorage.getItem('userId') || null
    },
    mutations: {
      
        userAuthenticated(state, id) {
            state.userId = id;
        },
        errorUserAuth(state, message) {
            state.notAuthenticated = message;
        },
        errorCreateUser(state, message) {
            state.notCreated = message;
        },
        getUserId: (state,userId) => {
            state.userId = userId;
        },
        removeUserId: (state) => {
            state.userId = null;
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
                            
                            localStorage.setItem('userId',result.Item.id)
                            commit('userAuthenticated',result.Item.id)
                            commit('errorUserAuth', '')
                            router.push('/Home')
                        } else if (response.status === 401) {
                            commit('errorUserAuth', result)
                        }
                    })
                })

                .catch(error => console.log('error', error))
        },
        async signIn({
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

            fetch(state.signInUrl, requestOptions)
                .then(response => {
                    response.json().then(result => {
                        if (response.status === 201) {
                          
                            router.push('/Home')
                        } else if (response.status === 400) {
                            commit('errorCreateUser', result)
                        }
                    })
                })

                .catch(error => console.log('error', error))
        },
        fetchAccessToken({
            state
        }) {
            if (state.userId) {
                return state.userId
            }
        },
        logOut({
            commit
        }) {
            commit('getUserId', localStorage.removeItem('userId'));
            commit('removeUserId')
            router.push('/Login')
        }

    }
})