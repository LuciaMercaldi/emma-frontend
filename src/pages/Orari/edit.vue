<template>
    <div>
        <div class="row">
            <b-col md="3">
                <h5>
                    {{ timetable.office.company.name }} <br /><span class="small">{{ timetable.office.name }}</span>
                </h5>
                <span class="small">{{ timetable.office.address }} - {{ timetable.office.city }} ({{ timetable.office.province }})</span>
            </b-col>
            <b-col md="2">
                <b-form-group label="Tipo Orario">
                    <b-form-radio-group id="checkbox-group-2" v-model="timetable.type" :options="scheduleTypes"></b-form-radio-group>
                </b-form-group>
            </b-col>
            <b-col md="2">
                <b-form-group label="In vigore dal">
                    <b-form-datepicker
                        :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                        locale="it"
                        v-model="timetable.valid_from"
                        required></b-form-datepicker>
                </b-form-group>
            </b-col>
            <b-col md="2">
                <b-form-group label="Agenzia Mobilità Piemontese">
                    <b-form-checkbox id="checkbox-approved" v-model="timetable.approved" :value="true" :unchecked-value="false" disabled> Visto </b-form-checkbox>
                </b-form-group>
            </b-col>
        </div>

        <div class="row">
            <b-col cols="12">
                <b-form-group label="Note">
                    <b-textarea rows="3" v-model="timetable.note" placeholder="Inserisci una nota..."></b-textarea>
                </b-form-group>
                <b-button variant="success" @click="submit()" class="float-right">Salva</b-button>
            </b-col>
        </div>

        <div class="row">
            <b-col cols="12">
                <b>Totale Entrati</b>: {{ sumEntrati }} - <b>Totale Usciti</b>: {{ sumUsciti }}
                <b-alert :show="sumEntrati - sumUsciti != 0" variant="danger">attenzione il numero di studenti entrati è diverso da quelli usciti</b-alert>
            </b-col>
        </div>

        <div class="row mt-3">
            <b-col cols="12">
                <card :title="tab_in.title" :subTitle="tab_in.subTitle">
                    <b-button size="sm" variant="success" @click="mostraAdd(tab_in)">
                        <i class="fa fa-plus-circle" aria-hidden="true"></i>
                        Aggiungi fascia oraria
                    </b-button>
                    <b-table :items="tab_in.data" :fields="tab_in.columns" small striped responsive class="mt-1" ref="tabin">
                        <template v-slot:head(giorno)="data">
                            {{ data.label.toUpperCase() }}
                        </template>
                        <template v-slot:head()="data">
                            <span class="text-nowrap">
                                {{ data.label }}&nbsp;<i
                                    class="fa fa-pencil small text-muted"
                                    aria-hidden="true"
                                    @click="mostraEdit(data.label, tab_in)"
                                    v-b-tooltip.hover
                                    title="Modifica questo orario"></i>
                            </span>
                        </template>
                        <template v-slot:[getDynamicCell(col.key)]="data" v-for="col in tab_in.columns">
                            <b-input-group size="sm" :key="col.key">
                                <b-form-input
                                    size="sm"
                                    v-model="data.item[col.key]"
                                    v-b-tooltip.hover.right
                                    title="Inserisci il numero di persone che entrano in questo orario"></b-form-input>
                                <b-input-group-append class="input-group-addon" @click="copyDown(col.key, data.item[col.key], 'tabin', data.item[GIORNOCOL])">
                                    <i class="fa fa-arrow-down small text-muted" aria-hidden="true" v-b-tooltip.hover title="Copia questo valore nei giorni successivi"></i>
                                </b-input-group-append>
                            </b-input-group>
                        </template>
                    </b-table>
                </card>
            </b-col>
        </div>

        <div class="row mt-3">
            <b-col cols="12">
                <card :title="tab_out.title" :subTitle="tab_out.subTitle">
                    <b-button size="sm" variant="success" @click="mostraAdd(tab_out)">
                        <i class="fa fa-plus-circle" aria-hidden="true"></i>
                        Aggiungi fascia oraria
                    </b-button>
                    <b-table striped hover :items="tab_out.data" :fields="tab_out.columns" responsive small class="mt-1" ref="tabout">
                        <template v-slot:head(giorno)="data">
                            {{ data.label.toUpperCase() }}
                        </template>
                        <template v-slot:head()="data">
                            <span class="text-nowrap"> {{ data.label }}&nbsp;<i class="fa fa-pencil" aria-hidden="true" @click="mostraEdit(data.label, tab_out)"></i> </span>
                        </template>
                        <template v-slot:[getDynamicCell(col.key)]="data" v-for="col in tab_out.columns">
                            <b-input-group size="sm" :key="col.key">
                                <b-form-input
                                    size="sm"
                                    v-model="data.item[col.key]"
                                    v-b-tooltip.hover
                                    title="Inserisci il numero di persone che escono in questo orario"></b-form-input>
                                <b-input-group-append class="input-group-addon" @click="copyDown(col.key, data.item[col.key], 'tabout', data.item[GIORNOCOL])">
                                    <i class="fa fa-arrow-down" aria-hidden="true"></i>
                                </b-input-group-append>
                            </b-input-group>
                        </template>
                    </b-table>
                </card>
            </b-col>

            <b-modal id="modal-orario" title="Modifica Fascia Oraria" @ok="timeColumnChange()">
                <h5>Fascia Oraria Precedente: {{ editTime }}</h5>
                <h5>Indica la nuova Fascia Oraria</h5>
                <b-time v-model="newTime" locale="it"></b-time>
            </b-modal>
            <b-modal id="modal-aggiungi-orario" title="Aggiungi Fascia Oraria" @ok="timeColumnAdd()">
                <h5>Indica la nuova Fascia Oraria</h5>
                <b-time v-model="newTime" locale="it"></b-time>
            </b-modal>
            <b-modal id="modal-help" title="Benvenuti" ok-only>
                <h5><i class="fa fa-arrow-right" aria-hidden="true"></i> Fasce orarie proposte</h5>
                <p>Questa pagina presenta un modello di orario, con alcune proposte di fasce orarie.</p>

                <h5><i class="fa fa-arrow-right" aria-hidden="true"></i> Modifica fasce orarie</h5>
                <p>
                    Potete modificare le fasce orarie facendo click sulla matita vicino all'orario.<br />
                    <span class="text-danger">es: 08:50 <i class="fa fa-pencil small"></i></span>
                </p>

                <h5><i class="fa fa-arrow-right" aria-hidden="true"></i> Aggiunta fasce orarie</h5>
                <p>
                    Se non bastassero le fasce orarie proposte potete aggiungerne con il pulsante verde
                    <span class="text-success"><i class="fa fa-plus-circle" aria-hidden="true"></i> Aggiungi fascia oraria</span>
                </p>
                <h5><i class="fa fa-arrow-right" aria-hidden="true"></i> Eliminazione e Ordinamento Automatico</h5>
                <p>Le fasce orarie <b>vuote</b> saranno eliminate dopo il salvataggio, e poi saranno mostrate in ordine cronologico</p>
            </b-modal>
        </div>

        <div class="row">
            <b-col cols="9">
                <b-alert :show="sumEntrati - sumUsciti != 0" variant="danger">attenzione il numero di studenti entrati è diverso da quelli usciti</b-alert>
            </b-col>
            <b-col cols="3">
                <b-button variant="success" @click="submit()" class="float-right">Salva</b-button>
            </b-col>
        </div>
    </div>
