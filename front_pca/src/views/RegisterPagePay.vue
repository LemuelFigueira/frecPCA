<template>
  <div id="app" class="mx-auto">
    <v-app id="inspire">
        <v-app-bar app color="deep-purple" dark>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>Eventos</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn v-if="isAuthenticated" style="left:10%"  light small color="white" @click="createRoom">
            Criar evento
          </v-btn>

          <v-btn v-if="!isAuthenticated" style="left:15%" light small color="white" to="/login">
            Logar
          </v-btn>

          <v-spacer></v-spacer>
        </v-app-bar>

      <v-navigation-drawer v-model="drawer" temporary app class="text-left">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Menu Evento</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list nav dense>
          <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
          >
            <router-link to="/main" style="text-decoration: none; color: inherit;">
              <v-list-item>
                <v-list-item-title>Lista de Eventos</v-list-item-title>
              </v-list-item>
            </router-link>
            <v-divider></v-divider>

            <router-link to="/home" style="text-decoration: none; color: inherit;">
              <v-list-item v-if="isAuthenticated">
                <v-list-item-title>Meus eventos</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/registerevent" style="text-decoration: none; color: inherit;">
              <v-list-item v-if="isAuthenticated">
                <v-list-item-title>Eventos Inscritos</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/login" style="text-decoration: none; color: inherit;">
              <v-list-item v-if="!isAuthenticated">
                <v-list-item-title>Logar</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/login" style="text-decoration: none; color: inherit;">
              <v-list-item v-if="!isAuthenticated">
                <v-list-item-title>Cadastrar</v-list-item-title>
              </v-list-item>
            </router-link>

            <v-list-item v-if="isAuthenticated">
              <v-list-item-title @click="sair()">
                <v-icon small>mdi-exit-to-app</v-icon>Sair
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-content>
        <v-window v-model="step" touchless>
          <!-- <v-window-item :value="1">
            <v-content class="pa-0">
              <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                  <v-container>
                    <v-col cols="12" md="10" xs="10" lg="10">
                      <v-card class="mx-auto" max-width="400">
                        <v-img class="white--text align-end" height="200px" src="../assets/meca.jpg">
                          <v-card-title>{{ eventname }}</v-card-title>
                        </v-img>

                        
                        <v-card-subtitle
                          class="pb-0 text-left"
                        >{{ adress }},{{ city }},{{ district }}</v-card-subtitle>

                        <v-card-text class="text-left">
                          <div class="my-4">{{ description }}</div>
                        </v-card-text>

                        <v-divider class="mx-4"></v-divider>

                        

                        <v-card-text>
                          <v-chip-group column>
                            <v-chip color="primary" text-color="white"><v-icon left>mdi-calendar-check</v-icon> {{ eventdate }}</v-chip>
                            <row>
                            <v-chip color="green" text-color="white"><v-icon left>mdi-alarm-check</v-icon>Inicio: {{ beginTime }}</v-chip>
                            <v-chip color="red" text-color="white"><v-icon left>mdi-alarm-check</v-icon>Fim: {{ endTime }}</v-chip>
                            </row>
                          </v-chip-group>
                        </v-card-text>

                        <v-card-actions class="justify-center">
                          <v-btn
                            color="deep-purple lighten-2"
                            :disabled="step === 3"
                            text
                            @click="step++"
                          >Registrar-se</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-container>
                </v-row>
              </v-container>
            </v-content>
          </v-window-item> -->
          <v-window-item class="inputMargin" :value="1">
            <v-content>
              <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                  <v-container>
                    <v-col cols="12" md="10" xs="10" lg="10">
                      <form>
                        <v-text-field
                          name="name"
                          v-model="name"
                          :error-messages="nameErrors"
                          label="Insira seu Nome"
                          required
                        ></v-text-field>
                        <!-- <v-file-input v-model="roomPic" prepend-icon="mdi-camera"></v-file-input> -->
                        <v-row>
                          <v-btn color="deep-purple" :disabled="step === 1" text @click="step--">
                            <v-icon size="48">mdi-arrow-left-circle</v-icon>
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn color="deep-purple" text @click="step++">
                            <!-- :disabled="step === 3"  -->
                            <v-icon size="48">mdi-arrow-right-circle</v-icon>
                          </v-btn>
                        </v-row>
                      </form>
                    </v-col>
                  </v-container>
                </v-row>
              </v-container>
            </v-content>
          </v-window-item>
          <v-window-item :value="2">
            <Camera v-on:childToParent="onChildClick" />
            <!-- <v-row class="ma-5">
              <v-btn :disabled="step === 1" text @click="step--">Voltar</v-btn>
              <v-spacer></v-spacer>
              <v-btn :disabled="step === 4" color="primary" depressed @click="step++">Próximo</v-btn>
            </v-row>-->
          </v-window-item>
          <v-window-item :value="3">
            <v-content>
              <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                  <v-container>
                    <v-col cols="12" md="10" xs="10" lg="10">
                      <v-row>
                        <template>
                          <div class="video mb-6">
                            <img :src="fromChild" />
                          </div>
                        </template>
                        <v-btn color="deep-purple" :disabled="step === 1" text @click="step--">
                          <v-icon size="48">mdi-arrow-left-circle</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="deep-purple" :disabled="step === 4" text @click="register">
                          <v-icon size="48">mdi-arrow-right-circle</v-icon>
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-container>
                </v-row>
              </v-container>
            </v-content>
          </v-window-item>
          <v-window-item :value="4">
            <v-content>
              <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                  <v-container>
                    <v-col cols="12" md="10" xs="10" lg="10">
                      <SweetAlertIcons v-show="showalert" :icon="alerticon" />
                      <h2>{{ menssage }}</h2>
                      <br>
                      <h3 v-show="showmsg">Seu Código</h3>
                      <h4>{{ idCode }}</h4>
                    </v-col>
                  </v-container>
                </v-row>
              </v-container>
            </v-content>
          </v-window-item>
        </v-window>
      </v-content>
      <v-footer color="deep-purple" app></v-footer>
    </v-app>
  </div>
