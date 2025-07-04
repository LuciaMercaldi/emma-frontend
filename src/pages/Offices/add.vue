<template>
    <OfficeEditWidget :company_id="$route.params.company_id" :redirect_to="$route.query.redirect_to"></OfficeEditWidget>
</template>

<script>
import OfficeEditWidget from "@/components/OfficeEdit";

export default {
	name: "OfficesAdd",
	components: {
		OfficeEditWidget,
	},
	data() {
		return {};
	},
	methods: {},
};
</script>
