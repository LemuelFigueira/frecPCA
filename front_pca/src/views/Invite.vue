<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <!-- <Camera :visible="showModal" v-on:childToParent="onChildClick" @close="showModal=false" /> -->
        <!-- <v-app-bar app color="deep-purple" dark>
          <v-toolbar-title>Evento</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-menu left bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="this.logOut">Sair</v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>-->

        <v-window v-model="step" touchless>
          <v-window-item :value="1">
            <v-content>
              <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                  <v-container>
                    <v-col cols="12" md="10" xs="10" lg="10">
                      <v-card class="mx-auto" max-width="400">
                        <v-img class="white--text align-end" height="200px" :src="roomPicture">
                          <v-card-title>{{ eventname }}</v-card-title>
                        </v-img>

                        <!-- <v-card-title>{{ eventname }}</v-card-title> -->
                        <v-card-subtitle
                          class="pb-0 text-left"
                        >{{ adress }},{{ city }},{{ district }}</v-card-subtitle>

                        <v-card-text class="text-left">
                          <div class="my-4">{{ description }}</div>
                        </v-card-text>

                        <v-divider class="mx-4"></v-divider>

                        <v-card-title>Hora do Evento</v-card-title>

                        <v-card-text>
                          <v-chip-group v-model="selection" column>
                            <v-chip>Hora de inicio: {{ beginTime }}</v-chip>

                            <v-chip>Hora de termino: {{ endTime }}</v-chip>
                          </v-chip-group>
                        </v-card-text>

                        <v-card-actions>
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
          </v-window-item>
          <v-window-item class="inputMargin" :value="2">
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
                          <v-btn :disabled="step === 1" text @click="step--">
                            <v-icon size="48">mdi-arrow-left-circle</v-icon>
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn :disabled="step === 3" text @click="step++">
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
          <v-window-item :value="3">
            <Camera v-on:childToParent="onChildClick" />
            <!-- <v-row class="ma-5">
              <v-btn :disabled="step === 1" text @click="step--">Voltar</v-btn>
              <v-spacer></v-spacer>
              <v-btn :disabled="step === 4" color="primary" depressed @click="step++">Próximo</v-btn>
            </v-row>-->
          </v-window-item>
          <v-window-item :value="4">
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
                        <v-btn :disabled="step === 1" text @click="step--">
                          <v-icon size="48">mdi-arrow-left-circle</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="step === 3" text @click="register">
                          <v-icon size="48">mdi-arrow-right-circle</v-icon>
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-container>
                </v-row>
              </v-container>
            </v-content>
          </v-window-item>
          <v-window-item :value="5">
            <v-content>
              <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                  <v-container>
                    <v-col cols="12" md="10" xs="10" lg="10">
                      <SweetAlertIcons v-show="showalert" :icon="alerticon" />
                      <h2>{{ menssage }}</h2>
                    </v-col>
                  </v-container>
                </v-row>
              </v-container>
            </v-content>
          </v-window-item>
        </v-window>
      </v-app>
    </v-app>
  </div>
</template>
<script>
import { mapActions } from "vuex";
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
      menssage: "",
      alerticon: "",
      roomPicture: "",
      fromChild: "",
      showModal: false,
      showalert: false,
      eventname: "",
      description: "",
      adress: "",
      city: "",
      district: "",
      beginTime: "",
      endTime: "",
      guestPic: "",
      name: "",
      step: 1
    };
  },
  methods: {
    onChildClick(value) {
      if (value !== "") {
        this.step++;
        this.fromChild = value;
      }
    },
    register() {
      this.step++;
      this.submit();
    },
    submit() {
      const newIMG = Convert.convertBase64ToFile(this.fromChild);

      this.showalert = true;
      this.alerticon = "loading";
      var formData = new FormData();
      formData.append("name", this.name);
      formData.append("userPicture", newIMG);
      formData.append("roomId", this.$route.params.id);
      for (var value of formData.values()) {
        console.log(value);
      }
      Participant.createParticipant(formData).then(response => {
        response
          .json()
          .then(data => {
            if (data === "Registrado") {
              this.alerticon = "success";
              this.menssage = "Registrado!";
            } else {
              this.alerticon = "error";
            }
          })
          .catch(error => console.log("error", error));
      });
    },
    // camera() {
    //   this.showModal = true;
    // },
    ...mapActions(["logOut"])
  },
  mounted() {
    const newEvent = this.$route.params.id;
    Event.getroom(newEvent).then(response => {
      response
        .json()
        .then(data => {
          this.eventname = data[0]["eventName"];
          this.roomPicture = data[0]["roomPicture"];
          this.district = data[0]["eventDistrict"];
          this.adress = data[0]["eventAdress"];
          this.city = data[0]["eventCity"];
          this.description = data[0]["eventDescription"];
          this.beginTime = data[0]["eventBeginTime"];
          this.endTime = data[0]["eventEndTime"];
          console.log(data);
        })
        .catch(error => console.log("error", error));
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