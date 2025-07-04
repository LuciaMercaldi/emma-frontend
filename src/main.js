/*
 =========================================================
 * Vue Paper Dashboard - v2.0.0
 =========================================================

 * Product Page: http://www.creative-tim.com/product/paper-dashboard
 * Copyright 2019 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import Vue from "vue";
import App from "./App";
import router from "./router/index";
import PaperDashboard from "./plugins/paperDashboard";

import axios from "axios";

// Theme
import "~theme/theme.scss";

import VueCookies from "vue-cookies";
Vue.use(VueCookies);

//https://vue2-leaflet.netlify.app/quickstart/#marker-icons-are-missing
import { Icon } from "leaflet";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
Vue.use(IconsPlugin);
Vue.use(PaperDashboard);

// Install BootstrapVue
Vue.use(BootstrapVue);
import "bootstrap-vue/dist/bootstrap-vue.css";

/* eslint-disable no-new */
new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
