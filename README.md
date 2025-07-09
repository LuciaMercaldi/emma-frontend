# FRONTEND of the EMMA Mobility Management Platform

# Project Description
EMMA is a web-based application designed and developed by 5T on behalf of Regione Piemonte: it helps the Mobility Manager to draw up the Sustainable Mobility Plan which aims to reduce the negative impacts of commuting trips.
It is a web application, composed by a backend (this repository - written in PHP using the CakePHP frameworkd) and a frontend (EMMA-Vue, written in Vue.js 2.0).
The backend is a REST API, which provides all the necessary functions to run the application.
The frontend is a Single Page Application, which consumes the REST API.

# Prerequisites
Node.js version 14+

# Configurations
- The software is configured through a .env file which must be placed in the root folder of the project. (The .env file is well documented and contains all the necessary information to configure the application)
- In particular you have to set the url of the backend API (VUE_APP_ROOT)

# Plugins
- Plugins can be stored in the /src/extra/ folder and they will be automatically loaded by the application.
- The name of the used plugins should be set in the .env valiable VUE_APP_EXTRA_MODULES

# Deployment
- The frontend is a simple static SPA (Singe Page Application).
- On your development environment just run ``npm run build`` in order to create the dist folder.
- Then copy the dist folder to a static HTTP server and you are done.

## Docker Deployment
- In the root folder you find a Dockerfile which should help you to setup the environment.

# Versioning
1.25.0701

# Authors
# Authors
Regione Piemonte - Settore Mobilità  e Trasporti

5T - Settore Mobilità  Sostenibile 5T


# Copyrights (Mandatory)
© Copyright Regione Piemonte 


# License
SPDX-License-Identifier: EUPL-1.2
See the LICENSE.txt file for details

# Community site
https://github.com/5Tsrl/emma-frontend.git

