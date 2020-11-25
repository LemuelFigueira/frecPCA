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

        <v-navigation-drawer v-model="drawer" absolute temporary class="text-left">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Menu Evento
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>          
          <v-list nav dense>
            <v-list-item-group
              v-model="group"
              active-class="deep-purple--text text--accent-4"
            >
              <router-link to="/main">
                <v-list-item>
                  <v-list-item-title>Lista de Eventos</v-list-item-title>
                </v-list-item>
              </router-link>

              <v-divider></v-divider>

              <router-link to="/home">
                <v-list-item v-if="isAuthenticated">
                  <v-list-item-title>Meus eventos</v-list-item-title>
                </v-list-item>
              </router-link> 

              <router-link to="/login">
                <v-list-item v-if="!isAuthenticated">
                  <v-list-item-title>Logar</v-list-item-title>
                </v-list-item>
              </router-link>

              <router-link to="/login">
                <v-list-item v-if="!isAuthenticated">
                  <v-list-item-title>Cadastrar</v-list-item-title>
                </v-list-item>
              </router-link>

              <v-list-item v-if="isAuthenticated">
                <v-list-item-title @click="sair()">
                  <v-icon small>mdi-exit-to-app</v-icon>
                  Sair
                </v-list-item-title>
              </v-list-item>

            </v-list-item-group>
          </v-list>

        </v-navigation-drawer>
      <v-content>
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
      </v-content>
      <v-footer color="deep-purple" app></v-footer>
    </v-app>
  </div>
</template>
<script>

import { mapActions, mapState, mapGetters } from "vuex";
import SweetAlertIcons from "vue-sweetalert-icons";
export default {
  props: {
    source: String
  },
 components: {
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
      name: "",
      idCode: "",
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
    showId() {
        setTimeout(() => {
            const newID = this.$route.params.id;
        this.alerticon = "success";
        this.menssage = "Registrado!";
         this.showmsg = true;
        this.idCode = newID;
        }, 2000);
        
    //   Participant.createParticipant(formData).then(response => {
    //     response
    //       .json()
    //       .then(data => {
    //         if (response.status == 201) {
    //           this.alerticon = "success";
    //           this.menssage = "Registrado!";
    //           this.showmsg = true;
    //           this.idCode = data;
    //           this.payment()
    //         } else {
    //           this.alerticon = "error";
    //           this.menssage = "Erro no Registro!";
    //         }
    //       })
    //       .catch(error => console.log("error", error));
    //   });
    },
  },
  created() {
    // this.getUserEvents();
  },
  mounted() {
      this.showalert = true;
      this.alerticon = "loading";
      this.showId();
      
    // const newEvent = this.$route.params.id;
    // Event.getroom(newEvent).then((response) => {
    //   response
    //     .json()
    //     .then((data) => {
    //       this.event = data[0];
    //       console.log(data);
    //     })
    //     .catch((error) => console.log("error", error));
    // });
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