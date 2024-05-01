import fetchEtsyToken, { IToken } from './../fetchEtsyToken'

// import { listingsURL } from './../../constants/global'
import { sendSnackbar, genericError } from '../messaging'
import { clientID } from '../../constants/authentication'
import { etsyBaseURL } from '../../constants/global'

enum Languages {
  'en-US',
}

export type ListingStatus = 'active' | 'inactive' | 'sold_out' | 'draft' | 'expired'

export interface IListings {
  count: number
  results: IListing[]
}

export interface IProduct {
  product_id: number
  sku: string
  is_deleted: boolean
  offerings: {
    offering_id: number
    quantity: number
    is_enabled: boolean
    is_deleted: boolean
    price: {
      amount: number
      divisor: number
      currency_code: string
    }
  }[]
  property_values: IPropertyValue[]
}

export interface IPropertyValue {
  property_id: number
  property_name: string
  scale_id: number | null
  scale_name: string | null
  value_ids: number[]
  values: string[]
}

export interface IListing {
  created_timestamp: number
  creation_timestamp: number
  description: string
  // When the listing ends
  ending_timestamp: string
  featured_rank: number
  file_data: string
  has_variations: boolean
  images: any
  inventory: {
    products: IProduct[]
    price_on_property: number[]
    quantity_on_property: number[]
    sku_on_property: number[]
  }
  is_customizable: boolean
  is_personalizable: boolean
  is_private: boolean
  is_supply: boolean
  is_taxable: boolean
  item_dimensions_unit: any
  item_height: any
  item_length: any
  item_weight: any
  item_weight_unit: any
  item_width: any
  language: Languages
  last_modified_timestamp: number
  listing_id: number
  listing_type: string
  materials: any[]
  non_taxable: boolean
  num_favorers: number
  original_creation_timestamp: number
  personalization_char_count_max: number | null
  personalization_instructions: any
  personalization_is_required: boolean
  price: {
    amount: number
    divisor: number
    currency_code: string
  }
  processing_max: number
  processing_min: number
  production_partners: {
    production_partner_id: number
    partner_name: string
    location: string
  }[]
  quantity: number
  return_policy_id: number
  shipping_profile: any
  shipping_profile_id: number
  shop: any
  shop_id: number
  shop_section_id: number
  should_auto_renew: boolean
  skus: string[]
  state: ListingStatus
  state_timestamp: number
  style: any[]
  tags: string[]
  taxonomy_id: number
  title: string
  translations: any
  updated_timestamp: number
  url: string
  user: any
  user_id: number
  videos: any
  views: number
  when_made: string
  who_made: string
}

// TODO: Adjust this based on input
export default async function fetchListings(
  state: ListingStatus = 'draft',
  shop_id: number,
): Promise<IListings> {
  return new Promise(async function (resolve, reject) {
    const token: IToken = await fetchEtsyToken()

    const requestOptions: RequestInit = {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': clientID,
        Authorization: `Bearer ${token.access_token}`,
      },
    }

    try {
      const response = await fetch(
        `${etsyBaseURL}shops/${shop_id}/listings?` +
          new URLSearchParams({
            state,
            includes: 'Inventory',
          }),
        requestOptions,
      )
      resolve((await response.json()) as IListings)
    } catch (err) {
      reject(sendSnackbar(genericError))
    }
  })
}
