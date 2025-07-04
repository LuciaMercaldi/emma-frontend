import emissioniA from "@/models/emissioniA";
import emissioniB from "@/models/emissioniB";

const measures = [
	/**** Azioni */
	{
		id: 1,
		slug: "smart-working",
		pillar_id: 1,
		name: "Smart working",
		description: "Facilitare e consentire lo smart working, cioè dare la possibilità ai dipendenti di svolgere le attività di lavoro lontano dalla sede lavorativa, es. casa.",
		img: "measures/smart-working.jpg",
		target: "pascal",
		type: "1", //1 = misura, 2 = servizio
		labels: [
			{ key: "users", label: "Numero di smartworkers", field_type: "number" },
			{ key: "days", label: "Giorni di smartworking/anno", field_type: "number" },
			{ key: "distance", label: "Distanza casa-lavoro (km)", field_type: "number" },
			{ key: "costo_user", label: "Costo Aziendale per lavoratore (per anno)", field_type: "number" },
			{ key: "risparmio_user", label: "Risparmio per il lavoratore (per anno)", field_type: "number" },
		],
		indicator: (serie) => {
			return new emissioniA(
				serie.days, //giorni di attività
				serie.users, //numero utenti sottratti all'auto
				parseFloat(serie.distance) //riduzione km auto
			);
		},
	},
	{
		id: 2,
		slug: "riunioni-remoto",
		pillar_id: 1,
		name: "Riunioni da remoto",
		description:
            "I dipendenti possono effettuare riunioni da remoto con clienti oppure colleghi di sedi remote grazie a strumenti che permettono le chiamate in conferenza, condivisione di schermo, ecc.",
		target: "azienda",
		type: "1", //1 = misura, 2 = servizio
		labels: [
			{ key: "users", label: "Numero di utentei ch efanno riunioni", field_type: "number" },
			{ key: "days", label: "Ore di riunioni per anno", field_type: "number" },
			{ key: "distance", label: "Distanza Casa-Lavoro(km)", field_type: "number" },
			{ key: "salary", label: "Stipendio (K€/mese)", field_type: "number" },
		],
		indicator: (serie) => {
			return new emissioniB(
				serie.days, //giorni di attività
				serie.users, //numero utenti sottratti all'auto
				parseFloat(serie.distance),
				serie.salary,
				serie.days //riduzione km auto
			);
		},
	},
];

export default measures;
