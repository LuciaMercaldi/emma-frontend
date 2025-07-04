server {
	listen 443 ssl http2;

	server_name emma.5t.torino.it;

	client_max_body_size 8m;

	root "/var/www/vhosts/emma.5t.torino.it/";
	access_log "/var/log/nginx/emma.5t.torino.it-access.log";
	error_log "/var/log/nginx/emma.5t.torino.it-error.log";

	location / {
		try_files $uri /index.html;
	}    
}


server {
	if ($host = emma.5t.torino.it) {
		return 301 https://$host$request_uri;
	} # managed by Certbot

	listen 80;

	server_name emma.5t.torino.it;
	return 404; # managed by Certbot
}