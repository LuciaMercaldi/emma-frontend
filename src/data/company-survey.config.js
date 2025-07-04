// ===========================================
// =========  company survey options =========
// ===========================================
export const l_rapporto_lavorativo = ["indeterminato", "determinato", "consulente"];
/*export const l_inquadramento_lavorativo = [
    { value: 0, text: "impiegato" },
    { value: 1, text: "quadro" },
    { value: 2, text: "dirigente" },
    { value: 10, text: "altro" },
];*/
export const l_inquadramento_lavorativo = ["impiegato", "quadro", "dirigente", "altro"];
export const l_mm_orario_lavoro = ["part time", "full time"];
export const l_mm_sesso = ["F", "M"];
export const l_mm_eta = ["meno di 30 anni", "30-40", "41-50", "51-60", "oltre 60"];
export const l_sede_filiale = ["sede", "filiale"];
/*export const l_distribuzione_lavoro = [
    { value: 0, text: "lun-ven" },
    { value: 1, text: "lun-sab" },
    { value: 2, text: "lun-domen" },
    { value: 3, text: "giorni alterni" },
    { value: 10, text: "altro" },
];*/
export const l_distribuzione_lavoro = ["lun-ven", "lun-sab", "lun-domen", "giorni alterni", "altro"];
/*export const l_si_no = [
    { value: 1, text: "sì" },
    { value: 0, text: "no" },
];*/
export const l_si_no = ["sì", "no"];
export const l_si_no_altro = ["sì", "no", "se ne prevede la realizzazione"];
export const l_lavoro_flessibile = ["sì, per entrambe (TL e SW)", "sì, solo TL", "sì, solo SW", "no"];
export const l_tipo_accordo = ["sperimentale", "definitivo"];
/*export const l_localizzazione = [
    { value: 0, text: "centro" },
    { value: 1, text: "periferia" },
    { value: 2, text: "zona industriale" },
    { value: 10, text: "altro" },
];*/
export const l_localizzazione = ["centro", "periferia", "zona industriale", "altro"];
/*export const l_bike_sharing = [
    { value: 0, text: "free floating (le biciclette possono essere prelevate/rilasciate ovunque)" },
    { value: 1, text: "station based (le biciclette possono essere prelevate/rilasciate in apposite stazioni/colonnine)" },
    { value: 3, text: "entrambe" },
];*/
export const l_bike_sharing = ["free floating (le biciclette possono essere prelevate/rilasciate ovunque)", "station based (le biciclette possono essere prelevate/rilasciate in apposite stazioni/colonnine)", "entrambe"];
/*export const l_car_sharing = [
    { value: 0, text: "free floating (le auto possono essere prelevate/rilasciate ovunque)" },
    { value: 1, text: "station based (le auto possono essere prelevate/rilasciate in apposite stazioni/colonnine)" },
    { value: 2, text: "entrambe" },
];*/
export const l_car_sharing = ["free floating (le auto possono essere prelevate/rilasciate ovunque)", "station based (le auto possono essere prelevate/rilasciate in apposite stazioni/colonnine)", "entrambe"];
export const l_tragitto = ["sede -> filiali", "filiali-> filiali", "casa-> lavoro"];

/*export const l_equipaggi = [
    { value: 0, text: "app" },
    { value: 1, text: "spontaneamente" },
    { value: 2, text: "gestione interna (file condiviso)" },
];*/
export const l_equipaggi = ["app", "spontaneamente", "gestione interna (file condiviso)"];

/*export const l_comunicazione_strumenti = [
    { value: 0, text: "mail interna" },
    { value: 1, text: "intranet" },
    { value: 2, text: "rivista" },
    { value: 3, text: "bollettino" },
    { value: 4, text: "newsletter aziendale" },
    { value: 10, text: "altro" },
];*/
export const l_comunicazione_strumenti = ["mail interna", "intranet", "rivista", "bollettino", "newsletter aziendale", "altro"];
export const l_comunicazione_frequenza = ["mensile", "trimenstrale", "semestrale", "annuale"];
export const l_inquadramento_lavorativo_sc = ["personale ata", "insegnante", "dirigente"];
// ==================================================
// =========  END OF company survey options =========
// ==================================================

// =============================================================
// ====================== survey forms =========================
// =============================================================

