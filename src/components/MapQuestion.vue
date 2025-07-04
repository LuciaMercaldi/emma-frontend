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
      <h3>
        {{ mapqs.leavingpoint }}
        <!-- <span class="small">
          <b-badge variant="primary">{{ mapqs.Mandatory_question }}</b-badge>
        </span> -->
      </h3>
      <b-form>
        <b-form-row class="">
          <b-col md="9"  lg="4" class="pl-0">
            <label for="address">{{ mapqs.address }}</label>
            <b-form-input
              v-model="casa.address"
              name="address"
              :placeholder="mapqs.insert_address">
            </b-form-input>
          </b-col>
          <b-col md="3" lg="2" class="">
            <label for="cap">{{ mapqs.Cap}}</label>
            <b-form-input
              v-model="casa.postal_code"
              name="postal_code"
              :placeholder="mapqs.insert_Cap">
            </b-form-input>
          </b-col>
          <b-col md="10" lg="4" class="pl-md-0">
            <label for="city">{{ mapqs.city }}</label>
            <b-form-input
              v-model="casa.city"
              name="city"
              :placeholder="mapqs.insert_city">
            </b-form-input>
          </b-col>
          <b-col md="2" lg="2" class="pr-0">
            <label for="province">{{ mapqs.province }}</label>
            <b-form-input
              v-model="casa.province"
              name="province"
              placeholder="TO"
			  maxlength="2">
            </b-form-input>
          </b-col>
		</b-form-row>
	    <b-form-row>  
          <b-col lg="12" md="12" sm="12" class="pl-0 pl-0 pt-1 mt-0">
			<b-button 
			  @click="geocodeHome" 
			  class="mt-2 w-100 pl-1 pr-1" 
			  :class="{'btn-special': survey_id == 235}">
			  {{ mapqs.click }}
			</b-button>
          </b-col>
          <br />
		  <b-col>
			<p v-if="geocodingTimeoutId != null" class="text-warning">{{ mapqs.research }}</p>
			<p class="text-danger"  v-if="!geocodingHome && geocodingFailed">{{ mapqs.impossible_search }}<u>{{ mapqs.only_ci_pro }}</u></p>
		  </b-col>
		  <b-col cols="12">
			<p class="mb-0">{{ mapqs.insert_address }}</p>
		  </b-col>
		</b-form-row>

          <p class="text-success pb-2 mb-0">{{ mapqs.unavalible_adress }}</p>

          <l-map
            :zoom="zoom"
            :center="center"
            :options="getMapOptions"
            style="height: 300px"
            @update:center="centerUpdate"
            @update:zoom="zoomUpdate"
		  	@click="clickCasa"
            ref="map">
            <l-tile-layer
              :url="getTilesUrl"
              :attribution="getMapAttribution"
              :options="getLayerOptions"/>
          </l-map>

          <p class="pt-3">
            {{ mapqs.privacy_que }}
          </p>
        
      </b-form>
      <b-row>
        <b-col>
          <b-button variant="primary" @click="$emit('back')" v-if="questions[0].type != 'map'">{{ mapqs.back }}</b-button>
        </b-col>
        <b-col class="text-right">
          <b-button
            :disabled="map_question[0].questions_surveys[0].compulsory_answer && !geocodingHome"
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
      <h3>
        2. {{ mapqs.step_which_company }}
        <span class="small">
          <b-badge variant="primary">{{ mapqs.Mandatory_question }}</b-badge>
        </span>
      </h3>
      <b-form>
        <b-form-row>
          <b-col>
            <b-form-select
              v-model="sedeLavoroId"
              v-on:change="setSedeLavoro()"
              :options="offices"
              value-field="id"
              text-field="name"></b-form-select>
          </b-col>
        </b-form-row>
        <b-form-row class="mt-3">
            <l-map
              :zoom="zoom"
              :center="center"
              :options="getMapOptions"
              style="height: 300px"
              @update:center="centerUpdate"
              @update:zoom="zoomUpdate"
              ref="map">
              <l-tile-layer
                :url="getTilesUrl"
                :attribution="getMapAttribution"
                :options="getLayerOptions"/>
            </l-map>
        </b-form-row>
      </b-form>
      <br />
      <b-row>
        <b-col>
          <b-button variant="primary" @click="step = 1">{{ mapqs.back }}</b-button>
        </b-col>
        <b-col class="text-right">
          <b-button
            :disabled="map_question[0].questions_surveys[0].compulsory_answer && sedeLavoro.id === undefined"
            variant="success"
            @click="step = 3">
            {{ mapqs.next }}
            <i
              class="fa fa-arrow-right"
              v-if="sedeLavoro.id != null"
              aria-hidden="true"></i>
          </b-button>
        </b-col>
      </b-row>
    </div>

    <div v-if="step == 3">
      <b-row>
        <b-col>
          <h3>3. {{ mapqs.which_modes }}</h3>
        </b-col>
      </b-row>
      <b-form-row class="mt-3">
          <b-col>      
        <l-map
          :zoom="zoom"
          :center="center"
          :options="getMapOptions"
          style="height: 300px"
          @update:center="centerUpdate"
          @update:zoom="zoomUpdate"
          ref="map">
          <l-tile-layer
            :url="getTilesUrl"
            :attribution="getMapAttribution"
            :options="getLayerOptions"/>
        </l-map>
			  </b-col>
	  </b-form-row>
	<b-form v-for="(mean, index) in meanAnswers" :key="index">
		<p v-if="errors.length">
			<b>Please correct the following error(s):</b>
			<ul>
				<li v-for="error in errors" :key="error.id">{{ error }}</li>
			</ul>
		</p>
			<b-card
				class="mt-4"
				:title="`${index+ 1}. ${mapqs.mean_label}`">
				<b-card-text>
					<b-form-row>
						<b-col>
							<h3 class="mb-2 mr-sm-2 mb-sm-0" text-field="label">
								{{ meansOfTransport.find(item => item.name === meanAnswers[index].selTransportmean).label }}
							</h3>
						</b-col>
					</b-form-row>
					<b-form-row>
						<b-col md="6" sm="12">	
							<b-form-group
									:description="mapqs.which_distance"
									:invalid-feedback="mapqs.set_distance"
									:state="disState(index)">
									
								<b-input-group 
										append="KM" 
										class="mb-2 mr-sm-2 mb-sm-0">
									<b-form-input
									v-model="meanAnswers[index].distance"
									v-on:change="buildCurrResponse"
									:state="disState(index)"
									:name="`meanAnswers[${index}][distance]`"
									id="input-live-${index}"
									aria-describedby="input-live-feedback"
									:placeholder="mapqs.which_distance"
									type="number"
									required
									trim></b-form-input>
								</b-input-group>
							</b-form-group>
						</b-col>

						<b-col md="6" sm="12" v-if="!((meanAnswers[index].selTransportmean === 'Bike' && (meanAnswers[index].type_bike === 'Personale' || 
												meanAnswers[index].type_bike === 'Personal')) || meanAnswers[index].selTransportmean === 'On_foot' ||
												(meanAnswers[index].selTransportmean === 'Scooter' && (meanAnswers[index].type_mono === 'Personale' || meanAnswers[index].type_mono === 'Personal')))">
							<b-form-group
									:description="mapqs.which_cost"
									:state="cosState(index)"
									:invalid-feedback="mapqs.set_cost">
									<b-input-group append="€" class="mb-2 mr-sm-2 mb-sm-0">
										<b-form-input
										v-model="meanAnswers[index].cost"
										v-on:change="buildCurrResponse"
										:state="cosState(index)"
										:name="`meanAnswers[${index}][cost]`"
										id="inline-form-input-username"
										:placeholder="mapqs.which_cost"
										type="number"
										required
										trim></b-form-input>
										
									</b-input-group>
									
							</b-form-group>
						</b-col>
					</b-form-row>

					<b-form-row v-if="meanAnswers[index].selTransportmean === 'Auto'">
							<b-col md="6" sm="12">
								<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['tipo-auto'].questions_surveys[0]._translations).length > 0  ? 
								questions_spostamenti['tipo-auto'].questions_surveys[0]._translations.en.description : 
								questions_spostamenti['tipo-auto']._translations.en.description)+"*"}}</label>
								<label v-else>{{(questions_spostamenti['tipo-auto'].questions_surveys[0].description == null ? 
								questions_spostamenti['tipo-auto'].description : 
								questions_spostamenti['tipo-auto'].questions_surveys[0].description)+"*"}}</label>
								<b-form-select					
									v-model="meanAnswers[index].type_auto"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_auto]`"
									:options="options_question_spostamenti['tipo-auto'][language]">
								</b-form-select>
								<!-- <b-form-select	
									v-else					
									v-model="meanAnswers[index].type_auto"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_auto]`"
									:options="questions_spostamenti['tipo-auto'].questions_surveys[0].options == null? 
									questions_spostamenti['tipo-auto'].options : 
									questions_spostamenti['tipo-auto'].questions_surveys[0].options"
									value-field="name"
									text-field="label">
								</b-form-select> -->
							</b-col>
							<b-col md="6" sm="12" class="mt-0" v-if="meanAnswers[index].type_auto === 'Personale' || meanAnswers[index].type_auto === 'Personal'">
								<label v-if="language=='en'">{{ (Object.keys(questions_spostamenti['personale-auto'].questions_surveys[0]._translations).length == 0  ? 
								questions_spostamenti['personale-auto']._translations.en.description : 
								questions_spostamenti['personale-auto'].questions_surveys[0]._translations.en.description)+"*"}}</label>
								<label v-else>{{(questions_spostamenti['personale-auto'].questions_surveys[0].description == null ? 
								questions_spostamenti['personale-auto'].description : 
								questions_spostamenti['personale-auto'].questions_surveys[0].description)+"*"}}</label>
								<b-form-select
									v-model="meanAnswers[index].type_personale"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_personale]`"
									:options="options_question_spostamenti['personale-auto'][language]">
								</b-form-select>
								<!-- <b-form-select
									v-else
									v-model="meanAnswers[index].type_personale"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_personale]`"
									:options="questions_spostamenti['personale-auto'].questions_surveys[0].options == null? questions_spostamenti['personale-auto'].options: questions_spostamenti['personale-auto'].questions_surveys[0].options"
									value-field="name"
									text-field="label">
								</b-form-select> -->
							</b-col>
							<b-col md="6" sm="12" v-if="meanAnswers[index].type_auto === 'Personale' || meanAnswers[index].type_auto === 'Personal'">
								<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['alimentazione-auto'].questions_surveys[0]._translations).length == 0 ?
								 questions_spostamenti['alimentazione-auto']._translations.en.description : 
								 questions_spostamenti['alimentazione-auto'].questions_surveys[0]._translations.en.description)+"*"}}</label>
								<label v-else>{{(questions_spostamenti['alimentazione-auto'].questions_surveys[0].description == null ? 
								questions_spostamenti['alimentazione-auto'].description : 
								questions_spostamenti['alimentazione-auto'].questions_surveys[0].description)+"*"}}</label>
								<b-form-select
									
									v-model="meanAnswers[index].alimentazioneauto"
									v-on:change="buildCurrResponse"
									v-on:input="inputalimentazuineauto(index)"
									:name="`meanAnswers[${index}][alimentazioneauto]`"
									:options="options_question_spostamenti['alimentazione-auto'][language]">
								</b-form-select>
								<!-- <b-form-select
									v-else
									v-model="meanAnswers[index].alimentazioneauto"
									v-on:change="buildCurrResponse"
									v-on:input="inputalimentazuineauto(index)"
									:name="`meanAnswers[${index}][alimentazioneauto]`"
									:options="questions_spostamenti['alimentazione-auto'].questions_surveys[0].options ? 
									questions_spostamenti['alimentazione-auto'].questions_surveys[0].options : 
									questions_spostamenti['alimentazione-auto'].options">
								</b-form-select> -->
							</b-col>
							<b-col md="6" sm="12" v-if="(meanAnswers[index].type_auto === 'Personale' || meanAnswers[index].type_auto === 'Personal') && auto_electric">
								<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['emissioni-auto'].questions_surveys[0]._translations).length == 0 ? 
								questions_spostamenti['emissioni-auto']._translations.en.description : 
								questions_spostamenti['emissioni-auto'].questions_surveys[0]._translations.en.description)+"*"}}</label>
								<label v-else>{{(questions_spostamenti['emissioni-auto'].questions_surveys[0].description == null ? 
								questions_spostamenti['emissioni-auto'].description : 
								questions_spostamenti['emissioni-auto'].questions_surveys[0].description)+"*"}}</label>
								<b-form-select
									
									v-model="meanAnswers[index].emissioni_auto"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][emissioni_auto]`"
									:options="options_question_spostamenti['emissioni-auto'][language]">
								</b-form-select>
								<!-- <b-form-select
									v-else
									v-model="meanAnswers[index].emissioni_auto"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][emissioni_auto]`"
									:options="questions_spostamenti['emissioni-auto'].questions_surveys[0].options ? 
									questions_spostamenti['emissioni-auto'].questions_surveys[0].options : 
									questions_spostamenti['emissioni-auto'].options">
								</b-form-select> -->
							</b-col>

							<b-col md="6" sm="12" v-if="(meanAnswers[index].type_auto === 'Personale' || meanAnswers[index].type_auto === 'Personal') && auto_electric">
								<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['cilindrata-auto'].questions_surveys[0]._translations).length == 0 ? 
								questions_spostamenti['cilindrata-auto']._translations.en.description : 
								questions_spostamenti['cilindrata-auto'].questions_surveys[0]._translations.en.description)+"*"}}</label>
								<label v-else>{{(questions_spostamenti['cilindrata-auto'].questions_surveys[0].description == null ? 
								questions_spostamenti['cilindrata-auto'].description : 
								questions_spostamenti['cilindrata-auto'].questions_surveys[0].description)+"*"}}</label>
								<b-form-select
									v-model="meanAnswers[index].cilindratauto"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][cilindratauto]`"
									:options="options_question_spostamenti['cilindrata-auto'][language]">
								</b-form-select>
								<!-- <b-form-select
									v-else
									v-model="meanAnswers[index].cilindratauto"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][cilindratauto]`"
									:options="questions_spostamenti['cilindrata-auto'].questions_surveys[0].options ? 
									questions_spostamenti['cilindrata-auto'].questions_surveys[0].options : 
									questions_spostamenti['cilindrata-auto'].options">
								</b-form-select> -->
							</b-col>
					</b-form-row>

					<b-form-row v-if="meanAnswers[index].selTransportmean === 'Moto'">
						<b-col cols="12">
							<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['tipo-moto'].questions_surveys[0]._translations).length == 0 ? 
							questions_spostamenti['tipo-moto']._translations.en.description : 
							questions_spostamenti['tipo-moto'].questions_surveys[0]._translations.en.description)+"*"}}</label>
							<label v-else>{{(questions_spostamenti['tipo-moto'].questions_surveys[0].description == null ? 
							questions_spostamenti['tipo-moto'].description : 
							questions_spostamenti['tipo-moto'].questions_surveys[0].description)+"*"}}</label>
							<b-form-select		
								v-model="meanAnswers[index].type_moto"
								v-on:change="buildCurrResponse"
								:name="`meanAnswers[${index}][type_moto]`"
								:options="options_question_spostamenti['tipo-moto'][language]">
							</b-form-select>
							<!-- <b-form-select	
								v-else					
								v-model="meanAnswers[index].type_moto"
								v-on:change="buildCurrResponse"
								:name="`meanAnswers[${index}][type_moto]`"
								:options="questions_spostamenti['tipo-moto'].questions_surveys[0].options == null? questions_spostamenti['tipo-moto'].options: questions_spostamenti['tipo-moto'].questions_surveys[0].options"
								value-field="name"
								text-field="label">
							</b-form-select> -->
						</b-col>
						<b-col cols="12" v-if="meanAnswers[index].type_moto === 'Personale' || meanAnswers[index].type_moto === 'Personal'">
							<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['alimentazione-moto'].questions_surveys[0]._translations).length == 0 ? 
							questions_spostamenti['alimentazione-moto']._translations.en.description : 
							questions_spostamenti['alimentazione-moto'].questions_surveys[0]._translations.en.description)+"*"}}</label>
							<label v-else>{{(questions_spostamenti['alimentazione-moto'].questions_surveys[0].description == null ? 
							questions_spostamenti['alimentazione-moto'].description : 
							questions_spostamenti['alimentazione-moto'].questions_surveys[0].description)+"*"}}</label>
							<b-form-select							
								v-model="meanAnswers[index].alimentazionemoto"
								v-on:change="buildCurrResponse"
								v-on:input="inputalimentazuinemoto(index)"
								:name="`meanAnswers[${index}]['alimentazione-moto']`"
								:options="options_question_spostamenti['alimentazione-moto'][language]">
							</b-form-select>
							<!-- <b-form-select
								v-else							
								v-model="meanAnswers[index].alimentazionemoto"
								v-on:change="buildCurrResponse"
								v-on:input="inputalimentazuinemoto(index)"
								:name="`meanAnswers[${index}]['alimentazione-moto']`"
								:options="questions_spostamenti['alimentazione-moto'].questions_surveys[0].options ? 
								questions_spostamenti['alimentazione-moto'].questions_surveys[0].options : 
								questions_spostamenti['alimentazione-moto'].options">
							</b-form-select> -->
						</b-col>
						<b-col cols="12" v-if="(meanAnswers[index].type_moto === 'Personale' || meanAnswers[index].type_moto === 'Personal') && moto_electric" >
							<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['emissioni-moto'].questions_surveys[0]._translations).length == 0 ? 
							questions_spostamenti['emissioni-moto']._translations.en.description : 
							questions_spostamenti['emissioni-moto'].questions_surveys[0]._translations.en.description)+"*"}}</label>
							<label v-else>{{(questions_spostamenti['emissioni-moto'].questions_surveys[0].description == null ? 
							questions_spostamenti['emissioni-moto'].description : 
							questions_spostamenti['emissioni-moto'].questions_surveys[0].description)+"*"}}</label>
							<b-form-select						
								v-model="meanAnswers[index].emissioni_moto"
								v-on:change="buildCurrResponse"
								:name="`meanAnswers[${index}][emissioni_moto]`"
								:options="options_question_spostamenti['emissioni-moto'][language]">
							</b-form-select>
							<!-- <b-form-select		
								v-else					
								v-model="meanAnswers[index].emissioni_moto"
								v-on:change="buildCurrResponse"
								:name="`meanAnswers[${index}][emissioni_moto]`"
								:options="questions_spostamenti['emissioni-moto'].questions_surveys[0].options ? 
								questions_spostamenti['emissioni-moto'].questions_surveys[0].options : 
								questions_spostamenti['emissioni-moto'].options">
							</b-form-select> -->
						</b-col>
						<b-col cols="12" v-if="(meanAnswers[index].type_moto === 'Personale' || meanAnswers[index].type_moto === 'Personal') && moto_electric" >
							<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['cilindrata-moto'].questions_surveys[0]._translations).length == 0 ? 
							questions_spostamenti['cilindrata-moto']._translations.en.description : 
							questions_spostamenti['cilindrata-moto'].questions_surveys[0]._translations.en.description)+"*"}}</label>
							<label v-else>{{(questions_spostamenti['cilindrata-moto'].questions_surveys[0].description == null ? 
							questions_spostamenti['cilindrata-moto'].description : 
							questions_spostamenti['cilindrata-moto'].questions_surveys[0].description)+"*"}}</label>
							<b-form-select			
								v-model="meanAnswers[index].cilindratmoto"
								v-on:change="buildCurrResponse"
								:name="`meanAnswers[${index}][cilindratmoto]`"
								:options="options_question_spostamenti['cilindrata-moto'][language]">
							</b-form-select>
							<!-- <b-form-select	
								v-else					
								v-model="meanAnswers[index].cilindratmoto"
								v-on:change="buildCurrResponse"
								:name="`meanAnswers[${index}][cilindratmoto]`"
								:options="questions_spostamenti['cilindrata-moto'].questions_surveys[0].options ? 
								questions_spostamenti['cilindrata-moto'].questions_surveys[0].options : 
								questions_spostamenti['cilindrata-moto'].options">
							</b-form-select> -->
						</b-col>
					</b-form-row>
					<b-form-row v-if="meanAnswers[index].selTransportmean === 'Bike'">
							<b-col cols="12">
								<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['tipo-bici'].questions_surveys[0]._translations).length == 0 ? 
								questions_spostamenti['tipo-bici']._translations.en.description : 
								questions_spostamenti['tipo-bici'].questions_surveys[0]._translations.en.description)+"*"}}</label>
								<label v-else>{{(questions_spostamenti['tipo-bici'].questions_surveys[0].description == null ? 
									questions_spostamenti['tipo-bici'].description : 
									questions_spostamenti['tipo-bici'].questions_surveys[0].description)+"*"}}</label>
								<b-form-select				
									v-model="meanAnswers[index].type_bike"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_bike]`"
									:options="options_question_spostamenti['tipo-bici'][language]">
								</b-form-select>
								<!-- <b-form-select		
									v-else				
									v-model="meanAnswers[index].type_bike"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_bike]`"
									:options="questions_spostamenti['tipo-bici'].questions_surveys[0].options == null? questions_spostamenti['tipo-bici'].options: questions_spostamenti['tipo-bici'].questions_surveys[0].options"
									value-field="name"
									text-field="label">
								</b-form-select> -->
							</b-col>
					</b-form-row>
					<b-form-row v-if="meanAnswers[index].selTransportmean === 'Scooter'">
							<b-col cols="12">
								<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['tipo-monopattino'].questions_surveys[0]._translations).length == 0 ? 
								questions_spostamenti['tipo-monopattino']._translations.en.description : 
								questions_spostamenti['tipo-monopattino'].questions_surveys[0]._translations.en.description)+"*"}}</label>
								<label v-else>{{(questions_spostamenti['tipo-monopattino'].questions_surveys[0].description == null ? 
								questions_spostamenti['tipo-monopattino'].description : 
								questions_spostamenti['tipo-monopattino'].questions_surveys[0].description)+"*"}}</label>
								<b-form-select				
									v-model="meanAnswers[index].type_mono"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_mono]`"
									:options="options_question_spostamenti['tipo-monopattino'][language]">
								</b-form-select>
								<!-- <b-form-select		
									v-else				
									v-model="meanAnswers[index].type_mono"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_mono]`"
									:options="questions_spostamenti['tipo-monopattino'].questions_surveys[0].options == null? questions_spostamenti['tipo-monopattino'].options: questions_spostamenti['tipo-monopattino'].questions_surveys[0].options"
									value-field="name"
									text-field="label">
								</b-form-select> -->
							</b-col>
					</b-form-row>
					<b-form-row v-if="meanAnswers[index].selTransportmean === 'Train'">
							<b-col cols="12">
								<label v-if="language=='en'">{{(Object.keys(questions_spostamenti['tipo-treno'].questions_surveys[0]._translations).length == 0 ? 
								questions_spostamenti['tipo-treno']._translations.en.description : 
								questions_spostamenti['tipo-treno'].questions_surveys[0]._translations.en.description)+"*"}}</label>
								<label v-else>{{(questions_spostamenti['tipo-treno'].questions_surveys[0].description == null ? 
									questions_spostamenti['tipo-treno'].description : 
									questions_spostamenti['tipo-treno'].questions_surveys[0].description)+"*"}}</label>
								<b-form-select					
									v-model="meanAnswers[index].type_treno"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_treno]`"
									:options="options_question_spostamenti['tipo-treno'][language]">
								</b-form-select>
								<!-- <b-form-select	
									v-else					
									v-model="meanAnswers[index].type_treno"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_treno]`"
									:options="questions_spostamenti['tipo-treno'].questions_surveys[0].options == null? questions_spostamenti['tipo-treno'].options: questions_spostamenti['tipo-treno'].questions_surveys[0].options"
									value-field="name"
									text-field="label">
								</b-form-select> -->
							</b-col>
					</b-form-row>
					<b-form-row v-if="meanAnswers[index].selTransportmean === 'On_foot'">
							<b-col cols="12" v-if="mapqs.type_walking">
								<label>{{mapqs.sel_type_walking}}</label>
								<b-form-select						
									v-model="meanAnswers[index].type_walking"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_walking]`"
									:options="mapqs.type_walking"
									value-field="name"
									text-field="label">
								</b-form-select>
							</b-col>
					</b-form-row>
					<b-form-row v-if="meanAnswers[index].selTransportmean === 'Bus/Tram'">
							<b-col cols="12" v-if="mapqs.type_bus">
								<label>{{mapqs.sel_type_bus}}</label>
								<b-form-select						
									v-model="meanAnswers[index].type_bus"
									v-on:change="buildCurrResponse"
									:name="`meanAnswers[${index}][type_bus]`"
									:options="mapqs.type_bus"
									value-field="name"
									text-field="label">
								</b-form-select>
							</b-col>
					</b-form-row>
					
				</b-card-text>
				<hr>
				
				<a href="#" class="card-link float-right text-muted" @click="reset(index)"><b-icon icon="trash-fill" aria-hidden="true" scale="1"></b-icon> {{ mapqs.del }}</a>		
			</b-card>
	</b-form>

	<hr>
		<question-add-mean  :display="displayAddButton" :decript="mapqs.but_descr" @click="displayAddButton = false"></question-add-mean>
		<Transition
		name="custom-classes"
		enter-active-class="animate__animated animate__backInLeft">
	<b-row class="p-3 d-flex" v-if="!displayAddButton">
		<b-col cols="12">
			<h3 v-if="!drawInterchangePoint">
				{{ mapqs.do }} <b>{{ currInterchangeStep }}</b> {{ mapqs.mean }}
				<span class="small text-muted">{{ mapqs.meters }}</span>
			</h3>
		</b-col>

        <b-col class="text-center" cols="12">
			<div class="d-flex flex-wrap justify-content-center align-items-stretch">
			<b-button
				class="mezzo my-2 mx-2 flex-grow-1 h-100"
				:class="equalmeans(mean) ? 'selected-btn' : 'clear-btn'"
				v-for="mean in meansOfTransport"
				:key="mean.name"
				@click="selectMeanOfTransport(mean)"
			>
				<div class="text-center mezzo d-flex flex-column align-items-center justify-content-center h-100">
				<i
					v-if="mean.icon !== undefined"
					:class="`fa fa-${mean.icon.name} fa-3x`"
					:style="`position:relative; left:${mean.icon.left}px`"
				></i>
				<b-img
					v-else
					:src="mean.png"
					:alt="mean.name"
				></b-img>
				<p class="mb-0">
					{{ mean.label }}
				</p>
				</div>
			</b-button>
			</div>
		</b-col>
    </b-row>
	</Transition>
	<br />
	<b-row>
		<b-col>
			<b-button variant="primary" @click="hideOffice((avanti = false))">{{ mapqs.back }}</b-button>
		</b-col>
		<b-col class="text-right">
			<b-button
			:disabled="map_question[0].questions_surveys[0].compulsory_answer && valMeans"
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
			//console.log("currInter: " + this.currInterchangeStep);
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
				//console.log("print step 3");
				setTimeout(() => this.initMapSpostamento(), 500); // attendi un po' affinchè la mappa venga rendered e la relativa reference sia disponibile
			}
		},
		language: async function () {
			//Siamo in italiano di default
			if (this.language == "en") {
					//create an array of objects using options from questions_spostamenti value as key
					const survey = this.questions_spostamenti['alimentazione-auto'].questions_surveys[0];
					const values = survey.options;
					const texts = survey._translations.en.options.split('|');
					let optionsAlimentazioneAuto=  values.map((value, index) => ({
						value,
						text: texts[index]
					}));
					// let optionsAlimentazioneAuto = Object.keys(this.questions_spostamenti['alimentazione-auto'].questions_surveys[0]._translations.en.options).map((key) => {
					// 	return {
					// 		name: this.questions_spostamenti['alimentazione-auto'].questions_surveys[0].options,
					// 		label: this.questions_spostamenti['alimentazione-auto'].questions_surveys[0]._translations.en.options.split('|'),
					// 	}
					// });
					console.log("optionsAlimentazioneAuto", optionsAlimentazioneAuto);
					// 
				}
			},
	},
	data() {
		return {
			displayAddButton: false,
			zoom: 12,
			center: latLng(process.env.VUE_APP_MAP_CENTER_LAT, process.env.VUE_APP_MAP_CENTER_LON),
			currentZoom: 11.5,
			currentCenter: latLng(45.4654219, 9.1859243),
			wms_layers_selezionati: ["CarSharing", "BikeSharing", "P-Ciclabili"],
			casa: {
				address: "",
			},
			// mapqs: null,
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
			auto_electric: true,
			options_question_spostamenti: [],
			moto_electric: true,
			map_question: [{questions_surveys: [{compulsory_answer:false}]}],
			touched: [],
		};
	},
	computed: {
		selectedWmsLayers: function () {
			return this.wms_layers_selezionati.join(",");
		},
		valMeans(){
			let res=false;
			function checkDis(selmean) {
				if(selmean.selTransportmean === 'On_foot'){
					return selmean.distance>0 && selmean.distance <1000 ;
				}else if(selmean.selTransportmean=== 'Bike' ){
					if(selmean.type_bike === 'Bike sharing'){
						return selmean.distance>0 && selmean.distance < 1000 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_bike;
					}else{
						return selmean.distance>0 && selmean.distance < 1000 && selmean.type_bike;
					}
					
				}else{
					if(selmean.selTransportmean=== 'Scooter'){
						return (selmean.distance>0 && selmean.distance < 1000 && selmean.cost>=0 && selmean.cost<=10000   && selmean.type_mono);	
					}else if(selmean.selTransportmean=== 'Train'){
						return (selmean.distance>0 && selmean.distance < 1000 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_treno);	
					}else if(selmean.selTransportmean=== 'Auto'){
						if(selmean.type_auto === 'Personale'){
							return selmean.distance>0 && selmean.distance < 1000 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_auto && 
							selmean.emissioni_auto && selmean.cilindratauto && selmean.alimentazioneauto;
						}else{
							return selmean.distance>0 && selmean.distance < 1000 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_auto;
						}	
					}else if(selmean.selTransportmean=== 'Moto'){
						if(selmean.type_moto === 'Personale'){
							return selmean.distance>0 && selmean.distance < 1000 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_moto && 
							selmean.emissioni_moto && selmean.cilindratmoto && selmean.alimentazionemoto;
						}else{
							return selmean.distance>0 && selmean.distance < 1000 && selmean.cost>=0 && selmean.cost<=10000  && selmean.type_moto;
						}	
					}else{
						return selmean.distance>0 && selmean.distance < 1000 && selmean.cost>=0 && selmean.cost<=10000 ;
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
			// console.log("mapqs");
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
			return (this.meanAnswers[i].distance > 0 && this.meanAnswers[i].distance <= 1000); //
		},
		cosState(i) {
			return (this.meanAnswers[i].cost >= 0  && this.meanAnswers[i].cost <= 100000);
		},
		inputalimentazuineauto(index=null){
			if(index !== null){
				const searchTerm = /Elettrico|Ibrido|electric|hybrid/i;
				if(this.questions_spostamenti != {}){
					if (searchTerm.test(this.meanAnswers[index].alimentazioneauto)) {
						//console.log("The string contains one of the search terms.");
						//console.log("emissioni options",this.qemissioni_auto);
						// if en or it
						//if VUE_APP_THEME = "5t"
						let optionEmissione = 0;
						let optionCilindrata = 0;
						if(process.env.VUE_APP_THEME== "5t"){
							this.auto_electric = false;
							optionEmissione = 6;
							optionCilindrata = 6;
						}
						
						if(this.language == 'en'){
							this.meanAnswers[index].emissioni_auto = 
								this.questions_spostamenti['emissioni-auto'].questions_surveys[0]._translations.en.options ? 
								this.questions_spostamenti['emissioni-auto'].questions_surveys[0]._translations.en.options[optionEmissione] : 
								this.questions_spostamenti['emissioni-auto'].en.options[optionEmissione];
							this.meanAnswers[index].cilindratauto = 
								this.questions_spostamenti['cilindrata-auto'].questions_surveys[0]._translations.en.options ? 
								this.questions_spostamenti['cilindrata-auto'].questions_surveys[0]._translations.en.options[optionCilindrata] : 
								this.questions_spostamenti['cilindrata-auto'].en.options[optionCilindrata];
						}else{
							this.meanAnswers[index].emissioni_auto = 
											this.questions_spostamenti['emissioni-auto'].questions_surveys[0].options ? 
											this.questions_spostamenti['emissioni-auto'].questions_surveys[0].options[optionEmissione] : 
											this.questions_spostamenti['emissioni-auto'].options[optionEmissione];
							this.meanAnswers[index].cilindratauto = 
											this.questions_spostamenti['cilindrata-auto'].questions_surveys[0].options ? 
											this.questions_spostamenti['cilindrata-auto'].questions_surveys[0].options[optionCilindrata] : 
											this.questions_spostamenti['cilindrata-auto'].options[optionCilindrata];
						}
					
					} else {
						this.auto_electric = true;
						//console.log("The string does not contain any of the search terms.");
						this.meanAnswers[index].emissioni_auto = 
								this.questions_spostamenti['emissioni-auto'].questions_surveys[0].options ? 
								this.questions_spostamenti['emissioni-auto'].questions_surveys[0].options[1] : 
								this.questions_spostamenti['emissioni-auto'].en.options[1];
						this.meanAnswers[index].cilindratauto = 
								this.questions_spostamenti['cilindrata-auto'].questions_surveys[0].options ? 
								this.questions_spostamenti['cilindrata-auto'].questions_surveys[0].options[1] : 
								this.questions_spostamenti['cilindrata-auto'].en.options[1];
					}
				}
			} 
		},
		inputalimentazuinemoto(index=null){
			if(index !== null){
				const searchTerm = /Elettrica|Ibrido|electric|hybrid/i;
				if(this.questions_spostamenti != {}){
					if (searchTerm.test(this.meanAnswers[index].alimentazionemoto)) {
					//console.log("The string contains one of the search terms.");
					//console.log("emissioni options",this.qemissioni_moto);
					// if en or it
					//if VUE_APP_THEME = "5t"
					if(process.env.VUE_APP_THEME== "5t"){
							this.moto_electric = false;
						}
					if(this.language == 'en'){
						this.meanAnswers[index].emissioni_moto = 
							this.questions_spostamenti['emissioni-moto'].questions_surveys[0]._translations.en.options ? 
							this.questions_spostamenti['emissioni-moto'].questions_surveys[0]._translations.en.options[0] : 
							this.questions_spostamenti['emissioni-moto'].en.options[0];
						this.meanAnswers[index].cilindratmoto = 
							this.questions_spostamenti['cilindrata-moto'].questions_surveys[0]._translations.en.options ? 
							this.questions_spostamenti['cilindrata-moto'].questions_surveys[0]._translations.en.options[0] : 
							this.questions_spostamenti['cilindrata-moto'].en.options[0];
					}else{
						this.meanAnswers[index].emissioni_moto = 
										this.questions_spostamenti['emissioni-moto'].questions_surveys[0].options ? 
										this.questions_spostamenti['emissioni-moto'].questions_surveys[0].options[0] : 
										this.questions_spostamenti['emissioni-moto'].options[0];
						this.meanAnswers[index].cilindratmoto = 
										this.questions_spostamenti['cilindrata-moto'].questions_surveys[0].options ? 
										this.questions_spostamenti['cilindrata-moto'].questions_surveys[0].options[0] : 
										this.questions_spostamenti['cilindrata-moto'].options[0];
					}
					
					} else {
						this.moto_electric = true;
					//console.log("The string does not contain any of the search terms.");
					this.meanAnswers[index].emissioni_moto = 
							this.questions_spostamenti['emissioni-moto'].questions_surveys[0].options ? 
							this.questions_spostamenti['emissioni-moto'].questions_surveys[0].options[1] : 
							this.questions_spostamenti['emissioni-moto'].en.options[1];
					this.meanAnswers[index].cilindratmoto =
							this.questions_spostamenti['cilindrata-moto'].questions_surveys[0].options ? 
							this.questions_spostamenti['cilindrata-moto'].questions_surveys[0].options[1] : 
							this.questions_spostamenti['cilindrata-moto'].en.options[1];
					}
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
				//console.log("office");
				//console.log(this.sedeLavoro);
				if (avanti) {
					this.step = 3;
				} else {
					this.step = 1;
					// this.$emit("back");
				}
			} else {
				this.step = 2;
			}
			//console.log("office size:");
			//console.log(this.offices);
		},

		setSedeLavoro() {
			this.sedeLavoro = this.offices.find(
				(office) => office.id == this.sedeLavoroId
			);
			//console.log("office");
			//console.log(this.sedeLavoro);
			setTimeout(() => this.initMapSpostamento(), 500); // attendi un po' affinchè la mappa venga rendered e la relativa reference sia disponibile
		},
		reset(index) {
			//console.log("lock modes");
			//console.log(index);
			this.features.pop();
			this.meanAnswers.splice(index, 1);
			//console.log(this.meanAnswers);
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
					console.log("print response", this.casa.latLng);
					if(this.casa.latLng.lat == 0 && this.casa.latLng.lng == 0){
						this.geocodingFailed = true;
						this.geocodingHome = false;
						return;
					}else{
						this.casaMarker = marker(this.casa.latLng, {
							icon: homeIcon,
							draggable: true, // permetto all'utente di correggere la posizione all'occorrenza
						}).addTo(this.$refs.map.mapObject);
						this.$refs.map.mapObject.flyTo(this.casa.latLng, this.zoom);
					}
				} catch (e) {
					this.geocodingFailed = true;
					this.geocodingHome = false;
					//console.log("print error:");
					//console.log(e);
				} finally {
					// this.geocodingHome = false;
					this.geocodingTimeoutId = null;
				}
			}, 800);
		},
		getCurrInterchangeStep() {
			//console.log("print feature");
			//console.log(this.features);
			let currInterchangePointsNum =
        this.features.filter((feature) => feature._path === undefined).length -
        1; // -1 considera il punto di partenza
			//console.log(currInterchangePointsNum);
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
			//console.log(this.selTransportmean);
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
			//console.log("print meanAns: ");

			//console.log(this.meanAnswers);
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
			this.$emit("edit-question", question_id);
		},
		
	},
	async created() {
		try {
			let response = await UserService.getOfficesForSurvey(this.survey_id);
			// if offices are empty set a default value
			// console.log("data", response.data);
			
			this.offices = response.data.offices
			.filter((office) => office.lat && office.lon)
			.map((office) => ({
				...office,
				latLng: latLng(office.lat, office.lon),
			}));

			
			
			// console.log("offices", this.offices);
			

			//Aggiorno la domanda sede con le sedi di questa azienda
			this.updateOfficeQuestion(this.offices);			
			

			// console.log("print languages", this.language);
			// console.log("mapquestion", this.map_question);
			let r = await UserService.getConfig('Questions');
			this.map_question = this.questions.filter(
					(element) => element.id == r.data.data.origine_spostamenti
					);
			if(this.questions.filter(
					(element) => element.id == r.data.data.origine_spostamenti
					).length > 0){
						let rs = await UserService.getConfig('Questions_spos');
						// filter object by rs.data.data using foreach
						
						// Assuming rs.data.data is an object with question IDs as values
						console.log("rs", Object.values(rs.data.data));
						Object.entries(rs.data.data).forEach(async ([key, questionId]) => {
							console.log("questionId", questionId);
							if(key=="quale_distanza" || key=="sede_mappa" 
								|| key=="mezzi" || key=="nr_mezzi" 
								|| key=="mezzo" || key=="quale_distanza_auto" || key=="costo_spostamento"
							){
								return;
							}
							let question = this.questions.find(q => q.id == questionId);
							if (question) {
								// add to questions_spostamenti
								this.questions_spostamenti[question.name] =question;
								const values = question.questions_surveys[0].options;
								if(values == null){
									console.log("values null", question);
								}
								const texts = question.questions_surveys[0]._translations.en.options.split('|');
								this.options_question_spostamenti[question.name] = {};
								this.options_question_spostamenti[question.name]['en']  =  values.map((value, index) => ({
									value,
									text: texts[index]
								}));
								this.options_question_spostamenti[question.name]['it']  =  values.map((value, index) => ({
									value,
									text: value
								}));
								console.log("options_question_spostamenti", this.options_question_spostamenti);


							}
						});
					}
			console.log("questions_spostamenti", this.questions_spostamenti);
			console.log("questions_spostamenti length", Object.keys(this.questions_spostamenti['tipo-auto'].questions_surveys[0]._translations).length);
			console.log("questions_spostamenti length2", Object.keys(this.questions_spostamenti['alimentazione-auto'].questions_surveys[0]._translations).length);
			// //Siamo in italiano di default
			//Siamo in italiano di default
			
			
			// 	let questions = await UserService.getQuestions(this.survey_id,this.language);
			// 	console.log("questions eng", questions);
			// 	this.mapqs = mapqs['en'];
			// 	this.meansOfTransport.forEach((t)=>{
			// 		t.label = mapqs['en']['meansOfTransport'][t.name]
					
			// 	});
				
			// 	this.stepStrings=mapqs['en']['stepStrings'];
			// 	let r = await UserService.getConfig('Questions');
			// 	if(questions.data.survey.questions.filter(
			// 		(element) => element.id == r.data.data.origine_spostamenti
			// 		).length > 0){
			// 			let rs = await UserService.getConfig('Questions_spos');
			// 			// filter object by rs.data.data using foreach
						
			// 			// Assuming rs.data.data is an object with question IDs as values
			// 			Object.values(rs.data.data).forEach(questionId => {
			// 				const question = questions.data.survey.questions.find(q => q.id == questionId);
			// 				if (question) {
			// 					// add to questions_spostamenti
			// 					this.questions_spostamenti[question.name] =question;
			// 				}
			// 			});

			// 			// this.questions_spostamenti = questions.data.survey.questions.filter(
			// 			// 	(element) => element.id == rs.data.data.origine_spostamenti
			// 			// );
			// 			// console.log("questions_spostamenti", this.questions_spostamenti);
			// 			console.log("questions_spostamenti en", this.questions_spostamenti);
			// 			// console.log("emissioni eng", questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "emissioni-auto"
			// 			// )[0].options);
			// 			// console.log("cilindrata-auto", questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "cilindrata-auto"
			// 			// )[0].options);
			// 			// this.qemissioni_auto = JSON.parse(questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "emissioni-auto"
			// 			// )[0].options);
			// 			// this.qemissioni_moto = JSON.parse(questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "emissioni-moto"
			// 			// )[0].options);
			// 			// this.qcilindratauto = JSON.parse(questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "cilindrata-auto"
			// 			// )[0].options);
			// 			// this.qcilindratamoto = JSON.parse(questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "cilindrata-moto"
			// 			// )[0].options);
			// 			// this.qalimentazioneauto = JSON.parse(questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "alimentazione-auto"
			// 			// )[0].options);
			// 			// this.qalimentazionemoto = JSON.parse(questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "alimentazione-moto"
			// 			// )[0].options);
			// 		}

			// } else {
			// 	let questions = await UserService.getQuestions(this.survey_id);
			// 	console.log("questions it", questions);
			// 	this.mapsq = mapqs['it'];
			// 	this.meansOfTransport.forEach((t)=>{
			// 		t.label = mapqs['it']['meansOfTransport'][t.name]
					
			// 	});
			// 	// if exist meansOfTransportSchool add to meansOfTransport
			// 	// if (mapqs['it']['meansOfTransportSchool']) {
			// 	// 	for (let mean of mapqs['it']['meansOfTransportSchool']) {
			// 	// 		this.meansOfTransport.push(mean);
			// 	// 	}
			// 	// }
			// 	// for (let mean of mapqs['it']['meansOfTransportSchool']) {
			// 	// 	this.meansOfTransport.push(mean);
			// 	// }
			// 	// console.log("emissioni", questions.data.survey.questions.filter(
			// 	// 	(element) => element.name == "emissioni-auto"
			// 	// ));
			// 	// TODO: rendere parametrici
			// 	let r = await UserService.getConfig('Questions');
			// 	// console.log("origine_spostamenti", r.data.data.origine_spostamenti);
			// 	// console.log("questions exist", questions.data.survey.questions.filter(
			// 		// (element) => element.id == r.data.data.origine_spostamenti
			// 		// ).length > 0);
			// 	//check empty array

				
			// 	// if origine_spostamenti exist
			// 	if(questions.data.survey.questions.filter(
			// 		(element) => element.id == r.data.data.origine_spostamenti
			// 		).length > 0){
			// 			let rs = await UserService.getConfig('Questions_spos');
			// 			// filter object by rs.data.data using foreach
						
			// 			// Assuming rs.data.data is an object with question IDs as values
			// 			Object.values(rs.data.data).forEach(questionId => {
			// 				const question = questions.data.survey.questions.find(q => q.id == questionId);
			// 				if (question) {
			// 					// add to questions_spostamenti
			// 					this.questions_spostamenti[question.name] =question;
			// 				}
			// 			});

			// 			// console.log("emissioni", questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "emissioni-auto"
			// 			// )[0].options);
			// 			// console.log("cilindrata-auto", questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "cilindrata-auto"
			// 			// )[0].options);
			// 			// this.qemissioni_auto = questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "emissioni-auto"
			// 			// )[0].options;
			// 			// this.qemissioni_moto = questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "emissioni-moto"
			// 			// )[0].options;
			// 			// this.qcilindratauto = questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "cilindrata-auto"
			// 			// )[0].options;
			// 			// this.qcilindratamoto = questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "cilindrata-moto"
			// 			// )[0].options;
			// 			// this.qalimentazioneauto = questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "alimentazione-auto"
			// 			// )[0].options;
			// 			// this.qalimentazionemoto = questions.data.survey.questions.filter(
			// 			// 	(element) => element.name == "alimentazione-moto"
			// 			// )[0].options;
			// 		}
			// }
			//console.log("mapqs fin", this.mapsq);

			
			
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
.mezzo {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
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
/* Custom button styles red*/
.btn-special {
	background-color: #ff0000 !important;
	color: white;
	border: 1px solid #ff0000 !important;
	border-radius: 5px;
	padding: 5px 10px;
	cursor: pointer;
	margin: 5px;
}
.btn-special:hover {
	background-color: #Bf0000 !important;
  	color: white;
}


</style>
