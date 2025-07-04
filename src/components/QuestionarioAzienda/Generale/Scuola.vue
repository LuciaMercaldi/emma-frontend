<template>
    <div>
        <div id="info_azienda_scuola">
            <h1><b>Informazioni di Contesto</b></h1>
            <div id="step-1" value="step-1">
                <h2>Dati Scuola</h2>
                <p>In questa sezione vengono raccolte informazioni generali sulla scuola.</p>
                <b-form-group>
                    <label for="nome">Ragione Sociale </label>
                    <b-form-input id="nome" type="text" v-model="form.nome" name="nome" required class="mb-3" placeholder="Inserire la ragione sociale"></b-form-input>

                    <label for="codice_ateco">Codice ATECO </label>
                    <b-form-input
                        id="codice_ateco"
                        type="text"
                        v-model="form.codice_ateco"
                        name="codice_ateco"
                        required
                        class="mb-3"
                        placeholder="Inserire il codice ATECO"></b-form-input>

                    <label for="indirizzo">Indirizzo Sede Legale</label>
                    <b-form-input
                        id="indirizzo"
                        type="text"
                        v-model="form.indirizzo"
                        name="indirizzo"
                        required
                        class="mb-3"
                        placeholder="es.Corso Vittorio Emanuele II, 77"></b-form-input>

                    <label for="comune">Comune Sede Principale</label>
                    <b-form-input id="comune" type="text" v-model="form.comune" name="comune" required class="mb-3" placeholder="es. Torino"></b-form-input>

                    <label for="cap">CAP Sede Principale</label>
                    <b-form-input id="cap" type="number" v-model="form.cap" name="cap" required class="mb-3" placeholder="es. 10128"></b-form-input>

                    <label for="nr_sedi">Numero Plessi Scolastici</label>
                    <b-form-input id="nr_sedi" type="number" v-model="form.nr_sedi" name="nr_sedi" required class="mb-3"></b-form-input>

                    <label for="nr_dipendenti">Numero Totale Studenti + Insegnanti + Personale ATA</label>
                    <b-form-input id="nr_dipendenti" type="number" v-model="form.nr_dipendenti" name="nr_dipendenti" required class="mb-3" placeholder="es. 390"></b-form-input>

                    <label for="nr_impiegati_operai">Numero di Dipendenti della sede con Qualifica di Personale ATA</label>
                    <b-form-input
                        id="nr_impiegati_operai"
                        type="number"
                        v-model="form.nr_impiegati_operai"
                        name="nr_impiegati_operai"
                        required
                        class="mb-3"
                        placeholder="es. 5"></b-form-input>

                    <label for="nr_quadri_dirigenti">Numero Totale di Insegnanti di Tutta la Sede </label>
                    <b-form-input
                        id="nr_quadri_dirigenti"
                        type="number"
                        v-model="form.nr_quadri_dirigenti"
                        name="nr_quadri_dirigenti"
                        required
                        class="mb-3"
                        placeholder="es. 35"></b-form-input>

                    <label for="nr_studenti">Numero Totale di Studenti di Tutta la Sede </label>
                    <b-form-input id="nr_studenti" type="number" v-model="form.nr_studenti" name="nr_studenti" required class="mb-3" placeholder="es. 350"></b-form-input>
                </b-form-group>
            </div>

            <!-- step-2: Info sul mobility manager-->
            <div id="step-2" value="step-2">
                <h2>Il Mobility Manager Scolastico</h2>
                <p>Alcune informazioni sul Mobility Manager Scolastico.</p>

                <b-form-group>
                    <label for="rapporto_lavorativo">Il rapporto lavorativo del Mobility Manager con la scuola</label>
                    <b-form-select v-model="form.rapporto_lavorativo" :options="l_rapporto_lavorativo" class="mb-3" required name="rapporto_lavorativo"></b-form-select>

                    <label for="inquadramento_lavorativo">Inquadramento lavorativo</label>
                    <b-form-select v-model="form.inquadramento_lavorativo" :options="l_inquadramento_lavorativo_sc" class="mb-3" name="inquadramento_lavorativo"></b-form-select>

                    <label for="mm_orario_lavoro">Orario di lavoro del Mobility Manager</label>
                    <b-form-select v-model="form.mm_orario_lavoro" :options="l_mm_orario_lavoro" class="mb-3" name="mm_orario_lavoro"></b-form-select>

                    <label for="mm_sesso">Sesso</label>
                    <b-form-select v-model="form.mm_sesso" :options="l_mm_sesso" class="mb-3" name="mm_sesso"></b-form-select>

                    <label for="mm_eta">Fascia di età</label>
                    <b-form-select v-model="form.mm_eta" :options="l_mm_eta" class="mb-3" name="mm_eta"></b-form-select>

                    <label for="mm_luogo_servizio">Dove presta servizio il Mobility Manager</label>
                    <b-form-select v-model="form.mm_luogo_servizio" :options="l_sede_filiale" class="mb-3" name="mm_luogo_servizio"></b-form-select>
                </b-form-group>
            </div>
            <!-- /step-2: Info sul mobility manager-->
        </div>
    </div>
</template>

<script>
import { l_rapporto_lavorativo, l_inquadramento_lavorativo_sc, l_mm_orario_lavoro, l_mm_sesso, l_mm_eta, l_sede_filiale } from "@/data/company-survey.config";

export default {
	name: "QuestionarioGeneraleScuola",
	props: {
		form: Object,
	},
	data() {
		return {
			l_rapporto_lavorativo: l_rapporto_lavorativo,
			l_inquadramento_lavorativo_sc: l_inquadramento_lavorativo_sc,
			l_mm_orario_lavoro: l_mm_orario_lavoro,
			l_mm_sesso: l_mm_sesso,
			l_mm_eta: l_mm_eta,
			l_sede_filiale: l_sede_filiale,
		};
	},
	methods: {},
};
</script>

<style></style>
