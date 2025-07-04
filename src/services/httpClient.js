// Ispirazione (articolo ben fatto)
// https://haxzie.com/architecting-http-clients-vue-js-network-layer


import axios from "axios";
import Vue from "vue";

const getAuthToken = () => {
	let user = window.$cookies.get("user"); 	
	if (user && user.accessToken) {		
		return user.accessToken;    
	}
	return null; 
};

const authInterceptor = (config) => {	
	config.headers["Authorization"] = getAuthToken();
	return config;
};

const httpClient = axios.create({
	baseURL: process.env.VUE_APP_ROOT,
	headers: {
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "69420"
		//"Cache-Control": "no-cache"
	},
	timeout: 60000,
});

// interceptor to catch errors
const errorInterceptor = error => {
	const vm = new Vue();
	// check if it's a server error
	if (!error.response) {
		vm.$bvToast.toast("Network Error", {
			title: "Errore",
			autoHideDelay: 2000,
			appendToast: true,
			variant: "danger",
		});
		return Promise.reject(error);
	}

	// all the error responses
	switch (error.response.status) {
	case 400:
	case 404:
		console.error(error.response.status, error.message);
		vm.$bvToast.toast("Non abbiamo trovato nessun dato per questa richiesta", {
			title: "Errore",
			autoHideDelay: 2000,
			appendToast: true,
			variant: "warning",
		});
		break;

	case 401: // authentication error, logout the user
		vm.$bvToast.toast("Sessione scaduta, per favore fai di nuovo login", {
			title: "Errore",
			autoHideDelay: 2000,
			appendToast: true,
			variant: "danger",
		});
		window.$cookies.remove("user");
		//router.push("/auth");
		break;

	default:
		console.error(error.response.status, error.message);
		vm.$bvToast.toast(error.message, {
			title: "Errore",
			autoHideDelay: 2000,
			appendToast: true,
			variant: "danger",
		});
	}
	return Promise.reject(error);
};

// Interceptor for responses
const responseInterceptor = response => {
	switch (response.status) {
	case 200:
		// yay!
		break;
		// any other cases
	default:
		// default case
	}

	return response;
};

httpClient.interceptors.response.use(responseInterceptor, errorInterceptor);
httpClient.interceptors.request.use(authInterceptor);

export default httpClient;