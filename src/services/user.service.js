import { company_survey_form_data } from "@/data/company-survey.config";
import { latLng } from "leaflet";
import UserRoles from "@/data/user-roles";
import httpClient from "./httpClient";

var mime = require("mime-types");

class UserService {
	async getSurveys(query) {
		query = query ? `?${query}` : "";
		return httpClient.get(`/surveys.json${query}`);
	}
	async getAllSurveys() {
		return httpClient.get("/surveys.json?all=1");
	}
	getSurveysList(company_id = null, office_id = null) {
		let p = {};

		if (company_id !== null && company_id !== 0) {
			p["company_id"] = company_id;
		}
		if (office_id !== null && office_id !== 0) {
			p["office_id"] = office_id;
		}
		//console.log("P",p);
		let params = new URLSearchParams(p);
		let q = params.toString();
		return httpClient.get(`/surveys/getList.json?${q}`);
	}
	async getMySurvey() {
		return httpClient.get("/users/get-my-survey.json");
	}
	getAnswerStats(question_id, survey_id = null) {
		let q = "";
		if (survey_id !== null && survey_id !== 0) {
			q = `?survey_id=${survey_id}`;
		}
		return httpClient.get(`/answers/get-indicator/${question_id}.json${q}`);
	}
	async getEmployeesStats(company_id, year = null) {
		let res = await httpClient.get(`/employees/stats/${company_id}.json?year=${year}`);
		return res.data.result;
	}
	async getAnswerFromOrigin(origin_id) {
		let res = await httpClient.get(`/origins/get-answer/${origin_id}.json`);
		return { survey_id: res.data.origin.survey_id, user_id: res.data.origin.user_id };
	}
	getAnswerIndicator(indicator_id, company_id = null, office_id = null, filters = {}, default_sort = false, survey_id = null, answer = null) {
		let p = {};

		if (company_id !== null && company_id !== 0) {
			p["company_id"] = company_id;
		}
		if (office_id !== null && office_id !== 0) {
			p["office_id"] = office_id;
		}

		if (survey_id !== null && survey_id !== 0) {
			p["survey_id"] = survey_id;
		}

		for (let [flt, answ] of Object.entries(filters)) {
			p[`filter_${flt}`] = answ;
		}

		if (default_sort) {
			p["default_sort"] = 1;
		}

		if (answer !== null) {
			p["answer"] = answer;
		}

		let params = new URLSearchParams(p);
		let q = params.toString();
		return httpClient.get(`/answers/get-indicator/${indicator_id}.json?${q}`);
	}
	// getModalSplit(){
	//     return httpClient.get(`/answers/getModalSplit.json`, {
	//         headers: authHeader(),
	//     });
	// }

	async getAnswerView(survey_id, user_id = null) {
		if (user_id == null) {
			return httpClient.get(`/answers/view/${survey_id}.json`, {

			});
		} else {
			return httpClient.get(`/answers/view/${survey_id}/${user_id}.json`, {

			});
		}
	}

	async deleteAnswers(survey_id, user_id) {
		return httpClient.delete(`/answers/delete/${survey_id}/${user_id}.json`);
	}

	async getSurveyView(survey_id) {
		return httpClient.get(`/surveys/view/${survey_id}.json`);
	}
	async getAnswerUsersList(survey_id) {
		return httpClient.get(`/answers/users-list/${survey_id}.json`);
	}
	async getSurveyEdit(survey_id) {
		return httpClient.get(`/surveys/edit/${survey_id}.json`);
	}
	async deleteSurvey(survey_id) {
		return httpClient.delete(`/surveys/delete/${survey_id}.json`);
	}
	async deleteAllSurveyParticipnats(survey_id) {
		return httpClient.delete(`/surveys/delete-all-survey-participants/${survey_id}.json`);
	}
	async getPillars() {
		return httpClient.get("/pillars.json");
	}
	async getMeasures() {
		return httpClient.get("/measures.json");
	}

