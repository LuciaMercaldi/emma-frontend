<template>
    <div>:
		<BreadCrumb v-if="form.company_id" :company_id="parseInt(form.company_id)" :office_id="parseInt(office_id)"></BreadCrumb>
    
        <h3>{{ company.name }} - {{ this.office_id ? "Modifica sede" : "Aggiungi sede" }}</h3>
        <b-form ref="form">
			<b-form-row>
				<b-col cols="6">
					<label for="name">Nome</label>
			        <b-form-input cols="10" v-model="form.name" name="name" v-on:keyup.enter="geocode"></b-form-input>
				</b-col>
				<b-col cols="3">
					<label for="name">Codice della sede (interno)</label>
            		<b-form-input v-model="form.office_code"  placeholder="codice della sede" required></b-form-input>
			</b-col>
			<b-col cols="3">
			<label for="name">Codice pubblico della sede (esterno)</label>
			<b-form-input v-model="form.office_code_external" placeholder="Nome in codice per organismo superiore (es: codice meccanografico della scuola)"></b-form-input>
			</b-col>
			</b-form-row>
            <b-form-row>
                <b-col cols="5">
                    <label for="address">Indirizzo</label>
                    <b-form-input v-model="form.address" v-on:keyup.enter="geocode" name="address"></b-form-input>
                </b-col>
                <b-col cols="2">
                    <label for="cap">Cap</label>
                    <b-form-input v-model="form.cap" name="cap" v-on:keyup.enter="geocode"></b-form-input>
                </b-col>
                <b-col cols="2">
                    <label for="city">Città</label>
                    <b-form-input v-model="form.city" name="city" v-on:keyup.enter="geocode"></b-form-input>
                </b-col>
                <b-col cols="1">
                    <label for="province">Provincia</label>
                    <b-form-input v-model="form.province" name="province" v-on:keyup.enter="geocode" maxlength="2"></b-form-input>
                </b-col>
                <b-col cols="1">
                    <br />
                    <b-button @click="geocode" role="button" v-on:keyup.enter="geocode">Trova</b-button>
                </b-col>
            </b-form-row>
			<b-jumbotron class="px-3 py-2 mt-2 mb-2">
				<b-row>
				<b-col class="flex-grow-1 d-flex align-items-end">
					<p class="mb-0">
						Questa Sede è 
						<strong :class="isCompanyActive ? 'text-success' : 'text-danger'">
							{{ isCompanyActive ? 'attualmente attiva,' : 'attualmente disattiva,' }}
						</strong>
						{{ isCompanyActive ? 'vuoi disattivarla?':'vuoi riattivarla?' }}
					</p>
				</b-col>
				<b-col class="col-auto text-right">
					<b-button 
					:variant="isCompanyActive ? 'danger' : 'success'" 
					class="btn-sm" 
					@click="toggleCompanyActive">
					{{ isCompanyActive ? 'disattiva' : 'riattiva' }}
					</b-button>
				</b-col>
				</b-row>

				<b-row class="mt-2" v-if="!isCompanyActive">
				<b-col class="flex-grow-1">
					<v-select 
					v-model="form.years" 
					:options="yearOptions" 
					label="activeYears" 
					multiple 
					placeholder="Seleziona solo gli anni attivi dell'azienda"
					/>
				</b-col>
				</b-row>

				<b-row class="mt-2">
				<b-col class="d-flex justify-content-end align-items-end">
					<i class="ti-help-alt" style="font-size: 20px;"
					v-b-popover.hover="{  
						content: 'Se questa sede è chiusa o non ti compete puoi contrassegnarla come inattiva mantenendo tutti i suoi dati'
					}">
					</i>
				</b-col>
				</b-row>
			</b-jumbotron>
            <b-form-row>
                <span class="text-danger">{{ message }}</span>
            </b-form-row>

            <br />
            <b-form-row style="height: 50vh; width: 100%">
                <div class="text-muted">Se l'indirizzo non viene riconosciuto correttamente potete aggiustare la posizione facendo doppio click sulla mappa.</div>

                <l-map
                    ref="map"
                    :zoom="zoom"
                    :center="center"
                    :options="getMapOptions"
                    style="margin-top: 1em; padding-bottom: 2em"
                    @update:center="centerUpdate"
                    @update:zoom="zoomUpdate"
                    :markerZoomAnimation="true"
                    @dblclick="moveMarker">
                    <l-tile-layer :url="getTilesUrl" :attribution="getMapAttribution" :options="getLayerOptions" />
                    <l-marker v-if="form.lat > 0" :lat-lng="[form.lat, form.lon]"></l-marker>
                </l-map>
            </b-form-row>
            <br />
			<br>
            <b-form-row>
                <b-col>
                    <label for="lat">Lat</label>
                    <b-form-input v-model="form.lat" name="lat"></b-form-input>
                </b-col>
                <b-col>
                    <label for="lon">Lon</label>
                    <b-form-input v-model="form.lon" name="lon"></b-form-input>
                </b-col>
            </b-form-row>
            <b-form-row v-if="coworking_active">
                <b-col>
                    <label for="coworking">Spazi di coworking</label>
                    <b-form-checkbox v-model="form.coworking" name="coworking">Questa sede dispone di uno spazio di coworking che può ospitare lavoratori di altre sedi aziendali e/o di altre aziende</b-form-checkbox>
                </b-col>
            </b-form-row>
			<b-form-row v-if="coworking_active">
                <b-col>
                    <b-form-checkbox v-model="form.private_coworking" name="private_coworking" v-if="form.coworking==1">Riservato solo ai lavoratori dell'azienda</b-form-checkbox>
                </b-col>
            </b-form-row>
            <b-form-row v-for="(cow, index) in form.info_coworking" :key="index" v-if="coworking_active">
				<b-col>
					<label for="type" v-if="form.coworking==1">Tipo di spazio di coworking</label>
					<b-form-select
					v-model="cow.type"
					:options="coworking_types"
					v-if="form.coworking==1"
					></b-form-select>
				</b-col>
				
                <b-col>
                    <label for="sale" v-if="form.coworking==1">Quantità disponibile</label>
                    <b-form-input v-model="cow.sale" name="sale" v-if="form.coworking==1"></b-form-input>
                </b-col>
                <b-col>
                    <label for="costo" v-if="form.coworking==1">Costo per giorno(€/gg)</label>
                    <b-form-input v-model="cow.costo" name="costo" v-if="form.coworking==1"></b-form-input>
                </b-col>
				<b-col>
                    <label for="link" v-if="form.coworking==1">Link alla prenotazione</label>
                    <b-form-input v-model="cow.link" name="link" v-if="form.coworking==1"></b-form-input>
                </b-col>
            </b-form-row>
			<b-form-row class="mt-3" v-if="coworking_active">
                <b-button @click="addCoworking" role="button" variant="primary" class="mr-2" :disabled="!form.coworking">Aggiungi spazio di coworking</b-button>
				<b-button @click="removeCoworking" role="button" variant="primary" :disabled="!form.coworking">Cancella spazio di coworking</b-button>
            </b-form-row>
            <input type="hidden" v-model="form.company_id" name="company_id">
            <b-form-row class="mt-3">
                <b-button @click="submit" role="button" variant="primary" :disabled="!form.address || !form.cap || !form.city || !form.province">Salva</b-button>
            </b-form-row>
        </b-form>
    </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import vSelect from "vue-select";
