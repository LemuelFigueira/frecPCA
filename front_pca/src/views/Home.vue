
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
                        <v-text-field label="Usuário" name="username" type="text"></v-text-field>
                        <v-text-field
                          id="password"
                          label="Senha"
                          name="password"
                          type="password"
                        ></v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="deep-purple" dark>Login</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card flat>
                      <v-card-text>
                        <v-form>
                          <v-text-field label="Defina o usuário" name="username" type="text"></v-text-field>
                          <v-text-field
                            name="password"
                            :value="myPass"
                            label="Defina a senha"
                            :append-icon="value ? 'visibility' : 'visibility_off'"
                            @click:append="() => (value = !value)"
                            :type="value ? 'password' : 'text'"
                          ></v-text-field>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="deep-purple" dark>Sign up</v-btn>
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
export default {
  data() {
    return {
      value: String,
      tab: null
    };
  }
};
</script>

