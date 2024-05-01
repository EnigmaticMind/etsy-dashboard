import { rAuthFetchToken } from '../constants/authentication'
import { rFetchListings } from '../constants/global'
import getListings from './getListings'

import { ListingStatus } from './fetchListings'

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  switch (request.type) {
    case rFetchListings:
      getListings(request.state || 'active').then((listings) => sendResponse(listings))
      break
  }

  return true
})
