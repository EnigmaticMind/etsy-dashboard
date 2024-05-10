import getMe from './etsyEndpoints/getMe'

import updateListing from './etsyEndpoints/updateListing'
import { updateListingInventory } from './etsyEndpoints/updateListingInventory'

export interface IRow {
  title: string
  description: string
  sku: string
  status: string
  quantity: number | null
  tags: string
  price: number | null
  product_id: number | null
  currency_code: string
  property_name_1: string
  property_option_1: string
  property_name_2: string
  property_option_2: string
  property_sku: string
  property_quantity: number | null
  property_price: number | null
  property_product_id: number | null
  property_id_1: number | null
  property_option_ids_1: number | null
  property_id_2: number | null
  property_option_ids_2: number | null
  listing_id: number | null
  variations: IRow[]
}

function combineVariations(accumulator: IRow[], currentRow: IRow) {
  const rollingRows: IRow[] = [...accumulator]
  if (currentRow.title) {
    currentRow.variations = []

    // Add itself if it has variation info
    if (currentRow.property_name_1 || currentRow.property_name_2)
      currentRow.variations.push(currentRow)

    rollingRows.push(currentRow)
  } else {
    const lastRow = rollingRows[rollingRows.length - 1]

    if (lastRow) {
      lastRow.variations = [...(lastRow.variations || []), currentRow]
    }
  }
  return rollingRows
}

export default async function putListingsCsv(rows: IRow[]) {
  return await new Promise(async function (resolve, reject) {
    try {
      rows
        // Push variations onto parent
        .reduce(combineVariations, [])
        .forEach(async function (row, index) {
          // Skip this row if no listing id or a variation
          if (!Number.isInteger(row.listing_id) || !row.listing_id) return
          const shop_id = (await getMe()).shop_id
          await updateListing(row.listing_id, shop_id, row)
          await updateListingInventory(row.listing_id, row)
        })
      resolve(undefined)
    } catch (err) {
      reject(err)
    }
  })
}