	async getPsclMeasureImpacts(companyId = null, office_id, survey_id, year) {
		return httpClient.get(`/measures/getPsclMeasureImpacts/${companyId}/${office_id}/${survey_id}/${year}.json`);
	}

	async getPsclMeasureLabels(measure_id) {
		return httpClient.get(`/measures/getPsclMeasureLabels/${measure_id}.json`);
	}


	async getQuestions(survey_id, lang_id = null) {
		//TODO: Per il momento supporto solo l'inglese
		if (lang_id == "en") {
			return httpClient.get(`/surveys/get-questions/${survey_id}/${lang_id}.json`);
		} else {
			return httpClient.get(`/surveys/get-questions/${survey_id}.json`);
		}

	}
	async getArticle(slug) {
		return httpClient.get(`${process.env.VUE_APP_CMS}articles/view/${slug}.json`);
	}

	async editCompany(form_data, id) {
		const urlSuffix = id ? `/${id}` : "";
		return httpClient({
			method: "post",
			url: `/companies/edit${urlSuffix}.json`,
			data: form_data,

		});
	}

	// todo: probabilmente cassabile, non più usato
	async updateQuestion(form_data) {
		//Nota sull'edit non passo question_id perchè è già nel form_data
		return httpClient({
			method: "post",
			url: "/questions/edit.json",
			data: form_data,

		});
	}

	async updateAnswers(answers, survey_id, participant_id) {
		return httpClient({
			method: "post",
			url: `/answers/update/${survey_id}/${participant_id}.json`,
			data: answers,

		});
	}


	async saveEmissioni(company_id, form) {
		return httpClient({
			method: "post",
			url: `/companies/emissions/${company_id}.json`,
			data: form,

		});
	}

	async getEmissioni(company_id) {
		return httpClient.get(`/companies/emissions/${company_id}.json`);
	}

	async getEmissionImpacts(company_id) {
		return httpClient.get(`/companies/emissionImpacts/${company_id}.json`);
	}

	async toggleQuestionCompulsory(question_id, survey_id, compulsory) {
		return httpClient({
			method: "post",
			url: "/surveys/toggle-question-compulsory.json",
			data: {
				question_id,
				survey_id,
				compulsory,
			},

		});
	}

	async toggleQuestionVisibility(question_id, survey_id, hidden) {
		return httpClient({
			method: "post",
			url: "/surveys/toggle-question-visibility.json",
			data: {
				question_id,
				survey_id,
				hidden,
			},

		});
	}

	async savePscl(companyId, officeId, survey_id, pscl, year) {
		return httpClient({
			method: "post",
			url: `/pscl/edit/${companyId}/${officeId}/${survey_id}.json`,
			data: {
				officeId,
				pscl,
				year
			},

		});
	}

	async getCompanyList(type = null, q = null, year = null) {
		var params = new URLSearchParams();
		if (type) {
			params.append("type", type);
		}
		if (q) {
			params.append("q", q);
		}
		if (year) {
			params.append("year", year);
		}
		return httpClient.get("/companies/list.json?" + params.toString());
	}
	async getSections() {
		return httpClient.get("/sections.json");
	}

	async getOffices(company_id, limit) {
		var params = new URLSearchParams();
		if (company_id !== null && company_id != undefined) {
			params.append("company_id", company_id);
		}
		if (limit) {
			params.append("limit", limit);
		}
		if (params !== undefined) {
			return httpClient.get("/offices.json?" + params.toString());
		}

	}
	async getOfficesForSurvey(survey_id) {
		return httpClient.get(`/offices/for-survey/${survey_id}.json`);
	}

