<template>
    <card class="card-user">
        <div slot="image">
            <img src="@/assets/img/background.jpg" alt="..." />
        </div>
        <div>
            <div class="author">
                <h4 class="title">
                    {{ user.first_name }} {{ user.last_name }}
                    <br />
                    <a :href="`mailto:${user.email}`">
                        <small>{{ user.email }}</small>
                    </a>
                </h4>
            </div>                    
        </div>
    </card>
</template>
<script>
import Util from "@/mixing/util";
export default {
	mixins: [Util],
	data() {
		return {
			user: {},
		};
	},
	mounted: function () {
		this.user = this.$cookies.get("user");
	},
	methods: {},
};
</script>
<style></style>
