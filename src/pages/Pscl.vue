<template>
    <div>

		<!--blocco con azienda e sede-->
		<b-form>
            <b-form-row>
                <b-col class="flex-grow-1" v-if="loggedUserIsMomaArea || loggedUserIsAdmin || loggedUserIsMomaAzienda">
                    <b-form-group>
                        <label>Azienda</label>
                        <b-form-select v-model="company_id" :options="companies" value-field="id" text-field="name" v-on:change="updateOffices"></b-form-select>
                    </b-form-group>
                </b-col>
                <b-col class="flex-grow-1 mb-1">
                    <b-form-group v-if="canGeneratePSCL">
                        <label>Sede</label>
                        <b-form-select v-model="office_id" :options="offices" value-field="id" text-field="name" v-on:change="retrivePscl" :disabled="ignore_office && year!='TUTTI'"></b-form-select>
                    </b-form-group>
					<b-spinner v-if="canGeneratePSCL===null" class="mt-4 pl-3"></b-spinner>
					<p v-if="canGeneratePSCL===false" class="text-danger">Non è stata creata neanche una sede per l'azienda corrente. Per generare il PSCL è indispensabile creare la sede (dal menu aziende) e compilare il questionario sede.</p>
					<b-form-checkbox
						id="checkbox-1"
						v-model="ignore_office"
						name="checkbox-1"
						v-on:change="retrivePscl"
						class="">
						Non considerare la sede nella generazione del PSCL
					</b-form-checkbox>
                </b-col>
				<!--
				<b-col class="">
					<label class="d-block invisible">Azienda</label>
					<b-button :disabled="busy" variant="primary" v-if="survey_id !=0 && survey_id != null" @click="sendPscl" :style="`display: ${showSavePscl};`">
						<i class="fa fa-save" aria-hidden="true"></i> Salva
					</b-button>
				</b-col>
				-->
            </b-form-row>
        </b-form>

		<!-- Blocco per dire di scegliere azienda e sede per proseguire -->
		<b-row v-if="!company_id && !office_id && ignore_office === false" class="mt-3 d-flex align-items-center justify-content-center pt-5">
			<b-col class="text-center pt-5">
				<h4 class="text-danger">Per proseguire, seleziona sia l'azienda che la sede</h4>
				<h5 class="">Puoi anche scegliere di ignorare la sede attivando il checkbox sotto il campo da completare</h5>
			</b-col>
		</b-row>

		<!--blocco per dire che la sede non ha ancora un pscl-->
		<div v-if=" survey_id !=0 && survey_id != null" :style="`display: compact;display: ${showPscl};`">
            <b-alert v-if="exists_pscl == false" variant="warning" show>
                <b-icon-x-square></b-icon-x-square>
                Per questa sede non è ancora stato compilato il PSCL.
            </b-alert>
		</div>
		
		
		<!--tabs di avanzamento-->
		<b-tabs content-class="mt-3" v-model="activeTab" v-if="company_id && (office_id || ignore_office === true)">
			
			<!--tab iniziale-->
			<b-tab id="step-2" value="step-2">
				<template #title>
					<i class=''></i>Questionario
				</template>
				<h5 class="mb-0 text-primary">Stai componendo</h5>
				<h3 class="mt-1">PSCL per {{companies.find(c => c.id === company_id)?.name}}{{ ignore_office ? ' - tutte le sedi' : ' - ' + (offices.find(o => o.id === office_id)?.name || '') }}</h3>
				<h2>Collega un questionario</h2>
				<p>Il questionario non concorre direttamente alla generazione dei punti di monitoraggio, ma i sui dati saranno riportati in automatico all’interno del PSCL a sostegno delle misure scelte e della loro efficacia</p>
				<b-form-group v-if="canGeneratePSCL">
					<b-form-select v-model="survey_id" :options="surveys" value-field="id" text-field="name" required></b-form-select>
				</b-form-group>
				<p class="text-danger">
            		<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>Senza un questionario collegato non si possono editare interventi ed esportare PSCL
          		</p>
				  <p class="text-primary">
            		<i class="fa fa-info-circle" aria-hidden="true"></i>Scegliere un questionario significa solo scegliere un set di dati a cui fare riferimento nella scelta delle misure da includere nel PSCL
          		</p>
			</b-tab>

			<!--seconda tab-->
			<b-tab  id="step-3" value="step-3">
				<template #title>
					<i class=''></i>Interventi
				</template>
				<h5 class="mb-0 text-primary">Stai componendo</h5>
				<h3 class="mt-1">PSCL per {{companies.find(c => c.id === company_id)?.name}}{{ ignore_office ? ' - tutte le sedi' : ' - ' + (offices.find(o => o.id === office_id)?.name || '') }}</h3>
				
				<h5 class="mb-0 text-primary" v-if="survey_id">Il questionario collegato è</h5>
				<h3 class="mt-1" v-if="survey_id">{{surveys.find(c => c.id === survey_id)?.name}}</h3>

				<p class="text-danger"  v-if="!survey_id">
            		<i class="fa fa-undo" aria-hidden="true"></i>Per salvare le tue scelte seleziona un questionario da collegare al PSCL
          		</p>
				
				<div :style="`display: compact;display: ${showPscl};`" >
					
					<div class="col-12 px-0 mt-3">
						<h2>I 10 Pilastri del Mobility Management</h2>
						<p>
							Di seguito trovi i <b>10 pilastri</b> del Mobility Manager, le <b>10 aree di intervento</b> che ti aiuteranno a scegliere le azioni da attivare con il tuo PSCL.
						</p>
						<p>
							Facendo click su un pilastro puoi individuare quali sono le sue misure proposte.
						<br>
							Scegli tra le misure proposte quelle che si adattano meglio alla tua realtà (in questo il questionario collegato può aiutarti) <b>mettendo la spunta</b>.
						</p>
						<p>
							<b-badge variant="warning">servizio</b-badge> indica misure già <b>pronte</b> che puoi attivare grazie alla nostra <b>rete di convenzioni</b>.
						</p>
						<p>Quando hai <b>terminato</b> puoi salvare e <b>generare il documento nel formato che preferisci</b> che puoi successivamente arricchire con le informazioni di dettaglio specifiche per la tua realtà.</p>
					</div>

					<pscl-disclaimer></pscl-disclaimer>
					
					<b-list-group>
						<b-list-group-item v-for="pillar in pillars" :key="pillar.id" @click="[openPillar(pillar.id), fetchData(pillar.id)]">
							<b-badge>{{ pillar.id }}</b-badge>
							&nbsp; {{ pillar.name }}
							<span class="float-right">
								<span v-if="countMeasures(pillar.id)">
									<b-badge variant="primary">{{ countMeasures(pillar.id) }}</b-badge>
									misur<span v-if="countMeasures(pillar.id) > 1">e</span><span v-else>a</span>
								</span>
								&nbsp;
								<span v-if="countServices(pillar.id)">
									<b-badge variant="warning">{{ countServices(pillar.id) }}</b-badge>
									servizi
								</span>
							</span>
							<div v-if="showPillar == pillar.id">
								<ul class="list-unstyled">
									<b-media tag="li" v-for="m in filterMeasures(pillar.id)" :key="m.id" class="mt-3">
										<template v-slot:aside>
											<a :href="m.service_url" target="service">
												<b-img :src="`${serverPath}/img/${m.img}`" width="200" height="130" class="rounded"></b-img>
											</a>
										</template>

										<h5 class="mt-0 mb-1">
											{{ m.name }}
											<b-badge v-if="isRecommended(m.id)" variant="success">Suggerito per il tuo caso </b-badge>
										</h5>

										<p class="mb-0">
											{{ m.description }}
										</p>
										<b-checkbox
											class="mt-1"
											@click="openImpact(m.id)"
											v-if="(pscl[pillar.id][findMeasureIndex(pillar.id, m.id)] !== undefined) && (loggedUserIsMomaArea || loggedUserIsAdmin || loggedUserIsMomaAzienda)"
											v-model="pscl[pillar.id][findMeasureIndex(pillar.id, m.id)].value"
											:disabled="loggedUserIsMomaArea">
												Inserisci questa misura nel tuo PSCL
										</b-checkbox>
										<div v-if="pscl[pillar.id][findMeasureIndex(pillar.id, m.id)].value">
											<h5 @click="[currentMeasureId(m.id), getMonitoringLabels(m.id)]" v-b-toggle="'collapse-monitoraggio-' + m.id">
												Monitoraggio <b-icon icon="caret-down-square-fill"></b-icon>
											</h5>
											<b-collapse :id="`collapse-monitoraggio-${m.id}`" class="mt-2">
												<Monitoring
													@modal-open="showModalIndicatori($event)"
													:measure-id="m.id"
													:measure="getMeasure(m.id)"
													:monitoring="monitorings.get(m.id)"
													:busy="loading"
													@row-clicked="onRowClicked($event)"></Monitoring>
											</b-collapse>

											<h5 @click="openImpact(m.id)">Impatto <b-icon icon="caret-down-square-fill"></b-icon></h5>
											<b-collapse :id="`collapse-impatto-${m.id}`" class="mt-2" @force-render="forceRerender()">
												<Impact
													v-if="renderComponent"
													:surveyId="parseInt(survey_id)"
													:officeId="office_id != null?parseInt(office_id):null"
													:companyId="parseInt(company_id)"
													
													:measureId="m.id"
													:measure="getMeasure(m.id)"
													:monitoring="monitorings.get(m.id)"
													:busy="loading"></Impact>
											</b-collapse>
										</div>
										<span v-if="m.type == 2">
											<b-badge variant="warning">servizio</b-badge>
											Per questa misura la piattaforma offre un servizio.
											<a :href="m.service_url" class="btn btn-just-icon btn-outline-warning ml-3 mr-2">
												<i class="fa fa-arrow-right"></i>
											</a>
											<a :href="m.service_url">Scopri di più sul servizio</a>
										</span>
									</b-media>
								</ul>
								<b-spinner v-if="busy" label="Spinning"></b-spinner>
								<b-button class="w-100 btn-lg mt-2" :disabled="busy || !survey_id" variant="primary" @click="sendPscl" :style="`display: ${showSavePscl};`">
									<i class="fa fa-save" aria-hidden="true"></i> Salva
								</b-button>
							</div>
						</b-list-group-item>
					</b-list-group>
				</div>
				<b-row v-if="canGeneratePSCL ">
					<b-col class="d-flex justify-content-end">
						<b-spinner v-if="busy" label="Spinning"></b-spinner>
						<b-button class="w-100 btn-lg mt-2" :disabled="busy || !survey_id" variant="primary" @click="sendPscl" :style="`display: ${showSavePscl};`">
							<i class="fa fa-save" aria-hidden="true"></i> Salva
						</b-button>
					</b-col>
					<!--WIP possibile funzione di duplicazione PSCL-->
					<!-- <b-col class="ml-auto">
						<b-spinner v-if="busy" label="Spinning"></b-spinner>
						<b-button variant="success" class="float-right">
							<i class="fa fa-clone" aria-hidden="true"></i>Duplica
						</b-button>
					</b-col> -->
				</b-row>
				<!--
				<b-list-group class="elenco-documenti m-0 mt-2">
					<template v-if="canShowImpactsXLS">
						<b-list-group-item class="d-flex justify-content-between align-items-center mx-0 py-2">
						<h5 class="my-1">Genera Excel Impatti</h5>
						<div class="d-flex align-items-center"> 
							
							<b-badge variant="success" class="me-2 mr-2">XLS</b-badge>
							
							
							<b-button 
							:disabled="busyXlsx" 
							variant="primary" 
							@click="generatePSCLXlsx" 
							class="d-flex align-items-center"
							>
							<b-icon icon="download" class="me-1"></b-icon>
							</b-button>
						</div>
						</b-list-group-item>
					</template>
				</b-list-group>
				-->
			</b-tab>

			<!--tab di esportazione contenuti-->
			<b-tab id="step-4" value="step-4">
				<template #title>
					<i class='fa fa-share-square'></i>Esporta
				</template>
				<h5 class="mb-0 text-primary">Stai esportando</h5>
				<h3 class="mt-1">PSCL per {{companies.find(c => c.id === company_id)?.name}}{{ ignore_office ? ' - tutte le sedi' : ' - ' + (offices.find(o => o.id === office_id)?.name || '') }}</h3>
				
				<h5 class="mb-0 text-primary" v-if="survey_id">Incorpando i dati di</h5>
				<h3 class="mt-1" v-if="survey_id">{{surveys.find(c => c.id === survey_id)?.name}}</h3>

				<p class="text-danger"  v-if="!survey_id">
            		<i class="fa fa-undo" aria-hidden="true"></i>Puoi esportare solo PSCL con un questionario collegato
          		</p>

				
			
				<b-row v-if=" survey_id && survey_id && exists_pscl">
					<b-col>
						<h2 class="mt-3">Genera Documenti PSCL</h2>	
						<p class="text-muted">Dopo aver salvato gli interventi che compongono il Piano Spostamenti Casa Lavoro puoi generare qui la traccia dei documenti necessari per la presentazione del PSCL.</p>
						<p class="text-danger small">
							<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>I documenti non sono pronti da spedire, ma costituiscono una una traccia che dovrai adattare al caso della tua organizzazione.
						</p>
						<b-list-group class="elenco-documenti mx-0">

							<b-list-group-item class="d-flex justify-content-between align-items-center" @click="generatePSCLMd()" v-if="canShowMdGenerate && loggedUserIsAdmin">
								Genera PSCL (Markdown + CSS + PDF)<b-badge variant="success">+ efficace</b-badge>
								<p><b-spinner v-if="busyDocx" label="Spinning" variant="success"></b-spinner><b-icon icon="markdown-fill" variant="dark" class="rounded-circle p-2" style="background-color:greenyellow"></b-icon></p>
							</b-list-group-item>


							<b-list-group-item class="d-flex justify-content-between align-items-center" @click="generatePSCLHtml()">
								Genera Traccia PSCL (formato HTML, da copiare ed incollare in Word)<b-badge variant="danger">+ veloce</b-badge>
								<p><b-spinner v-if="busyHtml" label="Spinning" variant="success"></b-spinner><b-icon icon="file-earmark" variant="dark" class="rounded-circle p-2" style="background-color:silver"></b-icon></p>
							</b-list-group-item>

							<b-list-group-item class="d-flex justify-content-between align-items-center" @click="generatePSCLDocx()">
								Genera Traccia PSCL (formato Word)<span class="muted small">Funzionalità che può avere incompatibilità con versioni diverse di Word</span>
								<p><b-spinner v-if="busyDocx" label="Spinning" variant="success"></b-spinner><b-icon icon="file-earmark-word" variant="dark" class="rounded-circle p-2" style="background-color:silver"></b-icon></p>
							</b-list-group-item>
							
							<template v-if="canShowImpactsXLS">
							<b-list-group-item class="d-flex justify-content-between align-items-center" @click="generatePSCLXlsx()">
								Genera Excel Impatti
								<p><b-spinner v-if="busyXlsx" label="Spinning" variant="success"></b-spinner><b-icon icon="file-earmark-excel" variant="dark" class="rounded-circle p-2" style="background-color:silver"></b-icon></p>
							</b-list-group-item>
							</template>

							<!-- per adesso export obsoleto
							<template v-if="office_id != null">
								<b-list-group-item class="d-flex justify-content-between align-items-center" @click="generateCapTurni()" >
									Genera Elenco Cap/Turni
									<p><b-spinner v-if="busyCapTurni" label="Spinning" variant="success"></b-spinner><b-icon icon="globe" variant="dark" class="rounded-circle p-2" style="background-color:silver"></b-icon></p>
								</b-list-group-item>
							</template>
							-->
						</b-list-group>
					</b-col>
				</b-row>
			</b-tab>

			<!--tab di archiviazione-->
			<b-tab id="step-5" value="step-5">
				<template #title> 
					<i class='fa fa-upload'></i>Archivia
				</template>
					<b-row>
						<b-col>
							<h5 class="mb-0 text-primary">Stai archiviando</h5>
							<h3 class="mt-1">PSCL per {{companies.find(c => c.id === company_id)?.name}}{{ ignore_office ? ' - tutte le sedi' : ' - ' + (offices.find(o => o.id === office_id)?.name || '') }}</h3>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<div class="d-flex flex-wrap">
								<p class="text-danger mr-2">
									<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>Il caricamento non si sostituisce all’invio formale della PEC al moma d’area
								</p>
								<p class="text-primary">
									<i class="fa fa-info-circle" aria-hidden="true"></i>Il questionario collegato non influirà sulla divisione dei PSCL all'interno dello storico
								</p>
							</div>
						</b-col>
					</b-row>
					<b-row>
						<b-col cols="12">
							<b-form-file
								:disabled="busy"
								v-model="file"
								:state="Boolean(file)"
								placeholder="Carica il documento contenente il PSCL definitivo qui"
								drop-placeholder="Puoi trascinare i file qui"></b-form-file>
						</b-col>
						<b-col class="mt-2 d-flex justify-content-end">
							<b-button :disabled="busy" variant="success" @click="uploadPSCL"> <i class="fa fa-upload"></i> Carica il PSCL</b-button>
						</b-col>
					</b-row>
					
					
					
			</b-tab>
			<!--prova per mettere la tab tutta a destra, in alternativa flex-grow-1 e text-right -->
			<b-tab id="step-6" value="step-6">
				<template #title>
					<i class='fa fa-book'></i> Storico
				</template>
				<b-row>
					<b-col cols="12" v-if="office_id != 0 && exists_pscl">
						<h5 class="mb-0 text-primary">Scarica i PSCL archiviati di:</h5>
						<h3 class="mt-1">{{companies.find(c => c.id === company_id)?.name}}{{ ignore_office ? ' - tutte le sedi' : ' - ' + (offices.find(o => o.id === office_id)?.name || '') }}</h3>
						<b-list-group class="elenco-documenti">
							<b-list-group-item v-for="(f,i) in files" :key="i" class="d-flex justify-content-between align-items-center" @click="downloadPSCL(f)">
								{{f}}
								<p><b-spinner v-if="busyPSCL" label="Spinning" variant="success"></b-spinner><b-icon icon="download" variant="dark" class="rounded-circle p-2" style="background-color:silver"></b-icon></p>
							</b-list-group-item>
						</b-list-group>
					</b-col>
				</b-row>
				<b-row v-if="!exists_pscl" class="mt-3 d-flex align-items-center justify-content-center pt-5">
					<b-col class="text-center pt-5">
						<h4 class="text-danger">Nessun PSCL archiviato</h4>
						<h5 class="">Controlla di star cercando la sede giusta o che le sedi non siano disattivate</h5>
					</b-col>
				</b-row>
			</b-tab>
		</b-tabs>


		

		<!---->
		

		

		

        <b-modal @ok="handleOk()" :title="`Indicatori ${measureNames.get(measure_id)}`" id="indicatori-modal">
            <table class="table table-striped">
                <tr>
                    <td v-if="!monitorings_tmp['objective']">nome punto di monitoraggio</td>
					<td v-if="monitorings_tmp['objective']">nome di obiettivo</td>
                    <td>
                        <b-input v-model="monitorings_tmp['name']" size="sm" type="text" required/>
                    </td>
                </tr>
                <tr>
                    <td>Data</td>
                    <td>
                        <b-input v-model="monitorings_tmp['dt']" size="sm" type="date" required/>
                    </td>
                </tr>

                <tr v-for="l in labels" :key="l.key">
                    <td v-if="l.field_type == 'radio'">
                        {{ l.label }}
                    </td>
                    <td v-if="l.field_type == 'radio'">
                        <b-form-radio v-model="monitorings_tmp[l.key]" name="yes-no-radios" value="1">Sì</b-form-radio>
                        <b-form-radio v-model="monitorings_tmp[l.key]" name="yes-no-radios" value="0">No</b-form-radio>
                    </td>

					<td v-if="l.field_type != 'radio'">
                        {{ l.label }}&nbsp;
						<b-icon 
						v-if="l.description"
						icon="info-circle" 
						variant="primary" 
						:id="l.label"
						aria-label="Info">
					</b-icon>
					<b-popover :target="l.label" triggers="hover" html>
						<div v-html="l.description"></div>
					</b-popover>
                    </td>

                    <td v-if="l.field_type != 'radio'">
                        <b-input v-model="monitorings_tmp[l.key]" size="sm" :type="l.field_type" required/>
                    </td>
                </tr>
				<tr >
                	<!-- <b-input v-model="monitorings_tmp['note']" size="lg" type="text" /> -->
					<td colspan="2">
						<b-form-group label="Commenti">
                    	<b-textarea rows="5" v-model="monitorings_tmp['note']" placeholder="Inserisci una nota..."></b-textarea>
                	</b-form-group>
					</td>	
				</tr>
            </table>
        </b-modal>
    </div>
