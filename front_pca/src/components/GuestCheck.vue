<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      fullscreen
      width="unset"
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="deep-purple">
          <v-btn icon dark @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Validação de Participante</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-window v-model="step" touchless>
          <v-window-item :value="1">
            <v-container>
              <v-col cols="12" md="10" xs="10" lg="10">
                <form>
                  <v-text-field
                    label="ID Convidado"
                    v-model="questId"
                    :error-messages="descriptionErrors"
                    :counter="100"
                  ></v-text-field>
                  <!-- <v-file-input v-model="roomPic" prepend-icon="mdi-camera"></v-file-input> -->
                  <v-row>
                    <v-btn :disabled="step === 1" text @click="step--">
                      <v-icon size="48">mdi-arrow-left-circle</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="step === 4" text @click="step++">
                      <v-icon size="48">mdi-arrow-right-circle</v-icon>
                    </v-btn>
                  </v-row>
                </form>
              </v-col>
            </v-container>
          </v-window-item>
          <v-window-item :value="2">
            <Camera v-on:childToParent="onChildClick" />
            <!-- <v-row class="ma-5">
              <v-btn :disabled="step === 1" text @click="step--">Voltar</v-btn>
              <v-spacer></v-spacer>
              <v-btn :disabled="step === 3" color="primary" depressed @click="step++">Próximo</v-btn>
            </v-row>-->
          </v-window-item>
          <v-window-item :value="3">
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
                      <v-btn :disabled="step === 4" text @click="register">
                        <v-icon size="48">mdi-arrow-right-circle</v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-container>
              </v-row>
            </v-container>
          </v-window-item>
          <v-window-item :value="4">
            <v-container class="fill-height" fluid>
              <v-row align="center" justify="center">
                <v-container>
                  <v-col cols="12" md="10" xs="10" lg="10">
                    <SweetAlertIcons v-show="showalert" :icon="alerticon" />
                    <h2>{{ menssage }}</h2>
                    <v-btn :disabled="step === 5" text @click="step++">
                      <v-icon size="48">mdi-arrow-right-circle</v-icon>
                    </v-btn>
                  </v-col>
                </v-container>
              </v-row>
            </v-container>
          </v-window-item>
        </v-window>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
// import Event from "@/repositories/Event";
import Camera from "../components/Camera.vue";
import { required, maxLength } from "vuelidate/lib/validators";
import Participant from "@/repositories/Participant";
import Convert from "@/repositories/ConvertToFile";
import { mapState } from "vuex";
import SweetAlertIcons from "vue-sweetalert-icons";
// import VueTimepicker from "vue2-timepicker";
// import "vue2-timepicker/dist/VueTimepicker.css";
export default {
  components: {
    Camera,
    SweetAlertIcons
  },
  validations: {
    name: { required, maxLength: maxLength(50) },
    description: { required, maxLength: maxLength(100) }
  },
  data() {
    return {
      alerticon: "",
      menssage: "",
      showalert: false,
      fromChild: "",
      roomPic: "",
      name: "",
      questId: "",
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      step: 1
    };
  },
  props: {
    visible: Boolean,
    roomId: String
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
    async submit() {
      this.$v.$touch();
      this.showalert = true;
      this.alerticon = "loading";

      const participant = {
        id: this.questId,
        roomId: this.roomId
      };
      console.log(participant);
      Participant.checkvalidity(participant).then(response => {
        response
          .json()
          .then(data => {
            if (data[0]["validity"] === false) {
              const newIMG = Convert.convertBase64ToFile(this.fromChild);
              var formData = new FormData();
              formData.append("file", newIMG);
              formData.append("idPerson", this.questId);
              formData.append("roomId", this.roomId);
              formData.append("eventName", this.name);
              for (var value of formData.values()) {
                console.log(value);
              }
              Participant.checkParticipant(formData).then(response => {
                response
                  .text()
                  .then(data => {
                    console.log(data);
                    if (data == "Register") {
                      this.alerticon = "success";
                      this.menssage = "Participante Validado";
                      Participant.updateParticipant(participant);
                    } else {
                      this.alerticon = "error";
                      this.menssage = "Participante não encontrado";
                    }
                  })
                  .catch(error => console.log("error", error));
              });
            } else {
              this.alerticon = "error";
              this.menssage = "Participante Já Validado";
            }
          })
          .catch(error => console.log("error", error));
      });
    }
  },
  computed: {
    ...mapState(["userId"]),

    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Nome do evento deve ter no máximo 50 caracteres ");
      !this.$v.name.required && errors.push("Defina o nome do evento");
      return errors;
    },
    cityErrors() {
      const errors = [];
      if (!this.$v.city.$dirty) return errors;

      !this.$v.city.required && errors.push("Defina a cidade do evento");
      return errors;
    },
    adressErrors() {
      const errors = [];
      if (!this.$v.adress.$dirty) return errors;

      !this.$v.adress.required && errors.push("Defina o endereço do evento");
      return errors;
    },
    districtErrors() {
      const errors = [];
      if (!this.$v.district.$dirty) return errors;

      !this.$v.district.required && errors.push("Defina o bairro do evento");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.description.$dirty) return errors;
      !this.$v.description.maxLength &&
        errors.push("Descrição do evento deve ter no máximo 100 caracteres ");
      !this.$v.description.required &&
        errors.push("Crie uma descrição para o evento");
      return errors;
    },
    participantsErrors() {
      const errors = [];
      if (!this.$v.numberParticipants.$dirty) return errors;
      !this.$v.numberParticipants.required &&
        errors.push("Selecione a quantidade de participantes");
      return errors;
    }
  }
};
</script>
<style scoped>
.v-application p {
  font-size: 12px;
  line-height: px;
  text-align: left;
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
}
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
