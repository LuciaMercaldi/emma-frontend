<template>
  <div>
    <b-form @onsubmit.prevent>
      <b-form-row>
        <b-col class="flex-grow-1">
          <b-form-group label="Nome, cognome, e-mail">
            <b-form-input
				id="nomeUser"
              	v-model="filter.search"
			  	type="search"
             	 placeholder="Scrivi alcune lettere"></b-form-input>
          </b-form-group>
        </b-col>

        <b-col class="flex-grow-1" v-if="isAuthorized('admin, moma, moma_area')">
          <b-form-group label="Azienda, Ente, Scuola">
			<v-select 
				id="aziendaUser"
				v-model="filter.company_id"
				:options="companies" 
				label="name" 
				:reduce="x => x.id"
				 @input="updateCompany($event)"
				placeholder="Scrivi alcune lettere">
			</v-select>
          </b-form-group>
        </b-col>

        <b-col class="flex-grow-1" v-if="filter.company_id">
          <b-form-group label="Sede">
            <b-form-select
				id="sedeUser"
				v-model="filter.office_id"
				:options="offices"
				value-field="id"
				text-field="name"></b-form-select>
          </b-form-group>
        </b-col>
      </b-form-row>

      <b-form-row>
        <b-col md="2">
          <b-form-group label="Ruolo">
            <b-form-select
				id="ruoloUser"
				v-model="filter.role"
				:options="roles"
				value-field="id"
				text-field="name"></b-form-select>
          </b-form-group>
        </b-col>

        <b-col class="flex-grow-1">
          <b-form-group label="Questionario">
            <b-form-select
				id="questionarioUser"
				v-model="filter.survey_id"
				:options="surveys"
				value-field="id"
				text-field="name"></b-form-select>
          </b-form-group>
        </b-col>

	    <b-col md="2">
	          <b-form-group label="Geocodifica">
	            <b-form-select
					id="geocodificaUser"
					v-model="filter.geocoded"
					:options="geocodedOptions"
					value-field="id"
					text-field="name"></b-form-select>
	          </b-form-group>
	    </b-col>
		</b-form-row>

		<b-form-row>
			<b-col>
				<b-button @click.prevent="fetchUsers()" class="float-right ml-2">Filtra</b-button>
				<b-button
					v-if="isAuthorized('admin')"
					to="/users/add"
					class="btn btn-md btn-success float-right"
					title="Aggiungi Utente">
					<i class="fa fa-plus" aria-hidden="true"></i>
					Aggiungi Utente
				</b-button>
			</b-col>
      	</b-form-row>
    </b-form>

    <hr />

    <b-row>
      <b-col>
        <h4>Numero di risultati: {{ pagination.count }}</h4>
        <b-table
          striped
          hover
          :items="tableUsers"
          :fields="tableColumns"
          id="usersTable"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :busy="loading"
          :current-page="pagination.page">
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>

          <template v-slot:cell(stato)="data">
            <div>
              <b :class="data.value.class">{{ data.value.label }}</b>
            </div>
            <small v-if="!filter.survey_id">
              {{ data.value.survey }}
            </small>
          </template>
          <template #cell(azioni)="data">
            <b-icon
              @click="showEditModal(data.item.id, data.index, data.item)"
              icon="pencil"
			  title="Modifica utente">
            </b-icon>&nbsp;
            <b-link
              :to="`users/change-password/${data.item.id}`"
              title="Cambia Password"><b-icon icon="key"></b-icon></b-link>&nbsp;
	              
	        <b-icon icon="envelope-open"       title="Invia Password Reset" @click="resetPassword(data.item.email)"></b-icon>&nbsp;
		
            <b-icon
              icon="trash"
			  title="Cancella utente"
              @click="deleteUser(data.index, data.item.id)"></b-icon>&nbsp;
            <b-link
              v-if="data.item.participant.survey_completed_at == null"
              target="_blank"
              :to="getSurveyFill(data.item.participant)"><b-icon
                icon="caret-right-fill"
                title="link per compilazione questionario"></b-icon></b-link>&nbsp;
            
			<b-link
              v-if="data.item.participant.survey_completed_at != null && data.item.sending_mode == 'n'"
              target="risposta"
              :to="getSurveyAnswers(data.item.participant)"
			  title="Risposte al Questionario"><b-icon icon="calendar2-check"></b-icon></b-link>&nbsp;
            
			<b-link :to="`/users/edit/${data.item.id}`">
              <b-icon
                icon="globe"
                target="Modifica Origine"
                :class="hasLat(data.item) ? 'text-secondary' : 'text-danger'"
				title="Modifica Geocodifica">
              </b-icon>
            </b-link>
          </template>
        </b-table>

        <div v-if="tableUsers.length == 0" class="text-center">
          Nessun utente trovato
        </div>

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
            @change="changePage($event)"
			@input="isCurrentPage($event)"></b-pagination>
        </div>
      </b-col>
    </b-row>

    <b-modal @ok="handleOk()" @cancel="handleCancel()" id="edit_modal" title="🙎 Modifica Utente">
      <table class="table table-striped">
        <tr>
          <td>Cognome</td>
          <td>
            <b-input v-model="modalUser.cognome" size="sm" type="text" />
          </td>
        </tr>
        <tr>
          <td>Nome</td>
          <td>
            <b-input v-model="modalUser.nome" size="sm" type="text" />
          </td>
        </tr>
        <tr>
          <td>E-mail</td>
          <td>
            <b-input v-model="modalUser.email" size="sm" type="email" />
          </td>
        </tr>
		<tr>
          <td>Ruolo</td>
          <td>
            <b-select v-if="isAuthorized('admin')" v-model="modalUser.ruolo" :options="userRoles" size="md" type="text"/>
			<span v-else>{{modalUser.ruolo}}</span>
          </td>
        </tr>
        <tr v-if="user_origin_status === 1">
          <td colspan="2">
			<b-link
			:to="`/users/edit/${modalUser.id}`"
			title="Geocodifica Utente">Modifica Posizione su Mappa 🌏
			</b-link>
          </td>
        </tr>
        <tr>
          <td>Azienda</td>
          <td>
			<v-select v-if="isAuthorized('admin')" 
				size="sm" 
				v-model="modalUser.company_id" 
				:options="companies" 
				label="name" 
				:reduce="company => company.id"
				@input="updateCompanyModal($event)"
				placeholder="Scrivi alcune lettere">
			</v-select>
	 		<span v-else>{{modalUser.azienda}}</span>
          </td>
        </tr>        
		<tr>
          <td>Sede</td>
          <td>
			<v-select v-if="isAuthorized('admin')" 
				size="sm" 
				 v-model="modalUser.office_id"
				:options="modalOffices" 
				label="name" 
				:reduce="office => office.id"				
				placeholder="Scrivi alcune lettere">
			</v-select>
			<span v-else>{{modalUser.office_id}}</span>
          </td>
        </tr>
		<tr v-if="['moma', 'superiori'].includes(modalUser.ruolo)">
          <td>Subcompany <i class="ti-help-alt" v-b-popover.hover="{content: 'Azienda o sezione all\'interno di una sede dell\'azienda principale'}"></i></td>
          <td>
            <b-input  v-if="isAuthorized('admin')" v-model="modalUser.subcompany" size="sm" type="text" name="subcompany" />
			<span v-else>{{modalUser.subcompany}}</span>
          </td>
        </tr>
        
		<tr>
			<td>Anni utente</td>
			<td>
				<b-form-group><!--WIP mettere saveUserYears nel tasto salva o aggiungere ad un metodo apposta-->
					<v-select v-model="modalUser.years" :options="yearOptions" label="user year" size="sm" multiple/>
				</b-form-group>
			</td>
		</tr>
      </table>
    </b-modal>
  </div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import vSelect from "vue-select";