</template>
<script>
/* const tableData = [
    {
        giorno: "Lun",
        h0750: 200,
        h0800: 40,
        h0810: 210,
        h0820: 100,
    },
    {
        giorno: "Mar",
        h0750: 200,
        h0800: 200,
        h0810: 210,
        h0820: 0,
    },
    {
        giorno: "Mer",
        h0750: 200,
        h0800: 200,
        h0810: 210,
        h0820: 0,
    },
    {
        giorno: "Gio",
        h0750: 200,
        h0800: 200,
        h0810: 210,
        h0820: 0,
    },
    {
        giorno: "Ven",
        h0750: 200,
        h0800: 200,
        h0810: 210,
        h0820: 0,
    },
    {
        giorno: "Sab",
        h0750: 200,
        h0800: 200,
        h0810: 210,
        h0820: 0,
        h1230: 50,
    },
]; */
const INTERVAL = 10;
const FROM_HOUR_IN = { hour: 7, minute: 20 };
const TO_HOUR_IN = { hour: 9, minute: 0 };
const FROM_HOUR_OUT = { hour: 12, minute: 30 };
const TO_HOUR_OUT = { hour: 14, minute: 30 };
const GIORNOCOL = "giorno";
//const GIORNI = ["", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

import { DateTime } from "luxon";
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import Orari from "@/mixing/orari";

