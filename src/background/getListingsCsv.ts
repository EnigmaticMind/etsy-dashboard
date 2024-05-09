import getMe, { IMe } from './etsyEndpoints/getMe'

import fetchListings, {
  IListing,
  IListings,
  IProduct,
  ListingStatus,
} from './etsyEndpoints/fetchListings'
import Papa from 'papaparse'

let decode = (str: any) => {
  if (!(typeof str === 'string' || str instanceof String)) return str
  return str
    .replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec)
    })
    .replace(/&quot;/g, '"')
}

function variationData(r: IListing, p: IProduct, i: number): Object[] {
  const offering = p.offerings.find((o) => !o.is_deleted)

  return [
    i === 0 ? p.property_values[0]?.property_name : null,
    p.property_values[0]?.values.join(','),
    i === 0 ? p.property_values[1]?.property_name : null,
    p.property_values[1]?.values.join(','),
    r.inventory.sku_on_property.length > 0 ? p?.sku : null,
    r.inventory.quantity_on_property.length > 0 ? offering?.quantity : null,
    r.inventory.price_on_property.length > 0
      ? +(offering?.price?.amount || 0) / +(offering?.price?.divisor || 0)
      : null,
    offering?.is_enabled,
    p.product_id,
    i === 0 ? p.property_values[0]?.property_id : null,
    p.property_values[0]?.value_ids.join(','),
    i === 0 ? p.property_values[1]?.property_id : null,
    p.property_values[1]?.value_ids.join(','),
  ].map((x: any) => decode(x))
}

export default async function getListingsCsv(
  state: ListingStatus = null,
  listing_id: string | null,
) {
  return await new Promise(async function (resolve, reject) {
    try {
      const listings: IListings = await fetchListings(
        state,
        listing_id,
        !listing_id ? (await getMe()).shop_id : null,
      )

      const csvSheet: any = []
      const headerSegments = [
        // Start segment array
        ['Title', 'Description', 'SKU', 'Status', 'Quantity', 'Tags', 'Price', 'Currency Code'],
        // Variation segment array
        [
          'Property Name 1',
          'Property Option 1',
          'Property Name 2',
          'Property Option 2',
          'Property SKU',
          'Property Quantity',
          'Property Price',
          'Property Is Enabled',
          'Property Product ID',
          'Property ID 1',
          'Property Option IDs 1',
          'Property ID 2',
          'Property Option IDs 2',
        ],
        // Ending segment array
        ['Product ID', 'Listing ID'],
      ]

      csvSheet.push(headerSegments.flat(2))

      listings.results.forEach((r: IListing) => {
        let row: any[] = [
          r.title,
          r.description,
          r.inventory.sku_on_property.length === 0 ? r.inventory?.products[0]?.sku : null,
          r.state,
          r.inventory.quantity_on_property.length === 0 ? r.quantity : null,
          r.tags,
          r.inventory.price_on_property.length === 0 ? r.price.amount / r.price.divisor : null,
          r.inventory.price_on_property.length === 0 ? r.price.currency_code : null,
        ]

        const trailingData = [
          r.has_variations
            ? null
            : r.inventory.products.find((p: IProduct) => !p.is_deleted)?.product_id,
          r.listing_id,
        ]
        // If it has variations
        if (r.has_variations) {
          r.inventory.products.forEach((p: IProduct, i: number) => {
            if (p.is_deleted) return

            // Just add data for the first record and ending data
            if (i === 0) {
              row.push(...variationData(r, p, i), ...trailingData)
            } else {
              // Other records need padding in the front and behind
              row = [
                ...headerSegments[0].map(() => ''),
                ...variationData(r, p, i),
                ...headerSegments[2].map(() => ''),
              ]
            }

            // Push row to sheet
            csvSheet.push(row.map((x: any) => decode(x)))
          })
        } else {
          // Add spacing for variation data and finish with trailing data.
          row.push(...headerSegments[1].map(() => ''), ...trailingData)
          // Push row to sheet
          csvSheet.push(row.map((x: any) => decode(x)))
        }
      })

      resolve(
        Papa.unparse(csvSheet, {
          quotes: false,
          quoteChar: '"',
          escapeChar: '"',
          delimiter: ',',
          header: false,
          newline: '\r\n',
          skipEmptyLines: false,
          columns: undefined,
        }),
      )
    } catch (err) {
      reject(err)
    }
  })
}
