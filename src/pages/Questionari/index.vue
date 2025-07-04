<template>
	<div>
			<b-row>
				<b-col class="flex-grow-1">
					<b-form-input v-model="filter.name" placeholder="cerca per titolo" v-on:keyup.enter="fetchSurveys()" type="search" ></b-form-input>
				</b-col>
			
				
					<b-button @click="fetchSurveys()" variant="default"><i class="fa fa-search" aria-hidden="true"></i>
						filtra
					</b-button>
					&nbsp;
					<b-button class="ml-2" @click="showSurveyModal()" variant="success" v-if="isAuthorized('admin, moma-area')"> 
						<b-icon-plus></b-icon-plus> nuovo questionario
					</b-button>
				

			</b-row>
			<hr />
			<b-row>
				<b-col>
			<b-table
				v-if="surveys.length"
				striped
				:items="surveys"
				:fields="tableColumns"
				id="surveyTable"
				:sort-by.sync="sortBy"
				:sort-desc.sync="sortDesc"
				:busy.sync="loading"
				:current-page="pagination.page">

				<template #table-busy>
					<div class="text-center text-danger my-2">
						<b-spinner class="align-middle"></b-spinner>
						<strong>Loading...</strong>
					</div>
				</template>
				<template v-slot:cell(Azienda)="data">						
					<h5>
						<span v-if="data.item.version_tag == 'template'" class="ti-layers-alt text-success"></span>
						<span v-else-if="data.item.company !== null && data.item.company.type == 4" class="fa fa-child text-success"></span>
						<span v-else class="fa fa-building-o text-success"></span>
						<span v-if="data.item.version_tag == 'template'"> TEMPLATE </span> {{ data.item.name+  (data.item.year!==null ? '-' +data.item.year : '') }}
						<template v-if="data.item.company !== null"> ({{ data.item.company.name+ (data.item.year!==null ? '-' +data.item.year : '') }}) </template>
					</h5>
					<p class="text-muted small">{{ data.item.description }}</p>
				</template>

				<template v-slot:cell(Avanzamento)="data">	
					<span v-if="data.item.version_tag !== 'template'">
						{{ stats[data.item.id] }}
					</span>
				</template>

				<template v-slot:cell(azioni)="data">	
								<b-dropdown id="dropdown-1"  class="m-md-2" size="sm" variant="primary">
									<template #button-content>Azioni </template>
								<b-dropdown-item v-if="data.item.version_tag !== 'template'" :to="`/analytics/?survey_id=${data.item.id}`">
									<span class="ti-bar-chart"></span> Statistiche
								</b-dropdown-item>
								<b-dropdown-item v-if="data.item.version_tag !== 'template'" :to="'/questionari/users-list/' + data.item.id">
									<span class="ti-menu-alt"></span> Risposte Utenti
								</b-dropdown-item>
								<b-dropdown-item :to="'/questionari/edit/' + data.item.id"> <span class="ti-pencil"></span> Gestisci </b-dropdown-item>
								<b-dropdown-item @click="confirmDelete(data.item.id)" v-if="loggedUserIsAdmin"><span class="ti-trash"></span> Elimina </b-dropdown-item>
								<b-dropdown-item
									v-if="data.item.version_tag !== 'template' && isAuthorized('admin')"
									:disabled="creatingTemplate"
									size="sm"
									v-b-popover.hover="'Genera un nuovo template a partire da questo questionario'"
									@click="createTemplate(data.item.id)">
									<span class="ti-layers-alt"></span> Crea template
								</b-dropdown-item>
								<b-dropdown-item v-if="data.item.company_id" @click="openImportOriginsFromAnswersModal(data.item.company_id,data.item.id)">
									<span class="ti-world"></span> Geocodifica
								</b-dropdown-item>
								<b-dropdown-item v-if="data.item.company_id" @click="exportSurveyData(data.item.id, data.item.name,false)">
									<span class="ti-export"></span> Export
								</b-dropdown-item>
								<b-dropdown-item 
									v-if="data.item.company_id" @click="exportSurveyData(data.item.id, data.item.name,true)"
									v-b-popover.hover="'Esporta anche le risposte incomplete'">
									<span class="ti-export"></span> Export Totale
								</b-dropdown-item>
								<b-dropdown-item v-if="data.item.company_id" @click="exportMapQuestion(data.item.id, data.item.name)">
									<span class="ti-export"></span> Export Domanda Mappa
								</b-dropdown-item>
							</b-dropdown>
					</template>
			</b-table>

			<div v-if="surveys.length == 0" class="text-center">Nessun questionario trovato</div>

			<div class="mt-3">
				<b-pagination
					v-model="pagination.page"
					:total-rows="pagination.count"
					:per-page="pagination.perPage"
					first-text="First"
					prev-text="Prev"
					next-text="Next"
					last-text="Last"
					align="center"
					@change="changePage($event)"></b-pagination>
			</div>
				</b-col>
			</b-row>

            <b-modal id="bv-modal-confirm-delete" variant="danger">
                <template v-slot:modal-title> Conferma cancellazione </template>
                <div>
                    <p>Vuoi davvero cancellare questo questionario?</p>
                    <p>
                        Proseguendo verrà rimosso tutto il questionario e saranno eliminate sia le domande che le risposte.<br />
                        Operazione irreversibile
                    </p>
                </div>
                <template v-slot:modal-footer>
                    <div class="w-100">
                        <b-button @click="$bvModal.hide('bv-modal-confirm-delete')" class="mr-1">Annulla</b-button>
                        <b-button @click="delSurvey(current_survey)" variant="danger"><span class="ti-trash"></span> Elimina</b-button>
                    </div>
                </template>
            </b-modal>

            <b-modal id="import-origins-from-answers-modal" :no-close-on-backdrop="true" :no-close-on-esc="true" :hide-header-close="true">
                <template #modal-title> Importa origini da questionari e geocodifica </template>
                <div>Le origini eventualmente già importate verranno sovrascritte</div>
                <template #modal-footer>
                    <b-button :disabled="actions.importFromAnswers.importing" @click="$bvModal.hide('import-origins-from-answers-modal')">Chiudi</b-button>
                    <b-button :disabled="actions.importFromAnswers.importing" variant="primary" @click="importOriginsFromAnswers()">Importa</b-button>
                    <b-spinner v-if="actions.importFromAnswers.importing" variant="primary" label="Spinning"></b-spinner>
                </template>
            </b-modal>
            <b-modal id="geocode-origins-modal" :no-close-on-backdrop="true" :no-close-on-esc="true" :hide-header-close="true">
                <template #modal-title> Geolocalizza origini </template>
                <div v-if="actions.geocodeOrigins.fetching" class="text-center">
                    <b-spinner variant="primary" label="Spinning"></b-spinner>
                </div>
                <div v-if="actions.geocodeOrigins.ids.length">
                    <b>{{ actions.geocodeOrigins.ids.length }}</b> origini da geolocalizzare
                    <b-progress class="mt-2" :max="actions.geocodeOrigins.ids.length" show-value>
                        <b-progress-bar :value="actions.geocodeOrigins.geocodedOkNum" variant="success"></b-progress-bar>
                        <b-progress-bar :value="actions.geocodeOrigins.geocodedKoNum" variant="danger"></b-progress-bar>
                    </b-progress>
                </div>
                <template #modal-footer>
                    <b-button :disabled="actions.geocodeOrigins.geocoding || actions.geocodeOrigins.fetching" @click="$bvModal.hide('geocode-origins-modal')">Chiudi</b-button>
                    <b-button
                        :disabled="actions.geocodeOrigins.geocoding || actions.geocodeOrigins.fetching || actions.geocodeOrigins.ids.length == 0"
                        variant="primary"
                        @click="geocodeOrigins()">Geolocalizza</b-button>
                    <b-spinner v-if="actions.geocodeOrigins.geocoding" variant="primary" label="Spinning"></b-spinner>
                </template>
            </b-modal>

            <b-modal id="add-survey" :no-close-on-backdrop="true" :no-close-on-esc="true" :hide-header-close="true" @ok="addSurvey">
                <b-form-group label="Azienda">
                    <v-select size="sm" v-model="company_id" :options="companies" label="name" :reduce="(azienda_id) => azienda_id.id" required></v-select>
                </b-form-group>
                <b-form-group label="Template Questionario">
                    <b-form-select v-model="survey_template_id" :options="public_survey_templates" required></b-form-select>
                </b-form-group>
            </b-modal>
        </div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import vSelect from "vue-select";
