<template>
    <div>
        <b-table  :items="employees">

        </b-table>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";

export default {
	name: "EmployeesIndex",
	mixins: [Util],
	data() {
		return {
			isBusy: true,
			companies: [],
			employees: [],
			filter: {
				company_id: null,
				office_id: null,
				origin: null,
			},
		};
	},
	async created() {
		this.fetchEmployees();
	},
	methods: {
		async fetchEmployees(){
			let res = await UserService.getEmployees();
			//console.log(res);
			this.employees = res.data.employees;
		}
	}
};
</script>
