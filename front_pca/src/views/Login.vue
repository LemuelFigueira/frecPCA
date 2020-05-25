
<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-tabs background-color="deep-purple" dark :centered="true" icons-and-text>
                <v-tab>
                  Login
                  <v-icon>lock_open</v-icon>
                </v-tab>
                <v-tab>
                  Sign Up
                  <v-icon>done</v-icon>
                </v-tab>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-form>
                        <v-text-field label="Usuário" v-model="username" name="username" type="text"></v-text-field>
                        <v-text-field
                          id="password"
                          v-model="password"
                          label="Senha"
                          name="password"
                          type="password"
                        ></v-text-field>
                        {{notAuthenticated}}
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="deep-purple" dark @click="auth">Login</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card flat>
                      <v-card-text>
                        <v-form>
                          <v-text-field label="Defina o usuário" v-model="createUsername" name="username" type="text"></v-text-field>
                          <v-text-field
                            name="password"
                            v-model="createPassword"
                            label="Defina a senha"
                            :append-icon="value ? 'visibility' : 'visibility_off'"
                            @click:append="() => (value = !value)"
                            :type="value ? 'password' : 'text'"
                          ></v-text-field>
                        </v-form>
                      </v-card-text>
                       {{notCreated}}
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="deep-purple" dark @click="createUser">Sign up</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
 
  data() {
    return {
      value:String,
      username: "",
      password: "",
      createUsername:"",
      createPassword:""
    };
  },
  computed: {
    ...mapState(["notAuthenticated","notCreated"])
  },
  methods: {
    ...mapActions(["login","signIn"]),
    auth() {
      let username = this.username;
      let password = this.password;
     
      this.login({ username, password })
    },
    createUser() {
      let username = this.createUsername;
      let password = this.createPassword;
     
      this.signIn({ username, password })
    }
  }
}
</script>

