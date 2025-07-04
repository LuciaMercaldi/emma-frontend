import DashboardLayout from "~theme/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Login from "@/pages/Login.vue";

const siteName = " | 5T Piattaforma Mobility Management";

const routes = [
	{
		path: "/",
		component: DashboardLayout,
		redirect: "/dashboard",
		children: [
			{
				path: "dashboard",
				name: "Cruscotto",
				component: pageComponent("Dashboard"),
				meta: { authorize: ["admin", "moma", "moma_area", "user"] },
			},
			{
				path: "users",
				name: "Utenti",
				component: pageComponent("Users/UserList"),
				meta: { authorize: ["admin", "moma", "moma_area"] },
			},
			{
				path: "employees",
				name: "Lavoratori",
				component: pageComponent("Employees/index"),
				meta: { authorize: ["admin", "moma", "moma_area"] },
			},
			{
				path: "employees/stats/:company_id",
				name: "Statistiche Lavoratori",
				component: pageComponent("Employees/stats"),
				meta: { authorize: ["admin", "moma", "moma_area"] },
			},
			{
				path: "users/add",
				name: "Aggiunta Utente",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Users/add"),
			},
			{
				path: "users/:email",
				name: "Filtered",
				component: pageComponent("Users/UserList"),
				meta: { authorize: ["admin", "moma", "moma_area"] },
			},
			{
				path: "users/edit/:user_id",
				name: "Modifica Utente",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Users/edit"),
			},
			{
				path: "pscl",
				name: "Piano Spostamenti Casa Lavoro",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Pscl"),
			},
			{
				path: "offices/savePscl/:office_id",
				name: "savePSCL",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Pscl"),
			},
			{
				path: "offices/getPscl/:office_id",
				name: "getPscl",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Pscl"),
			},
			{
				path: "mappa",
				name: "Mappa",
				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Maps"),
			},
			{
				path: "emissioni",
				name: "Emissioni",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Emissioni"),
			},
			
			{
				path: "questionari",
				name: "Elenco Questionari",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Questionari/index"),
			},
			{
				path: "questionari/answers/:survey_id/:user_id",
				name: "Dettaglio Risposta Utente",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Questionari/answers"),
			},
			{
				path: "questionari/delivery-stats/:survey_id",
				name: "Statistiche Invii Questionario",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Questionari/delivery_stats"),
			},
			{
				path: "questionari/users-list/:survey_id",
				name: "Elenco Risposte al questionario",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Questionari/users_list"),
			},
			{
				path: "questionari/edit/:survey_id/",
				name: "Modifica il questionario",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Questionari/edit"),
			},
			{
				path: "aziende",
				name: "Elenco Aziende e Sedi",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Companies/index"),
			},
			{
				path: "aziende/edit/:id?",
				name: "Aggiungi/Modifica Azienda",

				meta: { authorize: ["admin", "moma", "moma_area", "superiori"] },
				// lazy-loaded
				component: pageComponent("Companies/edit"),
			},
			{
				path: "analytics",
				name: "Analytics",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Analytics"),
			},
			{
				path: "offices/edit/:office_id",
				name: "Modifica Ufficio",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Offices/edit"),
			},
			{
				path: "offices/add/:company_id",
				name: "Aggiungi Ufficio",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Offices/add"),
			},
			{
				path: "offices/survey/:office_id",
				name: "Questionario Sede",

				meta: { authorize: ["admin", "moma", "moma_area"] },
				// lazy-loaded
				component: pageComponent("Offices/survey"),
			},
			{
				path: "profile",
				name: "Profilo Utente",

				meta: {
					title: "Profilo " + siteName,
				},
				// lazy-loaded
				component: pageComponent("Users/UserProfile"),
			},
			{
				path: "users/import",
				name: "Importa Utenti",

				meta: {
					authorize: ["admin", "moma", "moma_area"],
				},
				// lazy-loaded
				component: pageComponent("Users/Import"),
			},
			{
				path: "users/change-password/:token",
				name: "Cambia Password",

				meta: {},
				// lazy-loaded
				component: pageComponent("Users/ChangePassword"),
			},
			{
				path: "orari",
				name: "Orari Scuole",

				meta: { authorize: ["admin", "superiori","moma","moma_area"] },
				// lazy-loaded
				component: pageComponent("Orari/index"),
			},
			{
				path: "orari/edit/:office_id/:timetable_id?",
				name: "Modifica Orari",

				meta: { authorize: ["admin", "superiori"] },
				// lazy-loaded
				component: pageComponent("Orari/edit"),
			},
			{
				path: "orari/view/:office_id/:timetable_id",
				name: "Visualizza Orari",

				meta: { authorize: ["admin", "superiori"] },
				// lazy-loaded
				component: pageComponent("Orari/view"),
			},
			{
				path: "orari/export-one-line",
				name: "Esporta Orari",

				meta: { authorize: ["admin", "superiori"] },
				// lazy-loaded
				component: pageComponent("Orari/export-one-line"),
			},
			{
				path: "services/car-pooling",
				name: "Integrazione Servizio di Car Pooling",
				meta: { authorize: ["admin", "moma", "moma_area", "user"] },
				// lazy-loaded
				component: pageComponent("Services/CarPooling"),
			},
			{
				path: "cartografia",
				name: "Cartografia",
				meta: {},
				// lazy-loaded
				component: pageComponent("Cartografia"),
			},
			{
				path: "/pages/:slug",
				name: "",
				// pubblico, altrimenti non funziona!
				meta: {},
				// lazy-loaded
				component: pageComponent("Pages"),
			},
			// route for blocked users
			{
				path: "bloccato",
				name: "Bloccato",
				meta: {},
				component: pageComponent("Blocked"),
			},
			{
				path: "contatti",
				name: "Contatti",
				meta: {},
				component: pageComponent("Contacts"),
			},
		],
	},
	{
		path: "/login",
		name: "Login",
		component: Login,
		meta: {
			//authorize: []
		},
	},
	{
		path: "/privacy",
		name: "Privacy",
		component: pageComponent("Privacy"),
		meta: {
			//authorize: []
		},
	},
	{
		path: "/reset-password",
		name: "Reset Password",

		meta: {
			title: "Reset Password" + siteName,
		},
		// lazy-loaded
		component: pageComponent("Users/ResetPassword"),
	},
	{
		path: "/auth0",
		name: "Auth0",
		meta: {},
		// lazy-loaded
		component: pageComponent("Users/Auth0"),
	},
	{
		path: "/questionari/fill/:survey_id/:participant_id",
		name: "Compila il questionario",
		// pubblico, altrimenti non funziona!
		meta: {},
		// lazy-loaded
		component: pageComponent("Questionari/fill"),
	},
	
	

	{ path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
 * **/
function pageComponent(name) {
	var res;
	//TODO: Bruttissimo andrebbe gestito nel modulo
	if (process.env.VUE_APP_THEME == "orari" && name == "Dashboard") {
		res = require("../pages/Orari/" + name + ".vue").default;
	} else {
		try {
			res = require("~theme/pages/" + name + ".vue").default;
		} catch (e) {
			res = require("../pages/" + name + ".vue").default;
		}
	}

	return res;
}

export default routes;
