<template>
    <div>
		<b-row>
			<b-col>
				<h2>Per info</h2>
				<p>Per qualsiasi informazione di interesse riguardo la Piattaforma digitale regionale di Mobility management EMMA è possibile inoltrare una email al seguente indirizzo e.mail mobility.manager@regione.piemonte.it"
				</p>
			</b-col>
			<b-col>
				<h2>Per assistenza</h2>
				<p>Per necessità di assistenza nell’utilizzo della piattaforma contatta l’help desk all’indirizzo mobilita.sostenibile@5t.torino.it 
				</p>
			</b-col>
		</b-row>
    </div>
</template>
<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";


export default {
	name: "Contacts",
	mixins: [Util],
	data() {
		return {
			
		};
	},

	watch: {},
	computed: {
		
	},
	methods: {
		
	},
};
</script>
<style>
	
</style>
