const emissions = {
	a: {
		gg: 220,
		riduzione_utenti_auto: 1, //utenti/gg

		riduzione_km_auto: 10, //Stima della percorrenza media giornaliera evitata da un’autovettura con la realizzazione dell’intervento
		utenti_auto: 1.2, //occupazione
		fc_auto: 8.69,
		feCO2_auto: 163.0846,
		feCO_auto: 0.7853,
		feNOx_auto: 0.4256,
		fePM10_auto: 0.0297,
		fePM2_5_auto: 0.0241, //const g/km
	},
	b: {
		gg: 220,
		ut: 1,
		riduzione_km_auto: 25,
		noleggi_gg: 1,

		km_noleggio: 25,
		fc_auto_sh: 8.69,
		feCO2_auto_sh: 163.0846,
		feCO_auto_sh: 0.7853,
		feNOx_auto_sh: 0.4256,
		fePM10_auto_sh: 0.0297,
	},
	c: {
		gg: 200,
		km_da_sostituire: 10,
		km_nuovi: 10,
		fc_auto_nuovi: 5,

		feCO2_auto_nuovi: 129,
		feCO_auto_nuovi: 0.5853,
		feNOx_auto_nuovi: 0.3256,
		fePM10_auto_nuovi: 0.0097,
	},
	d: {
		gg: 220,
		az_nr_dipendenti: 100,
		az_distanza_spostamenti: 5,
		az_spostamenti_auto: 70,
	},
};

export default emissions;