	async getSchools(q, provincia, from) {
		let qs = "";
		if (q !== null && q != undefined) {
			qs += `q=${q}`;
		}
		if (provincia !== null && provincia != undefined) {
			qs += `&provincia=${provincia}`;
		}
		if (from !== null && from != undefined) {
			qs += `&from=${from}`;
		}
		return httpClient.get(`/offices.json?company_type=4&${qs}`);
	}
	async getOffice(office_id) {
		return httpClient.get(`/offices/view/${office_id}.json`);
	}
	getTimeTable(office_id, timetable_id) {
		if (timetable_id !== undefined) {
			return httpClient.get(`/orariscuole/timetables/view/${office_id}/${timetable_id}.json`, {

			});
		}
		return httpClient.get(`/orariscuole/timetables/view/${office_id}.json`);
	}
	getTimeSlots(timetable_id) {
		return httpClient.get(`/orariscuole/timeslots/index/${timetable_id}.json`);
	}
	saveTimeTable(timetable_id, tab_in, tab_out, timetable) {
		if (timetable_id == undefined) {
			return httpClient({
				method: "post",
				url: "/orariscuole/timetables/add.json",
				data: { tab_in: tab_in, tab_out: tab_out, timetable: timetable },

			});
		}
		return httpClient({
			method: "post",
			url: `/orariscuole/timetables/edit/${timetable_id}.json`,
			data: { tab_in: tab_in, tab_out: tab_out, timetable: timetable },

		});
	}
	deleteTimeTable(timetable_id) {
		return httpClient.delete(`/orariscuole/timetables/delete/${timetable_id}.json`);
	}
	notifyTimeTable(timetable_id) {
		return httpClient.post(`/orariscuole/timetables/notify/${timetable_id}.json`, null);
	}
	async statsTimeTables() {
		return httpClient({
			method: "get",
			url: "/orariscuole/timetables/stats.json",

		});
	}

	async resetGeocoding(company_id) {
		return httpClient({
			method: "get",
			url: `/origins/reset_geocoding/${company_id}.json`,
		});
	}

	async geoCode(address) {
		let a = ""; //Address
		let c = ""; //City
		let p = ""; //Province
		let pc = ""; //Postal code
		//Default: Centro su Torino
		let lat = 45.05011899322459;
		let lon = 7.669830322265626;
		let res = new latLng();
		let response;

		//Faccio la richiesta vera e propria
		if (typeof address == "string") {
			a = address;
			response = await httpClient.get(`/geocoder.json?q=${a}&lat=${lat}&lon=${lon}`);
		} else {

			a = address.address != undefined ? address.address : "";
			c = address.city != undefined ? address.city : "";
			p = address.province != undefined ? address.province : "";
			pc = address.postal_code != undefined ? address.postal_code : "";
			response = await httpClient.get(`/geocoder.json?address=${a}&city=${c}&province=${p}&postal_code=${pc}`);
		}

		if (response.data.lon != undefined && response.data.lat != undefined) {
			lon = response.data.lon;
			lat = response.data.lat;
			// pc = response.data.postal_code;
			// return new latLng(lat, lon), response;
			return [new latLng(lat, lon), response];

			//res = new latLng(lat, lon);
			// return res, response;
		} else {
			throw new Error(`Impossibile trovare l'indirizzo ${a}`);
		}
	}

	async geocodeOffice(office_id, force) {
		return httpClient.get(process.env.VUE_APP_ROOT + `offices/geocode/${office_id}.json?force=${force}`);
	}


	deleteOffice(office_id) {
		return httpClient.delete(`/offices/delete/${office_id}`);
	}

	async editOffice(myForm, office_id) {
		const urlSuffix = office_id ? `/${office_id}` : "";
		return httpClient({
			method: "post",
			url: `/offices/edit${urlSuffix}.json`,
			data: myForm,

		});
	}
	async whoAmI() {
		return httpClient.get("/users/whoami.json");
	}

	async changePassword(myForm, token) {
		//Gestisco questo perchè posso avere il token in get
		let h = {};

		return httpClient({
			method: "post",
			url: `/users/change-password.json?token=${token}`,
			data: myForm,
		});
	}

	resetPassword(reference) {
		var myForm = new FormData();
		myForm.append("email", reference);

		return httpClient({
			method: "post",
			url: "/users/request-reset-password.json",
			data: myForm,

		});
	}


