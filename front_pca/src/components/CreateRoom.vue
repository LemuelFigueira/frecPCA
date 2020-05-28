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
            <v-btn dark text @click="show = false">Criar!</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container class="grey lighten-5 pt-12">
    
          <v-col cols="12" md="10" xs="10" lg="10">
            <form>
              <v-file-input label="Imagem do evento" filled prepend-icon="mdi-camera"></v-file-input>
              <v-text-field
                v-model="name"
                :counter="10"
                label="Nome do evento"
                required
              ></v-text-field>
              <v-text-field label="Descrição do evento" :counter="50"></v-text-field>
              <v-select
                v-model="quantidadeParticipantes"
                :items="quantidade"
                filled
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
export default {
  data() {
    return {
      quantidade:[10,50,100,300,500,1000],
      name: '',
      quantidadeParticipantes:Number,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false
    };
  },
  props: {
    visible: Boolean
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
    }
  }
};
</script>
