import UserService from "@/services/user.service";
const GIORNOCOL = "giorno";
const GIORNI = ["", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

export default {
	data() {
		return {
			GIORNOCOL: GIORNOCOL,
			GIORNI: GIORNI,
		};
	},
	methods: {
		createTimeSlots() {
			this.office_id = this.$route.params.office_id;
			this.timetable_id = this.$route.params.timetable_id;
			const user = this.$cookies.get("user");

			//Preparo un oggetto segnaposto
			this.timetable = {
				office_id: this.office_id,
				office: {
					id: this.office_id,
					company: {
						name: "In fase di caricamento",
					},
				},
				user_id: user.id,
				valid_from: this.today,
			};

			UserService.getTimeTable(this.office_id, this.timetable_id).then(
				(response) => {
					if (response.data.timetable.length > 0) {
						this.timetable = response.data.timetable[0];
					} else {
						//Devo fare una chiamata in get per leggere la sede corrente this.office_id
						UserService.getOffice(this.office_id).then(
							(response) => (this.timetable.office = response.data.office),
							(error) => this.showError(error)
						);
					}
				},
				(error) => {
					this.showError(error);
				}
			);

			//Se la timetable è stata salvata almeno una volta cerco gli orari a db
			if (this.timetable_id > 0) {
				UserService.getTimeSlots(this.timetable_id).then(
					(response) => {
						this.tab_in.data = Object.values(response.data.timeslots_in);
						//Devo generare le colonne a partire dai dati
						this.tab_in.columns = this.getColumnsFromData(this.tab_in.data);

						this.tab_out.data = Object.values(response.data.timeslots_out);
						//Devo generare le colonne a partire dai dati
						this.tab_out.columns = this.getColumnsFromData(this.tab_out.data);
					},
					(error) => {
						this.showError(error);
					}
				);
			} else {
				//Se è la prima volta creo dei dati fittizi
				this.tab_in.columns = this.getTimeRangeIn;
				this.tab_in.data = this.generateEmptyTable(this.getTimeRangeIn);

				this.tab_out.columns = this.getTimeRangeOut;
				this.tab_out.data = this.generateEmptyTable(this.getTimeRangeOut);
			}

			//Un po' difficile da leggere: copia tutti gli elementi dell'array costante (dato che mi arriva dall'API, sparso)
			//all'interno della tab_in.data (array visualizzata nell'editor)
			/*         tableData.forEach(r => {
            for (let key in r) {
                //Ciclo sulle varie colonne dell'array (i vari orari 7:50, 8:10, etc)
                if (r[key] > 0) {
                    //Cerco la riga della nuova array che corrisponda al giorno su cui sto lavorando
                    let nuovaR = this.tab_in.data.find(x => x.giorno === r.giorno);
                    nuovaR[key] = r[key];
                }
            }
        });
       */
		},
		getColumnsFromData(tab) {
			let cols = [GIORNOCOL]; //Conterrà le colonne risultanti
			let self = this;
			//Legge la tabella dei dati e deduce le colonne
			tab.forEach(function (day) {
				//Ciclo su ogni elemento dell'oggetto riga
				for (const [key, value] of Object.entries(day)) {
					if (key != GIORNOCOL) {
						//Se la chiave non c'è nell'array delle colonne vuol dire che è una colonna nuova da aggiungere
						let index = cols.find((x) => {
							x.key == key;
						});

						//aggiungo questa condizione per prendere solo le colonne nuove con valori > 0
						//if (index === undefined) {
						if (index === undefined && value > 0) {
							// key è nel formato slot, devo convertirla in label
							let label = self.getLabelFromKey(key);
							cols.push({ key: key, label: label });
						}
					}
				}
			});

			return cols;
		},
		getTimeSlotFromTime(t) {
			return "h" + t.toFormat("HHmm");
		},
		getLabelFromTime(t) {
			return t.toFormat("HH:mm");
		},
		getLabelFromKey(k) {
			//TODO: Fare davvero h0720 --> 07:20
			return k.substring(1, 3) + ":" + k.substring(3, 5);
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
	},
	computed: {},
};
