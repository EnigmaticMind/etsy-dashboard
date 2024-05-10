import { CLIENTID } from '../../constants/authentication'
import { ETSYBASEURL } from '../../constants/global'
import sendSnackbar, { genericError } from '../actionMessaging'
import fetchEtsyToken, { IToken } from './fetchEtsyToken'
import { IListings } from './fetchListings'
import { IRow } from '../putListingsCsv'

export interface ICreateListingRequest {
  quantity: number
  title: string
  description: string
  price: number
  who_made: 'i_did' | 'someone_else' | 'collective'
  when_made:
    | 'made_to_order'
    | '2020_2024'
    | '2010_2019'
    | '2005_2009'
    | 'before_2005'
    | '2000_2004'
    | '1990s'
    | '1980s'
    | '1970s'
    | '1960s'
    | '1950s'
    | '1940s'
    | '1930s'
    | '1920s'
    | '1910s'
    | '1900s'
    | '1800s'
    | '1700s'
    | 'before_1700'
  taxonomy_id: number
  shipping_profile_id: number | null
  return_policy_id: number | null
  materials: string[] | null
  shop_section_id: number | null
  processing_min: number | null
  processing_max: number | null
  tags: string[] | null
  styles: string[] | null
  item_weight: number | null
  item_length: number | null
  item_width: number | null
  item_height: number | null
  item_weight_unit: string | null
  item_dimensions_unit: 'in' | 'ft' | 'mm' | 'cm' | 'm' | 'yd' | 'inches' | null
  is_personalizable: boolean
  personalization_is_required: boolean
  personalization_char_count_max: boolean
  personalization_instructions: string
  production_partner_ids: number[] | null
  image_ids: number[] | null
  is_supply: boolean
  is_customizable: boolean
  should_auto_renew: boolean
  is_taxable: boolean
  type: 'physical' | 'download' | 'both'
}

export default async function createListing(shop_id: number, row: IRow): Promise<IListings> {
  return new Promise(async function (resolve, reject) {
    const token: IToken = await fetchEtsyToken()

    const requestOptions: RequestInit = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLIENTID,
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify(<ICreateListingRequest>{
        quantity: row.quantity,
        title: row.title,
        description: row.description,
        price: row.price,
        who_made: 'i_did',
        when_made: '2020_2024',
      }),
    }

    const url = `${ETSYBASEURL}shops/${shop_id}/listings`

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
