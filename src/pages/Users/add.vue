<template>
    <div>
        <h1>Aggiunta Utente</h1>
        <b-form @submit.prevent>
            <b-form-row>
                <b-col>
                    <b-form-group label="Email">
                        <b-input type="email" label="Email" placeholder="Email" v-model="user.email"> </b-input>
                    </b-form-group>
                </b-col>
            </b-form-row>

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
                <b-col cols="6">
                    <b-form-group label="Azienda">
                        <b-form-select v-model="user.company_id" :options="companies" text-field="name" value-field="id"> </b-form-select>
                    </b-form-group>
                </b-col>
                <b-col cols="6">
                    <b-form-group label="Ruolo">
                        <b-form-select v-model="user.role" :options="userRoles"> </b-form-select>
                    </b-form-group>
                </b-col>
            </b-form-row>

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

            <b-form-row>
                <b-button variant="primary" type="submit" @click="onSubmit()">Salva</b-button>
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
			},
			companies: [],
			// roles: user_roles,
			result: "",
		};
	},
	async created() {
		let res = await UserService.getCompanyList();
		////console.log(res);
		this.companies = res.data.companies;
	},
	methods: {
		async onSubmit() {
			this.result = await UserService.addUser(this.user);
			return history.go(-1);
		},
	},
};
</script>
