<template>
    <div>
        <b-overlay :show="isBusy" rounded="sm">
			<div class="d-flex align-items-center justify-content-between mb-3 w-100">
				<b-pagination
					v-model="pagination.page"
					:total-rows="pagination.count"
					:per-page="pagination.perPage"
					first-text="First"
					prev-text="Prev"
					next-text="Next"
					last-text="Last"
					align="center"
					@change="changePage"
					@input="isCurrentPage"
					class="flex-grow-1"
				></b-pagination>
				<div v-if="isAuthorized('admin')" class="ml-3">
					<b-button id="UserRegen" @click="generateDeletedUsers()">
						Ripristina utenti
					</b-button>
					<b-popover target="UserRegen" triggers="hover" html >
						<template #title>Rigenera gli utenti mancanti</template>
					</b-popover>
				</div>
			</div>
			
            <div v-if="users.length == 0">
                <h2>Non ci sono ancora risposte a questo questionario</h2>
            </div>
            <b-table v-else
                striped
                hover
                id="usersTable"
                :items="users"
                :fields="['user_id', 'modified', 'origin.geocoded_at', 'actions']"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :busy="isBusy"
                :current-page="pagination.page"
                :per-page="pagination.perPage"
            >
			
                <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Loading...</strong>
                    </div>
                </template>

                <template v-slot:cell(user_id)="row">
                    <router-link :to="`/questionari/answers/${survey_id}/${row.item.user_id}`">
                        {{ niceName(row.item) }}
                    </router-link>
                </template>

                <template v-if="origin" v-slot:cell(origin)="row">
                    <b-badge v-if="row.item.origin.geocoded_at" variant="success" :title="row.item.origin.geocoded_at">
                        <span class="ti-world"></span> {{ row.item.origin.address }}
                    </b-badge>
                    <b-badge v-else variant="danger">{{ row.item.origin.address }} </b-badge>
                    <span class="ti-pencil" @click="editAddress()"></span>
                </template>

                <template v-slot:cell(actions)="row">
                    <b-link class="action" @click.prevent="del_answers(survey_id, row.item.user_id)">Elimina</b-link>
                </template>
            </b-table>
            <b-pagination
                v-model="pagination.page"
                :total-rows="pagination.count"
                :per-page="pagination.perPage"
                first-text="First"
                prev-text="Prev"
                next-text="Next"
                last-text="Last"
                align="center"
                @change="changePage"
                @input="isCurrentPage"
                class="mt-3"
            ></b-pagination>
        </b-overlay>
    </div>
</template>

<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";

export default {
    name: "QuestionariRisposte",
    mixins: [Util],
    data() {
        return {
            isBusy: true,
            survey_id: null,
            users: [],
            origin: null,
            sortBy: "modified",
            sortDesc: true,
            pagination: {
                page: 1,
                perPage: 100,
                count: 0,
                pageCount: 1,
            },
        };
    },
    methods: {
        del_answers(survey_id, user_id) {
            this.$bvModal.msgBoxConfirm(`Vuoi davvero cancellare le risposte dell'utente ${user_id}? `, {})
                .then(async (value) => {
                    if (value) {
                        let response = await UserService.deleteAnswers(survey_id, user_id);
                        this.$bvToast.toast(response.data.msg, {
                            title: "Info",
                            autoHideDelay: 2000,
                            appendToast: true,
                            variant: "info",
                        });
                        this.fetchUsers();
                    }
                });
        },
        async fetchUsers() {
            this.isBusy = true;
            this.survey_id = this.$route.params.survey_id;

            // Build query string for pagination
            let queryString = `page=${this.pagination.page}&perPage=${this.pagination.perPage}`;
            if (this.sortBy) {
                queryString += `&sortBy=${this.sortBy}`;
            }
            if (this.sortDesc !== null) {
                queryString += `&direction=${this.sortDesc ? "desc" : "asc"}`;
            }

            try {
                const response = await UserService.getAnswerUsersList(this.survey_id, queryString);
                this.users = response.data.users;
                if (response.data.pagination && response.data.pagination.Users) {
                    this.pagination.count = response.data.pagination.Users.count;
                    this.pagination.perPage = response.data.pagination.Users.perPage;
                } else {
                    this.pagination.count = response.data.users.length;
                }
            } catch (error) {
                this.$bvToast.toast(error.message, {
                    title: "Errore",
                    autoHideDelay: 2000,
                    appendToast: true,
                    variant: "danger",
                });
            } finally {
                this.isBusy = false;
            }
        },
        niceName(item) {
            let anonimo = true;

            if (!item.user) {
                return "";
            }
            if (!item.user.hasOwnProperty("first_name")) {
                item.user.first_name = "";
            }
            if (!item.user.hasOwnProperty("last_name")) {
                item.user.last_name = "";
            }
            if (item.user.first_name + item.user.last_name == "") {
                return "Anonimo-" + item.user_id.substring(1, 4);
            } else {
                if (anonimo) {
                    return "Anonimo-" + item.user_id.substring(1, 4);
                }
                return `${item.user.first_name} ${item.user.last_name}`;
            }
        },
        editAddress() {
            alert("Qui potrai correggere l'indirizzo inserito dall'utente");
        },
        isCurrentPage(page) {
            this.pagination.page = page;
            localStorage.setItem("page", this.pagination.page);
            //this.fetchUsers();
            this.$root.$emit("bv::refresh::table", "usersTable");
        },
        changePage(page) {
            this.pagination.page = page;
            localStorage.setItem("page", this.pagination.page);
            //this.fetchUsers();
            this.$root.$emit("bv::refresh::table", "usersTable");
        },
        generateDeletedUsers() {
            this.$bvModal.msgBoxConfirm("Vuoi davvero rigenerare gli utenti mancanti?", {})
                .then(async (value) => {
                    if (value) {
                        try {
                            this.isBusy = true;
                            this.$bvToast.toast("Rigenerazione in corso...", {
                                title: "Info",
                                autoHideDelay: 2000,
                                appendToast: true,
                                variant: "info",
                            });
                            const response = await UserService.generateDeletedUsers(this.survey_id);
                            this.isBusy = false;
                            if (response.data.error) {
                                throw new Error(response.data.error);
                            }
                            this.$bvToast.toast(response.data.msg, {
                                title: "Info",
                                autoHideDelay: 2000,
                                appendToast: true,
                                variant: "info",
                            });
                            this.fetchUsers();
                        } catch (error) {
                            this.$bvToast.toast(error.message, {
                                title: "Errore",
                                autoHideDelay: 2000,
                                appendToast: true,
                                variant: "danger",
                            });
                        }
                    }
                });
        },
    },
    async mounted() {
        // Initialize page from query or localStorage
        if (this.$route.query.page) {
            this.pagination.page = Number(this.$route.query.page);
        } else if (localStorage.getItem("page")) {
            this.pagination.page = Number(localStorage.getItem("page"));
        }
        await this.fetchUsers();
    },
};
</script>

<style></style>