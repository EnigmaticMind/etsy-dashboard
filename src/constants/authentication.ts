export const rAuthFetchToken = 'ETSYAUTHTOKEN'
export const rAuthPermPopUp = 'ETSYAUTHPOP'

export const storageTokenName = 'userToken'

export const authScopes = ['listings_r']
export const clientID = '5q20ft9kbl9f39p2hxaekkdw'
export const codeChallengeMethod = 'S256'
export const stateCode = 'randoapp'

export const etsyConnectURL = 'https://www.etsy.com/oauth/connect'
export const etsyTokenURL = 'https://api.etsy.com/v3/public/oauth/token'

export interface IToken {
  access_token: string
  token_type: string
  expires_in: number
  // Derived value
  expires_on: number
  refresh_token: string
}