import _ from "lodash";

export default {
	name: "user-list",
	mixins: [Util],
	components: {
		vSelect,
	},
	data() {
		return {
			filter: {
				search: null,
				company_id: null,
				office_id: null,
				survey_id: null,
				role: null,
				geocoded: null,
			},
			searchFilterTimeoutId: null,
			users: [],
			companies: [],
			offices: [],
			modalOffices: [],
			roles: [],
			surveys: [],
			loading: true,
			tableUsers: [],
			tableColumns: [
				"cognome",
				"nome",
				"email",
				"azienda",
				"ruolo",
				"stato",
				"created",
				"azioni",
			],
			modalUser: {},
			row_index: null,
			perPage: 8,
			currentPage: 4,
			pagination: {
				page: 4,
				// count: 4,
			},
			sortBy: "modified",
			sortDesc: true,
			user_origin_status: 0,
			geocodedOptions: [
				{
					id: null,
					name: "Tutti",
				},
				{
					id: "y",
					name: "Geocodificati",
				},
				{
					id: "n",
					name: "Non Geocodificati",
				}
			],
			// year: new Date().getFullYear(),
		};
	},
	// async created() {
	// 	try {
	// 		this.pagination.page = Number(localStorage.getItem("page"));
	// 		if (this.pagination.page == "null") {
	// 			this.pagination.page = 8;
	// 		}
			
			
	// 	} catch (e) {
	// 		//console.log(e);
	// 		this.$bvToast.toast(e.message, {
	// 			title: "Errore",
	// 			autoHideDelay: 2000,
	// 			appendToast: true,
	// 			variant: "danger",
	// 		});
			
	// 	}
	// },
	methods: {
		hasLat(item) {
			if (item === undefined) {
				return false;
			}

			if (item.origin !== undefined) {
				if (item.origin.lat !== undefined) {
					if (item.origin.lat) {
						return true;
					}
				}
			}

			return false;
		},
		isCurrentPage(page) {
			this.pagination.page = page;
			this.fetchUsers();
			this.$root.$emit("bv::refresh::table", "usersTable");
		},
		changePage(page) {
			if (page > this.pagination.pageCount) {
				page = this.pagination.pageCount;
			}
			this.pagination.page = page;
			localStorage.setItem("page", this.pagination.page);
			this.fetchUsers();
			this.$root.$emit("bv::refresh::table", "usersTable");
		},
		async showEditModal(user_id, row_index, user_info) {
			this.modalUser = user_info;
			this.row_index = row_index;
			let user_origin = null;
			try {
				user_origin = await UserService.getOrigin(user_id);
				this.modalOffices = await this.createOfficeList(user_info.company_id);
			} catch (error) {
				this.showError(error);
			}
			if (user_origin.data.origin[0]) {
				this.user_origin_status = 1;
			}
			this.modalUser["id"] = user_id;
			this.$bvModal.show("edit_modal");
			this.$root.$emit("bv::refresh::table", "usersTable");
		},
		async createOfficeList(company_id){ 
			let self = this;
			let offices = {};
			try {
				let res = await UserService.getOffices(company_id, "id,name");
				offices = res.data.offices;
				offices.unshift({
					id: 0,
					name: "--- Filtra per Sede  --- ",
				});
			} catch (e) {
				self.$bvToast.toast(e.message, {
					title: "Errore",
					autoHideDelay: 2000,
					appendToast: true,
				});
			}
			return offices;
		},
		async handleCancel() {
			//await this.fetchUsers();
			this.user_origin_status = 0;
		},
		async handleOk() {
			try {
				await UserService.editUserData(
					this.modalUser,
					this.modalUser.id
				);
			} catch (error) {
				this.showError(error);
			}
			this.$root.$emit("bv::refresh::table", "usersTable");
			this.user_origin_status = 0;
		},
		async deleteUser(row_index, user_id) {
			let res = await this.$bvModal.msgBoxConfirm("Vuoi davvero cancellare l'utente?");
			if (res == true) {
				if (user_id != null) {
					UserService.deleteUser(user_id);
				}
				this.tableUsers.splice(row_index, 1);
				this.$root.$emit("bv::refresh::table", "usersTable");
			}
		},
		getParticipantStatus(surveyParticipant, survey) {
			if (!surveyParticipant || !surveyParticipant.id) {
				return {
					label: "",
					class: "text-default",
					survey: "",
				};
			}
			if (surveyParticipant.survey_completed_at) {
				return {
					label: "Compilato",
					class: "text-success",
					survey: survey.name,
				};
			}
			if (surveyParticipant.second_reminder_delivered_at) {
				return {
					label: "Secondo sollecito inviato",
					class: "text-danger",
					survey: survey.name,
				};
			}
			if (surveyParticipant.first_reminder_delivered_at) {
				return {
					label: "Primo sollecito inviato",
					class: "text-warning",
					survey: survey.name,
				};
			}
			if (surveyParticipant.invitation_delivered_at) {
				return {
					label: "Invito inviato",
					class: "text-info",
					survey: survey.name,
				};
			}
			return {
				label: "Inviato NON compilato",
				class: "text-warning",
				survey: survey.name,
			};
		},
		getSurveyFill(surveyParticipant) {
			if (!surveyParticipant || !surveyParticipant.id) {
				return "";
			} else {
				let a = `/questionari/fill/${surveyParticipant.survey_id}/${surveyParticipant.id}`;
				return a;
			}
		},
		getSurveyAnswers(surveyParticipant) {
			if (!surveyParticipant || !surveyParticipant.id) {
				return "";
			} else {
				return `/questionari/answers/${surveyParticipant.survey_id}/${surveyParticipant.user_id}`;
			}
		},
		fetchUsers() {
			this.getYear();
			let queryString = "";
			for (let key in this.filter) {
				if (_.has(this.filter, key)) {
					if (this.filter[key]) {
						queryString += `&${key}=${this.filter[key]}`;
					}
				}
			}
			if(this.year != null){
				queryString += `&year=${this.year}`;
			}
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
			if (this.pagination.page) {
				queryString = queryString + "&page=" + this.pagination.page;
			}
			console.log("queryString",queryString);
			let queryobj = new URLSearchParams(queryString);
			//Salvo il filtro
			localStorage.setItem("userList", JSON.stringify(this.filter));
			//console.log(this.filter);
			var newRelativePathQuery = window.location.pathname + '?' + queryobj.toString();
			history.pushState(null, '', newRelativePathQuery);
			
			
			//Cerco
			this.loading = true;
			let self = this;
			UserService.getUsers(`${queryString.substring(1)}`)
				.then((res) => {
					self.users = res.data.users;
					self.pagination = res.data.pagination.Users;
					self.tableUsers = self.users.map((user) => {
						let o = "";
						if (user.office_id) {
							if (_.has(user.office,"name")){
								o = user.office.name.substring(0, 20);
							}
						}
						return {
							cognome: user.last_name,
							nome: user.first_name,
							email: user.email,
							company_id: user.company_id,
							office_id: user.office_id,
							subcompany: user.subcompany,
							azienda: user.company
								? user.company.name + " (" + o + "... ) "
								: "",
							ruolo: user.role,
							sending_mode: user._matchingData.Surveys.sending_mode,
 							stato: self.getParticipantStatus(
								user._matchingData.SurveyParticipants,
								user._matchingData.Surveys
							),
							id: user.id,
							created: user.created,
							participant: user._matchingData.SurveyParticipants,
							origin: user._matchingData.Origins,
							years: user.years,
						};
					});
					this.loading = false;
					return self.tableUsers;
				})

				.catch((e) => {
					self.$bvToast.toast(e.message, {
						title: "Errore",
						autoHideDelay: 2000,
						appendToast: true,
					});
					self.loading = false;
					self.tableUsers = [];
					return self.tableUsers;
				});
		},
		async updateCompany() {
			this.offices = await this.createOfficeList(this.filter.company_id);
			if (this.filter.company_id != null) {
				let res = await UserService.getSurveysList(this.filter.company_id);
				console.log("rescompany",res);
				this.surveys = [
				{
					id: null,
					name: "Tutti",
				},
				...res.data.surveyList.map((s) => {
						return {
							id: s.id,
							name: s.name+(s.year!==null ? '-' +s.year : ''),
						};
					}),
				];
			} else {
				let res = await UserService.getAllSurveys();
				this.filter.office_id = null;
				console.log("tuttires",res);
				this.surveys = [
				{
					id: null,
					name: "Tutti",
				},
				...res.data.surveys.map((s) => {
						return {
							id: s.id,
							name: s.name+(s.year!==null ? '-' +s.year : ''),
						};
					}),
				];
			}
		},
		async updateCompanyModal(event_id) {
			this.modalOffices = await this.createOfficeList(this.modalUser.company_id);
			this.modalUser.office_id = null;
		},
		async resetPassword($email) {
			let res = await this.$bvModal.msgBoxConfirm("Vuoi davvero inviare una mail di password reset?");
			if (res == true) {
				UserService.resetPassword($email);
			}
		},
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
	async mounted() {
	
		// Se non ci sono attributi uso quelli memorizzati in localstorage
		if (this.$route.query.length == undefined){
			let storage_filters = JSON.parse(localStorage.getItem("userList"));
			if (storage_filters) this.filter = storage_filters;
			this.updateCompany();
		}

		// Altrimenti uso quelli passati come parametro
		if (this.$route.query.search) {
			this.filter.search = this.$route.query.search;
		} 
		if (this.$route.query.company_id){
			this.filter.company_id = parseInt(this.$route.query.company_id);
			this.updateCompany();
		}
		if (this.$route.query.office_id){
			this.filter.office_id = parseInt(this.$route.query.office_id);
		}
		if (this.$route.query.survey_id){
			this.filter.survey_id = parseInt(this.$route.query.survey_id);
		}
		if (this.$route.query.role){
			this.filter.role = this.$route.query.role;
		} 
		

		this.loading = true;
		try {
			const res = await Promise.all([
				UserService.getCompanyList(),
				UserService.getRoleList(),
				UserService.getAllSurveys(),
			]);
			this.companies = [
				{
					id: null,
					name: "Tutte",
				},
				...res[0].data.companies,
			];
			this.roles = [
				{
					id: null,
					name: "Tutti",
				},
				...res[1].data.roles,
			];
			this.surveys = [
				{
					id: null,
					name: "Tutti",
				},
				...res[2].data.surveys.map((s) => {
						return {
							id: s.id,
							name: s.name+(s.year!==null ? '-' +s.year : ''),
						};
					}),
			];
			this.getYear();
			// this.year = this.getYear;
		} catch (e) {
			this.showError(e);
		}
		if (this.$route.query.page){
			//console.log(this.pagination.page);
			this.pagination.page = Number(this.$route.query.page);
			//console.log(this.$route.query.page);
		}else if(localStorage.getItem("page")){
			this.pagination.page = Number(localStorage.getItem("page"));
		}
		await this.fetchUsers();
	},
};
</script>

<style>
.padding-5 {
  padding: 5px;
}
</style>
