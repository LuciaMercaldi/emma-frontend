<template>
    <div class="row">
        <b-col cols="3" offset="4" class="mt-3">
            <b-card cols="3" class="text-center" title="Cambia Password">
                <form id="loginForm" class="form-horizontal" accept-charset="utf-8" @submit.prevent="onSubmit()">
                    <b-form-group label="Nuova Password">
                        <b-input type="password" v-model="form.pwd"> </b-input>
                    </b-form-group>
                    <b-form-group label="Conferma Password">
                        <b-input type="password" v-model="form.pwd2"> </b-input>
                    </b-form-group>

                    <input class="btn btn-primary" type="submit" value="Cambia Password" />
                </form>
            </b-card>
        </b-col>
    </div>
</template>
<script>
import UserService from "@/services/user.service";
import util from "@/mixing/util";
// import { use } from "vue/types/umd";

export default {
	name: "ChangePassword",
	mixins: [util],
	data() {
		return {
			form: {
				pwd: "",
				pwd2: "",
			},
		};
	},
	methods: {
		async onSubmit() {
			let token = this.$route.params.token;
			try {
				if(this.getUser != null){
					this.form.userId = token;
					await UserService.changePassword(this.form, token);
					//TODO: Migliorare la notifica in caso di successo o errore
					this.$bvToast.toast("Cambio password avvenuto correttamente", {
						title: "Invio ok",
						appendToast: true,
					});
					window.location.assign("/dashboard")
					
					
				}else{
					await UserService.changePassword(this.form, token);
					//TODO: Migliorare la notifica in caso di successo o errore
					this.$bvToast.toast("Cambio password avvenuto correttamente", {
						title: "Invio ok",
						appendToast: true,
					});
					window.location.assign("/login")
				}
				
				
			} catch (error) {
				//console.log(error);
				this.showError(error);
			}
		}, //onSubmit
	},
};
</script>
<style></style>
