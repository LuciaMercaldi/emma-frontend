<template>
    <div>
        <b-row>
          <b-col>
            <h1>
              <b-badge v-if="isTemplate">Template</b-badge> {{ survey.name }}
              <span v-if="!isTemplate && survey.id" class="float-right" style="font-size: 18px">
                <router-link :to="`/questionari/fill/${survey.id}/test`" target="_blank"><i class="fa fa-list-alt"
                    aria-hidden="true"></i>
                  Mostra Anteprima Questionario
                </router-link>
              </span>
            </h1>
          </b-col>
        </b-row>

        <b-row>
            <b-col lg="12" v-if="isTemplate">
                <b-card>
                    <b-form-group label="Titolo del Modello">
                        <b-form-input v-model="survey.name"></b-form-input>
                    </b-form-group>
                    <b-form-group label="Descrizione del Modello">
                        <b-form-input v-model="survey.description"></b-form-input>
                    </b-form-group>
                    
                    <b-form-group label="Traduzione" v-if="canShowTranslation">
                            <b-form-checkbox v-model="survey.show_translation" name="show_translation" value="en"
                                unchecked-value="">
                                Attiva la versione inglese del questionario (🇬🇧)
                            </b-form-checkbox>
                    </b-form-group>

                    <b-form-group :label="welcomeMessage" class="mt-3" > 
                        <div>
                            <b-tabs content-class="mt-3">
                                <b-tab :title="welcomeMessageit" active> 
                                    <div v-if="!loggedUserIsAdmin" class="text-info">
                                        <b-icon-info-circle-fill></b-icon-info-circle-fill> Per
                                            questioni di privacy policy il tuo account non può modificare
                                            il messaggio di benvenuto
                                    </div>
                                    <ckeditor :editor="editor" v-model="survey.welcome" :config="editorConfig"
                                        :disabled="!loggedUserIsAdmin">
                                    </ckeditor>
                                    <span class="text-muted small">Questo messaggio viene visualizzato nel browser all'apertura
                                        del questionario.</span>
                                </b-tab>
                                <b-tab title="Versione inglese 🇬🇧" v-if="canShowTranslation && survey.show_translation">
                                    <div v-if="!loggedUserIsAdmin" class="text-info">
                                        <b-icon-info-circle-fill></b-icon-info-circle-fill> Per
                                        questioni di privacy policy il tuo account non può modificare
                                        il messaggio di benvenuto
                                    </div>
                                    <ckeditor :editor="editor" v-model="survey._translations.en.welcome" :config="editorConfig"
                                        :disabled="!loggedUserIsAdmin">
                                    </ckeditor>
                                    <span class="text-muted small">Questo messaggio viene visualizzato nel browser all'apertura
                                        del questionario.</span>
                                </b-tab>
                            </b-tabs>
                        </div>
                    </b-form-group>
                    <b-button @click="validateAndSave()" type="button" variant="primary"
                    class="float-right">Salva</b-button>
                </b-card>
            </b-col>

            <b-col lg="12">
                <b-card-group deck v-if="!isTemplate">
                    <b-card header="Informazioni sul questionario" class="pb-2">
                        <form action="">
                            <b-row class="mt-2">
                                <b-col class="flex-grow-1">
                                    <div slot="label" class="mb-1">Titolo del Questionario</div>
                                    <b-form-input v-model="survey.name"></b-form-input>
                                </b-col>
                                <b-col class="col-2 pt-0">
                                    <b-form-group 
                                        class="pl-0"
                                        v-b-tooltip.hover 
                                        title="Associa un anno al questionario" 
                                        variant="primary"
                                        >
                                        <label>Anno</label>
                                        <b-form-select size="md" v-model="survey.year" name="year" :options="yearOptions"/>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-form-group>
                                <b-form-row>
                                    <b-col v-if="!hasLogofile">
                                        <b-img v-if="survey.logo"
                                            :src="`${this.serverPath}${this.amb}${this.survey.logo}?${this.imgKey}`"
                                            alt="Logo Questionario" width="150"></b-img>
                                    </b-col>
                                    <b-col v-if="hasLogofile">
                                        <b-img :src="logofileSrc" width="150"></b-img>
                                    </b-col>
                                    <b-col>
                                        <!--<div slot="label" class="mb-1">
                                            Logo
                                        </div>-->
                                        <b-form-file v-model="logofile" :state="Boolean(logofile)"
                                            placeholder="Carica il tuo logo..." drop-placeholder="Drop file here..."
                                            accept=".jpg, .png, .gif"></b-form-file>
                                        <div class="mt-1">
                                            File selezionato:
                                            {{ logofile ? logofile.name : "" }}
                                        </div>
                                    </b-col>
                                </b-form-row>
                            </b-form-group>

                            <b-form-group>
                                <b-form-row>
                                    <b-col class="col-sm-12 col-md-12 col-lg-4 pl-1">
                                        <div slot="label" class="mb-1">Data di Riferimento</div>
                                        <b-form-datepicker id="survey-datepicker" v-model="survey.date" size="sm"
                                            right></b-form-datepicker>
                                    </b-col>
                                    <b-col class="col-sm-12 col-md-12 col-lg-8">
                                        <div slot="label" class="mb-1">Tag Versione</div>
                                        <b-form-input v-model="survey.version_tag"></b-form-input>
                                        <span class="text-muted small">Una parola chiave da associare ad un
                                        evento specifico (es:&nbsp;anno,&nbsp;invio).</span>
                                    </b-col>
                                </b-form-row>
                            </b-form-group>

                            <b-row>
                                <b-col>
                                    <div slot="label" class="mb-1"> Descrizione</div>
                                    <b-form-input v-model="survey.description"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-form-group>
                                
                            </b-form-group>
                            
                            <b-form-group>
                                
                            </b-form-group>
                            <b-form-group v-if="canShowTranslation">
                                <b-form-checkbox v-model="survey.show_translation" name="show_translation" value="en"
                                    unchecked-value="">
                                    Attiva la versione inglese del questionario (🇬🇧)
                                </b-form-checkbox>
                            </b-form-group>

                            <b-form-group :label="welcomeMessage" class="mt-3" > 
                                <div>
                                    <b-tabs content-class="mt-3">
                                        <b-tab :title="welcomeMessageit" active> 
                                            <div v-if="!loggedUserIsAdmin" class="text-info">
                                                <b-icon-info-circle-fill></b-icon-info-circle-fill> Per
                                                    questioni di privacy policy il tuo account non può modificare
                                                    il messaggio di benvenuto
                                            </div>
                                            <ckeditor :editor="editor" v-model="survey.welcome" :config="editorConfig"
                                                :disabled="!loggedUserIsAdmin">
                                            </ckeditor>
                                            <span class="text-muted small">Questo messaggio viene visualizzato nel browser all'apertura
                                                del questionario.</span>
                                        </b-tab>
                                        <b-tab title="Versione inglese 🇬🇧" v-if="canShowTranslation && survey.show_translation">
                                            <div v-if="!loggedUserIsAdmin" class="text-info">
                                                <b-icon-info-circle-fill></b-icon-info-circle-fill> Per
                                                questioni di privacy policy il tuo account non può modificare
                                                il messaggio di benvenuto
                                            </div>
                                            <ckeditor :editor="editor" v-model="survey._translations.en.welcome" :config="editorConfig"
                                                :disabled="!loggedUserIsAdmin">
                                            </ckeditor>
                                            <span class="text-muted small">Questo messaggio viene visualizzato nel browser all'apertura
                                                del questionario.</span>
                                        </b-tab>
                                    </b-tabs>
                                </div>
                                
                            </b-form-group> 

                            <input type="hidden" name="id" :value="survey.id" />
                            <b-button @click="validateAndSave()" type="button" variant="primary"
                                class="float-right">Salva</b-button>
                        </form>
                    </b-card>

                    <b-card header="Modalità di invio" class="pb-2">
                        <p class="mt-2">Da questo pannello puoi gestire il questionario della tua azienda.</p>
                        <hr />

                        <b-form action="">
                            <b-form-row>
                                <b-col>
                                    <label for="survey-opening">Data Apertura Questionario</label>
                                    <b-form-datepicker id="survey-opening" name="survey-opening"
                                        v-model="survey.opening_date" size="sm" right></b-form-datepicker>
                                </b-col>
                                 <b-col>
                                    <label for="survey-closing">Data Chiusura Questionario</label>
                                    <b-form-datepicker id="survey-closing" name="survey-closing"
                                        v-model="survey.closing_date" size="sm" right></b-form-datepicker>
                                </b-col>
                            </b-form-row>

                            <div class="text-muted mt-1">
                                <b-icon icon="lightbulb-fill"></b-icon> Consiglio: due settimane sono solitamente un buon tempo
                            </div>

                            <h4 class="mb-0 mt-2">Tipo di invio</h4>

                            <b-form-group>
                                <b-form-radio v-model="survey.sending_mode" name="sending_mode" value="n"
                                    v-if="!canShowAnonymousSurveyOnly">
                                    Invio tramite piattaforma (nominale)
                                </b-form-radio>

                                <b-form-radio v-model="survey.sending_mode" name="sending_mode" value="z"
                                    v-if="!canShowAnonymousSurveyOnly">
                                    Invio tramite piattaforma (anonimizzato)
                                </b-form-radio>

                                <b-form-radio v-model="survey.sending_mode" name="sending_mode" value="a"
                                v-if="!canShowAnonymousSurveyOnly">
                                    Invio tramite mail e link anonimo
                                    <div v-if="canShowAnonymousSurveyOnly" class="text-info">
                                        <b-icon-info-circle-fill></b-icon-info-circle-fill> Per
                                        questioni di privacy policy il tuo account può solo inviare
                                        i questionari in modalità anonima.
                                    </div>
                                </b-form-radio>
                            </b-form-group>

                            <div v-if="isAnonymous || canShowAnonymousSurveyOnly">
                                <label for="basic-url">Link Anonimo</label>
                                <div class="text-info">
                                    <b-icon-info-circle-fill></b-icon-info-circle-fill> Puoi
                                    copiare questo link in una e-mail che può essere inviata dalla
                                    casella aziendale. Le risposte al questionario saranno anonime
                                    e non potrai sapere chi ha risposto o meno.
                                </div>
                                <div class="input-group mb-3">
                                    <input type="text" :value="surveyAnonymousLink" id="anon-link" class="form-control"/>
                                    <div class="input-group-append">
                                        <button class="btn btn-info text-white"
                                            @click.stop.prevent="copySurveyAnonymousLink">
                                            Copia
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <b-form-group v-if="!isAnonymous && !canShowAnonymousSurveyOnly">
                                <h4>Partecipanti</h4>
                                <b-form-row>
                                    <b-col>
                                        <p class="text-danger" v-if="survey.participants_num == 0">
                                            <i class="fa fa-warning" aria-hidden="true"></i>
                                            Nessun partecipante disponibile per il questionario.
                                            Importali usando il pulsante "Partecipanti"
                                        </p>
                                        <p v-else>
                                            <i class="fa fa-user" aria-hidden="true"></i>
                                            Visualizza l'<b-link :to="`/users?survey_id=${survey_id}&search=`">elenco dei
                                                partecipanti</b-link>
                                        </p>
                                    </b-col>
                                    <b-col>
                                        <b-dropdown>
                                            <template #button-content>
                                                Gestione Partecipanti
                                                <b-spinner v-if="waitImportCompanyUsers" small></b-spinner>
                                                <span class="sr-only">Loading...</span>
                                            </template>
                                            <b-dropdown-item variant="primary" size="sm"
                                                @click="openImportParticipantsModal()"
                                                title="(Re-)Importare gli impiegati per l'azienda con email, nome e cognome<">
                                                <i class="fa fa-file-excel-o" aria-hidden="true"></i>
                                                Importa partecipanti da Excel
                                            </b-dropdown-item>

                                            <b-dropdown-item @click="$bvModal.show('import-company-modal')">
                                                <i class="fa fa-users" aria-hidden="true"></i>
                                                Importa tutti gli utenti dell'azienda
                                            </b-dropdown-item>

                                            <b-dropdown-item @click="confirmDeleteParticipants(survey_id)">
                                                <i class="fa fa-trash" aria-hidden="true"></i>
                                                Elimina tutti i partecipanti
                                            </b-dropdown-item>

                                            <b-dropdown-item v-if="0">
                                                <!-- Todo: da implementare -->
                                                <i class="fa fa-trash" aria-hidden="true"></i>
                                                Elimina tutti i partecipanti che non hanno ancora
                                                complilato
                                            </b-dropdown-item>
                                        </b-dropdown>
                                    </b-col>
                                </b-form-row>

                                <b-form-row class="mt-3">
                                    <b-col>
                                        <label>e-mail mittente</label>
                                        <p class="text-muted small">
                                            <i class="fa fa-info" aria-hidden="true"></i> Il dominio
                                            della mail che utilizzi deve essere configurato sul
                                            server, altrimenti viene bloccato dai filtri antispam.
                                        </p>
                                    </b-col>
                                    <b-col>
                                        <b-input-group>
                                            <b-form-input v-model="sender_email" size="sm" trim type="email"></b-form-input>
                                            <b-button variant="outline-primary"
                                                @click="updateSurvey(false)">Aggiorna</b-button>
                                        </b-input-group>
                                    </b-col>
                                </b-form-row>

                                <b-form-row class="mt-3">
                                    <b-col>
                                        <p class="text-muted">
                                            Invia automaticamente le mail ai partecipanti
                                        </p>
                                    </b-col>
                                    <b-col>
                                        <b-button variant="success" size="sm" @click="openSendTestInvitationModal()"
                                            class="mr-2">
                                            Invia questionario test
                                            <i class="fa fa-envelope" aria-hidden="true"></i>
                                        </b-button>
                                        <b-dropdown size="sm" text="e-mail di Invito" variant="danger" class="mr-2">
                                            <b-dropdown-item @click="showInvitationTplModal = true">
                                                <i class="fa fa-pencil" aria-hidden="true"></i> Modifica
                                                testo mail di invito
                                            </b-dropdown-item>
                                            <b-dropdown-item @click="openSendNotificationsModal('invitation')">
                                                <i class="fa fa-envelope" aria-hidden="true"></i> Invia
                                                Inviti Ora
                                            </b-dropdown-item>
                                        </b-dropdown>
                                    </b-col>
                                </b-form-row>

                                <h4>Promemoria</h4>
                                <b-form-row>
                                    <b-col>
                                        <label for="reminder-sb">1° Promemoria Compilazione dopo giorni</label>
                                    </b-col>
                                    <b-col>
                                        <b-form-spinbutton id="reminder-sb" v-model="reminder" min="1"
                                            max="10"></b-form-spinbutton>
                                    </b-col>
                                </b-form-row>
                                <b-form-row>
                                    <b-col>
                                        <label for="reminder2-sb">2° Promemoria Compilazione dopo giorni</label>
                                    </b-col>
                                    <b-col>
                                        <b-form-spinbutton id="reminder2-sb" v-model="reminder2" min="1"
                                            max="60"></b-form-spinbutton>
                                    </b-col>
                                </b-form-row>
                                <b-form-row class="mt-3">
                                    <b-col>
                                        <p class="text-muted">
                                            <i class="fa fa-warning" aria-hidden="true"></i> La
                                            piattaforma <b>non invia</b> promemoria automaticamente, i
                                            numeri sopra sono solo di aiuto al mobility manager.
                                        </p>
                                    </b-col>
                                    <b-col>
                                        <b-dropdown size="sm" text="e-mail di Promemoria" variant="danger" class="mr-2">
                                            <b-dropdown-item @click="showReminderTplModal = true">
                                                <i class="fa fa-pencil" aria-hidden="true"></i> Modifica
                                                testo e-mail di Promemoria
                                            </b-dropdown-item>
                                            <b-dropdown-item @click="openSendNotificationsModal('reminder')">
                                                <i class="fa fa-envelope" aria-hidden="true"></i> Invia
                                                promemoria Ora
                                            </b-dropdown-item>
                                        </b-dropdown>
                                    </b-col>
                                </b-form-row>
                            </b-form-group>
                            <b-form-group label="Piedipagina per mail e questionario (lascia vuoto per usare il default)"
                                v-if="loggedUserIsAdmin && survey.survey_delivery_config">
                                <ckeditor :editor="editor" v-model="survey.survey_delivery_config.mail_footer"
                                    :config="editorConfig" :disabled="!loggedUserIsAdmin"></ckeditor>
                            </b-form-group>

                            <input type="hidden" name="id" :value="survey.id" />
                            <b-form-row>
                                <b-col>
                                    <b-button class="float-right" @click.prevent="validateAndSave()"
                                        variant="primary">Salva
                                    </b-button>
                                </b-col>
                            </b-form-row>
                        </b-form>
                    </b-card>
                </b-card-group>
            </b-col>
        </b-row>
        <b-modal id="bv-modal-confirm-delete-participants" variant="danger">
            <template v-slot:modal-title> Conferma cancellazione </template>
            <div>
                <p>Vuoi davvero cancellare tutti partecipanti?</p>
                <p>
                    Proseguendo verrà rimossi tutti partecipanti del questionario.<br />
                    Operazione irreversibile
                </p>
            </div>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button @click="$bvModal.hide('bv-modal-confirm-delete-participants')" class="mr-1">Annulla</b-button>
                    <b-button @click="delSurveyParticipants()" variant="danger"><span class="ti-trash"></span>
                        Elimina</b-button>
                </div>
            </template>
        </b-modal>

        <b-modal size="lg" v-model="showInvitationTplModal" title="Messaggio di Invito">
            <b-form-group label="Oggetto">
                <b-form-input v-model="invitation_subject"></b-form-input>
            </b-form-group>
            <b-form-group label="Messaggio">
                <div class="text-muted" v-pre>Tag Utilizzabili {{{nome}}}, {{{titolo}}}, {{{link}}}</div>
                <ckeditor id="invitation-template-textarea" :editor="editor" v-model="invitation_tpl" :config="editorConfig"
                    rows="3" max-rows="6">
                </ckeditor>

            </b-form-group>

            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button variant="primary" size="sm" class="float-right" @click="
                        updateSurvey(false);
                    showInvitationTplModal = false;
                    ">
                        Ok
                    </b-button>
                </div>
            </template>
        </b-modal>

        <b-modal size="lg" v-model="showReminderTplModal" title="Messaggio di Promemoria">
            <b-form-group label="Oggetto">
                <b-form-input v-model="reminder_subject"></b-form-input>
            </b-form-group>
            <b-form-group label="Messaggio">
                <div class="text-muted" v-pre>Tag Utilizzabili {{{nome}}}, {{{titolo}}}, {{{link}}}</div>
                <ckeditor id="reminder-template-textarea" :editor="editor" v-model="reminder_tpl" :config="editorConfig"
                    rows="3" max-rows="6">
                </ckeditor>
            </b-form-group>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button variant="primary" size="sm" class="float-right" @click="
                        updateSurvey(false);
                    showReminderTplModal = false;
                    ">
                        Ok
                    </b-button>
                </div>
            </template>
        </b-modal>

        <b-modal v-model="showSendTestInvitationModal" title="Invia questionario di test">
            <p>
                <i>Usa questa funzionalità per inviare una mail di test (a te stesso o
                    al tuo gruppo), prima di fare l'invio massivo del questionario.</i>
            </p>
            <b-form action="">
                <b-form-group label="Nome">
                    <b-form-input v-model="testRecipient.name" placeholder="Nome e Cognome"></b-form-input>
                </b-form-group>
                <b-form-group label="Email">
                    <b-form-input v-model="testRecipient.email" placeholder="miamail@example.com"></b-form-input>
                </b-form-group>
            </b-form>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button :disabled="!(testRecipient.name && testRecipient.email)" variant="primary" size="sm"
                        class="float-right" @click="sendTestInvitation()">
                        Invia
                    </b-button>
                    <b-button variant="danger" size="sm" class="float-right" @click="showSendTestInvitationModal = false">
                        Annulla
                    </b-button>
                </div>
            </template>
        </b-modal>

        <b-modal v-model="showSendNotificationsModal" title="Invia notifiche">
            <div v-if="loadingNotificationsModalContent" class="text-center">
                    <b-spinner label="Spinning"></b-spinner>
            </div>
            <div v-if="!loadingNotificationsModalContent">
                <p v-if="!canSendNotifications">
                    <span v-if="notificationsTarget == 'invitation'">Non ci sono inviti da inviare</span>
                    <span v-if="notificationsTarget == 'reminder'">Non ci sono promemoria da inviare</span>
                </p>
                <div v-if="canSendNotifications">
                    <div v-if="notificationsTarget == 'invitation'" class="text-center">
                        Si stanno per inviare
                        <b>{{ stats.participants.sendable_invitation_num }}</b>
                        inviti
                    </div>
                    <div v-if="notificationsTarget == 'reminder'" class="text-center">
                        Si stanno per inviare <b>{{ stats.participants.sendable_reminder_num }}</b> promemoria
                    </div>
                </div>
            </div>
            <template v-slot:modal-footer>
                <div class="w-100" v-if="canSendNotifications">
                    <b-button variant="primary" size="sm" class="float-right" @click="sendNotifications()">
                        Invia
                    </b-button>
                    <b-button variant="danger" size="sm" class="float-right" @click="showSendNotificationsModal = false">
                        Annulla
                    </b-button>
                </div>
                <div class="w-100" v-if="!canSendNotifications">
                    <b-button variant="danger" size="sm" class="float-right" @click="showSendNotificationsModal = false">
                        Chiudi
                    </b-button>
                </div>
            </template>
        </b-modal>

        <b-modal id="import-participants-modal" :no-close-on-backdrop="true" :no-close-on-esc="true"
            :hide-header-close="true" size="xl" scrollable>
            <template #modal-title> Importa partecipanti da Excel </template>
            <div class="">
                <p class="text-muted">
                    I contatti verranno aggiunti ai contatti esistenti this.datesolo se hanno una
                    mail diversa da quelle già esistenti.
                </p>
                <b-form>
                    <input type="hidden" v-model="actions.importParticipants.surveyId" />
                    <b-form-file :accept="actions.importParticipants.supportedFileTypes"
                        v-model="actions.importParticipants.file"></b-form-file>
                </b-form>
                <b-progress :max="actions.importParticipants.progress.max" class="mb-3">
                    <b-progress-bar variant="success" :value="actions.importParticipants.progress.success" animated
                        show-progress></b-progress-bar>
                    <b-progress-bar variant="danger" :value="actions.importParticipants.progress.error" animated
                        show-progress></b-progress-bar>
                </b-progress>
                <div>
                    <p style="color: green">
                        {{ actions.importParticipants.log.success }}
                    </p>
                    <p style="color: red" v-html="actions.importParticipants.log.error"></p>
                </div>
            </div>
            <b-alert show variant="warning" style="font-size: 90%">
                <b-row>
                    <b-col>
                        <h3>
                            <b-icon icon="exclamation-circle-fill"></b-icon> Struttura del
                            file da importare
                        </h3>
                        <ul>
                            <li>prima riga: header colonne (skipped)</li>
                            <li>
                                colonne importate
                                <ul>
                                    <li>A (email)</li>
                                    <li>B (nome)</li>
                                    <li>C (cognome)</li>
                                </ul>
                            </li>
                        </ul>
                        <!--<b-button variant="light" size="sm">Scarica file di esempio</b-button>-->
                    </b-col>
                </b-row>
            </b-alert>
            <template #modal-footer>
                <b-button @click="stopImportParticipants()">
                    <span v-if="actions.importParticipants.importing">Stop</span>
                    <span v-else>Chiudi</span>
                </b-button>
                <b-button :disabled="!actions.importParticipants.file ||
                    actions.importParticipants.importing
                    " variant="primary" @click="importParticipants()">
                    <b-spinner v-if="actions.importParticipants.importing" variant="primary" label="Spinning"></b-spinner>
                    Importa
                </b-button>
            </template>
        </b-modal>
        <b-modal id="import-company-modal" >
            <template v-slot:modal-title> Conferma importazione tutti dipendenti </template>
            <div>
                <p>Vuoi davvero importare tutti partecipanti?</p>
                <p>
                    Sei sicuro di voler portare tutti gli utenti di questa azienda tra i partecipanti di questo questionario?
                </p>
                <p> Scegli il anno di importazione degli utenti.</p>
                <b-form-select v-model="year" :options="yearOptions"></b-form-select>
            </div>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button @click="stopImportCompanyUsers()" class="mr-1">Annulla</b-button>
                    <b-button @click="importCompanyUsers()" variant="primary" >
                        <b-spinner v-if="waitImportCompanyUsers" variant="primary" label="Spinning"></b-spinner>
                        Importa</b-button>
                </div>
            </template>
        </b-modal>

    </div>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue2";
