<template>
    <div>
        <b-form v-if="loggedUserIsMomaArea || loggedUserIsAdmin">
            <b-form-row>
                <b-col cols="4">
                    <b-form-group>
                        <label>Azienda</label>
                        <v-select size="sm" v-model="company_id" :options="companies" label="name" :reduce="(azienda_id) => azienda_id.id"></v-select>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-button class="mt-4" @click="getEmissioni()" size="sm">Carica emissioni per questa azienda </b-button>
                </b-col>
                <b-col cols="1" v-if="busy">
                    <b-spinner label="Spinning"></b-spinner>
                </b-col>
            </b-form-row>
        </b-form>

        <b-form v-if="form != undefined && renderComponent" @submit.prevent="onSubmit">
            <h1>Calcolo dei KPI</h1>

            <!-- 
              ************************************************************
              ************************************************************
              *******************  1  ************************************
              ************************************************************
              ************************************************************
              -->
            <h2>1 - Passaggio da Auto a Piedi, Bici, Monopattino</h2>
            <table class="table table-striped">
                <thead>
                    <th>Descrizione del dato</th>
                    <th>Unità di Misura</th>
                    <th>Dato</th>
                </thead>

        <tbody>
          <tr>
            <td>Giorni di riduzione</td>
            <td>giorni/anno</td>
            <td><b-input v-model="form.a.gg"></b-input></td>
          </tr>
          <tr>
            <td>Numero previsto di utenti sottratti giornalmente all’uso dell’autovettura con la realizzazione dell’intervento</td>
            <td>utenti/giorno</td>
            <td><b-input v-model="form.a.riduzione_utenti_auto"></b-input></td>
          </tr>
          <tr>
            <td>Tasso Medio Occupazione Auto</td>
            <td>utenti/auto</td>
            <td><b-input v-model="form.a.utenti_auto"></b-input></td>
          </tr>
          <tr>
            <td>Stima della percorrenza media giornaliera evitata da un’autovettura con la realizzazione dell’intervento</td>
            <td>km/auto</td>
            <td><b-input v-model="form.a.riduzione_km_auto"></b-input></td>
          </tr>
          <tr>
            <td>consumo medio di carburante di un’autovettura</td>
            <td>litri/100km</td>
            <td><b-input v-model="form.a.fc_auto"></b-input></td>
          </tr>
          <tr>
            <td>emissione CO<sub>2</sub> per km percorso da auto</td>
            <td>g/km</td>
            <td><b-input v-model="form.a.feCO2_auto"></b-input></td>
          </tr>
          <tr>
            <td>emissione CO per km percorso da auto</td>
            <td>g/km</td>
            <td><b-input v-model="form.a.feCO_auto"></b-input></td>
          </tr>
          <tr>
            <td>emissione NO<sub>x</sub> per km percorso da auto</td>
            <td>g/km</td>
            <td><b-input v-model="form.a.feNOx_auto"></b-input></td>
          </tr>
          <tr>
            <td >emissione PM10 per km percorso da auto</td>
            <td>g/km</td>
            <td><b-input v-model="form.a.fePM10_auto"></b-input></td>
          </tr>
          <tr>
            <td colspan="3">
              <b-button class="float-right" @click="onSubmit()" variant="success">Salva</b-button>
            </td>
          </tr>
        </tbody>
      </table>

            <b-card @force-render="forceRerender()" class="mt-3" header="Indicatori 1 - Passaggio da Auto a Piedi, Bici, Monopattino">
                <table class="table table-striped">
                    <thead>
                        <th>Descrizione del indicatore</th>
                        <th>Unità di Misura</th>
                        <th>Risultato</th>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Riduzione giornaliera delle percorrenze in autovettura privata derivante dalla realizzazione dell’intervento</td>
                            <td>km/giorno</td>
                            <td>{{ impacts.a.riduzione_km_gg_auto | round2 }}</td>
                        </tr>
                        <tr>
                            <td>1 .1 - CALCOLO DELLA RIDUZIONE DEI CONSUMI DI CARBURANTE</td>
                            <td>litri/anno</td>
                            <td>{{ impacts.a.C | round2 }}</td>
                        </tr>
                        <tr>
                            <td>1.2 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: CO<sub>2</sub></td>
                            <td>kg/anno</td>
                            <td>{{ impacts.a.CO2 | round2 }}</td>
                        </tr>
                        <tr>
                            <td>1.3 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: CO</td>
                            <td>kg/anno</td>
                            <td>{{ impacts.a.CO | round2 }}</td>
                        </tr>
                        <tr>
                            <td>1.4 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: NO<sub>x</sub></td>
                            <td>kg/anno</td>
                            <td>{{ impacts.a.NOx | round2 }}</td>
                        </tr>
                        <tr>
                            <td>1.5 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: PM10</td>
                            <td>kg/anno</td>
                            <td>{{ impacts.a.PM10 | round2 }}</td>
                        </tr>
                    </tbody>
                </table>
            </b-card>

            <hr />
            <!-- 
              ************************************************************
              ************************************************************
              *******************  2  ************************************
              ************************************************************
              ************************************************************
              -->

            <h2>2 - Passaggio a Uso Condiviso dell'Auto (Car Sharing e Car Pooling)</h2>
            <table class="table table-striped">
                <thead>
                    <th>Descrizione del dato</th>
                    <th>Unità di Misura</th>
                    <th>Dato</th>
                </thead>

                <tbody>
                    <tr>
                        <td>Giorni di utilizzo del servizio (valore medio annuo)</td>
                        <td>giorni/anno</td>
                        <td><b-input v-model="form.b.gg"></b-input></td>
                    </tr>
                    <tr>
                        <td>Numero previsto di utenti complessivi aderenti al servizio proposto di sharing mobility</td>
                        <td>utenti</td>
                        <td><b-input v-model="form.b.ut"></b-input></td>
                    </tr>
                    <tr>
                        <td>Stima della percorrenza media giornaliera evitata da un’autovettura con la realizzazione dell’intervento</td>
                        <td>km/auto</td>
                        <td><b-input v-model="form.b.riduzione_km_auto"></b-input></td>
                    </tr>
                    <tr>
                        <td>Numero previsto di noleggi giornalieri di veicoli condivisi</td>
                        <td>noleggi/gg</td>
                        <td><b-input v-model="form.b.noleggi_gg"></b-input></td>
                    </tr>
                    <tr>
                        <td>Stima della distanza media percorsa da un veicolo condiviso durante un noleggio</td>
                        <td>km/noleggio</td>
                        <td><b-input v-model="form.b.km_noleggio"></b-input></td>
                    </tr>

                    <tr>
                        <td>consumo medio di carburante dei veicoli condivisi (sharing mobility)</td>
                        <td>litri/100km</td>
                        <td><b-input v-model="form.b.fc_auto_sh"></b-input></td>
                    </tr>
                    <tr>
                        <td>emissione CO<sub>2</sub> per km percorso da veicoli condivisi</td>
                        <td>g/km</td>
                        <td><b-input v-model="form.b.feCO2_auto_sh"></b-input></td>
                    </tr>
                    <tr>
                        <td>emissione CO per km percorso da veicoli condivisi</td>
                        <td>g/km</td>
                        <td><b-input v-model="form.b.feCO_auto_sh"></b-input></td>
                    </tr>
                    <tr>
                        <td>emissione NO<sub>x</sub> per km percorso da veicoli condivisi</td>
                        <td>g/km</td>
                        <td><b-input v-model="form.b.feNOx_auto_sh"></b-input></td>
                    </tr>
                    <tr>
                        <td>emissione PM10 per km percorso da veicoli condivisi</td>
                        <td>g/km</td>
                        <td><b-input v-model="form.b.fePM10_auto_sh"></b-input></td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <b-button class="float-right" @click="onSubmit()" variant="success">Salva</b-button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <b-card class="mt-3" header="Indicatori 2 - Passaggio a Uso Condiviso dell'Auto (Car Sharing e Car Pooling)">
                <table class="table table-striped">
                    <thead>
                        <th>Descrizione del indicatore</th>
                        <th>Unità di Misura</th>
                        <th>Risultato</th>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Riduzione giornaliera delle percorrenze in autovettura privata derivante dalla realizzazione dell’intervento</td>
                            <td>km/giorno</td>
                            <td>{{ impacts.b.riduzione_km_gg_auto | round2 }}</td>
                        </tr>
                        <tr>
                            <td>2.1 - CALCOLO DELLA RIDUZIONE DEI CONSUMI DI CARBURANTE</td>
                            <td>litri/anno</td>
                            <td>{{ impacts.b.C | round2 }}</td>
                        </tr>
                        <tr>
                            <td>2.2 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: CO<sub>2</sub></td>
                            <td>kg/anno</td>
                            <td>{{ impacts.b.CO2 | round2 }}</td>
                        </tr>
                        <tr>
                            <td>2.3 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: CO</td>
                            <td>kg/anno</td>
                            <td>{{ impacts.b.CO | round2 }}</td>
                        </tr>
                        <tr>
                            <td>2.4 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: NO<sub>x</sub></td>
                            <td>kg/anno</td>
                            <td>{{ impacts.b.NOx | round2 }}</td>
                        </tr>
                        <tr>
                            <td>2.5 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: PM10</td>
                            <td>kg/anno</td>
                            <td>{{ impacts.b.PM10 | round2 }}</td>
                        </tr>
                    </tbody>
                </table>
            </b-card>

            <!-- 
              ************************************************************
              ************************************************************
              *******************  3  ************************************
              ************************************************************
              ************************************************************
              -->
            <hr />
            <h2>3 - Sostituzione Flotta con a mezzi a minore impatto</h2>

            <table class="table table-striped">
                <thead>
                    <th>Descrizione del dato</th>
                    <th>Unità di Misura</th>
                    <th>Dato</th>
                </thead>

                <tbody>
                    <tr>
                        <td>Giorni di operatività del intervento</td>
                        <td>giorni/anno</td>
                        <td><b-input v-model="form.c.gg"></b-input></td>
                    </tr>
                    <tr>
                        <td>Percorrenza giornaliera totale dei veicoli da sostituire</td>
                        <td>km/giorno</td>
                        <td><b-input v-model="form.c.km_da_sostituire"></b-input></td>
                    </tr>
                    <tr>
                        <td>Percorrenza giornaliera totale dei veicoli nuovi</td>
                        <td>km/giorno</td>
                        <td><b-input v-model="form.c.km_nuovi"></b-input></td>
                    </tr>

                    <tr>
                        <td>consumo medio di carburante dei veicoli nuovi</td>
                        <td>litri/100km</td>
                        <td><b-input v-model="form.c.fc_auto_nuovi"></b-input></td>
                    </tr>
                    <tr>
                        <td>emissione CO<sub>2</sub> per km percorso da veicoli nuovi</td>
                        <td>g/km</td>
                        <td><b-input v-model="form.c.feCO2_auto_nuovi"></b-input></td>
                    </tr>
                    <tr>
                        <td>emissione CO per km percorso da veicoli nuovi</td>
                        <td>g/km</td>
                        <td><b-input v-model="form.c.feCO_auto_nuovi"></b-input></td>
                    </tr>
                    <tr>
                        <td>emissione NO<sub>x</sub> per km percorso da veicoli nuovi</td>
                        <td>g/km</td>
                        <td><b-input v-model="form.c.feNOx_auto_nuovi"></b-input></td>
                    </tr>
                    <tr>
                        <td>emissione PM10 per km percorso da veicoli nuovi</td>
                        <td>g/km</td>
                        <td><b-input v-model="form.c.fePM10_auto_nuovi"></b-input></td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <b-button class="float-right" @click="onSubmit()" variant="success">Salva</b-button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <b-card class="mt-3" header="Indicatori 3 - Flotta auto a minore impatto">
                <table class="table table-striped">
                    <thead>
                        <th>Descrizione del indicatore</th>
                        <th>Unità di Misura</th>
                        <th>Risultato</th>
                    </thead>

                    <tbody>
                        <tr>
                            <td>3.1 - CALCOLO DELLA RIDUZIONE DEI CONSUMI DI CARBURANTE</td>
                            <td>litri/anno</td>
                            <td>{{ impacts.c.C | round2 }}</td>
                        </tr>
                        <tr>
                            <td>3.2 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: CO<sub>2</sub></td>
                            <td>kg/anno</td>
                            <td>{{ impacts.c.CO2 | round2 }}</td>
                        </tr>
                        <tr>
                            <td>3.3 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: CO</td>
                            <td>kg/anno</td>
                            <td>{{ impacts.c.CO | round2 }}</td>
                        </tr>
                        <tr>
                            <td>3.4 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: NO<sub>x</sub></td>
                            <td>kg/anno</td>
                            <td>{{ impacts.c.NOx | round2 }}</td>
                        </tr>
                        <tr>
                            <td>3.5 - CALCOLO DELLA RIDUZIONE DELLE EMISSIONI: PM10</td>
                            <td>kg/anno</td>
                            <td>{{ impacts.c.PM10 | round2 }}</td>
                        </tr>
                    </tbody>
                </table>
            </b-card>

            <!-- 
              ************************************************************
              ************************************************************
              *******************  4  ************************************
              ************************************************************
              ************************************************************
              -->
            <hr />
            <h2>4 - Stima Emissioni Azienda o Scuola</h2>

            <table class="table table-striped">
                <thead>
                    <th>Descrizione del dato</th>
                    <th>Unità di Misura</th>
                    <th>Dato</th>
                </thead>

                <tbody>
                    <tr>
                        <td>Giorni di attivita all'anno</td>
                        <td>giorni/anno</td>
                        <td><b-input v-model="form.d.gg"></b-input></td>
                    </tr>
                    <tr>
                        <td>Numero di dipendenti (e studenti, nel caso delle scuole):</td>
                        <td>num</td>
                        <td><b-input v-model="form.d.az_nr_dipendenti"></b-input></td>
                    </tr>
                    <tr>
                        <td>
                            Distanza media dello spostamento casa-lavoro (solo andata):<br />
                            <em> Inserire la distanza media percorsa dai dipendenti per lo spostamento casa-lavoro considerando solo l'andata e non il rientro a casa. </em>
                        </td>
                        <td>km/giorno</td>
                        <td><b-input v-model="form.d.az_distanza_spostamenti"></b-input></td>
                    </tr>
                    <tr>
                        <td>
                            Percentuale dei dipendenti (e studenti) che effettua lo spostamento casa-lavoro in auto:

                            <em>Indicare solo i dipendenti che utilizzano l'auto come conducente e non come passeggeri. </em>
                            <br />
                            <em>Per le scuole indicare il numero di studenti che si recano a scuola accompagnati in auto </em>
                            <small class="text-muted">
                                <dl>
                                    <dt>
                                        Città metropolitana di Torino split modale dipendenti- anno riferimento 2014 - fonte: Indagine sul Mobility Management nelle aziende della
                                        provincia di Torino
                                    </dt>
                                    <dd>auto o moto: 74.4%, TPL: 18%, Bici: 1.7%, Piedi: 1.9%, Navetta: 4%</dd>

                                    <dt>Italia split modale - anno riferimento 2017 - fonte: 15° Rapporto sulla mobilità degli italiani ISFORT, 2018</dt>
                                    <dd>auto come conducente: 46.3%, auto come passeggero: 12.3%, moto: 3%, TPL: 7%, bici: 5.2%, Piedi: 22.3%, Multimodalita o altro: 3.9%</dd>
                                    <dt>
                                        Regione Piemonte split modale in ambito urbano - anno riferimento 2011 - fonte: Regione Piemonte - PIANO REGIONALE DELLA MOBILITÀ E DEI
                                        TRASPORTI, Allegato A
                                    </dt>
                                    <dd>auto o moto: 63%, TPL: 20%, Bici: 3%, Piedi: 14%</dd>
                                </dl>
                            </small>
                        </td>
                        <td>%</td>
                        <td><b-input v-model="form.d.az_spostamenti_auto"></b-input></td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <b-button class="float-right" @click="onSubmit()" variant="success">Salva</b-button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <b-card class="mt-3" header="Indicatori 4 - Impatto Azienda o Scuola">
                <table class="table table-striped">
                    <thead>
                        <th>Descrizione del indicatore</th>
                        <th>Unità di Misura</th>
                        <th>Risultato</th>
                    </thead>

                    <tbody>
                        <tr>
                            <td>4.1 - CONSUMI DI CARBURANTE</td>
                            <td>litri/anno</td>
                            <td>{{ impacts.d.C | round2 }}</td>
                        </tr>
                        <tr>
                            <td>4.2 - EMISSIONI: CO<sub>2</sub></td>
                            <td>kg/anno</td>
                            <td>{{ impacts.d.CO2 | round2 }}</td>
                        </tr>
                        <tr>
                            <td>4.3 - EMISSIONI: CO</td>
                            <td>kg/anno</td>
                            <td>{{ impacts.d.CO | round2 }}</td>
                        </tr>
                        <tr>
                            <td>4.4 - EMISSIONI: NO<sub>x</sub></td>
                            <td>kg/anno</td>
                            <td>{{ impacts.d.NOx | round2 }}</td>
                        </tr>
                        <tr>
                            <td>4.5 - EMISSIONI: PM10</td>
                            <td>kg/anno</td>
                            <td>{{ impacts.d.PM10 | round2 }}</td>
                        </tr>
                        <tr>
                            <td>4.6 - EMISSIONI: PM2.5</td>
                            <td>kg/anno</td>
                            <td>{{ impacts.d.PM2_5 | round2 }}</td>
                        </tr>
                    </tbody>
                </table>
            </b-card>
        </b-form>
    </div>
