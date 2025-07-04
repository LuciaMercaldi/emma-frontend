<template>
    <div class="row">
        <form id="loginForm" class="form-horizontal" accept-charset="utf-8" @submit.prevent="onSubmit()">
            <b-form-group label="Utenti da importare (uno per riga)">
                <b-textarea v-model="form.users"> </b-textarea>
            </b-form-group>

            <b-form-group label="Ruolo da assegnare">
                <b-select :options="userRoles" v-model="form.role"> </b-select>
            </b-form-group>
            <input class="btn btn-primary" type="submit" value="Importa" />
        </form>
    </div>
</template>
<script>
import UserRoles from "@/data/user-roles";
import Util from "@/mixing/util";
import UserService from "@/services/user.service";

export default {
	name: "ImportUsers",
	mixins: [Util],
	data() {
		return {
			form: {
				users: "",
				role: null,
			},
			userRoles: UserRoles,
		};
	},
	methods: {
		async onSubmit() {
			try {
				await UserService.importUsers(this.form);
				this.$bvToast.toast("Importazione avvenuta correttamente", {
					title: "Invio ok",
					autoHideDelay: 2000,
					appendToast: true,
				});
			} catch (error) {
				this.showError(error);
			}
		}, //onSubmit
	},
};
</script>
<style></style>
