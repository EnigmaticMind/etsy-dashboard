import { MESSAGEFETCHLISTING, MESSAGEPUTLISTING } from '../constants/global'
import getListingsCsv from './getListingsCsv'
import putListingsCsv from './putListingsCsv'

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  switch (request.type) {
    case MESSAGEFETCHLISTING:
      getListingsCsv(request.state || null, request.listing_id || null).then((listings) =>
        sendResponse(listings),
      )
      break
    case MESSAGEPUTLISTING:
      putListingsCsv(request.rows).then((json) => sendResponse(json))
      break
  }

  return true
})
