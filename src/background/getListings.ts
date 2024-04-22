import getMe, { IMe } from './getMe'

import fetchListings, { IListings } from './fetchListings'

export default async function getListings() {
  return await new Promise(async function (resolve) {
    const me: IMe = await getMe()

    const listings: IListings = await fetchListings('draft', me.shop_id)

    resolve(listings)
  })
}
