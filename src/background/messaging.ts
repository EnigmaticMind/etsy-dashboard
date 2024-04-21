import { snackbarAction } from '../constants/global'

export const genericError = 'Problem connecting to etsy try again...'

export const sendSnackbar = async function (message: string) {
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    // TODO: Better handler of no tab?
    const res = await chrome.tabs.sendMessage(tabs[0].id ?? 0, {
      action: snackbarAction,
      message,
    })
  })
  return message
}

export default sendSnackbar

import { rAuthFetchToken } from '../constants/authentication'
import { rFetchListings } from '../constants/global'

import fetchEtsyToken from './fetchEtsyToken/index'
import fetchListings from './fetchListings/index'

chrome.runtime.onMessage.addListener(function (request) {
  console.log(`Receiving request type: ${request.type}`)
  switch (request.type) {
    case rAuthFetchToken:
      fetchEtsyToken()
      break
    case rFetchListings:
      fetchListings()
      break
  }
})
