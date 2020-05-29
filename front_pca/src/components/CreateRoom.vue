<template>
  <v-row justify="center">
    <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn color="deep-purple" dark v-on="on">Open Dialog</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="deep-purple">
          <v-btn icon dark @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Criar Evento</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="submit">Criar!</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container class="grey lighten-5 pt-12">
          <v-col cols="12" md="10" xs="10" lg="10">
            <form>
              <v-file-input label="Imagem do evento" filled prepend-icon="mdi-camera"></v-file-input>
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                :counter="20"
                label="Nome"
                required
              ></v-text-field>
              <v-text-field
                label="Descrição"
                v-model="descripton"
                :error-messages="descriptionErrors"
                :counter="50"
              ></v-text-field>
              <v-select
                v-model="quantidadeParticipantes"
                :error-messages="participantsErrors"
                :items="quantidade"
                filled
                required
                :menu-props="{ maxHeight:'200' }"
                hint="Quantidade de participantes"
                persistent-hint
              ></v-select>
            </form>
          </v-col>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  validations: {
    name: { required, maxLength: maxLength(20) },
    descripton: { required, maxLength: maxLength(50) },
    quantidadeParticipantes: { required },
    select: { required },
    checkbox: {
      checked(val) {
        return val;
      }
    }
  },
  data() {
    return {
      quantidade: [10, 50, 100, 300, 500, 1000],
      name: "",
      descripton: "",
      quantidadeParticipantes: '',
      dialog: false,
      rules: [
        value =>
          !value ||
          value.size < 5000000 ||
          "A foto do evento deve ser menor que 5 MB"
      ],

      notifications: false,
      sound: true,
      widgets: false
    };
  },
  props: {
    visible: Boolean
  },
  methods: {
    submit() {
      this.$v.$touch();
    }
  },
  computed: {
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
        errors.push("Nome do evento deve ter no máximo 20 caracteres ");
      !this.$v.name.required && errors.push("Defina o nome do evento");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.descripton.$dirty) return errors;
      !this.$v.descripton.maxLength &&
        errors.push("Descrição do evento deve ter no máximo 50 caracteres ");
      !this.$v.descripton.required &&
        errors.push("Crie uma descrição do evento");
      return errors;
    },
    participantsErrors() {
      console.log('sasdad',this.$v.quantidadeParticipantes)
      const errors = [];
      if (!this.$v.quantidadeParticipantes.$dirty) return errors;
      !this.$v.quantidadeParticipantes.required && errors.push("Selecione a quantidade de participantes");
      return errors;
    }
  }
};
</script>
