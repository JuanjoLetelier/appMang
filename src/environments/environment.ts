// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebaseConfig : {
    apiKey: "AIzaSyAY2lJjY_8rgXXXn_0PgqOrzuDinHv0PRw",
    authDomain: "isekaiapp.firebaseapp.com",
    projectId: "isekaiapp",
    storageBucket: "isekaiapp.appspot.com",
    messagingSenderId: "515031612956",
    appId: "1:515031612956:web:1e481264b943b8c82da9d9"
  },

  baseUrl: 'https://maps.googleapis.com/maps/api/timezone/outputFormat?parameters'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
