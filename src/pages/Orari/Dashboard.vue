<template>
    <div>
        <!--Stats cards-->
        <div class="row">
            <div class="col-md-12">
                <table class="table table-striped">
                    <thead>
                        <th>Provincia</th>
                        <th>Totale Sedi</th>
                        <th>Sedi che hanno compilato (IFP)</th>
                        <th>Sedi che non hanno compilato (IFP)</th>
                    </thead>
                    <tbody>
                        <tr v-for="s in sedi" :key="s.province">
                            <td>{{ s.province }}</td>
                            <td>{{ s.sedi }} ( {{ s.sedi - s.no_ifp }} <b-badge>ifp</b-badge> )</td>
                            <td>{{ compilati(s.province).sedi - 1 }} ( {{ compilati(s.province).sedi - compilati(s.province).no_ifp }} <b-badge>ifp</b-badge> )</td>
                            <td>
                                {{ s.sedi - compilati(s.province).sedi }} ( {{ s.sedi - s.no_ifp - (compilati(s.province).sedi - compilati(s.province).no_ifp) }}
                                <b-badge>ifp</b-badge> )
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <b-button variant="primary" :disabled="btnloading" @click.prevent="download(`timetables/statsXls.xls`)">
                    <span v-if="btnloading">
                        <b-spinner small type="grow"></b-spinner>
                        Loading...
                    </span>
                    <span v-else> <i class="fa fa-file-excel-o" aria-hidden="true"></i> Esporta XLS </span>
                </b-button>
                <h2>Sedi che non hanno caricato orari</h2>
                <ul>
                    <li v-for="s in sedi_no" :key="s.id">
                        <a :href="`mailto:${s.company.email}`">{{ s.company.Name }}</a>
                        - {{ s.name }} ({{ s.City }})
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import UserService from "@/services/user.service";

export default {
	components: {},
	/**
     * Chart data used to render stats, charts. Should be replaced with server data
     */
	data() {
		return {
			orari: null,
			sedi: null,
			scuole: null,
			sedi_no: [],
			sedi_si: [],
			btnloading: false,
		};
	},
	methods: {
		compilati(province) {
			let s = this.sedi_si.find((x) => x.province == province);
			if (s === undefined) {
				return {
					sedi: 0,
					no_ifp: 0,
				};
			}
			return s;
		},
		nonCompilati(province) {
			return this.sedi_no.find((x) => x.province == province);
		},
		download($url) {
			this.btnloading = true;
			UserService.download($url).then(() => {
				this.btnloading = false;
			});
		},
	},
	async mounted() {
		let r = "";
		r = await UserService.statsTimeTables();
		this.orari = r.data.orari;
		this.sedi = r.data.sedi;
		this.scuole = r.data.scuole;
		this.sedi_no = r.data.sedi_no;
		this.sedi_si = r.data.sedi_si;
	},
};
</script>

<style></style>
