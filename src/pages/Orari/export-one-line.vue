<template>
    <div>
        <h2>Esportazione per singolo giorno, su singola riga, aggregata per indirizzo</h2>

        <b-button variant="primary" :disabled="loading" @click.prevent="download(`orariscuole/timeslots/export-one-line.xls?day=${d}`)" v-for="d in 7" :key="d">
            <span v-if="loading">
                <b-spinner small type="grow"></b-spinner>
                Loading...
            </span>
            <span v-else> <i class="fa fa-file-excel-o" aria-hidden="true"></i> Esporta XLS Giorno {{ d }} </span>
        </b-button>
    </div>
</template>
<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";

export default {
	name: "OrariExport",
	components: {},
	mixins: [Util],
	data() {
		return {};
	},
	methods: {
		download($url) {
			this.btnloading = true;
			UserService.download($url).then(() => {
				this.btnloading = false;
			});
		},
	},
};
</script>
<style></style>
