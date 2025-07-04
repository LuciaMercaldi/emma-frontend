<template>
    <div>
        <b-button to="/questionario-azienda" variant="primary"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nuova Azienda o Ente</b-button>
        &nbsp;
        <b-button to="/questionario-azienda" variant="primary"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nuova Scuola</b-button>

        <hr />
        <b-list-group>
            <b-list-group-item v-for="azienda in aziende" :key="azienda.id" @click="openAzienda(azienda.id)">
                <b>{{ azienda.name }}</b> &nbsp; <b-badge variant="primary">{{ azienda.city }} ({{ azienda.province }})</b-badge>&nbsp;
                <b-badge>{{ getCompanyType(azienda.company_type_id) }}</b-badge>&nbsp;
                <div v-if="showAzienda == azienda.id">
                    <hr />
                    <h3>sedi</h3>
                    <ul class="list-unstyled">
                        <li v-for="office in offices" :key="office.id">
                            <b>{{ office.name }}</b> -
                            <b-badge variant="primary" v-if="office.city !== null && office.province !== null">{{ office.city }} ({{ office.province }})</b-badge>
                            <router-link :to="`offices/edit/${office.id}`"><i class="fa fa-pencil" aria-hidden="true"></i></router-link>
                            <a @click="deleteOffice(office.id)"><i class="fa fa-trash" aria-hidden="true"></i></a>
                            <i v-if="office.lat != null" class="fa fa-map-marker" aria-hidden="true"></i>
                        </li>
                    </ul>
                </div>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";

export default {
	name: "OfficesIndex",
	mixins: [Util],
	data() {
		return {
			aziende: [],
			offices: [],
			showAzienda: null,
			companyTypes: [],
		};
	},
	methods: {
		openAzienda(azienda_id) {
			this.showAzienda = azienda_id;
			UserService.getOffices(azienda_id)
				.then((response) => {
					this.offices = response.data.offices;
				})
				.catch((error) => this.showError(error));
		},
		deleteOffice(office_id) {
			UserService.deleteOffice(office_id);
			this.updateOffices();
		},
		getCompanyType(id) {
			return this.companyTypes.find((x) => x.value === id).text;
		},
	},
	async created() {
		this.companyTypes = await UserService.getCompanyTypes();

		UserService.getCompanyList()
			.then((response) => {
				this.aziende = response.data.companies;
			})
			.catch((error) => this.showError(error));
	},
};
</script>
