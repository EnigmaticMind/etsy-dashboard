import fetchEtsyToken from './../fetchEtsyToken'
// import getMe from './../getMe'

// import { listingsURL } from './../../constants/global'
import { sendSnackbar, genericError } from '../messaging'

export default async function fetchListings() {
  return new Promise(async function (resolve, reject) {
    console.log('Begin fetch listings')
    const token = await fetchEtsyToken()

    // await getMe()

    // const requestOptions: RequestInit = {
    //   method: 'GET',
    //   cache: 'no-cache',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     grant_type: 'refresh_token',
    //     client_id: token.refresh_token,
    //     refresh_token: token.refresh_token,
    //   }),
    // }

    // try {
    //   const response = await fetch(listingsURL, requestOptions)
    //   //   const body = await response.json()

    //   //   // Set expiration time
    //   //   body.expires_on = Date.now() + body.expires_in

    //   //   // Extract the access token from the response access_token data field
    //   //   if (response.ok) {
    //   //     await chrome.storage.session.set({ [storageTokenName]: body })
    //   //     resolve(body)
    //   //   }
    // } catch (err) {
    //   reject(sendSnackbar(genericError))
    // }
  })
}
