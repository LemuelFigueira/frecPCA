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
          <v-toolbar-title>Validação de Convidado</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-window v-model="step" touchless>
          <v-window-item :value="1">
            <v-container>
              <v-col cols="12" md="10" xs="10" lg="10">
                <form>
                  <v-text-field
                    v-model="name"
                    :error-messages="nameErrors"
                    :counter="50"
                    label="Nome"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="ID Convidado"
                    v-model="questId"
                    :error-messages="descriptionErrors"
                    :counter="100"
                  ></v-text-field>
                  <!-- <v-file-input v-model="roomPic" prepend-icon="mdi-camera"></v-file-input> -->
                </form>
                <v-btn :disabled="step === 1" text @click="step--">Voltar</v-btn>
                <v-spacer></v-spacer>
                <v-btn :disabled="step === 3" color="primary" depressed @click="step++">Próximo</v-btn>
              </v-col>
            </v-container>
          </v-window-item>
          <v-window-item :value="2">
            <Camera v-on:childToParent="onChildClick" />
            <v-row class="ma-5">
              <v-btn :disabled="step === 1" text @click="step--">Voltar</v-btn>
              <v-spacer></v-spacer>
              <v-btn :disabled="step === 3" color="primary" depressed @click="step++">Próximo</v-btn>
            </v-row>
          </v-window-item>
          <v-window-item :value="3">
            <v-btn text @click="submit">Verificar!</v-btn>
            <SweetAlertIcons v-show="showalert" :icon="alerticon" />
            <v-row class="ma-5">
              <v-btn :disabled="step === 1" text @click="step--">Voltar</v-btn>
              <v-spacer></v-spacer>
              <v-btn :disabled="step === 3" color="primary" depressed @click="step++">Próximo</v-btn>
            </v-row>
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
import { mapState } from "vuex";
import SweetAlertIcons from 'vue-sweetalert-icons';
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
      alerticon: '',
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
    visible: Boolean
  },
  methods: {
    onChildClick(value) {
      this.fromChild = value;
    },
    async submit() {
      this.$v.$touch();
      this.showalert = true
      this.alerticon = "loading"
      const convertBase64ToFile = function(image) {
        const byteString = atob(image.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
          ia[i] = byteString.charCodeAt(i);
        }
        const newBlob = new File([ab], {
          type: "image/jpeg"
        });
        return newBlob;
      };

      const newIMG = convertBase64ToFile(this.fromChild);

      var formData = new FormData();
      formData.append("file", newIMG);
      formData.append("idPerson", this.questId);
      formData.append("roomId", "a86d18dc-d0b8-4cd5-ac51-01f18c0c9cad");
      formData.append("eventName", this.name);
      // for (var value of formData.values()) {
      //   console.log(value);
      // }
      Participant.checkParticipant(formData).then(response => {
        response
          .text()
          .then(data => {
            console.log(data);
            if(data == "Register"){
              this.alerticon = "success"
            }else{
              this.alerticon = "error"
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
</style>
