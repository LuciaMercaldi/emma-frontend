<template>
    <div class="page-holder bg-cover d-flex flex-column sticky-footer-wrapper cover-back">
        <b-container class="flex-fill">
            <b-card class="overflow-hidden mt-5" footer-tag="footer" :class="logo ? 'col-md-8 offset-md-2' : 'col-md-6 offset-md-3'">
                <b-overlay :show="loading" rounded="sm">
                    <b-row no-gutters>
                        <b-col md="6" v-if="logo" style="padding: 3em">
                            <b-card-img :src="logo" :alt="title" class="rounded-0"></b-card-img>
                        </b-col>
                        <b-col :md="logo ? 6 : 12">
                            <b-row class="text-center" style="padding: 2em">
                                <b-card-body>
                                    <b-alert :show="error">
                                        Impossibile accedere al sistema!<br />
                                        {{ error }}
                                    </b-alert>
                                    <b-button @click="login" v-if="user == null" class="mt-3" variant="primary">Accedi</b-button>
                                    <br />
                                    <b-button @click="logout" v-if="user != null" class="mt-3" size="sm">Logout</b-button>
                                </b-card-body>
                            </b-row>
                            <b-row>
                                <b-col cols="12">
                                    <h5>Serve aiuto per l'accesso o l'utilizzo?</h5>
                                    <a :href="`mailto:${help_mail}`" class="border-success"> Scrivi a {{ help_mail }}</a>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-overlay>
                <b-row>
                    <b-col class="mt-3">
                        <b-progress :value="value" :max="max" show-progress animated variant="success"></b-progress>
                    </b-col>
                </b-row>
            </b-card>
        </b-container>
        <content-footer></content-footer>
    </div>
</template>

<script>
import createAuth0Client from "@auth0/auth0-spa-js";
import AuthService from "@/services/auth.service";
import Util from "@/mixing/util.js";
import ContentFooter from "~theme/ContentFooter.vue";

const domain = process.env.VUE_APP_AUTH0_DOMAIN;
const clientId = process.env.VUE_APP_AUTH0_CLIENTID;
const audience = process.env.VUE_APP_AUTH0_AUDIENCE;

export default {
	data() {
		return {
			token: null,
			user: null,
			auth0Client: null,
			value: 0,
			max: 100,
			error: null,
		};
	},
	mixins: [Util],
	components: { ContentFooter },
	computed: {},
	async created() {
		this.user = this.getUser;

		if (this.user != null) {
			this.token = this.user.accessToken;
		}

		try {
			// If the user is returning to the app after authentication
			if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
				this.loading = true;
				this.auth0Client = await createAuth0Client({
					domain,
					client_id: clientId,
					audience,
					redirect_uri: window.location.origin + window.location.pathname,
				});
				

				try {
					this.value = 50;
					//console.log(this.value);
					await this.auth0Client.handleRedirectCallback();
					this.value = 60;
					//console.log(this.value);
					this.user = await this.auth0Client.getUser();
					////console.log("autho/getuser", this.user);
					this.value = 70;
					//console.log(this.value);
					this.user.accessToken = await this.auth0Client.getTokenSilently();
					this.value = 85;
					//console.log(this.value);
					this.token = this.user.accessToken;
					//Memorizzo in localstorage
					this.setUser(this.user);
					this.value = 90;
					//console.log(this.value);
					//Leggo a db i valori accessori
					this.user = await AuthService.whoAmI();
					////console.log("dopo whoami", this.user);
					this.value = 100;
					//console.log(this.value);
					//window.location = "/dashboard";
					//console.log("Sto per fare redirect alla dashboard");
					this.$router.push({ name: "Cruscotto" }).catch((error) => {
						//console.log(error.message);
					});
				} catch (e) {
					this.error = e.message;
					//Tolgo l'utente dal localstorage
					this.delUser();
				} finally {
					this.loading = false;
				}
			} else {
				if (this.user == null) {
					//await this.login();
				}
			}
		} catch (e) {
			this.error = e;
		} finally {
			this.loading = false;
		}
	},
	methods: {
		async login() {
			this.loading = true;
			this.delUser();
			this.auth0Client = await createAuth0Client({
				domain,
				client_id: clientId,
				audience,
				redirect_uri: window.location.href,
			});
			this.auth0Client.loginWithRedirect();
		},
		async logout() {
			this.loading = true;
			this.delUser();
			this.auth0Client = await createAuth0Client({
				domain,
				client_id: clientId,
				audience,
				redirect_uri: window.location.origin + window.location.pathname,
			});
			//Tolgo l'utente dal localstorage
			this.auth0Client.logout({ returnTo: window.location.origin });
		},
	},
};
</script>