export default {
	components: {},
	mixins: [Util, Orari],

	data() {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const minDate = new Date(today);
		let maxDate = new Date(today);
		maxDate.setMonth(maxDate.getMonth() + 2);

		return {
			tab_in: {
				title: "Ingresso",
				subTitle: "Indicare il numero di studenti che entrano in ogni fascia oraria",
				columns: null,
				data: null,
			},
			tab_out: {
				title: "Uscita",
				subTitle: "Indicare il numero di studenti che escono in ogni fascia oraria",
				columns: null,
				data: null,
			},
			timetable: {
				note: "",
				approved: 0,
				office: {
					id: this.office_id,
					company: {},
				},
				user_id: null,
				valid_from: today,
			},
			newTime: null,
			editTime: false,
			editTab: null,
			showEdit: false,
			scheduleTypes: ["provvisorio", "definitivo"],
			minDate: minDate,
			maxDate: maxDate,
			office_id: null,
			today: today,
			timetable_id: null,
			user: null,
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

		getDynamicCell(key) {
			return `cell(${key})`;
		},
		copyDown(col, val, tabref, day) {
			//Copia un valore in tutte le celle successive dello stesso giorno
			let start = false;
			let tab = this.$refs[tabref].items;
			tab.forEach(function (row, index) {
				if (row[GIORNOCOL] == day) {
					start = true;
				}
				if (start) {
					tab[index][col] = val;
				}
			});
			this.$refs[tabref].refresh();
		},
		mostraEdit(col, tab) {
			this.editTime = col;
			this.editTab = tab;
			this.newTime = col;
			this.$bvModal.show("modal-orario");
		},
		mostraAdd(tab) {
			this.editTab = tab;
			this.$bvModal.show("modal-aggiungi-orario");
		},
		replaceTimeColumns(col, oldTime, newTime) {
			//Cambio la colonna con la fascia oraria attuale e la sostituisco con la nuova
			// https://stackoverflow.com/a/50101979/3813117
			delete Object.assign(col, { [newTime]: col[oldTime] })[oldTime];
			return col;
		},
		timeColumnChange() {
			//Cancello tutti i timeslot per il timetable_id attuale sul db
			//Modifico le colonne di editTab
			//Genero la tabella vuota con le nuove colonne
			//Genero la tabella vuota con i nuovi valori

			let self = this;
			////console.log(this.editTime);
			////console.log(this.newTime);

			let newTime = DateTime.fromISO(this.newTime);
			let newTimeSlot = self.getTimeSlotFromTime(newTime);
			let newTimeLabel = self.getLabelFromTime(newTime);
			let editTimeSlot = this.getTimeSlotFromTime(DateTime.fromISO(this.editTime));
			this.editTab.columns.map((x) => {
				if (x.key == editTimeSlot) {
					////console.log(x.key);
					x.key = newTimeSlot;
					x.label = newTimeLabel;
				}
				return x;
			});

			this.editTab.data.forEach(function (row) {
				self.replaceTimeColumns(row, editTimeSlot, newTimeSlot);
			});

			////console.log(this.editTab);
		},
		timeColumnAdd() {
			//Aggiunge una fascia oraria all'orario
			let newTime = DateTime.fromISO(this.newTime);
			let newTimeSlot = this.getTimeSlotFromTime(newTime);
			let newTimeLabel = this.getLabelFromTime(newTime);
			this.editTab.columns.push({
				key: newTimeSlot,
				label: newTimeLabel,
			});
		},
		submit() {
			//Mini validazione sul campo inizio validità
			if (this.timetable.valid_from == null) {
				alert("Per favore indicare l'inizio validità");
				return;
			}

			UserService.saveTimeTable(this.timetable_id, this.tab_in.data, this.tab_out.data, this.timetable).then(
				(response) => {
					//La risposta dell'ADD è l'ID del timetable
					this.timetable_id = response.data.timetable_id;
					if (this.timetable_id !== undefined && this.timetable_id !== this.$route.params.timetable_id) {
						//Aggiorno l'url per comprendere anche il timetable (così faccio edit invece di add)
						this.$router
							.replace({
								path: `/orari/edit/${this.office_id}/${this.timetable_id}`,
							})
							.catch(() => {});
					}
				},
				(error) => {
					this.showError(error);
				}
			);

			this.$bvModal
				.msgBoxConfirm("L'orario è stato salvato, vuoi inviare ora una notifica all'Agenzia per la Mobilità Piemontese?", {
					title: "Invia notifica?",
					size: "sm",
					buttonSize: "sm",
					okVariant: "danger",
					okTitle: "INVIA NOTIFICA",
					cancelTitle: "NON ORA",
					footerClass: "p-2",
					hideHeaderClose: false,
					centered: true,
				})
				.then((value) => {
					////console.log(value);
					if (value) {
						//INVIA NOTIFICA TRAMITE BACKEND
						UserService.notifyTimeTable(this.timetable_id);
						//TODO: Valutare se fare redirect su index
					}
				})
				.catch((err) => {
					// An error occurred
					//console.log(err);
				});
		},
	},
	computed: {
		getTimeRangeIn: function () {
			return this.generateColumns(FROM_HOUR_IN, TO_HOUR_IN);
		},
		getTimeRangeOut: function () {
			return this.generateColumns(FROM_HOUR_OUT, TO_HOUR_OUT);
		},
		sumEntrati() {
			let s = 0;
			for (let g in this.tab_in.data) {
				for (let h in this.tab_in.data[g]) {
					if (parseInt(this.tab_in.data[g][h])) {
						s += parseInt(this.tab_in.data[g][h]);
					}
				}
			}
			return s;
		},
		sumUsciti() {
			let s = 0;
			for (let g in this.tab_out.data) {
				for (let h in this.tab_out.data[g]) {
					if (parseInt(this.tab_out.data[g][h])) {
						s += parseInt(this.tab_out.data[g][h]);
					}
				}
			}
			return s;
		},
	},
	created: function () {
		this.user = this.$cookies.get("user");
		this.timetable.user_id = this.user.id;

		if (this.timetable_id == undefined) {
			this.$bvModal.show("modal-help");
		}
		this.createTimeSlots();
	},
	mounted: function () {},
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
