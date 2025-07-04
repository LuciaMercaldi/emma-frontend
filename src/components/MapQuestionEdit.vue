<template>
  <div>
    <b-row>
      <b-col md="5" class="text-center">
        <i class="fa fa-home fa-3x" style="position: relative; left: -10px"></i>
        <br />
        <span>{{ casa.address }}</span>
      </b-col>
      <b-col md="1"></b-col>
      <b-col md="5" class="text-center">
        <i class="fa fa-building-o fa-3x" style="position: relative; left: -9px"></i>
        <br />
        <span>{{ sedeLavoro.name }}</span>
        <span>{{ sedeLavoro.address }} {{ sedeLavoro.city }}</span>
      </b-col>
    </b-row>

    <div v-if="step == 1">

		<label>Domanda</label>
		<b-form-input id="mapqs.leavingpoint" v-model="mapqs.leavingpoint" trim></b-form-input>

		<!-- <label class="mt-2">Instruzione</label>
		<b-form-textarea class="mt-2" id="mapqs.insert_address" v-model="mapqs.insert_address" trim></b-form-textarea>-->
    	<b-form class="mt-2"> 
			<b-form-row>
				<b-col class="mt-2" md="6"  lg="6">
					<label>Dati</label>
				</b-col>
				<b-col class="mt-2" md="6"  lg="6">
					<label>Descrizione</label>
				</b-col>
			</b-form-row>
			<b-form-row>
				<b-col class="mt-2" md="6"  lg="6">
					<b-form-input id="mapqs.address" v-model="mapqs.address" trim></b-form-input>
				</b-col>
				<b-col class="mt-2" md="6"  lg="6">
					<b-form-input id="mapqs.insert_address" v-model="mapqs.insert_address" trim></b-form-input>
				</b-col>
			</b-form-row>
			<b-form-row>
				<b-col class="mt-2" md="6"  lg="6">
					<b-form-input id="mapqs.Cap" v-model="mapqs.Cap" trim></b-form-input>
				</b-col>
				<b-col class="mt-2" md="6"  lg="6">
					<b-form-input id="mapqs.insert_Cap" v-model="mapqs.insert_Cap" trim></b-form-input>
				</b-col>
			</b-form-row>
			<b-form-row>
				<b-col class="mt-2" md="6"  lg="6">
					<b-form-input id="mapqs.city" v-model="mapqs.city" trim></b-form-input>
				</b-col>
				<b-col class="mt-2" md="6"  lg="6">
					<b-form-input id="mapqs.insert_city"  v-model="mapqs.insert_city" trim></b-form-input>
				</b-col>
			</b-form-row>
			<b-form-row>
				<b-col class="mt-2" md="6"  lg="6">
					<b-form-input id="mapqs.province" v-model="mapqs.province" trim></b-form-input>
				</b-col>
			</b-form-row>
		</b-form>
		<label class="mt-2">Pulsanti</label>
		<b-form-input class="mt-1" id="mapqs.click" v-model="mapqs.click" trim></b-form-input>

		<label class="mt-2">L'indirizzo non viene riconosciuto</label>
		<b-form-textarea class="my-1 h-auto overflow-hidden" id="mapqs.unavalible_adress" v-model="mapqs.unavalible_adress" trim></b-form-textarea>

		<label class="mt-2">Disclaimer privacy</label>
		<b-form-textarea class="my-1 h-auto overflow-hidden" id="mapqs.privacy_que" v-model="mapqs.privacy_que" ></b-form-textarea>
		
      <b-row>
        <b-col>
          <b-button variant="primary" @click="$emit('back')">{{ mapqs.back }}</b-button>
        </b-col>
        <b-col class="text-right">
          <b-button
            
            variant="success"
            @click="hideOffice((avanti = true))">
            {{ mapqs.next }}
            <i
              class="fa fa-arrow-right"
              v-if="casa.latLng != null"
              aria-hidden="true"></i>
          </b-button>
        </b-col>
      </b-row>
    </div>

    <div v-if="step == 2">
		<label>Domanda</label>
		<b-form-input id="mapqs.step_which_company" v-model="mapqs.step_which_company" trim></b-form-input>
      <br />
      <b-row>
        <b-col>
          <b-button variant="primary" @click="step = 1">{{ mapqs.back }}</b-button>
        </b-col>
        <b-col class="text-right">
          <b-button
            variant="success"
            @click="step = 3">
            {{ mapqs.next }}
            <i
              class="fa fa-arrow-right"
              aria-hidden="true"></i>
          </b-button>
        </b-col>
      </b-row>
    </div>

    <div v-if="step == 3">
		<label>Domanda</label>
		<b-form-input id="mapqs.which_modes" v-model="mapqs.which_modes" trim></b-form-input>

		<h5 class="mt-2">Questa sezione è la domanda predefinita per tutti i tipi di trasporto </h5>

		<label>Domanda</label>
		<b-form-input  class="mb-2" id="mapqs.mean_label" v-model="mapqs.mean_label" trim></b-form-input>

		<label  class="mt-2"> Opzioni</label>
		<b-form-input id="mapqs.which_distance" v-model="mapqs.which_distance"></b-form-input>
		<b-form-input class="mt-2" id="mapqs.which_cost" v-model="mapqs.which_cost" trim></b-form-input>

		<h3 class="mt-2">Tipo di Transporto</h3>
		
		<div>
			<b-button block v-b-toggle.collapse-auto variant="primary">Auto</b-button>
			<b-collapse id="collapse-auto" class="mt-2">
				<b-card>
					<label class="mt-2">Editare nome</label>
					<b-form-input id="mapqs.meansOfTransport.Auto" v-model="mapqs.meansOfTransport.Auto" trim></b-form-input>
					<p class="mt-3" v-if="language=='en'">{{questions_spostamenti['tipo-auto'].questions_surveys[0]._translations.en.description == null ? questions_spostamenti['tipo-auto']._translations.en.description : questions_spostamenti['tipo-auto'].questions_surveys[0]._translations.en.description}}</p>
					<p class="mt-3" v-else>{{questions_spostamenti['tipo-auto'].questions_surveys[0].description == null ? questions_spostamenti['tipo-auto'].description : questions_spostamenti['tipo-auto'].questions_surveys[0].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-sel_type_auto size="sm" @click.prevent="editQuestion(questions_spostamenti['tipo-auto'].id)" >Edit domanda</b-button>
					<div class="text-danger mt-2">
						<i aria-hidden="true" class="fa fa-exclamation-triangle "></i>
						<span><b>&nbsp;NON</b> modificare il tipo della sottodomanda, potresti compromettere il funzionamento della&nbsp;domanda&nbsp;mappa</span>
					</div>
					<p class="mt-3">{{questions_spostamenti['personale-auto'].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-sel_type_Personal size="sm" @click.prevent="editQuestion(questions_spostamenti['personale-auto'].id)">Edit domanda</b-button>
					<p class="mt-3">{{questions_spostamenti['alimentazione-auto'].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-car_fueling size="sm" @click.prevent="editQuestion(questions_spostamenti['alimentazione-auto'].id)">Edit domanda</b-button>
					<p class="mt-3">{{questions_spostamenti['emissioni-auto'].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-amb_class size="sm" @click.prevent="editQuestion(questions_spostamenti['emissioni-auto'].id)">Edit domanda</b-button>
					<p class="mt-3">{{questions_spostamenti['cilindrata-auto'].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-cc_auto size="sm" @click.prevent="editQuestion(questions_spostamenti['cilindrata-auto'].id)">Edit domanda</b-button>
				</b-card>
			</b-collapse>
		</div>
		<br/>
		<div>
			<b-button block v-b-toggle.collapse-bici variant="primary">Bici</b-button>
			<b-collapse id="collapse-bici" class="mt-2">
				<b-card>
				<label class="mt-2">Editare nome</label>
				<b-form-input class="mt-2" id="mapqs.meansOfTransport.Bike" v-model="mapqs.meansOfTransport.Bike" trim></b-form-input>
				<p class="mt-3">{{questions_spostamenti['tipo-bici'].description}}</p>
				<b-button class="mt-0" v-b-toggle.collapse-sel_type_bike size="sm" @click.prevent="editQuestion(questions_spostamenti['tipo-bici'].id)" >Edit domanda</b-button>
				<div class="text-danger mt-2">
					<i aria-hidden="true" class="fa fa-exclamation-triangle "></i>
					<span><b>&nbsp;NON</b> modificare il tipo della sottodomanda, potresti compromettere il funzionamento della&nbsp;domanda&nbsp;mappa</span>
				</div>
				</b-card>
			</b-collapse>
		</div>
		<br/>
		<div>
			<b-button block v-b-toggle.collapse-moto variant="primary">Moto</b-button>
			<b-collapse id="collapse-moto" class="mt-2">
				<b-card>
					<label class="mt-2">Editare nome</label>
					<b-form-input class="mt-2" id="mapqs.meansOfTransport.Moto" v-model="mapqs.meansOfTransport.Moto" trim></b-form-input>
					<p class="mt-3">{{questions_spostamenti['tipo-moto'].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-sel_type_auto size="sm" @click.prevent="editQuestion(questions_spostamenti['tipo-moto'].id)" >Edit domanda</b-button>
					<div class="text-danger mt-2">
						<i aria-hidden="true" class="fa fa-exclamation-triangle "></i>
						<span><b>&nbsp;NON</b> modificare il tipo della sottodomanda, potresti compromettere il funzionamento della&nbsp;domanda&nbsp;mappa</span>
					</div>
					<p class="mt-3">{{questions_spostamenti['alimentazione-moto'].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-sel_type_Personal size="sm" @click.prevent="editQuestion(questions_spostamenti['alimentazione-moto'].id)">Edit domanda</b-button>
					<p class="mt-3">{{questions_spostamenti['emissioni-moto'].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-car_fueling size="sm" @click.prevent="editQuestion(questions_spostamenti['emissioni-moto'].id)">Edit domanda</b-button>
					<p class="mt-3">{{questions_spostamenti['cilindrata-moto'].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-amb_class size="sm" @click.prevent="editQuestion(questions_spostamenti['cilindrata-moto'].id)">Edit domanda</b-button>
					
				</b-card>
			</b-collapse>
		</div>
		<br/>
		<div>
			<b-button block v-b-toggle.collapse-metro variant="primary">Metro</b-button>
			<b-collapse id="collapse-metro" class="mt-2">
				<b-card>
					<label class="mt-2">Editare nome</label>
					<b-form-input class="mt-2" id="mapqs.meansOfTransport.Metro" v-model="mapqs.meansOfTransport.Metro" trim></b-form-input>
					</b-card>
			</b-collapse>
		</div>
		<br/>
		<div>
			<b-button block v-b-toggle.collapse-piedi variant="primary">Piedi</b-button>
			<b-collapse id="collapse-piedi" class="mt-2">
				<b-card>
					<label class="mt-2">Editare nome</label>
					<b-form-input class="mt-2" id="mapqs.meansOfTransport.On_foot" v-model="mapqs.meansOfTransport.On_foot" trim></b-form-input>
					</b-card>
			</b-collapse>
		</div>
		<br/>
		<div>
			<b-button block v-b-toggle.collapse-treno variant="primary">Treno</b-button>
			<b-collapse id="collapse-treno" class="mt-2">
				<b-card>
					<label class="mt-2">Editare nome</label>
					<b-form-input class="mt-2" id="mapqs.meansOfTransport.Train" v-model="mapqs.meansOfTransport.Train" trim></b-form-input>
					<p class="mt-3">{{questions_spostamenti['tipo-treno'].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-amb_class size="sm" @click.prevent="editQuestion(questions_spostamenti['tipo-treno'].id)">Edit domanda</b-button>
					<div class="text-danger mt-2">
						<i aria-hidden="true" class="fa fa-exclamation-triangle "></i>
						<span><b>&nbsp;NON</b> modificare il tipo della sottodomanda, potresti compromettere il funzionamento della&nbsp;domanda&nbsp;mappa</span>
					</div>
				</b-card>
			</b-collapse>
		</div>
		<br/>
		<div>
			<b-button block v-b-toggle.collapse-bus variant="primary">Bus/Tram</b-button>
			<b-collapse id="collapse-bus" class="mt-2">
				<b-card>
					<label class="mt-2">Editare nome</label>
					<b-form-input class="mt-2" id="mapqs.meansOfTransport.Bus/Tram" v-model="mapqs.meansOfTransport['Bus/Tram']" trim></b-form-input>
					</b-card>
			</b-collapse>
		</div>
		<br/>
		<div>
			<b-button block v-b-toggle.collapse-monopattino variant="primary">Monopattino</b-button>
			<b-collapse id="collapse-monopattino" class="mt-2">
				<b-card>
					<label class="mt-2">Editare nome</label>
					<b-form-input class="mt-2" id="mapqs.meansOfTransport.Scooter" v-model="mapqs.meansOfTransport.Scooter" trim></b-form-input>
					<p class="mt-3">{{questions_spostamenti['tipo-monopattino'].description}}</p>
					<b-button class="mt-0" v-b-toggle.collapse-amb_class size="sm" @click.prevent="editQuestion(questions_spostamenti['tipo-monopattino'].id)">Edit domanda</b-button>	
					<div class="text-danger mt-2">
						<i aria-hidden="true" class="fa fa-exclamation-triangle "></i>
						<span><b>&nbsp;NON</b> modificare il tipo della sottodomanda, potresti compromettere il funzionamento della&nbsp;domanda&nbsp;mappa</span>
					</div>
				</b-card>
			</b-collapse>
		</div>

		<label class="mt-2">Disclaimer lunghezza massima</label>
		<b-form-input class="my-1 h-auto overflow-hidden" id="mapqs.set_distance" v-model="mapqs.set_distance" ></b-form-input>

		<label class="mt-2">Disclaimer costo massimo</label>
		<b-form-input class="my-1 h-auto overflow-hidden" id="mapqs.set_cost" v-model="mapqs.set_cost" ></b-form-input>

	
	<br />
	<b-row>
		<b-col>
			<b-button variant="primary" @click="hideOffice((avanti = false))">{{ mapqs.back }}</b-button>
		</b-col>
		<b-col class="text-right">
			<b-button
			:disabled="valMeans"
			variant="success"
			@click="$emit('save')">
			{{ mapqs.next_continue }}
			<i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
			</b-button>
		</b-col>
	</b-row>

    </div>
  </div>
</template>

<script>
import UserService from "@/services/user.service";
//import _ from "lodash";
import { latLng, marker, polyline } from "leaflet";
import "leaflet-editable/src/Leaflet.Editable.js";
import "leaflet-textpath/leaflet.textpath.js";
import L from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import Util from "@/mixing/util";
import questionAddMean from "@/components/QuestionAddMean";
import "animate.css";
// import mapqs from  "@/data/map-question-strings.js";

const POLYLINE_COLOR = "#00aaff";
//const INTERCHANGE_POINT_COLOR = "#005f8f";
const EDIT_POLYLINE_COLOR = "#ffaa00";

const companyIcon = L.divIcon({
	html: "<div class=\"icon-circle-container\"><i class=\"fa fa-building-o fa-3x\" style=\"color:#222; position:relative; left:-3px; top:4px\"></i></div>",
	iconSize: [20, 20],
	className: "myDivIcon",
	iconAnchor: [30, 40],
});

const homeIcon = L.divIcon({
	// se lo stile non è inline non lo prende
	html: "<div class=\"icon-circle-container\" style=\"\"><i class=\"fa fa-home fa-3x\" style=\"color:#222; position:relative; left:-6px; top:4px\"></i></div>",
	iconSize: [20, 20],
	className: "myDivIcon",
	iconAnchor: [30, 40],
});

const cancelIcon = L.divIcon({
	html: "<i class=\"fa fa-times-circle fa-2x\" style=\"color:red\"></i>",
	iconSize: [20, 20],
	className: "myDivIcon",
	iconAnchor: [-20, 40],
});

const interchangePointIcon = L.divIcon({
	html: "<div class=\"icon-circle-container\" style=\"\"><i class=\"fa fa-map-marker fa-3x\" style=\"color:#222; position:relative; top:3px\"></i></div>",
	iconSize: [20, 20],
	className: "myDivIcon",
	iconAnchor: [10, 30],
});

// non uso leaflet draw perchè non è più mantenuto (360+ issues fermo da un anno)
// non uso leaflet geoman perchè troppo complicato (impossibile emulare lo spinning della versione pro - che costa 10k all'anno -  con gli eventi a disposizione, complessi e senza documentazione)
// uso leaflet editable che ha tutto quello che serve ed è friendly

export default {
	name: "map-question",
	mixins: [Util],
	props: {
		survey_id: [String, Number],
		answer: Array,
		language: String,
		mapqs_ori: Object,
		questions: Array,
		map_id: Number,
	},
	components: {
		LMap,
		LTileLayer,
		questionAddMean,
	},
	watch: {
		"casa.latLng": function () {
			this.buildCurrResponse();
		},
		"sedeLavoro.latLng": function () {
			this.buildCurrResponse();
		},
		meanAnswers: function () {
			this.buildCurrResponse();
		},
		features: function () {
			this.currInterchangeStep = this.getCurrInterchangeStep();
			console.log("currInter: " + this.currInterchangeStep);
			this.pathCompleted = false;
			if (this.features.length) {
				const lastFeature = this.features[this.features.length - 1];
				if (lastFeature._path !== undefined) {
					const latLngs = lastFeature.getLatLngs();
					if (
						latLngs[latLngs.length - 1].lat == this.sedeLavoro.latLng.lat &&
            latLngs[latLngs.length - 1].lng == this.sedeLavoro.latLng.lng
					) {
						this.pathCompleted = true;
					}
				}
			}
		},
		step: function () {
			if (this.step == 3 && this.sedeLavoro.latLng && this.casa.latLng) {
				console.log("print step 3");
				setTimeout(() => this.initMapSpostamento(), 500); // attendi un po' affinchè la mappa venga rendered e la relativa reference sia disponibile
			}
		},
	},
	data() {
		return {
			displayAddButton: false,
			zoom: 15,
			center: latLng(45.4654219, 9.1859243),
			currentZoom: 11.5,
			currentCenter: latLng(45.4654219, 9.1859243),
			wms_layers_selezionati: ["CarSharing", "BikeSharing", "P-Ciclabili"],
			casa: {
				address: "",
			},
			// mapqs: this.mapqs,
			// mapqs: {},
			sedeLavoro: {},
			features: ["primo"],
			casaMarker: null,
			sedeLavoroMarker: null,
			meanAnswers: [],
			meansOfTransport: [
				{
					name: "Bike",
					label: "Bici",
					icon: {
						name: "bicycle",
						unicode: "\uf206",
						left: -10,
					},
				},
				{
					name: "Bus/Tram",
					label: "Bus/Tram",
					icon: {
						name: "bus",
						unicode: "\uf207",
						left: 0,
					},
				},
				{
					name: "Auto",
					label: "Auto",
					icon: {
						name: "car",
						unicode: "\uf1b9",
						left: -10,
					},
				},
				{
					name: "Train",
					label: "Treno",
					icon: {
						name: "train",
						unicode: "\uf238",
						left: -5,
					},
				},
				{
					name: "Moto",
					label: "Moto",
					icon: {
						name: "motorcycle",
						unicode: "\uf21c",
						left: -10,
					},
				},
				{
					name: "Metro",
					label: "Metro",
					icon: {
						name: "subway",
						unicode: "\uf239",
						left: -5,
					},
				},
				{
					name: "On_foot",
					label: "Piedi",
					icon: {
						name: "male",
						unicode: "\uf183",
						left: 0,
					},
				},
				{
					name: "Scooter",
					label: "Monopattino",
					png: require("@/assets/img/scooter_elec.png"),
				},
			],
			selectedMeanOfTransport: null,
			drawInterchangePoint: false,
			stepStrings: [
				"PRIMO",
				"SECONDO",
				"TERZO",
				"QUARTO",
				"QUINTO",
				"SESTO",
				"SETTIMO",
				"OTTAVO",
				"NONO",
				"DECIMO",
				// ... se ce ne sono altri visualizzo un generico 'PROSSIMO'
			],
			selectedInterchangePointForRemoval: null,
			currInterchangeStep: "",
			geocodingTimeoutId: null,
			geocodingHome: false,
			geocodingFailed: false,
			step: 1,
			offices: [],
			sedeLavoroId: null,
			selTransportmean: null,
			pathCompleted: false,
			key:1,
			errors: [],
			type_auto: JSON.parse(process.env.VUE_APP_TYPE_AUTO),
			type_personale: JSON.parse(process.env.VUE_APP_PERSONALE),
			// type_auto:["Personale","Taxi", "Car sharing",  "Navetta aziendale", "Car pooling"],
			type_moto:[{
					name: "Personale",
					label: "Personale",
			},
			{
					name: "Moto sharing",
					label: "Moto sharing",
			},],
			type_bike:[{
					name: "Personale",
					label: "Personale",
			},
			{
					name: "Bike sharing",
					label: "Bike sharing",
			},],
			type_treno:[{
					name: "Servizio ferroviario Trenitalia/GTT",
					label: "Servizio ferroviario Trenitalia/GTT",
			},
			{
					name: "Servizio ferroviario altri vettori (Trenord, Italo, Alta Velocità, ...)",
					label: "Servizio ferroviario altri vettori (Trenord, Italo, Alta Velocità, ...)",
			},],
			type_mono:[{
					name: "Personale",
					label: "Personale",
			},
			{
					name: "Monopattino sharing",
					label: "Monopattino sharing",
			},],
			emissioni_auto: null,
			emissioni_moto: null,
			cilindratauto: null,
			cilindratamoto: null,
			alimentazioneauto: null,
			alimentazionemoto: null,
			tipoauto: null,
			personaleauto: null, 
			tipobici: null, 
			tipomoto: null, 
			tipomonopattino: null,
			questions_spostamenti: {},
		};
	},
	computed: {
		selectedWmsLayers: function () {
			return this.wms_layers_selezionati.join(",");
		},
		valMeans(){
			let res=false;
			function checkDis(selmean) {
				if(selmean.selTransportmean === 'Piedi'){
					return selmean.distance>0 && selmean.distance.length<=5;
				}else if(selmean.selTransportmean=== 'Bici' ){
					if(selmean.type_bike === 'Bike sharing'){
						return selmean.distance>0 && selmean.distance.length<=5 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_bike;
					}else{
						return selmean.distance>0 && selmean.distance.length<=5 && selmean.type_bike;
					}
					
				}else{
					if(selmean.selTransportmean=== 'Monopattino'){
						return (selmean.distance>0 && selmean.distance.length<=5 && selmean.cost>=0 && selmean.cost<=10000   && selmean.type_mono);	
					}else if(selmean.selTransportmean=== 'Treno'){
						return (selmean.distance>0 && selmean.distance.length<=5 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_treno);	
					}else if(selmean.selTransportmean=== 'Auto'){
						if(selmean.type_auto === 'Personale'){
							return selmean.distance>0 && selmean.distance.length<=5 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_auto && 
							selmean.emissioni_auto && selmean.cilindratauto && selmean.alimentazioneauto;
						}else{
							return selmean.distance>0 && selmean.distance.length<=5 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_auto;
						}	
					}else if(selmean.selTransportmean=== 'Moto'){
						if(selmean.type_moto === 'Personale'){
							return selmean.distance>0 && selmean.distance.length<=5 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_moto && 
							selmean.emissioni_moto && selmean.cilindratmoto && selmean.alimentazionemoto;
						}else{
							return selmean.distance>0 && selmean.distance.length<=5 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_moto;
						}	
					}else{
						return selmean.distance>0 && selmean.distance.length<=5 && selmean.cost>=0 && selmean.cost<=10000 ;
					}
									
				}
				
			}
			if (this.meanAnswers.length){
				let dis=this.meanAnswers.every(checkDis);
				res=dis;
			}
			
			return !res;
		},
		mapqs: function () {
			console.log("mapqs");
			this.meansOfTransport.forEach((t)=>{
					t.label = this.mapqs_ori[this.language]['meansOfTransport'][t.name]
					
				});
			this.stepStrings=this.mapqs_ori[this.language]['stepStrings'];
			return this.mapqs_ori[this.language];
		},
	},
	methods: {
		clickCasa(e) {
			this.casa.latLng = e.latlng;
			if (this.casaMarker) {
				this.$refs.map.mapObject.removeLayer(this.casaMarker);
			}
			this.casaMarker = marker(this.casa.latLng, {
				icon: homeIcon,
				draggable: true, // permetto all'utente di correggere la posizione all'occorrenza
			}).addTo(this.$refs.map.mapObject);
		},
		disState(i) {
			return (this.meanAnswers[i].distance > 0 && this.meanAnswers[i].distance.length <= 5);
		},
		cosState(i) {
			return (this.meanAnswers[i].cost >= 0  && this.meanAnswers[i].cost <= 100000);
		},
		inputalimentazuineauto(index=null){
			if(index !== null){
				const searchTerm = /Elettrico|Ibrido|electric|hybrid/i;

				if (searchTerm.test(this.meanAnswers[index].alimentazioneauto)) {
				console.log("The string contains one of the search terms.");
				console.log("emissioni options",this.emissioni_auto.options);
				this.meanAnswers[index].emissioni_auto = this.emissioni_auto.options[0];
				this.meanAnswers[index].cilindratauto = this.cilindratauto.options[0];
				
				} else {
				console.log("The string does not contain any of the search terms.");
				this.meanAnswers[index].emissioni_auto = this.emissioni_auto.options[1];
				this.meanAnswers[index].cilindratauto = this.cilindratauto.options[1];
				}
			} 
		},
		inputalimentazuinemoto(index=null){
			if(index !== null){
				const searchTerm = /Elettrico|Ibrido|electric|hybrid/i;

				if (searchTerm.test(this.meanAnswers[index].alimentazionemoto)) {
				console.log("The string contains one of the search terms.");
				console.log("emissioni options",this.emissioni_moto.options);
				this.meanAnswers[index].emissioni_moto = this.emissioni_moto.options[0];
				this.meanAnswers[index].cilindratmoto = this.cilindratamoto.options[0];
				
				} else {
				console.log("The string does not contain any of the search terms.");
				this.meanAnswers[index].emissioni_moto = this.emissioni_moto.options[1];
				this.meanAnswers[index].cilindratmoto = this.cilindratamoto.options[1];
				}
			} 
		},

		buildCurrResponse() {
			
			
			this.$emit(
				"response-changed",
				JSON.stringify({
					origin: {
						address: this.casa.address,
						postal_code: this.casa.postal_code,
						city: this.casa.city,
						province: this.casa.province,
						lat: this.casa.latLng ? this.casa.latLng.lat : null,
						lon: this.casa.latLng ? this.casa.latLng.lng : null,
					},
					destination: {
						office_id: this.sedeLavoro.id,
						office_name: this.sedeLavoro.name,
					},
					modes: this.meanAnswers,
					geojson: {
						type: "FeatureCollection",
						features: this.features
							.filter((feature) => feature._path != undefined)
							.map((feature) => ({
								type: "Feature",
								properties: {
									mean: feature.meanOfTransport,
								},
								geometry: {
									type: "LineString",
									coordinates: feature
										.getLatLngs()
										.map((aLatLng) => [aLatLng.lng, aLatLng.lat]),
								},
							})),
					},
				})
			);
		},

		hideOffice(avanti) {
			if (this.offices.length == 1) {
				this.sedeLavoro = this.offices[0];
				console.log("office");
				console.log(this.sedeLavoro);
				if (avanti) {
					this.step = 3;
				} else {
					this.step = 1;
					this.$emit("back");
				}
			} else {
				this.step = 2;
			}
			console.log("office size:");
			console.log(this.offices);
		},

		setSedeLavoro() {
			this.sedeLavoro = this.offices.find(
				(office) => office.id == this.sedeLavoroId
			);
			console.log("office");
			console.log(this.sedeLavoro);
			setTimeout(() => this.initMapSpostamento(), 500); // attendi un po' affinchè la mappa venga rendered e la relativa reference sia disponibile
		},
		reset(index) {
			console.log("lock modes");
			console.log(index);
			this.features.pop();
			this.meanAnswers.splice(index, 1);
			console.log(this.meanAnswers);
		},

		geocodeHome() {
			if (this.casaMarker) {
				this.$refs.map.mapObject.removeLayer(this.casaMarker);
			}
			this.geocodingFailed = false;
			if (this.geocodingTimeoutId) {
				clearTimeout(this.geocodingTimeoutId);
				this.geocodingTimeoutId = null;
			}
			this.geocodingTimeoutId = setTimeout(async () => {
				try {
					let response;
					this.geocodingHome = true;
					[this.casa.latLng, response] = await UserService.geoCode({
						city: this.casa.city,
						province: this.casa.province,
						address: this.casa.address,
						postal_code: this.casa.postal_code,
					});

					this.casa.city = response.data.city;
					this.casa.province = response.data.province;
					this.casa.address = response.data.address;
					this.casa.postal_code = response.data.postal_code;
					// li creo tutti in modo "raw" perchè poi li devo gestire
					this.casaMarker = marker(this.casa.latLng, {
						icon: homeIcon,
						draggable: true, // permetto all'utente di correggere la posizione all'occorrenza
					}).addTo(this.$refs.map.mapObject);
					this.$refs.map.mapObject.flyTo(this.casa.latLng, this.zoom);
				} catch (e) {
					this.geocodingFailed = true;
					console.log("print error:");
					console.log(e);
				} finally {
					this.geocodingHome = false;
					this.geocodingTimeoutId = null;
				}
			}, 800);
		},
		getCurrInterchangeStep() {
			console.log("print feature");
			console.log(this.features);
			let currInterchangePointsNum =
        this.features.filter((feature) => feature._path === undefined).length -
        1; // -1 considera il punto di partenza
			console.log(currInterchangePointsNum);
			if (currInterchangePointsNum < 0) {
				return "";
			}
			if (this.stepStrings.length < currInterchangePointsNum) {
				return mapqs.PROSSIMO;
			}
			return this.stepStrings[currInterchangePointsNum];
		},
		selectMeanOfTransport(mean) {
			this.displayAddButton = true;
			this.selectedMeanOfTransport = mean;
			//this.meanAnswers.selTransportmean = mean.name;
			console.log(this.selTransportmean);
			this.features.push(mean);
			if (mean.name != "Auto" || mean.name != "Moto") {
				this.meanAnswers.push({
					selTransportmean: mean.name,
					distance: "",
					cost: 0,
				});
			} else {
				this.meanAnswers.push({
					selTransportmean: mean.name,
					distance: "",
					cost: "",
					emissioni_auto: "",
					emissioni_moto: "",
					cilindratauto: "",
					cilindratmoto: "",
					alimentazioneauto: "",
					alimentazionemoto: "",
					tipoauto: "",
					personaleauto: "",
					tipobici: "",
					tipomoto: "",
					tipotreno:"",
					tipomonopattino: "",
				});
			}
			console.log("print meanAns: ");

			console.log(this.meanAnswers);
			//this.drawInterchangePoint = true;
			// this.$bvToast.toast(
			// 	`Fai click sulla mappa indicando il punto dove cambi mezzo
			//     (non è necessario che sia super-preciso).
			//     Se usi questo mezzo fino a destinazione, fai click sull'icona dell'azienda`,
			// 	{
			// 		title: `Tratta ${mean.name}`,
			// 		autoHideDelay: 5000,
			// 		solid: true,
			// 		variant: "warning",
			// 	}
			// );
		},
		equalmeans(mean) {
			for (let selmean of this.meanAnswers) {
				if(selmean.selTransportmean==mean.name){
					return true;
				}
			}
		},
		zoomUpdate(zoom) {
			this.currentZoom = zoom;
		},
		centerUpdate(center) {
			this.currentCenter = center;
		},
		// per vari problemi legati al pinning che non è automatico questa è l'unica logica funzionante:
		// - non posso trascinare gli estremi di una polyline, se voglio trascinarli trascinerò il corrispondente marker
		// - per far ciò disabiliterò nel mentre qualunque edit
		// - selezionando una polyline (come già detto) posso spostare (editare) solo i punti intermedi
		// - selezionando un marker seleziono in edit la polyline precedente (per convenzione) ma (come già detto) disabilito
		//   l'edit durante il dragging del marker
		addInterchangePolyline(point) {
			var newPolyline = polyline(
				[
					[
						this.features[this.features.length - 1].getLatLng().lat,
						this.features[this.features.length - 1].getLatLng().lng,
					],
					point,
				],
				{
					color: POLYLINE_COLOR,
				}
			)
				.on("click", (e) => {
					this.disableEditOfPolylines();
					this.editPolyline(e.target);
				})
				.on("editable:vertex:dragend", (e) => {
					this.updatePolylineLength(e.target);
					this.buildCurrResponse();
				})
				.addTo(this.$refs.map.mapObject);
			// aggiungo proprietà custom per il text path
			newPolyline.unicodePathIcon = this.selectedMeanOfTransport.icon.unicode;
			newPolyline.meanOfTransport = this.selectedMeanOfTransport.name;
			// abilita l'edit sulla nuova polyline
			this.disableEditOfPolylines();
			this.editPolyline(newPolyline);
			this.updatePolylineLength(newPolyline);

			this.features.push(newPolyline);
		},

		updatePolylineLength(aPolyline) {
			const plLatLngs = aPolyline.getLatLngs();
			let distanceInM = 0;
			for (let i = 1; i < plLatLngs.length; i++) {
				distanceInM += latLng(
					plLatLngs[i - 1].lat,
					plLatLngs[i - 1].lng
				).distanceTo(latLng(plLatLngs[i].lat, plLatLngs[i].lng));
			}
			aPolyline.setText(null, {}); // trick per resettare il testo
			aPolyline.setText(null, {}); // trick per resettare il testo (due volte perchè ci sono due testi)

			// nota: se non dovessi aggiornare periodicamente il testo l'ordine corretto sarebbe prima il chilometraggio e
			// dopo il testo ripetuto (icone) perchè diversamente le icone non verrebbe aggiunte modificando il path.
			// Dato che invece aggiorno sempre il testo ri-disegnandolo è corretto l'inverso (anche perchè diversamente
			// il chilometraggio non verrebbe aggiornato ma sempre aggiunto uno sopra l'altro!)
			aPolyline.setText(`    ${aPolyline.unicodePathIcon}    `, {
				repeat: true,
				center: false,
				offset: -5,
				orientation: "auto",
				turnedText: true,
				attributes: {
					fill: "#000", //INTERCHANGE_POINT_COLOR,
					"font-size": "24",
					"font-family": "FontAwesome",
				},
			});

			aPolyline.setText(`${(distanceInM / 1000).toFixed(2)} km`, {
				repeat: false,
				center: false,
				offset: 30,
				orientation: "auto",
				attributes: {
					fill: "#000",
					"font-size": "16",
					"font-weight": "bold",
				},
			});
		},

		addCancelIcon(aMarker) {
			if (aMarker.cancelIcon) {
				this.$refs.map.mapObject.removeLayer(aMarker.cancelIcon);
			}

			var cancelIconMarker = marker(aMarker.getLatLng(), {
				icon: cancelIcon,
			})
				.on("click", () => {
					this.selectedInterchangePointForRemoval = aMarker;
					this.$bvModal.show("bv-modal-confirm-delete");
				})
				.addTo(this.$refs.map.mapObject);
			// aggiungi una reference al marker (devo cancellare l'icona se comincio a fare drag)
			aMarker.cancelIcon = cancelIconMarker;
		},

		removeSelectedInterchangePoint() {
			if (this.selectedInterchangePointForRemoval == null) {
				return;
			}
			// rimuovo tutto a valle di questo punto, compreso il punto stesso e la polyline prima di lui
			const index = this.features.indexOf(
				this.selectedInterchangePointForRemoval
			);
			for (let i = this.features.length - 1; i >= index - 1; i--) {
				if (i >= 0) {
					if (this.features[i].cancelIcon) {
						// rimuovi il pulsante di cancellazione
						this.$refs.map.mapObject.removeLayer(this.features[i].cancelIcon);
					}
					this.$refs.map.mapObject.removeLayer(this.features[i]);
					this.features.pop();
				}
			}
			this.selectedInterchangePointForRemoval = null;
			this.$bvModal.hide("bv-modal-confirm-delete");
		},

		clearAll() {
			// rimuovi tutte le features (tranne la prima che è il punto di partenza)
			for (let i = 1; i < this.features.length; i++) {
				if (this.features[i].cancelIcon) {
					// rimuovi il pulsante di cancellazione
					this.$refs.map.mapObject.removeLayer(this.features[i].cancelIcon);
				}
				this.$refs.map.mapObject.removeLayer(this.features[i]);
			}
			this.features = [this.features[0]];
			this.$bvModal.hide("bv-modal-confirm-delete-all");
		},

		disableEditOfPolylines() {
			this.features.forEach((feature) => {
				if (feature._path) {
					// non c'è un modo più furbo di capire di che tipo è l'oggetto? (nota: instanceof non funziona perchè sono plain objects)
					feature.disableEdit();
					feature.setStyle({
						color: POLYLINE_COLOR,
						weight: 6,
					});
				}
			});
		},

		editPolyline(aPolyline) {
			aPolyline.enableEdit();
			aPolyline.setStyle({
				color: EDIT_POLYLINE_COLOR,
				weight: 9,
			});
			// non permettere il dragging degli estremi
			const plLatLngs = aPolyline.getLatLngs();
			plLatLngs[0].__vertex.dragging.disable();
			plLatLngs[plLatLngs.length - 1].__vertex.dragging.disable();
			// trick per nascondere anche graficamente gli estremi (così l'utente non si confonde)
			plLatLngs[0].__vertex.setLatLng(latLng(0, 0));
			plLatLngs[plLatLngs.length - 1].__vertex.setLatLng(latLng(0, 0));
		},

		addInterchangePoint() {
			this.drawInterchangePoint = true;
		},

		initMapSpostamento() {
			// potrei aver fatto avanti e indietro tra gli step, resetta
			this.clearAll();
			if (this.casaMarker) {
				this.$refs.map.mapObject.removeLayer(this.casaMarker);
			}
			if (this.sedeLavoroMarker) {
				this.$refs.map.mapObject.removeLayer(this.sedeLavoroMarker);
			}
			// li creo tutti in modo "raw" perchè poi li devo gestire
			this.casaMarker = marker(this.casa.latLng, {
				icon: homeIcon,
				draggable: true, // permetto all'utente di correggere la posizione all'occorrenza
			}).addTo(this.$refs.map.mapObject);

			this.sedeLavoroMarker = marker(this.sedeLavoro.latLng, {
				icon: companyIcon,
			}).addTo(this.$refs.map.mapObject);

			this.features = [this.casaMarker];

			this.$refs.map.mapObject.fitBounds([
				this.casa.latLng,
				this.sedeLavoro.latLng,
			]);
		},
		updateOfficeQuestion() {
			UserService.updateOfficeQuestion(this.survey_id, this.offices);
		},
		editQuestion(question_id) {
			this.$emit("edit-question", question_id,this.map_id);
		},
		
	},
	async created() {
		try {
			let response = await UserService.getOfficesForSurvey(this.survey_id);	
			console.log("print questions",this.questions);	
			// TODO: rendere parametrici
			// this.emissioni_auto=this.questions.filter(
			// 		(element) => element.name == "emissioni-auto"
			// 	)[0];
			// // translate emissioni_auto
			// this.emissioni_auto=await this.getTranslation(this.emissioni_auto);
			// this.emissioni_moto=this.questions.filter(
			// 	(element) => element.name == "emissioni-moto"
			// )[0];
			// // translate emissioni_moto
			// this.emissioni_moto=await this.getTranslation(this.emissioni_moto);
			// this.cilindratauto=this.questions.filter(
			// 	(element) => element.name == "cilindrata-auto"
			// )[0];
			// // translate cilindratauto
			// this.cilindratauto=await this.getTranslation(this.cilindratauto);
			// this.cilindratamoto=this.questions.filter(
			// 	(element) => element.name == "cilindrata-moto"
			// )[0];
			// // translate cilindratamoto
			// this.cilindratamoto=await this.getTranslation(this.cilindratamoto);
			// this.alimentazioneauto=this.questions.filter(
			// 	(element) => element.name == "alimentazione-auto"
			// )[0];
			// // translate alimentazioneauto
			// this.alimentazioneauto=await this.getTranslation(this.alimentazioneauto);
			// this.alimentazionemoto=this.questions.filter(
			// 	(element) => element.name == "alimentazione-moto"
			// )[0];
			// // translate alimentazionemoto
			// this.alimentazionemoto=await this.getTranslation(this.alimentazionemoto);
			// this.tipoauto=this.questions.filter(
			// 	(element) => element.name == "tipo-auto"
			// )[0];
			// // translate tipoauto
			// this.tipoauto=await this.getTranslation(this.tipoauto);
			// console.log("tipoauto", this.tipoauto);
			// this.personaleauto=this.questions.filter(
			// 	(element) => element.name == "personale-auto"
			// )[0];
			// // translate personaleauto
			// this.personaleauto=await this.getTranslation(this.personaleauto);
			// this.tipobici=this.questions.filter(
			// 	(element) => element.name == "tipo-bici"
			// )[0];
			// // translate tipobici
			// this.tipobici=await this.getTranslation(this.tipobici);
			// this.tipomoto=this.questions.filter(
			// 	(element) => element.name == "tipo-moto"
			// )[0];
			// // translate tipomoto
			// this.tipomoto=await this.getTranslation(this.tipomoto);
			// console.log("print tipomoto",this.tipomoto);
			// this.tipotreno=this.questions.filter(
			// 	(element) => element.name == "tipo-treno"
			// )[0];
			// // translate tipotreno
			// this.tipotreno=await this.getTranslation(this.tipotreno);
			// this.tipomonopattino=this.questions.filter(
			// 	(element) => element.name == "tipo-monopattino"
			// )[0];	
			// // translate tipomonopattino
			// this.tipomonopattino=await this.getTranslation(this.tipomonopattino);

			

			
			
			this.offices = response.data.offices
				.filter((office) => office.lat && office.lon)
				.map((office) => ({
					...office,
					latLng: latLng(office.lat, office.lon),
				}));

			//Aggiorno la domanda sede con le sedi di questa azienda
			this.updateOfficeQuestion(this.offices);
			console.log("print languages", this.language);
			let r = await UserService.getConfig('Questions');
			if(this.questions.filter(
					(element) => element.id == r.data.data.origine_spostamenti
					).length > 0){
						let rs = await UserService.getConfig('Questions_spos');
						// filter object by rs.data.data using foreach
						
						// Assuming rs.data.data is an object with question IDs as values
						Object.values(rs.data.data).forEach(questionId => {
							const question = this.questions.find(q => q.id == questionId);
							if (question) {
								// add to questions_spostamenti
								this.questions_spostamenti[question.name] =question;
							}
						});
					}
			console.log("questions_spostamenti", this.questions_spostamenti);
		} catch (e) {
			console.log("error created function:");
			console.log(e);
			this.$bvToast.toast("Errore nella creazione della domanda mappa", {
				title: "Attenzione!",
				autoHideDelay: 5000,
				solid: true,
				variant: "warning",
			});
		}
	},
};
</script>

<style>
.myDivIcon {
  text-align: center;
  /* Horizontally center the text (icon) */
  line-height: 20px;
  /* Vertically center the text (icon) */
}

.clear-btn {
  width: 100px;
  border: 0;
  background: #fff !important;
  color: #777 !important;
  white-space: nowrap;
}

.clear-btn:hover {
  width: 100px;
  border: 0;
  background: #bbb !important;
  color: #fff !important;
}

.selected-btn {
  width: 100px;
  border: 0;
  background: #777 !important;
  color: #fff !important;
  white-space: nowrap;
}

.icon-circle-container {
  border-radius: 50%;
  background: #ffff7f;
  display: inline-block;
  width: 45px;
  height: 45px;
  text-align: center;
}

/*rendi più visibili i vertici in editing*/
.leaflet-vertex-icon {
  width: 16px !important;
  height: 16px !important;
  margin-left: -8px !important;
  margin-top: -8px !important;
}
.leaflet-middle-icon {
  width: 16px !important;
  height: 16px !important;
  margin-left: -8px !important;
  margin-top: -8px !important;
}
.mezzo p {
	font-size: 10px;	
	text-align: center;
	margin-top: 0.5em;
	text-wrap: wrap;
}
.mezzo img {
	width: 35px;
}

</style>
