<template>
    <div class="container bg-white p-2 mt-2">
        <h1>Registrazione Utente</h1>
        <p>Richiedi la registrazione alla piattaforma.</p>
        <b-form @submit.prevent>
            <b-card title="I tuoi dati">
            <b-form-row>
                <b-col>
                    <b-form-group label="Nome">
                        <b-input type="text" placeholder="Nome" v-model="user.first_name"> </b-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Cognome">
                        <b-input type="text" placeholder="Cognome" v-model="user.last_name"> </b-input>
                    </b-form-group>
                </b-col>
            </b-form-row>

            <b-form-row>
                <b-col cols="12">
                    <b-form-group label="Email">
                        <b-input type="email" label="Email" placeholder="Email" v-model="user.email"> </b-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
            </b-card>
           
            <b-card title="La tua azienda">
            <b-form-row>
                <b-col cols="6">
                    <b-form-group label="Nome Azienda">
                        <b-input v-model="azienda" text-field="name" value-field="id"> </b-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
            </b-card>

            <b-card title="Password">
            <b-form-row>
                <b-col>
                    <b-form-group label="Password">
                        <b-input type="password" v-model="user.password"> </b-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Conferma Password">
                        <b-input type="password" v-model="user.confirm_password"> </b-input>
                    </b-form-group>
                </b-col>
            </b-form-row>
            </b-card>

            <b-card title="Autorizzazioni">
                <b-form-row>
                <b-col>
                    <b-form-group label="Referente Aziendale">
                        <b-checkbox v-model="referente">Dichiaro di essere il referente aziendale delegato ad utilizzare la piattaforma, e di avere un mandato dalla mia azienda per la registrazione.</b-checkbox>
                    </b-form-group>
                </b-col>
                </b-form-row>
                <b-form-row>
                <b-col>
                    <b-form-group label="Privacy">
                        <b-checkbox v-model="privacy">Autorizzo Regione Piemonte, 5T e MobilitySquare a trattare i dati conferiti per i soli scopi legati alle attività del Mobility Management</b-checkbox>
                    </b-form-group>
                </b-col>
                </b-form-row>

                <b-form-row>
                <b-col>
                    <b-form-group label="Termini e Condizioni">
                        <b-checkbox v-model="A">Dichiaro di aver letto i <a href="terms.pdf">Termini e le confizioni di utilizzo della piattaforma.</a> </b-checkbox>
                    </b-form-group>
                </b-col>
                </b-form-row>

            </b-card>
            
            <b-form-row>
                <b-col class="d-flex justify-content-end">
                    <b-button variant="success" type="submit" @click="onSubmit()">Firma e Invia</b-button>
                </b-col>
            </b-form-row>
        </b-form>
    </div>
</template>

<script>
// import user_roles from "@/data/user-roles";
import UserService from "@/services/user.service";
import Util from "@/mixing/util";

export default {
    mixins: [Util],
	components: {},
	data: function () {
		return {
			user: {
				email: null,
				first_name: null,
				last_name: null,
				company_id: null,
				role: null,
				password: null,
				confirm_password: null,
                //insert all fields declared in template

			},
ì		};
	},
	async created() {
	},
	methods: {
		async onSubmit() {
			//this.result = await UserService.addUser(this.user);
			console.log(this.user);
		},
	},
};
</script>
