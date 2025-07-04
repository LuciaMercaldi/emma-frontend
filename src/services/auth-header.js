export default function authHeader() {
	let user = window.$cookies.get("user");
	if (user && user.accessToken) {
		return { Authorization: "Bearer " + user.accessToken };
	} else {
		return {};
	}
}