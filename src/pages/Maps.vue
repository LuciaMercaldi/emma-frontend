<template>
	<div style="width: 100%">
			
					<b-row>
						<b-col>
							<h6>Azienda o Scuola</h6>
							<b-form-group>
								<v-select size="sm" v-model="azienda" :options="aziende" label="name" id="company"></v-select>
							</b-form-group>
						</b-col>
						<b-col>
							<h6>Origine dei dati</h6>
							<b-form-group>
								<b-form-select size="sm" v-model="source" name="source" :options="sourceOptions" id="source"/>
							</b-form-group>
						</b-col>
					</b-row>
					<b-form-group label="Sede" v-if="uffici_azienda.length" id="sede">
						<b-row>
							<!-- <b-col><label>Sede</label></b-col> -->
							<b-col><b-form-checkbox v-model="selectAllOffices" @change="toggleAllOffices" id="checksede">Tutte le sedi</b-form-checkbox></b-col>
						</b-row>
						<b-form-select size="sm" v-model="office_id" :options="uffici_azienda" multiple value-field="id"
							text-field="name_address" v-if="uffici_azienda.length"></b-form-select>
						<p class="text-muted small"><i class="fa fa-info"></i> Per selezionare o deselezionare singole voci
							usate la combinazione CTRL+CLICK. Attenzione: se nel questionario non c'è la domanda che associa ad
							una specifica sede aziendale, quando filtri per sede ottieni risultati vuoti.</p>
					</b-form-group>
					<b-form-group label="Sede" v-if="sedi_scuole.length" id="sede">
						<b-row>
							<!-- <b-col><label>Sede</label></b-col> -->
							<b-col><b-form-checkbox v-model="selectAllOffices" @change="toggleAllOffices" id="checksede">Tutte le sedi</b-form-checkbox></b-col>
						</b-row>
						<b-form-select size="sm" v-model="office_id" :options="sedi_scuole" multiple value-field="id"
							text-field="name_address" v-if="sedi_scuole.length"></b-form-select>
						<p class="text-muted small"><i class="fa fa-info"></i> Per selezionare o deselezionare singole voci
							usate la combinazione CTRL+CLICK. Attenzione: se nel questionario non c'è la domanda che associa ad
							una specifica sede aziendale, quando filtri per sede ottieni risultati vuoti.</p>
					</b-form-group>

				<h6>Filtri</h6>
				<b-form-group v-if="source == 'answers'">
					<label>Elenco domande da usare come filtro</label>
					<v-select v-model="filterQuestionList" @input="updateFilterQuestionList()" :options="questionList"
						multiple />
				</b-form-group>
				<b-row>
					<template v-if="source == 'answers'">
						<b-col cols="4" v-for="filter in answerFilters" :key="filter.name">
							<b-form-group>
								<label>{{ filterName(filter) }}</label>
								<b-form-select size="sm" v-model="filter.value" :options="filterOptions(filter)"
									value-field="id" text-field="name"></b-form-select>
							</b-form-group>
						</b-col>
					</template>

					<template v-if="source == 'employees'">
						<b-col cols="4" v-for="filter in employeeFilters" :key="filter.name">
							<b-form-group>
								<label>{{ filterName(filter) }}</label>
								<b-form-select
									size="sm"
									v-model="filter.value"
									:options="filterOptions(filter)"
									value-field="id"
									text-field="name"></b-form-select>
							</b-form-group>
						</b-col>
					</template>
				</b-row>



		<b-form-row>
			<b-col>
				<b-form-group label="Livelli da visualizzare">
					<b-form-checkbox-group v-model="layers_selezionati" :options="altri_layer" ></b-form-checkbox-group>
				</b-form-group>
				<b-form-group label="Livelli informativi utili" v-if="canShowLivelliInformativi">
					<b-form-checkbox-group v-model="wms_layers_selezionati" :options="wms_layers"></b-form-checkbox-group>
				</b-form-group>
			</b-col>
			<b-col class=""><!-- WIP - filtro per anno-->
						<div class="float-right">
							<b-button-group size="md mt-4 ">
								<b-button type="button"class="btn-primary mr-2" to="/cartografia" id="btn-to-cartografia">
									<span><i class="ti-info-alt mr-1"></i>Cartografia</span>
								</b-button>
								<b-button type="button" @click="filterOrigins()" id="updateMap">
									<span v-if="loading">
										<b-spinner small type="grow"></b-spinner>
										Loading...
									</span>
									<span v-else> Aggiorna Mappa </span>
								</b-button>
								<b-dropdown right>
									<b-dropdown-item @click.prevent="download(`origins/index.xls?${composeQuerystring}`)">
										<i class="fa fa-download" aria-hidden="true"></i> Esporta XLS
									</b-dropdown-item>
									<b-dropdown-item @click.prevent="download(`origins/index.kml?${composeQuerystring}`)">
										<i class="fa fa-download" aria-hidden="true"></i> Esporta KML
									</b-dropdown-item>
								</b-dropdown>
							</b-button-group>
							<b-button 
								@click="toggleSecondMap"
								:variant="isActive ? 'danger' : 'info'"  
								:class="{ active: isActive }"
								class="mt-4 ml-1"
								id="toggleSecondMap"
								v-b-tooltip.hover 
								:title="isActive ? '' : 'Confronta i dati di altri xls/questionari'"
								variant="secondary"
								>
								{{ isActive ? 'Chiudi' : 'Confronto' }} <!-- Cambia il testo in base allo stato -->
							</b-button>
						</div>
					</b-col>
		</b-form-row>
		<div class="row">
			<div class="col">
				<div class="row">
					<b-col class=""><!-- WIP - filtro per anno-->
						<b-form-group v-if="source == 'employees'">
							<label>Anno:</label>
							<b-form-select size="md" v-model="year" name="year" :options="yearOptions" id="filterYear"/>
						</b-form-group>
						<b-form-group v-if="source == 'answers'">
							<label>Questionario:</label>
							<b-form-select size="sm" v-model="survey_id" name="survey_id" :options="surveyList" value-field="id" text-field="name" id="filterAnswers"/>
						</b-form-group>
					</b-col>
					
				</div>
				
				<div id="map-container">
					<div id="spinner-container" class="text-center" v-if="loading">
						<b-spinner id="spinner" variant="success" label="Spinning"></b-spinner>
					</div>
					
					<l-map id="my-map" v-if="showMap" :zoom="zoom" :center="center" :options="getMapOptions"
						@update:center="centerUpdate" @update:zoom="zoomUpdate" ref="map">
						<l-tile-layer :url="getTilesUrl" :attribution="getMapAttribution" :options="getLayerOptions" />

						<v-marker-cluster v-if="layers_selezionati.includes('employees')">
							<l-circle-marker :key="origin.id" v-for="origin in origins" :lat-lng="origin.center"
								:radius="origin.radius" :color="origin.color" className="origin" @click="openOrigin(origin.id)" />
						</v-marker-cluster>

						<span v-if="(layers_selezionati.includes('offices') || layers_selezionati.includes('coworking')) && uffici_azienda.length > 0">
							<l-marker v-for="office in uffici_azienda" :key="office.id" :lat-lng="[office.lat, office.lon]"
								:icon="companyIcon(office.coworking)" :options="{ title: office.name }">
								<l-popup ><strong>{{ office.company.name }}</strong><br><b-link
									:to="`/offices/edit/${office.id}`"  :disabled="!(loggedUserIsMomaArea || loggedUserIsAdmin)">{{ office.name }}</b-link>
									<div v-for="cow in office.info_coworking">
										<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">{{ cow.type }}</strong>
										<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">Sale: {{ cow.sale }}</strong>
										<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">Costo: {{ cow.costo }} €</strong>
										<br><b-link
										v-if="office.coworking == 1 && office.info_coworking!=null" :to="cow.link">Prenotazione</b-link>
									</div>
								</l-popup>
							</l-marker>
						</span>
						<span v-if="(layers_selezionati.includes('offices') || layers_selezionati.includes('coworking')) && uffici_azienda.length == 0">
							<l-marker v-for="office in offices_layer" :key="office.id" :lat-lng="[office.lat, office.lon]"
								:icon="companyIcon(office.coworking)" :options="{ title: office.name }">
								<l-popup ><strong>{{ office.company.name }}</strong><br><b-link
									:to="`/offices/edit/${office.id}`"  :disabled="!(loggedUserIsMomaArea || loggedUserIsAdmin)">{{ office.name }}</b-link>
									<div v-for="cow in office.info_coworking">
										<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">{{ cow.type }}</strong>
										<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">Sale: {{ cow.sale }}</strong>
										<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">Costo: {{ cow.costo }} €</strong>
										<br><b-link
										v-if="office.coworking == 1 && office.info_coworking!=null" :to="cow.link">Prenotazione</b-link>
									</div>
								</l-popup>
							</l-marker>
						</span>
						<span v-if="layers_selezionati.includes('schools') && sedi_scuole.length > 0">
							<l-marker v-for="school in sedi_scuole" :key="school.id" :lat-lng="[school.lat, school.lon]"
								:icon="schoolIcon" :options="{ title: school.name }">
								<l-popup><strong>{{ school.company.name }}</strong><br><b-link
									:to="`/offices/edit/${school.id}`">{{ school.name }}</b-link>
								</l-popup>
							</l-marker>
						</span>
						<span v-if="layers_selezionati.includes('schools') && sedi_scuole.length == 0">
							<l-marker v-for="school in schools_layer" :key="school.id" :lat-lng="[school.lat, school.lon]"
								:icon="schoolIcon" :options="{ title: school.name }">
								<l-popup><strong>{{ school.company.name }}</strong><br><b-link
									:to="`/offices/edit/${school.id}`">{{ school.name }}</b-link>
								</l-popup>
							</l-marker>
						</span>

						<l-wms-tile-layer :key="wmsRenderKey"
							base-url="http://geomap.reteunitaria.piemonte.it/ws/siccms/coto-01/wmsg01/wms_sicc124_mobilita"
							:visible="true" :layers="selectedWmsLayers" :transparent="true" format="image/png">
						</l-wms-tile-layer>
					</l-map>
				</div>
			</div>
			<div class="col ml-2" v-if="showMap && showSecondMap">
				<b-col class="pl-0 pr-0"><!-- WIP - filtro per anno confronto -->
					<b-col class="px-0"><!-- WIP - filtro per anno-->
						<b-form-group v-if="source == 'employees'" >
							<label>Confronta con l'anno:</label>
							<b-form-select size="md" v-model="yearCompare" name="year" :options="yearOptions" id="filterYearSecond"/>
						</b-form-group>
						<b-form-group v-if="source == 'answers'">
							<label>Confronta con questionario:</label>
							<b-form-select size="sm" v-model="survey_idCompare" name="survey_id" :options="surveyList" value-field="id" text-field="name" id="filterAnswersSecond"/>
						</b-form-group>
					</b-col>
				</b-col>
				
				<div id="map-container" >
					<div id="spinner-container" class="text-center" v-if="loading">
						<b-spinner id="spinner" variant="success" label="Spinning"></b-spinner>
					</div>
					
					<l-map id="my-second-map" :zoom="zoom" :center="center" :options="getMapOptions"
						@update:center="centerUpdate" @update:zoom="zoomUpdate" ref="map_compare">
						<l-tile-layer :url="getTilesUrl" :attribution="getMapAttribution" :options="getLayerOptions" />

						<v-marker-cluster v-if="layers_selezionati.includes('employees')">
							<l-circle-marker :key="origin.id" v-for="origin in origins_compare" :lat-lng="origin.center"
								:radius="origin.radius" :color="origin.color" className="origin" @click="openOrigin(origin.id)" />
						</v-marker-cluster>

						<span v-if="(layers_selezionati.includes('offices') || layers_selezionati.includes('coworking')) && uffici_azienda.length > 0">
							<l-marker v-for="office in uffici_azienda" :key="office.id" :lat-lng="[office.lat, office.lon]"
								:icon="companyIcon(office.coworking)" :options="{ title: office.name }">
								<l-popup ><strong>{{ office.company.name }}</strong><br><b-link
											:to="`/offices/edit/${office.id}`"  :disabled="!(loggedUserIsMomaArea || loggedUserIsAdmin)">{{ office.name }}</b-link>
											<div v-for="cow in office.info_coworking">
												<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">{{ cow.type }}</strong>
												<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">Sale: {{ cow.sale }}</strong>
												<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">Costo: {{ cow.costo }} €</strong>
												<br><b-link
												v-if="office.coworking == 1 && office.info_coworking!=null" :to="cow.link">Prenotazione</b-link>
											</div>
									</l-popup>
							</l-marker>
						</span>
						<span v-if="(layers_selezionati.includes('offices') || layers_selezionati.includes('coworking')) && uffici_azienda.length == 0">
							<l-marker v-for="office in offices_layer" :key="office.id" :lat-lng="[office.lat, office.lon]"
								:icon="companyIcon(office.coworking)" :options="{ title: office.name }">
								<l-popup ><strong>{{ office.company.name }}</strong><br><b-link
									:to="`/offices/edit/${office.id}`"  :disabled="!(loggedUserIsMomaArea || loggedUserIsAdmin)">{{ office.name }}</b-link>
									<div v-for="cow in office.info_coworking">
										<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">{{ cow.type }}</strong>
										<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">Sale: {{ cow.sale }}</strong>
										<br><strong v-if="office.coworking == 1 && office.info_coworking!=null">Costo: {{ cow.costo }} €</strong>
										<br><b-link
										v-if="office.coworking == 1 && office.info_coworking!=null" :to="cow.link">Prenotazione</b-link>
									</div>
								</l-popup>
							</l-marker>
						</span>
						<span v-if="layers_selezionati.includes('schools') && sedi_scuole.length > 0">
							<l-marker v-for="school in sedi_scuole" :key="school.id" :lat-lng="[school.lat, school.lon]"
								:icon="schoolIcon" :options="{ title: school.name }">
								<l-popup><strong>{{ school.company.name }}</strong><br><b-link
									:to="`/offices/edit/${school.id}`">{{ school.name }}</b-link>
								</l-popup>
							</l-marker>
						</span>
						<span v-if="layers_selezionati.includes('schools') && sedi_scuole.length == 0">
							<l-marker v-for="school in schools_layer" :key="school.id" :lat-lng="[school.lat, school.lon]"
								:icon="schoolIcon" :options="{ title: school.name }">
								<l-popup><strong>{{ school.company.name }}</strong><br><b-link
									:to="`/offices/edit/${school.id}`">{{ school.name }}</b-link>
								</l-popup>
							</l-marker>
						</span>

						<l-wms-tile-layer :key="wmsRenderKey"
							base-url="http://geomap.reteunitaria.piemonte.it/ws/siccms/coto-01/wmsg01/wms_sicc124_mobilita"
							:visible="true" :layers="selectedWmsLayers" :transparent="true" format="image/png">
						</l-wms-tile-layer>
					</l-map>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { latLng } from "leaflet";
