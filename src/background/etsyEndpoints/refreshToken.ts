import { ETSYTOKENURL, STORAGETOKENNAME } from '../../constants/authentication'
import { IToken } from './fetchEtsyToken'
import { CLIENTID } from '../../constants/authentication'
import { sendSnackbar, genericError } from '../actionMessaging'

async function refreshToken(token: IToken): Promise<IToken | null> {
  return new Promise(async function (resolve, reject) {
    const tokenURL = ETSYTOKENURL
    console.log(`Refresh token`)

    const requestOptions: RequestInit = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLIENTID,
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: CLIENTID,
        refresh_token: token.refresh_token,
      }),
    }

    try {
      const response = await fetch(tokenURL, requestOptions)
      const body = await response.json()

      // Set expiration time
      body.expires_on = Date.now() + body.expires_in

      // Extract the access token from the response access_token data field
      if (response.ok) {
        await chrome.storage.local.set({ [STORAGETOKENNAME]: body })
        resolve(body)
        return
      }
      reject(sendSnackbar(body?.error) || genericError)
    } catch (err) {
      reject(sendSnackbar(genericError))
    }
  })
}

export default refreshToken
