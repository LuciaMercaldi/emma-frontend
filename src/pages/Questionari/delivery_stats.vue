/* eslint-disable indent */
<template>
	
    <div>
		<b-overlay :show="isBusy" rounded="sm">
		<div class="d-flex align-items-center justify-content-between mb-3">
    		<h1 class="mb-0 mt-0">{{ survey_name }}</h1>
    	<div>
        	<b-button id="popoverUsers" @click="generateMissingUsers()">Genera Utenti</b-button>
        	<b-popover target="popoverUsers" triggers="hover" html>
            	<template #title>Cosa fa?</template>
           		 Aggiunge i partecipanti mancanti nella survey.
        	</b-popover>
    	</div>
	</div>
		 
	 	
       <table class="table table-striped">
			<thead>
			<tr>		   
				<th>Indicatore</th>
				<th>Valore</th>
				<th>%</th>		   
			</tr>
			</thead>
			<tr><td>Numero totale di partecipanti</td><td>{{stats.total_num}}</td><td></td></tr>
			<tr><td>- di cui inviti nominali</td><td>{{stats.invitation_sent_num}}</td><td></td></tr>
			<tr><td>- di cui click anonimi o con mail invalida <b-link class="badge badge-secondary" @click="deleteEmptyParticipants()">elimina partecipanti senza risposte</b-link></td><td>{{stats.total_num - stats.invitation_sent_num - stats.sendable_invitation_num}}</td><td></td></tr>
			<tr><td>Numero totale di risposte <b>non complete</b><b-link class="badge badge-secondary" @click="deleteUsersNotCompleted()">elimina partecipanti senza tutte le risposte</b-link></td><td>{{stats.survey_not_completed_num}}</td><td>{{(stats.survey_not_completed_num / stats.total_num *100).toFixed(2) }} %</td></tr>
			<tr><td>Numero totale di risposte <b>complete</b></td><td>{{stats.survey_completed_num}}</td><td>{{(stats.survey_completed_num / stats.total_num *100).toFixed(2) }} %</td></tr>
			<tr v-if="stats.invitation_sent_num > 0"><td>- di cui nominali</td><td>{{stats.survey_completed_nominal}}</td><td>{{(stats.survey_completed_nominal / stats.invitation_sent_num *100).toFixed(2) }} %</td></tr>
			<tr><td>- di cui anonime</td><td>{{stats.survey_completed_anonimous}}</td><td>{{(stats.survey_completed_anonimous / (stats.total_num-stats.invitation_sent_num) *100).toFixed(2) }} %</td></tr>			
	   </table>
	
		<h2>Risposte per Sede
		<b-button variant="outline-primary" size="sm" @click="exportXls()" class="float-right">
			<i class="fa fa-file-excel-o" aria-hidden="true"></i>
			Esporta
		</b-button>
		</h2>
       <b-form-group>
		   	<label>Scegli la domanda che indica la sede di lavoro:</label>
	   		<v-select v-model="office_question_id" :options="questions" @input="fetchOfficeStats()" />
	   </b-form-group>

	   <table class="table table-striped">
		   <thead>
		   <tr>		   
			   <th>Sede</th>
			   <th>Risposte</th>
			   <th>Totale Lavoratori</th>		   
			   <th>%</th>		   
		   </tr>
		   </thead>
		   <tr v-for="sede in sedi" :key="sede.office">
			   <td>{{sede.office}}</td><td>{{sede.count}}</td><td>{{sede.totale_lavoratori}}</td><td>{{(sede.percentuale).toFixed(2) }} %</td>
		   </tr>
	   </table>
		 </b-overlay>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import vSelect from "vue-select";
import XLSX from "xlsx";

