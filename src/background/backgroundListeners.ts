import { rAuthFetchToken } from '../constants/authentication'
import { rFetchListings } from '../constants/global'
import getListings from './getListings'

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  switch (request.type) {
    case rFetchListings:
      getListings().then((listings) => sendResponse(listings))
      break
  }

  return true
})
