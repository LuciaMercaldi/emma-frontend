<template>
    <div>
        <b-form @submit.prevent="">
            <b-form-row>
                <b-col cols="12" md="2">
                    <b-form-group label="Cerca">
                        <b-form-input placeholder="Istituto o Comune" name="q" v-model="q"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="1">
                    <b-form-group label="Provincia">
                        <b-form-select v-model="provincia" :options="province"></b-form-select>
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="3">
                    <b-form-group label="In vigore dal">
                        <b-form-datepicker name="from" v-model="from"></b-form-datepicker>
                    </b-form-group>
                </b-col>
                <b-col cols="12 mt-4" md="3">
                    <b-button variant="primary" @click.prevent="search()">Filtra</b-button>
                </b-col>
                <b-col cols="12 mt-4" md="3" class="float-right">
                    <b-button variant="primary" :disabled="btnloading" @click.prevent="download(`orariscuole/timeslots/export.xls?${composeQueystring}`)">
                        <span v-if="btnloading">
                            <b-spinner small type="grow"></b-spinner>
                            Loading...
                        </span>
                        <span v-else> <i class="fa fa-file-excel-o" aria-hidden="true"></i> Esporta XLS </span>
                    </b-button>
                    <a href="guida-orari-scuole.pdf" class="btn btn-outline-info float-right"><i class="fa fa-question-circle" aria-hidden="true"></i> Guida di Utilizzo</a>
                </b-col>
            </b-form-row>
        </b-form>

        <div class="row">
            <div class="col-12">
                <card :title="table1.title" :subTitle="table1.subTitle" class="mt-2">
                    <div slot="raw-content">
                        <b-table :items="table1.data" :fields="table1.columns" striped primary-key="id" responsive="sm" :busy="table1.loading">
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Loading...</strong>
                                </div>
                            </template>

                            <template v-slot:cell(name)="row">
                                {{ row.item.company.name }} - {{ row.item.extended_name }} {{ row.item.name }} {{ row.item.office_type_extra }}<br />
                                <small class="text-muted"> {{ row.item.office_code }} / {{ row.item.office_code_external }} - {{ row.item.address }}</small>
                            </template>

                            <template v-slot:cell(in_vigore)="row">
                                <ul class="list-unstyled">
                                    <li v-for="t in row.item.timetables" :key="t.id">
                                        <b-link class="action" title="visualizza" v-b-tooltip.hover :to="`/orari/view/${t.office_id}/${t.id}`">{{
                                            t.valid_from || "Visualizza"
                                        }}</b-link>
                                        <b-link class="action" :to="`/orari/edit/${t.office_id}/${t.id}`" v-if="canEditOrari">Modifica</b-link>
                                        <b-link class="action" @click.prevent="del_orario(t.id)" v-if="canEditOrari">Elimina</b-link>
                                    </li>
                                </ul>
                            </template>
                            <template v-slot:cell(azioni)="row">
                                <b-link
                                    class="btn btn-secondary btn-sm"
                                    :to="`/orari/edit/${row.item.id}`"
                                    title="Aggiungi un orario per questa sede"
                                    v-b-tooltip.hover
                                    size="sm"
                                    v-if="canEditOrari">Aggiungi
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                </b-link>
                            </template>
                        </b-table>
                    </div>
                </card>
            </div>
        </div>
    </div>
</template>
<script>
const tableColumns = [
	{ key: "province", sortable: true, label: "Provincia" },
	{ key: "city", sortable: true, label: "Comune" },
	{ key: "name", sortable: true, label: "Istituto" },
	{ key: "in_vigore", sortable: true, label: "In vigore dal" },
	"azioni",
];
import UserService from "@/services/user.service";
import Util from "@/mixing/util";

export default {
	name: "OrariIndex",
	components: {},
	mixins: [Util],
	data() {
		return {
			table1: {
				title: "Orari",
				columns: [...tableColumns],
				data: [],
				loading: false,
			},
			q: null,
			provincia: null,
			province: ["", "AT", "AL", "TO", "VC", "CN", "BI", "VB", "NO"].sort(),
			loading: false,
			btnloading: false,
			from: null,
		};
	},
	methods: {
		del_orario(id) {
			this.$bvModal.msgBoxConfirm("Vuoi davvero cancellare questo orario? " + id, {}).then((value) => {
				if (value) {
					UserService.deleteTimeTable(id).then(this.refreshSchools());
				}
			});
		},
		search() {
			this.$router.replace({ path: "orari", query: { q: this.q, provincia: this.provincia, from: this.from } });
			this.refreshSchools();
		},
		refreshSchools() {
			this.table1.loading = true;
			this.q = this.$route.query.q;
			this.provincia = this.$route.query.provincia;
			this.from = this.$route.query.from;
			UserService.getSchools(this.q, this.provincia, this.from).then(
				(response) => {
					this.table1.data = response.data.offices;
					this.table1.loading = false;
				},

				(error) => {
					this.showError(error);
					this.table1.loading = false;
				}
			);
		},
		download($url) {
			this.btnloading = true;
			UserService.download($url).then(() => {
				this.btnloading = false;
			});
		},
	},
	computed: {
		composeQueystring: function () {
			let queryString = "";
			if (this.provincia) {
				queryString += `&provincia=${this.provincia}`;
			}
			if (this.q) {
				queryString += `&q=${this.q}`;
			}
			if (this.from) {
				queryString += `&from=${this.from}`;
			}
			return queryString;
		},
	},
	mounted() {
		this.refreshSchools();
	},
};
</script>
<style>
.action {
    border: 1px solid silver;
    margin: 2px;
    padding: 2px;
    border-radius: 10%;
}
</style>
