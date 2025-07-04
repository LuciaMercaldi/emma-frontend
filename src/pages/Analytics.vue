<template>
	<div>
		<b-form>
			<b-form-row>
				<b-col v-if="isAuthorized('admin, moma,moma_area')">
					<b-form-group label="Azienda, Ente, Scuola">
						<v-select v-model="company_id" :options="companies" label="name" :reduce="(x) => x.id" id="company"
							@input="updateCompany($event)" placeholder="Scrivi alcune lettere">
						</v-select>
					</b-form-group>
				</b-col>
				<b-col class="flex-grow-1 ml-1">
						<b-form-group label="Sede">
							<b-form-select v-model="office_id" :options="offices" value-field="id"
								text-field="name" id="sede"></b-form-select>
						</b-form-group>
					</b-col>
					<b-col class="flex-grow-1 ml-1">
						<b-form-group label="Questionario">
							<b-form-select v-model="survey_id" :options="surveys" value-field="id"
								text-field="name" id="survey"></b-form-select>
						</b-form-group>
					</b-col>
					<!-- <b-col class="col-lg-1 col-md-2">
						<b-form-group label="Anno">
							<b-form-select size="md" v-model="year" name="year" :options="yearOptions"/>
						</b-form-group>
					</b-col> -->
			</b-form-row>
		</b-form>

		<h1 class="mt-2">Risposte al questionario {{ survey.name }}</h1>

		<b-row>
			<b-col cols="12">
				<b-list-group horizontal>
					<b-list-group-item v-for="section in sections" :key="section.id" :ref="`section-${section.id}`"
						@click="openSection(section.id)" :active="section.id == activeSection">{{ section.name }}
					</b-list-group-item>
				</b-list-group>
			</b-col>
		</b-row>
		<hr>
		<b-row>
			<b-col class="mb-2 col-lg-6 col-md-12">
				<b class="mr-1">Domande
					<i class="fa fa-arrow-right" aria-hidden="true"></i>
				</b>
				<v-select
					v-model="selectedquestion"
					@input="openQuestionSelected($event)"
					:options="filters.optionList"
					class="mb-2"/>
				<span v-for="question in filterQuestions(activeSection)" variant="primary" :key="question.id" class="mt-1">
					<b-badge 
						href="#"
						@click="openQuestion(question)"
						variant="primary"
						pill
						v-if="activeSection != null">
						{{ question.name }}
					</b-badge>&nbsp;
				</span>
			</b-col>
			<b-col class="mb-2 col-lg-6 col-md-12">
				<b-col class="mb-2">
					<div>
						<b>Filtri
							<i class="fa fa-arrow-right" aria-hidden="true"></i>
						</b>
						<b-form-group>
							<v-select v-model="filters.questionList" @input="updateFilterQuestionList()"
								:options="filters.optionList" multiple id="filters"/>
						</b-form-group>
					</div>
				</b-col>
				<b-col>
					<b-form-checkbox variant="outline-primary" size="sm" v-model="filters.value_sort"
						@change="filterchange()">
						Ordinati
					</b-form-checkbox>
				</b-col>
				<b-col>
					<b-list-group-item v-if="filters.answerFilters.length">
						<b-col v-for="filter in filters.answerFilters" :key="filter.name">
							<b-form-group>
								<label>{{ filter.name }}</label>
								<b-form-select size="sm" v-model="filter.value" :options="filter.options"
									value-field="id" text-field="name" @change="filterchange()"></b-form-select>
							</b-form-group>
						</b-col>
					</b-list-group-item>
				</b-col>
			</b-col>
		</b-row>

		<hr/>

		<b-row>
			<b-col class="col-8">
				<h3>{{ currentQuestion.description }}</h3>
				<div class="muted" v-if="currentQuestion.long_description && currentQuestion.long_description.description">
					{{ currentQuestion.long_description.description }}
				</div>
			</b-col>
			<b-col class="col-4 pt-3">
				<b-button variant="outline-primary" size="sm" @click="exportXls()" class="ml-1 float-right mt-1">
					<i class="fa fa-file-excel-o" aria-hidden="true"></i>
					Esporta
				</b-button>
				<b-button 
					size="sm" 
					class="float-right ml-1 mt-1" 
					@click="toggleSecondGraph"
					v-b-popover.hover.top="'Solo per le domande associabili'">
					Confronta Anni
				</b-button>
			</b-col>
		</b-row>
			<hr/>

		<b-row class="col-12">
			<b-col class="flex-grow-1">
				<b-row>
					<b-col class="flex-grow-1 ml-1">
						<b-form-group label="Sede">
							<b-form-select v-model="office_id" :options="offices" value-field="id"
								text-field="name"></b-form-select>
						</b-form-group>
					</b-col>
					<b-col class="flex-grow-1 ml-1">
						<b-form-group label="Questionario">
							<b-form-select v-model="survey_id" :options="surveys" value-field="id"
							text-field="name"></b-form-select>
						</b-form-group>
					</b-col>
					<!-- <b-col class="col-lg-2 col-md-3">
						<b-form-group label="Anno">
							<b-form-select size="md" v-model="year_compare" name="year" :options="yearOptions"/>
						</b-form-group>
					</b-col> -->
				</b-row>
				<b-tabs fill class="flex-grow-1" content-class="mt-3" @input="onTabChange($event)">
					<b-tab title="Tabella" active class="flex-grow-1" id="Tabella">
						<b-card :title="currentQuestion.title">
							<div class="mb-2" v-if="activeQuestion != null">
								<b-form-checkbox v-model="stickyHeader" inline>Intestazione fissa / Sticky
									header</b-form-checkbox>
								<b-form-checkbox v-model="noCollapse" inline>Unisci bordi / No border
									collapse</b-form-checkbox>
							</div>
							<b-table striped hover :items="tableData" :fields="tableLabelsValues" responsive
								:sticky-header="stickyHeader" :no-border-collapse="noCollapse" :sort-by.sync="sortBy"
								:sort-desc.sync="sortDesc" bordered small v-if="activeQuestion != null">
								<template #cell(descrizione)="data">
									<a v-if="!isAnonymous &&
										questionType !== 'array' &&
										questionType !== 'multiple'
										" href="#detail" @click="getDetail(data.value)">
										{{ data.value }}
										<b-icon icon="box-arrow-down" title="dettaglio"></b-icon>
									</a>
									<span v-else>{{ data.value }}</span>
								</template>
							</b-table>
						</b-card>
					</b-tab>

					<b-tab class="flex-grow-1" title="Istogramma" id="Istogramma" >
						<GChart v-if="questionType != 'array' && activeQuestion != null" type="BarChart"
							:options="histoOptions" :data="hist">
						</GChart>
						<b-tabs content-class="mt-3" v-else-if="questionType == 'array' && activeQuestion != null">
							<b-tab v-for="(hist_a, index) in hist" :key="index" :title="histitle[index]">
								<b-card :title="histitle[index]" :key="index" width="">
									<GChart :key="index" type="BarChart" :options="histoOptions" :data="hist_a"></GChart>
								</b-card>
							</b-tab>
						</b-tabs>
						<h3 v-else>{{ message }}</h3>
					</b-tab>

					<b-tab class="flex-grow-1" id="pie" title="Torta" >
						<GChart v-if="questionType != 'array' && activeQuestion != null" type="PieChart"
							:options="pieOptions" :data="pie"></GChart>
						<b-tabs content-class="mt-3" v-else-if="questionType == 'array' && activeQuestion != null">
							<b-tab v-for="(pie_a, index) in pie" :key="index" :title="pie_a[0][1]">
								<b-card :title="pie_a[0][1]" :key="index">
									<GChart :key="index" type="PieChart" :options="pieOptions" :data="pie_a"></GChart>
								</b-card>
							</b-tab>
						</b-tabs>

						<h3 v-else>{{ message }}</h3>
					</b-tab>
				</b-tabs>
			</b-col>

			<b-col class="flex-grow-1" v-if="showSecondGraph">
				<b-row>
					<b-col class="flex-grow-1 ml-1">
						<b-form-group label="Sede">
							<b-form-select v-model="office_id_compare" :options="offices" value-field="id"
								text-field="name"></b-form-select>
						</b-form-group>
					</b-col>
					<b-col class="flex-grow-1 ml-1">
						<b-form-group label="Questionario">
							<b-form-select v-model="survey_id_compare" :options="surveys" value-field="id"
							text-field="name"></b-form-select>
						</b-form-group>
					</b-col>
					<!-- <b-col class="col-lg-2 col-md-3">
						<b-form-group label="Anno">
							<b-form-select size="md" v-model="year_compare" name="year" :options="yearOptions"/>
						</b-form-group>
					</b-col> -->
				</b-row>
				<b-tabs fill class="flex-grow-1" content-class="mt-3" @input="onTabChange($event)">
					<b-tab title="Tabella" active class="flex-grow-1">
							<b-card :title="currentQuestion.title" v-if="tableDataCompare.length > 0">
								<div class="mb-2" v-if="activeQuestion != null">
									<b-form-checkbox v-model="stickyHeader" inline>Intestazione fissa / Sticky
										header</b-form-checkbox>
									<b-form-checkbox v-model="noCollapse" inline>Unisci bordi / No border
										collapse</b-form-checkbox>
								</div>
								<b-table striped hover :items="tableDataCompare" :fields="tableLabelsValuesCompare" responsive
									:sticky-header="stickyHeader" :no-border-collapse="noCollapse" :sort-by.sync="sortBy"
									:sort-desc.sync="sortDesc" bordered small v-if="activeQuestion != null">
									<template #cell(descrizione)="data">
										<a v-if="!isAnonymous &&
											questionType !== 'array' &&
											questionType !== 'multiple'
											" href="#detail" @click="getDetail(data.value)">
											{{ data.value }}
											<b-icon icon="box-arrow-down" title="dettaglio"></b-icon>
										</a>
										<span v-else>{{ data.value }}</span>
									</template>
								</b-table>
							</b-card>
							<!-- v-else -->
							<h3 v-else>{{ messageTable }}</h3>
					</b-tab>

					<b-tab class="flex-grow-1" title="Istogramma"  >
						<GChart v-if="questionType != 'array' && activeQuestion != null && histCompare != null" type="BarChart"
							:options="histoOptions" :data="histCompare">
						</GChart>
						<b-tabs content-class="mt-3" v-else-if="questionType == 'array' && activeQuestion != null">
							<b-tab v-for="(hist_a, index) in histCompare" :key="index" :title="histitle[index]">
								<b-card :title="histitleCompare[index]" :key="index">
									<GChart :key="index" type="BarChart" :options="histoOptions" :data="hist_a"></GChart>
								</b-card>
							</b-tab>
						</b-tabs>
						<h3 v-else>{{ message }}</h3>
					</b-tab>

					<b-tab class="flex-grow-1" id="pie" title="Torta" >
						<GChart v-if="questionType != 'array' && activeQuestion != null && pieCompare.length > 0 " type="PieChart"
							:options="pieOptions" :data="pieCompare"></GChart>
						<b-tabs content-class="mt-3" v-else-if="questionType == 'array' && activeQuestion != null">
							<b-tab v-for="(pie_a, index) in pieCompare" :key="index" :title="pie_a[0][1]">
								<b-card :title="pie_a[0][1]" :key="index">
									<GChart :key="index" type="PieChart" :options="pieOptions" :data="pie_a"></GChart>
								</b-card>
							</b-tab>
						</b-tabs>

						<h3 v-else>{{ message }}</h3>
					</b-tab>
				</b-tabs>
			</b-col>
		</b-row>

		<b-row v-if="!isAnonymous">
			<b-col>
				<h2 id="detail">Utenti appartenenti alla categoria selezionata</h2>
				<b-table :items="detailData" :fields="detailLabels">
					<template #cell(email)="data">
						{{ data.value }}
						<b-link :to="getSurveyAnswers(data.item.id)" title="Vai al questionario"><b-icon
								icon="calendar2-check" /></b-link>
					</template>
				</b-table>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import XLSX from "xlsx";
