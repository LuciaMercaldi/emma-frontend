<template>
	<div>
		<div class="row">
			<div class="col-xl-4 col-lg-5 col-md-6">
				<user-card> </user-card>
			</div>

			<div class="col-xl-8 col-lg-7 col-md-6">
				<edit-profile-form> </edit-profile-form>
			</div>
		</div>

		<div v-if="showServices">
			<!--Stats cards-->
			<h3>Servizi Attivi per te <b-badge>Demo</b-badge> <span class="text-muted small">Funzionalità non ancora
					attiva, ti avviseremo appena sarà pronta.</span> </h3>

			<div class="row">
				
				<b-card  v-for="m in filterMeasures()" :title="m.name" :img-src="`${serverPath}img/${m.img}`" :img-alt="m.name" img-top
					tag="article" style="max-width: 18rem;"  :key="m.id" class="m-3 p-2">
					
					<b-card-body class="d-flex flex-column">
						<b-card-text>
							{{ m.description }}	
						</b-card-text>
					
											
						<b-button :href="m.service_url" target="service" variant="primary">Vai al Servizio</b-button>
					</b-card-body>
					
				</b-card>

			</div>
		</div>
	</div>
</template>
<script>
import EditProfileForm from "../UserProfile/EditProfileForm.vue";
import UserCard from "../UserProfile/UserCard.vue";
import UserService from "@/services/user.service";
import Util from "@/mixing/util";

export default {
	components: {
		EditProfileForm,
		UserCard,

	},
	data() {
		return {
			serverPath: process.env.VUE_APP_ROOT,
			showServices: (process.env.VUE_APP_SERVIZI_USER == 1),
			measures: [],
		}
	},
	async created() {
		//TODO: estrarre solo le misure attive per questa azienda
		let m = await UserService.getMeasures();
		this.measures = m.data.measures;
	},
	methods: {
		filterMeasures() {
			let visibile = [28,31,32,52,53,54,55,61,62,63];
			let services = 2;
			let company_type = 'azienda';
			return this.measures.filter(m => m.type == services && m.target == company_type && visibile.includes(m.id) );
		}
	}
};
</script>
<style>
.card-img-top {	
	max-width: 300px;
	align-self: center;
}
.card-footer {
  background-color: transparent !important;
}
</style>
