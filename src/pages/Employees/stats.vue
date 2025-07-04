<template>
    <div>
        <b-overlay :show="isBusy" rounded="sm">

            <div v-for="r in stats" :key="r.id">
                <h2>{{ r.name }} - {{ r.code }}</h2>

                <table class="table table-striped">
                    <tr>
                        <td>Numero Impiegati</td>
                        <td>{{ r.num_impiegati }}</td>
                    </tr>
                </table>

                <h3>{{ r.code }} - Num Impiegati per genere</h3>
                <b-tabs content-class="mt-3">
                    <b-tab title="Tabella" active>
                        <table class="table table-striped">
                            <thead>
                                <th width="30%">Genere</th>
                                <th>Conteggio</th>
                            </thead>
                            <tbody>
                                <tr v-for="n in r.num_impiegati_sesso" :key="n.gender">
                                    <td>
                                        <b>{{ n.gender }}</b>
                                    </td>
                                    <td>
                                        {{ n.count }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-tab>

                    <b-tab title="Torta">
                        <GChart type="PieChart" :options="pieOptions"
                            :data="getChartData(r.num_impiegati_sesso, 'gender', 'count')">
                        </GChart>
                    </b-tab>

                    <b-tab title="Istogramma">
                        <GChart type="ColumnChart" :options="histoOptions" 
                            :data="getChartData(r.num_impiegati_sesso, 'gender', 'count')">
                        </GChart>
                    </b-tab>
                </b-tabs>




                <h3>{{ r.code }} - Num Impiegati per decade di nascita</h3>
                <b-tabs content-class="mt-3">
                    <b-tab title="Tabella" active>
                        <table class="table table-striped">
                            <thead>
                                <th width="30%">Età</th>
                                <th>Conteggio</th>
                            </thead>
                            <tbody>
                                <tr v-for="n in r.num_impiegati_anno" :key="n.decade">
                                    <td>
                                        <b>{{ n.decade }}</b>
                                    </td>
                                    <td>
                                        {{ n.count }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-tab>

                    <b-tab title="Torta">
                        <GChart type="PieChart" :options="pieOptions"
                            :data="getChartData(r.num_impiegati_anno, 'decade', 'count')">
                        </GChart>
                    </b-tab>

                    <b-tab title="Istogramma">
                        <GChart type="ColumnChart" :options="histoOptions" 
                            :data="getChartData(r.num_impiegati_anno, 'decade', 'count')">
                        </GChart>
                    </b-tab>
                </b-tabs>





                <h3>{{ r.code }} - Num Impiegati per città</h3>
                <table class="table table-striped">
                    <thead>
                        <th width="30%">Città</th>
                        <th>Conteggio</th>
                        <th>Distanza in linea d'aria (km)</th>
                    </thead>
                    <tbody>
                        <tr v-for="n in r.num_impiegati_citta" :key="n.city">
                            <td>
                                <b>{{ n.city }}</b>
                            </td>
                            <td>
                                {{ n.count }}
                            </td>
                            <td>{{  n.distance }}</td>
                        </tr>
                    </tbody>
                </table>
                
                <p>
                <b>Distanza Media Pesata (escluso il percentile del 10% superiore)</b>: {{ r.distanza_media_pesata }} km
                </p>


                <h3>{{ r.code }} - Num Impiegati per turno</h3>
                <table class="table table-striped">
                    <thead>
                        <th width="30%">Turno</th>
                        <th>Conteggio</th>
                    </thead>
                    <tbody>
                        <tr v-for="n in r.num_impiegati_orario" :key="n.orario">
                            <td>
                                <b>{{ n.orario }}</b>
                            </td>
                            <td>
                                {{ n.count }}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h3>{{ r.code }} - Num Impiegati per turno e città</h3>
                <table class="table table-striped">
                    <thead>
                        <th width="30%">Orario</th>
                        <th width="30%">Città</th>
                        <th>Conteggio</th>
                    </thead>
                    <tbody>                        
                        <tr v-for="n in r.num_impiegati_orario_citta" :key="n.orario + n.origin.city">
                            <td>
                                <b>{{ n.orario }}</b>
                            </td>
                            <td>
                                {{ n.origin.city }}
                            </td>
                            <td>
                                {{ n.count }}
                            </td>
                        </tr>                        
                    </tbody>
                </table>


            </div>

        </b-overlay>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import { GChart } from "vue-google-charts";

export default {
    name: "EmployeesStats",
    mixins: [Util],
    data() {
        return {
            stats: [],
            company_id: null,
            isBusy: true,
            hist: null,
            pie: null,
            year: null,
            histoOptions: {
				title: null,
				width:  600,
				height: 400,
				fontName: "Sofia Sans",
				showLabel: true,
				// fontSize: 25,
				vAxis: {
					title: "",
				},
				legend: {
					position: "right",
				},
				chartArea: {
					left: 50,
					right: 200
				},
			},
            pieOptions: {
                title: null,
                fontName: "Sofia Sans",
                titleTextStyle: {
                    bold: false,
                },
                pieHole: 0.35,
                width: 1300,
                height: 700,
                donut: true,
                showLabel: true,
                chartPadding: 0,
                labelOffset: 20,
                labelDirection: "explode",
                legend: { position: "right", alignment: "center" },
                chartArea: {
                    left: 40,
                    right: 550
                },
            },
        }
    },
    components: {
        GChart,
    },
    async created() {
        this.company_id = this.$route.params.company_id;
        this.isBusy = true;
        let y = this.getYear();        
        this.stats = await UserService.getEmployeesStats(this.company_id, y);
        this.isBusy = false;
    },
    methods: {
        getChartData(element, l, s) {
            let tab = [
                [l, s],
            ];
            let v = 0;
            element.forEach(e => {
                if (isNaN(e[s])) {
                    v = 0;
                } else {
                    v = e[s];
                }
                if (e[l] == null) {
                    e[l] = "-";
                }
                tab.push([e[l].toString(), v]);
            });

            //console.log("tab",tab);
            return tab;
        }
    },
}
</script>