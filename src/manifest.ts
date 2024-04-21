import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

const etsyListingsURL = 'www.etsy.com/your/shops/me/tools/listings/*'

function urlPrefixes(url: string): string[] {
  return [`https://${url}`, `http://${url}`]
}
// matches: [`http${etsyListingsURL}`, `https${etsyListingsURL}`],

// action: {
//   //   default_popup: 'popup.html',
//   default_icon: 'img/logo-48.png',
// },
// options_page: 'options.html',
// devtools_page: 'devtools.html',
// background: {
//   service_worker: 'src/background/index.ts',
//   type: 'module',
// },
// content_scripts: [
//   {
//     matches: ['http://*/*', 'https://*/*'],
//     js: ['src/contentScript/index.ts'],
//   },
// ],
// side_panel: {
//   default_path: 'sidepanel.html',
// },

// // permissions: ['sidePanel', 'storage'],
// permissions: [],
// // chrome_url_overrides: {
// // newtab: 'newtab.html',
// // },

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  background: {
    service_worker: 'src/background/backgroundListeners.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: [...urlPrefixes(etsyListingsURL)],
      js: [
        'src/contentScript/listings/contentListeners.tsx',
        'src/contentScript/listings/index.tsx',
      ],
    },
  ],
  // side_panel: {
  //   default_path: 'sidepanel.html',
  // },
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_icon: 'img/logo-48.png',
  },
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: ['identity', 'sidePanel', 'storage'],
  host_permissions: ['https://api.etsy.com/*', 'https://openapi.etsy.com/*'],
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp3fSbVilf253uJ3TmX83oEhBOjLJOAsgmD/LhE1AjlbjVv/Wrv5Af9h1x0IhORqni6KTGTnUjzR5rrXCi3AQKNH8JFES6nH6n02duPFEK6Bf7zTSr+FnwDxlt/cfVHVc6Ht9ge6SgXeFITiNgZdF1r9ttEj7VYY63FJjZ1IFVYmmS8McATjcFaK/oVgVzUG9D8MP3SQVvulnINarFywXIO8iFR15fpLGhaRBagg8OExI6N+vemX2P5NJ0bPRs5l0TawUqGCaJvBRo0OL4GGecfDJcOMgjR5mDUGa8qq5O+2+WX+XIFc9/SScbgON2s7iSh7mpUN2qrkBvmf+PwOpFQIDAQAB',
})