</template>
<script>
var stripe = window.Stripe('pk_test_51HlaLCL53UtpCrjBIiZuwQCP7cAw7q6GmNp0k20ZsrQhOhrGsNi94vMJfXLVuWOfontbMC844mlwrCrodxgPeSEU00R0ATITek');

import { mapActions, mapState, mapGetters } from "vuex";
import Event from "@/repositories/Event";
import Participant from "@/repositories/Participant";
import Camera from "../components/Camera.vue";
import SweetAlertIcons from "vue-sweetalert-icons";
import Convert from "@/repositories/ConvertToFile";
export default {
  props: {
    source: String
  },
 components: {
    Camera,
    SweetAlertIcons
  },
  data() {
    return {
      drawer: false,
      sessionId: '',
      group: null,
      showModalValidation: false,
      roomIdValidation: "",
      color: "",
      mode: "",
      snackbar: false,
      text: "",
      timeout: 4000,
      created: false,
      x: null,
      y: '',
      event: {},
      menssage: "",
      alerticon: "",
      roomPicture: "",
      fromChild: "",
      showModal: false,
      showalert: false,
      showmsg: false,
      eventname: "",
      description: "",
      adress: "",
      city: "",
      district: "",
      beginTime: "",
      endTime: "",
      eventdate: "",
      guestPic: "",
      idCode: "",
      name: "",
      step: 1
    };
  },
  computed: {
    ...mapState(["userId"]),
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    ...mapActions(["logOut"]),
    createRoom() {
      this.showModal = true;
    },
    sair(){
      this.logOut()
      this.drawer = false
    },
    eventEmit() {
      let user = {
        userId: this.userId
      };
      this.getUserEvents(user);
    },

    onChildClick(value) {
      if (value !== "") {
        this.step++;
        this.fromChild = value;
      }
    },
    register() {
      // this.step++;
      this.submit();
    },
    payment(){
      let data = [{
        productValue: this.event.eventPrice,
        Qtn: 1,
        productDescription:this.event.eventDescription,
        productName: this.event.eventName,
        idCode: this.idCode

      }]
      console.log(data)
      Event.checkOut(data).then((response) => {
        response
          .json()
          .then((data) => {
            this.sessionId = data;
            console.log(this.sessionId);
            stripe.redirectToCheckout({
              sessionId: this.sessionId.id
            }).then(function (){

            });
          })
          .catch((error) => console.log("error", error));
      });


    },
    submit() {
      const newIMG = Convert.convertBase64ToFile(this.fromChild);

      this.showalert = true;
      this.alerticon = "loading";
      var formData = new FormData();
      formData.append("name", this.name);
      formData.append("userPicture", newIMG);
      formData.append("roomId", this.$route.params.id);
      formData.append("participantId", this.$store.state.userId)
      for (var value of formData.values()) {
        console.log(value);
      }
      console.log(formData)
      Participant.createParticipant(formData).then(response => {
        response
          .json()
          .then(data => {
            if (response.status == 201) {
              this.alerticon = "success";
              this.menssage = "Registrado!";
              this.showmsg = true;
              this.idCode = data;
              this.payment()
            } else {
              this.alerticon = "error";
              this.menssage = "Erro no Registro!";
            }
          })
          .catch(error => console.log("error", error));
      });
    },
  },
  created() {
    // this.getUserEvents();
  },
  mounted() {
    const newEvent = this.$route.params.id;
    Event.getroom(newEvent).then((response) => {
      response
        .json()
        .then((data) => {
          this.event = data[0];
          console.log(data);
        })
        .catch((error) => console.log("error", error));
    });
  }
};
</script>


<style scoped>
.inputMargin {
  margin-top: 50%;
}
img {
  width: 100%;
  height: 100%;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  background-color: rgb(20, 20, 20);
  user-select: none;
}
img {
  height: 100%;
}
</style>