var mime = require("mime-types");

export default {
	name: "QuestionariIndex",
	mixins: [Util],
	components: {
		vSelect,
	},
	data() {
		return {
			surveys: [],
			creatingTemplate: false,
			current_survey: null,
			stats: [],
			actions: {
				geocodeOrigins: {
					ids: [],
					fetching: false,
					geocoding: false,
					geocodedOkNum: 0,
					geocodedKoNum: 0,
				},
				importFromAnswers: {
					company_id: null,
					importing: false,
				},
			},
			//Gestione nuovo questionario - massimoi 26/2/21
			company_id: null,
			companies: [],
			survey_template_id: -1,
			public_survey_templates: [],
			busy: false,
			tableColumns: ["Azienda", "Avanzamento", {key:"opening_date", label:"Opening date", sortable: true,}, {key:"closing_date", label:"Closing date", sortable: true,},{key:"version_tag", sortable:true}, "azioni"],
			perPage: 8,
			currentPage: 1,
			pagination: {
				page: 1,
				count: 1,
			},
			sortBy: "modified",
			sortDesc: true,
			filter: {
				type: null,
				name: null,
			},
			statsIntervalId: null,
		};
	},
	methods: {
		isCurrentPage(page) {
			return this.pagination.page === page;
		},
		changePage(page) {
			if (page > this.pagination.pageCount) {
				page = this.pagination.pageCount;
			}
			this.pagination.page = page;
			this.fetchSurveys();
			this.$root.$emit("bv::refresh::table", "usersTable");
		},
		async createTemplate(survey_id) {
			try {
				this.createTemplate = true;
				const template_id = (await UserService.createTemplate(survey_id)).data.template_id;
				this.$router.push(`/questionari/edit/${template_id}`);
			} catch (error) {
				this.showError(error);
			} finally {
				this.createTemplate = false;
			}
		},
		async delSurvey(survey_id) {
			try {
				await UserService.deleteSurvey(survey_id);
			} catch (error) {
				this.showError(error);
			}
			let i = this.surveys.findIndex((survey) => survey.id === survey_id);
			//console.log(i);
			this.surveys.splice(i, 1);
			this.current_survey = null;
			this.$bvModal.hide("bv-modal-confirm-delete");
		},
		confirmDelete(survey_id) {
			this.current_survey = survey_id;
			this.$bvModal.show("bv-modal-confirm-delete");
		},
		getStats(survey_id) {
			UserService.getStats(survey_id)
				.then((response) => {
					let s = response.data.stats;
					let percent = (s.participants.survey_completed_num / s.participants.total_num * 100).toFixed(2);
					if (s.participants.total_num > 0){
						this.stats[survey_id] = `${s.participants.survey_completed_num}/${s.participants.total_num} (${percent}%)`;
					} else {
						this.stats[survey_id] = `${s.participants.survey_completed_num}/0 (0%)`;
					}
					//Necessario altrimenti non capisce al primo giro l'aggiornamento
					this.$forceUpdate();
				})
				.catch((error) => {
					this.showError(error);
					this.stats[survey_id] = null;
				});
		},
		openImportOriginsFromAnswersModal(company_id, survey_id) {
			this.actions.importFromAnswers.company_id = company_id;
			this.actions.importFromAnswers.survey_id = survey_id;
			//console.log("companyid", company_id);
			//console.log("surveyid", survey_id);
			this.$bvModal.show("import-origins-from-answers-modal");
		},
		async importOriginsFromAnswers() {
			this.actions.importFromAnswers.importing = true;
			try {
				var formData = new FormData();
				formData.append("company_id", this.actions.importFromAnswers.company_id);
				formData.append("survey_id", this.actions.importFromAnswers.survey_id);
				//Todo: creare un metodo specifico per non avere url schiantati nelle view
				await UserService.postFormData("origins/import-from-answers.json", formData);
				this.$bvToast.toast("Importazione avvenuta correttamente", {
					title: "Successo",
					autoHideDelay: 2000,
					appendToast: true,
				});
				this.$bvModal.hide("import-origins-from-answers-modal");

				//Ora geocodifico quello che ho importo
				this.actions.geocodeOrigins.ids = [];
				this.actions.geocodeOrigins.geocodedOkNum = 0;
				this.actions.geocodeOrigins.geocodedKoNum = 0;
				this.actions.geocodeOrigins.fetching = true;
				this.$bvModal.show("geocode-origins-modal");
				try {
					this.actions.geocodeOrigins.ids = (await UserService.getAllOriginsNotGeocoded(this.actions.importFromAnswers.company_id)).data.ids;
				} catch (error) {
					this.showError(error);
				} finally {
					this.actions.geocodeOrigins.fetching = false;
				}
				await this.geocodeOrigins();
				this.$bvModal.hide("geocode-origins-modal");
			} catch (e) {
				this.showError(e);
			} finally {
				this.actions.importFromAnswers.importing = false;
			}
		},
		async geocodeOrigins() {
			this.actions.geocodeOrigins.geocoding = true;
			let batchSize = 10; // vai in parallelo per aumentare la velocità
			for (let i = 0; i < this.actions.geocodeOrigins.ids.length; i += batchSize) {
				try {
					let batch = this.actions.geocodeOrigins.ids.slice(i, i + batchSize);
					let res = (await Promise.all(batch.map((originId) => UserService.geocodeOrigin(originId)))).map((singleRes) =>
						singleRes.data ? singleRes.data.success : false
					);
					this.actions.geocodeOrigins.geocodedOkNum += res.filter((r) => r == true).length;
					this.actions.geocodeOrigins.geocodedKoNum += res.filter((r) => r != true).length;
				} catch (error) {
					this.showError(error);
					break;
				}
			}
			this.actions.geocodeOrigins.geocoding = false;
			this.$bvModal.hide("geocode-origins-modal");
		},

		async showSurveyModal() {
			this.loading = true;
			this.public_survey_templates = [
				{
					value: -1,
					text: "Crea questionario vuoto",
				},
				...(await UserService.surveyTemplatesList()).data.templates.map((template) => ({
					value: template.id,
					text: template.name,
				})),
			];
			let res = await UserService.getCompanyList();
			this.companies = res.data.companies;
			this.$bvModal.show("add-survey");
			this.loading = false;
		},

		async addSurvey() {
			try {
				if (this.company_id > 0) {
					let res = await UserService.addSurvey(this.company_id, this.survey_template_id);
					if (res.data.survey_id != undefined) {
						let survey_id = res.data.survey_id;
						this.$bvModal.hide("add-survey");
						this.$router.push(`/questionari/edit/${survey_id}`);
					}
				}
			} catch (error) {
				this.showError(error);
			}
		},
		async exportSurveyData(survey_id, survey_name,allAnswers) {
			try {
				this.busy = true;
				let all = true;
				this.$bvToast.toast("Esportazione in corso", {
                    title: "Esportazione",
                    variant: "info",
                    autoHideDelay: 2000,
                    appendToast: true,
                });
				let res = await UserService.exportSurveyData(survey_id,all,allAnswers);
				console.log("res from survey export",res);
				this.$bvToast.toast(res.data.message, {
						title: "No Uploads",
						variant: "warning",
						autoHideDelay: 2000,
						appendToast: true,
					});
				this.statsIntervalId = setInterval(async () => {
					try {
						this.getStatusExport(survey_id, survey_name);
					} catch (e) {                
						console.log(e);
					}
				}, 10000);
				
			} catch (error) {
				//console.log(error);
			} finally {
				this.busy = false;
			}
		},
		async exportMapQuestion(survey_id, survey_name) {
			try {
				this.busy = true;
				this.$bvToast.toast("Esportazione in corso", {
                    title: "Esportazione",
                    variant: "info",
                    autoHideDelay: 2000,
                    appendToast: true,
                });
				const res = await UserService.exportMapQuestion(survey_id);
				let ext = mime.extension(res.data.type);
				//console.log(res);
				if (ext === "json") {
					this.$bvToast.toast("Error in questionnaire export", {
						title: "No Uploads",
						variant: "warning",
						autoHideDelay: 2000,
						appendToast: true,
					});
					this.busy = false;
					return;
				}
				const url = window.URL.createObjectURL(new Blob([res.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", `${survey_name}.${ext}`);
				document.body.appendChild(link);
				link.click();
			} catch (error) {
				//console.log(error);
			} finally {
				this.busy = false;
			}
		},
		async fetchSurveys(){
			let queryString = "";
			if (this.sortBy) {
				queryString = queryString + "&sortBy=" + this.sortBy;
			}
			if (this.sortDesc !== null) {
				let s = "asc";
				if (this.sortDesc) {
					s = "desc";
				}
				queryString += "&direction=" + s;
			}
			// this.pagination.page = pageNumber;
			if (this.pagination.page) {
				queryString = queryString + "&page=" + this.pagination.page;
			}
			// if (this.filter.name) {
				//Salvo il nome del quesitonario in un cookie
			this.$cookies.set("questionari.name", this.filter.name, "1h");
			queryString = queryString + "&q=" + this.filter.name;
			// }
			this.getYear();
			queryString = queryString + "&year=" + this.year;

			

			UserService.getSurveys(queryString)
				.then((response) => {
					this.surveys = response.data.surveys;
					this.pagination = response.data.pagination.Surveys;
					this.surveys.forEach((survey) => {
						console.log("survey", survey);
						if(survey.version_tag !== 'template')
							{
								this.getStats(survey.id);
							}
						
					});
				})
				.catch((error) => this.showError(error));
		},
		async getStatusExport(survey_id, survey_name) {
            try {
                let res = await UserService.getStatusExport(survey_id);
                if (res.data == null){
                    this.lock = [false, false, false, false, false];
                    this.message = "Scegli un'operazione";
                    return;
                }
				console.log("res from getStatusExport",res);
                let ext = mime.extension(res.data.type);
				console.log("ext",ext);
				if(ext === "json")
				{
					let message = res.data.message;
					let lock = res.data.lock;
					this.$bvToast.toast("In lavorazione", {
							title: "No Uploads",
							variant: "warning",
							autoHideDelay: 2000,
							appendToast: true,
						});
						this.busy = false;
						return;
					
				}else{		
					
					// alert of the download
					this.$bvToast.toast("Esportazione completata", {
						title: "Esportazione",
						variant: "success",
						autoHideDelay: 2000,
						appendToast: true,
					});
					const url = window.URL.createObjectURL(new Blob([res.data]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", `${survey_name}.${ext}`);
					document.body.appendChild(link);
					link.click();
					if (this.statsIntervalId) {
						clearInterval(this.statsIntervalId);
					}
				}

            } catch (error) {
				this.$bvToast.toast(error.message, {
						title: "No Uploads",
						variant: "warning",
						autoHideDelay: 2000,
						appendToast: true,
					});
            }
        },
		
	},
	mounted() {
		//Se c'è leggo il cookie
		if (this.$cookies.get("questionari.name") != null){
			this.filter.name = this.$cookies.get("questionari.name");
		}else{
			this.filter.name = "";
		}
		this.fetchSurveys();
	},
	computed: {
		pages: function () {
			let pages = [];
			let from = this.pagination.page - Math.floor(this.pagination.perPage / 2);

			if (from < 1) {
				from = 1;
			}
			let to = from + this.pagination.perPage - 1;
			if (to > this.pagination.pageCount) {
				to = this.pagination.pageCount;
			}

			while (from <= to) {
				pages.push(from);
				from++;
			}

			return pages;
		},
	},
};
</script>

<style></style>
