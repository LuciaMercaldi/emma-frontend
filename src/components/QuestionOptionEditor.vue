<template>
    <div class="question-option-editor">
        <div v-if="type != 'array'">
            <div v-for="(option, index) in opts" :key="index">
                <b-input-group size="sm" class="mt-3" :key="index">

					<b-input-group-prepend  v-if="canShowTranslation">
						<b-select size="sm" v-model="lang">
							<b-select-option value="it">it</b-select-option>
							<b-select-option value="en">en</b-select-option>
						</b-select>
					</b-input-group-prepend>

                    <b-form-input v-if="lang=='it'" v-model="opts[index]" v-on:update="emitValue()" :disabled="disabled"></b-form-input>
                    <b-form-input v-else v-model="tt[index]" v-on:update="emitValue()" :disabled="disabled"></b-form-input>

                    <b-input-group-append size="sm">
                        <b-button size="sm" variant="danger" @click="deleteOption(index)" :disabled="disabled"><i class="fa fa-trash"></i></b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <b-button size="sm" @click="addOption()" :disabled="disabled">Aggiungi opzione</b-button>
        </div>

        <div v-if="type == 'array'">
            <b-form-group>
                <label>Abilita "Altro"</label>
                <b-form-checkbox class="float-left" v-model="arrOpts.allowOther" label="Abilita 'Altro'" :disabled="disabled" @change="emitValue()"></b-form-checkbox>
            </b-form-group>
            <div v-for="(optionGroup, index) in arrOpts.groups" :key="index">
                <b-input-group prepend="Gruppo" class="mt-3" size="sm">
					<b-input-group-prepend>
						<b-form-select v-model="lang" v-on:update="emitValue()" :disabled="disabled" size="sm">
								<b-form-select-option value="it">it</b-form-select-option>
								<b-form-select-option value="en">en</b-form-select-option>
						</b-form-select>
					</b-input-group-prepend>
                    <b-form-input v-if="lang=='it'" v-model="optionGroup.label" :disabled="disabled" v-on:update="emitValue()"></b-form-input>
					<b-form-input v-else v-model="tt[index].label" :disabled="disabled" v-on:update="emitValue()"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="danger" @click="deleteArrGroup(index)" :disabled="disabled"><i class="fa fa-trash"></i></b-button>
                    </b-input-group-append>
                </b-input-group>
                <hr />
                <div v-for="(option, optIndex) in optionGroup.options" :key="optIndex">
                    <b-input-group size="sm" class="mt-3" :key="optIndex">
					<b-input-group-prepend>
						<b-form-select v-model="lang" v-on:update="emitValue()" :disabled="disabled" size="sm">
							<b-form-select-option value="it">it</b-form-select-option>
							<b-form-select-option value="en">en</b-form-select-option>
						</b-form-select>
					</b-input-group-prepend>
                        <b-form-input v-if="lang=='it'" v-model="optionGroup.options[optIndex]" v-on:update="emitValue()" :disabled="disabled"></b-form-input>
						<b-form-input v-else v-model="tt[index].options[optIndex]" v-on:update="emitValue()" :disabled="disabled"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="danger" @click="deleteArrOption(index, optIndex)" :disabled="disabled"><i class="fa fa-trash" :disabled="disabled"></i></b-button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
                <b-button size="sm" @click="addArrOption(index)" :disabled="disabled">Aggiungi opzione</b-button>
                <hr />
            </div>
            <b-button variant="outline-primary" size="sm" @click="addArrGroup()" :disabled="disabled">Aggiungi gruppo</b-button>
        </div>
    </div>
</template>
<script>
export default {
	name: "question-option-editor",
	props: {
		value: [Number, String, Array, Object],
		type: String,
		canShowTranslation: Boolean,
		trans: String,
		disabled: Boolean,
	},
	data() {
		return {
			opts: [], // usato se non array
			// tt: [], // usato se non array
			arrOpts: {
				allowOther: false,
				groups: [],
			}, // usato se array
			lang: "it",
		};
	},
	computed: {
		tt: function () {
			if (this.type != "array") {
				return this.trans.split('|');
			} else {
				
				// console.log("json",JSON.parse(this.trans));
				if(this.trans.split('|').length==1){
					return JSON.parse(this.trans)['groups'];
				}else{
					
					// console.log("json", this.trans.split('|').map(pair => pair.split(';'))
					// .map(pair => Object.fromEntries(pair.map(entry => {
					// const [key, value] = entry.split(':');
					// return [key, key === 'label' ? value : value.split(',')];
					// }))));
					return this.trans.split('|').map(pair => pair.split(';'))
					.map(pair => Object.fromEntries(pair.map(entry => {
					const [key, value] = entry.split(':');
					return [key, key === 'label' ? value : value.split(',')];
					})));
				}
			}
		}
	},
	mounted() {
		try {
			const v = { ...this.value };			
			//console.log("v->", v);			
			console.log("Trans->",this.trans);
			console.log("TT->",this.tt);
			if (this.type == "array") {
				this.arrOpts = v;
			} else if (this.type == "single" || this.type == "multiple") {
				this.opts = Object.values(v); //Devo convertire l'oggetto in array
						
			}
		} catch (e) {
			// invalid json
			this.opts = [];
			this.arrOpts = {
				allowOther: false,
				groups: [],
			};
		}		
	},
	methods: {
		emitValue() {
			if (this.type == "array") {
				this.$emit("input", this.arrOpts);
				// console.log("tt->",this.tt);
				const joined = this.tt.map(obj => Object.entries(obj).map(entry => entry.join(':')).join(';')).join('|');
				// console.log("joined->", joined);
				this.$emit("update:trans", joined);
			} else if (this.type == "single" || this.type == "multiple") {
				this.$emit("input", this.opts);
				this.$emit("update:trans", this.tt.join('|'));
				// console.log("trans->",this.tt.join('|'));
			} else {
				this.$emit("input", "");
			}
		},

		addOption() {
			this.opts.push("");
			this.emitValue();
		},
		deleteOption(index) {
			this.opts.splice(index, 1);
			this.tt.splice(index, 1);
			this.emitValue();
		},
		deleteArrGroup(index) {
			this.arrOpts.groups.splice(index, 1);
			this.tt.splice(index, 1);
			this.emitValue();
		},
		deleteArrOption(groupIndex, index) {
			this.arrOpts.groups[groupIndex].options.splice(index, 1);
			this.tt[groupIndex].options.splice(index, 1);
			this.emitValue();
		},
		addArrGroup() {
			this.arrOpts.groups.push({
				label: "",
				options: [],
			});
			this.emitValue();
		},
		addArrOption(groupIndex) {
			this.arrOpts.groups[groupIndex].options.push("");
			this.emitValue();
		},
	},
};
</script>

<style>
.question-option-editor .input-group {
    margin: 2px;
    margin-top: 0 !important;
}
</style>
