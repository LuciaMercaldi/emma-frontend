export default {
	filters: {
		/**
         * Vue filter to round the decimal to the given place.
         * http://jsfiddle.net/bryan_k/3ova17y9/
         *
         * @param {String} value    The value string.
         * @param {Number} decimals The number of decimal places.
         */
		round: function (value, decimals) {
			if (!value) {
				value = 0;
			}

			if (!decimals) {
				decimals = 0;
			}

			value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
			return value;
		},
		round2: function (value) {
			if (!value) {
				value = 0;
			}

			let decimals = 2;

			value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
			return value;
		},
	},
};
