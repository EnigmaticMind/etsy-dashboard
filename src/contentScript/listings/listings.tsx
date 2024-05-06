/*global chrome*/
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './listings.css'

import Button from '@mui/joy/Button'
import ButtonGroup from '@mui/joy/ButtonGroup'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'

import packageData from '../../../package.json'
import ContentListenersComponent from '../contentListeners/contentListeners'
import { FetchListingsMessageType, PutListingsMessageType } from '../../constants/global'
import { Table, Typography, styled } from '@mui/joy'
import Papa, { ParseError } from 'papaparse'
import LoadingModalComponent from './loadingModalComponent'
import TextualModalComponent from './textualModal'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

// ListingsComponent main entry point
function ListingsComponent() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [csvErrors, setCsvErrors] = React.useState<Papa.ParseError[]>([])

  const exportCSV = async function () {
    setIsLoading(true)
    try {
      const pathname = document.location.pathname
      const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1)

      let listingID = null
      const params: any = {}
      if (lastSegment.includes(',')) {
        lastSegment.split(',').map((i) => {
          const s: string[] = i.split(':')
          params[s[0]] = s[1]
        })
      } else {
        listingID = lastSegment
      }

      await chrome.runtime.sendMessage(
        {
          type: FetchListingsMessageType,
          state: params['state'] || null,
          listing_id: listingID || null,
        },
        function (response) {
          const csvContent = `data:text/csv;charset=utf-8,${response}`
          const encodedUri = encodeURI(csvContent)
          const link = document.createElement('a')
          link.setAttribute('href', encodedUri)
          link.setAttribute('style', 'display: none;')
          link.setAttribute('download', 'my listings.csv')
          document.body.appendChild(link)
          link.click()
          setIsLoading(false)
        },
      )
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
    }
  }

  const importCSV = function (event: any) {
    setIsLoading(true)
    try {
      Papa.parse(event.target.files[0], {
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ',',
        header: true,
        transformHeader: function (header: string, index: number) {
          return header.toLowerCase().replaceAll(' ', '_')
        },
        newline: '\r\n',
        skipEmptyLines: false,
        encoding: '',
        complete: async function (results: Papa.ParseResult<unknown>) {
          if (results.errors.length > 0) {
            setCsvErrors(results.errors)
            setIsOpen(true)
          } else {
            await chrome.runtime.sendMessage({
              type: PutListingsMessageType,
              rows: results.data,
            })
          }

          setIsLoading(false)
        },
      })
    } catch (err) {
      setIsLoading(false)
    }
    // await chrome.runtime.sendMessage({
    //   action: startLoaderAction,
    // })
    // Papa.parse(event.target.files[0], {
    //   quoteChar: '"',
    //   escapeChar: '"',
    //   delimiter: ',',
    //   header: false,
    //   newline: '\r\n',
    //   skipEmptyLines: false,
    //   complete: function (results: Papa.ParseResult<unknown>) {
    //     if (results.errors) {
    //       results.errors.forEach((error) => {
    //         sendSnackbar(error.message)
    //       })
    //       return
    //     }
    //     console.log(results.data)
    //   },
    // })
    // // await chrome.runtime.sendMessage(
    // //   { type: PutListingsMessageType, uploadedFile: event.target.files[0] },
    // //   function (response) {
    // //     console.log('~~ Finished')
    // //   },
    // // )
    // await chrome.runtime.sendMessage({
    //   action: stopLoaderAction,
    // })
    // console.log('~~ Finished Import')
  }

  return (
    <div className="clearfix mt-xs-2 mb-xs-2">
      <div className="col-xs-12 col-lg-9 col-tv-10">
        <LoadingModalComponent isLoading={isLoading}></LoadingModalComponent>
        <TextualModalComponent isOpen={isOpen} setIsOpen={setIsOpen}>
          <div>
            <Typography id="modal-title" level="h2">
              CSV Errors
            </Typography>
            <br />
            <Table>
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {csvErrors.map((error: ParseError) => {
                  return (
                    <tr>
                      <td>{error.row}</td>
                      <td>{error.message}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </TextualModalComponent>

        <ButtonGroup color="primary">
          <Button startDecorator={<DownloadIcon />} onClick={exportCSV}>
            Download CSV
          </Button>
          <Button
            component="label"
            role={undefined}
            tabIndex={-1}
            variant="outlined"
            startDecorator={<UploadIcon />}
            style={{ display: 'flex' }}
          >
            Upload CSV&nbsp;
            <VisuallyHiddenInput type="file" accept=".csv" onChange={importCSV} />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

const entryPointElm =
  document.querySelector('[class="page-body"]') || document.querySelector('header')

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
