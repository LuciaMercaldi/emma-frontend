<template>
    <component :is="tag" @click.native="hideSidebar" class="nav-item" v-bind="$attrs" tag="li" v-if="isAuth">
        <a class="nav-link">
            <slot>
                <i v-if="icon" :class="icon"></i>
                <p>{{ name }}</p>
            </slot>
        </a>
    </component>
</template>
<script>
import Util from "@/mixing/util";

export default {
	name: "sidebar-link",
	mixins: [Util],
	inheritAttrs: false,
	inject: {
		autoClose: {
			default: true,
		},
		addLink: {
			default: () => {},
		},
		removeLink: {
			default: () => {},
		},
	},
	props: {
		name: String,
		icon: String,
		tag: {
			type: String,
			default: "router-link",
		},
		authorize: String,
	},
	methods: {
		hideSidebar() {
			if (this.autoClose) {
				this.$sidebar.displaySidebar(false);
			}
		},
		isActive() {
			return true;
		},
	},
	mounted() {
		if (this.addLink) {
			this.addLink(this);
		}
	},
	beforeDestroy() {
		if (this.$el && this.$el.parentNode) {
			this.$el.parentNode.removeChild(this.$el);
		}
		if (this.removeLink) {
			this.removeLink(this);
		}
	},

	computed: {
		isAuth() {
			return this.isAuthorized(this.authorize);
		},
	},
};
</script>
<style></style>
