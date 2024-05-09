// import { clientID } from '../../constants/authentication'
// import { etsyBaseURL } from '../../constants/global'
// import sendSnackbar, { genericError } from '../actionMessaging'
// import fetchEtsyToken, { IToken } from './fetchEtsyToken'
// import { IListings } from './fetchListings'

// export default async function fetchListingProperties(
//   listing_id: number | null = null,
//   shop_id: number | null,
// ): Promise<any> {
//   return new Promise(async function (resolve, reject) {
//     const token: IToken = await fetchEtsyToken()

//     const requestOptions: RequestInit = {
//       method: 'GET',
//       cache: 'no-cache',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': clientID,
//         Authorization: `Bearer ${token.access_token}`,
//       },
//     }

//     const url = `${etsyBaseURL}listings/${listing_id}/inventory`
//     try {
//       const response = await fetch(url, requestOptions)
//       resolve((await response.json()) as IListings)
//     } catch (err) {
//       reject(sendSnackbar(genericError))
//     }
//   })
// }
