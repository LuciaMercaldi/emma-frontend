<template>
    <div class="d-flex flex-column justify-content-center align-items-center text-center pt-5 pb-2">
      <h1 class="text-danger">Accesso Negato</h1>
      <h2 class="text-secondary mt-2">Utenza sospesa</h2>
      <p class="text-muted">
        La tua utenza su EMMA è sospesa in quanto non hai caricato il PSCL relativo ad uno o più anni</br>
        Per riattivare l'utenza scrivi all'indirizzo:
      </p>
      <p class="text-muted">
        
      </p>
      <p class="text-primary">mobilita.sostenibile@5t.torino.it</p>
      <p class="fw-bold">
        E assicurati di avere il piano pronto per essere caricato.
      </p>
    </div>
  </template>
  
  <script>
  import UserService from "@/services/user.service";
  import Util from "@/mixing/util";


  export default {
    name: "Blocked",
    mixins: [Util],
    data() {
      return {
        
      };
    },

    watch: {},
    computed: {
      
    },
    methods: {
      
    },
  };
  </script>

  <style>
</style>
  