import UserService from "@/services/user.service";
import vSelect from "vue-select";
import L from "leaflet";
import { LMap, LTileLayer, LMarker, LCircleMarker, LWMSTileLayer, LPopup } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import Util from "@/mixing/util";

// const companyIcon = L.divIcon({
// 	html: "<i class=\"fa fa-building-o fa-2x\"></i>",
// 	iconSize: [20, 20],
// 	className: "myDivIcon",
// });
const schoolIcon = L.divIcon({
	html: "<i class=\"fa fa-pencil fa-2x\"></i>",
	iconSize: [20, 20],
	className: "myDivIcon",
});

const MAX_AUTO_ORIGINS = 100000;

export default {
	name: "Mappa",
	mixins: [Util],
	components: {
		LMap,
		LMarker,
		LTileLayer,
		LCircleMarker,
		LPopup,
		"l-wms-tile-layer": LWMSTileLayer,
		//"l-popup": () => import("vue2-leaflet"),
		//"l-tooltip": () => import("vue2-leaflet"),
		"v-marker-cluster": () => import("vue2-leaflet-markercluster"),
		vSelect,
	},
	data() {
		return {
			zoom: 11,
			center: latLng(45.070339, 7.686864),
			currentZoom: 11,
			currentCenter: latLng(45.070339, 7.686864),
			showMap: true,
			showSecondMap: false,
			isActive: false, // Stato del bottone confronto
			office_id: [],
			offices_layer: [],
			office_types: [1, 2, 8, 9],
			schools_layer: [],
			school_types: [3, 4, 5, 6, 7],
			office_list: [],
			azienda: { id: 0 },
			aziende: [],
			answerFilters: [],
			employeeFilters: [],
			filterQuestionList: [],
			questionList: [],
			origins: [],
			origins_compare: [],
			//TODO: Generalizzare
			// year: new Date().getFullYear(),
            yearCompare: new Date().getFullYear() - 1, // WIP - Selezione locale per il confronto tra anni
			surveyList: [],
			survey_id: null,
			survey_idCompare: null,
			// companyIcon: companyIcon,
			schoolIcon: schoolIcon,
			altri_layer: [
				{ value: "employees", text: "impiegati" },
				{ value: "offices", text: "aziende" },
				// opzioni non ancora collegate a dei dati veri e propri
				{ value: "students", text: "studenti" },
				{ value: "schools", text: "scuole" },
				// { value: "fermate", text: "fermate" },
				// { value: "linee", text: "linee trasporto pubblico" },
				// { value: "coworking", text: "Coworking" },
			],
			layers_selezionati: ["employees"],
			wms_layers: [
				{ value: "M-Linee", text: "Linee Metro" },
				{ value: "M-Fermate", text: "Fermate Metro" },
				{ value: "BikeSharing", text: "Bike Sharing" },
				{ value: "P-Ciclabili", text: "Percorsi Ciclabili" },
			],
			wms_layers_selezionati: [],
			loading: false,
			// used to force map re-render when a wms layer changes (due to a bug in wms component when layers are changed tiles are not refreshed)
			wmsRenderKey: Date.now(),
			source: "answers",
			sourceOptions: JSON.parse(process.env.VUE_APP_MAP_VOICE_SOURCE_OPTIONS),
			selectAllOffices: false,
		};
	},
	watch: {
		// layers_selezionati: function () {
		// 	this.offices_layer = this.generateLayer(this.office_types);
		// 	this.fitMarkers();
		// }, 
		// https://github.com/vue-leaflet/Vue2Leaflet/issues/567
		wms_layers_selezionati: function () {
			this.wmsRenderKey = Date.now(); // force map re-render
		},
		source: function () {
			// reset filters
			this.answerFilters.forEach((filter) => (filter.value = null));
			this.employeeFilters.forEach((filter) => (filter.value = null));
			// this.filterOrigins();
			localStorage.removeItem("office_id");
		},
		azienda: function () {			
			this.createFilteredSurveysList();	
			this.filterEmployeeFilters();		
			localStorage.removeItem("office_id");
		},
	},
	computed: {
		selectedWmsLayers: function () {
			// this.offices_layer = this.generateLayer(this.office_types);
			return this.wms_layers_selezionati.join(",");
		},
		// filterOfficeList: function () {
		// 	let offices = this.office_list.filter(x => x.company_id == this.azienda_id);
		// 	offices.forEach(x => x.name_address = `${x.name} - ${x.city} (${x.address})`);
		// 	return offices;
		// },
		composeQuerystring: function () {
			let queryString = `source=${this.source}`;
			// let queryString = `source=employees`;
			if (this.azienda) {
				queryString += `&company_id=${this.azienda.id}`;
			}
			if (this.office_id) {
				queryString += `&office_id=${this.office_id}`;
			}
			if (this.year && this.source == "employees") {
				queryString += `&year=${this.year}`;
			}
			if (this.survey_id && this.source == "answers") {
				queryString += `&survey_id=${this.survey_id}`;
			}
			let filters = this.source == "employees" ? this.employeeFilters : this.answerFilters;
			filters.forEach((filter) => {
				if (filter.value) {
					queryString += `&filter_${filter.name}=${filter.value}`;
				}
			});

			return queryString;
		},
		composeQuerystringCompare: function () {
			let queryString = `source=${this.source}`;
			// let queryString = `source=employees`;
			if (this.azienda) {
				queryString += `&company_id=${this.azienda.id}`;
			}
			if (this.office_id) {
				queryString += `&office_id=${this.office_id}`;
			}
			if (this.yearCompare && this.source == "employees") {
				queryString += `&year=${this.yearCompare}`;
			}
			if (this.survey_idCompare && this.source == "answers") {
				queryString += `&survey_id=${this.survey_idCompare}`;
			}
			let filters = this.source == "employees" ? this.employeeFilters : this.answerFilters;
			filters.forEach((filter) => {
				if (filter.value) {
					queryString += `&filter_${filter.name}=${filter.value}`;
				}
			});

			return queryString;
		},
		filterString: function () {
			if (this.filterQuestionList == null) {
				return "";
			}
			let f = this.filterQuestionList.map((x) => x.code);
			return f.join();
		},
		uffici_azienda () {
			let tmp_uffici_azienda = this.office_list.filter((x) => {				
				return (x.company !== null && x.company !== undefined && 
						this.office_types.includes(x.company.type) && 
						x.lat != null && x.lon != null &&
						(this.azienda != null && x.company_id == this.azienda.id))
			});
			tmp_uffici_azienda.forEach(x => x.name_address = `${x.name} - ${x.city} (${x.address})`);			
			return tmp_uffici_azienda;			
		},
		sedi_scuole() {
			let tmp_sedi_scuole = this.office_list.filter((x) => {
				return (x.company !== null && x.company !== undefined && 
						this.school_types.includes(x.company.type) && 
						x.lat != null && x.lon != null && (this.azienda != null && x.company_id == this.azienda.id))
			});
			tmp_sedi_scuole.forEach(x => x.name_address = `${x.name} - ${x.city} (${x.address})`);
			return tmp_sedi_scuole;
		},
	},
	methods: {
		generateLayer: function (types) {
			return this.office_list.filter((x) => {
				if (x.company !== undefined && x.company !== null && x.lat != null && types.includes(x.company.type)) {
					// if(this.layers_selezionati.includes('coworking') && this.layers_selezionati.includes('offices')){
					// 	return true;
					// }else{
					// 	if(this.layers_selezionati.includes('coworking')){
					// 		return x.coworking !== null ? x.coworking : false;
					// 	}else if(this.layers_selezionati.includes('offices')){
					// 		return x.coworking !== null ? !x.coworking : true;
							
					// 	}

					// }
					return true;
					
					
				}
			});
		},
		toggleSecondMap() {
			this.showSecondMap = !this.showSecondMap;
			this.isActive = !this.isActive; // Cambia lo stato del bottone di confronto
		},
		zoomUpdate(zoom) {
			this.currentZoom = zoom;
		},
		centerUpdate(center) {
			this.currentCenter = center;
		},
		fitMarkers() {
			this.$refs.map.mapObject.fitBounds([...this.offices_layer.map((m) => m.center), ...this.origins.map((o) => o.center)]);
			this.$refs.map_compare.mapObject.fitBounds([...this.offices_layer.map((m) => m.center), ...this.origins.map((o) => o.center)]);
		},
		async filterOrigins(always = true) {
			if (!this.source) {
				alert("Per procedere è necessario scegliere una fonte di dati questionari o dati HR")
				return;
			}
			localStorage.setItem("datasource", this.source);
			localStorage.setItem("azienda_id", this.azienda.id);
			localStorage.setItem("office_id", JSON.stringify(this.office_id));
			localStorage.setItem("filterQuestionList", JSON.stringify(this.filterQuestionList));
			localStorage.setItem("answerFilters", JSON.stringify(this.answerFilters));
			this.loading = true;
			try {
				let response_compare;
				if (!always) {
					let response = await UserService.getOrigins(this.composeQuerystring, true);
					if (response.data > MAX_AUTO_ORIGINS) return; // will execute 'finally' block!
					if (this.showSecondMap) {
						response_compare = await UserService.getOrigins(this.composeQuerystringCompare, true);
						if (response_compare.data > MAX_AUTO_ORIGINS) return; // will execute 'finally' block!
					}
				}
				let response = await UserService.getOrigins(this.composeQuerystring);
				if (this.showSecondMap) {
					response_compare = await UserService.getOrigins(this.composeQuerystringCompare);
				}
				
				// if response is empty create a modal with messaggio
				if (response.data.origins.length == 0) {
					this.$bvToast.toast("xls dipendenti non caricato. vai in azienda--> azioni --> importa lavoratori da excel", {
						title: "Attenzione",
						autoHideDelay: 50000,
						appendToast: true,
						variant: "warning",
					});
				}

				this.origins = response.data.origins.map((origin) => ({
					...origin,
					center: latLng(origin.lat, origin.lon),
				}));
				if (this.showSecondMap) {
					this.origins_compare = response_compare.data.origins.map((origin) => ({
						...origin,
						center: latLng(origin.lat, origin.lon),}));
				}
				if (this.layers_selezionati.indexOf("employees") != -1) {
					// otherwise no need to change map display (markers are not visible)
					this.fitMarkers();
					console.log('fitmarkers si è attivato')
				}
			} catch (e) {
				//console.log(e);
			} finally {
				this.loading = false;
			}
		},
		filterName(filter) {
			return new String(filter.name)
				.split("-")
				.map((t) => t.substring(0, 1).toUpperCase() + t.substring(1).toLowerCase())
				.join(" ");
		},
		filterOptions(filter) {
			if (!filter.options || filter.options == null) {
				return [];
			}

			return [
				{
					id: "",
					name: `--- Filtra per ${this.filterName(filter)} ---`,
				},
				...filter.options.map((o) => ({
					id: o,
					name: o,
				})),
			];
		},
		download($url) {
			this.loading = true;
			UserService.download($url).then(() => {
				this.loading = false;
			});
		},
		companyIcon(cow=1) {
			if(cow==1){
				return L.divIcon({
					html: "<i class=\"fa fa-building-o fa-2x\" style=\"color:red\"></i>",
					iconSize: [20, 20],
					className: "myDivIcon",
				});
			}else{
				return L.divIcon({
					html: "<i class=\"fa fa-building-o fa-2x\"></i>",
					iconSize: [20, 20],
					className: "myDivIcon",
				});
			}
			
		},
		// toggle(checked) {
		// 	if(checked.includes('offices') || checked.includes('coworking')){
		// 		this.offices_layer = this.generateLayer(this.office_types);
		// 		if (this.company_id !== null) {
		// 			let tmp_uffici_azienda = this.office_list.filter((x) => {
		// 			if (x.company_id == this.azienda.id && x.lat != null) {
		// 				// if(this.layers_selezionati.includes('coworking') && this.layers_selezionati.includes('offices')){
		// 				// 	return true;
		// 				// }else{
		// 				// 	if(this.layers_selezionati.includes('coworking')){
		// 				// 		return x.coworking !== null ? x.coworking : false;
		// 				// 	}else if(this.layers_selezionati.includes('offices')){
		// 				// 		return x.coworking !== null ? !x.coworking : true;
								
		// 				// 	}

		// 				// }
		// 				return true;
						
		// 			}
		// 			});
		// 			tmp_uffici_azienda.forEach(x => x.name_address = `${x.name} - ${x.city} (${x.address})`);
		// 			this.uffici_azienda = tmp_uffici_azienda;
		// 		}
		// 	}
			

			
		// 	//console.log(checked)
      	// },
		async openOrigin(oid) {
			if (this.source == "employees") {
				let usr = null;
				const { survey_id, user_id } = await UserService.getAnswerFromOrigin(oid);
				if (user_id != null) {
					usr = await UserService.getUser(user_id);
					if (usr.data.user == null) {
						this.$bvToast.toast("I dati dell'utente non sono presenti", {
							title: "Utente Anomino",
							autoHideDelay: 2000,
							appendToast: true,
							variant: "success",
						});
					} else {
						const routeData = this.$router.resolve({ path: `users?search=${usr.data.user.email}`});
						window.open(routeData.href, "participant");
					}
				} else {
					this.$bvToast.toast("Questo utente non è presente", {
						title: "Utente Anomino",
						autoHideDelay: 2000,
						appendToast: true,
						variant: "success",
					});
				}
			} else {
				///questionari/answers/8/3f28aadb-b5d4-4f85-906f-f46d1f44e0b7
				const { survey_id, user_id } = await UserService.getAnswerFromOrigin(oid);
				if (survey_id != null && user_id != null) {
					const routeData = this.$router.resolve({ path: `/questionari/answers/${survey_id}/${user_id}`});
					window.open(routeData.href, "participant");
				} else {
					this.$bvToast.toast("Questo utente non ha compilato un questionario", {
						title: "Utente Anomino",
						autoHideDelay: 2000,
						appendToast: true,
						variant: "success",
					});
				}
			}
		},
		async updateFilterQuestionList() {
			// Find new elements and fetch them
			let current_ids = this.answerFilters.map((x) => (x.id));
			let ids_to_fetch = [];
			console.log("filterQuestionList", this.filterQuestionList);
			for (let flt of this.filterQuestionList) {
				if (!current_ids.includes(flt.code)) {
					ids_to_fetch.push(flt.code);
				}
			}
			console.log("ids_to_fetch", ids_to_fetch);
			let response = await UserService.getOriginFiltersForAnswers(ids_to_fetch.join());
			console.log("response", response);
			this.answerFilters.push(...response.data.filters.map((filter) => ({
				...filter,
				value: this.$route.query[`filter-${filter.name}`] ? this.$route.query[`filter-${filter.name}`] : "",
			})));

			// Now remove elements we no longer have in vue-select
			current_ids = this.filterQuestionList.map((x) => (x.code));
			this.answerFilters = this.answerFilters.filter((x) => (current_ids.includes(x.id)));
		},
		async getQuestionList() {
			let q = await UserService.getQuestionList();
			let res = q.data.questions.map((x) => {
				// console.log("x",x);
				var rObj = { label: `${x.id}_${x.name}_${x.description}` , code: x.id };

				return rObj;
			});
			// console.log("res",res);
			this.questionList = res;
		},
		async createFilteredSurveysList() {
			let res;
			if (this.azienda != null && this.azienda.id > 0) {
				res = await UserService.getSurveysList(this.azienda.id, null);
				//console.log("SL", res.data.surveyList);
				this.surveyList = [
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
				this.surveyList = [{
					id: 0,
					name: "--- Nessun questionario  --- ",
				},];
			}

			return this.surveyList;
		},
		toggleAllOffices(checked) {
		console.log(this.office_id);
		console.log(this.uffici_azienda);
        this.office_id = checked ? this.uffici_azienda.map(ufficio => ufficio.id) : []
      	},
		  async filterEmployeeFilters() {
			if (this.azienda != null && this.azienda.id != null && this.azienda.id > 0) {
				let response = await UserService.getOriginFiltersForEmployees(this.azienda.id);
				this.employeeFilters = response.data.filters.map((filter) => ({
				...filter,
				value: this.$route.query[`filter-${filter.name}`] ? this.$route.query[`filter-${filter.name}`] : "",
				}));
			} else {
				this.employeeFilters = [];
			}
		},
	},
	async created() {
		this.loading = true;
		this.getYear();
		// this.year=this.getYear;
		await this.getQuestionList();

		try {
			const response = await Promise.all([
				UserService.getCompanyList(),
				UserService.getOffices(null, "id, name, company_id, lat, lon, Companies.name, Companies.type, address, city, coworking, info_coworking"),
				UserService.getOriginFiltersForAnswers(this.filterString),
				UserService.getOriginFiltersForEmployees(this.azienda.id),
				// UserService.getOrigins(`source=${this.source}`),
			]);

			// Aggiungo l'opzione vuota all'inizio
			response[0].data.companies.unshift({
				id: 0,
				name: "--- Filtra per azienda o scuola --- ",
			});
			this.aziende = response[0].data.companies;
			this.office_list = response[1].data.offices;
			this.offices_layer = this.generateLayer(this.office_types);
			this.schools_layer = this.generateLayer(this.school_types);

			this.answerFilters = response[2].data.filters.map((filter) => ({
				...filter,
				value: this.$route.query[`filter-${filter.name}`] ? this.$route.query[`filter-${filter.name}`] : "",
			}));
			this.employeeFilters = response[3].data.filters.map((filter) => ({
				...filter,
				value: this.$route.query[`filter-${filter.name}`] ? this.$route.query[`filter-${filter.name}`] : "",
			}));

			
			// this.origins = response[2].data.origins.map((origin) => ({
			// 	...origin,
			// 	center: latLng(origin.lat, origin.lon),
			// }));

			if (this.$route.query["source"]) {
				this.source = this.$route.query["source"];
			}

			this.fitMarkers();
		} catch (e) {
			// //console.log(e);
		}

		let datasource =  localStorage.getItem("datasource");
		if (datasource == null ){			
			this.source = "answers";			
		} else {
			this.source = datasource;
		}

		try {
			if (localStorage.getItem("office_id")) {
				this.office_id = JSON.parse(localStorage.getItem("office_id"));
			}			
		} catch (e) {
			this.$bvToast.toast(e.message, {
				title: "Errore",
				autoHideDelay: 2000,
				appendToast: true,
				variant: "danger",
			});
		}

		try {
			let previous_azienda = this.aziende.find(x => x.id == localStorage.getItem("azienda_id"));
			if (previous_azienda) this.azienda = previous_azienda;
		} catch (e) {
			this.$bvToast.toast(e.message, {
				title: "Errore",
				autoHideDelay: 2000,
				appendToast: true,
				variant: "danger",
			});
		}

		

		try {
			let old_question_filters = JSON.parse(localStorage.getItem("filterQuestionList"));
			if (old_question_filters) this.filterQuestionList = old_question_filters;
			let old_answer_filters = JSON.parse(localStorage.getItem("answerFilters"));
			if (old_answer_filters) this.answerFilters = old_answer_filters;
		} catch (e) {
			this.filterQuestionList = [];
			this.answerFilters = [];
		}
		//console.log("sto per chiamare surveylist");
		this.surveyList = await this.createFilteredSurveysList();
		//console.log("ho chiamato surveylist", this.surveyList);
		//await this.filterOrigins(false); // TODO rotto perche azienda_id e` un oggetto?

		this.loading = false;
	},
	
};
</script>
<style scoped>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
@import "~vue-select/dist/vue-select.css";

.myDivIcon {
	text-align: center;
	/* Horizontally center the text (icon) */
	line-height: 20px;
	/* Vertically center the text (icon) */
}

#map-container {
	position: relative;
	height: 90vh;
	min-height: 300px;
}

#spinner-container {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 500;
}

#spinner {
	position: relative;
	top: 50%;
}</style>
