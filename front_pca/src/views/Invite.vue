<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <!-- <Camera :visible="showModal" v-on:childToParent="onChildClick" @close="showModal=false" /> -->
        <v-app-bar app color="deep-purple" dark>
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
        </v-app-bar>

        <v-window v-model="step" touchless>
          <v-window-item :value="1">
            <v-content>
              <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                  <v-container>
                    <v-col cols="12" md="10" xs="10" lg="10">
                      <v-card class="mx-auto" max-width="400">
                        <v-img
                          class="white--text align-end"
                          height="200px"
                          src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                        >
                          <v-card-title>{{ eventname }}</v-card-title>
                        </v-img>

                        <!-- <v-card-title>{{ eventname }}</v-card-title> -->
                        <v-card-subtitle class="pb-0 text-left">{{ adress }},{{ city }},{{ district }}</v-card-subtitle>

                        <v-card-text class=text-left >
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
                      <!-- 
                      <v-file-input
                        label="Imagem do evento"
                        accept="image/png, image/jpeg, image/bmp, image/jpeg"
                        :rules="rules"
                        v-model="roomPic"
                        filled
                        prepend-icon="mdi-camera"
                      ></v-file-input>
                      <p v-if="invalidImage">{{invalidImage}}</p>
                      <v-text-field v-model="eventname" label="Nome evento" disabled></v-text-field>
                      <v-text-field label="Descrição" v-model="description" disabled></v-text-field>
                      <v-text-field
                        v-model="beginTime"
                        label="Início do evento"
                        prepend-icon="access_time"
                        disabled
                      ></v-text-field>

                      <v-text-field
                        v-model="endTime"
                        label="Fim do evento"
                        prepend-icon="access_time"
                        disabled
                      ></v-text-field>
                      <p v-if="errorMessageEndTime">{{errorMessageEndTime}}</p>
                      <v-text-field label="Endereço" v-model="adress" disabled></v-text-field>
                      <v-text-field label="Cidade" v-model="city" disabled></v-text-field>
                      <v-text-field label="Bairro" v-model="district" disabled></v-text-field>
                      <form>
                        <v-text-field
                          name="name"
                          v-model="name"
                          :error-messages="nameErrors"
                          label="Nome"
                          required
                        ></v-text-field>
                        <v-btn class="mx-3" fab dark small color="white" @click="camera">
                      <v-icon dark color="deep-purple">camera</v-icon>
                        </v-btn>
                        <v-btn :disabled="step === 1" text @click="step--">Back</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="step === 3" color="primary" depressed @click="step++">Next</v-btn>

                        <v-btn rounded color="primary" dark @click="submit">Registrar-se</v-btn>

                        <v-btn class="mx-3" fab dark small color="white" @click="camera">
                    <v-icon dark color="deep-purple">mdi-plus</v-icon>
                        </v-btn>
                      </form>-->
                    </v-col>
                  </v-container>
                </v-row>
              </v-container>
            </v-content>
          </v-window-item>
          <v-window-item :value="2">
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
                          label="Nome"
                          required
                        ></v-text-field>
                        <v-row>
                          <v-btn :disabled="step === 1" text @click="step--">Voltar</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn
                            :disabled="step === 3"
                            color="primary"
                            depressed
                            @click="step++"
                          >Próximo</v-btn>
                        </v-row>

                        <!-- <v-btn rounded color="primary" dark @click="submit">Registrar-se</v-btn> -->
                      </form>
                    </v-col>
                  </v-container>
                </v-row>
              </v-container>
            </v-content>
          </v-window-item>
          <v-window-item :value="3">
            <Camera v-on:childToParent="onChildClick"/>
            <v-row class="ma-5">
              <v-btn :disabled="step === 1" text @click="step--">Voltar</v-btn>
              <v-spacer></v-spacer>
              <v-btn :disabled="step === 3" color="primary" depressed @click="step++">Próximo</v-btn>
            </v-row>
          </v-window-item>
        </v-window>

        <v-footer color="deep-purple" app></v-footer>
      </v-app>
    </v-app>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import Event from "@/repositories/Event";
import Participant from "@/repositories/Participant";
import Camera from "../components/Camera.vue";
export default {
  props: {
    source: String
  },
  components: {
    Camera
  },
  data() {
    return {
      fromChild: "",
      showModal: false,
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
      this.fromChild = value;
    },
    submit() {
      var formData = new FormData();
      formData.append("name", this.name);
      formData.append("userPicture", this.fromChild);
      formData.append("roomId", this.$route.params.id);
      // for (var value of formData.values()) {
      //   console.log(value);
      // }
      // console.log(this.fromChild)
      Participant.createParticipant(formData).then(response => {
        response
          .json()
          .then(data => {
            console.log(data);
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
