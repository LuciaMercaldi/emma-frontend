<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light" v-if="loggedUser">
      <div class="container-fluid">
        <b-dropdown 
          id="dropdownButton" 
          variant="primary" 
          class="ml-3" 
          :disabled="isDropdownDisabled"
          v-b-popover.hover="isDropdownDisabled ? 'L\'anno selezionato non influenza questa pagina' : ''"
          >
          <template #button-content>
            <span class="ti-calendar mr-1"></span>
            {{ year }}&nbsp;
          </template>
          <b-dropdown-item
            v-for="option in yearOptions"
            :key="option"
            @click="setYear(option)"
          >
            {{ option }}
          </b-dropdown-item>
        </b-dropdown>
        <a class="navbar-brand" href="#">{{ routeName }}</a>
        		
        <button
          class="navbar-toggler navbar-burger"
          type="button"
          @click="toggleSidebar"
          :aria-expanded="$sidebar.showSidebar"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-bar"></span>
          <span class="navbar-toggler-bar"></span>
          <span class="navbar-toggler-bar"></span>
        </button>
        
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ml-auto">
            <!--<drop-down
              class="nav-item"
              :title="year"
              title-classes="nav-link"
              icon="ti-calendar">
              <a 
                v-for="option in yearOptions" 
                :key="option" 
                class="dropdown-item" 
                @click="setYear(option)">
                &nbsp;{{ option }}
              </a>
          </drop-down>-->      
            <li class="nav-item" v-if="canShowUserGuide">
              <a class="nav-link" @click="download('users/get-faq')" href="#" :disabled="btnloading">
                <span class="ti-help-alt"></span>
                Faq
              </a>
            </li>
            <li class="nav-item" v-if="canShowUserGuide">      
              <router-link  class="nav-link"  to="/contatti" :disabled="btnloading">
                <span class="ti-email"></span>
                Contatti
              </router-link>
            </li>
            <li class="nav-item" v-if="canShowUserGuide">      
              <a class="nav-link" @click="download('users/get-guide')" href="#" :disabled="btnloading">
                <span class="ti-book"></span>
                Manuale Utente
              </a>
            </li>
            <drop-down
              class="nav-item"
              :title="username"
              title-classes="nav-link"
              icon="ti-user">
              <router-link class="dropdown-item" to="/profile">Modifica Profilo</router-link>
              <a class="dropdown-item" @click="logout">Logout</a>
            </drop-down>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>

import Util from "@/mixing/util";
import UserService from "@/services/user.service";



export default {
	mixins: [Util],
	computed: {
		routeName() {
			const { name } = this.$route;
			return this.capitalizeFirstLetter(name);
		},
		username() {
			return this.loggedUser ? this.loggedUser.email : null;
		},
    isDropdownDisabled() {
      // cerca match esatti tra gli URL
      if (this.disabledPages.includes(this.$route.path)) {
        return true;
      }
      // altrimenti va sui match parziali
      return this.disabledPages.some(pattern => new RegExp(`^${pattern.replace('*', '.*')}$`).test(this.$route.path));
    }
	},
	data() {
		return {
			loggedUser: null,
      btnloading: false,
      disabledPages: ['/momarea' , '/analytics', '/offices/*', '/questionari/*'] // lista di pagine in cui il filtro anno è :disabled
      // year: new Date().getFullYear(),
		};
	},
	async created() {
		this.loggedUser = this.getUser;
    // get year from cookie
    this.getYear();
	},
	methods: {
    download(url) {
			this.btnloading = true;
			UserService.download(url).then(() => {
				this.btnloading = false;
			});
		},
		capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		toggleSidebar() {
			this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
		},
		hideSidebar() {
			this.$sidebar.displaySidebar(false);
		},
	},
};
</script>
<style></style>
