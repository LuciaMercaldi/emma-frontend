<template>
    <div class="row">
        <div class="col">
            <b-breadcrumb :items="breadcrumb"></b-breadcrumb>
        </div>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
const maxlen = 50;

export default {
    name: 'BreadCrumb',
    props: {
        company_id: {
            type: Number,
            required: false
        },
        office_id: {
            type: Number,
            required: false
        },
        survey_id: {
            type: Number,
            required: false
        },
        breadcrumb: {
            type: Array,
            required: false,
            default: () => [
                { text: 'Azienda', href: '/aziende' },
            ],
        }
    },
    data() {
        return {
            company: 'Azienda',
            office: 'Sede',
            survey: 'Questionario',
        }
    },
    async created() {
        if (this.survey_id & !this.company_id & !this.office_id) {
            console.log('survey_id', this.survey_id);
            this.survey = await UserService.getSurveyView(this.survey_id);
            
            this.company_id = this.survey.data.survey.company_id;
        
            this.breadcrumb[2].text = this.truncate(this.survey.data.survey.name, maxlen);
            this.breadcrumb[2].href = `/questionari/edit/${this.survey_id}`;

        }

        //preparo i dati per il breadcrumb
        if (this.company_id) {
            this.company = await UserService.getCompany(this.company_id);
            this.breadcrumb[0].text = this.truncate(this.company.data.company.name, maxlen);
            this.breadcrumb[0].href = `/aziende/edit/${this.company_id}`;
        }

        if (this.office_id && this.company_id && !this.survey_id) {
            this.breadcrumb.push({ text: 'Sede', href: '' });
            this.breadcrumb[1].text = this.truncate(this.company.data.offices.find(o => o.id == this.office_id).name, maxlen);
            this.breadcrumb[1].href = `/offices/edit/${this.office_id}`;
        } else if (this.office_id) {
            
            this.office = await UserService.getOffice(this.office_id);
            this.breadcrumb[1].text = this.truncate(this.office.data.office.name, maxlen);
            this.breadcrumb[1].href = `/offices/edit/${this.office_id}`;
        } 

        

    },
    methods: {
        truncate(str, n){
          return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
        },
    }
}
</script>
