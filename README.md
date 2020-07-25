# homework-valuator-frontend

The frontend module of the home work valuator project.
Developed using Vue, using axios to fetch the data from the backend server.

Backend Repository : [homework-valuator-backend](https://github.com/jijojames18/homework-valuator-backend)

Backend also needs to be running for using the application.

Use `npm install` and `npm run serve` to setup the development environment.
Application url will be http(s)://<instance_host>:<instance_port>/<test_id> where `test_id` will be the id of a valid test inside the database.

### Environment variables
VUE_APP_API_ENDPOINT_URL (Rest end point url)  
VUE_APP_I18N_LOCALE (Locale used)  
VUE_APP_I18N_FALLBACK_LOCALE (Fallback locale)

To modify the variables for development purposes, create a new `env.local` file and define the variables with values inside it.

### Localization
Out of the box, the app supports the following languages

• English  
• Malayalam  

To change the default language, modify the environment variables inside the env.local or env file.

To add support for a new language, create a new file with name `<language_shorthand>.json` and place it inside `locales.json`. Copy contents of an exisitng json file and modify the values and restart the npm server.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### See also
#### Libraries used
[Vue Intro](https://vuejs.org/v2/guide/)  
[Vue i18n](https://kazupon.github.io/vue-i18n/)  
[axios](https://github.com/axios/axios)  
[vue2-flip-countdown](https://github.com/philipjkim/vue2-flip-countdown)  
