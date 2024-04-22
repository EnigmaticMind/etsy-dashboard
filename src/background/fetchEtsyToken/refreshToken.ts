import { etsyTokenURL, storageTokenName } from '../../constants/authentication'
import { IToken } from './index'
import { clientID } from '../../constants/authentication'
import { sendSnackbar, genericError } from '../messaging'

async function refreshToken(token: IToken): Promise<IToken> {
  return new Promise(async function (resolve, reject) {
    const tokenURL = etsyTokenURL
    console.log(`Refresh token`)

    const requestOptions: RequestInit = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': clientID,
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: token.refresh_token,
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
        await chrome.storage.session.set({ [storageTokenName]: body })
        resolve(body)
      }
    } catch (err) {
      reject(sendSnackbar(genericError))
    }
  })
}

export default refreshToken