export default {
	name: "StatisticheInviiQuestionario",
	components: {
		vSelect,
	},

	mixins: [Util],
	data() {
		return {
			isBusy: false,
			survey_id: null,
			stats: {
				total_num: -1,
			},
			origin: null,
			sedi: [],
			questions: [],
			office_question_id: null,
			totale_lavoratori: -1,
			survey_name: null,
		};
	},
	methods: {	
		async fetchUsers() {
			this.isBusy = true;
			try {
				let response = await UserService.getStats(this.survey_id);
				this.stats = response.data.stats.participants;
				await this.fetchOfficeStats();
				this.isBusy = false;
			} catch (e) {
				//this.stats = null;
				//console.log(e);
				this.isBusy= false;
			}
		},
		async fetchOfficeStats(){
			let response = await UserService.getStatsByOffice(this.survey_id, this.office_question_id.code);
			this.sedi = [];
			for (const sede of 	response.data.stats) {
				this.sedi.push({
					office: JSON.parse(sede.answer),
					count: sede.c,
					totale_lavoratori: this.stats.total_num, //TODO: mettere il numero di lavoratori per sede
					percentuale: (sede.c/this.stats.total_num * 100),
				});
			}
		},
		exportXls() {
			let x = [];
			let l = ["Sede","Risposte","Totale Lavoratori", "%"];
			let v = this.sedi;
			
			x.push(l);
			for (let r of v){
				x.push(Object.values(r));
			}
			//console.log(x);

			let wb = XLSX.utils.book_new();
			wb.Props = {
				Title: "Esportazione Excel",
				Subject: "Esportazione",
				Author: "--",
				CreatedDate: new Date(),
			};
			wb.SheetNames.push("sedi");
			let ws = XLSX.utils.aoa_to_sheet(x);
			wb.Sheets["sedi"] = ws;
			XLSX.writeFile(wb, "statistiche.xlsx");
		},
		async deleteEmptyParticipants() {
			this.$bvModal.msgBoxConfirm("Vuoi davvero eliminare le risposte vuote").then(async (value) => {
				if (value) {
					this.isBusy = true;
					try{
						await UserService.deleteEmptyParticipants(this.survey_id);

						// create a toast with the message to wait until server response
						
						this.isBusy = false;
						this.$bvToast.toast("Eliminate partecipanti senza risposte", {
							title: "Eliminazione",
							variant: "success",
							solid: true,
						});
						await this.fetchUsers();
					}catch(e){
						this.isBusy = false;
						await this.fetchUsers();
						console.log(e);
						this.$bvToast.toast("Errore durante l'eliminazione", {
							title: "Eliminazione",
							variant: "danger",
							solid: true,
						});
					}
					
				}
			});
		},
		async deleteUsersNotCompleted() {
			this.$bvModal.msgBoxConfirm("Vuoi davvero eliminare le risposte non complete").then(async (value) => {
				if (value) {
					this.isBusy = true;
					try{
						let res=await UserService.deleteUsersNotCompleted(this.survey_id);
						// create a toast with the message to wait until server response
						if (res.data.participants>0){
							this.isBusy = false;
							this.$bvToast.toast("Eliminate "+res.data.participants+" risposte non complete", {
								title: "Eliminazione",
								variant: "success",
								solid: true,
							});
							await this.fetchUsers();
						}else{
							this.isBusy = false;
							this.$bvToast.toast("Nessuna risposta da eliminare", {
								title: "Eliminazione",
								variant: "info",
								solid: true,
							});
						}
					}catch(e){
							this.isBusy = false;
							await this.fetchUsers();
							console.log(e);
							this.$bvToast.toast("Errore durante l'eliminazione", {
								title: "Eliminazione",
								variant: "danger",
								solid: true,
							});
						}
					
					
				}
			});
		},
		async generateMissingUsers() {
			this.isBusy = true;
			try {
				await UserService.generateMissingUsers(this.survey_id);
				this.isBusy = false;
				this.$bvToast.toast("Generazione completata", {
					title: "Generazione",
					variant: "success",
					solid: true,
				});
				await this.fetchUsers();
			} catch (e) {
				this.isBusy = false;
				console.log(e);
				this.$bvToast.toast("Errore durante la generazione", {
					title: "Generazione",
					variant: "danger",
					solid: true,
				});
			}
		},
	},
	computed: {},
	async created() {
		this.survey_id = this.$route.params.survey_id;
		await this.fetchUsers();
		let self= this;
		UserService.getQuestions(this.survey_id).then(
			(response) => {
				self.survey_name = response.data.survey.name;
				self.questions = response.data.survey.questions.map( 
					(x) => ( {label:x.name, code:x.id} )
				);
			}
		);
	},
};
</script>

<style></style>
