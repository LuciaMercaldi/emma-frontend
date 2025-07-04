<template>
    <div>
        <div class="row">
            <div class="col-3">
                <h5>
                    {{ timetable.office.company.name }} <br /><span class="small">{{ timetable.office.name }}</span>
                </h5>
                <span class="small">{{ timetable.office.address }} - {{ timetable.office.city }} ({{ timetable.office.province }})</span>
            </div>
            <div class="col-2">Tipo Orario: {{ timetable.type }}</div>
            <div class="col-2">Valido dal: {{ timetable.valid_from }}</div>
            <b-form-group label="Approvazione Agenzia">
                <b-form-checkbox id="checkbox-approved" v-model="timetable.approved" :value="true" :unchecked-value="false"> Visto Agenzia Mobilità </b-form-checkbox>
            </b-form-group>
        </div>
        <div class="row">
            <div class="col-12">
                <b-form-group label="Note">
                    <b-textarea rows="3" v-model="timetable.note" placeholder="Inserisci una nota..."></b-textarea>
                </b-form-group>
                <b-button variant="success" @click="submit()" class="float-right">Salva</b-button>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-12">
                <card :title="tab_in.title" :subTitle="tab_in.subTitle">
                    <b-table striped hover :items="tab_in.data" :fields="tab_in.columns" responsive small>
                        <template v-slot:head(giorno)="data">
                            {{ data.label.toUpperCase() }}
                        </template>
                        <template v-slot:head()="data">
                            <span class="text-nowrap">
                                {{ data.label }}
                            </span>
                        </template>
                        <template v-slot:[getDynamicCell(col.key)]="data" v-for="col in tab_in.columns">
                            <span size="sm" :key="col.key">
                                {{ data.item[col.key] }}
                            </span>
                        </template>
                    </b-table>
                </card>

                <card :title="tab_out.title" :subTitle="tab_out.subTitle">
                    <b-table striped hover :items="tab_out.data" :fields="tab_out.columns" responsive small>
                        <template v-slot:head(giorno)="data">
                            {{ data.label.toUpperCase() }}
                        </template>
                        <template v-slot:head()="data">
                            <span class="text-nowrap">
                                {{ data.label }}
                            </span>
                        </template>
                        <template v-slot:[getDynamicCell(col.key)]="data" v-for="col in tab_out.columns">
                            <span size="sm" :key="col.key">
                                {{ data.item[col.key] }}
                            </span>
                        </template>
                    </b-table>
                </card>
            </div>

            <b-modal id="modal-orario" title="Modifica Fascia Oraria">
                <h5>Fascia Oraria Precedente: {{ editTime }}</h5>
                <h5>Indica la nuova Fascia Oraria</h5>
                <b-time v-model="newTime" locale="it"></b-time>
            </b-modal>
        </div>
    </div>
</template>
<script>
const INTERVAL = 10;
const GIORNI = ["", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const GIORNOCOL = "giorno";
const FROM_HOUR_IN = { hour: 7, minute: 20 };
const TO_HOUR_IN = { hour: 9, minute: 0 };
const FROM_HOUR_OUT = { hour: 12, minute: 30 };
const TO_HOUR_OUT = { hour: 14, minute: 30 };

import { DateTime } from "luxon";
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import Orari from "@/mixing/orari";

export default {
	components: {},
	mixins: [Util, Orari],
	data() {
		return {
			tab_in: {
				title: "Ingresso",
				subTitle: null,
				columns: null,
				data: null,
			},
			tab_out: {
				title: "Uscita",
				subTitle: null,
				columns: null,
				data: null,
			},
			newTime: null,
			editTime: false,
			showEdit: false,
			timetable: {
				note: "",
				approved: 0,
				office: {
					id: this.office_id,
					company: {},
				},
				user_id: null,
			},
		};
	},
	methods: {
		//Genera tutte le colonne in un certo range
		generateColumns(from, to) {
			let cols = [GIORNOCOL];
			let tFrom = DateTime.fromObject(from);
			let tTo = DateTime.fromObject(to);

			for (let t = tFrom; t <= tTo; t = t.plus({ minutes: INTERVAL })) {
				cols.push({
					key: this.getTimeSlotFromTime(t),
					label: this.getLabelFromTime(t),
				});
			}
			return cols;
		},
		getTimeSlotFromTime(t) {
			return "h" + t.toFormat("HHmm");
		},
		getLabelFromTime(t) {
			return t.toFormat("HH:mm");
		},
		generateEmptyTable(cols) {
			let items = [];

			for (let d = 1; d < 7; d++) {
				let item = { giorno: GIORNI[d] };

				cols.forEach(function (element) {
					item[element.key] = 0;
				}, cols);

				items.push(item);
			}
			return items;
		},
		getDynamicCell(key) {
			return `cell(${key})`;
		},
		copyDown(col) {
			alert("copio in giù tutta la colonna: " + col);
		},
		mostraEdit(col) {
			this.editTime = col;
			this.newTime = col;
			this.$bvModal.show("modal-orario");
		},
		timeColumnChange(ctx) {
			this.newTime = ctx.hour + ":" + ctx.minute;
		},
		submit() {
			UserService.saveTimeTable(this.timetable_id, null, null, this.timetable).then(
				() => {
					//console.log("Salvataggio OK");
				},
				(error) => {
					this.showError(error);
				}
			);
		},
	},
	computed: {
		getTimeRangeIn: function () {
			return this.generateColumns(FROM_HOUR_IN, TO_HOUR_IN);
		},
		getTimeRangeOut: function () {
			return this.generateColumns(FROM_HOUR_OUT, TO_HOUR_OUT);
		},
	},
	created: function () {
		let user = this.$cookies.get("user");
		this.user_id = user.id;
		this.createTimeSlots();
	},
};
</script>
<style scoped>
.b-time-header .form-control {
    background-color: silver;
}
.form-control {
    font-size: 11px;
    padding: 1em;
}
.input-group-sm > .form-control {
    font-size: 11px;
}
</style>
