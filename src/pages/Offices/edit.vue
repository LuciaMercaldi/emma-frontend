<template>
	<OfficeEditWidget :office_id="$route.params.office_id" :redirect_to="$route.query.redirect_to"></OfficeEditWidget>
</template>

<script>
import OfficeEditWidget from "@/components/OfficeEdit";

export default {
	name: "OfficesEdit",
	components: {
		OfficeEditWidget,
	},
	data() {
		return {};
	},
	methods: {},
};
</script>
