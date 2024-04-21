import { rAuthFetchToken } from '../constants/authentication'
import { rFetchListings } from '../constants/global'

import fetchEtsyToken from './fetchEtsyToken/index'
import fetchListings from './fetchListings/index'

chrome.runtime.onMessage.addListener(async function (request, _, sendResponse) {
  console.log(`Receiving request type: ${request.type}`)
  switch (request.type) {
    case rAuthFetchToken:
      sendResponse(await fetchEtsyToken())
      break
    case rFetchListings:
      sendResponse(await fetchListings())
      break
  }
})
