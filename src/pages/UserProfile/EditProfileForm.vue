<template>
    <card class="card" title="Il tuo profilo">
        <div>
            <form @submit.prevent>
                <div class="row">
                    <div class="col-md-6">
                        <fg-input type="text" label="Nome" placeholder="First Name" v-model="user.first_name"> </fg-input>
                    </div>
                    <div class="col-md-6">
                        <fg-input type="text" label="Cognome" placeholder="Last Name" v-model="user.last_name"> </fg-input>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4">
                        <fg-input type="text" label="Azienda" :disabled="true" v-model="company"> </fg-input>
                    </div>
                    <div class="col-md-4">
                        <fg-input type="email" label="Email" placeholder="Email" v-model="user.email"> </fg-input>
                    </div>
                    <div class="col-md-4">
                        <fg-input type="phone" label="Telefono" placeholder="+39 333 000000" v-model="user.mobile"> </fg-input>
                    </div>
                </div>

                <div class="text-center">
                    <p-button type="info" round @click.native.prevent="updateProfile"> Aggiorna Profilo </p-button>
                    <b-link :to="`users/change-password/${user.id}`" class="primary" v-if="isAuthorized('user, moma, admin, superiori')">
                        <i class="fa fa-key" aria-hidden="true"></i> Cambia Password</b-link>
                </div>
                <div class="clearfix"></div>
            </form>
        </div>
    </card>
</template>
<script>
import Util from "@/mixing/util";
import UserService from "@/services/user.service";

export default {
	mixins: [Util],
	data() {
		return {
			user: {},
			company: null,
		};
	},
	mounted: async function () {
        let u =this.getUser;
		this.user.first_name = u.first_name;
		this.user.last_name = u.last_name;
		this.user.email = u.email;
		this.user.mobile = u.mobile;
		this.user.id = u.id;

        this.company = "";
        if (this.user.company_id) {
            this.company = await UserService.getCompany(this.user.company_id);
    		this.company = this.company.data.company.name;
        }
	},

	methods: {
		async updateProfile() {   
            try {
                let u = await UserService.saveUser(this.user);
            
                this.user = u.data.user;
                let ucookie =this.getUser;
                console.log(ucookie);
                ucookie.first_name = this.user.first_name;
                ucookie.last_name = this.user.last_name;
                ucookie.email = this.user.email;
                ucookie.mobile = this.user.mobile;
                ucookie.id = this.user.id;
                console.log(ucookie);
                this.setUser(ucookie);
                this.$bvToast.toast("Profilo aggiornato con successo", {
						title: "Aggiornamento Profilo",
						variant: "success",
						autoHideDelay: 2000,
						appendToast: true,
					});
            } catch (error) {
                this.$bvToast.toast("Errore aggiornamento profilo", {
						title: "Errore Aggiornamento",
						variant: "error",
						autoHideDelay: 2000,
						appendToast: true,
					});
            }         

		},
	},
};
</script>
<style></style>
