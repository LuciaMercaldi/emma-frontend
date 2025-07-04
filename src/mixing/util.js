import UserService from "@/services/user.service";
import authService from "@/services/auth.service";
import get from "lodash/get";
import { watch } from "vue";

export default {
	data() {
		return {
			logo: process.env.VUE_APP_ICON,
			help_mail: process.env.VUE_APP_HELP_MAIL,
			title: process.env.VUE_APP_TITLE_LONG,
			login_url: process.env.VUE_APP_LOGIN_URL,
			publicPath: process.env.BASE_URL,
			mapConfig: process.env.VUE_APP_MAP_CONFIG ? JSON.parse(process.env.VUE_APP_MAP_CONFIG) : {},
			apiPath: process.env.VUE_APP_ROOT,
			siteDir: process.env.VUE_APP_AMB,
			userRoles: process.env.VUE_APP_USER_ROLES ? JSON.parse(process.env.VUE_APP_USER_ROLES).sort() : [],
			loading: false,
			canShowTranslation: (process.env.VUE_APP_TRANSLATE == 1),
			yearOptions: process.env.VUE_APP_FILTER_YEARS ? process.env.VUE_APP_FILTER_YEARS.split(",") : [], // WIP - array anni disponibili
			// yearOptions: JSON.parse(process.env.VUE_APP_FILTER_YEARS),// WIP - array anni disponibili
			year: new Date().getFullYear(),
			isHighSchool: false, // Add a data property to store the result
		};
	},
	methods: {
		isAuthorized(authorize) {
			const loggedIn = this.getUser;			
			if (!loggedIn) {				
				return false;
			}

			if (authorize !== undefined) {
				//Importante fare il trim, altrimenti si porta dietro lo spazio
				let au = authorize.split(",").map((s) => s.trim());
				let ret = au.includes(loggedIn.role);
				//console.log(au, loggedIn.role, ret);
				return  ret;
			}
			//Se non hai specificato authorize li faccio vedere sempre
			return true;
		},
		showError(e) {
			console.log("util show eror",e);
			this.$bvToast.toast(e.response.data.message, {
				title: "Errore",
				autoHideDelay: 2000,
				appendToast: true,
				variant: "danger",
			});
		},
		async canShow(p) {
			let r = await UserService.getConfig('frontendPermissions');
			let c = r.data.data;			
			//r è un'array di stringhe, devon controllare se p è una di quelle
			return c.includes(p);
		},
		setUser(user) {
			window.$cookies.set("user", JSON.stringify(user), "48h");
		},
		delUser() {
			window.$cookies.remove("user");
		},
		mySurvey() {
			const loggedIn = this.getUser;
			if (loggedIn == null || loggedIn.role !== "user"){
				return "#";
			}

			let url = sessionStorage.getItem("mySurvey");
			if (url !== null) {
				return url;
			}
			url = "#";
			UserService.getMySurvey().then(
				(res) => {
					let survey_id = res.data.survey_id;
					let particpant_id = res.data.participant_id;

					if (survey_id !== null && particpant_id !== null) {
						url = `/questionari/fill/${survey_id}/${particpant_id}`;
					}
					sessionStorage.setItem("mySurvey", url);
				},
				(e) => {
					this.showError(e);
					sessionStorage.removeItem("mySurvey");
				}
			);
			return url;
		},
		download($url) {
			this.btnloading = true;
			UserService.download($url).then(() => {
				this.btnloading = false;
			});
		},
		logout() {
			authService.logout();
			this.$router.push({ path: "/" + this.login_url });
		},
		setYear(year,pscl=false) {
			console.log("setYear", year);
			window.$cookies.set("year", year, "48h");
			this.getYear();
			// refresh variables that using cookies
			// this.$store.dispatch("setYear", getYear);
			console.log("path", this.$route.path);
			
			// refresh the page
			if (this.$route.path == "/pscl"){
				// return;
				console.log("pscl", this.$route.query.company_id);
				let company_id = parseInt(this.$route.query.company_id);
				let office_id;
				if (this.$route.query.office_id != "null" ){
					console.log("office_id", this.$route.query.office_id);
					office_id = parseInt(this.$route.query.office_id);
					
				}else if(this.$route.query.office_id == "null"){
					console.log("office_id else", this.$route.query.office_id);
					office_id = null;
				}

				this.$router.push({ path: "/pscl" ,query: {company_id: company_id, office_id: office_id, year: year}});
				if(pscl){
					return
				}else{
					window.location.reload();
					}
				// window.location.reload();
			}else{
				window.location.reload();
			}
			
		},
		getYear() {
			// if year in cookies is not set, set it to current year
			if (window.$cookies.get("year") != null) {
				this.year = window.$cookies.get("year");
			}
			return this.year;
		},
		async companyIsHighSchool() {
			const loggedIn = this.getUser;	
			if (loggedIn == null){
				return
			}		
			if (loggedIn.company_id == null && (this.loggedUserIsAdmin || this.loggedUserIsMomaArea )){ // admin and moma_area can see all
				return true;
			}
			if (loggedIn.company_id == null) {
				return false;
			}
			const schools = [4];	//TODO: Rendere parametrico, 4=Scuola superiore
			let company_type = await UserService.getCompanyType(loggedIn.company_id);			
			let company_type_id = get(company_type, "data.data.id", null);	
 			return schools.includes(company_type_id);

		},
		async checkIfHighSchool() {
            this.isHighSchool = await this.companyIsHighSchool();
        },
	},
	computed: {
		canShowMobilityLabel() {
			return process.env.VUE_APP_MOBILITY_LABEL == 1;
		},
		//For some instances (5t) we need not to allow nominal survey but anonymous only
		canShowAnonymousSurveyOnly() {
			return process.env.VUE_APP_ANON_ONLY == 1;
		},
		canShowUserGuide() {
			return process.env.VUE_APP_USER_GUIDE == 1;
		},
		canShowImpactsXLS() {
			if (process.env.VUE_APP_SHOW_IMPACTS_XLS == undefined ){
				return false;
			}
			return process.env.VUE_APP_SHOW_IMPACTS_XLS == 1;
		},
		canShowMdGenerate() {
			if (process.env.VUE_APP_SHOW_MD_GENERATE == undefined ){
				return false;
			}
			return process.env.VUE_APP_SHOW_MD_GENERATE == 1;
		},

		getUser() {
			return window.$cookies.get("user");
		},
		getUserId() {
			const loggedIn = this.getUser;
			return loggedIn ? loggedIn.id : null;
		},
		getUserCompany() {
			const loggedIn = this.getUser;
			return loggedIn.company_id;
		},
		loggedUserIsMomaArea() {
			const loggedIn = this.getUser;
			return loggedIn ? loggedIn.role == "moma_area" : false;
		},
		loggedUserIsMomaAzienda() {
			const loggedIn = this.getUser;
			return loggedIn ? loggedIn.role == "moma" && !isNaN(loggedIn.company_id) : false;
		},
		loggedUserIsAdmin() {
			const loggedIn = this.getUser;
			return loggedIn ? loggedIn.role == "admin" : false;
		},
		canEditOrari() {
			const loggedIn = this.getUser;
			return loggedIn ? loggedIn.role == "admin" || (loggedIn.role == "superiori" && loggedIn.company_id !== null) : false;
		},
		getMapOptions() {
			return {
				zoomSnap: this.mapConfig.zoomSnap,
				tileSize: this.mapConfig.tileSize,
				zoomOffset: this.mapConfig.zoomOffset,
				maxZoom: 18,
			};
		},
		getLayerOptions() {
			return  {
				tileSize: this.mapConfig.tileSize,
				zoomOffset: this.mapConfig.zoomOffset,
			};
		},
		getTilesUrl() {
			return this.mapConfig.url;
		},
		getMapAttribution(){
			return this.mapConfig.attribution;
		},
		canShowCoworking() {
			return process.env.VUE_APP_COWORKING == 1;
		},
		canShowLivelliInformativi() {
			return process.env.VUE_APP_LIVELLI_INFORMATIVI == 1;
		}
		// getYear() {
		// 	return window.$cookies.get("year");
		// },
	},
	created() {
        this.checkIfHighSchool(); // Call the method when the component is created
    },
	// watch: {
	// 	getYear() {
	// 		// console.log("watch year", this.getYear);
	// 		return window.$cookies.get("year");
	// 	},
	// },
};
