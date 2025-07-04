export default class emissioniB {
	constructor(gg, riduzione_km_auto, utenti_sharing, percorrenza_media_evitata, noleggi_gg) {
		this.gg = gg;
		this.riduzione_km_auto = riduzione_km_auto;
		this.utenti_sharing = utenti_sharing;
		this.percorrenza_media_evitata = percorrenza_media_evitata;
		this.noleggi_gg = noleggi_gg;

		//Costanti (pseudo)
		this.utenti_auto = 1.2; //occupazione
		this.fc_auto = 8.69;
		this.feCO2_auto = 163.0846;
		this.feCO_auto = 0.7853;
		this.feNOx_auto = 0.4256;
		this.fePM10_auto = 0.0297;
		this.fePM2_5_auto = 0.0241; //const g/km
		this.km_noleggio = 25;
		this.fc_auto_sh = 8.69;
		this.feCO2_auto_sh = 163.0846;
		this.feCO_auto_sh = 0.7853;
		this.feNOx_auto_sh = 0.4256;
		this.fePM10_auto_sh = 0.0297;
	}

	bTot_km_sh() {
		return parseFloat(this.noleggi_gg) * parseFloat(this.km_noleggio);
	}
	briduzione_km_gg_auto() {
		return parseFloat(this.utenti_sharing * this.riduzione_km_auto);
	}
	bdC() {
		return (
			(parseFloat(this.briduzione_km_gg_auto()) * this.fc_auto * parseFloat(this.gg)) / 100 - (this.bTot_km_sh() * parseFloat(this.fc_auto_sh) * parseFloat(this.gg)) / 100
		);
	}
	bdCO2() {
		return (
			(parseFloat(this.briduzione_km_gg_auto()) * this.feCO2_auto * parseFloat(this.gg)) / 1000 -
            (this.bTot_km_sh() * parseFloat(this.feCO2_auto_sh) * parseFloat(this.gg)) / 1000
		);
	}
	bdCO() {
		return (
			(parseFloat(this.briduzione_km_gg_auto()) * this.feCO_auto * parseFloat(this.gg)) / 1000 -
            (this.bTot_km_sh() * parseFloat(this.feCO_auto_sh) * parseFloat(this.gg)) / 1000
		);
	}
	bdNOx() {
		return (
			(parseFloat(this.briduzione_km_gg_auto()) * this.feNOx_auto * parseFloat(this.gg)) / 1000 -
            (this.bTot_km_sh() * parseFloat(this.feNOx_auto_sh) * parseFloat(this.gg)) / 1000
		);
	}
	bdPM10() {
		let r =
            (parseFloat(this.briduzione_km_gg_auto()) * this.fePM10_auto * parseFloat(this.gg)) / 1000 -
            (this.bTot_km_sh() * parseFloat(this.fePM10_auto_sh) * parseFloat(this.gg)) / 1000;
		return r;
	}

	//Restituisce tutti i calcoli in forma di unico oggetto
	getOutput() {
		return {
			riduzione_km_gg_auto: this.briduzione_km_gg_auto(),
			C: this.bdC(),
			CO: this.bdCO(),
			CO2: this.bdCO2(),
			NOx: this.bdNOx(),
			PM10: this.bdPM10(),
		};
	}
}
