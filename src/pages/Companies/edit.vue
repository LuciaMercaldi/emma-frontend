<template>
    <div>
	

        <b-form>
            <b-form-group label="Nome Organizzazione" >
                <b-form-input v-model="form.name" id="company_name"></b-form-input>
            </b-form-group>

            <b-form-group label="Tipo Organizzazione">
                <b-form-select v-model="form.type" :options="company_types" id="company_type"></b-form-select>
            </b-form-group>

			

            <b-form-group label="Template Questionario" v-if="!form.id">
                <b-form-select v-model="form.public_survey_template" :options="public_survey_templates" id="public_survey_template"></b-form-select>
            </b-form-group>

			<b-jumbotron class="px-3 py-2">
				
				<b-row>
					<b-col class="flex-grow-1 d-flex align-items-end">
						<p class="mb-0">
							Questa Azienda è 
							<strong :class="isCompanyActive ? 'text-success' : 'text-danger'">
								{{ isCompanyActive ? 'attualmente attiva,' : 'attualmente disattiva,'}}
							</strong>
							{{ isCompanyActive ? 'vuoi disattivarla?':'vuoi riattivarla?' }}
						</p>
					</b-col>
					<b-col class="col-auto text-right">
						<b-button 
						:variant="isCompanyActive ? 'danger' : 'success'" 
						class="btn-sm" 
						@click="toggleCompanyActive">
						{{ isCompanyActive ? 'disattiva' : 'riattiva' }} 
						</b-button>
					</b-col>
				</b-row>

				<b-row class="mt-2" v-if="!isCompanyActive">
					<b-col class="flex-grow-1">
						<v-select 
						v-model="form.years" 
						:options="yearOptions" 
						label="activeYears" 
						multiple 
						placeholder="Seleziona solo gli anni attivi dell'azienda" 
						/>
					</b-col>
				</b-row>

				<b-row class="mt-2">
					<b-col class="d-flex justify-content-end align-items-end">
						<i class="ti-help-alt" style="font-size: 20px;"
						v-b-popover.hover="{  
							content: 'Se non collabori più con questa realtà puoi contrassegnarla come inattiva mantenendo tutti i suoi dati'
						}">
						</i>
					</b-col>
				</b-row>
			</b-jumbotron>

            <hr />

            <b-row v-if="offices.length">
				<b-col cols="10">
					<h4>Sedi</h4>
				</b-col>
				<b-col cols="2">
					<b-button title="Geocodifica tutte le sedi" v-b-modal.geocode_offices class="pull-right" variant="success" size="sm" >Geocodifica sedi</b-button>
				</b-col>
            </b-row>

			<b-table striped hover :items="offices" :fields="office_fields">
				<template v-slot:cell(codice)="data">
					{{data.item.office_code}}
				</template>
									
				<template v-slot:cell(nome)="data">
					{{data.item.name}}
				</template>
														
				<template v-slot:cell(indirizzo)="data">
					<b-icon-globe v-if="(data.item.lat != 0 && data.item.lat !== null)" variant="success" title="Geocodificata con successo"></b-icon-globe>
					{{data.item.address}} {{data.item.cap}} {{data.item.city}} {{data.item.province}}
				</template>

                <template v-slot:cell(azioni)="data" class="flex-shrink-0">
                    <div class="btn-group">
                        <b-button @click="$router.push(`/offices/edit/${data.item.id}?redirect_to=/aziende/edit/${data.item.company_id}`)" variant="primary" size="sm" title="Modifica Sede"><i class="fa fa-edit"></i> </b-button>
                        <b-button v-if="isAuthorized('admin')" :disabled="loading" variant="primary" size="sm" title="Elimina Sede" @click="deleteOffice(data.item.id)"><i class="fa fa-trash"></i>
                            <b-spinner small v-if="loading"></b-spinner>
                            <span class="sr-only" v-if="loading">Loading...</span>
                        </b-button>
                        <b-button @click="$router.push(`/offices/survey/${data.item.id}?redirect_to=/aziende/edit/${data.item.company_id}`)" variant="primary" size="sm" title="Compila Questionario Sede">
                            <i class="fa fa-address-book" aria-hidden="true"></i> Questionario
                        </b-button>
                        <b-dropdown right text="Mobility Label" variant="primary" v-if="canShowMobilityLabel">
                            <b-dropdown-item @click="$router.push(`/mobility-label/edit/${data.item.id}?redirect_to=/aziende/edit/${data.item.company_id}`)"><i class="fa fa-pencil" aria-hidden="true"></i> Questionario Mobility Label
                            </b-dropdown-item>
                            <b-dropdown-item @click="$router.push(`/mobility-label/${data.item.id}?redirect_to=/aziende/edit/${data.item.company_id}`)" variant="primary" size="sm" title="Visualizza Mobility Label">
                                <i class="fa fa-tag"></i> Visualizza Mobility Label
                            </b-dropdown-item>
                        </b-dropdown>
                    </div>
                </template>
            </b-table>
            <b-button class="mr-2" variant="success" @click="$router.push(`/offices/add/${form.id}?redirect_to=/aziende/edit/${form.id}`)" v-if="form.id" :disabled="savingNewCompany">
                <i class="fa fa-plus" aria-hidden="true"></i>
                Aggiungi {{ offices.length == 0 ? "la sede principale" : "altra sede" }}
            </b-button>

            <component :is="survey_form_component" v-if="form.survey" :form="form.survey"></component>

            <b-spinner v-if="savingNewCompany" variant="primary" label="Spinning"></b-spinner>
            <b-button :disabled="savingNewCompany || !(form.name && form.type) || !this.isCompanyActive && (!this.form.years || this.form.years.length === 0)" @click="submit" variant="primary">Salva</b-button>
        </b-form>

        <b-modal v-model="showAddCompanyTypeModal" title="Nuova Organizzazione">
            <b-form-group label="Nome">
                <b-form-input v-model="newCompanyType.name"></b-form-input>
            </b-form-group>
            <b-form-group label="Questionario">
                <b-form-select v-model="newCompanyType.survey_template" :options="survey_templates"></b-form-select>
            </b-form-group>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button variant="danger" size="sm" class="float-right" @click="showAddCompanyTypeModal = false"> Annulla </b-button>
                    <b-button :disabled="!(newCompanyType.name && newCompanyType.survey_template)" variant="primary" size="sm" class="float-right" @click="addCompanyType">
                        Ok
                    </b-button>
                </div>
            </template>
        </b-modal>

	<b-modal
      id="geocode_offices"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      :hide-header-close="true"
      size="xl"
	  @ok.prevent="geocodeOffices()"
	  @hidden="stopGeocode()"
      scrollable>
      <template #modal-title> Geocodifica tutte le sedi</template>
      <div class="">
		
        <b-progress :max="offices.length" class="mb-3">
          <b-progress-bar
            variant="success"
            :value="offices_geocode.success"
            show-progress></b-progress-bar>
          <b-progress-bar
            variant="danger"
            :value="offices_geocode.errors"
            show-progress></b-progress-bar>
        </b-progress>

		<b-check class="pull-right" v-model="geocode_force">Geocodifica tutte le sedi (anche se hanno già le coordinate)</b-check>

		<br>

        <table style="margin-top: 10px">
          <tr v-for="(row, index) in offices_geocode.log" :key="index">
            <td>
              <b>{{ row.row }}&nbsp;&nbsp;&nbsp;</b>
            </td>
            <td>
              <span v-if="row.success" style="color: green">{{
                row.message
              }}</span>
              <span v-if="!row.success" style="color: red">{{
                row.message
              }}</span>
            </td>
          </tr>
        </table>
      </div>

	  <template #modal-footer="{ hide }">
			<b-button variant="danger" @click="stopGeocode()">
				Interrompi
			</b-button>
			<b-button variant="secondary" v-if="geocode_finished" @click="hide('forget')">
				Chiudi
			</b-button>
			<b-button variant="success" @click="geocodeOffices()" v-if="!geocode_finished" :disabled="geocode_running">
				Geocodifica
			</b-button>

    	</template>
	</b-modal>
	
	</div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import { company_survey_form_data } from "@/data/company-survey.config";
