<template>
  <div class="
      page-holder
      bg-cover
      d-flex
      flex-column
      sticky-footer-wrapper
      cover-back
      login-page
    ">
    <b-container class="flex-fill">
      <b-card class="overflow-hidden mt-5" footer-tag="footer"
        :class="logo ? 'col-md-8 offset-md-2 p-0' : 'col-md-6 offset-md-3 p-0'">
        <b-overlay :show="loading" rounded="sm">
          <b-row no-gutters align-v="center">
            <b-col md="6" v-if="logo">
              <b-card-img :src="logo" :alt="title" class="rounded-0 logo"></b-card-img>
            </b-col>
            <b-col :md="logo ? 6 : 12">
              <b-card-body>
                <form id="loginForm" class="form-horizontal" accept-charset="utf-8" @submit.prevent="onSubmit()"
                  ref="form">
                  <b-row class="my-2">
                    <label class="col-sm-4 control-label required">Email / Username</label>
                    <div class="col-sm-8">
                      <div class="input text">
                        <input name="email" placeholder="Email" class="form-control" maxlength="100" type="text"
                          id="username" required="required" v-model="user.email" />
                      </div>
                    </div>
                  </b-row>
                  <b-row class="my-2">
                    <label class="col-sm-4 control-label required">Password</label>
                    <div class="col-sm-8">
                      <div class="input password">
                        <input name="password" placeholder="Password" class="form-control" type="password" id="password"
                          required="required" v-model="user.password" />
                      </div>
                    </div>
                  </b-row>
                  <b-row class="mt-1">
                    <b-col cols="8" class="">
                      <b-alert :show="message != ''">{{ message }}</b-alert>
                      <router-link to="/reset-password">Richiedi nuova password o cambia password
                      </router-link>
                    </b-col>
                    <b-col cols="4">
                      <input class="btn btn-primary float-right" id="loginSubmitBtn" type="submit" value="Accedi" />
                    </b-col>
                  </b-row>
                </form>
              </b-card-body>
            </b-col>
          </b-row>
        </b-overlay>
        <template #footer>
          <b-row>
            <b-col cols="12">
              <h5>Serve aiuto per l'accesso o l'utilizzo?</h5>
              <a :href="`mailto:${help_mail}`" class="border-success">
                Scrivi a {{ help_mail }}</a>
            </b-col>
          </b-row>
        </template>
      </b-card>
    </b-container>
    <content-footer></content-footer>
  </div>
</template>
<script>
import User from "@/models/user";
import ContentFooter from "~theme/ContentFooter.vue";
import Util from "@/mixing/util";
import AuthService from "@/services/auth.service";

const redirUser = {
	user: "/questionari/fill/1/anon",
	admin: "/dashboard",
	moma: "/dashboard",
	moma_area: "/dashboard",
	sportello: "/abbonamenti",
	pendolare: "/pendolare",
	superiori: "/orari",
  moma_bloccato: "/bloccato",
};

export default {
  name: "Login",
  components: { ContentFooter },
  mixins: [Util],
  data() {
    return {
      user: new User("", ""),
      message: "",
      myRoot: process.env.VUE_APP_ROOT,
    };
  },
  computed: {},
  created() {
    if (this.getUser !== null) {
      //console.log("already logged in, going to dashboard", this.user);
      this.redirectToRole();
    }
  },
  methods: {
    redirectToRole() {
      //Redirect the user based on his role
      ////console.log(this.user);
      if (this.user !== undefined && this.user.accessToken !== null) {
        let role = this.user.role;
        //console.log("role", role);
        if (role) {
          let nx = redirUser[role];
          this.$router.push(nx);
        } else {
          this.$bvModal.msgBoxOk(`L'utente richiesto non ha un ruolo autorizzato ad accedere a questa sezione. (role: ${role})
                      Verificare i privilegi con l'amministratore.
                       `);
        }
      }
    },
    async onSubmit() {
      this.loading = true;
      //console.log("prima di user", this.user);

      if (this.$refs["form"].checkValidity()) {
        if (this.user.email && this.user.password) {
          try {
            this.user = await AuthService.login(this.user);
            this.loading = false;
            this.redirectToRole();
          } catch (e) {
            this.loading = false;
            console.log("error", e);
            this.$bvToast.toast(e.response.data.message, {
              title: "Errore",
              autoHideDelay: 2000,
              appendToast: true,
              variant: "danger",
            });

          }
        } //user&pwd
      } //valid
      else {
        this.$refs["form"].reportValidity();
      }
    }, //onSubmit
  }, //methods
};
</script>
<style>
body,
.sticky-footer-wrapper {
  min-height: 100vh;
}

.flex-fill {
  flex: 1 1 auto;
}
</style>