	async updateSurvey(data, survey_id) {
		return httpClient({
			method: "post",
			url: `/surveys/edit/${survey_id}.json`,
			data: data,
		});
	}

	async updateLogo(logofile, survey_id) {
		var myForm = new FormData();
		//Il file
		myForm.append("logofile", logofile);
		return httpClient({
			method: "post",
			url: `/surveys/update_logo/${survey_id}.json`,
			data: myForm,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async sendTestInvitation(data, survey_id) {
		return httpClient({
			method: "post",
			url: `/surveys/send-test-invitation/${survey_id}.json`,
			data: data,

		});
	}

	async getStats(survey_id, clear_cache = false) {
		if (clear_cache) {
			return httpClient.get(`/surveys/get-stats/${survey_id}.json?cache=clear`);
		} else {
			return httpClient.get(`/surveys/get-stats/${survey_id}.json`);
		}
	}

	async getStatsByOffice(survey_id, office_question_id) {
		return httpClient.get(`/surveys/get-stats-by-office/${survey_id}/${office_question_id}.json`);
	}

	async deleteEmptyParticipants(survey_id) {
		return httpClient.delete(`/surveys/delete-empty-participants/${survey_id}.json`);
	}
	async deleteUsersNotCompleted(survey_id) {
		return httpClient.delete(`/surveys/delete-users-not-completed/${survey_id}.json`);
	}

	async sendNotifications(survey_id, type) {
		if (type == "invitation") {
			return httpClient({
				method: "post",
				url: `/surveys/send-notifications/invitation/${survey_id}.json`,
			});
		} else {
			return httpClient({
				method: "post",
				url: `/surveys/send-notifications/reminder/${survey_id}.json`,
			});
		}
	}

	async getUsers(query) {
		query = query ? `?${query}` : "";
		return httpClient.get(`/users/index.json${query}`, { useCahe: true });
	}

	async getGuide(query) {
		return httpClient.get("/users/get-guide.json", { useCahe: true });
	}

	// todo: reale im  plementazione lato server
	async getRoleList() {
		return Promise.resolve({
			data: {
				roles: UserRoles,
			},
		});
	}

	async getOrigins(query, count = false) {
		if (count) query += (query ? "&" : "") + "count=1";
		query = query ? `?${query}` : "";
		return httpClient.get(`/origins/index.json${query}`);
	}

	async getEmployees(query) {
		query = query ? `?${query}` : "";
		return httpClient.get(`/employees/index.json${query}`);
	}

	async getOriginFiltersForAnswers(questions, survey_id) {
		return httpClient.get(`/questions/origin-filters.json?q=${questions}&survey_id=${survey_id}`);
	}

	async getOriginFiltersForEmployees(companyId) {
		return httpClient.get(`/employees/origin-filters/${companyId}.json`);
	}

	async getQuestionTypes() {
		return Promise.resolve({
			data: {
				question_types: ["single", "multiple", "text", "array"],
			},
		});
	}

	async getCompanyType(company_id) {
		return httpClient.get(`/companies/get-type/${company_id}.json`);
	}

	async getCompanyTypes() {
		return httpClient.get("/companyTypes.json");
	}

	getCompanySurveyForm(formType, companyTypes, companyType, existingFormData) {
		let template = companyTypes.find((type) => type.id === companyType).survey_template;
		let formData = null;
		let componentPrefix = null;
		switch (formType) {
			case "generale":
				formData = company_survey_form_data.generale;
				componentPrefix = "questionario-generale";
				break;
			case "sede":
				formData = company_survey_form_data.sede;
				componentPrefix = "questionario-sede";
				break;
			case "label":
				formData = company_survey_form_data.label;
				componentPrefix = "questionario-label";
				break;
			default:
				throw new Error(`Unknown company form ${formType}`);
		}

		if (formData[template] === undefined) {
			// se il template per questo tipo di azienda non è definito, di default uso il template 'azienda'
			template = "azienda";
		}
		return {
			// sovrascrivo sempre i dati di default con quelli del form esistente uno per uno (via spread operator) anzichè
			// restituire direttamente i dati del form esistente. Questo nel caso in cui il form a db abbia una struttura diversa dal template
			// (es. struttura form aggiornata rispetto ai dati a db)
			formData: {
				...formData[template],
				...(existingFormData ? existingFormData : {}),
			},
			component: `${componentPrefix}-${template}`,
		};
	}

	async getCompany(id) {
		return httpClient.get(`/companies/view/${id}.json`);
	}


	async deleteCompany(id) {
		return httpClient({
			url: `/companies/delete/${id}.json`,

			method: "post"
		});
	}

	async addCompanyType(form_data) {
		return httpClient({
			method: "post",
			url: "/companyTypes/add.json",
			data: form_data,

		});
	}

	async addUser(form_data) {
		return httpClient({
			method: "post",
			url: "/users/add.json",
			data: form_data,

		});
	}

	async saveUser(form_data) {
		return httpClient({
			method: "post",
			url: `/users/edit/${form_data.id}.json`,
			data: form_data,

		});
	}

	async getUser(user_id) {
		return httpClient({
			method: "get",
			url: `/users/edit/${user_id}.json`,

		});
	}

	async postFormData(relUrl, formData) {
		return httpClient({
			method: "post",
			url: `/${relUrl}`,
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async getAllOriginsNotGeocoded(companyId) {
		return httpClient.get(`/origins/not-geocoded/${companyId}.json`);
	}

	getPscl(companyId = null, office_id, year = null) {
		return httpClient.get(`/pscl/view/${companyId}/${office_id}/${year}.json`);
	}

	async geocodeOrigin(originId) {
		return httpClient({
			method: "post",
			url: "/origins/geocode.json",
			data: {
				originId,
			},

		});
	}

	async importUsers(form_data) {
		return httpClient({
			method: "post",
			url: "/users/import.json",
			data: form_data,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async addAnonParticipant(survey_id) {
		return httpClient({
			method: "post",
			url: `/surveys/add-anon-participant/${survey_id}.json`,
			data: {},

		});
	}

	async deleteAllEmployees(company_id, year) {
		return httpClient({
			method: "post",
			url: "/employees/delete-all.json",
			data: {
				company_id,
				year
			},

		});
	}

	async importEmployee(employee, company_id, year) {
		return httpClient({
			method: "post",
			url: `/employees/import/${company_id}/${year}.json`,
			data: employee,
			timeout: 120000,
		});
	}

	async importParticipant(participant, survey_id) {
		return httpClient({
			method: "post",
			url: `/surveys/import-participant/${survey_id}.json`,
			data: participant,

		});
	}

	async createTemplate(survey_id) {
		return httpClient({
			method: "post",
			url: "/surveys/create-template.json",
			data: {
				survey_id,
			},

		});
	}

	async surveyTemplatesList() {
		return httpClient({
			method: "get",
			url: "/surveys/template-list.json",

		});
	}

	async getAllUnusedQuestions(survey_id) {
		return httpClient({
			method: "get",
			url: `/questions/unused/${survey_id}.json`,

		});
	}

	async getAllSpecialQuestions(survey_id) {
		return httpClient({
			method: "get",
			url: `/questions/special/${survey_id}.json`,

		});
	}

	async getQuestionTranslations(question_id, survey_id) {
		return httpClient({
			method: "get",
			url: `/questions/get-translations/${question_id}/${survey_id}.json`,

		});
	}

	async getSurveyTranslations(survey_id) {
		return httpClient({
			method: "get",
			url: `/surveys/get-translations/${survey_id}.json`,

		});
	}

	async editQuestionFromSurvey(question, globalmodification = false) {
		return httpClient({
			method: "post",
			url: "/questions/editFromSurvey.json",
			data: { question, globalmodification },

		});
	}

	async countEmployees() {
		return httpClient({
			method: "get",
			url: "/employees/count.json",

		});
	}

	async countResponders() {
		return httpClient({
			method: "get",
			url: "/answers/count-responders.json",

		});
	}

	async countCompanies() {
		return httpClient({
			method: "get",
			url: "/companies/count.json",

		});
	}

	async countPSCL() {
		return httpClient({
			method: "get",
			url: "/pscl/count.json",

		});
	}

	async getCoworking() {
		return httpClient({
			method: "get",
			url: "/offices/get-coworking.json",

		});
	}
	async getCoworkingtypes() {
		return httpClient({
			method: "get",
			url: "/offices/get-coworking-types.json",

		});
	}

	async removeQuestionFromSurvey(survey_id, question_id) {
		return httpClient({
			method: "post",
			url: `/surveys/remove-question/${survey_id}.json`,
			data: {
				question_id,
			},

		});
	}

	async addSurvey(company_id, survey_template_id) {
		return httpClient({
			method: "get",
			url: `/surveys/add/${company_id}/${survey_template_id}.json`,

		});
	}

	async surveyCompleted(survey_id, participant_id) {
		return httpClient({
			method: "post",
			url: `/surveys/completed/${survey_id}.json`,
			data: {
				participant_id,
			},

		});
	}

	async getAllQuestions() {
		return httpClient.get("/questions.json");
	}

	async getQuestionList() {
		return httpClient.get("/questions/list.json");
	}

	async generatePSCLXlsx(companyId, officeId, surveyId, year) {
		return httpClient.get(`/pscl/generate-xlsx/${companyId}/${officeId}/${surveyId}/${year}.xlsx`, {
			responseType: "blob",
		});
	}
	async generatePSCL(format, companyId, officeId, surveyId, ignoreOffice, year = null) {
		return httpClient.get(`/pscl/report/${format}/${companyId}/${officeId}/${surveyId}/${ignoreOffice}/${year}/999.json`, {
			responseType: "blob",
		});
	}

	async generateCapTurni(officeId, year) {
		return httpClient.get(`/employees/export-cap-turni/${officeId}/${year}.xls`, {
			responseType: "blob",
		});
	}
	async uploadPSCL(form_data, company_id, office_id, year) {
		return httpClient({
			method: "post",
			url: `/pscl/upload/${company_id}/${office_id}/${year}.json`,
			data: form_data,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async downloadPSCL(company_id, office_id, fname, year) {
		return httpClient.get(`/pscl/download/${company_id}/${office_id}/${fname}/${year}`, {
			responseType: "blob",
		});
	}

	async listPSCL(company_id, office_id, year) {
		return httpClient.get(`/pscl/index/${company_id}/${office_id}/${year}.json`);
	}

	async importCompanyUsers(survey_id, year) {
		return httpClient.get(`/surveys/importCompanyUsers/${survey_id}/${year}.json`, {

		});
	}

	async exportSurveyData(survey_id, all = true, allAnswers = false, export_data) {
		// return httpClient.get(`/answers/exportSurveyData/${survey_id}`, {
		// 	responseType: "blob",
		// });
		return httpClient({
			method: "post",
			url: `/answers/exportSurveyData/${survey_id}/${all}/${allAnswers}.json`,
			data: export_data,
			// responseType: "blob",

		});
	}

	async exportMapQuestion(survey_id, survey_name) {
		return httpClient.get(`/answers/exportMapQuestion/${survey_id}`, {
			responseType: "blob",
		});
	}



	async getMonitorings(office_id, measure_id, survey_id, year, company_id) {
		var params = new URLSearchParams();
		if (office_id) {
			params.append("office", office_id);
		}
		if (measure_id) {
			params.append("measure", measure_id);
		}
		if (survey_id) {
			params.append("survey", survey_id);
		}
		if (year) {
			params.append("year", year);
		}
		if (company_id) {
			params.append("company_id", company_id);
		}
		return httpClient.get("/monitorings.json?" + params.toString());
	}

	async getMunicipalitiesList() {
		return httpClient.get("/offices/municipalities.json");
	}

	async getMunicipalityMeasures(office_id) {
		return httpClient.get(`/offices/getMunicipalityMeasures/${office_id}.json`);
	}

	async editMonitoring(monitoring_id, form_data, year) {
		return httpClient({
			method: "post",
			url: `/monitorings/edit/${monitoring_id}/${year}.json`,
			data: form_data,

		});
	}

	async addMonitoring(form_data, year) {
		return httpClient({
			method: "post",
			url: `/monitorings/add/${year}.json`,
			data: form_data,

		});
	}

	deleteMonitoring(monitoring_id) {
		return httpClient.delete(`/monitorings/delete/${monitoring_id}.json`);
	}
	async editOrigin(formData) {
		if (formData.id) {
			return httpClient({
				method: "post",
				url: `/origins/edit/${formData.id}.json`,
				data: formData,

			});
		} else {
			return httpClient({
				method: "post",
				url: "/origins/edit.json",
				data: formData,

			});
		}

	}
	async editUserData(form_data, user_id) {
		return httpClient({
			method: "post",
			url: `/users/edit/${user_id}.json`,
			data: form_data,

		});
	}

	deleteUser(user_id) {
		return httpClient.delete(`/users/delete/${user_id}.json`);
	}

	getOrigin(user_id) {
		return httpClient.get(`/users/getOrigin/${user_id}.json`);
	}

	extractFileName(url) {
		let names = url.split("/");
		return names[names.length - 2];
	}
	download(url) {
		let fullUrl = `/${url}`;

		return httpClient
			.get(fullUrl, { responseType: "blob" })
			.then((response) => {
				let ext = mime.extension(response.data.type);

				const blob = new Blob([response.data], { type: response.data.type });
				const link = document.createElement("a");
				link.download = url;
				let filename = this.extractFileName(url);
				link.href = window.URL.createObjectURL(blob);
				link.setAttribute("download", `${filename}.${ext}`);
				link.target = "_blank";
				document.body.appendChild(link);
				link.click();
				URL.revokeObjectURL(link.href);
			})
			.catch((error) => console.log(error));
	}


	getColors() {
		//Metto questo metodo nell'APP Controller perchè è generale
		return httpClient.get("/app/getConfig/chartColors.json");
	}

	getConfig(p) {
		try {
			return httpClient.get(`/app/getConfig/${p}.json`);
		} catch (error) {
			//console.log("Errore nella chiamata getConfig");
			return [];
		}

	}

	//Aggiorno la tabella questions_survey per salvare le sedi di questa azienda nella domanda sede
	//Mi è utile per poter fare delle domande dipendenti dalla sede
	updateOfficeQuestion(survey_id, offices) {
		return httpClient({
			method: "post",
			url: `/surveys/update-office-question/${survey_id}.json`,
			data: offices,
		});
	}

	async downloadPSCLZip(companies, year) {
		return httpClient({
			method: "post",
			url: `/pscl/downloadPSCLZip/${year}.json`,
			data: companies,
			responseType: "blob",

		}).then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'companies.zip'); // or any other extension
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}).catch((error) => {
			console.error("Error downloading the file", error);
		});
	}

	async getStatusExport(survey_id) {
		return httpClient({
			method: "get",
			url: `/answers/get_queue_status/${survey_id}.json`,
			responseType: "blob",
		});
	}

	getMapQuestions() {
		return httpClient.get("/surveys/getConfig/Questions_spos.json");
	}

	async generateDeletedUsers(survey_id) {
		return httpClient.get(`/answers/generateDeletedUsers/${survey_id}.json`, {
			
		});
	}
	async generateMissingUsers(survey_id) {
		return httpClient.get(`/surveys/generateMissingUsers/${survey_id}.json`, {

		});
	}
}

export default new UserService();
