<template>
    <div>
        <!--Stats cards-->
		<h5>Dato Complessivo Intera Regione</h5>
        <div class="row">
            <div class="col-md-4 col-xl-4" v-for="stats in statsCards" :key="stats.title">
                <stats-card>
                    <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
                        <i :class="stats.icon"></i>
                    </div>
                    <div class="numbers" slot="content">
                        <p>{{ stats.title }}</p>
                        {{ stats.value }}
                    </div>
                    <div class="stats" slot="footer"><i :class="stats.footerIcon"></i> {{ stats.footerText }}</div>
                </stats-card>
            </div>
        </div>

		<!--Charts-->
		<h5 v-if="loggedUserIsMomaAzienda">Dato Azienda</h5>
		<h5 v-if="loggedUserIsMomaArea">Dato Area</h5>
        <div class="row">
            <div class="col-md-6 col-12">
					<b-spinner label="Spinning" v-if="loadingModalSplit" ></b-spinner>					
					<b-card title="Split Modale" style="max-width: 200rem" v-if="!loadingModalSplit">
						<GChart type="PieChart" :options="pieOptions" :data="pieModalSplit" />
					</b-card>
					
				
            </div>
            <div class="col-md-6 col-12">
				<b-spinner label="Spinning" v-if="loadingCarburante" ></b-spinner>					
                <b-card title="Alimentazione" style="max-width: 200rem" v-if="!loadingCarburante">
                    <GChart type="BarChart" :options="histoOptions" :data="histCarburante" />
                </b-card>
            </div>
        </div>
    </div>
</template>
<script>
import { StatsCard } from "@/components/index";
import UserService from "@/services/user.service";
import { GChart } from "vue-google-charts";
import Util from "@/mixing/util.js";

const statsCards = [
	{
		type: "success",
		icon: "ti-direction",
		title: "Aziende e Scuole",
		value: "",
		footerText: "Aggiornato ora",
		footerIcon: "ti-reload",
	},
	{
		type: "warning",
		icon: "ti-view-list-alt",
		title: "Risp. Questionari",
		value: "",
		footerText: "La tua azienda: 123",
		footerIcon: "",
	},
	{
		type: "danger",
		icon: "ti-user",
		title: "Utenti su mappa",
		value: "",
		footerText: "La tua azienda: 123",
		footerIcon: "ti-reload",
	},
];
export default {
	components: {
		StatsCard,
		// ChartCard,
		GChart,
	},
	mixins: [Util],
	data() {
		return {
			statsCards: statsCards,
			companies: null,
			company_id: null,
			// All charts Variables
			pieModalSplit: null,
			histCarburante: null,
			loadingModalSplit: true,
			loadingCarburante: true,

			labelsModalSplit: null,
			seriesModalSplit: null,
			indicator_typeModalSplit: null,

			labelsCarburante: null,
			seriesCarburante: null,
			indicator_typeCarburante: null,

			// Pie chart 
			pieOptions: {
				title: null,
				titleTextStyle: {
					bold: false,
				},
				height: 530,
				legend: { position: "right" },
				pieHole: 0.5,
			},
			// hist Chart
			histoOptions: {
				title: null,
				titleTextStyle: {
					bold: false,
				},
				height: 530,
				vAxis: {
					title: "",
				},
				legend: { position: "bottom" },
			},
			
			// Skeleton options
			animation: 'wave', // Choose 'wave' or 'pulse'
			count: 1, // Number of skeleton elements
			width: '100%', // Width of the skeleton element
			height: '100%', // Height of the skeleton element
		};
	},
	methods: {},
	async created() {
		this.loading = true;
		let self = this;
		//Se c'è l'utente ha un azienda, filtra su quel valore
		this.company_id = this.getUserCompany;

		
		let r = "";
		r = await UserService.countCompanies();
		this.statsCards[0].value = r.data.count;

		r = await UserService.countResponders();
		this.statsCards[1].value = r.data.count;

		r = await UserService.countEmployees();
		this.statsCards[2].value = r.data.count;

		UserService.getAnswerIndicator("ripartizione_modale", this.company_id).then(
			(response) => {
				self.loadingModalSplit = false;
				self.labelsModalSplit = response.data.labels;
				self.seriesModalSplit = response.data.series;
				self.indicator_typeModalSplit = response.data.Type;

				// Modal Split Pie Chart
				this.pieModalSplit = [["descrizione", "qta"]];
				for (let i = 0; i < self.labelsModalSplit.length; i++) {
					this.pieModalSplit.push([self.labelsModalSplit[i], parseFloat(self.seriesModalSplit[0][i])]);
				}

			},
			(error) => this.showError(error)
		);

		UserService.getAnswerIndicator("carburante", this.company_id).then(
			(response) => {
				self.loadingCarburante= false;
				self.labelsCarburante = response.data.labels;
				self.seriesCarburante = response.data.series;
				self.indicator_typeCarburante = response.data.Type;
				
				// Carburante histogram
				self.histCarburante = [["descrizione"], [""]];
				self.labelsCarburante.forEach((element) => {
					self.histCarburante[0].push(element);
				});
				self.seriesCarburante[0].forEach((element) => {
					self.histCarburante[1].push(parseFloat(element));
				});
			},	
			(error) => this.showError(error)
		);

		let colors = null;
		//Get the colors from the settings in SurveysController
		UserService.getColors().then(
			(response) => {
				colors = response.data.data;
				if (colors != null) {
					self.histoOptions.colors = colors;
					self.pieOptions.colors = colors;
				}
			},
			(error) => this.showError(error)
		);	
		
		//self.companies = await UserService.getCompanyList();
		this.loading = false;
	},
};
</script>

<style></style>
