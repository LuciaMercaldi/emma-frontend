<template>
    <footer class="footer fixed-bottom" style="z-index: -1">
        <div class="float-right slim-footer">
            <img :src="`${publicPath}${footer}`" :alt="footer_alt" style="height: 80px" />
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
<style>
</style>