import BreadCrumb from "./BreadCrumb.vue";


export default {
	name: "OfficeEditWidget",
	mixins: [Util],
	components: {
		LMap,
		LTileLayer,
		LMarker,
		vSelect,
		BreadCrumb,
	},
	props: {
		company_id: String,
		office_id: String,
		redirect_to: String,
	},
	data() {
		return {
			company: {},
			form: {
				name: null,
				lat: null,
				lon: null,
				address: null,
				number: null,
				cap: null,
				city: null,
				province: null,
				company_id: null,
				office_code_external: null,
				info_coworking: [{
					type: null,
					sale: null,
					costo:null,
					link:null,
				}],
			},
			message: null,
			zoom: 15,
			center: latLng(45.070339, 7.686864),			
			currentZoom: 11.5,
			currentCenter: latLng(45.070339, 7.686864),
			coworking_types:[],
			coworking_active:false,
			isCompanyActive: true,
			geocodeUsed: false,
		};
	},
	methods: {
		zoomUpdate(zoom) {
			this.currentZoom = zoom;
		},
		centerUpdate(center) {
			this.currentCenter = center;
		},
		moveMarker(event) {
			this.form.lat = event.latlng.lat;
			this.form.lon = event.latlng.lng;
		},
		async geocode() {
			let res = new latLng();		
			let response;	
			try {
				[res, response] = await UserService.geoCode({
					city: this.form.city,
					province: this.form.province,
					address: this.form.address,
					postal_code: this.form.cap,
				});								
				if (res.lng != 0 && res.lat != 0) {
					this.form.lon = res.lng;
					this.form.lat = res.lat;
					this.$refs.map.mapObject.flyTo([this.form.lat, this.form.lon], this.zoom);
					this.message = null;
					this.form.city = response.data.city;
					this.form.province = response.data.province;
					this.form.address = response.data.address;
					this.form.cap = response.data.postal_code;
				}
			} catch (error) {
				this.message = error.message;
			}
			this.geocodeUsed = true;
		},
		async submit() {
			if (this.$refs["form"].checkValidity()) {
			try {
				await UserService.editOffice(this.form, this.office_id);
				this.$bvToast.toast("Salvataggio avvenuto correttamente", {
					title: "Invio ok",
					autoHideDelay: 2000,
					appendToast: true,
				});
				if (this.redirect_to) {
					this.$router.push(this.redirect_to);
				}
			} catch (e) {
				//console.log(e);
				this.$bvToast.toast(e.message, {
					title: "Errore",
					autoHideDelay: 2000,
					appendToast: true,
					variant: "danger",
				});
			}
			} else {
				this.$refs["form"].reportValidity();
			}
		},
		async handleSave() {
            await this.geoCode()
            this.submit();
        },
		addCoworking(){
			this.form.info_coworking.push({
						type : null,
						sale:null,
						costo:null,
						link:null,
					}); 
		},
		removeCoworking(){
			this.form.info_coworking.pop()
		},
		toggleCompanyActive() {
      		this.isCompanyActive = !this.isCompanyActive;
			if(this.isCompanyActive){
				this.form.years=null;
			}
    	},
	},
	async created() {
		try {
			this.coworking_types=(await UserService.getCoworkingtypes()).data.types
			if (this.office_id) {
				this.form = (await UserService.getOffice(this.office_id)).data.office;
				
				if (this.form.lon != null) {
					this.center = latLng(this.form.lat, this.form.lon);
				}
				if(this.form.info_coworking== null){
					this.form.info_coworking=[];
					this.form.info_coworking.push({
						type : null,
						sale:null,
						costo:null,
						link:null,
					}); 
				}
			} else {
				this.form.company_id = this.company_id;
			}
			if(this.form.years==null){
				this.isCompanyActive=true;
			}else{
				this.isCompanyActive=false;
			}
			this.company = (await UserService.getCompany(this.form.company_id)).data.company;
			const modsList = process.env.VUE_APP_EXTRA_MODULES;
			if(modsList.includes('Coworking')){
				this.coworking_active=true;
			}else{
				this.coworking_active=false;
			}
		} catch (e) {
			//console.log(e);
			this.$bvToast.toast(e.message, {
				title: "Errore",
				autoHideDelay: 2000,
				appendToast: true,
				variant: "danger",
			});
		}
	},
};
</script>
