<template>
    <div>
		<b-overlay :show="isBusy" rounded="sm">
        <b-breadcrumb :items="breadcrumb"></b-breadcrumb>
        <router-link v-if="prev" :to="`/questionari/answers/${survey_id}/${prev}`" class="btn btn-primary"><i class="fa fa-arrow-left" aria-hidden="true"></i> Utente Precedente
        </router-link>
        <router-link v-if="next" :to="`/questionari/answers/${survey_id}/${next}`" class="btn btn-primary">Utente Successivo <i class="fa fa-arrow-right" aria-hidden="true"></i></router-link>
		&nbsp;
        <router-link :to="`/users/edit/${user_id}`" class="btn btn-primary">Modifica Geocodifica <b-icon
                icon="globe"
                target="Modifica Origine">
				</b-icon>
		</router-link>

        <table class="table table-striped">
            <thead>
                <th width="30%">Domanda</th>
                <th>Risposta</th>
            </thead>
            <tbody>
                <tr>
                    <td>Data Compilazione</td>
                    <td><span v-if="answers[0]">{{ answers[0].created }}</span></td>
                </tr>
                <tr v-for="a in answers" :key="a.id">
                    <td>
                        <b>{{ a.question.name }}</b>
                    </td>
                    <td>
                        <div v-if="a.question.type == 'array'">
                            <dl>
                                <template v-for="(ans, key) in a.answer">
                                    <dt :key="key">{{ getLabel(a, key) }}</dt>
                                    <dd :key="`${key}-ans`">{{ ans }}</dd>
                                </template>
                            </dl>
                        </div>
                        <div v-else>
                            {{ beautifyAnswer(a.answer) }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
		</b-overlay>
    </div>
</template>

<script>
import UserService from "@/services/user.service";

export default {
	name: "QuestionariRisposte",
	data() {
		return {
			stats: [],
			user_id: null,
			survey_id: null,
			answers: [],
			prev: null,
			next: null,
			breadcrumb: [],
			isBusy: true,
		};
	},
	methods: {
		beautifyAnswer(answer) {
			if (Array.isArray(answer)){ 
				return answer.join(" ✅ ");         
			} else   
			{
				return answer;
			}         
		},
        
		fetchAnswers() {
			this.isBusy = true;
			this.survey_id = this.$route.params.survey_id;
			this.user_id = this.$route.params.user_id;
			UserService.getAnswerView(this.survey_id, this.user_id)
				.then((response) => {
                    
					this.answers = response.data.answer;
					this.prev = response.data.prev;
					this.next = response.data.next;
					this.isBusy = false;
				})
				.catch((error) => console.log(error));
			this.breadcrumb = [
				{
					text: "Elenco Utenti",
					href: `/questionari/users-list/${this.survey_id}`,
				},
				{
					text: this.getAnonimizedUser(), //this.user_id, 
					active: true,
				},
			];
			
		},
		getLabel(a,key){
			try {
				if (typeof(a.question.options.groups[key].label) !== "undefined"){
					return a.question.options.groups[key].label;
                
				} 
            
			} catch (error) {
				return "--";    
			}
            

		},
		getAnonimizedUser() {
			if (this.answers[0]){
				return `${this.answers[0].user.first_name} ${this.answers[0].user.last_name} - ${this.answers[0].user.email}`;
			}
			return this.user_id;
		}
	},
	watch: {
		$route(to, from) {
			this.fetchAnswers();
		},
	},
	created() {
		this.fetchAnswers();
	},
	computed: {
		
	}

};
</script>

<style></style>
