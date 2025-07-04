<template>
    <div>
        <b-tabs content-class="mt-3" @input="onTabChange()">
            <b-tab title="Tabella" active>
                <b-table small selectable striped :items="result_from_backend" :fields="fields" :busy="busy">
                    <template #cell(riduzione_km_gg_auto)="data" v-if="enabledColumns">
                        {{ data.value | round2 }}
                    </template>
					<template #head(riduzione_km_gg_auto) v-if="enabledColumns">
						Riduzione Km auto/anno&nbsp;<b-icon 
						icon="info-circle" 
						variant="primary" 
						v-b-popover.hover="'sono un testo di esempio'"
						aria-label="Info">
					</b-icon>
                    </template>
                    <template #cell(Consumo)="data" v-if="enabledColumns">
                        {{ data.value | round2 }}
                    </template>
					<template #head(Consumo) v-if="enabledColumns">
						Risparmio di carburante [l]&nbsp;<b-icon 
						icon="info-circle" 
						variant="primary" 
						v-b-popover.hover="'sono un testo di esempio'"
						aria-label="Info">
					</b-icon>
                    </template>
                    <template #cell(CO)="data" v-if="enabledColumns">
                        {{ data.value | round2 }}
                    </template>
					<template #head(CO) v-if="enabledColumns">
                        Risparmio di CO [Kg]&nbsp;<b-icon 
						icon="info-circle" 
						variant="primary" 
						v-b-popover.hover="'sono un testo di esempio'"
						aria-label="Info">
					</b-icon>
                    </template>
                    <template #cell(CO2)="data">
                        {{ data.value | round2 }}
                    </template>
					<template #head(CO2)>
                        Risparmio di CO2 [Kg]&nbsp;
						<b-icon icon="info-circle" variant="primary" aria-label="Info" :id="`co2Icon-${measureId}`"></b-icon>
					<b-popover :target="`co2Icon-${measureId}`" triggers="hover" html>
						<template #title>La formula</template>
						∆EmiCO<sub>2</sub> = (∆kmauto * FeCO<sub>2</sub> * Op) / 1000, in cui FeCO<sub>2</sub> = 163.0846 g/km
					</b-popover>
                    </template>
                    <template #cell(NOx)="data">
                        {{ data.value | round2 }}
                    </template>
					<template #head(NOx)>
                        Risparmio di NOx [Kg]&nbsp;
						<b-icon icon="info-circle" variant="primary" aria-label="Info" :id="`noxIcon-${measureId}`"></b-icon>
					<b-popover :target="`noxIcon-${measureId}`" triggers="hover" html>
						<template #title>La formula</template>
						∆Emi<sub>NOx</sub> = (∆km<sub>auto</sub> * Fe<sub>NOx</sub> * Op) / 1000, in cui Fe<sub>NOx</sub> = 0.4256 g/km
					</b-popover>
                    </template>
                    <template #cell(PM10)="data">
                        {{ data.value | round2 }}
                    </template>
					<template #head(PM10)>
                        Risparmio di PM10 [Kg]&nbsp;
						<b-icon icon="info-circle" variant="primary" aria-label="Info" :id="`pm10Icon-${measureId}`"></b-icon>
						<b-popover :target="`pm10Icon-${measureId}`" triggers="hover" html>
							<template #title>La formula</template>
							∆Emi<sub>PM10</sub> = (∆km<sub>auto</sub> * Fe<sub>PM10</sub> * Op) / 1000, in cui Fe<sub>PM10</sub> = 0.0297 g/km
						</b-popover>
                    </template>
                </b-table>
            </b-tab>
            <b-tab title="Istogramma" style="height: 1050px">
                <GChart type="ColumnChart" :resizeDebounce="0" :data="emissionsChartData" :options="chartOptions" />
            </b-tab>
        </b-tabs>
    </div>
</template>
<script>
import Util from "@/mixing/util";
//import { ChartCard } from "@/components/index";
import emissionsConst from "@/data/emissions-const";
import Filters from "@/mixing/filters";

import { GChart } from "vue-google-charts";

import UserService from "@/services/user.service";

