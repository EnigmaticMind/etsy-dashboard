/*global chrome*/
import React from 'react'
import ReactDOM from 'react-dom/client'

import Button from '@mui/joy/Button'
import ButtonGroup from '@mui/joy/ButtonGroup'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'

import packageData from '../../../package.json'
import ContentListenersComponent from './contentListeners'
import { rFetchListings } from '../../constants/global'

// ListingsComponent main entry point
function ListingsComponent() {
  const exportCSV = async function () {
    await chrome.runtime.sendMessage({ type: rFetchListings })
  }

  const importCSV = function () {
    console.log('Import CSV')
  }

  return (
    <div className="clearfix mt-xs-2 mb-xs-2">
      <div className="col-xs-12 col-lg-9 col-tv-10">
        <ButtonGroup variant="soft" color="primary">
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
// document
//   .querySelectorAll(`[class="${root.className}"]`)
//   .forEach((e) => e.parentNode?.removeChild(e))

entryPointElm?.prepend(root)

const rootDiv = ReactDOM.createRoot(root)
rootDiv.render(
  <React.StrictMode>
    <ContentListenersComponent />
    <ListingsComponent />
  </React.StrictMode>,
)
