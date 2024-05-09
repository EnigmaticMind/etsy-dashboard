import {
  authScopes,
  clientID,
  codeChallengeMethod,
  stateCode,
  etsyConnectURL,
  etsyTokenURL,
  storageTokenName,
} from '../../constants/authentication'
import { IToken } from './fetchEtsyToken'
import { sendSnackbar, genericError } from '../actionMessaging'

// Start: Code Verifier
function dec2hex(dec: any) {
  return ('0' + dec.toString(16)).substr(-2)
}

function generateCodeVerifier() {
  const array = new Uint32Array(56 / 2)
  crypto.getRandomValues(array)
  return Array.from(array, dec2hex).join('')
}

function sha256(plain: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return crypto.subtle.digest('SHA-256', data)
}

function base64URLEncode(a: ArrayBuffer) {
  let str = ''
  let bytes = new Uint8Array(a)
  let len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i])
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function generateCodeChallengeFromVerifier(codeVerifier: string) {
  const hashed = await sha256(codeVerifier)
  const base64encoded = base64URLEncode(hashed)
  return base64encoded
}
// End: Code Verifier

export default async function beginAuthFlow(): Promise<IToken> {
  return new Promise(async function (resolve, reject) {
    console.log(`Begin Auth Flow`)
    const redirectURL = chrome.identity.getRedirectURL('auth')
    const codeVerifier = generateCodeVerifier()

    const authParams: any = {
      response_type: 'code',
      redirect_uri: redirectURL,
      scope: authScopes.join('%20'),
      client_id: clientID,
      code_challenge: await generateCodeChallengeFromVerifier(codeVerifier),
      code_challenge_method: codeChallengeMethod,
      state: stateCode,
    }

    const url = `${etsyConnectURL}?${Object.keys(authParams)
      .map((k: string) => `${k}=${authParams[k]}`)
      .join('&')}`

    chrome.identity.launchWebAuthFlow({ url, interactive: true }, async function (redirect_url) {
      const url = new URL(redirect_url ?? '')
      const urlSearchParams = new URLSearchParams(url.search)
      const code = urlSearchParams.get('code')
      const state = urlSearchParams.get('state')
      const tokenUrl = etsyTokenURL

      if (state !== stateCode) {
        reject(sendSnackbar(genericError))
      }

      const requestOptions: RequestInit = {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: authParams.client_id,
          redirect_uri: authParams.redirect_uri,
          code: code ?? '',
          code_verifier: codeVerifier,
        }),
      }
      try {
        const response = await fetch(tokenUrl, requestOptions)
        const body = await response.json()

        // Set expiration time
        body.expires_on = Date.now() + body.expires_in * 1000
        console.log(`Response to auth flow ${JSON.stringify(body)}`)

        // Extract the access token from the response access_token data field
        if (response.ok) {
          await chrome.storage.local.set({ [storageTokenName]: body })
          resolve(body)
          return
        }
        reject(sendSnackbar(body?.error || genericError))
      } catch (err) {
        reject(sendSnackbar(genericError))
      }
    })
  })
}
