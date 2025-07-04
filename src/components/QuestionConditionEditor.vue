<template>
    <div class="question-condition-editor">
        <div class="text-center" v-if="fetchingQuestions">
            <b-spinner label="Spinning"></b-spinner>
        </div>

        <div v-if="!fetchingQuestions">
            <hr />
            <b-form-group label="Visualizza la domanda">
                <b-form-radio v-model="displayType" name="some-radios" value="always">Sempre</b-form-radio>
                <b-form-radio v-model="displayType" name="some-radios" value="conditionally">In base alla risposta ad un'altra domanda</b-form-radio>
            </b-form-group>

            <div v-if="displayType == 'conditionally'">
                <div>
                    <label>Domanda</label>
                    <!-- <b-form-select v-model="parentQuestionId" :options="options"></b-form-select> -->
					<v-select
						v-model.lazy="parentQuestionId"
						:options="options"
						value-field="id"
						label="description">
					</v-select>
                </div>
                <div v-if="parentQuestionId">
                    <div>Valori di attivazione</div>
                    <b-alert show variant="warning"> Qualunque valore selezionato attiva la domanda </b-alert>
                    <div v-for="(value, index) in activationOptions" :key="index">
                        <label>{{ value.label }}</label>
                        <b-form-checkbox-group v-model="tempSelected[index]" :options="value.options" @change="updateSelected(index, $event)"></b-form-checkbox-group>
                        <hr />
                    </div>
                </div>
            </div>
            <hr />
        </div>
    </div>
</template>
<script>
import UserService from "@/services/user.service";
import QuestionService from "@/services/question.service";
import _ from "lodash";
import vSelect from "vue-select";

export default {
	components: {
		vSelect,
	},
	name: "question-condition-editor",
	// props: {
	// 	survey_id: [String, Number],
	// },
	props: ["value", "id","canShowTranslation","survey_id"],
	data() {
		return {
			displayType: "always",
			parentQuestionId: null,
			parentQuestion: null,
			selected: [],
			questions: [], // le opzioni sono tutte le domande (indipendentemente da che siano nel questionario oppure no)
			fetchingQuestions: true,
			options: [],
			activationOptions: [],
			tempSelected: []
		};
	},
	watch: {
		parentQuestionId: function (newVal, oldVal) {
			//console.log("newval", newVal);
			//console.log("oldval", oldVal);

			this.parentQuestion = this.questions.find((q) => q.id == this.parentQuestionId.id);
			if (this.parentQuestion.type == "array") {
				const opts = this.parentQuestion.options;
				this.activationOptions = opts.groups;
			} else {
				this.activationOptions = [
					{
						label: "",
						options: this.parentQuestion.options,
					},
				];
			}
			//Se hai cambiato domanda padre, cambio la selezione
			if (oldVal && oldVal != newVal) {
				this.selected = this.activationOptions.map(() => []);
			}
		},
		// selected: function () {
		// 	console.log("selected emit", this.selected);
		// 	this.emitValue();
		// },
		displayType: function () {
			this.emitValue();
		},
	},
	async created() {
		this.fetchingQuestions = true;
		try {
			// this.questions = (await UserService.getAllQuestions()).data.questions.filter((q) => q.id != this.questionId && ["single", "multiple", "array"].indexOf(q.type) != -1);
			this.questions = (await UserService.getQuestions(this.survey_id)).data.survey.questions.filter((q) => q.id != this.questionId && ["single", "multiple", "array"].indexOf(q.type) != -1);
			QuestionService.initQuestions(this.questions, true);
			this.options = this.questions.map((q) => ({
				// value: q.id,
				// text: `${q.id}. ${q.name} - ${String(q.description).length > 30 ? String(q.description).substring(0, 30) + "..." : q.description}`,
				id: q.id,
				name: q.name,
				type: q.type,
          		section_id:q.section_id,
				description: `${q.id}. ${q.description}`,
			}));
		} catch (e) {
			//console.log(e);
			this.$bvToast.toast(e.message, {
				title: "Errore",
				autoHideDelay: 2000,
				appendToast: true,
				variant: "danger",
			});
		} finally {
			this.fetchingQuestions = false;
		}
		
		console.log("value",this.value);
		try {
			if (!_.isEmpty(this.value)) {
				const v = { ...this.value };
				// if (Array.isArray(v.value)) {
				// 	v.value = _.flattenDeep(v.value);
				// }

				if (v.display) {
					this.displayType = "conditionally";
					// this.parentQuestionId.id = v.question;
					this.parentQuestionId= this.options.find((q) => q.id == v.question);
					this.parentQuestion = this.questions.find((q) => q.id == this.parentQuestionId.id);
					if (this.parentQuestion.type == "array") {
						const opts = this.parentQuestion.options;
						this.activationOptions = opts.groups;
					} else {
						this.activationOptions = [
							{
								label: "",
								options: this.parentQuestion.options,
							},
						];
					}
					
					this.selected = this.parentQuestion.type == "array" ? v.value : [v.value];
					console.log("selected",this.selected);
					// fill tempSelected using selected
					this.tempSelected = this.selected.map((s, index) => {
						return s.map((i) => this.activationOptions[index].options[i]);
					});
					
				} else throw new Error();
			}else{
				this.displayType = "always";
				this.parentQuestionId = null;
				this.parentQuestion = null;
			}
		} catch (e) {
			//console.log(e);
			this.displayType = "always";
			this.parentQuestionId = null;
			this.parentQuestion = null;
			//this.selected = [[]];
		}
	},
	methods: {
		emitValue() {
			console.log("emitValue");
			console.log("displayType",this.displayType);
			console.log("parentQuestionId",this.parentQuestionId);
			if (this.displayType == "conditionally" && this.parentQuestionId!=null) {					
				let v = {
					display: this.displayType,
					question: this.parentQuestionId.id,
					value: this.parentQuestion.type == "array" ? this.selected : this.selected[0],
					groups: this.activationOptions.map((a) => a.label), // mi serve unicamente per visualizzare all'utente un feedback sulla struttura della condizione
					description: this.parentQuestion.description, // mi serve unicamente per visualizzare all'utente un feedback sulla struttura della condizione
				};
				this.$emit("input", v);
			} else {
				this.$emit("input", {});
			}
		},
		updateSelected(index, selectedOptions) {
			console.log("selectedOptions",selectedOptions);
            this.selected[index] = selectedOptions.map(option => this.activationOptions[index].options.indexOf(option));
			console.log("selected",this.selected);
			this.emitValue();
        },
		// updatetempSelected(index, selectedOptions) {
		// 	this.tempSelected[index] = selectedOptions;
		// },
	},
};
</script>

<style>
.question-condition-editor .input-group {
    margin: 2px;
    margin-top: 0 !important;
}
</style>
