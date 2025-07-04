<template>
	<div>
		<b-row v-if="this.loggedUserIsAdmin || this.loggedUserIsMomaArea">
			<b-col class="flex-grow-1">
				<b-form-input v-model="filter.name" placeholder="cerca per nome azienda" type="search"
					v-on:keyup.enter="updateFilter()"></b-form-input>
			</b-col>
			<b-col class="flex-grow-1">
				<b-form-select v-model="filter.type" :options="company_types" value-field="id"
					text-field="name"></b-form-select>
			</b-col>
		</b-row>
		<b-row class="mt-1" v-if="this.loggedUserIsAdmin || this.loggedUserIsMomaArea">
			<b-col class="col-12">
				<b-button @click="updateFilter()" variant="default" class="float-right ml-2"><i class="fa fa-search"
						aria-hidden="true"></i>
					filtra
				</b-button>
				&nbsp;
				<b-button variant="success" class="float-right ml-2" @click="$router.push(`/aziende/edit`)">
					<i class="fa fa-plus" aria-hidden="true"></i>
					Nuova azienda
				</b-button>
			</b-col>
			<hr />
		</b-row>


		<b-table striped hover :items="companies" :busy="isBusy" :fields="fields" class="mt-2">
			<template #table-busy>
				<div class="text-center text-danger my-2">
					<b-spinner class="align-middle"></b-spinner>
					<strong>Loading...</strong>
				</div>
			</template>
			<template v-slot:cell(azioni)="data">
				<div class="btn-group" size="sm">
					<b-button
						@click="$router.push(data.value.edit)"
						variant="primary"
						title="Modifica Azienda">Sedi e Accessibilità</b-button>
					<b-dropdown right text="Azioni" v-if="isAuthorized('admin') ">
						<b-dropdown-item
						@click="openImportEmployeesModal(data.value.companyId)" v-if="!doNotImportEmployees">Importa Lavoratori da Excel</b-dropdown-item>
						<b-dropdown-item
						@click="openGeocodeOriginsModal(data.value.companyId)"  v-if="!doNotImportEmployees">Geolocalizza origini</b-dropdown-item>
						<b-dropdown-item :to="`/users?company_id=${data.value.companyId}`"  v-if="!doNotImportEmployees">Mostra Elenco Lavoratori</b-dropdown-item>
						<b-dropdown-item :to="`/employees/stats/${data.value.companyId}`"  v-if="!doNotImportEmployees">Statistiche Lavoratori</b-dropdown-item>
						<b-dropdown-item
						v-if="loggedUserIsAdmin"
						@click="showDeleteCompany(data.value.companyId)"><i class="fa fa-trash"></i> Elimina Azienda</b-dropdown-item>
					</b-dropdown>
				</div>
			</template>
		</b-table>
		<b-modal id="import-employees-modal" :no-close-on-backdrop="true" :no-close-on-esc="true"
			:hide-header-close="false" scrollable>

			<template #modal-title>Importa Lavoratori da Excel
			</template>

        <b-button
          v-if="actions.importEmployees.completed"
          variant="warning"
          @click="geolocateFromImportEmployeesModal()">Geolocalizza Lavoratori</b-button>
		


			<h5> Per l'importazione è <b>fondamentale</b> seguire esattamente il
				formato del file di esempio.
			</h5>
			<b-link :href="`${this.apiPath}${this.siteDir}modello-importazione-dipendenti-hr.xltx`">
				<b-icon icon="file-earmark-excel"> </b-icon>
				File di esempio.xlsx
			</b-link>



			<template #modal-footer>

				<b-button @click="nextImportEmployees()">Seguente</b-button>
			</template>
		</b-modal>
		<b-modal id="update-employees-modal" :no-close-on-backdrop="true" :no-close-on-esc="true"
			:hide-header-close="false" scrollable>

			<template #modal-title>
				<b-button size="sm" @click="backExample()">&#60;
				</b-button>
				Importa Lavoratori da Excel
			</template>



			<b-form>

				<input type="hidden" v-model="actions.importEmployees.companyId" />
				<b-form-file :accept="actions.importEmployees.supportedFileTypes"
					drop-placeholder="Trascina il file qui..." browse-text="Carica" id="file-large" size="lg"
					v-model="actions.importEmployees.file">
					<template slot="placeholder"> Carica il file con tutti i dati</template>
				</b-form-file>
			</b-form>



			<template #modal-footer>
				<b-button @click="nextDropEmployees()">Seguente</b-button>


			</template>
		</b-modal>
		<b-modal id="drop-employees-modal" :no-close-on-backdrop="true" :no-close-on-esc="true"
			:hide-header-close="false" scrollable>
			<template #modal-title>
				<b-button size="sm" @click="backImport()">&#60;
				</b-button>
				Importa Lavoratori da Excel
			</template>

			<b-alert show variant="info" v-if="!actions.importEmployees.completed">
				<b-check v-model="deleteExisting">Elimina tutti gli elenchi di Lavoratori importati in precedenza per
					questa azienda</b-check>
			</b-alert>
			<h3 v-if="deleteExisting">Scegli l'anno per l'eliminazione degli utenti.</h3>
			<b-form-group v-if="deleteExisting">
				<v-select v-model="yearDelete" :options="yearOptions.slice(0, -1)" label="user year" />
			</b-form-group>

			<h3>Scegli l'anno per l'importazione degli utenti.</h3>

			<b-form-group>
				<v-select v-model="yearImport" :options="yearOptions.slice(0, -1)" label="user year" />
			</b-form-group>

			<b-progress :max="actions.importEmployees.progress.max" class="mb-3">
				<b-progress-bar variant="success" :value="actions.importEmployees.progress.success"
					show-value></b-progress-bar>
				<b-progress-bar variant="danger" :value="actions.importEmployees.progress.error"
					show-value></b-progress-bar>
			</b-progress>
			<table style="margin-top: 10px">
				<tr v-for="(row, index) in actions.importEmployees.log" :key="index">
					<td>
						<b>Riga {{ row.row }}&nbsp;&nbsp;&nbsp;</b>
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

			<template #modal-footer>
				<b-button
					:disabled="
						!actions.importEmployees.importing
					"
					v-if="actions.importEmployees.importing"
					variant="danger"
					@click="stopImport()">Stop</b-button>
				<b-button :disabled="!actions.importEmployees.file || actions.importEmployees.importing
					" v-if="!actions.importEmployees.completed" variant="primary" @click="deleteEmployees()">Importa</b-button>

				<b-button v-if="actions.importEmployees.completed" variant="warning"
					@click="geolocateFromImportEmployeesModal()">Geolocalizza Lavoratori</b-button>

				<b-spinner v-if="actions.importEmployees.importing" variant="primary" label="Spinning"></b-spinner>
			</template>
		</b-modal>
		<b-modal id="secure-removeall-modal" :no-close-on-backdrop="true" :no-close-on-esc="true"
			:hide-header-close="false">
			<template #modal-title> Avvertimento </template>
			<div class="text-center">
				<b-alert show variant="warning" style="font-size: 90%">
					<h5> Sei sicuro di voler rimuovere tutti gli elenchi d'Lavoratori importati in precedenza per questa
						azienda?
					</h5>
				</b-alert>
			</div>
			<template #modal-footer>
				<b-button @click="importEmployees()" variant="danger">Si</b-button>
				<b-button @click="stopImport()">No</b-button>

			</template>
		</b-modal>
		<b-modal id="geocode-origins-modal" :no-close-on-backdrop="true" :no-close-on-esc="true"
			:hide-header-close="true">
			<template #modal-title> Geolocalizza origini </template>
			<b-button variant="danger" size="sm" @click="resetGeocoding()" class="mb-3"> Reset - Annulla tutte le
				coordinate
				presenti</b-button>
			<div v-if="actions.geocodeOrigins.fetching" class="text-center">
				<b-spinner variant="primary" label="Spinning"></b-spinner>
			</div>

			<div v-if="actions.geocodeOrigins.ids.length">
				<b>{{ actions.geocodeOrigins.ids.length }}</b> origini da geolocalizzare<br>

				<b-progress class="mt-2" :max="actions.geocodeOrigins.ids.length" show-value>
					<b-progress-bar :value="actions.geocodeOrigins.geocodedOkNum" variant="success"></b-progress-bar>
					<b-progress-bar :value="actions.geocodeOrigins.geocodedKoNum" variant="danger"></b-progress-bar>
				</b-progress>
			</div>
			<template #modal-footer>

				<b-button @click="stopImport()">Chiudi</b-button>
				<b-button :disabled="actions.geocodeOrigins.geocoding ||
					actions.geocodeOrigins.fetching ||
					actions.geocodeOrigins.ids.length == 0
					" variant="success" @click="geocodeOrigins()">Geolocalizza</b-button>
				<b-spinner v-if="actions.geocodeOrigins.geocoding" variant="primary" label="Spinning"></b-spinner>
			</template>
		</b-modal>

		<b-modal id="delete-company" title="Cancellazione Azienda">
			<p class="my-4 text-danger">Attenzione!</p>
			<p>La cancellazione dell'azienda è un'azione irreversibile!</p>
			<p>Verranno anche cancellati tutti gli <b>utenti, questionari, risposte ai questionari, PSCL</b></p>
			<p>Per confermare inserisci nella casella qui sotto la mail con cui accedi al sistema.</p>
			<b-form-input id="mailDeleteCompany" v-model="eMailVerificaDelete" placeholder="inserisci la tua mail" />
			<template #modal-footer="{ cancel }">
				<b-button size="sm" @click="cancel()">
					Annulla
				</b-button>
				<b-button size="sm" variant="danger" @click="deleteCompany()" :disabled="!verificaDelete">
					Elimina Azienda
				</b-button>
			</template>
		</b-modal>

	</div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import XlsService from "@/services/xls.service";
