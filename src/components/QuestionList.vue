<template>
  <div>
    <h3 class="mt-3">
      Le domande
    </h3>

    <b-list-group id="lista-domande">
      <b-list-group-item v-for="section in sections" :key="section.id" @click.self="openSection(section.id)"
        :active="section.id == current_section">

        <b-row >
          <b-col @click.self="openSection(section.id)" >
            <h5 class="heavy mb-0" @click.self="openSection(section.id)" >{{ section.name }}</h5>
          </b-col>
          <b-col>
            <span class="float-right small" @click="current_section = null">
            Raggruppa <i class="fa fa-chevron-up" aria-hidden="true"></i>
            </span></b-col>
        </b-row>

        <b-row>
          <b-col class="d-flex align-items-center">
            {{ countQuestions(section.id) }}
            Domande
          </b-col>
          <b-col class="d-flex align-items-center">
            <i class="fa fa-eye-slash" aria-hidden="true"></i>
            {{ hiddenQuestions(section.id) }}
            Nascoste
          </b-col>
          <b-col class="d-flex align-items-center">
            <i class="fa fa-lock" aria-hidden="true"></i>
            {{ compulsoryQuestions(section.id) }}
            Obbligatorie
          </b-col>
          <b-col>
            <b-button style="width: 100%; border: 0; background: white; color: #0055ff" @click.stop="addQuestion(section.id)"
              title="Aggiungi una domanda a questa sezione" tooltip="Aggiungi una domanda a questa sezione"
              v-if="loggedUserIsAdmin"><i class="fa fa-plus" aria-hidden="true"></i>Aggiungi&nbsp;domanda
            </b-button>
          </b-col>
        </b-row>

        <form action="" v-if="section.id == current_section">

          <hr />

          <b-card class="col-lg-12" v-for="q in filterQuestions(section.id)" :key="q.id" v-if="avoidMapQuestions(q.id)">
            <template v-slot:header>
              <h6 class="mb-0">
                {{ (q.questions_surveys[0].description != null) ? q.questions_surveys[0].description :
                  q.description }}
                <span class="light">(ID: {{ q.id }} - {{ q.name }})</span>
              </h6>
              <b-form-text v-if="q.questions_surveys[0].long_description">{{ q.questions_surveys[0].long_description.description
              }}</b-form-text>
              <b-form-text v-else-if="q.long_description">{{ q.long_description.description }}</b-form-text>
            </template>
            <p v-if="q.questions_surveys[0].hidden" class="text-muted small">
              Questa domanda non comparirà nel questionario dell'utente. Per
              farla comparire usa il pulsante "MOSTRA"
            </p>
            <b-form-group v-if="!q.questions_surveys[0].hidden">
              <b-form-input v-if="q.type == 'text'" name="q.id"></b-form-input>

              <div v-if="q.type == 'single'">
                <b-form-radio
                  v-for="(opt, index) in (q.questions_surveys[0].options != null && q.questions_surveys[0].options.length > 0) ? q.questions_surveys[0].options : q.options"
                  :key="index" :value="opt" v-model.lazy="answer[q.id]">{{ opt }}
                </b-form-radio>
              </div>

              <b-form-checkbox-group stacked v-if="q.type == 'multiple'" v-model.lazy="answer[q.id]">
                <b-form-checkbox
                  v-for="(opt, index) in (q.questions_surveys[0].options != null && q.questions_surveys[0].options.length > 0) ? q.questions_surveys[0].options : q.options"
                  :key="index" :value="opt">{{ opt }}
                </b-form-checkbox>
              </b-form-checkbox-group>

              <div v-if="q.type == 'array'">
                <b-form-group stacked v-for="(group, index) in q.questions_surveys[0].options.groups" :key="index" :label="group.label">
                  <b-form-select>
                    <b-form-select-option v-for="(o, index2) in group.options" :key="index2" :value="o">
                      {{ o }}
                    </b-form-select-option>
                  </b-form-select>
                </b-form-group>

                <b-form-group v-if="q.questions_surveys[0].options.allowOther">
                  <label>Altro</label>
                  <b-form-input> </b-form-input>
                </b-form-group>
              </div>

              <div v-if="q.type == 'map'">
                <map-question :survey_id="survey_id"
                  :mapqs_ori="q.questions_surveys[0].long_description ? q.questions_surveys[0].long_description.mapqs : q.long_description.mapqs"
                  language="it"
                  :questions="survey.questions"></map-question>
              </div>
            </b-form-group>

            <template v-slot:footer>
              <span>
                <template v-if=" (q.questions_surveys[0].conditions && q.questions_surveys[0].conditions.display == 'conditionally')">
                  <question-condition-info :conditions="q.questions_surveys[0].conditions" :key="q.id" 
                  :questions="survey.questions"/>
                </template>
                <b-checkbox v-model="q.questions_surveys[0].compulsory"
                  :disabled="!(loggedUserIsAdmin || loggedUserIsMomaManagerGenerale)" @change="toggleCompulsory(q.id)"> <i
                    class="fa fa-lock" aria-hidden="true"></i>Domanda Necessaria <small class="text-muted">(Il mobility
                    manager non può togliere questa domanda dal questionario)</small></b-checkbox>

                <b-button v-if="loggedUserIsAdmin" class="float-right" size="sm" variant="success"
                  @click.prevent="editQuestion(q.id)"><i class="fa fa-pencil" aria-hidden="true"></i>
                  Modifica
                </b-button>

                <b-spinner v-if="deletingQuestion" label="Spinning"></b-spinner>
                <b-button :disabled="deletingQuestion" v-if="loggedUserIsAdmin" class="float-right  mr-1" size="sm"
                  variant="danger" @click.prevent="deleteQuestion(q.id)"><i class="fa fa-trash" aria-hidden="true"></i>
                  Cancella
                </b-button>

                <b-button v-if="true /*loggedUserIsAdmin ||
                                                                                              loggedUser.isMomaManagerGenerale ||
                                                                                              (loggedUser.isMomaManagerAziendale && (
                                                                                                  (q._joinData.compulsory && q.creator_id == loggedUser.id) ||
                                                                                                  !q._joinData.compulsory
                                                                                              ))*/
                  " class="float-right mr-1" size="sm" @click.prevent="toggleHidden(q.id)">
                  <template v-if="!q.questions_surveys[0].hidden">
                    <i class="fa fa-eye-slash" aria-hidden="true"></i> Nascondi
                  </template>
                  <template v-if="q.questions_surveys[0].hidden">
                    <i class="fa fa-eye" aria-hidden="true"></i> Mostra
                  </template>
                </b-button>

              </span>
            </template>
          </b-card>

          <b-card class="col-lg-12" v-if="loggedUserIsAdmin">
            <b-button style="border: 0; background: none; color: #0055ff" @click.stop="addQuestion(section.id)"
              title="Aggiungi una domanda a questa sezione" tooltip="Aggiungi una domanda a questa sezione"><i
                class="fa fa-plus" aria-hidden="true"></i>Aggiungi
              domanda</b-button>
          </b-card>

        </form>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import Util from "@/mixing/util";
