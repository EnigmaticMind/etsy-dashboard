import { clientID } from '../../constants/authentication'
import { etsyBaseURL } from '../../constants/global'
import sendSnackbar, { genericError } from '../actionMessaging'
import fetchEtsyToken, { IToken } from './fetchEtsyToken'
import { IListings } from './fetchListings'
import { IRow } from '../putListingsCsv'

export default async function updateListing(
  listing_id: number,
  shop_id: number,
  row: IRow,
): Promise<IListings> {
  return new Promise(async function (resolve, reject) {
    const token: IToken = await fetchEtsyToken()

    const requestOptions: RequestInit = {
      method: 'PATCH',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': clientID,
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify({
        listing_id: row.listing_id,
        // user_id: 1,
        shop_id,
        title: row.title,
        description: row.description,
        state: 'draft',
        // creation_timestamp: 946684800,
        // created_timestamp: 946684800,
        // ending_timestamp: 946684800,
        // original_creation_timestamp: 946684800,
        // last_modified_timestamp: 946684800,
        // updated_timestamp: 946684800,
        // state_timestamp: 946684800,
        quantity: row.quantity,
        // shop_section_id: 1,
        // featured_rank: 0,
        // url: 'string',
        // num_favorers: 0,
        // non_taxable: true,
        // is_taxable: true,
        // is_customizable: true,
        // is_personalizable: true,
        // personalization_is_required: true,
        // personalization_char_count_max: 0,
        // personalization_instructions: 'string',
        // listing_type: 'physical',
        tags: row.tags.split(','),
        // materials: ['string'],
        // shipping_profile_id: 1,
        // return_policy_id: 1,
        // processing_min: 0,
        // processing_max: 0,
        // who_made: 'i_did',
        // when_made: 'made_to_order',
        // is_supply: true,
        // item_weight: 0,
        // item_weight_unit: 'oz',
        // item_length: 0,
        // item_width: 0,
        // item_height: 0,
        // item_dimensions_unit: 'in',
        // is_private: true,
        // style: ['string'],
        // file_data: 'string',
        has_variations: row.property_name_1 ? true : false,
        // should_auto_renew: true,
        // language: 'string',
        // taxonomy_id: 0,
      }),
    }

    const url = `${etsyBaseURL}shops/${shop_id}/listings/${listing_id}`

    try {
      const response = await fetch(url, requestOptions)

      if (response.ok) {
        resolve((await response.json()) as IListings)
        return
      }

      reject(sendSnackbar((await response.json())?.error) || genericError)
    } catch (err) {
      reject(sendSnackbar(genericError))
    }
  })
}
