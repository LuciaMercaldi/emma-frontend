import XLSX from "xlsx";

class XlsService {
	async read(file) {
		const to_json = (workbook) => {
			var result = {};
			workbook.SheetNames.forEach(function (sheetName) {
				var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
				if (roa.length) result[sheetName] = roa;
			});
			return JSON.stringify(result, 2, 2);
		};
		return new Promise((resolve, reject) => {
			try {
				var reader = new FileReader();
				reader.onload = function (e) {
					try {
						var data = new Uint8Array(e.target.result);
						var workbook = XLSX.read(data, { type: "array" });
						const content = JSON.parse(to_json(workbook));
						resolve(content);
					} catch (e) {
						reject(e);
					}
				};
				try {
					reader.readAsArrayBuffer(file);
				} catch (e) {
					reject(e);
				}
			} catch (e) {
				reject(e);
			}
		});
	}
}

export default new XlsService();
