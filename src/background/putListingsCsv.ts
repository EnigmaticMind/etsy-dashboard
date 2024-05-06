import getMe, { IMe } from './getMe'

import fetchListings, { IListing, IListings, IProduct, ListingStatus } from './fetchListings'
import Papa from 'papaparse'
import sendSnackbar, { startLoader, stopLoader } from './actionMessaging'

interface IRows {
  title: string
  description: string
  sku: string
  status: string
  quantity: string
  tags: string
  price: string
  variation_name_1: string
  variation_option_1: string
  variation_name_2: string
  variation_option_2: string
  variation_sku: string
  variation_quantity: string
  variation_price: string
  variation_enabled: string
  variation_product_id: string
  variation_id_1: string
  variation_option_ids_1: string
  variation_id_2: string
  variation_option_ids_2: string
  listing_id: string
}

export default async function putListingsCsv(rows: IRows) {
  return await new Promise(async function (resolve, reject) {
    try {
      console.log(rows)
      resolve(undefined)
    } catch (err) {
      reject(err)
    }
  })
}
