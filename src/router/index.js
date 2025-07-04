import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import axios from "axios";
import VueCookies from "vue-cookies";
import { Buffer } from 'buffer';

Vue.use(VueRouter);
Vue.use(VueCookies);
let allRoutes;

function parseJwt(token) {
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var jsonPayload = decodeURIComponent(Buffer.from(base64, "base64").toString("ascii").split("").map(function (c) {
		return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(""));

	return JSON.parse(jsonPayload);
}

//Questo interceptor serve per mandarmi al login se la sessione è scaduta
axios.interceptors.response.use(
	(res) => {
		return res;
	},
	(err) => {
		if (err.response.status === 401 || err.response.status === 403) {
			window.$cookies.remove("user");

			if (router.currentRoute.path !== '/' + process.env.VUE_APP_LOGIN_URL) {
				router.push(process.env.VUE_APP_LOGIN_URL);
			}

		}
		throw err;
	}
);

//Carico le routes dei moduli extra dal file env 
try {
	const modsList = process.env.VUE_APP_EXTRA_MODULES;
	const mods = JSON.parse(modsList);
	////console.log(mods);
	//const mods = ["Abbonamenti"];
	allRoutes = routes;
	mods.forEach(m => {
		let res = require(`../extra/${m}/routes`);
		allRoutes = allRoutes.concat(res.default);
	});
} catch (e) {
	//console.log("no valid extra module to be loaded");
}

// configure router
const router = new VueRouter({
	routes: allRoutes,
	linkActiveClass: "active",
	mode: "history",
	base: process.env.BASE_URL,
	scrollBehavior() {
		return { x: 0, y: 0 };
	},
});

router.beforeEach((to, from, next) => {
	const { authorize } = to.meta;
	const loggedIn = window.$cookies.get("user");
	const nearestWithTitle = to.matched
		.slice()
		.reverse()
		.find((r) => r.meta && r.meta.title);

	// If a route with a title was found, set the document (page) title to that value.
	if (nearestWithTitle) {
		document.title = nearestWithTitle.meta.title + process.env.VUE_APP_TITLE_LONG;
	} else {
		document.title = to.name + " | " + process.env.VUE_APP_TITLE_LONG + " " + process.env.VUE_APP_GIT_TAG;
	}

	// If the url requires autorization
	if (authorize !== undefined) {
		if (!loggedIn) {
			// not logged in so redirect to login page with the return url
			return next({ path: process.env.VUE_APP_LOGIN_URL, query: { returnUrl: to.path } });
		}

		// check if jwt token has expired
		const jwtPayload = parseJwt(loggedIn.accessToken);
		if (jwtPayload.exp < Date.now() / 1000) {
			// token expired
			//Logout dal frontend
			window.$cookies.remove("user");
			return next({ path: process.env.VUE_APP_LOGIN_URL });
		}

		// check if route is restricted by role
		if (authorize.length && !authorize.includes(loggedIn.role)) {
			// role not authorised so redirect to home page
			return next({ path: process.env.VUE_APP_LOGIN_URL });
		}
	}

	//if I'm here the URL doesn't require authorization or we already checked it
	//so we can go to it straight away
	next();
});

export default router;
