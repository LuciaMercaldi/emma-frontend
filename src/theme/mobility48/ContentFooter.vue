<template>
    <footer class="footer fixed-bottom" style="z-index: 0">
        <div class="container-fluid d-flex flex-wrap justify-content-between small">
            <img :src="`${publicPath}${footer}`" :alt="footer_alt" style="height: 80px" />
            <router-link to="/privacy" style="margin-top: 2em">Privacy Policy Mobility48</router-link> &nbsp;            
            <div class="copyright d-flex flex-wrap" style="color: silver">
                versione: {{ version }}
                Sviluppata da 
                <a href="https://impronta48.it" target="_blank" style="color: silver"> &nbsp; iMpronta.</a>
            </div>
        </div>
    </footer>
</template>
<script>
export default {
	name: "Footer",
	data: function () {
		return {
			footer: process.env.VUE_APP_FOOTER,
			footer_alt: process.env.VUE_APP_FOOTERALT,
			publicPath: process.env.BASE_URL,
			help_mail: process.env.VUE_APP_HELP_MAIL,
			version: process.env.VUE_APP_GIT_TAG,
		};
	},
};
</script>
<style></style>