export default {
	name: "Impact",

	mixins: [Filters, Util],
	props: {
		measureId: Number,
		officeId: Number,
		surveyId: Number,
		companyId: Number,
		// year: Number,
		// rowIndex: Number,
		measure: Object,
		monitoring: Object,
		busy: Boolean,
	},
	components: {
		//ChartCard,
		GChart,
	},
	data() {
		return {
			ec: emissionsConst,
			chart: null,
			monitorings: null,
			fields: ["name", "riduzione_km_gg_auto", "Consumo", "CO", "CO2", "NOx" , "PM10"],
			emissionsChartData: [["name"], ["Riduzione Km \n auto/anno"], ["Consumo \n [litri/100km]"], ["CO \n[Kg/km]"], ["CO2 \n[Kg/km]"], ["NOx \n[Kg/km]"], ["PM10 \n[Kg/km]"]],
			chartOptions: {
				title: null,
				titleTextStyle: {
					bold: false,
				},
				height: 700,
				width: 1300,
				vAxis: {
					title: "",
				},
				legend: { position: "right" },
			},
			result_from_backend: null,
			enabledColumns: true,
		};
	},
	methods: {
		onTabChange() {
			this.$forceUpdate();
		},
		// calculateIndicator(serie) {
		//   if (serie == undefined) {
		//     return {};
		//   }
		//   let A = this.measure.indicator(serie);
		//   if (A == null) {
		//     return {};
		//   } else {
		//     return A.getOutput();
		//   }
		// },
	},
	async mounted() {
		this.enabledColumns = !(process.env.VUE_APP_THEME== "5t")
		this.getYear();
		let chartData =[];
		if(process.env.VUE_APP_THEME== "5t"){
			this.fields = ["name", "CO2", "NOx" , "PM10"];
			chartData = [["name", "CO2", "NOx" , "PM10"]];
			// this.emissionsChartData = [];
			this.emissionsChartData = [["name"], ["CO2 \n[Kg/km]"], ["NOx \n[Kg/km]"], ["PM10 \n[Kg/km]"]];
			console.log("this.emissionsChartData1",this.emissionsChartData);
		}else{
			chartData = [["name", "riduzione_km_gg_auto", "Consumo", "CO", "CO2", "NOx" , "PM10"]];
		}
		let row = 0;
		this.monitorings = this.monitoring;

		if (this.monitorings != undefined || this.monitorings != null) {
			// this.monitoring.series.forEach((element) => {
			//   this.monitorings.out[row] = this.calculateIndicator(element);
			//   this.monitorings.out[row].name = element.name;
			//   row++;
			// });

			try {
				let rslt = await UserService.getPsclMeasureImpacts(this.companyId, this.officeId, this.surveyId, this.year);
				//console.log(rslt);
				this.result_from_backend = rslt.data.impacts[this.measureId];
				// console.log("this.result_from_backend",this.result_from_backend);
				// remove values result_from_backend if they not in chartData
				if(process.env.VUE_APP_THEME== "5t"){
					this.result_from_backend.forEach((element) => {
					// console.log("element",element);
					// element is and object
					for (let prop in element) {
						// prop is a key
						// console.log("prop",prop);
						// console.log("chartData",chartData);
						// console.log("chartData.includes(prop)",chartData.includes(prop));
						// console.log("prop in chartData",prop in chartData);
						if(!(chartData[0].includes(prop))){
							delete element[prop];
						}
					}
				});
			}

				if (this.result_from_backend != undefined) {
					this.result_from_backend.forEach((element) => {
						let tmp = [];
						delete element.monitoring;
						delete element.officeName;
						for (let prop in element) {
							if (prop == "name") {
								tmp.unshift(element[prop]);
							}
							if (prop != "name") {
								
								tmp.push(element[prop]);
								
							}
						}
						console.log("tmp",tmp);
						if (tmp.length > 0) {
							chartData.push(tmp);
						}
						console.log("chartData",chartData);
					});
				}
			} catch (error) {
				//console.log(error);
			} finally {
				console.log("this.emissionsChartData",this.emissionsChartData);
				row = 0;
				chartData.forEach((element) => {
					if (row === 1) {
						for (let num = 0; num < element.length; num++) {
							this.emissionsChartData[num].push(element[num]);
						}
					}
					row = 1;
				});
			}
		}
	},
};
</script>