import vSelect from "vue-select";
import { GChart } from "vue-google-charts";

export default {
	name: "QuestionariStats",
	components: {
		GChart,
		vSelect,
	},
	mixins: [Util],
	data() {
		return {
			stickyHeader: true,
			noCollapse: false,
			sortBy: "descrizione",
			sortDesc: false,
			survey: [],
			sections: [],
			activeQuestion: null,
			activeSection: null,
			stats: [],
			hist: [],
			showSecondGraph: false,
			histitle: [],
			pie: null,
			histoOptions: {
				title: null,
				titleTextStyle: { bold: false, },
				width: '100%',
				height: 700,
				fontName: "Sofia Sans",
				showLabel: true,
				chartPadding: 0,
				labelOffset: 20,
				// fontSize: 25,
				labelDirection: "explode",
				legend: { position: "right", alignment: "center"},
				chartArea: { left: 40, right: 200, top: 40, bottom: 40 },
			},
			pieOptions: {
				title: null,
				fontName: "Sofia Sans",
				titleTextStyle: { bold: false, },
				pieHole: 0.35,
				width: '100%',
				height: 700,
				donut: true,
				showLabel: true,
				chartPadding: 0,
				labelOffset: 20,
				labelDirection: "explode",
				legend: { position: "right", alignment: "center" },
				chartArea: { left: 40, right: 50, top: 20, bottom: 20 },
			},
			filters: {
				questionList: [],
				optionList: [],
				answerFilters: [],
				value_sort: false,
			},
			company_id: null,
			office_id: null,
			labels: [],
			series: [],
			offices: [],
			companies: [],
			surveys: [],
			questions: [],
			survey_id: null,
			survey_id_compare: null,
			tableLabels: [{ key: "descrizione", stickyColumn: true, isRowHeader: true, sortable: true }, { key: "qta", sortable: true }],
			questionType: null,
			theCurrentQuestion: null,
			tableLabelsArrayQuestions: null,
			message: "grafico non disponibile.",
			detailData: [],
			detailLabels: [
				{
					key: "email",
					label: "Email",
				},
				{
					key: "first_name",
					label: "Nome",
				},
				{
					key: "last_name",
					label: "Cognome",
				},
			],
			selectedquestion: [],
			histCompare: null,
			histitleCompare: [],
			office_id_compare: null,
			labelsCompare: [],
			seriesCompare: [],
			pieCompare: [],
			tableData: [],
			tableLabelsValues: [],
			// questionTypeCompare: null,
			tableDataCompare: [],
			tableLabelsValuesCompare: [],
			messageTable: "Tabella non disponibile.",
		};
	},

	computed: {
		isAnonymous() {
			return (
				this.survey.sending_mode == "a" || this.survey.sending_mode == null
			);
		},
		isNominal() {
			return this.survey.sending_mode == "n";
		},
		isAnonimized() {
			return this.survey.sending_mode == "z";
		},
		currentQuestion() {
			let self = this;
			//Restituisco vuoto
			if (this.activeQuestion == null || this.questions == undefined) {
				return {
					survey: [],
					sections: [],
					activeQuestion: null,
					activeSection: null,
					stats: [],
					hist: null,
					histitle: [],
					pie: null,
					histoOptions: {
						title: null,
						width: '100%',
						height: 700,
						fontName: "Segoe UI",
						// fontSize: 25,
						vAxis: {
							title: "",
						},
						legend: { position: "right" },
					},
					pieOptions: {
						title: null,
						width: '100%',
						height: 700,
						donut: true,
						showLabel: true,
						chartPadding: 30,
						labelOffset: 50,
						labelDirection: "explode",
					},
					labels: [],
					series: [],
					survey_id: null,
					survey_id_compare: null,
					tableLabels: [{ key: "descrizione", stickyColumn: true, isRowHeader: true, sortable: true }, { key: "qta", sortable: true }],
					questionType: null,
					theCurrentQuestion: null,
					tableLabelsArrayQuestions: null,
					message: "feature is in progress.....",
				};
			}
			if (self.questions != undefined && self.activeQuestion != undefined) {
				self.theCurrentQuestion = self.questions.find(
					(x) => x.id === self.activeQuestion
				);
				self.questionType = self.questions.find(
					(x) => x.id === self.activeQuestion).type;
				return self.questions.find((x) => x.id === self.activeQuestion);
			} else {
				return [];
			}

		},
		
		filterString: function () {
			if (!this.filters.questionList) {
				return "";
			}
			return this.filters.questionList.map((x) => x.code).join();
		},
	},
	watch: {
		async company_id(newV, oldV) {
			await this.updateValues();
		},
		async office_id(newV, oldV) {
			await this.updateValues();
		},
		async survey_id(newV, oldV) {
			await this.updateSurvey();
			await this.updateValues();
			// this.updateFiltri();
		},
		async office_id_compare(newV, oldV) {
			await this.updateValuesCompare();
		},
		async survey_id_compare(newV, oldV) {
			await this.updateSurvey();
			await this.updateValuesCompare();
			// this.updateFiltri();
		},
	},
	methods: {
		// updateFiltri(){
		// 	this.filters.optionList = this.questions;
		// },
		async updateCompany() {
			this.offices = await this.createOfficeList();
			this.surveys = await this.createFilteredSurveysList();
		},
		async createFilteredSurveysList() {
			let res = await UserService.getSurveysList(this.company_id, this.office_id);

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
			return this.surveys;
		},
		async createOfficeList() {
			let self = this;
			let offices = {};
			try {
				let res = await UserService.getOffices(this.company_id);
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
		getSurveyAnswers(user_id) {
			return `/questionari/answers/${this.survey_id}/${user_id}`;
			
		},
		getSurveyAnswers_compare(user_id) {
			return `/questionari/answers/${this.survey_id}/${user_id}`;
			
		},
		toggleSecondGraph() {
		this.showSecondGraph = !this.showSecondGraph;
		},
		async getDetail(answer) {
			let filters = {};

			for (let flt of this.filters.answerFilters) {
				if (flt.value) {
					filters[flt.name] = flt.value;
				}
			}
			let response = await UserService.getAnswerIndicator(
				this.theCurrentQuestion.name,
				this.company_id,
				this.office_id,
				filters,
				!this.filters.value_sort,
				this.survey_id,
				answer
			);
			//Se è un dettaglio il risultato è in list
			if (response.data.list !== null) {
				this.detailData = response.data.list;
			}
		},
		histData(labels,series) {
			console.log("labelshist",labels);
			console.log("serieshist",series);
			// let hist = null;
			let hist = [[""], [""]];
			let histitle = [];
			// let self.labels = labels;
			let items = [];
			if (this.questionType == "array") {
				let mainOptions = [];
				let subOptions = [];
				let hist = [];
				let histitle = [];


				labels.forEach((label) => {
					if (label !== "" && label !== "[]") {
						let index = label.indexOf("|");
						let suboption = label.substring(index + 1).trim();
						let mainOption = label.substring(0, index).trim();

						if (label.includes("altro") && !mainOptions.includes("altro")) {
							mainOptions.push("altro");
						} else if (
							!label.includes("altro") &&
							!mainOptions.includes(mainOption)
						) {
							mainOptions.push(mainOption);
						}

						if (label.includes("altro") && !subOptions.includes("altro")) {
							subOptions.push("altro");
						} else if (
							!label.includes("altro") &&
							!subOptions.includes(suboption)
						) {
							subOptions.push(suboption);
						}
					}
				});

				this.tableLabelsArrayQuestions = subOptions;

				mainOptions.forEach((mainOption) => {
					let temp = [];
					temp["descrizione"] = mainOption;
					let subOption_total_count = 0;
					for (let i = 0; i < labels.length; i++) {
						if (labels[i].includes(mainOption)) {
							subOption_total_count += parseInt(this.series[0][i]);
						}
					}

					for (
						let i = 0;
						i < labels.length && subOption_total_count > 0;
						i++
					) {
						if (labels[i].includes(mainOption)) {
							if (labels[i] == "altro") {
								temp[labels[i]] =
									self.series[0][i] +
									" (" +
									(
										(100 * parseInt(self.series[0][i])) /
										subOption_total_count
									).toFixed(2) +
									"%)";
							} else {
								let index = labels[i].indexOf("|");
								let option = labels[i].substring(index + 1).trim();
								temp[option] = parseFloat(series[0][i]);
							}
						}
					}
					if (subOption_total_count == 0) {
						temp[mainOption] = "0 (0%)";
						items.push(temp);
					} else {
						items.push(temp);
					}
				});
				
				let i = 0;
				// hist.push([[""], [""]]);
				items.forEach((element) => {
					console.log(element);
					hist.push([[""], [""]]);
					console.log("hist",hist);
					Object.keys(element).forEach(key => {
						console.log(key, element[key]);


						if (Number.isNaN(parseFloat(element[key]))) {
							histitle.push(element[key]);
							// this.hist[i][1].push(element[key]);
						} else {
							hist[i][0].push("" + key);
							hist[i][1].push(parseFloat(element[key]));

						}



					});
					i = i + 1;
				});
				console.log("hist:");
				console.log(hist);
				console.log("histitle:");
				console.log(histitle);
				return [hist, histitle];
				
			}else if(this.questionType == "map"){
				return [hist, histitle];
			}else {
				labels.forEach((element) => {
					hist[0].push("" + element);
				});
				series[0].forEach((element) => {
					hist[1].push(parseFloat(element));
				});
				
				window.dispatchEvent(new Event('resize'));// Triggera un evento di resize per forzare l'aggiornamento dei grafici

				return [hist, histitle];
			}
			 


		},
		

		pieData(labels,series) {
			console.log("labels",labels);
			console.log("series",series);
			let pie = [];
			// let self = this;
			let items = [];
			if (this.questionType == "array") {
				let mainOptions = [];
				let subOptions = [];
				this.pie = [];


				labels.forEach((label) => {
					if (label !== "" && label !== "[]") {
						let index = label.indexOf("|");
						let suboption = label.substring(index + 1).trim();
						let mainOption = label.substring(0, index).trim();

						if (label.includes("altro") && !mainOptions.includes("altro")) {
							mainOptions.push("altro");
						} else if (
							!label.includes("altro") &&
							!mainOptions.includes(mainOption)
						) {
							mainOptions.push(mainOption);
						}

						if (label.includes("altro") && !subOptions.includes("altro")) {
							subOptions.push("altro");
						} else if (
							!label.includes("altro") &&
							!subOptions.includes(suboption)
						) {
							subOptions.push(suboption);
						}
					}
				});

				this.tableLabelsArrayQuestions = subOptions;

				mainOptions.forEach((mainOption) => {
					let temp = [];
					temp["descrizione"] = mainOption;
					let subOption_total_count = 0;
					for (let i = 0; i < labels.length; i++) {
						if (labels[i].includes(mainOption)) {
							subOption_total_count += parseInt(this.series[0][i]);
						}
					}

					for (
						let i = 0;
						i < labels.length && subOption_total_count > 0;
						i++
					) {
						if (labels[i].includes(mainOption)) {
							if (labels[i] == "altro") {
								temp[labels[i]] =
									self.series[0][i] +
									" (" +
									(
										(100 * parseInt(self.series[0][i])) /
										subOption_total_count
									).toFixed(2) +
									"%)";
							} else {
								let index = labels[i].indexOf("|");
								let option = labels[i].substring(index + 1).trim();
								temp[option] = parseFloat(series[0][i]);
							}
						}
					}
					if (subOption_total_count == 0) {
						temp[mainOption] = "0 (0%)";
						items.push(temp);
					} else {
						items.push(temp);
					}
				});

				//console.log(items);
				// this.hist.push(items);
				// //console.log(this.hist);	
				let i = 0;
				items.forEach((element) => {
					//console.log(element);
					pie.push([]);
					Object.keys(element).forEach(key => {
						//console.log(key, element[key]);

						//this.pie[i].push("" + );
						if (Number.isNaN(parseFloat(element[key]))) {
							pie[i].push([key, element[key]]);
						} else {
							pie[i].push([key, parseFloat(element[key])]);
						}



					});
					i = i + 1;
				});
				//console.log(this.pie);
			}else if(this.questionType == "map"){
				return pie;
			}
			 else {
				pie = [this.tableLabels];
				for (let i = 0; i < labels.length; i++) {
					pie.push([String(labels[i]), parseFloat(series[0][i])]);
				}
				//console.log(this.pie);
			}
			
			window.dispatchEvent(new Event('resize'));// Triggera un evento di resize per forzare l'aggiornamento dei grafici

			return pie;
			// this.$forceUpdate();
		},
		openSection(section_id) {
			if (this.activeSection != section_id) {
				this.activeSection = section_id;
				this.activeQuestion = null; //Attivo la domanda corrente
				this.theCurrentQuestion = null;
				this.selectedquestion = [];
			} else {
				this.activeSection = section_id;
			}

		},
		download($url) {
			this.btnloading = true;
			UserService.download($url).then(() => {
				this.btnloading = false;
			});
		},
		updateSurvey() {
			if (this.survey_id) {
				UserService.getSurveyView(this.survey_id).then(
					(response) => {
						this.survey = response.data.survey;
						this.questions = this.survey.questions;
						this.filters.optionList = this.questions.map((x) => ({
							label: `${x.id}_${x.name}_${x.description}`,
							code: x.id,
						}));
						
					},
					(error) => this.showError(error)
				);
			} else {
				this.survey = {
					company_id: null,
					name: "Tutti",
				};
			}
		},
		async updateValues() {
			console.log("updateValues");
			let filters = {};

			for (let flt of this.filters.answerFilters) {
				if (flt.value) {
					filters[flt.name] = flt.value;
				}
			}
			if (this.theCurrentQuestion != null) {
				await UserService.getAnswerIndicator(
					this.theCurrentQuestion.name,
					this.company_id,
					this.office_id,
					filters,
					!this.filters.value_sort,
					this.survey_id
				)
					.then((response) => {
						if (response.data == null) {
							this.stats = [];
							this.labels = ["Risposte non presenti"];
							this.series = null;
							return;
						}
						console.log("response.data",response.data);
						this.labels = response.data.labels;
						this.series = response.data.series;
						this.questionType = response.data.Type;

						[this.hist,this.histitle]=this.histData(response.data.labels, response.data.series);
						this.pie =this.pieData(response.data.labels, response.data.series);
						this.tableData=this.makeTableData(response.data.labels, response.data.series);
						this.tableLabelsValues=this.makeTableLabel(response.data.Type);
						this.detailData = [];
					})
					.catch((error) => this.showError(error));
			}

		},
		async updateValuesCompare() {
			let filters = {};

			for (let flt of this.filters.answerFilters) {
				if (flt.value) {
					filters[flt.name] = flt.value;
				}
			}
			if (this.theCurrentQuestion != null) {
				
				// get labels and series  to compare
				UserService.getAnswerIndicator(
				this.theCurrentQuestion.name,
				this.company_id,
				this.office_id_compare,
				filters,
				!this.filters.value_sort,
				this.survey_id_compare
			)
				.then((response) => {
					if (response.data == null) {
						this.stats = [];
						this.labelsCompare = ["Risposte non presenti"];
						this.seriesCompare = null;
						return;
					}
					this.labelsCompare = response.data.labels;
					this.seriesCompare = response.data.series;
					// this.questionTypeCompare = response.data.Type;

					[this.histCompare,this.histitleCompare]=this.histData(response.data.labels, response.data.series);
					this.pieCompare = this.pieData(response.data.labels, response.data.series);
					this.tableDataCompare=this.makeTableData(response.data.labels, response.data.series);
					this.tableLabelsValuesCompare=this.makeTableLabel(response.data.Type);
					console.log("this.pieCompare",this.pieCompare);
					this.detailData = [];
				})
				.catch((error) => {
					this.stats = [];
					this.labelsCompare = ["Risposte non presenti"];
					this.seriesCompare = null;
					this.histCompare= null;
					this.histitleCompare= [];
					this.labelsCompare= [];
					this.seriesCompare= [];
					this.pieCompare= [];
					this.tableDataCompare= [];
					this.tableLabelsValuesCompare= [];
					this.showError(error);
				});
			}
		

		},
		async openQuestion(question) {
			console.log("openQuestion",question);
			this.theCurrentQuestion = question;
			this.activeQuestion = question.id; //Attivo la domanda corrente
			// console.log("question",question);
			// console.log("question",Object.values(question));
			this.selectedquestion = {
					label: `${question.id}_${question.name}_${question.description}`,
					code: question.id
				};
			this.$forceUpdate();
			if (this.filters.office_id == 0) {
				this.filters.office_id = null;
			}
			await this.updateValues();
			if(this.showSecondGraph){
				await this.updateValuesCompare();
			}
		},
		async openQuestionSelected(question) {
			console.log("openQuestionSelected",question);
			this.theCurrentQuestion = this.questions.filter(function (m) {
				return m.id == question.code;
			})[0];
			this.activeQuestion = question.code; //Attivo la domanda corrente
			this.$forceUpdate();
			if (this.filters.office_id == 0) {
				this.filters.office_id = null;
			}
			console.log("this.filters.office_id",this.filters.office_id);
			await this.updateValues();
			if(this.showSecondGraph){
				await this.updateValuesCompare();
			}
		},

		filterQuestions(section_id) {
			if (this.questions == undefined) {
				return [];
			}
			return this.questions.filter(function (m) {
				if (m._joinData == undefined) {
					return m.section_id == section_id;
				} else {
					return m._joinData.section_id == section_id;
				}
			});
		},
		onTabChange($event) {
			// this.$forceUpdate();
			console.log("onTabChange",$event);
			this.pie =this.pieData(this.labels, this.series);
						this.tableData=this.makeTableData(this.labels, this.series);
						this.tableLabelsValues=this.makeTableLabel(this.questionType);
		},
		getTableColumns() {
			if (this.labels == undefined) {
				return [];
			}
			return this.labels;
		},
		getTableRows() {
			if (this.series == undefined) {
				return [];
			}
			return this.series[0];
		},
		exportXls() {
			let x = [];
			let r = ["descrizione", "qta"];
			let l = this.getTableColumns();
			let v = this.getTableRows();

			x.push(r);
			for (let i = 0; i < l.length; i++) {
				r = [];
				r.push(l[i]);
				r.push(v[i]);
				x.push(r);
			}
			let wb = XLSX.utils.book_new();
			wb.Props = {
				Title: "Esportazione Excel",
				Subject: "Esportazione",
				Author: "--",
				CreatedDate: new Date(),
			};
			wb.SheetNames.push(this.theCurrentQuestion.name);
			let ws = XLSX.utils.aoa_to_sheet(x);
			wb.Sheets[this.theCurrentQuestion.name] = ws;
			XLSX.writeFile(wb, "indicatore.xlsx");
		},
		async updateFilterQuestionList() {
			// localStorage.setItem("filters.questionList", JSON.stringify(this.filters.questionList));

			// Find new elements and fetch them
			let current_ids = this.filters.answerFilters.map((x) => x.id);
			let ids_to_fetch = [];
			for (let flt of this.filters.questionList) {
				if (!current_ids.includes(flt.code)) {
					ids_to_fetch.push(flt.code);
				}
			}
			let response = await UserService.getOriginFiltersForAnswers(
				ids_to_fetch.join(),
				this.survey_id
			);
			this.filters.answerFilters.push(
				...response.data.filters.map((filter) => ({
					...filter,
					value: this.$route.query[`filter-${filter.name}`]
						? this.$route.query[`filter-${filter.name}`]
						: "",
				}))
			);

			// Now remove elements we no longer have in vue-select
			current_ids = this.filters.questionList.map((x) => x.code);
			this.filters.answerFilters = this.filters.answerFilters.filter((x) =>
				current_ids.includes(x.id)
			);

			await this.updateValues();
			await this.updateValuesCompare();
		},
		async filterchange() {
			await this.updateValues();
			await this.updateValuesCompare();
		},
		makeTableData(labels,series) {
			let items = [];
			let self = this;

			if (this.labels == undefined) {
				return [];
			}

			//let tableColumns = ["descrizione"];
			//let questionNames = [];

			if (this.questionType == "array") {
				let mainOptions = [];
				let subOptions = [];
				// subOptions.push("descrizione");
				subOptions.push({ key: "descrizione", stickyColumn: true, isRowHeader: true, sortable: true });

				labels.forEach((label) => {
					if (label !== "" && label !== "[]") {
						let index = label.indexOf("|");
						// let mainOption = label.substring(index + 1).trim();
						// let suboption = label.substring(0, index).trim();
						let suboption = label.substring(index + 1).trim();
						let mainOption = label.substring(0, index).trim();

						if (label.includes("altro") && !mainOptions.includes("altro")) {
							mainOptions.push("altro");
						} else if (
							!label.includes("altro") &&
							!mainOptions.includes(mainOption)
						) {
							mainOptions.push(mainOption);
						}

						if (label.includes("altro") && !subOptions.includes("altro")) {
							subOptions.push("altro");
						} else if (
							!label.includes("altro") &&
							!subOptions.includes(suboption)
						) {
							subOptions.push({ key: suboption, sortable: true });
						}
					}
				});

				this.tableLabelsArrayQuestions = subOptions;

				mainOptions.forEach((mainOption) => {
					let temp = [];
					temp["descrizione"] = mainOption;
					let subOption_total_count = 0;
					for (let i = 0; i < labels.length; i++) {
						if (labels[i].includes(mainOption)) {
							subOption_total_count += parseInt(series[0][i]);
						}
					}

					for (
						let i = 0;
						i < labels.length && subOption_total_count > 0;
						i++
					) {
						if (labels[i].includes(mainOption)) {
							if (labels[i] == "altro") {
								temp[labels[i]] =
									series[0][i] +
									" (" +
									(
										(100 * parseInt(series[0][i])) /
										subOption_total_count
									).toFixed(2) +
									"%)";
							} else {
								let index = labels[i].indexOf("|");
								// let option = self.labels[i].substring(0, index).trim();
								let option = labels[i].substring(index + 1).trim();
								temp[option] =
									series[0][i] +
									" (" +
									(
										(100 * parseInt(series[0][i])) /
										subOption_total_count
									).toFixed(2) +
									"%)";
							}
						}
					}
					if (subOption_total_count == 0) {
						temp[mainOption] = "0 (0%)";
						items.push(temp);
					} else {
						items.push(temp);
					}
				});

				return items;
			}

			if (this.questionType == "text" || this.questionType == "map") {
				labels.forEach((label) => {
					let r = [];
					r["descrizione"] = label;
					items.push(r);
				});
				return items;
			}

			let total = 0;
			let l = labels.length;
			series.forEach((row) => {
				for (let c = 0; c < l; c++) {
					total += row[c];
				}
			});

			series.forEach((row) => {
				for (let c = 0; c < l; c++) {
					let r = [];
					r["descrizione"] = labels[c];
					r["qta"] = row[c];
					r["perc"] = ((row[c] / total) * 100).toFixed(1) + "%";
					items.push(r);
				}
			});
			return items;
		},
		makeTableLabel(questionType) {
			console.log("questionType",questionType);
			if (questionType == "array") {
				return this.tableLabelsArrayQuestions;
			}
			if (questionType == "text" || questionType == "map") {
				return [{ key: "descrizione", stickyColumn: true, isRowHeader: true, sortable: true }];
			}
			return [...this.tableLabels, { key: "perc", sortable: true }];
		},
	},
	async created() {
		this.loading = true;
		// this.getyear();
		this.survey_id = this.$route.params.survey_id;
		if (this.$route.query.company_id) {
			this.company_id = parseInt(this.$route.query.company_id);
			this.updateCompany();
		}
		if (this.$route.query.office_id) {
			this.office_id = parseInt(this.$route.query.office_id);
		}
		if (this.$route.query.survey_id) {
			this.survey_id = parseInt(this.$route.query.survey_id);
		}
		if (this.$route.query.office_id_compare) {
			this.office_id_compare = parseInt(this.$route.query.office_id_compare);
		}
		if (this.$route.query.survey_id_compare) {
			this.survey_id_compare = parseInt(this.$route.query.survey_id_compare);
		}

		this.loading = true;

		try {
			const res = await Promise.all([
				UserService.getCompanyList(),
			]);
			this.companies = [
				{
					id: null,
					name: "Tutte",
				},
				...res[0].data.companies,
			];

		} catch (e) {
			this.showError(e);
		}

		let self = this;
		self.questions = [];
		UserService.getQuestionList().then((response) => {
			this.filters.optionList = response.data.questions.map((x) => ({
				label: `${x.id}_${x.name}_${x.description}`,
				code: x.id,
			}));

			self.questions = response.data.questions;
		});


		this.updateSurvey();

		UserService.getSections().then(
			(response) => (this.sections = response.data.sections),
			(error) => this.showError(error)
		);

		let colors = null;
		//Get the colors from the settings in SurveysController
		UserService.getColors().then(
			(response) => {
				colors = response.data.data;
				if (colors != null) {
					this.histoOptions.colors = colors;
					this.pieOptions.colors = colors;
				}
			},
			(error) => this.showError(error)
		);
		this.loading = false;
	},
};
</script>

<style></style>
