<template>
    <div>
        <div id="info_azienda_scuola">
            <!-- step-3: info sulla sede che compila il questionario-->
            <div id="step-3" value="step-3">
                <h2>Plesso Scolastico a cui si Riferisce l'Indagine</h2>
                <p>In questa sezione vengono raccolte informazioni specifiche sulla scuola a cui si riferisce la compilazione del questionario.</p>
                <b-form-group>
                    <label for="ul_sede_filiale">Plesso Principale o Secondario?</label>
                    <b-form-select v-model="form.ul_sede_filiale" :options="l_sede_filiale" class="mb-3" name="ul_sede_filiale"></b-form-select>

                    <label for="ul_comune">Comune Plesso Scolastico</label>
                    <b-form-input id="ul_comune" type="text" v-model="form.ul_comune" name="ul_comune" required class="mb-3" placeholder="es. Torino"></b-form-input>

                    <label for="ul_cap">CAP Plesso Scolastico</label>
                    <b-form-input id="ul_cap" type="number" v-model="form.ul_cap" name="ul_cap" required class="mb-3" placeholder="es. 10128"></b-form-input>

                    <label for="ul_indirizzo">Indirizzo Plesso Scolastico</label>
                    <b-form-input
                        id="ul_indirizzo"
                        type="text"
                        v-model="form.ul_indirizzo"
                        name="ul_indirizzo"
                        required
                        class="mb-3"
                        placeholder="es. Corso Vittorio Emanuelle II, 77"></b-form-input>
                </b-form-group>
            </div>
            <!-- /step-3: info sulla sede che compila il questionario-->

            <!-- step-4: personale dell'Unità Locale-->
            <div id="step-4" value="step-4">
                <h2>Informazioni sul Personale del Plesso Scolastico</h2>
                <p>Alcune informazioni sul personale e sugli studenti del plesso scolastico a cui si riferisce la compilazione del questionario.</p>

                <b-form-group>
                    <label for="ul_nr_dipendenti">Numero di insegnanti + personale ATA</label>
                    <b-form-input
                        id="ul_nr_dipendenti"
                        type="number"
                        v-model="form.ul_nr_dipendenti"
                        name="ul_nr_dipendenti"
                        required
                        class="mb-3"
                        placeholder="Inserire il numero totale di insegnanti e personale ATA"></b-form-input>

                    <label for="ul_nr_studenti">Numero di studenti</label>
                    <b-form-input
                        id="ul_nr_studenti"
                        type="number"
                        v-model="form.ul_nr_studenti"
                        name="ul_nr_studenti"
                        required
                        class="mb-3"
                        placeholder="Inserire il numero totale di studenti"></b-form-input>
                </b-form-group>
            </div>
            <!-- /step-4:personale dell'Unità Locale-->

            <!-- step-5: distribuzione settimanale del lavoro-->
            <div id="step-5" value="step-5">
                <h2>Distribuzione settimanale e orari dell'insegnamento</h2>
                <p>In questa sezione vengono richieste informazioni sui giorni e sugli orari dell'insegnamento</p>
                <b-form-group>
                    <label for="distribuzione_lavoro">Distribuzione settimanale dell'insegnamento</label>
                    <b-form-select v-model="form.distribuzione_lavoro" :options="l_distribuzione_lavoro" class="mb-3" required name="distribuzione_lavoro"></b-form-select>
                </b-form-group>
            </div>
            <!-- /step-5: distribuzione settimanale del lavoro-->

            <!-- step-6: turni di lavoro attuali-->
            <div id="step-6" value="step-6">
                <b-form-group>
                    <label for="orario_ingresso">Orario di ingresso</label>
                    <b-form-input id="orario_ingresso" name="orario_ingresso" v-model="form.orario_ingresso" class="mb-3" placeholder="es. 8:30"></b-form-input>

                    <label for="orario_uscita">Orario di uscita</label>
                    <b-form-input id="orario_uscita" name="orario_uscita" v-model="form.orario_uscita" class="mb-3" placeholder="es. 13:30"></b-form-input>
                </b-form-group>
                <!--/attenzione: gruppo visibile solo se turni_esistenti = no -->
            </div>
            <!-- /step-6:turni di lavoro attuali-->

            <!-- step-7: mensa-->
            <div id="step-7" value="step-7">
                <h2>Mensa Aziendale</h2>
                <b-form-group>
                    <label for="mensa">E' presente un servizio di mensa interna?</label>
                    <b-form-select class="mb-3" name="mensa" v-model="form.mensa" :options="l_si_no" required></b-form-select>

                    <div v-if="form.mensa == 'sì'">
                        <label for="mensa_frequenza">Da quante persone è frequentata?</label>
                        <b-input-group class="mt-3">
                            <template v-slot:append>
                                <b-input-group-text><strong>%</strong></b-input-group-text>
                            </template>
                            <b-form-input
                                id="mensa_frequenza"
                                name="mensa_frequenza"
                                type="number"
                                v-model="form.mensa_frequenza"
                                placeholder="Indicare la percentuale degli insegnanti, personale ATA e studenti che frequenta la mensa, es. 85%"></b-form-input>
                        </b-input-group>
                    </div>
                </b-form-group>
            </div>
            <!-- /step-7:mensa-->
        </div>
        <!-- /sezione info azienda scuola-->

        <!-- MoMa - Mezzi di Trasporto **********************************************************************-->
        <!-- **************************************************************************************-->
        <div id="moma_mezzi_trasporto">
            <h1>Mezzi di Trasporto Disponibili</h1>

            <!-- step-10: localizzazione-->
            <div id="step-10" value="step-10">
                <h2>Localizzazione</h2>
                <p>Qui vengono raccolte informazioni sulla localizzazione della scuola nell'ambito urbano.</p>
                <b-form-group>
                    <label for="localizzazione">Dove si colloca la scuola</label>
                    <b-form-select class="mb-3" name="localizzazione" v-model="form.localizzazione" :options="l_localizzazione" required></b-form-select>
                    <div v-if="form.localizzazione == 'altro'">
                        <label for="localizzazione_altro">Altro, specificare:</label>
                        <b-form-input
                            id="localizzazione_altro"
                            name="localizzazione_altro"
                            type="text"
                            v-model="form.localizzazione_altro"
                            required
                            class="mb-3"
                            placeholder="In caso di 'Altro' specificare"></b-form-input>
                    </div>

                    <label for="ztl">La scuola è situata in una zona a traffico limitato?</label>
                    <b-form-select class="mb-3" name="ztl" v-model="form.ztl" :options="l_si_no" required></b-form-select>

                    <label for="sosta">La sosta intorno alla scuola è soggetta a tariffazione oraria?</label>
                    <b-form-select name="sosta" class="mb-3" v-model="form.sosta" :options="l_si_no" required></b-form-select>

                    <div v-if="form.sosta == 'sì'">
                        <label for="sosta_tariffazione">In caso affermativo indicare il costo orario (€/ora).</label>
                        <b-form-input
                            id="sosta_tariffazione"
                            type="number"
                            v-model="form.sosta_tariffazione"
                            name="sosta_tariffazione"
                            required
                            class="mb-3"
                            placeholder="Indicare il costo orario della sosta (€/ora)"></b-form-input>
                    </div>
                </b-form-group>
            </div>
            <!-- /step-10: localizzazione-->

            <!-- step-11: accessibilità-->
            <div id="step-11" value="step-11">
                <h2>Accessibilità</h2>
                <p>I seguenti dati permettono di valutare il livello di accessibilità della scuola.</p>

                <h3>Pedonale</h3>
                <b-form-group id="pedonale">
                    <label for="pedonale">La sede è facilmente raggiungibile a piedi?</label>
                    <b-form-select name="pedonale" class="mb-3" v-model="form.pedonale" :options="l_si_no" required></b-form-select>

                    <div v-if="form.pedonale == 'sì'">
                        <label>Sono presenti attraversamenti pedonali in prossimità dell’ingresso alla sede della scuola?</label>
                        <b-form-select name="pedonale_attraversamenti" class="mb-3" v-model="form.pedonale_attraversamenti" :options="l_si_no" required></b-form-select>
                    </div>
                </b-form-group>

                <h3>Ciclabile</h3>
                <b-form-group id="ciclabile">
                    <label for="ciclabile">Sono presenti piste ciclabili in prossimità della scuola?</label>
                    <b-form-select name="ciclabile" class="mb-3" v-model="form.ciclabile" :options="l_si_no" required></b-form-select>

                    <div v-if="form.ciclabile == 'sì'">
                        <label>la pista ciclabile è in sede riservata (= pista ciclabile in sede propria o su corsia riservata) o promiscua (=con pedoni o con veicoli a motore su
                            carreggiata stradale)?</label>
                        <b-form-select name="ciclabile_sede" class="mb-3" v-model="form.ciclabile_sede" :options="['riservata', 'promiscua']" required></b-form-select>
                    </div>
                </b-form-group>

                <h3>Trasporto Pubblico Locale</h3>
                <b-form-group id="trasporto_pubblico">
                    <label for="tpl">La scuola è raggiungibile con il trasporto pubblico?</label>
                    <b-form-select name="tpl" class="mb-3" v-model="form.tpl" :options="l_si_no" required></b-form-select>

                    <div v-if="form.tpl == 'sì'">
                        <label>Indicare le linee e fermate del trasporto pubblico nelle vicinanze della scuola (indicare tutte quelle a meno di 500m).</label>
                        <b-row v-for="lf in form.linee_fermate" :key="lf.id" class="my-1">
                            <input type="hidden" :value="lf.id" />
                            <b-col sm="3">
                                <label for="linea_nome">Nome/numero linea:</label>
                                <b-form-input name="linea_nome" size="sm" v-model="lf.linea_nome" placeholder="es. SFM1"></b-form-input>
                            </b-col>

                            <b-col sm="3">
                                <label for="linea_tipo">Tipo linea:</label>
                                <b-form-input name="linea_tipo" size="sm" v-model="lf.linea_tipo" placeholder="es. extraurbana8"></b-form-input>
                            </b-col>

                            <b-col sm="3">
                                <label for="fermata_nome">Nome/numero fermata:</label>
                                <b-form-input name="fermata_nome" size="sm" v-model="lf.fermata_nome" placeholder="es. 38"></b-form-input>
                            </b-col>

                            <b-col sm="3">
                                <label for="fermata_distanza">Distanza fermata (m):</label>
                                <b-form-input name="fermata_distanza" type="number" size="sm" v-model="lf.fermata_distanza" placeholder="es. 120"></b-form-input>
                            </b-col>
                        </b-row>

                        <b-button variant="primary" @click="aggiungi_linea_fermata" class="mr-2 mb-4">Aggiungi linea</b-button>
                        <!--add ogni click si aggiunge un'altra riga, attenzione: cosa succede con il salvataggio dei dati?-->
                    </div>
                </b-form-group>

                <h3>Bike sharing</h3>
                <b-form-group id="bike_sharing">
                    <label for="bike_sharing">La scuola è servita dal bike sharing?</label>
                    <b-form-select name="bike_sharing" class="mb-3" v-model="form.bike_sharing" :options="l_si_no" required></b-form-select>

                    <div v-if="form.bike_sharing == 'sì'">
                        <label for="bike_sharing_tipo">Che tipologia?</label>
                        <b-form-select name="bike_sharing_tipo" class="mb-3" v-model="form.bike_sharing_tipo" :options="l_bike_sharing" required></b-form-select>

                        <div v-if="form.bike_sharing_tipo != 0">
                            <label>Indicare le stazioni del bike sharing (station based) piu vicine (a meno di 500m di distanza).</label>
                            <b-row v-for="bs in form.bs_stazioni" :key="bs.id" class="my-1">
                                <input type="hidden" :value="bs.id" />
                                <b-col sm="2">
                                    <label for="bs_stazione_nome">Nome stazione:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input name="bs_stazione_nome" size="sm" v-model="bs.nome" placeholder="es. Bologna"></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="bs_stazione_distanza">Distanza stazione dalla sede (m):</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input name="bs_stazione_distanza" type="number" size="sm" v-model="bs.distanza" placeholder="es. 120"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-button variant="primary" @click="aggiungi_bs_stazione" class="mr-2 mb-4">Aggiungi stazione</b-button>
                            <!--add ogni click si aggiunge un'altra riga, attenzione: cosa succede con il salvataggio dei dati?-->
                        </div>
                    </div>
                </b-form-group>

                <h3>Car sharing</h3>
                <b-form-group id="car_sharing">
                    <label for="car_sharing">La scuola è servita dal car sharing?</label>
                    <b-form-select class="mb-3" name="car_sharing" v-model="form.car_sharing" :options="l_si_no" required></b-form-select>

                    <div v-if="form.car_sharing == 'sì'">
                        <label for="car_sharing_tipo">Che tipologia?</label>
                        <b-form-select name="car_sharing_tipo" class="mb-3" v-model="form.car_sharing_tipo" :options="l_car_sharing" required></b-form-select>

                        <div v-if="form.car_sharing_tipo != 'free floating'">
                            <label>Indicare le stazioni del car sharing (station based) piu vicine (a meno di 500m di distanza)</label>
                            <b-row v-for="cs in form.cs_stazioni" :key="cs.id" class="my-1">
                                <input type="hidden" :value="cs.id" />
                                <b-col sm="2">
                                    <label for="cs_stazione_nome">Nome stazione:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input name="cs_stazione_nome" size="sm" v-model="cs.nome" placeholder="es. Bologna"></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="cs_stazione_distanza">Distanza distanza dalla sede (m):</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input name="cs_stazione_distanza" type="number" size="sm" v-model="cs.distanza" placeholder="es. 120"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-button variant="primary" @click="aggiungi_cs_stazione" class="mr-2 mb-4">Aggiungi stazione</b-button>
                            <!--add ogni click si aggiunge un'altra riga, attenzione: cosa succede con il salvataggio dei dati?-->
                        </div>
                    </div>
                </b-form-group>

                <h3>Moto sharing</h3>
                <b-form-group id="moto_sharing">
                    <label for="moto_sharing">La scuola è servita dal servizio di moto sharing?</label>
                    <b-form-select name="moto_sharing" class="mb-3" v-model="form.moto_sharing" :options="l_si_no" required></b-form-select>
                </b-form-group>

                <h3>Monopattini</h3>
                <b-form-group id="monopattini">
                    <label for="monopattini">La scuola è servita dal servizio di monopattini?</label>
                    <b-form-select name="monopattini" class="mb-3" v-model="form.monopattini" :options="l_si_no" required></b-form-select>
                </b-form-group>
            </div>
            <!-- /step-11: accessibilità-->

            <!-- step-12: trasporto aziendale-->
            <div id="step-12" value="step-12">
                <h2>Trasporto Scolastico</h2>
                <p>Informazioni su eventuali servizi di navette e altri servizi di trasporto organizzati dalla scuola.</p>
                <b-form-group>
                    <label for="trasporto_aziendale">Sono disponibili servizi di trasporto scolastico (es. scuolabus)?</label>
                    <b-form-select class="mb-3" name="trasporto_aziendale" v-model="form.trasporto_aziendale" :options="l_si_no" required></b-form-select>

                    <div v-if="form.trasporto_aziendale == 'sì'">
                        <label for="nr_trasporto_aziendale">In caso affermativo indicare quanti:</label>
                        <b-form-input
                            id="nr_trasporto_aziendale"
                            type="number"
                            v-model="form.nr_trasporto_aziendale"
                            name="nr_trasporto_aziendale"
                            required
                            class="mb-3"
                            placeholder="es. 2"></b-form-input>

                        <label for="tragitto">Che tipologia di tragitti effettuano?</label>
                        <b-form-select class="mb-3" name="tragitto" v-model="form.tragitto" :options="l_tragitto" required></b-form-select>

                        <label for="km_percorsi">Chilometri totali annui percorsi (km/anno).</label>
                        <b-form-input id="km_percorsi" type="number" v-model="form.km_percorsi" name="km_percorsi" required class="mb-3" placeholder="es. 6500"></b-form-input>

                        <label for="costo_annuale">Costo complessivo annuale del servizio (€/anno).</label>
                        <b-form-input
                            id="costo_annuale"
                            type="number"
                            v-model="form.costo_annuale"
                            name="costo_annuale"
                            required
                            class="mb-3"
                            placeholder="es. 10500"></b-form-input>

                        <label for="costo_passeggero">Costo eventuale attribuito al passeggero per usufruire del servizio (€/anno).</label>
                        <b-form-input
                            id="costo_passeggero"
                            type="number"
                            v-model="form.costo_passeggero"
                            name="costo_passeggero"
                            required
                            class="mb-3"
                            placeholder="es. 5250"></b-form-input>
                    </div>
                </b-form-group>
            </div>

            <!-- /step-12: trasporto aziendale-->

            <!-- step-13: sosta interna-->
            <div id="step-13" value="step-13">
                <h2>Sosta Interna</h2>
                <p>
                    La sosta è una leva importante per la promozione della mobilità sostenibile. Di seguito vengono raccolte informazioni che permettono di analizzare lo stato
                    attuale della sosta disponibile presso la scuola.
                </p>
                <b-form-group>
                    <label for="sosta_aziendale">Sono disponibili parcheggi interni?</label>
                    <b-form-select name="sosta_aziendale" class="mb-3" v-model="form.az_sosta" :options="l_si_no" required></b-form-select>

                    <div v-if="form.az_sosta == 'sì'">
                        <h3>Auto</h3>

                        <label for="az_sosta_auto_nr">Numero di parcheggi per auto tradizionali.</label>
                        <b-form-input
                            id="az_sosta_auto_nr"
                            type="number"
                            v-model="form.az_sosta_auto_nr"
                            name="az_sosta_auto_nr"
                            required
                            class="mb-3"
                            placeholder="es. 35"></b-form-input>

                        <label for="az_sosta_auto_el_nr">Numero di parcheggi per auto elettriche (con possibilità di ricarica).</label>
                        <b-form-input
                            id="az_sosta_auto_el_nr"
                            type="number"
                            v-model="form.az_sosta_auto_el_nr"
                            name="az_sosta_auto_el_nr"
                            required
                            class="mb-3"
                            placeholder="es. 5"></b-form-input>

                        <label for="az_sosta_pagamento">I parcheggi interni sono a pagamento?</label>
                        <b-form-select class="mb-3" name="az_sosta_pagamento" v-model="form.az_sosta_pagamento" :options="l_si_no" required></b-form-select>

                        <div v-if="form.az_sosta_pagamento == 'sì'">
                            <label for="az_sosta_auto_costo">Tariffa media giornaliera parcheggio per auto tradizionali (€/giorno).</label>
                            <b-form-input
                                id="az_sosta_auto_costo"
                                type="number"
                                v-model="form.az_sosta_auto_costo"
                                name="az_sosta_auto_costo"
                                required
                                class="mb-3"
                                placeholder="es. 3"></b-form-input>

                            <label for="az_sosta_auto_el_costo">Tariffa media giornaliera parcheggio per auto elettrica (€/giorno).</label>
                            <b-form-input
                                id="az_sosta_auto_el_costo"
                                type="number"
                                v-model="form.az_sosta_auto_el_costo"
                                name="az_sosta_auto_el_costo"
                                required
                                class="mb-3"
                                placeholder="es. 3"></b-form-input>
                        </div>

                        <label for="az_sosta_visitatori">Esiste un parcheggio per visitatori/fornitori?</label>
                        <b-form-select name="az_sosta_visitatori" class="mb-3" v-model="form.az_sosta_visitatori" :options="l_si_no" required></b-form-select>

                        <div v-if="form.az_sosta_visitatori == 'sì'">
                            <label for="az_sosta_visitatori_nr">In caso affermativo indicare numero parcheggi:</label>
                            <b-form-input
                                id="az_sosta_visitatori_nr"
                                type="number"
                                v-model="form.az_sosta_visitatori_nr"
                                name="az_sosta_visitatori_nr"
                                required
                                class="mb-3"
                                placeholder="es. 5"></b-form-input>
                        </div>

                        <h3>Bici</h3>
                        <label for="az_sosta_bici">Ci sono percheggi riservati alle bici?</label>
                        <b-form-select name="az_sosta_bici" class="mb-3" v-model="form.az_sosta_bici" :options="l_si_no" required></b-form-select>

                        <div v-if="form.az_sosta_bici == 'sì'">
                            <label for="az_sosta_bici_nr">Numero di parcheggi per biciclette tradizionali.</label>
                            <b-form-input
                                id="az_sosta_bici_nr"
                                type="number"
                                v-model="form.az_sosta_bici_nr"
                                name="az_sosta_bici_nr"
                                required
                                class="mb-3"
                                placeholder="es. 45"></b-form-input>

                            <label for="az_sosta_bici_el_nr">Numero di parcheggi per biciclette elettriche (con possibilità di ricarica).</label>
                            <b-form-input
                                id="az_sosta_bici_el_nr"
                                type="number"
                                v-model="form.az_sosta_bici_el_nr"
                                name="az_sosta_bici_el_nr"
                                required
                                class="mb-3"
                                placeholder="es. 8"></b-form-input>
                        </div>

                        <label for="spogliatoi">Sono disponibili spogliatoi e docce?</label>
                        <b-form-select name="spogliatoi" class="mb-3" v-model="form.spogliatoi" :options="l_si_no_altro" required></b-form-select>

                        <h3>Motocicli</h3>
                        <label for="az_sosta_moto">Ci sono percheggi riservati ai motocicli?</label>
                        <b-form-select class="mb-3" name="az_sosta_moto" v-model="form.az_sosta_moto" :options="l_si_no" required></b-form-select>

                        <div v-if="form.az_sosta_moto == 'sì'">
                            <label for="az_sosta_moto_nr">Numero di parcheggi per motocicli tradizionali.</label>
                            <b-form-input
                                id="az_sosta_moto_nr"
                                type="number"
                                v-model="form.az_sosta_moto_nr"
                                name="az_sosta_moto_nr"
                                required
                                class="mb-3"
                                placeholder="es. 45"></b-form-input>

                            <label for="az_sosta_moto_el_nr">Numero di parcheggi per motocicli elettrici (con possibilità di ricarica).</label>
                            <b-form-input
                                id="az_sosta_moto_el_nr"
                                type="number"
                                v-model="form.az_sosta_moto_el_nr"
                                name="az_sosta_moto_el_nr"
                                required
                                class="mb-3"
                                placeholder="es. 8"></b-form-input>
                        </div>

                        <h3>Carpooling</h3>
                        <label for="az_sosta_carpooling">Ci sono parcheggi riservati al carpooling?</label>
                        <b-form-select name="az_sosta_carpooling" class="mb-3" v-model="form.az_sosta_carpooling" :options="l_si_no" required></b-form-select>

                        <div v-if="form.az_sosta_carpooling == 'sì'">
                            <label for="az_sosta_carpooling_nr">In caso affermativo indicare quanti:</label>
                            <b-form-input
                                id="az_sosta_carpooling_nr"
                                type="number"
                                v-model="form.az_sosta_carpooling_nr"
                                name="az_sosta_carpooling_nr"
                                required
                                class="mb-3"
                                placeholder="es. 6"></b-form-input>
                        </div>
                    </div>
                </b-form-group>
            </div>

            <!-- /step-13: sosta interna-->

            <!-- step-14: carpooling-->
            <div id="step-14" value="step-14">
                <h2>Carpooling</h2>

                <b-form-group>
                    <label for="carpooling">Ci sono persone che arrivano in carpooling?</label>
                    <b-form-select name="carpooling" class="mb-3" v-model="form.carpooling" :options="l_si_no" required></b-form-select>

                    <div v-if="form.carpooling == 'sì'">
                        <label for="carpooling_nr">In caso affermativo indicare il numero di persone</label>
                        <b-form-input id="carpooling_nr" type="number" v-model="form.carpooling_nr" name="carpooling_nr" required class="mb-3" placeholder="es.16"></b-form-input>
                    </div>

                    <label for="carpooling_contributo">Viene erogato un contributo per l'uso del carpooling?</label>
                    <b-form-select name="carpooling_contributo" class="mb-3" v-model="form.carpooling_contributo" :options="l_si_no" required></b-form-select>

                    <div v-if="form.carpooling_contributo == 'sì'">
                        <label>In caso affermativo indicare:</label>
                        <b-row v-for="cp in form.carpooling_contributi" :key="cp.id" class="my-1">
                            <input type="hidden" :value="cp.id" />
                            <b-col sm="2">
                                <label for="carpooling_contr_forma">La forma del contributo:</label>
                            </b-col>
                            <b-col sm="2">
                                <b-form-input name="carpooling_contr_forma" size="sm" v-model="cp.forma"></b-form-input>
                            </b-col>

                            <b-col sm="2">
                                <label for="carpooling_contr_importo">L'importo del contributo (€):</label>
                            </b-col>
                            <b-col sm="2">
                                <b-form-input name="carpooling_contr_importo" size="sm" type="number" v-model="cp.importo" placeholder="es. 300"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-button variant="primary" @click="aggiungi_carpooling_contr" class="mr-2 mb-4">Aggiungi contributo</b-button>
                    </div>

                    <div v-if="form.carpooling == 'sì'">
                        <label for="equipaggi">Come si formano gli equipaggi?</label>
                        <b-form-select class="mb-3" name="equipaggi" v-model="form.equipaggi" :options="l_equipaggi" required></b-form-select>

                        <div v-if="form.equipaggi == 'app'">
                            <label for="carpooling_app">In caso di app indicare nome</label>
                            <b-form-input id="carpooling_app" type="text" v-model="form.carpooling_app" name="carpooling_app" required class="mb-3"></b-form-input>
                        </div>
                    </div>
                </b-form-group>
            </div>

            <!-- /step-14: carpooling-->

            <!-- step-15: flotta aziendale-->
            <div id="step-15" value="step-15">
                <h2>Veicoli di Proprietà della Scuola</h2>

                <b-form-group>
                    <label for="az_veicoli">La scuola dispone di veicoli propri?</label>
                    <b-form-select name="az_veicoli" class="mb-3" v-model="form.az_veicoli" :options="l_si_no" required></b-form-select>

                    <div v-if="form.az_veicoli == 'sì'">
                        <h3>Auto</h3>
                        <label for="az_auto">Ci sono auto?</label>
                        <b-form-select class="mb-3" name="az_auto" v-model="form.az_auto" :options="l_si_no" required></b-form-select>

                        <div v-if="form.az_auto == 'sì'">
                            <label>In caso affermativo indicare:</label>
                            <b-row class="my-1">
                                <b-col sm="2">
                                    <label for="az_auto_nr">Numero auto:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_auto_nr" name="az_auto_nr" type="number" size="sm" v-model="form.az_auto_nr" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_auto_alimentazione">Tipologia alimentazione:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_auto_alimentazione" name="az_auto_alimentazione" size="sm" v-model="form.az_auto_alimentazione" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_auto_contratto">Tipologia contratto:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_auto_contratto" name="az_auto_contratto" size="sm" v-model="form.az_auto_contratto" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_auto_spostamento">Per quale tipo di spostamento (es. casa-scuola):</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_auto_spostamento" name="az_auto_spostamento" size="sm" v-model="form.az_auto_spostamento" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_auto_affidamento">Tipologia di affidamento:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_auto_affidamento" name="az_auto_affidamento" size="sm" v-model="form.az_auto_affidamento" required></b-form-input>
                                </b-col>
                            </b-row>
                        </div>

                        <h3>Motocicli</h3>
                        <label for="az_moto">Ci sono motocicli?</label>
                        <b-form-select name="az_moto" class="mb-3" v-model="form.az_moto" :options="l_si_no" required></b-form-select>

                        <div v-if="form.az_moto == 'sì'">
                            <label>In caso affermativo indicare:</label>
                            <b-row class="my-1">
                                <b-col sm="2">
                                    <label for="az_moto_nr">Numero moto:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_moto_nr" name="az_moto_nr" type="number" size="sm" v-model="form.az_moto_nr" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_moto_alimentazione">Tipologia alimentazione:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_moto_alimentazione" name="az_moto_alimentazione" size="sm" v-model="form.az_moto_alimentazione" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_moto_contratto">Tipologia contratto:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_moto_contratto" name="az_moto_contratto" size="sm" v-model="form.az_moto_contratto" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_moto_spostamento">Per quale tipo di spostamento (es. solo per lavoro; casa-lavoro):</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_moto_spostamento" name="az_moto_spostamento" size="sm" v-model="form.az_moto_spostamento" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_moto_affidamento">Tipologia di affidamento:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input name="az_moto_affidamento" id="az_moto_affidamento" size="sm" v-model="form.az_moto_affidamento" required></b-form-input>
                                </b-col>
                            </b-row>
                        </div>

                        <h3>Biciclette</h3>
                        <label for="az_bici">Ci sono biciclette?</label>
                        <b-form-select name="az_bici" class="mb-3" v-model="form.az_bici" :options="l_si_no" required></b-form-select>

                        <div v-if="form.az_bici == 'sì'">
                            <label>In caso affermativo indicare:</label>
                            <b-row class="my-1">
                                <b-col sm="2">
                                    <label for="az_bici_nr">Numero biciclette:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_bici_nr" name="az_bici_nr" type="number" size="sm" v-model="form.az_bici_nr" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_bici_alimentazione">Tipologia alimentazione:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_bici_alimentazione" name="az_bici_alimentazione" size="sm" v-model="form.az_bici_alimentazione" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_bici_contratto">Tipologia contratto:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_bici_contratto" name="az_bici_contratto" size="sm" v-model="form.az_bici_contratto" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_bici_spostamento">Per quale tipo di spostamento (es. casa-scuola):</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_bici_spostamento" name="az_bici_spostamento" size="sm" v-model="form.az_bici_spostamento" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_bici_affidamento">Tipologia di affidamento:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_bici_affidamento" name="az_bici_affidamento" size="sm" v-model="form.az_bici_affidamento" required></b-form-input>
                                </b-col>
                            </b-row>
                        </div>

                        <h3>Monopattini</h3>
                        <label for="monopattini_aziendali">Ci sono monopattini?</label>
                        <b-form-select class="mb-3" v-model="form.az_monopattini" :options="l_si_no" required></b-form-select>

                        <div v-if="form.az_monopattini == 'sì'">
                            <label for="monopattini_aziendali">In caso affermativo indicare:</label>
                            <b-row class="my-1">
                                <b-col sm="2">
                                    <label for="az_monopattini_nr">Numero monopattini:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input id="az_monopattini_nr" name="az_monopattini_nr" type="number" size="sm" v-model="form.az_monopattini_nr" required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_monopattini_alimentazione">Tipologia alimentazione:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input
                                        id="az_monopattini_alimentazione"
                                        name="az_monopattini_alimentazione"
                                        size="sm"
                                        v-model="form.az_monopattini_alimentazione"
                                        required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_monopattini_contratto">Tipologia contratto:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input
                                        id="az_monopattini_contratto"
                                        name="az_monopattini_contratto"
                                        size="sm"
                                        v-model="form.az_monopattini_contratto"
                                        required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_monopattini_spostamento">Per quale tipo di spostamento (es. casa-scuola):</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input
                                        id="az_monopattini_spostamento"
                                        name="az_monopattini_spostamento"
                                        size="sm"
                                        v-model="form.az_monopattini_spostamento"
                                        required></b-form-input>
                                </b-col>

                                <b-col sm="2">
                                    <label for="az_monopattini_affidamento">Tipologia di affidamento:</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-input
                                        id="az_monopattini_affidamento"
                                        name="az_monopattini_affidamento"
                                        size="sm"
                                        v-model="form.az_monopattini_affidamento"
                                        required></b-form-input>
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                </b-form-group>
            </div>
            <!-- /step-15: flotta aziendale-->

            <!-- step-16: sharing-->
            <div id="step-16" value="step-16">
                <h2>Servizi di Condivisione (Sharing Mobility)</h2>

                <b-form-group>
                    <label for="sharing">Esistono forme di abbonamenti della scuola con i servizi di condivisione?</label>
                    <b-form-select class="mb-3" name="sharing" v-model="form.sharing" :options="l_si_no" required></b-form-select>

                    <div v-if="form.sharing == 'sì'">
                        <label for="bike_sharing_abb">Numero abbonamenti della scuola al bike sharing</label>
                        <b-form-input id="bike_sharing_abb" type="number" v-model="form.bike_sharing_abb" name="bike_sharing_abb" required class="mb-3"></b-form-input>

                        <label for="moto_sharing_abb">Numero abbonamenti della scuola al moto sharing</label>
                        <b-form-input id="moto_sharing_abb" type="number" v-model="form.moto_sharing_abb" name="moto_sharing_abb" required class="mb-3"></b-form-input>

                        <label for="car_sharing_abb">Numero abbonamenti della scuola al car sharing</label>
                        <b-form-input id="car_sharing_abb" type="number" v-model="form.car_sharing_abb" name="car_sharing_abb" required class="mb-3"></b-form-input>

                        <label for="monopattini_sharing_abb">Numero abbonamenti della scuola al monopattini sharing</label>
                        <b-form-input
                            id="monopattini_sharing_abb"
                            type="number"
                            v-model="form.monopattini_sharing_abb"
                            name="monopattini_sharing_abb"
                            required
                            class="mb-3"></b-form-input>
                    </div>
                </b-form-group>
            </div>
            <!-- /step-16: sharing-->
        </div>

        <!-- /MoMa Mezzi di Trasporto****************************************************************-->

        <!-- MoMa Iniziative********* **********************************************************************-->
        <!-- **************************************************************************************-->
        <div id="moma_iniziative">
            <h1><b>Iniziative di Mobility Management</b></h1>
            <!-- step-17: localizzazione-->
            <div id="step-17" value="step-17">
                <h2>Budget Annuale per la Mobilità</h2>
                <b-form-group>
                    <label for="budget_moma">Si dispone di un budget annuale per la gestione della mobilità?</label>
                    <b-form-select class="mb-3" name="budget_moma" v-model="form.budget_moma" :options="l_si_no" required></b-form-select>

                    <div v-if="form.budget_moma == 'sì'">
                        <label for="budget_moma_quantita">In caso affermativo, indicare la quantità (€/anno)</label>
                        <b-form-input id="budget_moma_quantita" name="budget_moma_quantita" type="number" class="mb-3" v-model="form.budget_moma_quantita"></b-form-input>
                    </div>
                </b-form-group>
            </div>

            <!-- step-18: Contributi-->
            <div id="step-18" value="step-18">
                <h2>Contributi</h2>
                <b-form-group>
                    <label for="contributo_tpl">Vengono erogati contributi per l'acquisto dell'abbonamento al TPL?</label>
                    <b-form-select class="mb-3" name="contributo_tpl" v-model="form.contributo_tpl" :options="l_si_no" required></b-form-select>

                    <div v-if="form.contributo_tpl == 'sì'">
                        <label for="contributo_tpl_perc">In caso affermativo, indicare la % dell'abbonamento finanziato dal contributo.</label>
                        <b-input-group class="mt-3">
                            <template v-slot:append>
                                <b-input-group-text><strong>%</strong></b-input-group-text>
                            </template>
                            <b-form-input id="contributo_tpl_perc" name="contributo_tpl_perc" type="number" v-model="form.contributo_tpl_perc" placeholder="es.20%"></b-form-input>
                        </b-input-group>
                    </div>

                    <label for="contributo_auto_green">Sono erogati contributi per l'acquisto di veicoli green (…)?</label>
                    <b-form-select class="mb-3" name="contributo_auto_green" v-model="form.contributo_auto_green" :options="l_si_no" required></b-form-select>

                    <label for="contributo_sharing">Vengono erogati contributi per l'acquisto dell'abbonamento alla mobilità condivisa (sharing mobility)?</label>
                    <b-form-select class="mb-3" name="contributo_sharing" v-model="form.contributo_sharing" :options="l_si_no" required></b-form-select>

                    <label for="convenzioni_sharing">Sono state stipulate convezioni con gestori della mobilità condivisa?</label>
                    <b-form-select class="mb-3" name="convenzioni_sharing" v-model="form.convenzioni_sharing" :options="l_si_no" required></b-form-select>

                    <div v-if="form.convenzioni_sharing == 'sì'">
                        <label>In caso affermativo, indicare</label>
                        <b-row v-for="convenzione in form.convenzioni" :key="convenzione.id" class="my-1">
                            <input type="hidden" :value="convenzione.id" />
                            <b-col sm="2">
                                <label for="convenzioni_sharing_nome">Nome del servizio (es. Tobike):</label>
                            </b-col>
                            <b-col sm="2">
                                <b-form-input name="convenzioni_sharing_nome" size="sm" v-model="convenzione.nome" required></b-form-input>
                            </b-col>

                            <b-col sm="2">
                                <label for="convenzioni_sharing_nr_persone">Per quante persone:</label>
                            </b-col>
                            <b-col sm="2">
                                <b-form-input name="convenzioni_sharing_nr_persone" type="number" size="sm" v-model="convenzione.nr_persone" required></b-form-input>
                            </b-col>
                        </b-row>

                        <b-button variant="primary" @click="aggiungi_convenzione" class="mr-2 mb-4">Aggiungi servizio</b-button>
                        <!--add ogni click si aggiunge un'altra riga, attenzione: cosa succede con il salvataggio dei dati?-->
                    </div>
                    <br />

                    <label for="altri_incentivi">Segnala altre tipologie di incentivi</label>
                    <b-form-input id="altri_incentivi" name="altri_incentivi" type="text" class="mb-3" v-model="form.altri_incentivi"></b-form-input>
                </b-form-group>
            </div>
            <!-- /step-18: Contributi-->

            <!-- step-19: comunicazione-->
            <div id="step-19" value="step-19">
                <h2>Comunicazione</h2>
                <b-form-group>
                    <label for="comunicazione_moma">Sono attive forme di comunicazione volte a incentivare comportamenti di mobilità sostenibile?</label>
                    <b-form-select class="mb-3" name="comunicazione_moma" v-model="form.comunicazione_moma" :options="l_si_no" required></b-form-select>

                    <div v-if="form.comunicazione_moma == 'sì'">
                        <label for="comunicazione_strumenti">In caso affermativo, selezionare gli strumenti utilizzati</label>
                        <b-form-checkbox-group
                            id="comunicazione_strumenti"
                            v-model="form.comunicazione_strumenti"
                            :options="l_comunicazione_strumenti"
                            name="comunicazione_strumenti"
                            class="mb-3"></b-form-checkbox-group>
                        <div v-if="form.comunicazione_strumenti.includes('altro')">
                            <label for="comunicazione_strumenti_altro">Altro, specificare:</label>
                            <b-form-input
                                id="comunicazione_strumenti_altro"
                                name="comunicazione_strumenti_altro"
                                type="text"
                                class="mb-3"
                                v-model="form.comunicazione_strumenti_altro"></b-form-input>
                        </div>

                        <label for="comunicazione_frequenza">Frequenza delle comunicazioni?</label>
                        <b-form-select
                            class="mb-3"
                            name="comunicazione_frequenza"
                            v-model="form.comunicazione_frequenza"
                            :options="l_comunicazione_frequenza"
                            required></b-form-select>
                    </div>

                    <label for="bacheche">Sono disponibili bacheche interne per affissioni?</label>
                    <b-form-select class="mb-3" name="bacheche" v-model="form.bacheche" :options="l_si_no" required></b-form-select>

                    <div v-if="form.comunicazione_moma == 'sì'">
                        <label for="comunicazione_altro">Segnala altre tipologie di comunicazione</label>
                        <b-form-input id="comunicazione_altro" name="comunicazione_altro" type="text" class="mb-3" v-model="form.comunicazione_altro"></b-form-input>
                    </div>
                </b-form-group>
                <!-- /step-19: comunicazione-->
            </div>
        </div>
        <!-- / MoMa Iniziative********* **********************************************************************-->
    </div>
