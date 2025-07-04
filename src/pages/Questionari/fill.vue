<template>
	<b-overlay :show="busy" rounded="sm">
		<div class="page-holder bg-cover d-flex flex-column sticky-footer-wrapper" id="questionario-fill">

			<b-container class="flex-fill" no-title>
				<b-modal id="modal-language" centered v-model="modalLanguage" @close="closeWindow" no-close-on-backdrop
					title="Scegli la lingua / Choose your language">
					<div class="text-center">
						<b-button @click="changeLanguage('it')" variant="outline-primary" class="btn-flag"><img
								:src="`${apiPath}img/it.svg`" height="50" alt="Bandiera Italiana"><br>ITA</b-button>
						&nbsp;
						<b-button @click="changeLanguage('en')" variant="outline-primary" class="btn-flag"><img
								:src="`${apiPath}img/gb.svg`" height="50" alt="English Flag"><br>ENG</b-button>
					</div>
					<template #modal-footer="">
						&nbsp;
					</template>
				</b-modal>

				<b-modal id="modal-privacy" v-model="modalShow" size="lg" ok-only :ok-title="frasi.procedo"
					@close="closeWindow" @ok="handleOk" no-close-on-backdrop>
					<template #modal-title>
						<h4>{{ survey.name }}</h4>
					</template>
					<!-- load until welcome frase -->
					<!-- <b-spinner label="Spinning" class="float-right" v-if="frasi.welcome == null"></b-spinner> -->
					<div v-html="frasi.welcome"></div>
				</b-modal>

				<b-alert v-if="survey === false" show variant="warning">
					<h2>Questionario non trovato o non attivo</h2>
					<span v-if="error">{{ String(error) }}</span>
				</b-alert>

				<!--blocco ringraziamenti chiusura questionario in italiano-->
				<div v-if="survey && survey.questions && q == null && survey_completed && language == 'it'"
					class="text-center">
					<h2>{{ survey.name }}</h2>
					<b-alert show style="border: 4px solid white" class="col-12 text-center">
						<h1><b>Grazie!</b></h1>
						<p style="font-size:14pt">
							Hai completato
						</p>
						<p style="font-size:14pt; font-weight: 900;">
							{{ survey.name }}:
						</p>
						<p style="font-size:14pt">
							il tuo tempo e la tua opinione sono per noi molto&nbsp;importanti.
						</p>
						<h3>A presto.</h3>
						<p style="font-size:22pt; padding: 0px">Ora puoi chiudere questa&nbsp;finestra.</p>
					</b-alert>
				</div>

				<!--blocco ringraziamenti chiusura questionario in inglese-->
				<div v-if="survey && survey.questions && q == null && survey_completed && language == 'en'"
					class="text-center">
					<h2>{{ survey.name }}</h2>
					<b-alert show style="border: 4px solid white" class="col-12 text-center">
						<h1><b>Thanks!</b></h1>
						<p style="font-size:14pt">
							You completed
						</p>
						<p style="font-size:14pt; font-weight: 900;">
							{{ survey.name }}:
						</p>
						<p style="font-size:14pt">
							your time and opinion are very important&nbsp;to&nbsp;us.
						</p>
						<h3>See you soon.</h3>
						<p style="font-size:22pt; padding: 0px">You may close this&nbsp;window&nbsp;now</p>
					</b-alert>
				</div>

				<div v-if="survey && survey.questions && q && language != ''" id="survey-container" class="mt-3">

					<b-row class="zindex-1 mx-1">
						<b-card v-if="survey.logo" :img-src="`${serverPath}/${siteDir}/${survey.logo}`"
							img-alt="survey.logo" img-left class="mt-3 p-2">
							<b-card-body style="border-left: 1px solid silver; margin-left: 2em; padding-left: 2em"
								class="mb-2 px-2">
								<h3 class="pl-2 ml-2">{{ survey.name }}</h3>
							</b-card-body>
						</b-card>
						<b-card v-if="q" class="col-md-12 card-questionario-mobile px-2" :key="q.id">
							<h4 class="mt-2 mb-1">{{ currSectionTitle() }}</h4>
							<b-card-text v-if="q.questions_surveys[0].section_id == 2 && theme == 'mobilitysquare'"
								class="ml-0 pt-0 mt-0 mb-2">
								In questa sezione verranno raccolti alcuni dati sugli spostamenti che effettui
							</b-card-text>
							<b-progress :value="progress" :max="getQuestionsNum()" class=""></b-progress>
						</b-card>
					</b-row>

					<transition name="fade" mode="out-in">
						<b-card class="col-md-12 px-2" v-if="q" :key="q.id" id="questions">
							<template v-slot:header>
								<h5 class="mb-0 mt-0">{{ frasi.description }}</h5>
								<b-form-text class="mb-2" v-if="frasi.long_description"
									v-html="frasi.long_description.description"></b-form-text>
							</template>

							<b-form-group class="mt-2">
								<b-form-input v-if="q.type == 'text'" name="q.id"
									v-model.lazy="answer[q.id]"></b-form-input>

								<div id="single"
									v-if="q.options !== null && q.type == 'single' && q.options.length <= 8">
									<b-form-radio v-for="(opt, key) in q.options" :key="key" :value="opt"
										v-model.lazy="answer[q.id]">{{
											frasi.options[key] }}</b-form-radio>
								</div>

								<div id="single8"
									v-if="q.options !== null && q.type == 'single' && q.options.length > 8">
									<b-form-select v-model="answer[q.id]">
										<b-form-select-option :value="null">---</b-form-select-option>
										<b-form-select-option v-for="(opt, key) in q.options" :key="key" :value="opt">{{
											frasi.options[key] }}</b-form-select-option>
									</b-form-select>
								</div>

								<b-form-checkbox-group id="multiple" stacked v-if="q.type == 'multiple'"
									v-model.lazy="answer[q.id]">
									<b-form-checkbox v-for="(opt, index) in q.options" :key="index" :value="opt"
										inline>{{
											frasi.options[index] }}</b-form-checkbox>
								</b-form-checkbox-group>

								<div id="array" v-if="q.type == 'array'">
									<b-form-group stacked v-for="(group, index) in q.options.groups" :key="index"
										:label="frasi.options.groups[index].label">
										<b-form-select :options="frasi.options.groups[index].options"
											v-model.lazy="answer[q.id][index]"> </b-form-select>
									</b-form-group>
									<b-form-group v-if="q.options.allowOther">
										<label v-if="language == 'en'">Other</label>
										<label v-else>Altro</label>
										<b-form-input v-model="answer[q.id]['altro']"></b-form-input>
									</b-form-group>
								</div>

								<div id="map" v-if="q.type == 'map'">
									<map-question :survey_id="survey_id" v-on:response-changed="answer[q.id] = $event"
										:answer="answer" @back="back()" @save="saveContinue()" :language="language"
										:mapqs_ori="q.questions_surveys[0].long_description ? q.questions_surveys[0].long_description.mapqs : q.long_description.mapqs"
										:questions="allquestions"> </map-question>
								</div>
								<div class="mt-2"></div>
								<span id="compulsory" class="text-danger text-small"
									v-if="q.questions_surveys[0].compulsory_answer">{{
										frasi.obbligatoria }}</span>
							</b-form-group>

							<hr />

							<b-button v-if="q.id !== this.survey.questions[0].id && q.type != 'map'" variant="primary"
								class="btn-xl float-left" @click.prevent="back()">
								&nbsp;{{ frasi.indietro }}
								<i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
							</b-button>

							<b-spinner label="Spinning" class="float-right" v-if="saving"></b-spinner>

							<b-button :disabled="saving" variant="success" class="btn-xl float-right"
								@click.prevent="saveContinue()" v-if="q.type != 'map'">
								&nbsp;{{ frasi.salva_continua }}
								<i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
							</b-button>
						</b-card>
					</transition>

					<b-card v-if="survey.survey_delivery_config.mail_footer">
						<b-card-text>
							<small class="text-muted float-right" v-html="survey.survey_delivery_config.mail_footer">
							</small>
						</b-card-text>
					</b-card>
				</div>
			</b-container>
			<content-footer></content-footer>
		</div>
	</b-overlay>
