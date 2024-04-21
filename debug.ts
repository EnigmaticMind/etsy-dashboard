// function validate(redirectURL) {
//   // validate the access token
// }

// function authorize() {
//   const redirectURL = browser.identity.getRedirectURL();
//   const clientID =
//     "664583959686-fhvksj46jkd9j5v96vsmvs406jgndmic.apps.googleusercontent.com";
//   const scopes = ["openid", "email", "profile"];
//   let authURL = "https://accounts.google.com/o/oauth2/auth";
//   authURL += `?client_id=${clientID}`;
//   authURL += `&response_type=token`;
//   authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
//   authURL += `&scope=${encodeURIComponent(scopes.join(" "))}`;

//   return browser.identity.launchWebAuthFlow({
//     interactive: true,
//     url: authURL,
//   });
// }

// function getAccessToken() {
//   return authorize().then(validate);
// }
