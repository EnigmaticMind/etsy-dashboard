/*global chrome*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import './listings.css'

import Papa from 'papaparse'

import Button from '@mui/joy/Button'
import ButtonGroup from '@mui/joy/ButtonGroup'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'

import packageData from '../../../package.json'
import ContentListenersComponent from './contentListeners'
import { rFetchListings } from '../../constants/global'
import { IListing, IProduct } from '../../background/fetchListings'

// ListingsComponent main entry point
function ListingsComponent() {
  const exportCSV = async function () {
    const pathname = document.location.pathname
    const params: any = {}
    pathname
      .substring(pathname.lastIndexOf('/') + 1)
      .split(',')
      .map((i) => {
        const s: string[] = i.split(':')
        params[s[0]] = s[1]
      })

    await chrome.runtime.sendMessage(
      { type: rFetchListings, state: params['state'] || 'active' },
      function (response) {
        const csvContent = `data:text/csv;charset=utf-8,${response}`

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('style', 'display: none;')
        link.setAttribute('download', 'my listings.csv')
        document.body.appendChild(link)

        link.click()
      },
    )
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