</template>

<script>
import UserService from "@/services/user.service";
import _ from "lodash";
import QuestionService from "@/services/question.service";
import Util from "@/mixing/util";
import ContentFooter from "~theme/ContentFooter.vue";
import { AST_EmptyStatement } from "terser";

//TODO: COMPLETE TRANSLATION OF UX 
const frasi = {
	it: {
		salva_continua: "Salva e Continua",
		procedo: "Procedo con la Compilazione",
		indietro: "Indietro",
		obbligatoria: "Questa risposta è obbligatoria",
	},

	en: {
		salva_continua: "Save and Continue",
		procedo: "Proceed to the Survey",
		indietro: "Back",
		obbligatoria: "This answer is compulsory",
	}
};

export default {
	name: "QuestionariFill",
	mixins: [Util],
	components: {
		MapQuestion: () => import("@/components/MapQuestion.vue"),
		ContentFooter,
	},
	data() {
		return {
			survey: [],
			conditions: [],
			answer: [],
			sections: [],
			participant_id: null,
			survey_id: null,
			error: null,
			survey_completed: false,
			q: null,
			isTest: false,
			saving: false,
			modalShow: false,
			modalLanguage: false,
			welcome: null,
			progress: 0,
			language: "", //"en" se voglio il default in inglese
			step: 0,
			sectionIds: [],
			frasi: frasi["it"],
			busy: false,
			serverPath: process.env.VUE_APP_ROOT,
			allquestions: [],
			theme: process.env.VUE_APP_THEME,
		};
	},
	methods: {
		changeLanguage(lang) {
			this.language = lang;
			this.loadQuestions();
			// this.getTranslatedSurvey(this.survey.id);
			this.modalLanguage = false;
			this.modalShow = !(this.$cookies.get("consenso_questionario") == "true");
			let opt = this.frasi.options;
			this.frasi = frasi[this.language];
			this.frasi.options = opt;
			this.getTranslatedSurvey();
		},

		// anche se sono metodi "grafici" che potrebbero essere implementati come "computed" l'aggiornamento
		// non viene scatenato correttamente con le domande condizionali, li rendo metodi a tutti gli effetti
		currSectionTitle: function () {
			if (this.survey && this.survey.questions && this.q) {
				console.log("CurrSectionTitle1", this.q);
				const currSectionId = this.q.questions_surveys[0].section_id;
				console.log("CurrSectionTitle", this.sections.find((s) => s.id == currSectionId));
				const currSection = this.sections.find((s) => s.id == currSectionId);
				return currSection ? `${currSection["name"]}` : "";
			}
			return "";
		},
		getQuestionsNum: function () {
			// non c'è un modo semplice per ottenere il numero reale di domande (per via di quelle condizionali):
			// mi limito a visualizzare sempre il numero di tutte, "saltando" opporturnamente sulle condizionali
			return this.survey.questions.length;
		},
		updateProgress() {
			if (this.q == null) {
				this.progress = this.survey.questions.length;
			} else {
				this.progress = this.survey.questions.indexOf(this.q);
			}
		},
		async back() {
			this.q = this.getPreviousQuestion(this.q);
			if (this.q !== null) {
				await this.getTranslatedQuestion(this.q.id, this.survey.id);
			}
			this.updateProgress();
		},
		closeWindow(bvModalEvt) {
			// Prevent modal from closing
			bvModalEvt.preventDefault();
			alert("Se non vuoi partecipare, chiudi semplicemente la finestra del browser");
		},
		handleOk() {
			//Salvo il cookie con il consenso
			this.$cookies.set("consenso_questionario", true);
		},
		reset() {
			this.q = this.survey.questions[0];
			this.updateProgress();
		},
		async saveContinue() {
			this.saving = true;
			////console.log("answer",this.answer);
			localStorage.setItem(`answer.${this.q.id}`, JSON.stringify(this.answer));
			try {
				if (!this.checkForm()) {
					this.saving = false;
					return;
				}

				if (!this.isTest) {

					const res = await UserService.updateAnswers(this.answer, this.survey_id, this.participant_id);
					this.answer = res.data.result;
					if (res.data.errorMsg == false) {
						this.$bvToast.toast("La risposta è stata salvata correttamente", {
							variant: "success",
							title: "Salvataggio Ok",
							autoHideDelay: 2000,
							appendToast: true,
						});
					} else {
						//console.log(res);
						throw new Error(res.data.errorMsg);
					}
				}

				this.q = this.getNextQuestion(this.q);
				if (this.q !== null) {
					await this.getTranslatedQuestion(this.q.id, this.survey.id);
				}

				this.updateProgress();
				if (this.q == null) {
					// questionario completato
					if (!this.isTest) {
						await UserService.surveyCompleted(this.survey.id, this.participant_id);
						this.$cookies.remove("participant_id");
						this.$cookies.remove("consenso_questionario");
					}
					this.survey_completed = true;
				}

				window.scrollTo({
					top: 0,
					behavior: "smooth",
				});
			} catch (e) {
				//console.log(e);
				this.$bvToast.toast(String(e), {
					variant: "danger",
					title: "Errore",
					autoHideDelay: 2000,
					appendToast: true,
				});
			} finally {
				this.saving = false;
			}
		},
		checkForm() {
			console.log("answer", this.answer[this.q.id]);
			//console.log("answer lenght", Object.keys(this.answer[this.q.id]).length);
			//console.log("gruppi", this.q.options.groups.length);
			if ((this.answer[this.q.id] == null ||
				this.answer[this.q.id].length == 0 ||
				Object.keys(this.answer[this.q.id]).length === 0) &&
				this.q.questions_surveys[0].compulsory_answer) {
				console.log("obbligatoriaif1", this.q.questions_surveys[0].compulsory_answer);
				alert(this.frasi.obbligatoria);
				return false;
			}
			else if (this.q.questions_surveys[0].options != null &&
				this.q.questions_surveys[0].options.groups != undefined &&
				// (Object.keys(this.answer[this.q.id]).length !== this.q.questions_surveys[0].options.groups.length ) &&
				this.q.questions_surveys[0].compulsory_answer) {
				console.log("obbligatoria", Object.keys(this.answer[this.q.id]).length);
				console.log("obbligatoria2", this.q.questions_surveys[0].options.groups.length);
				console.log("obbligatoria3", this.answer[this.q.id]['altro']);
				console.log("obbligatoria4", this.answer[this.q.id]['altro'] != null);
				console.log("obbligatoria4", this.q.options.allowOther);
				console.log("obbligatoria5", Object.keys(this.answer[this.q.id]).length < (this.q.questions_surveys[0].options.groups.length));
				// check altro
				if (this.q.options.allowOther &&
					(Object.keys(this.answer[this.q.id]).length < (this.q.questions_surveys[0].options.groups.length))
				) {
					console.log("obbligatoria6", this.q.questions_surveys[0].compulsory_answer);
					alert(this.frasi.obbligatoria);
					return false;
				} else if ((!this.q.options.allowOther && Object.keys(this.answer[this.q.id]).length !== this.q.questions_surveys[0].options.groups.length)) {
					console.log("obbligatoria7", this.q.questions_surveys[0].compulsory_answer);
					alert(this.frasi.obbligatoria);

					return false;
				}
				// else{
				// 	console.log("obbligatoria8",this.q.questions_surveys[0].compulsory_answer);
				// 	alert(this.frasi.obbligatoria);

				// 	return false;
				// }
			}
			return true;
		},
		// specifica se una domanda può essere visualizzata oppure no
		canDisplay(question) {
			console.log("Can displayQuestion", question);
			let currQuestionIdx = this.allquestions.indexOf(question);
			if (question.conditions) {
				console.log("Question.conditions");
				// domanda condizionale, verifica se deve essere visualizzata o saltata
				let display = false; // init a false
				// let parentQuestion = this.survey.questions.find((q) => question.conditions.question == q.id);
				let parentQuestion = this.allquestions.find((q) => question.conditions.question == q.id);
				console.log("ParentQuestion", parentQuestion);
				console.log("AllQuestions", this.allquestions.indexOf(parentQuestion));
				console.log("CurrQuestionIdx", currQuestionIdx);
				if (!parentQuestion) {
					parentQuestion = this.conditions.questions.find((q) => question.conditions.question == q.id);
				}
				if (!parentQuestion) {
					// la domanda a cui si riferisce non esiste (non dovrebbe mai succedere)
					display = false;
					// } else if (this.survey.questions.indexOf(parentQuestion) > currQuestionIdx) {
				} else if (this.allquestions.indexOf(parentQuestion) > currQuestionIdx) {
					console.log("allquestions index", this.allquestions.indexOf(parentQuestion), currQuestionIdx);
					display = false; // la domanda da cui dipende è successiva (non ha senso), non la visualizzo
				} else {
					// console.log("ParentQuestion", parentQuestion.id);
					console.log("ParentAnswer", this.answer[parentQuestion.id]);
					let parentAnswer = this.answer[parentQuestion.id];
					// visualizza la domanda condizionale se esiste almeno un match tra risposta data e condizioni
					if (parentQuestion.type == "array") {
						if (!parentAnswer) {
							// non ho risposto
							parentAnswer = {};
						}
						display =
							Object.keys(parentAnswer).map((k) => {
								if (isNaN(k)) return false;
								if (question.conditions.value[k] === undefined) return false;
								// normalizza entrambi i valori ad array (in modo da gestire qualunque caso, ad es. se non ho risposto alla domanda da cui dipende)
								let v1 = Array.isArray(parentAnswer[k]) ? parentAnswer[k] : [parentAnswer[k]];
								console.log("v1", v1);
								let v2 = question.conditions.value[k].map(index => parentQuestion.options.groups[k].options[index]);
								// let v2 = Array.isArray(question.conditions.value[k]) ? question.conditions.value[k] : [question.conditions.value[k]];
								console.log("v2", v2);
								return _.intersection(_.flattenDeep(v1), _.flattenDeep(v2)).length > 0;
							})
								.filter((v) => v == true).length > 0;
						console.log("Display", display);
					} else {
						console.log("Single or Multiple");
						// multiple o single
						if (!parentAnswer) {
							// non ho risposto
							parentAnswer = [];
						}
						// normalizza entrambi i valori ad array (in modo da gestire qualunque caso, ad es. se non ho risposto alla domanda da cui dipende)
						let v1 = Array.isArray(parentAnswer) ? parentAnswer : [parentAnswer];
						console.log("V1", v1);
						// let v2 = Array.isArray(question.conditions.value) ? question.conditions.value : [question.conditions.value];
						// select parentQuestion.options by indexes where question.conditions.value is an array of indexes
						let v2 = question.conditions.value.map(index => parentQuestion.options[index]);
						// let v2 = Array.isArray(question.conditions.value) ? parentQuestion.options[question.conditions.value] : [parentQuestion.options[question.conditions.value]];
						console.log("V2", v2);
						display = _.intersection(_.flattenDeep(v1), _.flattenDeep(v2)).length > 0;
					}
				}
				return display;
			}
			return true;
		},
		// restituisce nell'ordine la prossima domanda da visualizzare
		getNextQuestion(question) {
			let currQuestionIdx = this.survey.questions.indexOf(question);
			if (currQuestionIdx == this.survey.questions.length - 1) {
				return null; // non ci sono altre domande nell'ordine
			}
			let nextQuestion = this.survey.questions[currQuestionIdx + 1];
			if (!this.canDisplay(nextQuestion)) {
				return this.getNextQuestion(nextQuestion);
			}
			return nextQuestion;
		},
		// restituisce nell'ordine la precedente domanda da visualizzare
		getPreviousQuestion(question) {
			let currQuestionIdx = this.survey.questions.indexOf(question);
			if (currQuestionIdx == 0) {
				return null; // non ci sono altre domande nell'ordine
			}
			let prevQuestion = this.survey.questions[currQuestionIdx - 1];
			if (!this.canDisplay(prevQuestion)) {
				return this.getPreviousQuestion(prevQuestion);
			}
			return prevQuestion;
		},
		getTranslatedSurvey() {
			if (this.language == "en") {
				// let t = await UserService.getSurveyTranslations(sid);	
				console.log("survey", this.survey);
				//Se non c'è la traduzione uso la stessa della lingua originale
				if (this.survey._translations.length == 0) {
					this.frasi.welcome = this.survey.welcome;
				} else {
					this.frasi.welcome = this.survey._translations.en.welcome
				}
				return;
			} else {
				this.frasi.welcome = this.survey.welcome;
			}
		},
		//Carica le traduzioni delle opzioni di una domanda
		async getTranslatedQuestion(qid, survey_id) {
			if (this.language == "en") {
				// let t = await UserService.getQuestionTranslations(qid,survey_id);
				// console.log("T",t.data);
				console.log("Q", this.q);
				//console.log("T",_.isEmpty(t.data.tqs));
				//Se non c'è la traduzione uso la stessa della lingua originale
				if (Object.keys(this.q._translations).length == 0 && Object.keys(this.q.questions_surveys[0]._translations).length == 0) {
					console.log("No translation");
					this.frasi.options = this.q.options;
					this.frasi.description = this.q.description;
					this.frasi.long_description = this.q.long_description;
				} else {
					console.log("Translation", this.q.questions_surveys[0]._translations.en);
					// if map question not options
					if (this.q.type != "map") {
						if (Object.keys(this.q.questions_surveys[0]._translations.en).length > 0 && this.q.questions_surveys[0]._translations.en.options.length > 0) {
							console.log("Translation local");
							if (this.q.type == "array") {
								this.frasi.options = {
									groups: this.q.questions_surveys[0]._translations.en.options.split('|').map(pair => pair.split(';'))
										.map((pair, indexgroup) => Object.fromEntries(pair.map(entry => {
											const [key, value] = entry.split(':');
											return [key, key === 'label' ? value : value.split(',').map((value, index) => (
												{
													value: this.q.options.groups[indexgroup].options[index],
													text: value
												}))];
										})))
								};
							} else {
								this.frasi.options = this.q.questions_surveys[0]._translations.en.options.split('|');
							}
						} else {
							if (Object.keys(this.q._translations.en).length > 0 && this.q._translations.en.options.length > 0) {
								console.log("Translation global");
								if (this.q.type == "array") {
									this.frasi.options = {
										groups: this.q._translations.en.options.split('|').map(pair => pair.split(';'))
											.map((pair, indexgroup) => Object.fromEntries(pair.map(entry => {
												const [key, value] = entry.split(':');
												return [key, key === 'label' ? value : value.split(',').map((value, index) => (
													{
														value: this.q.options.groups[indexgroup].options[index],
														text: value
													}))];
											})))
									};
								} else {
									this.frasi.options = this.q._translations.en.options.split('|');
								}
							} else {
								console.log("No translation empty options	");
								this.frasi.options = this.q.options;
							}
						}
					}
					console.log("Translation", this.q.questions_surveys[0]._translations.en);
					if (Object.keys(this.q.questions_surveys[0]._translations.en).length > 0 && this.q.questions_surveys[0]._translations.en.description.length > 0) {
						console.log("Translation local");
						this.frasi.description = this.q.questions_surveys[0]._translations.en.description;
					} else {
						if (Object.keys(this.q._translations.en).length > 0 && this.q._translations.en.description.length > 0) {
							console.log("Translation global");
							this.frasi.description = this.q._translations.en.description;
						} else {
							console.log("No translation empty description	");
							this.frasi.description = this.q.description;
						}
					}
					console.log("Translation", this.q.questions_surveys[0]._translations.en);
					if (Object.keys(this.q.questions_surveys[0]._translations.en).length > 0 && this.q.questions_surveys[0]._translations.en.long_description.length > 0) {
						console.log("Translation local");
						this.frasi.long_description = { description: this.q.questions_surveys[0]._translations.en.long_description };
					} else {
						if (Object.keys(this.q._translations.en).length > 0 && this.q._translations.en.long_description.length > 0) {
							console.log("Translation global");
							this.frasi.long_description = { description: this.q._translations.en.long_description };
						} else {
							console.log("No translation emtpy long_description	");
							this.frasi.long_description = this.q.long_description;
						}
					}

				}


				return;
			}
			this.frasi.options = this.q.options;
			this.frasi.long_description = this.q.long_description;
			this.frasi.description = this.q.description;
		},
		//Questa funzione ricarica le domande, importante sopratutto nel caso di cambio lingua
		async loadQuestions() {
			let q = await UserService.getQuestions(this.survey_id);
			console.log("q", q);
			this.survey = q.data.survey;
			// collect all the questions to mapquestion
			this.allquestions = q.data.survey.questions;

			//Se il questionario non è traducibile, lo metto a false
			////console.log("T", this.survey.show_translation);
			if (this.survey.show_translation != "en") {
				this.canShowTranslation = false;
			}

			// inizia le domande (importantissimo!)
			QuestionService.initQuestions(this.survey.questions, false);
			// rimuovi tutte le domande nascoste
			this.conditions.questions = this.survey.questions.filter((q) => q.questions_surveys[0] && q.questions_surveys[0].hidden);
			this.survey.questions = this.survey.questions.filter((q) => q.questions_surveys[0] && !q.questions_surveys[0].hidden);
			// rimuovi tutte le domande che non hanno un tipo
			this.survey.questions = this.survey.questions.filter((q) => q.type);
			// rimuovi tutte le domande di tipo single, multiple, array con opzioni vuote
			this.survey.questions = this.survey.questions.filter((q) => {
				if ((q.type == "single" || q.type == "multiple" || q.type == "array") && !q.options) {
					return false;
				}
				return true;
			});
			// se qualche domanda non ha section_id prendila dalla parent question
			this.survey.questions.forEach((q) => {
				if (!q.questions_surveys[0].section_id) {
					q.questions_surveys[0].section_id = q.section_id;
				}
			});

			// rimuovi tutte le domande che non hanno una sezione collegata
			this.survey.questions = this.survey.questions.filter((q) => q.questions_surveys[0] && q.questions_surveys[0].section_id && this.sectionIds.indexOf(q.questions_surveys[0].section_id) != -1);

			// ordina le domande per section id e per peso all'interno della section
			this.survey.questions.sort((q1, q2) => {
				let w1 = q1.questions_surveys[0] && q1.questions_surveys[0].weight ? q1.questions_surveys[0].weight : 0;
				let w2 = q2.questions_surveys[0] && q2.questions_surveys[0].weight ? q2.questions_surveys[0].weight : 0;
				if (q1.questions_surveys[0].section_id != q2.questions_surveys[0].section_id) {
					return q1.questions_surveys[0].section_id - q2.questions_surveys[0].section_id;
				} else {
					return w1 - w2;
				}
			});
			// ordina le domande per section id e per peso all'interno della section
			this.allquestions.sort((q1, q2) => {
				let w1 = q1.questions_surveys[0] && q1.questions_surveys[0].weight ? q1.questions_surveys[0].weight : 0;
				let w2 = q2.questions_surveys[0] && q2.questions_surveys[0].weight ? q2.questions_surveys[0].weight : 0;
				if (q1.questions_surveys[0].section_id != q2.questions_surveys[0].section_id) {
					return q1.questions_surveys[0].section_id - q2.questions_surveys[0].section_id;
				} else {
					return w1 - w2;
				}
			});

			// deserilizza le condizioni e rimuovi le condizioni non valide
			this.survey.questions.forEach((q) => {
				if (q.conditions) {
					q.conditions = q.conditions.display == "conditionally" ? q.conditions : false;
				} else {
					q.conditions = false;
				}
			});

			//massimoi 11/9/2020 - devo inizializzare l'array delle risposte
			//perchè nel v-model uso un oggetto a due livelli e non riesce a creare al volo
			//il secondo livello (perchè il primo è undefined)
			this.survey.questions.forEach((question) => {
				if (question.type == "array") {
					this.answer[question.id] = {};
				} else if (question.type == "multiple") {
					this.answer[question.id] = [];
				} else {
					this.answer[question.id] = undefined;
				}
			});

			// il questionario comincia dalla prima domanda nell'ordine che NON sia condizionale (se per errore
			// ci sono domande condizionali all'inizio scartale)
			while (this.survey.questions[0].conditions) {
				this.survey.questions.shift();
			}

			//Carico le traduzioni per la prima domanda
			this.q = this.survey.questions[0];
			await this.getTranslatedQuestion(this.q.id, this.survey.id);

			//Imposto il testo per il modale con il disclaimer iniziale
			if (this.survey.welcome !== null) {
				this.frasi.welcome = this.survey.welcome;
			}

			//Leggo le informazioni generali sul questionario
			//Mostro il consenso se sono in test o se non l'ho ancora fatto
			if (!this.$cookies.isKey("consenso_questionario") || this.isTest) {
				this.$cookies.set("consenso_questionario", false);

			}

			this.q = this.survey.questions[0];
			return q;
		},
		// arrayquestionsinput
		arrayQuestionsInput(selectedValue, index) {
			const options = this.frasi.options.groups[index].options;
			const selectedIndex = options.indexOf(selectedValue);
			// console.log("ArrayQuestionsInput", this.q.options.groups[index].options[selectedIndex]);
			this.answer[this.q.id][index] = this.q.options.groups[index].options[selectedIndex];

		},
	},
	async created() {
		this.busy = true;
		this.survey_id = this.$route.params.survey_id;
		this.participant_id = this.$route.params.participant_id;
		this.$cookies.config("1d");


		let surv_default = await import("@/theme/" + process.env.VUE_APP_THEME + "/survey-defaults");
		// this.frasi.welcome = "";

		try {
			let z = await UserService.getSections();
			this.sections = z.data.sections;

			this.sectionIds = this.sections.map((s) => s.id);
			let q = await this.loadQuestions();
			//Controllo la validità delle date
			const opening_date = new Date(this.survey.opening_date);
			const closing_date = new Date(this.survey.closing_date);
			const current_date = new Date();
			if (opening_date > current_date || closing_date < current_date) {
				//Messaggio di errore
				this.$bvModal.msgBoxOk("Il questionario richiesto è chiuso. Puoi contattare il tuo mobility manager per chiedere informazioni.", {
					title: "Questionario chiuso",
					okVariant: "danger",
				});
			} else {
				//Controllo se l'utente è anonimo
				if (this.participant_id === "anon") {
					//Tolgo il cookie all'anonimo per permettere di gestire postazioni condivise
					this.$cookies.remove("participant_id");
					this.$cookies.remove("consenso_questionario");

					if (this.$cookies.isKey("participant_id")) {
						//Se è anonimo memorizzo lo user in modo che l'utente possa continuare la compilazione
						this.participant_id = this.$cookies.get("participant_id");
					} else {
						const res = await UserService.addAnonParticipant(this.survey_id);
						if (res.data.errorMsg != false) {
							throw new Error(res.data.errorMsg);
						}
						this.participant_id = res.data.participant_id;
						this.$cookies.set("participant_id", this.participant_id);
					}
				} else if (this.participant_id === "test") {
					this.isTest = true;
				}

				if (this.canShowTranslation) {
					this.modalLanguage = true;
				} else {
					this.changeLanguage("it");
				}
			}
			this.busy = false;
		} catch (e) {
			// todo: perchè non riesco a vedere l'effettivo messaggio di errore di cake?
			this.error = e;
			this.survey = false;
			this.busy = false;
		}
	}
};
</script>

<style scoped>
.b-sidebar-header strong {
	color: white;
}

.card-header h2 {
	font-weight: 900 !important;
	font-size: 2em !important;
	line-height: 1.1 !important;
	margin-top: 0;
	margin-bottom: 20px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
	{
	opacity: 0;
}

.btn-flag {
	width: 200px;
}


.card-img-left {
	object-fit: contain;
	max-width: 200px;
	max-height: 200px;
	width: auto;
	height: auto;
}

.card-questionario-mobile {
	padding: 0px 0px;
	box-shadow: none;

	.card-header {
		padding: 0;
		border: none;
	}

	.card-body {
		padding: 10px 0px;
		border: none;
	}
}

.white-shadow {
	box-shadow: 0px 10px 15px 0px rgb(255, 255, 255);
}

.btn-xl {
	font-size: 0.8rem;
	padding: 0.6rem 1rem;
}
</style>
