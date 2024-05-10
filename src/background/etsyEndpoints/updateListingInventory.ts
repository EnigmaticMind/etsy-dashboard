import { CLIENTID } from '../../constants/authentication'
import { ETSYBASEURL } from '../../constants/global'
import sendSnackbar, { genericError } from '../actionMessaging'
import fetchEtsyToken, { IToken } from './fetchEtsyToken'
import { IListings, IProduct } from './fetchListings'
import { IRow } from '../putListingsCsv'

export async function updateListingInventory(listing_id: number, row: IRow): Promise<IProduct[]> {
  return new Promise(async function (resolve, reject) {
    const token: IToken = await fetchEtsyToken()

    let listingInventoryBody: any = {
      products: [],
      price_on_property: [],
      quantity_on_property: [],
      sku_on_property: [],
    }

    if (row.variations.length <= 0) {
      listingInventoryBody.products.push({
        sku: row.sku,
        property_values: [],
        offerings: [
          {
            price: row.price || 0,
            quantity: row.quantity,
            is_enabled: true,
          },
        ],
      })
    } else {
      const propertyIDs = [
        row.variations[0].property_id_1 || 1,
        row.variations[0].property_id_2 || 2,
      ]
      row.variations.forEach(function (variation, index) {
        listingInventoryBody.products.push({
          sku: variation.property_sku || row.sku,
          property_values: [
            row.variations[0].property_name_1
              ? {
                  property_id: propertyIDs[0],
                  value_ids: [],
                  property_name: row.variations[0].property_name_1,
                  values: [variation.property_option_1],
                }
              : undefined,
            row.variations[0].property_name_2
              ? {
                  property_id: propertyIDs[1],
                  value_ids: [],
                  property_name: row.variations[0].property_name_2,
                  values: [variation.property_option_2],
                }
              : undefined,
          ],
          offerings: [
            {
              price: variation.property_price || row.price || 0,
              quantity: variation.property_quantity || row.quantity,
              is_enabled: true,
            },
          ],
        })

        // Check property on
        if (variation.property_price) listingInventoryBody.price_on_property.push(...propertyIDs)
        if (variation.property_quantity)
          listingInventoryBody.quantity_on_property.push(...propertyIDs)
        if (variation.property_sku) listingInventoryBody.sku_on_property.push(...propertyIDs)
      })

      // Remove duplicates from *_on_property
      listingInventoryBody.price_on_property = [...new Set(listingInventoryBody.price_on_property)]
      listingInventoryBody.quantity_on_property = [
        ...new Set(listingInventoryBody.quantity_on_property),
      ]
      listingInventoryBody.sku_on_property = [...new Set(listingInventoryBody.sku_on_property)]
    }

    const requestOptions: RequestInit = {
      method: 'PUT',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLIENTID,
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify(listingInventoryBody),
    }

    const url = `${ETSYBASEURL}listings/${listing_id}/inventory`

    try {
      const response = await fetch(url, requestOptions)

      if (response.ok) {
        resolve((await response.json())?.products as IProduct[])
        return
      }
      reject(sendSnackbar((await response.json())?.error) || genericError)
    } catch (err) {
      reject(sendSnackbar(genericError))
    }
  })
}
