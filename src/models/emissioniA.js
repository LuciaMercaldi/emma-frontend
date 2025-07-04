export default class emissioniA {
	constructor(gg, riduzione_utenti_auto, riduzione_km_auto) {
		this.gg = gg;
		this.riduzione_utenti_auto = riduzione_utenti_auto;
		this.riduzione_km_auto = riduzione_km_auto;
		//Costanti (pseudo)
		this.utenti_auto = 1.2; //occupazione
		this.fc_auto = 8.69;
		this.feCO2_auto = 163.0846;
		this.feCO_auto = 0.7853;
		this.feNOx_auto = 0.4256;
		this.fePM10_auto = 0.0297;
		this.fePM2_5_auto = 0.0241; //const g/km
	}

	riduzione_km_gg_auto() {
		//Verificare
		let r = (parseFloat(this.riduzione_utenti_auto) * parseFloat(this.riduzione_km_auto)) / this.utenti_auto;
		return r;
	}
	dC() {
		let r = (parseFloat(this.riduzione_km_gg_auto()) * this.fc_auto * parseFloat(this.gg)) / 100;
		return r;
	}
	dCO2() {
		let r = (parseFloat(this.riduzione_km_gg_auto()) * this.feCO2_auto * parseFloat(this.gg)) / 1000;
		return r;
	}
	dCO() {
		let r = (parseFloat(this.riduzione_km_gg_auto()) * this.feCO_auto * parseFloat(this.gg)) / 1000;
		return r;
	}
	dNOx() {
		let r = (parseFloat(this.riduzione_km_gg_auto()) * this.feNOx_auto * parseFloat(this.gg)) / 1000;
		return r;
	}
	dPM10() {
		let r = (parseFloat(this.riduzione_km_gg_auto()) * this.fePM10_auto * parseFloat(this.gg)) / 1000;
		return r;
	}

	//Restituisce tutti i calcoli in forma di unico oggetto
	getOutput() {
		return {
			riduzione_km_gg_auto: this.riduzione_km_gg_auto(),
			C: this.dC(),
			CO: this.dCO(),
			CO2: this.dCO2(),
			NOx: this.dNOx(),
			PM10: this.dPM10(),
		};
	}
}
