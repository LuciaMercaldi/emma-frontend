<template>
    <OfficeSurveyWidget :office_id="$route.params.office_id" :redirect_to="$route.query.redirect_to" survey_type="sede"></OfficeSurveyWidget>
</template>

<script>
import OfficeSurveyWidget from "@/components/OfficeSurvey";

export default {
	name: "OfficeSurvey",
	components: {
		OfficeSurveyWidget,
	},
	data() {
		return {};
	},
};
</script>