</template>
<script>
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import Impact from "@/components/Pscl/Impact";
import Monitoring from "@/components/Pscl/Monitoring";
import PsclDisclaimer from "@/components/Pscl/Disclaimer";

var mime = require("mime-types");

export default {
	name: "Pscl",
	components: {
		Impact,
		Monitoring,
		PsclDisclaimer,
	},
	mixins: [Util],
	data() {
		return {
			showPillar: null,
			showMeasure: null,
			pillars: null,
			measures: null,
			publicPath: process.env.BASE_URL,
			serverPath: process.env.VUE_APP_ROOT,
			pscl: [],
			files: null, //Elenco dei file del PSCL di questa azienda
			exists_pscl: false,
			showPscl: "compact",
			showSavePscl: "compact",
			showCompilePscl: this.exists_pscl,
			company_id: 0,
			companies: [],
			office_id: 0,
			offices: [],
			survey_id: 0,
			surveys: [],
			company_type: null,
			busy: false,
			busyDocx: false,
			busyXlsx: false,
			busyHtml: false,
			busyCapTurni: false,
			loading: false,
			loadingFiles: false,
			file: [],
			monitorings: new Map(),
			pillarMeasures: null,
			monitorings_tmp: {
				name: null,
				dt: null,
				note: null,
			},
			row_index: null,
			measure_id: null,
			renderComponent: false,
			measureNames: new Map(),
			labels: null,
			busyPSCL: false,
			ignore_office:false,
			pscl_id: null,
		};
	},

	watch: {
		//inizializza le label sempre a zero
		labels: { 
			handler(newLabels) {
				newLabels.forEach((label) => {
					if (this.monitorings_tmp[label.key] === undefined) {
						this.$set(this.monitorings_tmp, label.key, 0);
					}
				});
			},
		},
	},
	computed: {
		canGeneratePSCL() {
			if (this.offices == null || this.offices.length == 0 ) {
				return null;
			}
			return this.offices.length >= 1;
		}
	},
	methods: {
		currentMeasureId(measure_id) {
			this.measure_id = measure_id;
			this.measureName = null;
			let m = this.getMeasure(measure_id);
			if (m == undefined) {
				return "-";
			}
			this.measureName = m.name;
		},
		async getMonitoringLabels(measure_id) {
			if (measure_id != null) {
				try {
					this.labels = null;
					let lbls = await UserService.getPsclMeasureLabels(this.measure_id);
					this.labels = lbls.data.labels;
				} catch (error) {
					//console.log(error);
				}
			}
		},
		currentMeasureName() {
			let m = this.getMeasure(this.measure_id);
			if (m == undefined) {
				return "-";
			}
			return m.name;
		},

		getMeasure(measure_id) {
			if (this.measures == null) {
				return null;
			}
			return this.measures.filter((m) => m.id == measure_id)[0];
		},
		fetchData(pillar_id) {
			this.pillarMeasures = null;
			let pillarMeasures = this.measures.filter((measure) => measure.pillar_id === pillar_id);
			this.pillarMeasures = pillarMeasures;
			//console.log("we are here", this.showPillar);

			this.pillarMeasures.forEach((measure) => {
				this.getMonitorings(measure.id);
			});

			// this.$forceUpdate;
		},
		async getMonitorings(measure_id) {
			let result = null;
			this.loading = true;
			try {
				result = await UserService.getMonitorings(this.office_id, measure_id, this.survey_id,this.year, this.company_id);
			} catch (error) {
				this.showError(error);
			} finally {
				this.loading = false;
			}
			let series = result.data.monitorings;

			if (result.data.monitorings.length == 0) {
				return;
			}

			let outs = [];
			series.map((element) => {
				let jv = element.jvalues;
				if (jv != null) {
					Object.entries(jv).forEach(([key, value]) => {
						element[key] = value;
					});
				}
				delete element.jvalues;
				delete element.created;
				delete element.modified;
				delete element.office_id;
				delete element.measure_id;

				//TODO: Generalizzare con la vera traccia dell'output
				outs.push({ riduzione_km_gg_auto: 0, C: 0, CO: 0, CO2: 0, NOx: 0, PM10: 0 });
			});
			if (!this.monitorings.has(measure_id)) {
				this.monitorings.set(measure_id, {
					series,
					out: outs,
				});
			}
		},
		showModalIndicatori($event) {
			this.measure_id = $event.measure_id;
			this.row_index = $event.row_index;
			this.labels = this.getMonitoringLabels(this.measure_id);
			if (this.row_index != null) {
				this.monitorings_tmp = this.monitorings.get(this.measure_id).series[this.row_index];
			} else {
				this.monitorings_tmp = { name: null, dt: null, objective: $event.objective, note: null };
			}
			this.$bvModal.show("indicatori-modal");
		},
		onRowClicked($event) {
			this.measure_id = $event.measure_id;
			this.row_index = $event.row_index;
			this.forceRerender();
		},
		openImpact(id) {			
			this.$root.$emit("bv::toggle::collapse", "collapse-impatto-" + id);
			this.forceRerender();
		},
		forceRerender() {
			// Remove my-component from the DOM
			this.renderComponent = false;

			this.$nextTick(() => {
				// Add the component back in
				this.renderComponent = true;
			});
		},
		async handleOk() {
			if (this.row_index == null) {
				this.monitorings_tmp.measure_id = this.measure_id;
				this.monitorings_tmp.office_id = this.office_id;
				this.monitorings_tmp.survey_id = this.survey_id;
				this.monitorings_tmp.pscl_id = this.pscl_id;
				let res;
				try {
					res = await UserService.addMonitoring(this.monitorings_tmp,this.year);
				} catch (error) {
					//console.log(error);
					this.showError(error);
				}
				//Se non c'è il monitoring devo creare la serie
				if (this.monitorings.get(this.measure_id) == undefined || this.monitorings.get(this.measure_id).series == undefined) {
					this.row_index = 0;
					this.monitorings.set(this.measure_id, { series: [this.monitorings_tmp] });
				} else {
					//Devo fare push del risultato che ottengo da addMonitoring per avere l'id
					this.monitorings_tmp.id = res.data.monitoring.id;
					//Push returns the length of the array
					this.row_index = this.monitorings.get(this.measure_id).series.push(this.monitorings_tmp);
				}

				this.$root.$emit("bv::refresh::table", "tab-" + this.measure_id);
				this.forceRerender();
			} else {
				this.monitorings_tmp.pscl_id = this.pscl_id;
				UserService.editMonitoring(this.monitorings_tmp.id, this.monitorings_tmp,this.year);
				this.monitorings.get(this.measure_id).series[this.row_index] = this.monitorings_tmp;
				this.forceRerender();
			}
			this.row_index = null;
		},

		async uploadPSCL() {
			if (this.file.length == 0) {
				this.$bvToast.toast("Please select a file to upload", {
					title: "No file selected",
					variant: "warning",
					autoHideDelay: 2000,
					appendToast: true,
				});
				return;
			}
			this.busy = true;
			let formData = new FormData();
			formData.append("pscldoc", this.file);
			try {
				let res = await UserService.uploadPSCL(formData, this.company_id, this.office_id, this.year);
				if (res.data.success) {
					this.$bvToast.toast("File caricato correttamente", {
						title: "Upload Ok",
						variant: "success",
						autoHideDelay: 2000,
						appendToast: true,
					});
					this.files = await UserService.listPSCL(this.company_id, this.office_id,this.year);
					if (this.files.data.files !== undefined){
						this.files = this.files.data.files;
					}
				}else{
					this.$bvToast.toast(res.data.msg, {
						title: "Upload Fail",
						variant: "danger",
						autoHideDelay: 5000,
						appendToast: true,
					});
				}
				this.file = null;
			} catch (e) {
				if (e.code || !e.data.success) {
					this.$bvToast.toast("Impossibile caricare il file", {
						title: "Upload Fail",
						variant: "danger",
						autoHideDelay: 5000,
						appendToast: true,
					});
				}
				//console.log(e);
				this.file = null;
			} finally {
				this.busy = false;
			}
		},
		async downloadPSCL(fname) {
			try {
				this.busy = true;
				const res = await UserService.downloadPSCL(this.company_id, this.office_id, fname, this.year);
				let ext = mime.extension(res.data.type);
				if (ext === "json") {
					this.$bvToast.toast("Nessun file caricato", {
						title: "No Uploads",
						variant: "warning",
						autoHideDelay: 2000,
						appendToast: true,
					});
					return;
				}
				const url = window.URL.createObjectURL(new Blob([res.data]));
				const link = document.createElement("a");
				link.href = url;
				let company = this.companies.find((c) => c.id == this.company_id);
				link.setAttribute("download", `${fname}-${company.name}.${ext}`);
				document.body.appendChild(link);
				link.click();
			} catch (e) {
				// //console.log(e);
			} finally {
				this.busy = false;
			}
		},
		rnd() {
			let max = 6;
			let min = 1;
			return Math.floor(Math.random() * (max - min)) + min;
		},
		openPillar(pillar_id) {
			this.showPillar = pillar_id;
		},
		openMeasure(measure_id) {
			this.showMeasure = measure_id;
		},
		filterMeasures(pillar_id) {
			let self = this;
			return this.measures.filter(function (m) {
				//Mostro solo le misure del tipo giusto
				if (m.target == self.company_type) {
					return m.pillar_id == pillar_id;
				}
			});
		},
		countMeasures(pillar_id) {
			let self = this;
			let res = this.measures.filter(function (m) {
				return m.pillar_id == pillar_id && m.type == 1 && m.target == self.company_type;
			});
			return res.length;
		},
		countServices(pillar_id) {
			let self = this;
			let res = this.measures.filter(function (m) {
				return m.pillar_id == pillar_id && m.type == 2 && m.target == self.company_type;
			});
			return res.length;
		},
		isRecommended(measure_id) {
			let reccommendedMeasures = [1, 4, 6, 8, 11, 15, 18, 22, 26];
			return reccommendedMeasures.includes(measure_id);
		},
		async updateOffices(retrivePscl = true) {
			this.busy = true;
			try {
				this.offices = [];
				
				if (this.company_id > 0 ){
					let response = await UserService.getOffices(this.company_id);
					this.offices = response.data.offices;
				}
				
				console.log("Offices update", this.offices.length);
				if (this.offices.length == 1) {
					console.log("Offices update", this.offices[0].id);
					this.office_id = this.offices[0].id;
					this.surveys = await this.createFilteredSurveysList();
					if(this.year == 'TUTTI'){
						if (this.surveys.length == 1) {
							this.survey_id = this.surveys[0].id;
						}else{
							this.survey_id = this.surveys[1].id;
						}
					}
				} else {
					this.offices.unshift({
						id: 0,
						name: "--- Tutte le sedi  --- ",
					});
					if(this.offices.length>1){
						this.office_id = this.offices[1].id;
					}else{
						this.office_id = this.offices[0].id;
					}
					
					this.surveys = await this.createFilteredSurveysList();
					if(this.year == 'TUTTI'){
						if (this.surveys.length == 1) {
							this.survey_id = this.surveys[0].id;
						}else{
							this.survey_id = this.surveys[1].id;
						}
					}
				}
				
				if (this.company_id > 0){
					let response = await UserService.getCompanyType(this.company_id);
					this.company_type = response.data.data.survey_template;
				}
				if (retrivePscl){
					await this.retrivePscl();	//WIP - provare a modificare i pscl selezionando l'azienda		
				}
			} catch (e) {
				//console.log(e);
			} finally {
				this.busy = false;
			}
		},

		async createFilteredSurveysList() {
			let res;
			//console.log("Company, office", this.company_id, this.office_id);
			if (this.company_id > 0) {
				res = await UserService.getSurveysList(this.company_id, this.office_id);
				this.surveys = [
					{
						id: 0,
						name: "--- Tutti i questionari  --- ",
					},
					...res.data.surveyList.map((s) => {
						return {
							id: s.id,
							name: s.name+(s.year!==null ? '-' +s.year : ''),
						};
					}),
				];

			} else {
				this.surveys = [{
					id: 0,
					name: "--- Nessun questionario  --- ",
				},];
			}
			
			return this.surveys;
		},

		getDate() {
			let date = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
			let formatted_date = date.split("/").reverse().join("/");
			return formatted_date;
		},
		retrivePscl: async function () {
			this.busy = true;
			try {
				this.getYear();
				this.monitorings.clear();
				this.surveys = await this.createFilteredSurveysList();

				this.filterPillars(); //Creiamo un array vuoto
				localStorage.setItem("pscl.company", this.company_id);
				
				
				// use ignore_office to call the api without office_id
				if ( this.year != 'TUTTI'  ) {
					if(this.ignore_office){
						this.office_id = null;
					}else if(this.office_id == null){
						await this.updateOffices(false);
					}
					
				}
				console.log("OFFICE", this.office_id);
				localStorage.setItem("pscl.office", this.office_id);
				
				const response = await UserService.getPscl(this.company_id, this.office_id, this.year);
								
				this.showPillar = null;
				let result = response.data.pscl;
				console.log("PSCL", result);
				if (result != null) {
					if(result.plan){
						this.pscl = result.plan;
						this.pscl_id = result.id;
						this.survey_id = result.survey_id;
					}else{
						
						// if PSCL is null then pscl do not exist
						if(result.PSCL != null){
							this.pscl = result.PSCL;
							this.survey_id = null;
						}else{
							this.exists_pscl = false;
							return;
						}
					}
					//Be sure that every row has a value (even if it was added before)
					this.createMissingPSCLValues();
					this.exists_pscl = true;					
					this.files = await UserService.listPSCL(this.company_id, this.office_id, this.year);
					if (typeof this.files.data.files !== "undefined"){
						this.files = this.files.data.files;
					}					
				} else {
					this.exists_pscl = false;
				}
				// localStorage.setItem("pscl.survey", this.survey_id);
				console.log("office_id", this.office_id);
				console.log("year retrieve", this.year);
				// Your logic to retrieve PSCL
				const currentRoute = this.$route;
            const targetRoute = {
                path: '/pscl',
                query: {
                    company_id: this.company_id,
                    office_id: String(this.office_id),
                    year: this.year
                }
            };

            if (currentRoute.path !== targetRoute.path || JSON.stringify(currentRoute.query) !== JSON.stringify(targetRoute.query)) {
                this.$router.push(targetRoute).catch(err => {
                    if (err.name !== 'NavigationDuplicated') {
                        throw err;
                    }
                });
            }
				// this.$router.push({query: {company_id: this.company_id, office_id: String(this.office_id), year: this.year}});
			} catch (error) {
				//console.log(error);
				this.exists_pscl = false;
			} finally {
				this.busy = false;
			}
		},
		createMissingPSCLValues(){
			for (const p of this.pillars){
				for (const m of this.filterMeasures(p.id)){
					if (this.pscl[p.id][m.id] == undefined){
						this.pscl[p.id].push( {
							pillar_id: p.id,
							measure_id: m.id,
							measure_slug: m.slug,
							value: false,
						});
					}
				}
			}
		},
		sendPscl: async function () {
			this.busy = true;
			try {
				if (this.pscl[0].first_compiled_at == "") {
					this.pscl[0] = {
						office_id: this.office_id,
						company_id: this.company_id,
						first_compiled_at: this.getDate(),
						last_updated_at: this.getDate(),
					};
				} else {
					this.pscl[0].last_updated_at = this.getDate();
				}
				// ignore_office use to call the api without office_id
				if (this.ignore_office) {
					this.office_id = null;
				}
				const res = await UserService.savePscl(this.company_id,this.office_id, this.survey_id, this.pscl, this.year);

				if (res.data.success) {
					this.$bvToast.toast("Il PSCL è stato salvato correttamente", {
						title: "Salvataggio ok",
						variant: "success",
						autoHideDelay: 2000,
						appendToast: true,
					});
					this.exists_pscl = true;
					await this.retrivePscl();	//WIP - provare a modificare i pscl selezionando l'azienda		
				} else throw new Error();
			} catch (e) {
				this.$bvToast.toast(String(e), {
					title: "Errore",
					autoHideDelay: 2000,
					appendToast: true,
				});
				//console.log(e);
			} finally {
				this.busy = false;
			}
		},
		findMeasureIndex(p_id, m_id) {
			if (this.pscl[p_id] == undefined || this.pscl[p_id] == null) {
				return null;
			}
			let x = this.pscl[p_id].findIndex((x) => m_id == x.measure_id);
			return x;
		},
		async generatePSCLXlsx() {
			try {
				this.busyXlsx = true;
				let company = this.companies.find((c) => c.id == this.company_id);
				
				const res = await UserService.generatePSCLXlsx(this.company_id,this.office_id,this.survey_id, this.year);
				const url = window.URL.createObjectURL(new Blob([res.data]));
				const link = document.createElement("a");
				link.href = url;
				// if office is null
				if(this.office_id != null){
					let office = this.offices.find((o) => o.id == this.office_id);
					link.setAttribute("download", `pscl-${company.name.replace(" ", "_")}-${office.name.replace(" ", "_")}.xlsx`);
				}else{
					link.setAttribute("download", `pscl-${company.name.replace(" ", "_")}.xlsx`);
				}
				document.body.appendChild(link);
				link.click();
			} catch (e) {
				this.$bvToast.toast(String(e), {
					title: "Errore",
					variant: "danger",
					autoHideDelay: 2000,
					appendToast: true,
				});
				//console.log(e);
			} finally {
				this.busyXlsx = false;
			}
		},		
		async generatePSCLHtml() {
			try {
				this.busyHtml = true;
				let company = this.companies.find((c) => c.id == this.company_id);
				// if year is tutti
				let res;
				if(this.year == 'TUTTI'){
					res = await UserService.generatePSCL('html',this.company_id, this.office_id, this.survey_id, this.ignore_office);
				}else{
					res = await UserService.generatePSCL('html',this.company_id, this.office_id, this.survey_id, this.ignore_office, this.year);
				}
				const url = window.URL.createObjectURL(new Blob([res.data]));
				const link = document.createElement("a");
				link.href = url;
				// if office is null
				if(this.office_id != null){
					let office = this.offices.find((o) => o.id == this.office_id);
					link.setAttribute("download", `pscl-${company.name.replace(" ", "")}-${office.name.replace(" ", "")}.html`);
				}else{
					link.setAttribute("download", `pscl-${company.name.replace(" ", "")}.html`);
				}
				
				document.body.appendChild(link);
				link.click();				
			} catch (e) {
				this.$bvToast.toast(String(e), {
					title: "Errore",
					variant: "danger",
					autoHideDelay: 2000,
					appendToast: true,
				});
				//console.log(e);
			} finally {
				this.busyHtml = false;
			}
		},
		async generatePSCLDocx() {
			try {
				this.busyDocx = true;
				let company = this.companies.find((c) => c.id == this.company_id);
				// if year is tutti
				let res;
				if(this.year == 'TUTTI'){
					res = await UserService.generatePSCL('docx',this.company_id, this.office_id, this.survey_id,this.ignore_office);		
				}else{
					res = await UserService.generatePSCL('docx',this.company_id, this.office_id, this.survey_id,this.ignore_office,this.year);		
				}		
				const url = window.URL.createObjectURL(new Blob([res.data]));
				const link = document.createElement("a");
				link.href = url;
				// if office is null
				if(this.office_id != null){
					let office = this.offices.find((o) => o.id == this.office_id);
					link.setAttribute("download", `pscl-${company.name.replace(" ", "")}-${office.name.replace(" ", "")}.docx`);
				}else{
					link.setAttribute("download", `pscl-${company.name.replace(" ", "")}.docx`);
				}
				document.body.appendChild(link);
				link.click();				
			} catch (e) {
				this.$bvToast.toast(String(e), {
					title: "Errore",
					variant: "danger",
					autoHideDelay: 2000,
					appendToast: true,
				});
				//console.log(e);
			} finally {
				this.busyDocx = false;
			}
		},
		async generatePSCLMd(){			
			this.$router.push(`/md-editor/${this.company_id}/${this.office_id}/${this.survey_id}/${this.ignore_office}`);
		},
		async generateCapTurni(){
			this.busyCapTurni = true;
			try {
				let company = this.companies.find((c) => c.id == this.company_id);
				let office = this.offices.find((o) => o.id == this.office_id);
				const res = await UserService.generateCapTurni(this.office_id,this.year);
				const url = window.URL.createObjectURL(new Blob([res.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", `cap-turni-${company.name.replace(" ", "-")}-${office.name.replace(" ", "-")}.xlsx`);
				document.body.appendChild(link);
				link.click();				
			} catch (e) {
				this.$bvToast.toast(String(e), {
					title: "Errore",
					variant: "danger",
					autoHideDelay: 2000,
					appendToast: true,
				});
				//console.log(e);
			} finally {
				this.busyCapTurni = false;
			}
		},
		filterPillars() {
			let self = this;
			self.pscl = [];
			self.pillars.forEach((p) => {
				self.pscl[p.id] = [];
				self.filterMeasures(p.id).forEach(function (m) {
					self.pscl[p.id].push({
						pillar_id: p.id,
						measure_id: m.id,
						measure_slug: m.slug,
						value: false,
					});
				});
			});
			if (this.pscl[0] == null) {
				this.pscl[0] = {
					office_id: this.office_id,
					company_id: this.company_id,
					first_compiled_at: "",
					last_updated_at: "",
				};
			}
		},
	},
	async created() {
		this.busy = true;		
		let self = this;

		try {
			if (this.$route.query.year){
				console.log("year", this.$route.query.year);
				this.getYear();
				if(this.$route.query.year != this.year){
					if(this.$route.query.year == 'TUTTI'){
						console.log("year tutti");
						this.setYear('TUTTI',true);
					}else{
						console.log("not year tutti");
						this.setYear(parseInt(this.$route.query.year),true);
					}
				}
			}
			const response = await Promise.all([
				UserService.getCompanyList(), //0
				UserService.getPillars(), //1
				UserService.getMeasures(), //2
			]);

			// Aggiungo l'opzione vuota all'inizio
			response[0].data.companies.unshift({
				id: 0,
				name: "--- Filtra per azienda  --- ",
			});

			this.offices.unshift({
				id: 0,
				name: "--- Seleziona l'azienda  --- ",
			});
			this.companies = response[0].data.companies;
			this.pillars = response[1].data.pillars;
			this.measures = response[2].data.measures;
			// if (localStorage.getItem("pscl.year") != null ) {
			// 	this.setYear(localStorage.getItem("pscl.year"));
			// }
			// get cookie year
			// this.psclwindow.$cookies.get('year')
			// if (localStorage.getItem("pscl.year") != null ) {
			// 	this.setYear(localStorage.getItem("pscl.year"));
			// }
			
			
			
			if(this.getUserCompany != null){
				this.company_id = this.getUserCompany;
				// console.log("company_id", this.company_id);
				if(this.company_id > 0){
					await this.updateOffices(false);
				}
			}else{
				if (this.$route.query.company_id){
					this.company_id = parseInt(this.$route.query.company_id);
					await this.updateOffices(false);
				}else{
					if (localStorage.getItem("pscl.company") != null){
						this.company_id = localStorage.getItem("pscl.company");
						await this.updateOffices(false);
					}
				}

			}
			
			
			if (this.$route.query.office_id != "null" && this.office_id == null){
				console.log("office_id", this.$route.query.office_id);
				this.office_id = parseInt(this.$route.query.office_id);
				
			}else if(this.$route.query.office_id == "null"){
				console.log("office_id else", this.$route.query.office_id);
				if (localStorage.getItem("pscl.office")  != "null"){
					console.log("office_id else localstorage", localStorage.getItem("pscl.office"));
					this.office_id = localStorage.getItem("pscl.office");
				// this.$router.push({query: {office_id: this.office_id}});
				}else{
					console.log("office_id else not localstorage", localStorage.getItem("pscl.office"));
					this.office_id = null;
					this.ignore_office = true;
				}
			}	
			
			
			
			
			this.surveys = await this.createFilteredSurveysList();
			
			
			
			
			

			
			
			await this.retrivePscl();
			self.measures.forEach((measure) => {
				self.measureNames.set(measure.id, measure.name);
			});
			
			//console.log("Measures", this.measure);
			return;
		} catch (e) {
			//console.log(e);
		} finally {
			this.busy = false;
		}
	},
};
</script>
<style>
	.elenco-documenti .list-group-item p {
		font-size: 24pt;
		margin: 0;
	}
	.elenco-documenti .list-group-item {
		border-top: none;
		margin: 0.3em;
		padding: 0.25rem 1rem;
		cursor: pointer;
	}
</style>
