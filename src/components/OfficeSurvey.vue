<template>
    <div v-if="office.id">
		<BreadCrumb v-if="this.office.company_id" :company_id="parseInt(this.office.company_id)" :office_id="parseInt(office_id)"></BreadCrumb>
    
        <h3>
            Questionario Sede
        </h3>
        <hr />
        <component v-if="survey_form_component" :is="current" :form="form"></component>
        <b-button variant="primary" @click="submit()">Salva</b-button>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import BreadCrumb from "@/components/BreadCrumb.vue";

export default {
	name: "OfficeSurveyWidget",
	mixins: [Util],
	props: {
		survey_type: String,
		office_id: String,
		redirect_to: String,
	},
	components: {
		BreadCrumb
	},
	data() {
		return {
			form: {},
			survey_form_component: null,
			office: {},
			company: {},
			surv_default: {
				"questionario-generale-azienda": "components/QuestionarioAzienda/Generale/Azienda.vue",
				"questionario-generale-scuola": "components/QuestionarioAzienda/Generale/Scuola.vue",
				"questionario-sede-azienda": "components/QuestionarioAzienda/Sede/Azienda.vue",
				"questionario-sede-scuola": "components/QuestionarioAzienda/Sede/Scuola.vue",
			}, 
		};
	},
	async created() {
		try {
			//Importo i default dal tema giusto (in modo da poter parametrizzare le survey)
			let t = await import("@/theme/" + process.env.VUE_APP_THEME + "/survey-defaults");
			console.log(t);
			//Se non è definito prendo lo standard
			if (t.survey_components){
				this.surv_default = t.survey_components;
			}
			//console.log("surv_default", this.surv_default);

			this.office = (await UserService.getOffice(this.office_id)).data.office;
			this.company = (await UserService.getCompany(this.office.company_id)).data.company;
			
			const res = UserService.getCompanySurveyForm(
				this.survey_type,
				(await UserService.getCompanyTypes()).data.company_types,
				this.company.type,
				this.office.survey ,
			);
			console.log("res", res);	
			
			this.survey_form_component = res.component;
			this.form = res.formData;
			// prefill geo info from office
			if (this.survey_type === "sede") {
				this.form = {
					...this.form,
					ul_comune: this.office.city || "" ,
					ul_cap: this.office.cap || "" ,
					ul_indirizzo: this.office.address || "" ,
				};
			} else {
				this.form = {
					...this.form,
					company_name: this.form.company_name ? this.form.company_name : this.company.name,
					survey_date: Date.now(),
				};
			}
		} catch (e) {
			console.log(e);
			this.$bvToast.toast(e.message, {
				title: "Errore",
				autoHideDelay: 2000,
				appendToast: true,
				variant: "danger",
			});
		}
	},
	methods: {
		async submit() {
			try {
				this.office.survey = this.form;
				await UserService.editOffice(this.office, this.office_id);
				this.$bvToast.toast("Salvataggio avvenuto correttamente", {
					title: "Salvataggio ok",
					autoHideDelay: 2000,
					appendToast: true,
				});
				if (this.redirect_to) {
					setTimeout(() => {
						// set a timeout to let the toast appear before redirecting
						this.$router.push(this.redirect_to);
					}, 500);
				}
			} catch (e) {
				this.$bvToast.toast(e.message, {
					title: "Errore",
					autoHideDelay: 2000,
					appendToast: true,
					variant: "danger",
				});
			}
		},
	},
	computed: {
		current() {
			if (this.survey_form_component) {
				console.log("surv_default", this.surv_default);
				return this.surv_default[this.survey_form_component]
			};		
		}
	},
};
</script>
