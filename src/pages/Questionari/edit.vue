<template>
  <div>
    <BreadCrumb v-if="survey_id"  :survey_id="parseInt(survey_id)"></BreadCrumb>

    <!-- introduzione al questionario -->
    <survey-edit-heading 
    :survey="survey" 
    :isTemplate="isTemplate" 
    :survey_id="survey_id"
    :reminder="reminder"
    :reminder2="reminder2"
    :invitation_tpl="invitation_tpl"
    :reminder_tpl="reminder_tpl"
    :invitation_subject="invitation_subject"
    :reminder_subject="reminder_subject"
    :sender_email="sender_email"
    :survey_sending_mode="survey_sending_mode"
      />

    <!-- statistiche sul questionario -->
    <template v-if="!isTemplate" class="mt-3">
      <hr />
      <question-stats :survey_id="survey_id"></question-stats>
    </template>

    <!-- elenco di domande -->
    <b-overlay :show="editingQuestion">
    <question-list 
        :survey_id="survey_id" 
        :sections="sections" 
        :survey="survey"
        :answer="answer"
        @edit-question="editQuestion"        
        @add-question="addQuestion"
      ></question-list>
    </b-overlay>

    <!-- il backdrop della modal non funziona, ne aggiungo uno custom-->
    <div id="forced-modal-backdrop" :hidden="!modal_visible"></div>
    <b-modal id="modal-edit" :title="modal_question" v-model.lazy="modal_visible" class="mt-3" hide-footer>
      <b-overlay :show="isBusy" rounded="sm">
      <div>
        <b-tabs @input="onTabChange($event)">
          <b-tab title="Domande Speciali" md="4" xl="12" v-if="!modal_question.includes('Modifica')">
            <b-form>
              <b-form-group label="Domanda" label-for="input-type" class="mt-2" description="Domanda Predefinite">
                <v-select v-model="newQuestionFromSpecialForm" :options="specialQuestionsForSelect" value="id"
                  label="description" placeholder="Scrivi parole chiavi" @input="getSpecialQuestion($event)">
                </v-select>
              </b-form-group>
            </b-form>

            <div v-if="newQuestionFromSpecialForm.type == 'map'">
              <b-form-group description="Seleziona la lingua" label="Lingua" label-for="input-type" v-if="canShowTranslation">
                      <b-form-select v-model="lang" :options="lang_options" label="Seleziona la lingua"> </b-form-select>
              </b-form-group>
              <map-question :survey_id="this.survey_id"
                      :mapqs_ori="globalModification ? question.long_description.mapqs : question.questions_surveys[0].long_description.mapqs"
                      :language="lang" 
                      :questions="survey.questions">
              </map-question>
            </div>

            <b-form>
              <b-form-group label="Tipo di Domanda" label-for="input-type" class="mt-2"
                description="Tipo di domanda che vorresti fare">
                <b-form-select v-model="question.type" :options="question_options" margin-left="1em"
                  :disabled="disableSelect" v-if="newQuestionFromSpecialForm.type != 'map'">
                </b-form-select>
              </b-form-group>
            </b-form>

            <b-form-group :hidden="['single', 'multiple', 'array'].indexOf(question.type) == -1"
              description="Elenco di opzioni da presentare all'utente" label="Opzioni" label-for="input-options">
              <question-option-editor :canShowTranslation="canShowTranslation" :key="question.id" :type="question.type"
                :trans.sync="question._translations.en.options" v-model.lazy="question.options" v-if="question._translations.en.options !== undefined"
                :disabled="disableInputs" />
            </b-form-group>

            <b-form-textarea id="textarea-rows" placeholder="L'utente deve scrivere qui" rows="5" :disabled=true
              v-if="question.type == 'text'">
            </b-form-textarea>

            <b-form @submit.stop.prevent>
              <b-form-group description="In quale sezione si colloca la domanda" label="Sezione" label-for="input-type">
                <b-form-select v-model.lazy="newQuestionFromSpecialForm.section_id" :options="sections" label="Sezione"
                  value-field="id" text-field="name">
                </b-form-select>
              </b-form-group>

              <b-input-group description="Peso della domanda all'interno del gruppo (se ha maggiore peso compare dopo)"
                label="Peso" label-for="weight">
                <b-form-input type="range" v-model.lazy="newQuestionFromSpecialForm.weight" min="-100" max="+100"
                  step="5"></b-form-input>
                <!-- <div class="mt-2">Value: {{ newQuestionFromExistingForm.weight }}</div> -->
                <b-input-group-append is-text class="text-monospace">
                  {{ newQuestionFromSpecialForm.weight }}
                </b-input-group-append>
              </b-input-group>
              <b-button @click="submitNewQuestionFromSpecial" type="Submit" variant="primary">Salva</b-button>
            </b-form>
          </b-tab>

          <b-tab title="Associa Esistente" md="4" xl="12" v-if="!modal_question.includes('Modifica')">
            <b-form>
              <b-form-group label="Tipo di Domanda" label-for="input-type" class="mt-2"
                description="Tipo di domanda che vorresti fare">
                <b-form-select v-model.lazy="question.type" :options="question_options" margin-left="1em"
                  @input="updateUnusequestions($event)" v-if="newQuestionFromSpecialForm.type != 'map'">
                </b-form-select>
              </b-form-group>

              <b-form-group description="Domanda" label="Domanda" label-for="input-type">
                <v-select v-model="newQuestionFromExistingForm" :options="unusedQuestionsForSelect"
                  label="description" placeholder="Scrivi parole chiavi"
                  @input="getExistingQuestion($event)">
                </v-select>
              </b-form-group>

              <b-form-group readonly :hidden="['single', 'multiple', 'array'].indexOf(question.type) == -1"
                description="Elenco di opzioni da presentare all'utente" label="Opzioni" label-for="input-options">
                <question-option-editor :canShowTranslation="canShowTranslation" :key="question.id" :type="question.type"
                  :trans.sync="question._translations.en.options" v-model.lazy="question.options"
                  v-if="question._translations.en.options !== undefined" :disabled="disableInputs" />
              </b-form-group>

              <b-form-textarea id="textarea-rows" placeholder="L'utente deve scrivere qui" rows="5" :disabled=true
                v-if="question.type == 'text'">
              </b-form-textarea>
            </b-form>

            <b-form @submit.stop.prevent>
              <b-form-group description="In quale sezione si colloca la domanda" label="Sezione" label-for="input-type">
                <b-form-select v-model.lazy="newQuestionFromExistingForm.section_id" :options="sections" label="Sezione"
                  value-field="id" text-field="name">
                </b-form-select>
              </b-form-group>
              <p>Peso</p>
              <b-input-group description="Peso della domanda all'interno del gruppo (se ha maggiore peso compare dopo)"
                label="Peso" label-for="weight">
                <b-form-input type="range" v-model.lazy="newQuestionFromExistingForm.weight" min="-100" max="+100"
                  step="5">
                </b-form-input>
                <b-input-group-append is-text class="text-monospace">
                  {{ newQuestionFromExistingForm.weight }}
                </b-input-group-append>
              </b-input-group>
              <b-button @click="submitNewQuestionFromExisting" type="Submit" variant="primary">Salva</b-button>
            </b-form>
          </b-tab>

          <b-tab :title="modal_question" md="4" xl="12" active v-if="true">
            <hr>
            <b-form-checkbox 
              v-model="globalModification"
              v-if="modal_question != 'Nuova Domanda'"
              class="text-danger">
              <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
              Voglio modificare la domanda in <b>TUTTI</b> i questionari (non solo in questo)
            </b-form-checkbox>
            <label for="nuova" v-else-if="globalModification"> Nuova domanda Generale</label>
            <hr>

            <b-form-group inline label="Tipo di Domanda" label-for="input-type" class="mt-2"
              v-if="question.type != 'map'">
              <b-form-select v-model.lazy="question.type" :options="question_options" margin-left="1em"
                v-if="question.type != 'map'">
              </b-form-select>
            </b-form-group>
          
            <fieldset>

              <b-form-group description="La domanda che vede l'utente" label="Domanda" label-for="input-description"
                v-if="globalModification">
                <b-form-input id="input-description" :value="question.description"
                  @blur="updateField('description', $event)" trim maxlength="200">
                </b-form-input>
              </b-form-group>
              <b-form-group description="La domanda che vede l'utente" label="Domanda" label-for="input-description"
                v-else>
                <b-form-input id="input-description" :value="question.questions_surveys[0].description"
                  @blur="updateField('questions_surveys.description', $event)" trim maxlength="200">
                </b-form-input>
              </b-form-group>
              <b-form-group
                description="La domanda che vede l'utente"
                label="Domanda"
                label-for="input-description"
                v-else>
                  <b-form-input
                    id="input-description"
                    :value="question.questions_surveys[0].description"
                    @blur="updateField('questions_surveys.description', $event)"
                    trim
                    maxlength="200">
                  </b-form-input>
              </b-form-group>

              <b-form-group v-if="canShowTranslation && globalModification" label="EN 🇬🇧 > Titolo della domanda"
                label-for="input-description-en">
                <b-form-input v-if="canShowTranslation" id="input-description-en" :value="question._translations.en.description"
                  @blur="updateField('_translations.en.description', $event)" trim>
                </b-form-input>
              </b-form-group>
              <b-form-group v-else-if="canShowTranslation && !globalModification" label="EN 🇬🇧 > Titolo della domanda"
                label-for="input-description-en">
                <b-form-input v-if="canShowTranslation" id="input-description-en"
                  :value="question.questions_surveys[0]._translations.en.description" @blur="updateField('questions_surveys._translations.en.description', $event)" trim>
                </b-form-input>
              </b-form-group>
              <b-form-group
                v-else-if="canShowTranslation && !globalModification"
                label="EN 🇬🇧 > Titolo della domanda"
                label-for="input-description-en">
                  <b-form-input              
                    v-if="canShowTranslation"
                    id="input-description-en"
                    :value="question.questions_surveys[0]._translations.en.description"
                    @blur="updateField('questions_surveys._translations.en.description', $event)"
                    trim>
                  </b-form-input>
              </b-form-group>
            </fieldset>

            <fieldset >
              <b-form-group description="In questa casella vanno inserite spiegazioni approfondite"
                label="Descrizione Estesa" label-for="input-long-description" v-if="globalModification && (question.type != 'map')">
                <b-form-textarea id="input-long-description" :value="question.long_description.description"
                  @blur="updateField('long_description.description', $event)" trim maxlength="500">
                </b-form-textarea>
              </b-form-group>
              <b-form-group description="In questa casella vanno inserite spiegazioni approfondite"
                label="Descrizione Estesa" label-for="input-long-description" v-else-if="(question.type != 'map')">
                <b-form-textarea id="input-long-description" :value="question.questions_surveys[0].long_description.description"
                  @blur="updateField('questions_surveys.long_description.description', $event)" trim maxlength="500">
                </b-form-textarea>
              </b-form-group>
              <b-form-group v-if="canShowTranslation && globalModification  && (question.type != 'map')" label=" EN 🇬🇧 > Descrizione Estesa"
                label-for="input-long-description-en">
                <b-form-textarea id="input-long-description-en" v-if="canShowTranslation "
                  :value="question._translations.en.long_description" @blur="updateField('_translations.en.long_description', $event)" trim>
                </b-form-textarea>
              </b-form-group>
              <b-form-group v-if="canShowTranslation && !globalModification  && (question.type != 'map')" label=" EN 🇬🇧 > Descrizione Estesa"
                label-for="input-long-description-en">
                <b-form-textarea id="input-long-description-en" v-if="canShowTranslation "
                  :value="question.questions_surveys[0]._translations.en.long_description"
                  @blur="updateField('questions_surveys._translations.en.long_description', $event)" trim>
                </b-form-textarea>
              </b-form-group>
            </fieldset>

            <b-form-textarea id="textarea-rows" placeholder="L'utente deve scrivere qui" rows="5" :disabled=true
              v-if="question.type == 'text'">
            </b-form-textarea>
            <div v-if="question.type == 'map'">
              <!-- b-form-select the language to show the map question  and update component map-question-->
              <div>
                <b-tabs content-class="mt-3">
                  <b-tab title="Italiano" active>
                    <map-question-edit :survey_id="this.survey_id"
                      :mapqs_ori="globalModification ? question.long_description.mapqs : question.questions_surveys[0].long_description.mapqs"
                      language="it"
                      :questions="survey.questions" 
                      :map_id="question.id"
                      @edit-question="editQuestion">
                    </map-question-edit>
                  </b-tab>
                  <b-tab title="Inglese" v-if="canShowTranslation">
                    <map-question-edit :survey_id="this.survey_id"
                      :mapqs_ori="globalModification ? question.long_description.mapqs : question.questions_surveys[0].long_description.mapqs"
                      language="en" 
                      :questions="survey.questions"
                      :map_id="question.id"
                      @edit-question="editQuestion">
                    </map-question-edit>
                  </b-tab>
                  <b-tab title="Versione Finale">
                    <b-form-group description="Seleziona la lingua" label="Lingua" label-for="input-type" v-if="canShowTranslation">
                      <b-form-select v-model="lang" :options="lang_options" label="Seleziona la lingua"> </b-form-select>
                    </b-form-group>
                    <map-question :survey_id="this.survey_id"
                      :mapqs_ori="globalModification ? question.long_description.mapqs : question.questions_surveys[0].long_description.mapqs"
                      :language="lang" 
                      :questions="survey.questions">
                    </map-question>
                  </b-tab>
                </b-tabs>
              </div>
              <!-- <map-question :survey_id="this.survey_id"
                :mapqs_ori="globalModification ? question.long_description.mapqs : question.questions_surveys[0].long_description.mapqs"
                :language="lang" :key="lang + (globalModification)">
              </map-question> -->
            </div>
            <!-- affinchè le opzioni si aggiornino correttamente nei campi di tipo devo
                    renderizzarlo sempre (nascondendolo opportunamente) altrimenti in certe situazioni
                    (es. prima setto 'array', poi 'text', poi 'single') mi ritrovo opzioni errate (array renderizzati)-->
            <b-form-group :hidden="['single', 'multiple', 'array'].indexOf(question.type) == -1"
              description="Elenco di opzioni da presentare all'utente" label="Opzioni" label-for="input-options"
              v-if="globalModification">
              <question-option-editor :canShowTranslation="canShowTranslation" :key="question.id + globalModification"
                :type="question.type" :trans.sync="question._translations.en.options" v-model.lazy="question.options"
                v-if="question._translations.en.options !== undefined" />
            </b-form-group>
            <b-form-group :hidden="['single', 'multiple', 'array'].indexOf(question.type) == -1"
              description="Elenco di opzioni da presentare all'utente" label="Opzioni" label-for="input-options" v-else>
              <question-option-editor :canShowTranslation="canShowTranslation" :key="question.id + globalModification + showDismissibleAlert "
                :type="question.type" :trans.sync="question.questions_surveys[0]._translations.en.options"
                v-model.lazy="question.questions_surveys[0].options" v-if="question.questions_surveys[0]._translations.en.options !== undefined" />
            </b-form-group>

            <input type="hidden" name="id" :value="question.id" />
            <br>
            <b-form-checkbox inline id="input-compulsory-answer" v-model="question.compulsory_answer"
              v-if="globalModification">Risposta Obbligatoria
            </b-form-checkbox>
            <b-form-checkbox inline id="input-compulsory-answer" v-model="question.questions_surveys[0].compulsory_answer"
              v-else>Risposta Obbligatoria
            </b-form-checkbox>

            
            <b-form-group description="In quale sezione si colloca la domanda" label="Sezione" label-for="input-type">
              <b-form-select v-model.lazy="question.section_id" :options="sections" value-field="id"
                text-field="name"v-if="globalModification">
              </b-form-select>
              <b-form-select v-model.lazy="question.questions_surveys[0].section_id" :options="sections" value-field="id"
                text-field="name"v-else>
              </b-form-select>
            </b-form-group>

            <b-form-group label=" Codice della Domanda" description="Codice Breve della Domanda (es: quanti-km)"
              class="question-edit">
              <b-form-input id="input-name" :value="questionCode(question.name)" @change="question.name = $event"
                maxlength="20" trim>
              </b-form-input>
            </b-form-group>

            <div>
              <b-button v-b-toggle.collapse-1 variant="primary">Avanzate</b-button>
              <b-collapse id="collapse-1" class="mt-2">
                <b-form-group description="Peso della domanda all'interno del gruppo (se ha maggiore peso compare dopo)"
                  :label="`Peso: ${question.questions_surveys[0].weight}`" label-for="weight" v-if="globalModification">
                  <b-form-input type="range" v-model.lazy="question.questions_surveys[0].weight" min="-100" max="+100">
                  </b-form-input>
                  <question-condition-editor :key="question.id + globalModification" v-model="question.conditions"
                    :canShowTranslation="canShowTranslation" :id="question.id" :survey_id="survey_id" v-if="globalModification"/>
                </b-form-group>
                <b-form-group description="Peso della domanda all'interno del gruppo (se ha maggiore peso compare dopo)"
                  :label="`Peso: ${question.questions_surveys[0].weight}`" label-for="weight" v-else>
                  <b-form-input type="range" v-model.lazy="question.questions_surveys[0].weight" min="-100" max="+100">
                  </b-form-input>
                  <question-condition-editor :key="question.id + globalModification + showDismissibleAlert"
                    v-model="question.questions_surveys[0].conditions" :canShowTranslation="canShowTranslation" :id="question.id"
                    :survey_id="survey_id" v-if="!globalModification" />
                </b-form-group>
                <div v-if="loggedUserIsAdmin && question.type == 'map'">
                  <b-button @click="editQuestion(mezziId,question.id)">Mezzi</b-button>
                  <div class="text-danger mt-2">
                  <i aria-hidden="true" class="fa fa-exclamation-triangle "></i>
                  <span><b>&nbsp;NON</b> modificare la domanda se si è inesperti</span>  
                </div>
                
              </div>
              </b-collapse>
            </div>
            <br>
            <b-button v-if="map_id!=null" @click="editQuestion(map_id)" type="Submit" variant="primary" class="mb-3">Indietro</b-button>
            <b-row align-h="between">
              <b-col cols="3">
                <b-button v-if="((map_id!=null) || globalModification) && modal_question.includes('Modifica')" @click="showAlert=true" type="Submit" variant="primary">Salva</b-button>
                <b-button v-else @click="submitQuestion" type="Submit" variant="primary">Salva</b-button>
              </b-col>

              <b-col cols="3">
                  <b-button 
                    v-if="modal_question.includes('Modifica')"
                    @click="showDismissibleAlert=true"
                    variant="danger"
                    :disabled="globalModification"
                    class="m-1"
                    cols="3">
                    Reset
                  </b-button>
              </b-col>
              <b-alert v-if="modal_question.includes('Modifica')" v-model="showDismissibleAlert" variant="danger" dismissible>
                <p class="mr-3">Sei sicuro di voler riportare la domanda alle date della versione globale?</p>
                    <b-button @click="resetQuestionsGlobal" variant="primary" class="mt-2 mr-5">
                    Accettare
                  </b-button>
              </b-alert>
            </b-row>
            <b-row>
              <b-alert v-if="((map_id!=null) || globalModification) && modal_question.includes('Modifica')" v-model="showAlert" variant="danger" dismissible>
                <p v-if="map_id!=null" class="mr-2">Ricorda che se salvi questa domanda le modifiche apportate nel dominio mappa non verranno salvate.</p>
                <p v-if="globalModification" class="mr-3">Ricorda che stai modificando una domanda globale, per questo motivo tutte le domande del questionario verranno modificate. 
                  Se si desidera disattivare la funzione globale deselezionare il cheklist in alto. </p>
                <br>
                  <b-button @click="submitQuestion" variant="primary" class="mt-2 mr-5">
                    Accettare
                  </b-button>
                </b-alert>
            </b-row>
          </b-tab>
        </b-tabs>
      </div>
    </b-overlay>
    </b-modal>
  </div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import MapQuestion from "@/components/MapQuestion.vue";