import MapQuestion from "@/components/MapQuestion.vue";
import QuestionConditionInfo from "@/components/QuestionConditionInfo";
import UserService from "@/services/user.service";
import QuestionService from "@/services/question.service";

export default {
  name: "question-list",
  props: {
    survey_id: Number,
    sections: Array,
    survey: Object,
    answer: Array,
  },
  components: {
    QuestionConditionInfo,
    MapQuestion,
  },
  mixins: [Util],
  data() {
    return {
      deletingQuestion: false,
      current_section: 0,
      editingQuestion: false,
      modal_visible: false,
      mapQuestions: null,
    };
  },
  async mounted() {
    await UserService.getMapQuestions().then((res) => {
        console.log(`res`, res);
        this.mapQuestions = res.data.data;
      });

  },
  methods: {
    openSection(id) {
      //console.log("openSection", id);
      if (this.current_section == id) {
        this.current_section = null;
      } else {
        this.current_section = id;
      }
    },
    hiddenQuestions(section_id) {
      if (this.survey.questions == undefined) {
        return 0;
      }
      return this.survey.questions.filter(function (m) {
        return m.questions_surveys[0].section_id == section_id && m.questions_surveys[0].hidden;
      }).length;
    },
    compulsoryQuestions(section_id) {
      if (this.survey.questions == undefined) {
        return 0;
      }
      return this.survey.questions.filter(function (m) {
        return m.questions_surveys[0].section_id == section_id && m.questions_surveys[0].compulsory;
      }).length;
    },
    countQuestions(section_id) {
      if (this.survey.questions == undefined) {
        return 0;
      }
      return this.survey.questions.filter(function (m) {
        return m.questions_surveys[0].section_id == section_id;
      }).length;
    },
    addQuestion(section_id) {
      this.$emit("add-question", section_id);
    },
    editQuestion(question_id) {
      this.$emit("edit-question", question_id);
    },
    async toggleHidden(qid) {
      this.editingQuestion = true;
      try {
        this.modal_visible = false;
        this.question = this.survey.questions.find((x) => x.id === qid);
        this.question.questions_surveys[0].hidden = !this.question.questions_surveys[0].hidden;
        //L'attributo hidden non è della domanda, ma della relazione questions_survey
        await UserService.toggleQuestionVisibility(
          qid,
          this.survey.id,
          this.question.questions_surveys[0].hidden
        );
      } catch (e) {
        //console.log(e);
        this.showError(e);
      } finally {
        this.editingQuestion = false;
      }
    },
    async toggleCompulsory(qid) {
      this.editingQuestion = true;
      try {
        this.modal_visible = false;
        this.question = this.survey.questions.find((x) => x.id === qid);
        //L'attributo hidden non è della domanda, ma della relazione questions_survey
        await UserService.toggleQuestionCompulsory(
          qid,
          this.survey.id,
          this.question.questions_surveys[0].compulsory
        );
      } catch (e) {
        //console.log(e);
        this.showError(e);
      } finally {
        this.editingQuestion = false;
      }
    },
    filterQuestions(section_id) {
      if (this.survey.questions == undefined) {
        return [];
      }
      const questionsInSection = this.survey.questions.filter(function (m) {
        return m.questions_surveys[0].section_id == section_id;
      });
      questionsInSection.sort((q1, q2) => {
        let w1 = q1.questions_surveys[0] && q1.questions_surveys[0].weight ? q1.questions_surveys[0].weight : 0;
        let w2 = q2.questions_surveys[0] && q2.questions_surveys[0].weight ? q2.questions_surveys[0].weight : 0;
        return w1 - w2;
      });
      return questionsInSection;
    },
    deleteQuestion: async function (qid) {
      this.deletingQuestion = true;
      try {
        const res = await UserService.removeQuestionFromSurvey(
          this.survey.id,
          qid
        );
        if (res.data.errorMsg) {
          throw new Error(res.data.errorMsg);
        }
        this.$bvToast.toast("Domanda rimossa correttamente dal questionario", {
          title: "Cancellazione OK",
          variant: "success",
          autoHideDelay: 2000,
          appendToast: true,
        });
        const updatedSurvey = await UserService.getSurveyEdit(this.survey.id);
        //console.log(`updatedSurvey`, updatedSurvey);
        this.survey.questions = updatedSurvey.data.survey.questions;
        QuestionService.initQuestions(this.survey.questions, true);
      } catch (e) {
        console.log("errore delete",e);
        this.showError(e);
      } finally {
        this.deletingQuestion = false;
      }
    },
    avoidMapQuestions(id) {
      // console.log(`this.mapQuestions`, this.mapQuestions);
      // mapQuestions is an object where the key is the question name and value is the question id
      // if the question id is in the mapQuestions object, then it is a map question and return true
      return !Object.values(this.mapQuestions).includes(id);
    },
  },
  computed: {

  },
};
</script>
