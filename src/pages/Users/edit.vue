<template>
    <div>
        <b-form>
            <b-form-row>
                <b-col cols="5">
                    <label for="address">Indirizzo</label>
                    <b-form-input v-model="form.address" v-on:keyup.enter="geocode" name="address"></b-form-input>
                </b-col>
                <b-col cols="2">
                    <label for="cap">Cap</label>
                    <b-form-input v-model="form.postal_code" name="postal_code" v-on:keyup.enter="geocode"></b-form-input>
                </b-col>
                <b-col cols="2">
                    <label for="city">Città</label>
                    <b-form-input v-model="form.city" name="city" v-on:keyup.enter="geocode"></b-form-input>
                </b-col>
                <b-col cols="1">
                    <label for="province">Provincia</label>
                    <b-form-input v-model="form.province" name="province" v-on:keyup.enter="geocode" type="text" maxlength="2" minlength="2"></b-form-input>
                </b-col>
                <b-col cols="1">
                    <br />
                    <b-button @click="geocode" role="button" v-on:keyup.enter="geocode">Trova</b-button>
                </b-col>
            </b-form-row>
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
                    @dblclick="moveMarker"
					id = "my-map">
                    <l-tile-layer :url="getTilesUrl" :attribution="getMapAttribution" :options="getLayerOptions" />
                    <l-marker v-if="form.lat > 0" :lat-lng="[form.lat, form.lon]"></l-marker>
                </l-map>
            </b-form-row>
            <br />
            <br />
            <br />
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

            <input type="hidden" v-model="form.company_id" name="company_id" />
            <b-form-row class="mt-3">
                <b-button @click="submit" role="button" variant="primary">Salva</b-button>
            </b-form-row>
        </b-form>
    </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import UserService from "@/services/user.service";
import "leaflet/dist/leaflet.css";
import Util from "@/mixing/util";

export default {
	name: "UserEdit",
	components: {
		LMap,
		LTileLayer,
		LMarker,
	},
	mixins: [Util],
	props: {
		company_id: String,
		office_id: String,
		redirect_to: String,
	},
	data() {
		return {
			user_id: this.$route.params.user_id,
			company: {},
			form: {
				name: null,
				lat: null,
				lon: null,
				address: null,
				number: null,
				postal_code: null,
				city: null,
				province: null,
				company_id: null,
				user_id: this.$route.params.user_id,
				// office_code_external: null,
			
			},
			message: null,
			zoom: 15,
			center: latLng(45.070339, 7.686864),
			currentZoom: 11.5,
			currentCenter: latLng(45.070339, 7.686864),
			
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
				[res,response]= await UserService.geoCode({
					city: this.form.city,
					province: this.form.province,
					address: this.form.address,
					postal_code: this.form.postal_code,
				});
				
				if (res.lng != 0 && res.lat != 0) {
					this.form.lon = res.lng;
					this.form.lat = res.lat;
					this.$refs.map.mapObject.flyTo([this.form.lat, this.form.lon], this.zoom);
					this.message = null;
					this.form.city = response.data.city;
					this.form.province = response.data.province;
					this.form.address = response.data.address;
					this.form.postal_code = response.data.postal_code;
				}
			} catch (error) {
				this.message = error.message;
			}
		},
		async submit() {
			try {
				await UserService.editOrigin(this.form);
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
			return history.go(-1);
		},
	},
	async created() {
		try {
			let res = await UserService.getOrigin(this.user_id);
			if (res.data.origin[0]){
				this.form = res.data.origin[0].origins[0];
				if (this.form.lon != null) {
					this.center = latLng(this.form.lat, this.form.lon);
				}
			}
		} catch (error) {
			this.showError(error);
		}
	},
};
</script>

<style scoped>
	#my-map {
		height: 50vh;
		min-height: 300px;
	}
</style>