const label_survey_form = {
	company_name: null,
	survey_date: null,
	box1: {
		accessible: 0,
		theft_prevention: 0,
		arrival_bike: 0,
		internal_bikes: 0,
		pool_bikes: 0,
		cycling_business_trips: 0,
		bike_ride: 0,
		internal_cycling: 0,
		cycling_infrast: 0,
	},

	box2: {
		azessible: 0,
		infrastructure_walk: 0,
		arrival_walk: 0,
	},

	box3: {
		bus_accessible: 0,
		bus_info: 0,
		co_financing: 0,
		bus_facilities: 0,
		lobby: 0,
		bus_infrastructure: 0,
		shuttle_bus: 0,
		vanpooling: 0,
	},

	box4: {
		matching_service: 0,
		parking_carpooling: 0,
		carpooling_incentives: 0,
	},

	box5: {
		carsharing: 0,
		incentives_carsharing: 0,
		carsharing_location: 0,
	},

	box6: {
		accessibility: 0,
		business_trips: 0,
		efficient_use_work: 0,
		sensible_car_use: 0,
		park_ride: 0,
		parking_fee: 0,
		parking_management: 0,
		car_free: 0,
		access_management: 0,
		vhl_restrictions: 0,
		clean_vhls: 0,
		alternative_fuels: 0,
		eco_driving: 0,
		its: 0,
		route_planning: 0,
		traffic_info: 0,
	},

	box7: {
		accessibility_signs: 0,
		infrastructure_mobility: 0,
	},

	box8: {
		financial_incentives: 0,
		taxi_service: 0,
		trip_advice: 0,
		teleworking: 0,
		mobility_office: 0,
		land_use: 0,
		e_shopping: 0,
		general_services: 0,
	},
};

