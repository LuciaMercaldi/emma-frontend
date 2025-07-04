<template>
    <div>
        <b-container class="d-flex">
            <b-card :img-src="logo" img-alt="Logo" img-top style="max-width: 20rem" class="mb-2 justify-content-center mt-4">
                <b-card-title>Reset Password <span>o attivazione account</span></b-card-title>
                <b-overlay :show="loading" rounded="sm">
                    <form id="loginForm" class="form-horizontal" accept-charset="utf-8" @submit.prevent="onSubmit()">
                        <b-row class="my-2">
                            <label class="col-12 control-label required">Inserisci il tuo Username o la tua mail per resettare la password o attivare l'account</label>
                            <div class="col-12">
                                <div class="input text">
                                    <input
                                        name="reference"
                                        placeholder="Email / Username"
                                        class="form-control"
                                        maxlength="100"
                                        type="text"
                                        id="reference"
                                        required="required"
                                        v-model="reference"/>
                                </div>
                            </div>
                        </b-row>
                        <b-row class="mt-5">
                            <b-col cols="4">
                                <input class="btn btn-primary" id="loginSubmitBtn" type="submit" value="Invia Link" />
                            </b-col>
                            <b-col cols="8">
                                <b-alert :show="message != ''">{{ message }}</b-alert>
                            </b-col>
                        </b-row>
                    </form>
                </b-overlay>
            </b-card>
        </b-container>
    </div>
</template>

<script>
import UserService from "@/services/user.service";

export default {
	name: "ResetPassword",
	data() {
		return {
			reference: "",
			loading: false,
			message: "",
			logo: process.env.VUE_APP_ICON,
		};
	},
	methods: {
		onSubmit() {
			this.loading = true;
			var self = this;
			UserService.resetPassword(this.reference)
				.then((result) => (self.message = result.data.msg))
				.catch(() => (self.message = "L'utente inserito non esiste, puoi controllare?"));

			this.loading = false;
		}, //onSubmit
	}, //methods
};
</script>
<style scoped>
.login-outer-box {
    padding: 60px 30px 40px 20px;
    background: #f49537;
    border-radius: 10px;
}
.login-inner-box {
    padding: 30px;
    background: #212025;
    border-radius: 10px;
    color: #fff;
}
#logo_ape {
    height: 100px;
    margin-top: -80px;
}
</style>
