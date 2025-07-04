<template>
    <div>
        <b-row class="mb-3">
            <b-col v-if=" loggedUserIsAdmin || loggedUserIsMomaAzienda">
                <b-button size="sm" variant="outline-primary" @click.prevent="showModalIndicatori(null,true)" v-if="!getObjective()">
                    <span class="ti-plus"></span>
                    Aggiungi obiettivo
                </b-button>
                &nbsp;
				<b-button size="sm" variant="outline-primary" @click.prevent="showModalIndicatori(null,false)" v-if="getObjective()">
                    <span class="ti-plus"></span>
                    Aggiungi punto di monitoraggio
                </b-button>
                &nbsp;
                <!-- <b-button @click="exportXls()" variant="primary" size="sm">
                    <span class="ti-file"></span>
                    Scarica XLS
                </b-button> -->
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-table
                    small
                    selectable
                    striped
                    :items="getMonitoringRows"
                    :fields="labels"
                    select-mode="single"
                    @row-clicked="onRowClicked"
                    :busy="busy"
                    :id="`tab-${measureId}`">
                    <template #table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Loading...</strong>
                        </div>
                    </template>

                    <template #cell(azioni)="data" v-if=" loggedUserIsAdmin || loggedUserIsMomaAzienda">
                        <b-icon @click.prevent="showModalIndicatori(data.index)" icon="pencil"></b-icon>&nbsp;
                        <b-icon icon="trash" @click="deleteMonitoring(data.index)"></b-icon>&nbsp;
                    </template>
                </b-table>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Util from "@/mixing/util";
import UserService from "@/services/user.service";
import XLSX from "xlsx";

export default {
	name: "monitoring",
	mixins: [Util],
	props: {
		measureId: Number,
		measure: Object,
		monitoring: Object,
		busy: Boolean,
	},
	data() {
		return {
			measure_id: null,
			labels: null,
			// labels_frontend: null,
		};
	},
	computed: {
		getMonitoringColumns() {
      let res = [
        { key: "name", label: "nome punto di monitoraggio" },
        { key: "dt", label: "Data" },
      ];
      if (this.measure !== undefined) {
        res = res.concat(this.measure.labels);
      }

      return res.concat({ key: "azioni", label: "Azioni" });
    },
		getMonitoringRows() {
			if (this.monitoring == undefined) {
				return [];
			}
			let s = this.monitoring;
			s.series.forEach((element) => { 
				if(element.objective==true){
					Object.assign(element, {_rowVariant: "success"});
				}
			} 
			);
			return s.series;
		},
	},
	async created() {
		try {
			this.labels = null;
			let lbls = await UserService.getPsclMeasureLabels(this.measureId);
			let res = [
				{ key: "name", label: "nome punto di monitoraggio" },
				{ key: "dt", label: "Data" },
			];
			if (this.measure !== undefined) {
				// console.log("lbls",lbls.data.labels);
				if(process.env.VUE_APP_THEME== "5t"){
					// remove last 3 from labels
					lbls.data.labels=lbls.data.labels.slice(0, -3);
					// console.log("lbls slice",lbls.data.labels);
				}
				res = res.concat(lbls.data.labels);
				res = res.concat({ key: "azioni", label: "Azioni" });
			}
			this.labels = res;
		} catch (error) {
			//console.log(error);
		}
	},
	methods: {
		getObjective() {
			let is_objective =false;
			if(this.monitoring!= undefined){
				this.monitoring.series.forEach((element) => {
					if(element.objective==true){
						is_objective=true;
					}
				});
			}
			
			return is_objective;
		},
		showModalIndicatori(row_index=null,objective=null) {
			this.$emit("modal-open", { measure_id: this.measureId, row_index: row_index , objective: objective});
		},

		async deleteMonitoring(row_index) {
			let monitoring_id = this.monitoring.series[row_index].id;
			if (monitoring_id != null) {
				UserService.deleteMonitoring(monitoring_id);
			}
			this.monitoring.series.splice(row_index, 1);
			this.$root.$emit("bv::refresh::table", "tab-" + this.measureId);
		},
		onRowClicked(serie, idx) {
			this.$emit("row-clicked", { measure_id: this.measureId, row_index: idx });
		},
		exportXls() {
			let x = [];
			x.push([]); //La prima riga contiene i titoli
			this.getMonitoringColumns.forEach((col) => {
				if (col.label !== "Azioni") {
					x[0].push(col.label);
				}
			});

			//Le righe successive prendono i valori nell'ordine delle colonne
			let i = 1;
			this.getMonitoringRows.forEach((serie) => {
				x.push([]);
				this.getMonitoringColumns.forEach((col) => {
					if (col.label !== "Azioni") {
						if (serie[col.key] !== undefined) {
							x[i].push(serie[col.key]);
						} else {
							x[i].push(col.key);
						}
					}
				});
				i++;
			});

			//Genero il file excel
			let wb = XLSX.utils.book_new();
			wb.Props = {
				Title: "Esportazione Excel",
				Subject: "Esportazione Pascal",
				Author: "Pascal",
				CreatedDate: new Date(),
			};
			wb.SheetNames.push("Primo Foglio");
			let ws = XLSX.utils.aoa_to_sheet(x);
			wb.Sheets["Primo Foglio"] = ws;
			XLSX.writeFile(wb, "out.xlsx");
		},
	},
};
</script>

<style></style>
