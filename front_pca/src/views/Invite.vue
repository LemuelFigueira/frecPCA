<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <Camera :visible="showModal" v-on:childToParent="onChildClick" @close="showModal=false" />
        <v-app-bar app color="deep-purple" dark>
          <v-toolbar-title>Eventos</v-toolbar-title>
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
        <v-content>
          <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
              <v-container>
                <v-col cols="12" md="10" xs="10" lg="10">
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
                    <v-btn rounded color="primary" dark @click="submit">Registrar-se</v-btn>

                    <!-- <v-btn class="mx-3" fab dark small color="white" @click="camera">
                    <v-icon dark color="deep-purple">mdi-plus</v-icon>
                    </v-btn>-->
                  </form>
                </v-col>
              </v-container>
            </v-row>
          </v-container>
        </v-content>
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
      name: ""
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
    camera() {
      this.showModal = true;
    },
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