</template>

<script>
import vSelect from "vue-select";
import UserService from "@/services/user.service";
import Util from "@/mixing/util";
import Filters from "@/mixing/filters";
import Emissions from "@/mixing/emissions";
import emissionsConst from "@/data/emissions-const";

export default {
	name: "Emissioni",
	components: {
		vSelect,
	},
	mixins: [Util, Filters, Emissions],
	data() {
		return {
			busy: true,
			companies: [],
			company_id: 0,
			// form: emissionsConst,
			form: null,
			impacts: null,
			test: null,
			renderComponent: false,
		};
	},
	methods: {
		async onSubmit() {
			try {
				await UserService.saveEmissioni(this.company_id, this.form);
				this.getEmissioni();
			} catch (e) {
				//console.log(e);
				this.showError(e);
			}
		},
		forceRerender() {
			// Remove my-component from the DOM
			this.renderComponent = false;

			this.$nextTick(() => {
				// Add the component back in
				this.renderComponent = true;
			});
		},
		async getEmissioni() {
			if (this.company_id == null) {
				//console.log("Nessuna Azienda Selezionata");
				return;
			}
			this.busy = true;
			try {
				let emissionData = await UserService.getEmissioni(this.company_id);
				let emissionImpacts = await UserService.getEmissionImpacts(this.company_id);
				if (emissionData.data.emissioni != null) {
					this.form = emissionData.data.emissioni;
					this.impacts = emissionImpacts.data.emissions_result;
					this.forceRerender();
				} else {
					this.form = { ...emissionsConst };
					this.impacts = { a:{}, b:{}, c:{}, d:{} };
				}
			} catch (e) {
				//console.log(e);
				this.showError(e);
			} finally {
				this.busy = false;
			}
		},
	},

	async created() {
		try {
			const response = await UserService.getCompanyList();

			// Aggiungo l'opzione vuota all'inizio
			response.data.companies.unshift({
				id: 0,
				name: "--- Filtra per azienda  --- ",
			});
			this.companies = response.data.companies;
			this.form = { ...emissionsConst };
            if (this.getUserCompany){
                this.company_id = this.getUserCompany;
            }
            await this.getEmissioni();
			this.impacts = { a:{}, b:{}, c:{}, d:{} }; // response[2].data.emissions_result;
		} catch (e) {
			//console.log(e);
		} finally {
			this.busy = false;
			this.renderComponent = true;
		}
	},

	computed: {},
};
</script>

<style></style>
