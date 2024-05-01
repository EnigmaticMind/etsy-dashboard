import { rAuthPermPopUp, storageTokenName } from '../../constants/authentication'
import beginAuthFlow from './beginAuthFlow'
import refreshToken from './refreshToken'

export interface IToken {
  access_token: string
  token_type: string
  expires_in: number
  // Derived value
  expires_on: number
  refresh_token: string
}

// requestAuthPopup
async function requestAuthPopup() {
  return new Promise(function (resolve) {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      // TODO: Better handler of no tab?
      const res = await chrome.tabs.sendMessage(tabs[0].id ?? 0, {
        action: rAuthPermPopUp,
      })

      console.log(`Pop up response`)
      console.log(res)
      resolve(res)
    })
  })
}

export default async function fetchEtsyToken(): Promise<IToken> {
  return new Promise(async function (resolve) {
    // Check session storage first for token
    const res = await (chrome.storage.session.get() as Promise<any>)
    let token = res[storageTokenName] as IToken

    if (token?.expires_on && token.expires_on <= Date.now()) {
      console.log(`Need to refresh token expired on ${token.expires_on}, currently ${Date.now()}`)
      token = await refreshToken(token)
    }

    if (!token?.access_token) {
      // Send request for user permissions
      console.log(`Request auth pop up`)
      await requestAuthPopup()

      console.log('Continue auth flow')
      token = await beginAuthFlow()
    }

    resolve(token)
  })
}