import QuestionService from "@/services/question.service";
import QuestionOptionEditor from "@/components/QuestionOptionEditor";
import QuestionConditionEditor from "@/components/QuestionConditionEditor";
import QuestionConditionInfo from "@/components/QuestionConditionInfo";
import QuestionStats from "@/components/QuestionStats";
import QuestionList from "@/components/QuestionList";
import SurveyEditHeading from "@/components/SurveyEditHeading";
import MapQuestionEdit from "@/components/MapQuestionEdit.vue";

import slugify from "slugify";
import _ from "lodash";
import { Map } from "leaflet";
import vSelect from "vue-select";
import BreadCrumb from "../../components/BreadCrumb.vue";

const EMPTY_QUESTION = {
  id: "",
  name: "",
  description: "",
  long_description: { description: "", mapqs: [] },
  type: "",
  options: [],
  section_id: null,
  compulsory_answer: false,
  _translations: {
    en: {
      description: "",
      long_description: "",
      options: "",
    },
  },
  questions_surveys: [{
    id: "",
    name: "",
    description: "",
    long_description: { description: "", mapqs: [] },
    type: "",
    options: [],
    section_id: null,
    compulsory_answer: false,
    _translations: {
      en: {
        description: "",
        long_description: "",
        options: "",
      },
    },
  },],
};