export const company_survey_form_data = {
	generale: {
		azienda: {
			nome: null,
			indirizzo: null,
			codice_ateco: null,
			comune: null,
			cap: null,
			nr_sedi: null,
			nr_dipendenti: null,
			nr_impiegati_operai: null,
			nr_quadri_dirigenti: null,
			rapporto_lavorativo: null,
			inquadramento_lavorativo: null,
			inquadramento_lavorativo_altro: null,
			mm_orario_lavoro: null,
			mm_eta: null,
			mm_luogo_servizio: null,
		},
		scuola: {
			nome: null,
			indirizzo: null,
			codice_ateco: null,
			comune: null,
			cap: null,
			nr_sedi: null,
			nr_dipendenti: null,
			nr_impiegati_operai: null,
			nr_quadri_dirigenti: null,
			nr_studenti: null,
			rapporto_lavorativo: null,
			inquadramento_lavorativo: null,
			mm_orario_lavoro: null,
			mm_eta: null,
			mm_luogo_servizio: null,
		},
	},
	label: {
		azienda: {
			...label_survey_form,
		},
		scuola: {
			...label_survey_form,
		},
	},
	sede: {
		azienda: {
			ul_sede_filiale: null,
			ul_comune: null,
			ul_cap: null,
			ul_indirizzo: null,
			ul_nr_dipendenti: null,
			ul_dipendenti_full: null,
			ul_dipendenti_part: null,
			ul_dipendenti_flessibili: null,
			distribuzione_lavoro: null,
			distribuzione_lavoro_altro: null,
			turni_esistenti: null,
			nr_turni: null,
			turni: [
				{
					id: null,
					nome: null,
					orario_ingresso: null,
					orario_uscita: null,
					nr_dipendenti: null,
				},
			],

			orario_ingresso: null,
			orario_uscita: null,
			orario_flessibilita: null,
			orario_flessibilita_info: null,
			mensa: null,
			mensa_frequenza: null,
			lavoro_flessibile: null,
			tipo_accordo: null,
			gg_lavoro_flessibile: null,
			gg_SW: null,
			gg_TL: null,
			coworking: null,
			nr_coworking: null,
			localizzazione: null,
			localizzazione_altro: null,
			ztl: null,
			sosta: null,
			sosta_tariffazione: null,
			tpl: null,
			linee_fermate: [
				{
					id: null,
					linea_nome: null,
					linea_tipo: null,
					fermata_nome: null,
					fermata_distanza: null,
				},
			],

			bike_sharing: null,
			bike_sharing_tipo: null,
			bs_stazioni: [
				{
					id: null,
					nome: null,
					distanza: null,
				},
			],

			car_sharing: null,
			car_sharing_tipo: null,
			cs_stazioni: [
				{
					id: null,
					nome: null,
					distanza: null,
				},
			],

			moto_sharing: null,
			monopattini: null,
			trasporto_aziendale: null,
			nr_trasporto_aziendale: null,
			tragitto: null,
			km_percorsi: null,
			costo_annuale: null,
			costo_passeggero: null,
			az_sosta: null,
			az_sosta_auto_nr: null,
			az_sosta_auto_el_nr: null,
			az_sosta_pagamento: null,
			az_sosta_auto_costo: null,
			az_sosta_auto_el_costo: null,
			az_sosta_visitatori: null,
			az_sosta_visitatori_nr: null,
			az_sosta_bici: null,
			az_sosta_bici_nr: null,
			az_sosta_bici_el_nr: null,
			spogliatoi: null,
			az_sosta_moto: null,
			az_sosta_moto_nr: null,
			az_sosta_moto_el_nr: null,
			az_sosta_carpooling: null,
			az_sosta_carpooling_nr: null,
			carpooling: null,
			carpooling_nr: null,
			carpooling_contributo: null,
			carpooling_contributi: [
				{
					id: null,
					forma: null,
					importo: null,
				},
			],

			equipaggi: null,
			carpooling_app: null,
			az_veicoli: null,
			az_auto: null,
			az_auto_nr: null,
			az_auto_alimentazione: null,
			az_auto_contratto: null,
			az_auto_spostamento: null,
			az_auto_affidamento: null,
			az_moto: null,
			az_moto_nr: null,
			az_moto_alimentazione: null,
			az_moto_contratto: null,
			az_moto_spostamento: null,
			az_moto_affidamento: null,
			az_bici: null,
			az_bici_nr: null,
			az_bici_alimentazione: null,
			az_bici_contratto: null,
			az_bici_spostamento: null,
			az_bici_affidamento: null,
			az_monopattini: null,
			az_monopattini_nr: null,
			az_monopattini_alimentazione: null,
			az_monopattini_contratto: null,
			az_monopattini_spostamento: null,
			az_monopattini_affidamento: null,
			sharing: null,
			bike_sharing_abb: null,
			moto_sharing_abb: null,
			car_sharing_abb: null,
			monopattini_sharing_abb: null,
			budget_moma: null,
			budget_moma_quantita: null,
			contributo_tpl: null,
			contributo_tpl_perc: null,
			contributo_auto_green: null,
			contributo_sharing: null,
			convenzioni_sharing: null,
			convenzioni: [
				{
					id: null,
					nome: null,
					nr_persone: null,
				},
			],

			altri_incentivi: null,
			comunicazione_moma: null,
			comunicazione_strumenti: [],
			comunicazione_strumenti_altro: null,
			comunicazione_frequenza: null,
			bacheche: null,
			comunicazione_altro: null,
		},
		scuola: {
			ul_sede_filiale: null,
			ul_comune: null,
			ul_cap: null,
			ul_indirizzo: null,
			ul_nr_dipendenti: null,
			ul_nr_studenti: null,
			distribuzione_lavoro: null,
			orario_ingresso: null,
			orario_uscita: null,
			mensa: null,
			mensa_frequenza: null,
			localizzazione: null,
			localizzazione_altro: null,
			ztl: null,
			sosta: null,
			sosta_tariffazione: null,
			tpl: null,
			linee_fermate: [
				{
					id: null,
					linea_nome: null,
					linea_tipo: null,
					fermata_nome: null,
					fermata_distanza: null,
				},
			],

			bike_sharing: null,
			bike_sharing_tipo: null,
			bs_stazioni: [
				{
					id: null,
					nome: null,
					distanza: null,
				},
			],

			car_sharing: null,
			car_sharing_tipo: null,
			cs_stazioni: [
				{
					id: null,
					nome: null,
					distanza: null,
				},
			],

			moto_sharing: null,
			monopattini: null,
			trasporto_aziendale: null,
			nr_trasporto_aziendale: null,
			tragitto: null,
			km_percorsi: null,
			costo_annuale: null,
			costo_passeggero: null,
			az_sosta: null,
			az_sosta_auto_nr: null,
			az_sosta_auto_el_nr: null,
			az_sosta_pagamento: null,
			az_sosta_auto_costo: null,
			az_sosta_auto_el_costo: null,
			az_sosta_visitatori: null,
			az_sosta_visitatori_nr: null,
			az_sosta_bici: null,
			az_sosta_bici_nr: null,
			az_sosta_bici_el_nr: null,
			spogliatoi: null,
			az_sosta_moto: null,
			az_sosta_moto_nr: null,
			az_sosta_moto_el_nr: null,
			az_sosta_carpooling: null,
			az_sosta_carpooling_nr: null,
			carpooling: null,
			carpooling_nr: null,
			carpooling_contributo: null,
			carpooling_contributi: [
				{
					id: null,
					forma: null,
					importo: null,
				},
			],

			equipaggi: null,
			carpooling_app: null,
			az_veicoli: null,
			az_auto: null,
			az_auto_nr: null,
			az_auto_alimentazione: null,
			az_auto_contratto: null,
			az_auto_spostamento: null,
			az_auto_affidamento: null,
			az_moto: null,
			az_moto_nr: null,
			az_moto_alimentazione: null,
			az_moto_contratto: null,
			az_moto_spostamento: null,
			az_moto_affidamento: null,
			az_bici: null,
			az_bici_nr: null,
			az_bici_alimentazione: null,
			az_bici_contratto: null,
			az_bici_spostamento: null,
			az_bici_affidamento: null,
			az_monopattini: null,
			az_monopattini_nr: null,
			az_monopattini_alimentazione: null,
			az_monopattini_contratto: null,
			az_monopattini_spostamento: null,
			az_monopattini_affidamento: null,
			sharing: null,
			bike_sharing_abb: null,
			moto_sharing_abb: null,
			car_sharing_abb: null,
			monopattini_sharing_abb: null,
			budget_moma: null,
			budget_moma_quantita: null,
			contributo_tpl: null,
			contributo_tpl_perc: null,
			contributo_auto_green: null,
			contributo_sharing: null,
			convenzioni_sharing: null,
			convenzioni: [
				{
					id: null,
					nome: null,
					nr_persone: null,
				},
			],

			altri_incentivi: null,
			comunicazione_moma: null,
			comunicazione_strumenti: [],
			comunicazione_strumenti_altro: null,
			comunicazione_frequenza: null,
			bacheche: null,
			comunicazione_altro: null,
		},
	},
};
// ====================================================================
// ====================== END OF survey forms =========================
// ====================================================================