import vSelect from "vue-select";

export default {
	name: "CompaniesIndex",
	mixins: [Util],
	components: {
		vSelect,
	},
	data() {
		return {
			deleteExisting: false,
			forceStop: false,
			eMailVerificaDelete: "",
			companyToBeDeleted: null,
			isBusy: true,
			companies: [],
			company_types: [],
			companyId: null,
			stopImportFlag: false,
			doNotImportEmployees: process.env.VUE_APP_DO_NOT_IMPORT_EMPLOYEES,
			actions: {
				importEmployees: {
					supportedFileTypes: ".xls, .xlsx",
					companyId: null,
					file: null,
					importing: false,
					log: [],
					progress: {
						max: 0,
						success: 0,
						error: 0,
					},
					completed: false,
				},
				geocodeOrigins: {
					ids: [],
					fetching: false,
					geocoding: false,
					geocodedOkNum: 0,
					geocodedKoNum: 0,
				},
				importFromAnswers: {
					companyId: null,
					importing: false,
				},
			},
			filter: {
				type: null,
				name: null,
			},
			fields: [
				{
					key: "nome",
					label: "Nome",
					sortable: true,
				},
				{
					key: "num_employees",
					label: "Numero Lavoratori / Studenti",
					sortable: true,
				},
				{
					key: "sum_employees_offices",
					label: "Somma Sedi",
					sortable: true,
				},
				{
					key: "tipo",
					sortable: true,
				},
				{
					key: "azioni",
				},
			],
			yearDelete: null,
			yearImport: null,
		};
	},
	async created() {
		try {
			this.getYear();
			if (this.year == "TUTTI") {
				this.yearImport = new Date().getFullYear();
				this.yearDelete = this.yearImport;
			}else {
				this.yearImport = this.year;
				this.yearDelete = this.year;
			}
			
			this.filter.name = localStorage.getItem("filter_company_name");
			this.filter.type = localStorage.getItem("filter_company_type");
			if (this.filter.name == "null") {
				this.filter.name = null;
			}
			if (this.filter.type == "null") {
				this.filter.type = null;
			}
			await this.fetchCompanies();
			this.isBusy = true;
			let res = await UserService.getCompanyTypes();
			this.company_types = res.data.company_types;
			this.isBusy = false;
		} catch (e) {
			//console.log(e);
			this.$bvToast.toast(e.message, {
				title: "Errore",
				autoHideDelay: 2000,
				appendToast: true,
				variant: "danger",
			});
			this.isBusy = false;
		}
	},
	methods: {
		stopImport() {
			this.stopImportFlag = true;
			this.$bvModal.hide("secure-removeall-modal");
			this.$bvModal.hide("geocode-origins-modal");
		},
		async resetGeocoding() {
			//show a modal to confirm before proceeding
			let res = await this.$bvModal.msgBoxConfirm('Sei sicuro di voler resettare tutte le coordinate di geolocalizzazione? Operazione irreversibile!');
			if (!res) {
				return;
			}

			if (this.companyId !== null) {
				this.isBusy = true;
				await UserService.resetGeocoding(this.companyId);
				this.isBusy = false;
				await this.openGeocodeOriginsModal(this.companyId);
			}
		},
		backImport() {
			this.$bvModal.hide("drop-employees-modal");
			this.$bvModal.show("update-employees-modal");
			this.forceStop = true
			this.stopImportFlag = true;
			this.deleteExisting = false;
			this.actions.importEmployees.completed = false;
			this.actions.importEmployees.file = null; // important, reset
			this.actions.importEmployees.importing = false;
			this.actions.importEmployees.log = [];
			this.actions.importEmployees.progress = {
				max: 0,
				success: 0,
				error: 0,
			};


		},
		backExample() {
			this.$bvModal.show("import-employees-modal");
			this.$bvModal.hide("update-employees-modal");
		},
		deleteEmployees() {
			if (this.deleteExisting) {
				this.$bvModal.show("secure-removeall-modal");
			} else {
				this.importEmployees();
			}
		},
		async updateFilter() {
			this.fetchCompanies();
			localStorage.setItem("filter_company_name", this.filter.name);
			localStorage.setItem("filter_company_type", this.filter.type);
		},
		async fetchCompanies() {
			this.isBusy = true;
			this.getYear();
			let res = await UserService.getCompanyList(
				this.filter.type,
				this.filter.name,
				this.year
			);

			this.companies = res.data.companies.map((company) => ({
				id: company.id,
				nome: company.name,
				num_employees: company.num_employees,
				sum_employees_offices: company.offices_num,
				tipo: company.company_type.name,
				azioni: {
					companyId: company.id,
					edit: `/aziende/edit/${company.id}`,
				},
			}));
			this.isBusy = false;
		},
		geolocateFromImportEmployeesModal() {
			this.$bvModal.hide("import-employees-modal");
			this.$bvModal.hide("drop-employees-modal");
			// aspetta un po' per permettere alle animazioni dei modali di non sovrapporsi
			setTimeout(() => {
				this.openGeocodeOriginsModal(this.actions.importEmployees.companyId);
			}, 300);
		},
		openImportEmployeesModal(companyId) {
			this.actions.importEmployees.file = null; // important, reset
			this.actions.importEmployees.companyId = companyId;
			this.actions.importEmployees.log = [];
			this.actions.importEmployees.importing = false;
			this.actions.importEmployees.progress = {
				max: 0,
				success: 0,
				error: 0,
			};
			this.actions.importEmployees.completed = false;
			this.$bvModal.show("import-employees-modal");
		},
		nextImportEmployees() {
			this.$bvModal.hide("import-employees-modal");
			this.$bvModal.show("update-employees-modal");

		},
		nextDropEmployees() {
			this.$bvModal.hide("update-employees-modal");
			this.$bvModal.show("drop-employees-modal");

		},
		async importEmployees() {
			this.forceStop = false;
			this.stopImportFlag = false;
			this.actions.importEmployees.log = [];
			this.actions.importEmployees.importing = true;
			this.actions.importEmployees.completed = false;
			try {
				const content = await XlsService.read(
					this.actions.importEmployees.file
				);
				const sheets = Object.keys(content);
				let sheetContent = content[sheets[0]]; // per convenzione elaboro solo il primo sheet che trovo
				// delete empty rows from sheetContent
				sheetContent = sheetContent.filter(e => e.length);
				this.actions.importEmployees.progress.max = sheetContent.length - 1;
				if (this.deleteExisting) {
					this.$bvModal.hide("secure-removeall-modal");
					let count = 1000;
					while (count > 0 && !this.stopImportFlag) {
						let res = await UserService.deleteAllEmployees(
							this.actions.importEmployees.companyId,
							this.yearDelete,
						);
						if (res.data.errorMsg != false) {
							throw new Error(res.data.errorMsg);
						}
						count = res.data.count;
						await new Promise(resolve => setTimeout(resolve, 100)); // wait 200ms between delete batches
					}


				}

				const batchSize = 100;
				for (
					let i = 1;
					i <= sheetContent.length - 1 && !this.stopImportFlag;
					i += batchSize
				) {
					let batch = sheetContent.slice(i, i + batchSize);
					(
						await Promise.all(
							batch.map((row) =>
								UserService.importEmployee(
									row,
									this.actions.importEmployees.companyId,
									this.yearImport
								)
							)
						)
					).forEach((res, index) => {
						if (res.data.errorMsg) {
							this.actions.importEmployees.log.unshift({
								row: i + index + 1,
								success: res.data.errorMsg == false,
								message:
									res.data.errorMsg == false
										? "importazione ok"
										: res.data.errorMsg,
							});
						}

						if (res.data.errorMsg == false) {
							this.actions.importEmployees.progress.success++;
						} else {
							this.actions.importEmployees.progress.error++;
						}
					});
					if (i + batchSize <= sheetContent.length-1) {
						await new Promise(resolve => setTimeout(resolve, 200)); // 1 second between batches
					}
				}
			} catch (e) {
				//console.log(e);
				this.$bvToast.toast(String(e), {
					title: "Errore",
					variant: "danger",
					autoHideDelay: 2000,
					appendToast: true,
				});
				this.$bvModal.hide("drop-employees-modal");
			} finally {
				if (!this.forceStop) {
					this.actions.importEmployees.importing = false;
					this.actions.importEmployees.completed = true;
				}

			}
			if (!this.forceStop) {
				this.stopImportFlag = false;
			}
		},
		async openGeocodeOriginsModal(companyId) {
			this.actions.geocodeOrigins.ids = [];
			this.actions.geocodeOrigins.geocodedOkNum = 0;
			this.actions.geocodeOrigins.geocodedKoNum = 0;
			this.actions.geocodeOrigins.fetching = true;
			this.companyId = companyId;
			this.$bvModal.show("geocode-origins-modal");
			try {
				this.actions.geocodeOrigins.ids = (
					await UserService.getAllOriginsNotGeocoded(companyId)
				).data.ids;
			} catch (e) {
				this.$bvToast.toast(e.message, {
					title: "Errore",
					autoHideDelay: 4000,
					appendToast: true,
				});
			} finally {
				this.actions.geocodeOrigins.fetching = false;
			}
		},
		async geocodeOrigins() {
			this.stopImportFlag = false;
			this.actions.geocodeOrigins.geocoding = true;
			let batchSize = 50; // vai in parallelo per aumentare la velocità
			for (
				let i = 0;
				i < this.actions.geocodeOrigins.ids.length && !this.stopImportFlag;
				i += batchSize
			) {
				try {
					let batch = this.actions.geocodeOrigins.ids.slice(i, i + batchSize);
					let res = (
						await Promise.all(
							batch.map((originId) => UserService.geocodeOrigin(originId))
						)
					).map((singleRes) =>
						singleRes.data ? singleRes.data.success : false
					);
					this.actions.geocodeOrigins.geocodedOkNum += res.filter(
						(r) => r == true
					).length;
					this.actions.geocodeOrigins.geocodedKoNum += res.filter(
						(r) => r != true
					).length;
					// waitinf 200ms between batches
					if (i + batchSize < this.actions.geocodeOrigins.ids.length) {
						await new Promise(resolve => setTimeout(resolve, 200));
					}
				} catch (e) {
					this.$bvToast.toast(e.message, {
						title: "Errore",
						autoHideDelay: 4000,
						appendToast: true,
					});
					break;
				}
			}
			this.actions.geocodeOrigins.geocoding = false;
			this.$bvModal.hide("geocode-origins-modal");
			this.stopImportFlag = false;
		},
		showDeleteCompany(id) {
			this.$bvModal.show("delete-company");
			this.companyToBeDeleted = id;
		},
		async deleteCompany() {
			try {
				await UserService.deleteCompany(this.companyToBeDeleted);
			}
			catch (e) {
				this.$bvToast.toast(e.message, {
					title: "Errore",
					autoHideDelay: 4000,
					appendToast: true,
				});
			}
			finally {
				this.companyToBeDeleted = null;
				this.eMailVerificaDelete = null;
				this.$bvModal.hide("delete-company");
				this.fetchCompanies();
			}
		}
	},
	computed: {
		verificaDelete() {
			let u = this.getUser;
			return this.eMailVerificaDelete == u.email;
		}
	}
};
</script>
