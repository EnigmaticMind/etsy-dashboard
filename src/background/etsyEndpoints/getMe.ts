import fetchEtsyToken, { IToken } from './fetchEtsyToken'

import { ETSYBASEURL } from '../../constants/global'
import { CLIENTID } from '../../constants/authentication'
import { sendSnackbar, genericError } from '../actionMessaging'

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
        'x-api-key': CLIENTID,
        Authorization: `Bearer ${token.access_token}`,
      },
    }

    try {
      const response = await fetch(`${ETSYBASEURL}/users/me`, requestOptions)
      const body = await response.json()

      if (response.ok) {
        resolve(body as IMe)
        return
      }

      reject(sendSnackbar(body?.error) || genericError)
    } catch (err) {
      reject(sendSnackbar(genericError))
    }
  })
}
