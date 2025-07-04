<template>
    <div class="wrapper">
        <side-bar>
            <template slot="links">
                <sidebar-link to="/dashboard" name="Cruscotto" icon="ti-panel" />
                <sidebar-link to="/profile" name="Il mio profilo" icon="ti-user" authorize="user" />
                <sidebar-link to="/aziende" name="Aziende e Scuole" icon="ti-package" authorize="admin, moma, moma_area" />
                <sidebar-link to="/users" name="Gestione Utenti" icon="ti-user" authorize="admin, moma, moma_area" />
                <sidebar-link to="/mappa" name="Mappa" icon="ti-map" authorize="admin" />
                <sidebar-link to="/orari" name="Orari Scuole" icon="ti-alarm-clock" authorize="superiori, admin, moma_area" />
            </template>
            <mobile-menu v-if="loggedIn">
                <li class="nav-item">
                    <a class="nav-link">
                        <i class="ti-user"></i>
                        <p>{{ loggedIn.email }}</p>
                    </a>
                </li>
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
