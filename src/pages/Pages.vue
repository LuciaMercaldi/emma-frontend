<template>
    <div class="container">
        <b-row>
            <b-col cols="12" md="4">
                <b-img :src="copertina" class="img-fluid" />
                {{ description }}

                <div class="text-center">
                    <b-button variant="outline-primary" class="mt-3" :to="`/${slug}`" v-if="isAuthorized('admin, pascal')"> Vai alla sezione {{ slug }} </b-button>
                </div>
            </b-col>
            <b-col cols="12" md="8">
                <h1>{{ title }}</h1>
                <div class="newspaper" v-html="body"></div>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";

export default {
	name: "Pages",
	mixins: [Util],
	components: {},
	data() {
		return {
			body: null,
			slug: null,
			title: null,
			copertina: null,
			description: null,
		};
	},
	async created() {
		this.slug = this.$route.params.slug;
		let a = await UserService.getArticle(this.slug);
		this.body = a.data.article.body;
		this.title = a.data.article.title;
		this.description = a.data.article.description;
		let cms = process.env.VUE_APP_CMS;
		this.copertina = cms + "images" + a.data.article.copertina + "?h150&fit=crop";
	},
};
</script>
<style scoped>
.newspaper {
    column-count: 2;
    column-gap: 40px;
    column-rule-style: solid;
    column-rule-width: 1px;
}
</style>
