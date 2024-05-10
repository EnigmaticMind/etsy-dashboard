import { ACTIONSNACKBAR, ACTIONSTARTLOADER, ACTIONSTOPLOADER } from '../constants/global'

export const genericError = 'Problem connecting to Etsy try again...'

export const sendSnackbar = async function (message: string) {
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    // TODO: Better handler of no tab?
    const res = await chrome.tabs.sendMessage(tabs[0].id ?? 0, {
      action: ACTIONSNACKBAR,
      message,
    })
  })
  return message
}

export const startLoader = async function () {
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    // TODO: Better handler of no tab?
    const res = await chrome.tabs.sendMessage(tabs[0].id ?? 0, {
      action: ACTIONSTARTLOADER,
    })
  })
  return true
}

export const stopLoader = async function () {
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    // TODO: Better handler of no tab?
    const res = await chrome.tabs.sendMessage(tabs[0].id ?? 0, {
      action: ACTIONSTOPLOADER,
    })
  })
  return true
}

export default sendSnackbar

// import { rAuthFetchToken } from '../constants/authentication'
// import { MESSAGEFETCHLISTING } from '../constants/global'

// import fetchEtsyToken from './fetchEtsyToken/index'
// import fetchListings from './fetchListings/index'

// chrome.runtime.onMessage.addListener(function (request) {
//   switch (request.type) {
//     case rAuthFetchToken:
//       fetchEtsyToken()
//       break
//   }
// })