import vSelect from "vue-select";
import BreadCrumb from '@/components/BreadCrumb.vue';

export default {
	name: "CompaniesEdit",
	mixins: [Util],
	components: {
		"questionario-generale-azienda": () => import("@/components/QuestionarioAzienda/Generale/Azienda.vue"),
		"questionario-generale-scuola": () => import("@/components/QuestionarioAzienda/Generale/Scuola.vue"),
		vSelect,
		BreadCrumb,
	},
	data() {
		return {
			form: {
				id: null,
				name: null,
				type: null,
				public_survey_template: -1,
				survey: null,
				years: [], // WIP Array per anni selezionati
			},
			company_id: this.$route.params.company_id,
			company_types: [],
			survey_form_component: null,
			showAddCompanyTypeModal: false,
			newCompanyType: {
				name: "",
				survey_template: null,
			},
			survey_templates: Object.keys(company_survey_form_data.generale).map((k) => ({
				value: k,
				text: k,
			})),
			offices: [],
			office_fields: ['codice','nome','indirizzo', 'azioni'],
			stop_geocode: false,
			geocode_force: false,
			geocode_finished: false,
			geocode_running: false,
			offices_geocode: {
				success: 0,
				errors: 0,
				log: [],
			},
			public_survey_templates: [],
			savingNewCompany: false,
			loading: false,
			isCompanyActive: true,
		};
	},
	watch: {
		"form.type": function () {
			if (this.form !== undefined){
				const res = UserService.getCompanySurveyForm("generale", this.company_types, this.form.type, this.form.survey);
				this.form.survey = res.formData;
				this.survey_form_component = res.component;
			}
		},
	},
	async created() {
		try {
			this.company_types = (await UserService.getCompanyTypes()).data.company_types.map((type) => ({
				...type, // keep existing data for various uses
				value: type.id,
				text: type.name,
			}));
			if (this.$route.params.id) {
				const res = (await UserService.getCompany(this.$route.params.id)).data;
				this.form = res.company; // survey form will be automatically filled through watch on changed company type
				this.offices = res.offices;		
				if(this.form.years==null || this.form.years.length==0){ 
					this.isCompanyActive=true;
				}else{
					this.isCompanyActive=false;
				}
			} else {
				this.public_survey_templates = [
					{
						value: -1,
						text: ">> Crea questionario vuoto",
					},
					...(await UserService.surveyTemplatesList()).data.templates.map((template) => ({
						value: template.id,
						text: template.name,
					})),
				];
			}
		} catch (e) {
			//console.log(e);
			this.$bvToast.toast(e.message, {
				title: "Errore",
				autoHideDelay: 2000,
				appendToast: true,
				variant: "danger",
			});
		}
	},
	methods: {
		openAddCompanyTypeModal() {
			this.newCompanyType = {
				name: "",
				survey_template: null,
			};
			this.showAddCompanyTypeModal = true;
		},
		async deleteOffice(id) {
			this.loading = true;
			let self = this;

			this.$bvModal.msgBoxConfirm("Vuoi davvero cancellare").then(value =>  {
				if (value){
					try {
						UserService.deleteOffice(id).then(v =>  {
							let o = self.offices.findIndex((x) => x.id == id);
							//console.log(o);
							self.offices.splice(o, 1);
							self.loading = false;
							//this.$router.go();
						});
					} catch (e) {
						this.$bvToast.toast(e.message, {
							title: "Errore",
							autoHideDelay: 2000,
							appendToast: true,
							variant: "danger",
						});
					}
				} else {
					this.loading = false;
				}
			});
		},
		async submit() { 
			this.savingNewCompany = true;
			try {
				console.log("salvataggio", this.form);
				let l = await UserService.editCompany(this.form, this.form.id);
				this.form = l.data.company;
				console.log("salvata", this.form);
				this.$bvToast.toast("Salvataggio avvenuto correttamente", {
					title: "Invio ok",
					autoHideDelay: 2000,
					appendToast: true,
				});
			} catch (e) {
				this.$bvToast.toast(e.message, {
					title: "Errore",
					autoHideDelay: 2000,
					appendToast: true,
					variant: "danger",
				});
			} finally {
				this.savingNewCompany = false;
			}
		},
		async addCompanyType() {
			try {
				const companyType = (await UserService.addCompanyType(this.newCompanyType)).data.companyType;
				// refresh company types
				this.company_types.push({
					...companyType,
					value: companyType.id,
					text: companyType.name,
				});
				// select the new company type
				this.form.type = companyType.id;
				this.showAddCompanyTypeModal = false;
			} catch (e) {
				this.$bvToast.toast(e.message, {
					title: "Errore",
					autoHideDelay: 2000,
					appendToast: true,
					variant: "danger",
				});
			}
		},

		async geocodeOffices() {
			this.geocode_finished = false;
			this.geocode_running = true;
			this.stop_geocode = false;
			this.offices_geocode.success = 0;
			this.offices_geocode.error = 0;
			this.offices_geocode.log = [];
			try {
				for (let office of this.offices) {
					//console.log(office.id);
					if (this.stop_geocode){
						break;
					}
					const res = await UserService.geocodeOffice(office.id, this.geocode_force);
					if (res.data.msg == ""){
						this.offices_geocode.success++;
						this.offices_geocode.log.unshift({
							success: true,
							message: `Sede ${office.name} geocodificata`,
						});
						office = res.data.office;
						
					} else {
						this.offices_geocode.errors++;
						this.offices_geocode.log.unshift({
							success: false,
							message: `Sede ${office.name} errore geocodifica`,
						});
					}
				}
			} catch (e) {
				this.$bvToast.toast(e.message, {
					title: "Errore",
					autoHideDelay: 2000,
					appendToast: true,
					variant: "danger",
				});
			}
			this.geocode_finished = true;
			this.geocode_running = false;
		},

		stopGeocode(){
			this.geocode_finished = false;
			this.geocode_running = false; 
			this.stop_geocode = true;
		},
		toggleCompanyActive() { 
      		this.isCompanyActive = !this.isCompanyActive;
			if(this.isCompanyActive){
				this.form.years=null;
			}
    	},
	},
};
</script>
