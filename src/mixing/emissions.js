export default {
	computed: {
		//*** BLOCCO A - PROPOSTA 1  */
		riduzione_km_gg_auto: function () {
			let r = (parseFloat(this.form.a.riduzione_utenti_auto) * parseFloat(this.form.a.riduzione_km_auto)) / this.form.a.utenti_auto;
			return r;
		},
		dC: function () {
			let r = (parseFloat(this.riduzione_km_gg_auto) * this.form.a.fc_auto * parseFloat(this.form.a.gg)) / 100;
			return r;
		},
		dCO2: function () {
			let r = (parseFloat(this.riduzione_km_gg_auto) * this.form.a.feCO2_auto * parseFloat(this.form.a.gg)) / 1000;
			return r;
		},
		dCO: function () {
			let r = (parseFloat(this.riduzione_km_gg_auto) * this.form.a.feCO_auto * parseFloat(this.form.a.gg)) / 1000;
			return r;
		},
		dNOx: function () {
			let r = (parseFloat(this.riduzione_km_gg_auto) * this.form.a.feNOx_auto * parseFloat(this.form.a.gg)) / 1000;
			return r;
		},
		dPM10: function () {
			let r = (parseFloat(this.riduzione_km_gg_auto) * this.form.a.fePM10_auto * parseFloat(this.form.a.gg)) / 1000;
			return r;
		},

		//*** BLOCCO B - PROPOSTA 2  */
		bTot_km_sh: function () {
			return parseFloat(this.form.b.noleggi_gg) * parseFloat(this.form.b.km_noleggio);
		},
		briduzione_km_gg_auto: function () {
			return parseFloat(this.form.b.ut * this.form.b.riduzione_km_auto);
		},
		bdC: function () {
			let r =
                (parseFloat(this.briduzione_km_gg_auto) * this.form.a.fc_auto * parseFloat(this.form.b.gg)) / 100 -
                (this.bTot_km_sh * parseFloat(this.form.b.fc_auto_sh) * parseFloat(this.form.b.gg)) / 100;
			return r;
		},
		bdCO2: function () {
			let r =
                (parseFloat(this.briduzione_km_gg_auto) * this.form.a.feCO2_auto * parseFloat(this.form.b.gg)) / 1000 -
                (this.bTot_km_sh * parseFloat(this.form.b.feCO2_auto_sh) * parseFloat(this.form.b.gg)) / 1000;
			return r;
		},
		bdCO: function () {
			let r =
                (parseFloat(this.briduzione_km_gg_auto) * this.form.a.feCO_auto * parseFloat(this.form.b.gg)) / 1000 -
                (this.bTot_km_sh * parseFloat(this.form.b.feCO_auto_sh) * parseFloat(this.form.b.gg)) / 1000;
			return r;
		},
		bdNOx: function () {
			let r =
                (parseFloat(this.briduzione_km_gg_auto) * this.form.a.feNOx_auto * parseFloat(this.form.b.gg)) / 1000 -
                (this.bTot_km_sh * parseFloat(this.form.b.feNOx_auto_sh) * parseFloat(this.form.b.gg)) / 1000;
			return r;
		},
		bdPM10: function () {
			let r =
                (parseFloat(this.briduzione_km_gg_auto) * this.form.a.fePM10_auto * parseFloat(this.form.b.gg)) / 1000 -
                (this.bTot_km_sh * parseFloat(this.form.b.fePM10_auto_sh) * parseFloat(this.form.b.gg)) / 1000;
			return r;
		},

		//*** BLOCCO C - PROPOSTA 3  */
		cdC: function () {
			let r =
                (parseFloat(this.form.c.km_da_sostituire) * this.form.a.fc_auto * parseFloat(this.form.c.gg)) / 100 -
                (parseFloat(this.form.c.km_nuovi) * this.form.c.fc_auto_nuovi * parseFloat(this.form.c.gg)) / 100;
			return r;
		},
		cdCO2: function () {
			let r =
                (parseFloat(this.form.c.km_da_sostituire) * this.form.a.feCO2_auto * parseFloat(this.form.c.gg)) / 1000 -
                (parseFloat(this.form.c.km_nuovi) * this.form.c.feCO2_auto_nuovi * parseFloat(this.form.c.gg)) / 1000;
			return r;
		},
		cdCO: function () {
			let r =
                (parseFloat(this.form.c.km_da_sostituire) * this.form.a.feCO_auto * parseFloat(this.form.c.gg)) / 1000 -
                (parseFloat(this.form.c.km_nuovi) * this.form.c.feCO_auto_nuovi * parseFloat(this.form.c.gg)) / 1000;
			return r;
		},
		cdNOx: function () {
			let r =
                (parseFloat(this.form.c.km_da_sostituire) * this.form.a.feNOx_auto * parseFloat(this.form.c.gg)) / 1000 -
                (parseFloat(this.form.c.km_nuovi) * this.form.c.feNOx_auto_nuovi * parseFloat(this.form.c.gg)) / 1000;
			return r;
		},
		cdPM10: function () {
			let r =
                (parseFloat(this.form.c.km_da_sostituire) * this.form.a.fePM10_auto * parseFloat(this.form.c.gg)) / 1000 -
                (parseFloat(this.form.c.km_nuovi) * this.form.c.fePM10_auto_nuovi * parseFloat(this.form.c.gg)) / 1000;
			return r;
		},

		//*** BLOCCO 4 - Calcolo Emissioni Azienda o Scuola  */
		azC: function () {
			return this.azKm_annui * this.form.a.fc_auto * 0.01;
		},
		azCO: function () {
			return this.azKm_annui * this.form.a.feCO_auto * 0.001; //in verità divisione per 1000 per calcolare kg
		},
		azCO2: function () {
			return this.azKm_annui * this.form.a.feCO2_auto * 0.001; //in verità divisione per 1000 per calcolare kg
		},
		azNOx: function () {
			return this.azKm_annui * this.form.a.feNOx_auto * 0.001; //in verità divisione per 1000 per calcolare kg
		},
		azPM2_5: function () {
			return this.azKm_annui * this.form.a.fePM2_5_auto * 0.001; //in verità divisione per 1000 per calcolare kg
		},
		azPM10: function () {
			return this.azKm_annui * this.form.a.fePM10_auto * 0.001; //in verità divisione per 1000 per calcolare kg
		},
		azKm_annui: function () {
			return (
				this.form.d.az_nr_dipendenti *
                this.form.d.az_distanza_spostamenti *
                2 *
                this.form.d.az_spostamenti_auto *
                0.01 * //0.01 si tratta di divisione per 100 visto che viene inserita la % dei dipendenti che utilizzano l'auto
                this.form.d.gg //Giorni di lavoro all'anno
			);
		},
	},
};