export default {
  components: {
    MapQuestion,
    QuestionOptionEditor,
    QuestionConditionEditor,
    QuestionConditionInfo,
    QuestionStats,
    QuestionList,
    SurveyEditHeading,
    vSelect,
    MapQuestionEdit,
    BreadCrumb,
  },
  mixins: [Util],
  name: "QuestionariEdit",
  data() {
    return {
      disableSelect: true,
      disableInputs: true,
      disableForm: true,
      globalModification: false,
      survey: {
        welcome: "",
        survey_delivery_config: {
          mail_footer: "",
        },
        _translations: {
                        en: 
                        {
                          welcome: ""
                        }
                      },
      },
      answer: [],
      sections: [],
      company_id: 0,
      office_id: 0,
      survey_id: null,
      modal_visible: false,
      modal_question: "",
      current_section: null,

      question_options: [],
      question: EMPTY_QUESTION,

      newQuestionType: "new",
      unusedQuestions: [],
      unusedQuestionsForSelect: [],
      unusedQuestionsForSelectType: [],
      newQuestionFromExistingForm: {
        id: null,
        section_id: null,
        weight: 0,
      },
      newQuestionFromSpecialForm: {
        id: null,
        section_id: null,
        weight: 0,
      },
      editingQuestion: false,
      testLink: "",
      weightOpts: _.range(-50, 100),
      deletingQuestion: false,
      waitImportCompanyUsers: false,

      specialQuestions: [],
      specialQuestionsForSelect: [],
      lang: 'it',
      lang_options: [
        { value: 'it', text: 'Italiano' },
        { value: 'en', text: 'Inglese' },
      ],
      reminder: 2,
      reminder2: 5,
      invitation_subject: "",
      invitation_tpl: "",
      notificationsTarget: null,
      reminder_subject: "",
      reminder_tpl: "",
      sender_email: "",
      survey_sending_mode: "",
      showDismissibleAlert: false,
      map_id: null,
      showAlert: false,
      isBusy: false,
      mezziId: null,
    };

  },

  mounted: async function () {
    //Importo le costanti
    let self = this;
    let surv_default = await import(
      "@/theme/" + process.env.VUE_APP_THEME + "/survey-defaults"
    );
    self.survey.welcome = surv_default.welcome;
    self.invitation_tpl = surv_default.invitation_tpl;
    self.invitation_subject = surv_default.invitation_subject;
    self.reminder_subject = surv_default.reminder_subject;
    // self.survey.en.welcome = surv_default.welcome_eng;

    UserService.getSurveyEdit(this.survey_id).then(
      (response) => {
        let survey = response.data.survey;
        console.log("survey edit", survey);
        if (survey._translations.length == 0) {
          survey._translations = { 
                                      en : {welcome: "" }
                                    };
        }
        this.survey = survey;
        if (self.survey.welcome == null || self.survey.welcome == "") {
          self.survey.welcome = surv_default.welcome;
        }
        if (self.survey._translations.en.welcome == null || self.survey._translations.en.welcome == "") {
          self.survey._translations.en.welcome = surv_default.welcome_eng;
        }
        
        console.log("survey", this.survey);
        QuestionService.initQuestions(this.survey.questions);
        if (this.survey.survey_delivery_config) {
          this.reminder =
            this.survey.survey_delivery_config.days_before_first_reminder;
          this.reminder2 =
            this.survey.survey_delivery_config.days_before_second_reminder;
          this.invitation_tpl =
            this.survey.survey_delivery_config.invitation_template;
          this.reminder_tpl =
            this.survey.survey_delivery_config.reminder_template;
          this.invitation_subject =
            this.survey.survey_delivery_config.invitation_subject;
          this.reminder_subject =
            this.survey.survey_delivery_config.reminder_subject;
          this.sender_email = this.survey.survey_delivery_config.sender_email;
          if (this.survey.survey_delivery_config.is_active) {
            this.survey_sending_mode = "n";
          }
          if (!this.survey.survey_delivery_config.mail_footer) {
            this.survey.survey_delivery_config.mail_footer = "";
          }
        }
      },
      (error) => this.showError(error)
    );
    if (this.sender_email == "") {
            this.sender_email = this.help_mail;
        }
    // let res = await UserService.getSurveyTranslations(this.survey_id);
    // //console.log("res", res);
    // let translations = res.data.t;
    // if (translations !== undefined && translations.en !== undefined) {
    //   this.survey.en = translations.en;
    // }

  },

  methods: {
    questionCode: function (n) {
      return slugify(n);
    },
    async editQuestion(qid,map_id=null) {
      this.globalModification = false;
      this.map_id=map_id;
      this.modal_visible = true;
      this.modal_question = `Modifica domanda ${qid}`;

      let question = this.survey.questions.find((x) => x.id === qid);
      console.log(`question edit`, question);
      if (question.long_description == null) {
        question.long_description = { description: "" };
      }
      console.log("en editQuestion", question.questions_surveys[0]._translations.en == null);
      if (question.questions_surveys[0]._translations.en == null) {
        console.log("en editQuestion", question.en);
        question.questions_surveys[0]._translations.en = JSON.parse(JSON.stringify(question._translations.en));
      }
      if (question.questions_surveys[0].description == null) {
        // this.globalModification = true;
        console.log("global modification true")
        question.questions_surveys[0].description = question.description;
      } 
      // else {
      //   // this.globalModification = false;
      //   console.log("global modification false")
      // }
      if (question.questions_surveys[0].long_description == null || question.questions_surveys[0].long_description.length == 0) {
        console.log("questions surveylong_description", question.long_description);
        question.questions_surveys[0].long_description = JSON.parse(JSON.stringify(question.long_description));
      }
    if (question.questions_surveys[0].options == null && question.options != null) {
        question.questions_surveys[0].options = JSON.parse(JSON.stringify(question.options));
      }
      if (question.questions_surveys[0].conditions == null) {
        question.questions_surveys[0].conditions = JSON.parse(JSON.stringify(question.conditions));
      }
      //console.log("questionafter", question);
      console.log("en.options->", question._translations.en.options);
      console.log("en.options->", question.questions_surveys[0]._translations.en.options);
      console.log("en.options->", question.questions_surveys[0]._translations.en.options.length <= 2);
      if (question.options != null && (question._translations.en.options == undefined || question._translations.en.options == null || question._translations.en.options.trim() === '' || question._translations.en.options.length <= 2)) {
        if(question.type == 'array'){
          question._translations.en.options = question.options.groups.map(obj => Object.entries(obj).map(entry => entry.join(':')).join(';')).join('|');
        }else{
          question._translations.en.options = question.options.join('|');
        }
      }
      if (question.options != null && (question.questions_surveys[0]._translations.en.options == undefined || question.questions_surveys[0]._translations.en.options == null || question.questions_surveys[0]._translations.en.options.trim() === '' || question.questions_surveys[0]._translations.en.options.length <= 2)) {
        if(question.type == 'array'){
          console.log("question.options", question.options);
          question.questions_surveys[0]._translations.en.options = question.options.groups.map(obj => Object.entries(obj).map(entry => entry.join(':')).join(';')).join('|');
        }else{
          question.questions_surveys[0]._translations.en.options = question.options.join('|');
        }
      }
      this.question = question;
      //console.log("thisquestionafter", this.question);
      // let res = await UserService.getQuestionTranslations(qid, this.survey.id);
      //console.log("res", res);
      // let translations = res.data.t;
      // if (translations !== undefined && translations.en !== undefined) {
      //   this.question._translations.en = JSON.parse(translations.en);
      // }
      // let translations_join = res.data.tqs;
      // if (translations_join !== null) {
      //   if (translations_join !== undefined && translations !== undefined) {
      //     if (translations_join.en !== undefined) {
      //       this.question.questions_surveys[0]._translations.en = JSON.parse(JSON.stringify(translations_join.en));
      //     } else {
      //       this.question.questions_surveys[0]._translations.en = JSON.parse(JSON.stringify(translations.en));
      //     }
      //   }
      // }
      // console.log("en.options->", this.question._translations.en.options);
      // if (this.question._translations.en.options == undefined || this.question._translations.en.options == null) {
      //   this.question._translations.en.options = this.question.options;
      // }
      // if (this.question.questions_surveys[0]._translations.en.options == undefined) {
      //   this.question.questions_surveys[0]._translations.en.options = JSON.parse(JSON.stringify(this.question.options));
      // }
      //console.log(`this.question`, this.question);

      // console.log("en.options->", this.question._translations.en.options);
      ////console.log("Question-->", this.question);
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    async getSpecialQuestion(qs) {
      this.newQuestionFromSpecialForm.section_id=this.question.section_id;

      this.question = {
        ...this.specialQuestions.find(
          (q) => q.id == qs.id
        ),
        // // la domanda esiste già, NON modifico la sua section originale (modifico solo quella nella survey)
        // questions_surveys: [{
        //   hidden: 0,
        //   compulsory: 0,
        //   section_id: this.newQuestionFromSpecialForm.section_id,
        //   survey_id: this.survey.id,
        //   weight: this.newQuestionFromSpecialForm.weight,
        // },],
      };
      if(this.question.type !== "map"){
        this.question=this.checkquestion(this.question);
      }
      // if (this.question.long_description == null) {
      //   this.question.long_description = { description: "" };
      // }
      // this.checkquestion(question);
      // this.question=question;
      // let res = await UserService.getQuestionTranslations(qs.id, this.survey.id);
      // let translations = res.data.t;
      // if (translations !== undefined && translations.en !== undefined) {
      //   this.question._translations.en = translations.en;
      // }
      // let translations_join = res.data.tqs;
      // if (translations_join !== null) {
      //   if (translations_join !== undefined && translations !== undefined) {
      //     if (translations_join._translations.en !== undefined) {
      //       this.question.questions_surveys[0]._translations.en = JSON.parse(JSON.stringify(translations_join.en));
      //     } else {
      //       this.question.questions_surveys[0]._translations.en = JSON.parse(JSON.stringify(translations.en));
      //     }
      //   }
      // }

      // if (this.question._translations.en.options == undefined) {
      //   this.question._translations.en.options = JSON.parse(JSON.stringify(this.question.options));
      // }

      ////console.log("en.options->", this.question.en.options);
      //console.log("Question-->", this.question);
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    async getExistingQuestion(qe) {
      try{
        this.newQuestionFromExistingForm.section_id=this.question.section_id;
        // if(this.newQuestionFromExistingForm.weight == null)
        //   this.newQuestionFromExistingForm.weight=0;
        // console.log("qe", qe);
        
        this.question = {
          ...this.unusedQuestions.find(
            (q) => q.id == qe.id
          ),
          // // la domanda esiste già, NON modifico la sua section originale (modifico solo quella nella survey)
          // questions_surveys: [{
          //   hidden: 0,
          //   compulsory: 0,
          //   section_id: this.newQuestionFromExistingForm.section_id,
          //   survey_id: this.survey.id,
          //   weight: this.newQuestionFromExistingForm.weight,
          // },],
        };
        // if (this.question.long_description == null) {
        //   this.question.long_description = { description: "" };
        // }
        // console.log("question", this.question);
        this.question=this.checkquestion(this.question);
        
      }catch(e){
        console.log(e);
      }
      // return qe;
      //console.log("this.question", this.question);
      // let res = await UserService.getQuestionTranslations(qe.id, this.survey.id);
      // let translations = res.data.t;
      // if (translations !== undefined && translations.en !== undefined) {
      //   this.question._translations.en = translations.en;
      // }
      // let translations_join = res.data.tqs;
      // if (translations_join !== null) {
      //   if (translations_join !== undefined && translations !== undefined) {
      //     if (translations_join.en !== undefined) {
      //       this.question.questions_surveys[0]._translations.en = JSON.parse(JSON.stringify(translations_join.en));
      //     } else {
      //       this.question.questions_surveys[0]._translations.en = JSON.parse(JSON.stringify(translations.en));
      //     }
      //   }
      // }

      // if (this.question._translations.en.options == undefined) {
      //   this.question._translations.en.options = JSON.parse(JSON.stringify(this.question.options));
      // }

      //console.log("en.options->", this.question.en.options);
      //console.log("Question-->", this.question);
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

   
    onTabChange(tab) {
      //console.log(tab);
      switch (tab) {
        case 0:
          this.newQuestionType = "speciali";
          break;
        case 1:
          this.newQuestionType = "esistente";
          break;
        case 2:
          this.newQuestionType = "new";
      }
      if (!this.modal_question.includes("Modifica")) {
        this.question = {};
        this.question = EMPTY_QUESTION;
        this.newQuestionFromExistingForm = {
          id: null,
          section_id: this.question.section_id,
          weight: 0,
        };
        this.newQuestionFromSpecialForm = {
          id: null,
          section_id: this.question.section_id,
          weight: 0,
        };
        this.question.name = "Nuova Domanda";
        this.question.description = "";
        this.question.long_description = { description: "" };
        this.question._translations.en = {
          description: "",
          long_description: "",
          options: "",
        };
        this.question.type = "";
        this.question.questions_surveys[0] = {
          survey_id: this.survey_id,
          section_id: this.question.section_id,
          hidden: 0,
          compulsory: 0,
          weight: 0,
          long_description: { description: "" },
          _translations:{
            en: {
              description: "",
              long_description: "",
              options: "",
            },
          },
        };
      }

    },

    updateField: function (field, e) {
      //Questo serve per gestire i campi lingua
      // I need to update the question object with the new value of the field (e.target.value) but also need using key values field can be "name" or "description" or "en.description" or "en.options[0].description" or "long_description.descrition"
      console.log("field", field);
      console.log("e", e);
      console.log("this.question", this.question);
      // Convert string to array
      let field_array = field.split("."); // Splits the string into an array of characters


      console.log("e.target.value", e.target.value);
      
      if (field_array[0]=="questions_surveys") {
        if (field_array[1] == "_translations") {
          console.log("e.target.value", e.target.value);
          this.question[field_array[0]][0][field_array[1]][field_array[2]][field_array[3]] = e.target.value;
          // this.question[pre][post][join] = e.target.value;
          console.log("this.question", this.question);
        } else {
          if(field_array[2]){
            this.question[field_array[0]][0][field_array[1]][field_array[2]] = e.target.value;
          }else{
            this.question[field_array[0]][0][field_array[1]] = e.target.value;
          }

          // this.question[field_array[0]][0][field_array[1]] = e.target.value;
          // this.question[pre][post] = e.target.value;
        }
      } else {
        if(field_array[0] == "_translations"){
          if(field_array[2]){
            this.question[field_array[0]][field_array[1]][field_array[2]] = e.target.value;
          }
        }else{
          if (field_array[1]) {
            this.question[field_array[0]][field_array[1]] = e.target.value;
          } else {
            this.question[field] = e.target.value;
          }
        }
      }
      //console.log("this.question", this.question);

    },

    submitNewQuestionFromExisting: async function () {
      if (
        !this.newQuestionFromExistingForm.id ||
        !this.newQuestionFromExistingForm.section_id
      ) {
        this.$bvToast.toast(
          "Selezionare una domanda e una sezione per procedere",
          {
            title: "Errore",
            variant: "warning",
            autoHideDelay: 2000,
            appendToast: true,
          }
        );
        return;
      }
      this.question = {
        ...this.unusedQuestions.find(
          (q) => q.id == this.newQuestionFromExistingForm.id
        ),
        // la domanda esiste già, NON modifico la sua section originale (modifico solo quella nella survey)
        questions_surveys: [{
          hidden: 0,
          compulsory: 0,
          section_id: this.newQuestionFromExistingForm.section_id,
          survey_id: this.survey.id,
          weight: this.newQuestionFromExistingForm.weight,
        },],
      };
      this.question=this.checkquestion(this.question);
      await this.submitQuestion();
    },
    submitNewQuestionFromSpecial: async function () {
      if (
        !this.newQuestionFromSpecialForm.id ||
        !this.newQuestionFromSpecialForm.section_id
      ) {
        this.$bvToast.toast(
          "Selezionare una domanda e una sezione per procedere",
          {
            title: "Errore",
            variant: "warning",
            autoHideDelay: 2000,
            appendToast: true,
          }
        );
        return;
      }
      this.question = {
        ...this.specialQuestions.find(
          (q) => q.id == this.newQuestionFromSpecialForm.id
        ),
        // la domanda esiste già, NON modifico la sua section originale (modifico solo quella nella survey)
        questions_surveys: [{
          hidden: 0,
          compulsory: 0,
          section_id: this.newQuestionFromSpecialForm.section_id,
          survey_id: this.survey.id,
          weight: this.newQuestionFromSpecialForm.weight,
        },],
      };
      if(this.question.type !== "map"){
        this.question=this.checkquestion(this.question);
      }
      
      await this.submitQuestion();
    },
    submitQuestion: async function () {
      //console.log("question save",this.question);
      this.showAlert=false;
      this.isBusy=true;
      // se posso editare i campi della domanda, validala
      if (
        this.loggedUserIsAdmin ||
        this.loggedUserIsMomaArea ||
        (this.loggedUserIsMomaAzienda &&
          this.loggedUserId == this.question.creator_id)
      ) {
        // valida la domanda
        let validationErrors = [];
        if (!this.question.name) {//this.newquestion=false;
          validationErrors.push("Specificare un codice");
        } else {
          let q = (await UserService.getQuestionList()).data.questions.find((x) => {
            if(x.name != null ){ 
              return x.name.toLowerCase() === this.question.name.toLowerCase()
            }else{
              //console.log("question name null",x);
            }
          });
          
          if (!this.modal_question.includes("Modifica")) {
            if (q && this.newQuestionType.includes("new")) {
              //this.newquestion=false;
              validationErrors.push("Il codice esiste già");
            }
          }
        }

        if (!this.question.description) {
          validationErrors.push("Specificare una descrizione");
        }
        if (!this.question.type) {
          validationErrors.push("Specificare un tipo");
        }
        if (
          this.question.type &&
          ["single", "multiple"].indexOf(this.question.type) != -1
        ) {
          try {
            let options = this.question.options;
            ////console.log(options);            
            if (!Array.isArray(options) || options.length == 0) {
              validationErrors.push("Specificare almeno una opzione");
            } else {
              if (options.filter((o) => String(o).length == 0).length > 0) {
                validationErrors.push("Una o più opzioni sono vuote");
              }
            }
          } catch (e) {
            console.log(e);
            validationErrors.push("Specificare almeno una opzione");
            this.isBusy=false;
          }
        }
        if (this.question.type == "array") {
          try {
            let options = this.question.options;
            if (!Array.isArray(options.groups) || options.groups.length == 0) {
              validationErrors.push("Specificare almeno un gruppo di opzioni");
            } else {
              options.groups.forEach((group) => {
                if (String(group.label).length == 0) {
                  validationErrors.push(
                    "Specificare una label per il gruppo di opzioni"
                  );
                }
                if (
                  !Array.isArray(group.options) ||
                  group.options.length == 0
                ) {
                  validationErrors.push(
                    "Specificare almeno una opzione per ogni gruppo"
                  );
                }
                if (
                  group.options.filter((o) => String(o).length == 0).length > 0
                ) {
                  validationErrors.push("Una o più opzioni sono vuote");
                }
              });
            }
          } catch (e) {
            console.log(e);
            validationErrors.push("Specificare almeno una opzione");
          }
        }
        if (validationErrors.length) {
          this.$bvToast.toast(validationErrors.join(", "), {
            title: "Attenzione",
            variant: "warning",
            autoHideDelay: 2000,
            appendToast: true,
          });
          this.isBusy=false;
          return;
        }
      }

      this.editingQuestion = true;
      try {
        if (!this.question.id) {
          // in caso di aggiunta di nuova domanda il form è binded sulla section della domanda, devo
          // sempre aggiornare la section della domanda generale nel caso sia cambiata
          this.question.section_id = this.question.questions_surveys[0].section_id;
          this.question.survey_id = this.question.questions_surveys[0].survey_id;
        }

        //@massimoi - 10 ottobre 2023
        //Dopo aver fatto tutti i controlli salvo davvero la domanda
        //If questions options are not empty I copy  thie options in the options di joinData
        //TODO: mettere un flag che permette all'utente di specificare se la modifica è globale o solo per la survey corrente

        //Faccio lo stesso su conditions, descritpion e long_description solo se non c'è il flag "globale"

        const result = await UserService.editQuestionFromSurvey(this.question, this.globalModification);
        console.log(`result`, result);
        if (result.data.errorMsg != false) {
          throw new Error(result.data.errorMsg);
        }
        // per semplicità e pulizia aggiorno facendo un full refresh
        const updatedSurvey = await UserService.getSurveyEdit(this.survey.id);
        console.log(`updatedSurvey`, updatedSurvey);
        this.survey.questions = updatedSurvey.data.survey.questions;
        QuestionService.initQuestions(this.survey.questions, true);
        this.modal_visible = false;
        if(this.map_id!=null)
        {
          this.editQuestion(this.map_id)
        }
      } catch (e) {
        this.showError(e);
        console.log(e);
        this.editingQuestion = false;
        this.isBusy=false;
      } finally {
        this.editingQuestion = false;
        this.isBusy=false;
      }
    },
    //Aggiungo una domanda alla sezione dove l'utente ha fatto click
    async addQuestion(section_id_value) {
      console.log("addQuestion", section_id_value);
      this.globalModification = true;
      this.newQuestionFromExistingForm = {
        // resetta sempre
        id: null,
        section_id: section_id_value,
        weight: 0,
      };
      
      this.newQuestionFromSpecialForm = {
        // resetta sempre
        id: null,
        section_id: section_id_value,
        weight: 0,
      };
      
      try {
        // fai sempre un refresh con le domande correnti non usate
        let s = await UserService.getAllUnusedQuestions(this.survey.id);
        if (s !== undefined) {
          this.unusedQuestions = s.data.questions;
        }
        console.log("unused", s);
        QuestionService.initQuestions(this.unusedQuestions, true); // importante!
        console.log("unused",this.unusedQuestions);
        // ri-mappo su di un oggetto più semplice, altrimenti da dei problemi il select (è graficamente bloccato)
        this.unusedQuestionsForSelect = this.unusedQuestions.map((q) => ({
          // ri-mappo su di un oggetto più semplice, altrimenti da dei problemi il select (è graficamente bloccato)           id: q.id,
          id: q.id,
          name: q.name,
          type: q.type,
          // section_id: q.section_id,
          description: `${q.id} - ${q.description}`,
          // _translations: {en: q._translations.en ? q._translations.en : EMPTY_QUESTION._translations.en},
          // questions_surveys: q.questions_surveys ? q.questions_surveys : EMPTY_QUESTION.questions_surveys,
        }));
        this.unusedQuestionsForSelect.sort(function (a, b) {
          return a.description > b.description;
        });
        this.unusedQuestionsForSelectType = this.unusedQuestionsForSelect;

        // fai sempre un refresh con le domande speciali
        s = await UserService.getAllSpecialQuestions(this.survey.id);
        //console.log("special", s);
        if (s !== undefined) {
          this.specialQuestions = s.data.questions;
        }
        QuestionService.initQuestions(this.specialQuestions, true); // importante!
        // ri-mappo su di un oggetto più semplice, altrimenti da dei problemi il select (è graficamente bloccato)
        this.specialQuestionsForSelect = this.specialQuestions.map((q) => ({
          // ri-mappo su di un oggetto più semplice, altrimenti da dei problemi il select (è graficamente bloccato)          
          id: q.id,
          name: q.name,
          type: q.type,
          section_id: q.section_id,
          description: `${q.id} - ${q.description}`,
          _translations: {en: q._translations.en ? q._translations.en : EMPTY_QUESTION._translations.en},
          questions_surveys: q.questions_surveys ? q.questions_surveys : EMPTY_QUESTION.questions_surveys,
        }));
        this.specialQuestionsForSelect.sort(function (a, b) {
          return a.description > b.description;
        });
      } catch (e) {
        console.log(e);
        this.showError(e);
      }

      this.newQuestionType = "new";
      this.question = EMPTY_QUESTION;
      this.question.name = "Nuova Domanda";
      this.question.description = "";
      this.question.long_description = { description: "" };
      this.question._translations.en = {
        description: "",
        long_description: "",
        options: "",
      };
      this.question.type = "";
      this.question.section_id = section_id_value;
      //console.log("section_id", section_id);
      this.question.questions_surveys[0] = {
        survey_id: this.survey_id,
        section_id: section_id_value,
        hidden: 0,
        compulsory: 0,
        weight: 0,
        long_description: { description: "" },
        _translations:{
            en: {
            description: "",
            long_description: "",
            options: "",
          },
        },
      };


      this.modal_question = "Nuova Domanda";
      //Mostro il pannello di salvataggio
      this.modal_visible = true;

    },

    async updateUnusequestions() {
      console.log("updateUnusequestions");
      if(this.newQuestionFromExistingForm.id == null){
        this.unusedQuestionsForSelectType = this.unusedQuestionsForSelect.filter(obj => obj.type === this.question.type);
        this.question = null;
        this.question = EMPTY_QUESTION;
        this.newQuestionFromExistingForm = {
          id: null,
          section_id: null,
          weight: 0,
        };
      }
    },
    toggle(checked) {
      //console.log("toggle", checked);
      //console.log("this.question", this.question);
    },
    resetQuestionsGlobal() {
      this.question.questions_surveys[0].description = this.question.description;
      this.question.questions_surveys[0].long_description = JSON.parse(JSON.stringify(this.question.long_description));
      this.question.questions_surveys[0].options = JSON.parse(JSON.stringify(this.question.options));
      // this.question.questions_surveys[0].en.description = this.question.en.description;
      // this.question.questions_surveys[0].en.long_description = this.question.en.long_description;
      this.question.questions_surveys[0]._translations.en = JSON.parse(JSON.stringify(this.question._translations.en));
      this.question.questions_surveys[0].conditions = JSON.parse(JSON.stringify(this.question.conditions));
      this.question.questions_surveys[0].compulsory_answer = this.question.compulsory_answer;
      this.showDismissibleAlert=false;
      //console.log("this.question", this.question);
    },
    checkquestion(question) {
      try{
        console.log(`question edit checkquestion`, question);
        if (question.long_description == null) {
          question.long_description = { description: "" };
        }
        // console.log("en", question.questions_surveys[0]._translations.en == null);
        if (question.questions_surveys[0]._translations == undefined || question.questions_surveys[0]._translations.en == null) {
          console.log("en checkquestion", question.en);
          // add _translations to object question.questions_surveys[0]

          question.questions_surveys[0]._translations = question._translations;
          console.log("question result1->", question);
        }
        if (question.questions_surveys[0].description == null) {
          // this.globalModification = true;
          question.questions_surveys[0].description = question.description;
        } 
        // else {
        //   this.globalModification = false;
        // }
        if (question.questions_surveys[0].long_description == null || question.questions_surveys[0].long_description.length == 0) {
          question.questions_surveys[0].long_description = JSON.parse(JSON.stringify(question.long_description));
        }
        if (question.questions_surveys[0].options == null) {
          question.questions_surveys[0].options = JSON.parse(JSON.stringify(question.options));
        }
        if (question.questions_surveys[0].conditions == null) {
          question.questions_surveys[0].conditions = JSON.parse(JSON.stringify(question.conditions));
        }
        //console.log("questionafter", question);
        //console.log("en.options->", question._translations.en.options);
        if (question._translations == undefined || Object.keys(question._translations).length == 0) {
          question._translations = {
              en: {
              description: question.description,
              long_description: JSON.parse(JSON.stringify(question.long_description)),
              options: question.options.join('|'),
            },
          };
                                          
        }
        if (question._translations.en.options == undefined) {
          question._translations.en.options = question.options.join('|');
                                      
        }
        if (question.questions_surveys[0]._translations == undefined || Object.keys(question.questions_surveys[0]._translations).length == 0) {
          question.questions_surveys[0]._translations = {
              en: {
              description: question._translations.description,
              long_description: question._translations.long_description,
              options: question._translations.options,
            },
          };
        }
        if (question.questions_surveys[0]._translations.en.options == undefined) {
          question.questions_surveys[0]._translations.en.options = question.options.join('|');
        }
        console.log("question result2->", question);
        // replace object this.question with the new question
        //clean object this.question
        // this.question = null;
        // this.question = EMPTY_QUESTION;
        // this.question = question;
        // this.question=question;
        return question;
      }catch(e){
        console.log(e);
      }
      },
      
  },

  async created() {
    
    this.survey_id = parseInt(this.$route.params.survey_id);

    UserService.getSections()
      .then((response) => {
        this.sections = response.data.sections;
      })
      .catch((error) => this.showError(error));

    UserService.getQuestionTypes()
      .then((response) => {
        this.question_options = response.data.question_types;
      })
      .catch((error) => this.showError(error));
    
    let rs = await UserService.getConfig('Questions_spos');
    this.mezziId = rs.data.data.mezzi;

  },
  computed: {
    isTemplate() {
      return this.survey && this.survey.version_tag == "template";
    }
  },
};
</script>

<style>
.b-modal-header strong {
  color: white;
}

.card .card-header {
  font-size: 1.5em;
  font-weight: 800;
  border-bottom: 1px solid #aaa !important;
  padding: 14px;
}

.heavy {
  font-weight: 800;
  color: black;
  font-size: 1.5em;
}

.question-edit fieldset {
  border: 1px solid silver !important;
  border-radius: 5px;
  padding: 1em !important;
  margin-bottom: 1em !important;
}

/*.b-modal-outer {
    height: 100% !important;
    background: rgba(0,0,0,0.7) !important;
}*/

#forced-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
}

.modal-header {
  background-color: #002a3a;
}

.modal-title {
  color: white;
  font-style: italic;
  font-size: 1.5em;
}

button.close {
  color: white;
}

.form-inline label {
  margin-right: 1em;
}

.custom-select {
  font-size: 1.05em;
}

.input-group-text {
  font-size: 1em;
}
</style>
