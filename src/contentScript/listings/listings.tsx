/*global chrome*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import './listings.css'

import Button from '@mui/joy/Button'
import ButtonGroup from '@mui/joy/ButtonGroup'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'

import packageData from '../../../package.json'
import ContentListenersComponent from './contentListeners'
import { rFetchListings } from '../../constants/global'
import { IListing } from '../../background/fetchListings'

function decodeEntities(encodedString: string) {
  var div = document.createElement('div')
  div.innerHTML = encodedString
  div.remove()
  return div.textContent
}

// ListingsComponent main entry point
function ListingsComponent() {
  const exportCSV = async function () {
    // TODO: Pass in listing type to grab
    await chrome.runtime.sendMessage({ type: rFetchListings }, function (response) {
      const headers = [
        'Listing ID',
        'Title',
        'Description',
        'Sku',
        'Status',
        'Quantity',
        'Tags',
        'Price',
      ]

      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += headers.join(',') + '\r\n'
      response.results.forEach((r: IListing) => {
        console.log(r)
        csvContent +=
          [
            r.listing_id,
            `"${decodeEntities(r.title)}"`,
            `"${decodeEntities(r.description)}"`,
            `"${r.skus}"`,
            r.state,
            r.quantity,
            `"${r.tags.join(',')}"`,
            r.price.amount / r.price.divisor,
          ].join(',') + '\r\n'
      })

      // products
      // product_id
      // sku

      // offerings.offering_id
      // offerings.is_enabled -- check true
      // offerings.is_deleted -- check not false
      // offerings.quantity
      // offerings.price.amount.divisor

      // property_values.
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('style', 'display: none;')
      link.setAttribute('download', 'my listings.csv')
      document.body.appendChild(link)

      link.click()
    })
  }

  const importCSV = function () {
    console.log('Import CSV')
  }

  return (
    <div className="clearfix mt-xs-2 mb-xs-2">
      <div className="col-xs-12 col-lg-9 col-tv-10">
        <ButtonGroup color="primary">
          <Button startDecorator={<DownloadIcon />} onClick={exportCSV}>
            Export CSV
          </Button>
          <Button startDecorator={<UploadIcon />} onClick={importCSV}>
            Upload CSV
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

const entryPointElm = document.querySelector('[class="page-body"]')
const root = document.createElement('div')
root.className = `${packageData.name}-container`

// Clean up elements on reload of extension
document
  .querySelectorAll(`[class="${root.className}"]`)
  .forEach((e) => e.parentNode?.removeChild(e))

entryPointElm?.prepend(root)

const rootDiv = ReactDOM.createRoot(root)
rootDiv.render(
  <React.StrictMode>
    <ContentListenersComponent />
    <ListingsComponent />
  </React.StrictMode>,
)
