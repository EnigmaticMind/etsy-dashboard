import fetchEtsyToken from './../fetchEtsyToken'

import { etsyBaseURL } from './../../constants/global'
import { clientID } from './../../constants/authentication'
import { sendSnackbar, genericError } from '../messaging'

export default async function getMe() {
  return new Promise(async function (resolve, reject) {
    console.log('Begin get me')
    const token = await fetchEtsyToken()

    const requestOptions: RequestInit = {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': clientID,
        // Scoped endpoints require a bearer token
        Authorization: `Bearer ${token.access_token}`,
      },
    }

    try {
      const response = await fetch(`${etsyBaseURL}/users/me`, requestOptions)
      const body = await response.json()

      console.log(`Get ME response`)
      console.log(body)

      resolve(body)

      //   //   // Set expiration time
      //   //   body.expires_on = Date.now() + body.expires_in

      //   //   // Extract the access token from the response access_token data field
      //   //   if (response.ok) {
      //   //     await chrome.storage.session.set({ [storageTokenName]: body })
      //   //     resolve(body)
      //   //   }
    } catch (err) {
      reject(sendSnackbar(genericError))
    }
  })
}
