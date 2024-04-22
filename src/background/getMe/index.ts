import fetchEtsyToken, { IToken } from './../fetchEtsyToken'

import { etsyBaseURL } from './../../constants/global'
import { clientID } from './../../constants/authentication'
import { sendSnackbar, genericError } from '../messaging'

export interface IMe {
  user_id: number
  shop_id: number
}

export default async function getMe(): Promise<IMe> {
  return new Promise(async function (resolve, reject) {
    const token: IToken = await fetchEtsyToken()

    const requestOptions: RequestInit = {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': clientID,
        Authorization: `Bearer ${token.access_token}`,
      },
    }

    try {
      const response = await fetch(`${etsyBaseURL}/users/me`, requestOptions)
      const body = await response.json()

      resolve(body as IMe)
    } catch (err) {
      reject(sendSnackbar(genericError))
    }
  })
}