import ClassicEditor from "/ckeditor5/build/ckeditor";
import Util from "@/mixing/util";
import UserService from "@/services/user.service";
import XlsService from "@/services/xls.service";
import vSelect from "vue-select";

// todo: come sarebbe bello usare un enum di typescript ...
const SENDING_MODE = {
    n: "nominale",
    z: "anonimizzato",
    a: "anonimo",
};

const base64Encode = data =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

export default {
    name: "survey-edit-heading",
    props: {    
        survey: Object,
        isTemplate: Boolean,
        survey_id: Number, 
        reminder: Number,
        reminder2: Number,
        invitation_tpl: String,
        reminder_tpl: String, 
        invitation_subject: String,
        reminder_subject: String,
        sender_email: String,
        survey_sending_mode: String,
    },
    mixins: [Util],
    components: {
        ckeditor: CKEditor.component,
        vSelect,

    },
    data() {
        return {
            serverPath: process.env.VUE_APP_ROOT,
            logofile: null,
            logofileSrc: null,
            logofileDir: process.env.VUE_APP_LOGO,
            amb: process.env.VUE_APP_AMB,
            imgKey: Date.now(),
            editor: ClassicEditor,
            editorConfig: {
                language: "it",
                toolbar: {
                    items: [
                        "heading",
                        "fontsize", "fontcolor", "|",
                        "alignment", "|", "insertImage",
                        "bold", "italic", "strikethrough", "underline", "subscript", "superscript", "|",
                        "link", "|",
                        "outdent", "indent", "|",
                        "bulletedList", "numberedList", "todoList", "|", "horizontalLine",
                    ],
                },
            },
            surveyAnonymousLink: "",
            actions: {
                importParticipants: {
                    supportedFileTypes: ".xls, .xlsx",
                    surveyId: null,
                    file: null,
                    importing: false,
                    log: [],
                    progress: {
                        max: 0,
                        success: 0,
                        error: 0,
                    },
                },
            },
            
            interrompi: false,
            loadingNotificationsModalContent: false,
            notificationsTarget: null,
            showInvitationTplModal: false,
            showInvitationTplModal: false,
            showReminderTplModal: false,
            showReminderTplModal: false,
            showSendNotificationsModal: false,
            showSendTestInvitationModal: false,
            surveyAnonymousLink: "",
            waitImportCompanyUsers: false,
            testRecipient: {
                name: "",
                email: "",
            },
            stats:null,
            welcomeMessage:"",
            welcomeMessageit:"",
        };
    },
    computed: {
        isAnonymous() {
            return (
                this.survey.sending_mode == "a" || this.survey.sending_mode == null
            );
        },
        isNominal() {
            
            return this.survey.sending_mode == "n";
        },
        isAnonimized() {
            return this.survey.sending_mode == "z";
        },
        hasLogofile() {
            return !!this.logofile;
        },
        canSendNotifications() {
            return this.stats &&
                this.notificationsTarget &&
                ((this.notificationsTarget == "invitation" &&
                    this.stats.participants.sendable_invitation_num > 0) ||
                    (this.notificationsTarget == "reminder" &&
                        this.stats.participants.sendable_reminder_num > 0));
        }
    },
    methods: {
         copySurveyAnonymousLink: function () {
            let anonLinkToCopy = document.querySelector("#anon-link");
            anonLinkToCopy.setAttribute("type", "text");
            anonLinkToCopy.select();

            try {
                var successful = document.execCommand("copy");
                this.$bvToast.toast(
                    successful ? "Copiato negli appunti" : "Impossibile copiare",
                    {
                        variant: successful ? "success" : "danger",
                        title: successful ? "Copiato negli appunti" : "Impossibile copiare",
                        autoHideDelay: 2000,
                        appendToast: true,
                    }
                );
            } catch (err) {
                //console.log(err);
                this.$bvToast.toast("Impossibile copiare il link negli appunti", {
                    variant: "danger",
                    title: "Impossibile copiare",
                    autoHideDelay: 2000,
                    appendToast: true,
                });
            }
        },
        confirmDeleteParticipants(survey_id) {
            this.survey_id= survey_id;
            this.$bvModal.show("bv-modal-confirm-delete-participants");
        },
        async delSurveyParticipants() {        
            //console.log("this.survey_id", this.survey_id);
            try {
                var participants = await UserService.deleteAllSurveyParticipnats(this.survey_id);
            } catch (error) {
                this.showError(error);
            }
            //console.log(participants);
            this.$bvToast.toast(participants.data.participants + " partecipanti cancellati correttamente.", {
                // title: "No Uploads",
                variant: "success",
                autoHideDelay: 2000,
                appendToast: true,
            });
            this.survey_id= null;
            this.$bvModal.hide("bv-modal-confirm-delete-participants");
        },

        updateLogo: async function (silent) {

            try {
                let res = await UserService.updateLogo(
                    this.logofile,
                    this.survey.id
                );
                console.log(res);
                if (!res.data.success) {
                    this.$bvToast.toast(res.data.msg, {
                        title: "Errore",
                        autoHideDelay: 5000,
                        appendToast: true,
                        variant: "danger",
                    });
                    return;
                }
                // todo: il messaggio di risposta dal server per maggiore configurabilità
                if (!silent) {
                    this.$bvToast.toast("I dati sono stati salvati correttamente", {
                        title: "Salvataggio ok",
                        autoHideDelay: 2000,
                        appendToast: true,
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },
        updateSurvey: async function (silent) {
            if (this.logofile != undefined) {
                this.survey.logo = this.logofileDir + this.survey.id +
                    this.logofile.name.substring(this.logofile.name.length - 4);
                await this.updateLogo(true);
                this.logofile = null;
                this.imgKey = Date.now();

            }
            if (this.canShowAnonymousSurveyOnly) {
                this.survey.sending_mode = "a";
            }

            // prepara/aggiorna la configurazione di invio
            if (!this.survey.survey_delivery_config) {
                this.survey.survey_delivery_config = {};
            }
            this.survey.survey_delivery_config = {
                ...this.survey.survey_delivery_config,
                days_before_first_reminder: this.reminder,
                days_before_second_reminder: this.reminder2,
                invitation_template: this.invitation_tpl,
                reminder_template: this.reminder_tpl,
                invitation_subject: this.invitation_subject,
                reminder_subject: this.reminder_subject,
                sender_email: this.sender_email,
                is_active: this.sending_mode === SENDING_MODE.platform ? 1 : 0,
            };
            try {
                await UserService.updateSurvey(
                    {
                        ...this.survey,
                        questions: undefined,
                    },
                    this.survey.id
                );
                // todo: il messaggio di risposta dal server per maggiore configurabilità
                if (!silent) {
                    this.$bvToast.toast("I dati sono stati salvati correttamente", {
                        title: "Salvataggio ok",
                        autoHideDelay: 2000,
                        appendToast: true,
                    });
                }
            } catch (e) {
                //console.log(e);
            }

        },
            showQuestions() {
            this.show_questions = !this.show_questions;
        },
        openSendTestInvitationModal() {
            this.testRecipient = {
                email: localStorage.getItem("testReceipientEmail"),
                name: localStorage.getItem("testReceipientName"),
            };
            this.showSendTestInvitationModal = true;
        },
        async openSendNotificationsModal(target) {
            this.notificationsTarget = target;
            this.showSendNotificationsModal = true;
            this.loadingNotificationsModalContent = true;
            try {
                let response = await UserService.getStats(this.survey.id);
                this.stats = response.data.stats;
            } catch (e) {
                this.stats = null;
                //console.log(e);
            } finally {
                this.loadingNotificationsModalContent = false;
            }
        },
        async sendTestInvitation() {
            localStorage.setItem("testReceipientEmail", this.testRecipient.email);
            localStorage.setItem("testReceipientName", this.testRecipient.name);
            ////console.log(this.testRecipient);
            this.showSendTestInvitationModal = false;
            try {
                // salva sempre prima di procedere (potrei aver modificato template o altro senza cliccare su salva)
                await this.updateSurvey(true);
                await UserService.sendTestInvitation(
                    this.testRecipient,
                    this.survey.id
                );
                this.$bvToast.toast("Invito di test inviato correttamente", {
                    title: "Invio ok",
                    autoHideDelay: 2000,
                    appendToast: true,
                });
            } catch (e) {
                //console.log(e);
                this.showError(e);
            }
        },
        async sendNotifications() {
            this.showSendNotificationsModal = false;
            try {
                await UserService.sendNotifications(
                    this.survey.id,
                    this.notificationsTarget
                );
                this.$bvToast.toast("Il processo di invio è cominciato correttamente", {
                    title: "Invio ok",
                    autoHideDelay: 2000,
                    appendToast: true,
                });
            } catch (e) {
                //console.log(e);
                this.showError(e);
            }
        },
         async importCompanyUsers() {               
            // this.$bvModal.show("import-company-modal");         
            // this.$bvModal
            //     .msgBoxConfirm(
            //         "Sei sicuro di voler portare tutti gli utenti di questa azienda tra i partecipanti di questo questionario?"
            //     )
            //     .then(async (value) => 
                try{
                    
                        this.waitImportCompanyUsers = true; 
                        let participants_number = 0;
                        let import_users = 1000;
                        while(import_users > participants_number && this.waitImportCompanyUsers){
                            let res = await UserService.importCompanyUsers(this.survey.id,this.year);
                            console.log(res);
                            participants_number = res.data.survey.participants_num;
                            import_users = res.data.survey.import_users;
                            console.log("import_users", import_users);
                            console.log("participants_number", participants_number);
                            console.log("stop", import_users > participants_number)
                            // wait 4 seconds before next request
                            await new Promise(resolve => setTimeout(resolve, 4000));
                        }
                        // let res = await UserService.importCompanyUsers(this.survey.id,this.year);
                        alert("nuovi utenti dell'azienda importati con successo");
                        this.survey.participants_num = 1;
                        this.waitImportCompanyUsers = false;
                        this.$bvModal.hide("import-company-modal");  
                    
                
                } catch (e) {
                    this.showError(e);
                };
        },
        openImportParticipantsModal() {
            this.actions.importParticipants.file = null; // important, reset
            this.actions.importParticipants.surveyId = this.survey.id;
            this.actions.importParticipants.log.success = null;
            this.actions.importParticipants.log.error = null;
            this.actions.importParticipants.importing = false;
            this.actions.importParticipants.progress = {
                max: 0,
                success: 0,
                error: 0,
            };
            this.interrompi = false;
            this.$bvModal.show("import-participants-modal");
        },
        async importParticipants() {
            this.interrompi = false;
            this.actions.importParticipants.importing = true;
            try {
                const content = await XlsService.read(
                    this.actions.importParticipants.file
                );
                const sheets = Object.keys(content);
                let sheetContent = content[sheets[0]]; // per convenzione elaboro solo il primo sheet che trovo
                // delete empty rows from sheetContent
                // console.log("e.length",sheetContent.length);
                if (sheetContent.length == 0) {
                    this.$bvToast.toast("Il file è vuoto", {
                        title: "Errore",
                        autoHideDelay: 3000,
                        appendToast: true,
                        variant: "danger",
                    });
                    this.$bvModal.hide("import-participants-modal");
                    return;
                }else if(sheetContent.length == 1){
                    this.$bvToast.toast("Il file non contiene dati", {
                        title: "Errore",
                        autoHideDelay: 3000,
                        appendToast: true,
                        variant: "danger",
                    });
                    this.$bvModal.hide("import-participants-modal");
                    return;
                }
				sheetContent=sheetContent.filter(e => e.length);
                this.actions.importParticipants.progress.max = sheetContent.length - 1;

                for (let i = 1; i < sheetContent.length; i++) {
                    let res = await UserService.importParticipant(
                        sheetContent[i],
                        this.survey.id,
                    );
                    if (res.data.errorMsg == false) {
                        this.actions.importParticipants.log.success = `Importata la riga ${i}`;
                        this.actions.importParticipants.progress.success++;
                    } else {
                        this.actions.importParticipants.log.error +=
                            res.data.errorMsg + "<br>";
                        this.actions.importParticipants.progress.error++;
                    }
                    if (this.interrompi) {
                        this.interrompi = false;
                        return;
                    }
                }
                this.survey.participants_num =
                    this.actions.importParticipants.progress.success; // qualunque valore andrebbe bene, basta che non sia 0 per aggiornare la vista
            } catch (e) {
                //console.log(e);
                this.showError(e);
                this.$bvModal.hide("import-participants-modal");
            } finally {
                this.actions.importParticipants.importing = false;
            }
        },
        stopImportParticipants() {
            if (!this.actions.importParticipants.importing) {
                this.interrompi = false;
                this.$bvModal.hide("import-participants-modal");
            } else {
                this.interrompi = true;
            }
        },
        validateAndSave() {
            // if not template
            if(!this.isTemplate){
                if (!this.survey.opening_date) {
                    this.scrollToElement('survey-opening');
                    this.showAlert('Devi inserire una data di apertura per continuare');
                    return;
                }
                if (!this.survey.closing_date) {
                    this.scrollToElement('survey-closing');
                    this.showAlert('Devi inserire una data di chiusura per continuare');
                    return;
                }
            }
            this.updateSurvey(false);
        },
        scrollToElement(id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                element.focus();
        }
        },
        showAlert(message) {
            this.$bvToast.toast(message, {
                title: 'Errore',
                autoHideDelay: 2000,
                appendToast: true,
                variant: 'danger',
            });
        },
        stopImportCompanyUsers() {
            this.waitImportCompanyUsers = false;
            this.$bvModal.hide('import-company-modal')
        },
    },
    watch: {
        logofile(newValue, oldValue) {
            if (newValue !== oldValue) {
                if (newValue) {
                    base64Encode(newValue)
                        .then(value => {
                            this.logofileSrc = value;
                        })
                        .catch(() => {
                            this.logofileSrc = null;
                        });
                } else {
                    this.logofileSrc = null;
                }
            }
        },
    },
    mounted() {
        //Se la policy blocca solo anonymous, usiamo solo quello

        
        this.getYear();
        let tokens = window.location.href.split("/");
        tokens.pop();
        tokens.pop();
        this.surveyAnonymousLink = [...tokens, "fill", this.survey_id, "anon"].join(
            "/"
        );
        if (this.canShowTranslation){
                this.welcomeMessage="Messaggio di Benvenuto (Web)";
                this.welcomeMessageit="Versione italiana 🇮🇹";
            } else {
                this.welcomeMessage="";
                this.welcomeMessageit="Messaggio di Benvenuto (Web)";
            }

    },

}
</script>