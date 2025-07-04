<template>
    <b-alert show variant="warning" v-if="conditions">
        Dipende dalla domanda
        <br />
        <b>{{ conditions.question+"."+ conditions.description }}</b>
        <br />
        <hr />
        Valori di attivazione
        <table style="width: 100%">
            <tr v-for="(group, index) of conditions.groups" :key="index">
                <td v-if="conditions.groups.length > 1">
                    <b>{{ group }}</b>
                </td>
                <td>{{ viewValues(conditions.value,index) }}</td>
            </tr>
        </table>
    </b-alert>
</template>
<script>
import _ from "lodash";

export default {
	name: "question-condition-info",
	props: ["conditions","questions"],
	data() {
		return {
		};
	},
	async created() {
	},

	methods:{
		viewValues(values,index){
			// find questions by id
	let question = this.questions.find((q) => q.id == this.conditions.question);
	console.log("conditions question ", question);

	// if (!question || !question.questions_surveys || !question.questions_surveys[0] || !Array.isArray(question.questions_surveys[0].options)) {
	// 	return "Nessuno";
	// }

	let options = question.questions_surveys[0].options;

	if (this.conditions.groups.length == 1) {
		// return questions options using index from values
		return values.length
		? values.map((val) => options[val]).join(", ")
		: "Nessuno";
	} else {
		console.log("conditions options ", values);
		// filter options by group
		let groupOptions = options.groups.filter((group) => group.label == this.conditions.groups[index]);
		console.log("conditions groupOptions ", groupOptions);
		if (values.length) {
		return values[index] != undefined && values[index].length
			? values[index].map((val) => groupOptions[0].options[val]).join(", ")
			: "Nessuno";
		} else {
		return "Nessuno";
		}
  }
			
			
		},
	},
};
</script>