</template>

<script>
import {
	l_rapporto_lavorativo,
	l_inquadramento_lavorativo_sc,
	l_mm_orario_lavoro,
	l_mm_sesso,
	l_mm_eta,
	l_sede_filiale,
	l_distribuzione_lavoro,
	l_si_no,
	l_si_no_altro,
	l_lavoro_flessibile,
	l_tipo_accordo,
	l_localizzazione,
	l_bike_sharing,
	l_car_sharing,
	l_tragitto,
	l_equipaggi,
	l_comunicazione_strumenti,
	l_comunicazione_frequenza,
} from "@/data/company-survey.config";

export default {
	name: "QuestionarioSedeScuola",
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
			l_distribuzione_lavoro: l_distribuzione_lavoro,
			l_si_no: l_si_no,
			l_si_no_altro: l_si_no_altro,
			l_lavoro_flessibile: l_lavoro_flessibile,
			l_tipo_accordo: l_tipo_accordo,
			l_localizzazione: l_localizzazione,
			l_bike_sharing: l_bike_sharing,
			l_car_sharing: l_car_sharing,
			l_tragitto: l_tragitto,
			l_equipaggi: l_equipaggi,
			l_comunicazione_strumenti: l_comunicazione_strumenti,
			l_comunicazione_frequenza: l_comunicazione_frequenza,
		};
	},
	methods: {
		aggiungi_linea_fermata() {
			this.form.linee_fermate.push({
				id: null,
				linea_nome: null,
				linea_tipo: null,
				fermata_nome: null,
				fermata_distanza: null,
			});
		},

		aggiungi_bs_stazione() {
			this.form.bs_stazioni.push({
				id: null,
				nome: null,
				distanza: null,
			});
		},

		aggiungi_cs_stazione() {
			this.form.cs_stazioni.push({
				id: null,
				nome: null,
				distanza: null,
			});
		},

		aggiungi_convenzione() {
			this.form.convenzioni.push({
				id: null,
				nome: null,
				nr_persone: null,
			});
		},

		aggiungi_carpooling_contr() {
			this.form.carpooling_contributi.push({
				id: null,
				forma: null,
				importo: null,
			});
		},
	},
};
</script>

<style></style>
