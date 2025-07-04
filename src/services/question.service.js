class QuestionService {
	initQuestions(questions) {
		// se per errore una o più domande non ha section_id impostato, prendilo dalla section della domanda
		// parent
		questions.forEach((q) => {
			// console.log("questions survey length",q);
			if (Object.keys(q.questions_surveys).length > 0 && !q.questions_surveys[0].section_id) {
				q.questions_surveys[0].section_id = q.section_id;
			}
			if (q._translations == undefined || Object.keys(q._translations).length == 0){
				q._translations = {
					en: {
						description: "",
						long_description: "",
						options: "",
					},
				};
			}
			if (q.questions_surveys == undefined){
				return;
			}
			
			if (Object.keys(q.questions_surveys).length == 0 ){
				// console.log("questions survey length",q);
				q.questions_surveys = [{
					_translations: {
						en: {
							description: "",
							long_description: "",
							options: "",
						}
					}
				}];
			}
			if (Object.keys(q.questions_surveys[0]._translations).length == 0 ){
				// console.log("questions survey length",q);
				q.questions_surveys[0]._translations= {
					en: {
							description: "",
							long_description: "",
							options: "",
						}
					
				};
			// console.log("questions survey length translation en",q);
			}
		});
		
	}
}

export default new QuestionService();
