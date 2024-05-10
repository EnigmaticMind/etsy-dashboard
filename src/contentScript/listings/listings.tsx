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
import { MESSAGEFETCHLISTING, MESSAGEPUTLISTING } from '../../constants/global'
import { DialogContent, DialogTitle, ModalClose, ModalDialog, Table, styled } from '@mui/joy'
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
    console.log('~~ Export CSV')
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

      console.log(params)
      console.log(listingID)

      await chrome.runtime.sendMessage(
        {
          type: MESSAGEFETCHLISTING,
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
    console.log('~~ Import CSV')
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
        dynamicTyping: true,
        complete: async function (results: Papa.ParseResult<unknown>) {
          if (results.errors.length > 0) {
            setCsvErrors(results.errors)
            setIsOpen(true)
          } else {
            await chrome.runtime.sendMessage({
              type: MESSAGEPUTLISTING,
              rows: results.data,
            })
          }

          setIsLoading(false)
        },
      })
    } catch (err) {
      setIsLoading(false)
    }
  }

  return (
    <div className="clearfix mt-xs-2 mb-xs-2">
      <div className="col-xs-12 col-lg-9 col-tv-10">
        <LoadingModalComponent isLoading={isLoading}></LoadingModalComponent>
        <TextualModalComponent isOpen={isOpen} setIsOpen={setIsOpen}>
          <ModalDialog layout="center">
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <DialogTitle>CSV Errors</DialogTitle>
            <DialogContent>
              <Table stickyHeader>
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
            </DialogContent>
          </ModalDialog>
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
            <VisuallyHiddenInput
              type="file"
              accept=".csv"
              onClick={function (event: any) {
                event.target.value = ''
              }}
              onChange={importCSV}
            />
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
