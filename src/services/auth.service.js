import axios from "axios";
import userService from "@/services/user.service";
import createAuth0Client from "@auth0/auth0-spa-js";

const domain = process.env.VUE_APP_AUTH0_DOMAIN;
const clientId = process.env.VUE_APP_AUTH0_CLIENTID;
const audience = process.env.VUE_APP_AUTH0_AUDIENCE;


class AuthService {
	async login(user) {
		
		//Prima Chiamata - Login dell'utente
		let response = await axios.post(process.env.VUE_APP_ROOT + "users/login.json", user);
		if (response.data.data) {
			user.accessToken = response.data.data;
			//Tolgo la password dalla memoria
			user.password = null;
			window.$cookies.set("user", JSON.stringify(user), "48h");
			//console.log("impostato il cookie", user);
		}

		//Seconda chiamata - Leggo i dati dell'utente
		try {
			//console.log("prima di whoami");
			let u = await this.whoAmI();
			//console.log("dopo whoami");
			return u;
		} catch (e) {
			//this.delUser();
			//console.log("errore login", e.response);
			this.$bvToast.toast(e.response.data.message, {
				title: "Errore",
				autoHideDelay: 2000,
				appendToast: true,
				variant: "danger",
			});
		}
		
	}

	async whoAmI() {
		try {
			//console.log("whoami 0");
			let response = await userService.whoAmI();
			let u2 = response.data;
			let user = window.$cookies.get("user");
			//console.log("whoami 10");
			
			//Non ho capito perchè non posso fare il merge degli oggetti on ...
			user.first_name = u2.first_name;
			user.last_name = u2.last_name;
			user.company_id = u2.company_id;
			user.role = u2.role;
			user.email = u2.email;
			user.id = u2.id;
			user.tos_date = u2.tos_date;
			user.cf = u2.cf;
			user.mobile = u2.mobile;
			user.badge_number = u2.badge_number;
			//console.log("in whoami", user);
			//Memorizzo il risultato nel cookie
			window.$cookies.set("user", JSON.stringify(user), "48h");
			return user;
		} catch (error) {
			this.delUser();
			//console.log(error.message);
			this.$bvToast.toast("Logging error", {
				title: "Logging error",
				variant: "danger",
				autoHideDelay: 5000,
				appendToast: true,
			});
			
			return null;
		}
	}

	async ah(accessToken, user){
		//console.log("sono in ah" , accessToken);
		//Prima Chiamata - Login dell'utente
		if (accessToken != null) {				
			user.accessToken = accessToken;				
			//Memorizzo il risultato nel cookie
			try {
				window.$cookies.set("user", JSON.stringify(user), "48h");
				//console.log("impostato il cookie ah sso", user);
			} catch (e){
				//console.log("error", e);
			}
		}
		
		//Seconda chiamata - Leggo i dati dell'utente
		return await this.whoAmI();
	}
	
	async jointly(data, user) {
		//Prima Chiamata - Login dell'utente
		//console.log("sono in jointly");
		await axios.get(process.env.VUE_APP_ROOT + "subscriptions/subscriptions/jointly.json?data=" + data).then((response) => {
			//console.log("jointly", response.data);
			if (response.data.data) {
				user.accessToken = response.data.data;
				//Memorizzo il risultato nel cookie
				try {
					window.$cookies.set("user", JSON.stringify(user), "48h");
					//console.log("impostato il cookie joinlty sso", user);
				} catch (e){
					//console.log("error", e);
				}
			}
		});

		//Seconda chiamata - Leggo i dati dell'utente
		return await this.whoAmI();
	}

	async logout() {
		//Logout dal backend
		await axios.get(process.env.VUE_APP_ROOT + "users/logout.json");
		//console.log("Logout backend", window.location.origin);

		//console.log("Logout auth0 - pre");
		this.auth0Client = await createAuth0Client({
			domain,
			client_id: clientId,
			audience,
			redirect_uri: window.location.origin + window.location.pathname,
		});
		//console.log("Logout auth0 - during", this.auth0Client);
		this.auth0Client.logout({ returnTo: window.location.origin });
		//console.log("Logout auth0 - post");

		//Logout dal frontend
		//console.log("Logout frontend");
		window.$cookies.remove("user");
	}

	delUser() {
		//console.log("Cancello l'utente");
		//Faccio il logout dal backend
		axios.get(process.env.VUE_APP_ROOT + "users/logout.json");
		//Faccio il logout da auth0
		this.logout();
		//Faccio il logout dal frontend
		window.$cookies.remove("user");
		//console.log("Utente cancellato");
	}
}

export default new AuthService();
