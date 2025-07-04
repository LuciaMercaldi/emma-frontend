<template>
    <div class="container">
        <template>
            <b-breadcrumb :items="items"></b-breadcrumb>
        </template>
        <b-row>
            <b-col>
                <h1>Privacy Policy</h1>
            </b-col>
        </b-row>
    </div>
</template>
<script>
export default {
	name: "Privacy",
	data() {
		return {
			items: [
				{
					text: "Home",
					href: "/",
				},
				{
					text: "Privacy",
					active: true,
				},
			],
		};
	},
};
</script>
