import getMe, { IMe } from './getMe'

import fetchListings, { IListing, IListings, IProduct, ListingStatus } from './fetchListings'
import Papa from 'papaparse'

let decode = (str: any) => {
  if (!(typeof str === 'string' || str instanceof String)) return str
  return str
    .replace(/&#(\d+);/g, function (match, dec) {
      console.log(`${str} -- ${dec} -- ${match}`)
      return String.fromCharCode(dec)
    })
    .replace(/&quot;/g, '"')
}

export default async function getListings(state: ListingStatus = 'draft') {
  return await new Promise(async function (resolve) {
    const me: IMe = await getMe()

    const listings: IListings = await fetchListings(state, me.shop_id)

    console.log(listings)

    const dataFeed: any = []
    const variationHeaders = [
      'Variation Name',
      'Variation Option',
      'Variation Name',
      'Variation Option',
      'Variation SKU',
      'Variation Quantity',
      'Variation Price',
      'Variation Enabled',
      'Variation Product ID',
      'Variation ID',
      'Variation Option IDs',
      'Variation ID',
      'Variation Option IDs',
    ]

    const prefixMainHeaders = ['Title', 'Description', 'Sku', 'Status', 'Quantity', 'Tags', 'Price']

    const mainHeaders = [...prefixMainHeaders, ...variationHeaders, 'Listing ID']

    dataFeed.push(mainHeaders)

    listings.results.forEach((r: IListing) => {
      dataFeed.push(
        [
          r.title,
          r.description,
          r.inventory.sku_on_property.length === 0 ? r.skus : null,
          r.state,
          r.inventory.quantity_on_property.length === 0 ? r.quantity : null,
          r.tags,
          r.inventory.price_on_property.length === 0 ? r.price.amount / r.price.divisor : null,
          ...variationHeaders.map(() => ''),
          r.listing_id,
        ].map((x: any) => decode(x)),
      )

      // dataFeed.push(variationHeaders)

      if (r.has_variations) {
        r.inventory.products.forEach((p: IProduct, i: number) => {
          if (p.is_deleted) return

          const offering = p.offerings.find((o) => !o.is_deleted)

          dataFeed.push(
            [
              ...prefixMainHeaders.map(() => ''),
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
            ].map((x: any) => decode(x)),
          )
        })
      }

      // Add end line separator
      dataFeed.push([])
    })

    resolve(
      Papa.unparse(dataFeed, {
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
  })
}
