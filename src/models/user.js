export default class User {
	constructor(username, email, password) {
		this.username = username;
		this.email = email;
		this.password = password;
		this.first_name = "";
		this.last_name = "";
		this.company_id = null;
		this.role = null;
		this.picture = null;
		this.accessToken = null;
		this.id = null;
		this.cf = null;
		this.mobile = null;
		this.badge_number = null;
	}
}
