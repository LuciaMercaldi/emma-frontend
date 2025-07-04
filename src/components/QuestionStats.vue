<template>
    <div>


        <h3>
            Statistiche
            <span class="small">
                <b-badge variant="primary">Live</b-badge>
            </span>
        </h3>

        <div class="row">
            <div class="col-md-6 col-xl-3" v-for="s in statsCards" :key="s.title">
                <stats-card>
                    <div class="icon-big text-center" :class="`icon-${s.type}`" slot="header">
                        <i :class="s.icon"></i>
                    </div>
                    <div class="numbers" slot="content">
                        <p class="title-uppercase">{{ s.title }}</p>
                        <span v-if="s.percentage" class="small-percent">({{ s.percentage }}% )
                        </span>
                        {{ s.value }}
                    </div>
                    <div class="stats" slot="footer">
                        <i :class="s.footerIcon"></i>
                        <a v-if="s.footerUrl" :href="`${s.footerUrl}${survey_id}`">{{
                            s.footerText
                        }}</a>
                        <span v-else>{{ s.footerText }}</span>
                    </div>
                </stats-card>
            </div>
        </div>
    </div>
</template>
<script>

import { StatsCard } from "@/components/index";
import UserService from "@/services/user.service";

export default {
    name: "question-stats",
    components: {
        StatsCard,
    },
    props: {
        survey_id: Number,
    },
    data() {
        return {
            stats: null,
            statsIntervalId: null,
            statsCards: [
                {
                    type: "primary",
                    icon: "ti-view-list-alt",
                    title: "Compilati",
                    percentage: 0,
                    value: "",
                    footerText: "Dettaglio",
                    footerIcon: "ti-arrow-right",
                    footerUrl: "/questionari/delivery-stats/",
                },
                {
                    type: "success",
                    icon: "ti-email",
                    title: "Inviti",
                    value: "",
                    footerText: "Errori",
                    footerIcon: "ti-flag",
                },
                {
                    type: "warning",
                    icon: "ti-email",
                    title: "Promemoria Inviati",
                    value: "",
                    footerText: "Aggiornato ora",
                    footerIcon: "ti-reload",
                },
                {
                    type: "danger",
                    icon: "ti-email",
                    title: "Promemoria Inviabili",
                    value: "",
                    footerText: "Aggiornato ora",
                    footerIcon: "ti-reload",
                },
            ],
        };
    },  //data
    watch: {
        stats: function () {
            if (this.stats) {
                this.statsCards[1].value = `${this.stats.participants.sent}/${this.stats.participants.invitation_sent_num}`;
                this.statsCards[1].footerText = `${this.stats.participants.errors} Errori di invio`;
                this.statsCards[2].value = `${this.stats.participants.reminder_sent_num}`;
                this.statsCards[3].value = `${this.stats.participants.sendable_reminder_num}`;
                if (this.stats.participants.total_num > 0) {
                    this.statsCards[0].value = `${this.stats.participants.survey_completed_num}/${this.stats.participants.total_num}`;
                    this.statsCards[0].percentage = (
                        (this.stats.participants.survey_completed_num /
                            this.stats.participants.total_num) *
                        100
                    ).toFixed(2);
                } else {
                    this.statsCards[0].percentage = "0";
                    this.statsCards[0].value = `${this.stats.participants.survey_completed_num}/0`;
                }
            }
        }
    }, //watch
    async mounted() {
        try {
            let response = await UserService.getStats(this.$route.params.survey_id,true);
            this.stats = response.data.stats;
        } catch (e) {
            this.stats = null;
            //console.log(e);
        }
        this.statsIntervalId = setInterval(async () => {
            try {
                let response = await UserService.getStats(this.$route.params.survey_id,true);
                this.stats = response.data.stats;
            } catch (e) {
                this.stats = null;
                //console.log(e);
            }
        }, 30000);
    },
    beforeDestroy: function () {
        if (this.statsIntervalId) {
            clearInterval(this.statsIntervalId);
        }

    },

}
</script>