<template>
    <div class="wrapper">
        <side-bar>
            <template slot="links">
                <sidebar-link to="/dashboard" name="Riepilogo" icon="ti-panel" authorize="admin, moma, moma_area" />
                <sidebar-link to="/users" name="Gestione Utenti" icon="ti-user" authorize="admin, moma_area" />
                <sidebar-link to="/profile" name="Il mio profilo" icon="ti-user" authorize="user" />
                <sidebar-link to="/aziende" name="Aziende" icon="ti-package" authorize="admin, moma, moma_area" />
                <sidebar-link to="/questionari" name="Questionari" icon="ti-view-list-alt" authorize="admin, moma, moma_area" />
                <sidebar-link to="/analytics" name="Analisi Dati" icon="ti-bar-chart" authorize="admin, moma, moma_area" />
                <sidebar-link :to="mySurvey()" name="Questionario" icon="ti-view-list-alt" authorize="user" />
                <sidebar-link to="/orari" name="Orari Scuole" icon="ti-alarm-clock" authorize="superiori, admin, moma_area, moma" v-if="isHighSchool"/>
                <sidebar-link to="/mappa" name="Mappa" icon="ti-map" authorize="admin, moma, moma_area" />
                <sidebar-link to="/pscl" name="Piano Spostamenti" icon="ti-write" authorize="admin, moma, moma_area" />
                <sidebar-link to="/bilancio" name="Bilancio ed Esternalità" icon="ti-money" authorize="admin, moma , moma_area" />
                <sidebar-link to="/momarea" name="Area" icon="ti-pencil-alt" authorize="admin, moma_area"  v-if="1"/>
                <sidebar-link to="/emissioni" name="Emissioni" icon="ti-cloud" authorize="admin, moma, moma_area"  v-if="0"/>
                <sidebar-link to="/pages/pascal" name="Progetto Pascal" icon="ti-info-alt" authorize="user, admin, moma_area" v-if="0"/>
            </template>
            <mobile-menu v-if="loggedIn">
                <!-- <li class="nav-item"> -->
                    <!-- <a class="nav-link">
                        <i class="ti-user"></i>
                        <p>{{ loggedIn.email }}</p>
                    </a> -->
                <drop-down
                    class="nav-item"
                    :title="loggedIn.email"
                    title-classes="nav-link"
                    icon="ti-user">
                    <router-link class="dropdown-item" to="/profile">Modifica Profilo</router-link>
                    <a class="dropdown-item" @click="logout">Logout</a>
                </drop-down>
                <!-- </li> -->
                <!-- <li><a @click="logout">Logout</a></li> -->
                <li class="divider"></li>
            </mobile-menu>
        </side-bar>
        <div class="main-panel">
            <top-navbar></top-navbar>

            <dashboard-content @click.native="toggleSidebar" style="min-height: 80vh"> </dashboard-content>

            <content-footer></content-footer>
        </div>
    </div>
</template>
<style lang="scss"></style>
<script>

import TopNavbar from "@/layout/dashboard/TopNavbar.vue";
import DashboardContent from "@/layout/dashboard/Content.vue";
import ContentFooter from "~theme/ContentFooter.vue";
import MobileMenu from "@/layout/dashboard/MobileMenu";
import Util from "@/mixing/util";
import authService from "@/services/auth.service";

export default {
	components: {
		TopNavbar,
		ContentFooter,
		DashboardContent,
		MobileMenu,
	},
	mixins: [Util],
	data: function () {
		return {
			loggedIn: null,
			survey_id: null,
			user_id: null,
		};
	},
	created: async function () {
		const user = this.$cookies.get("user");
		this.loggedIn = user;
	},
	methods: {
		toggleSidebar() {
			if (this.$sidebar.showSidebar) {
				this.$sidebar.displaySidebar(false);
			}
		},
	},
	computed: {},
};
</script>
