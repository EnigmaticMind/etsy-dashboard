import React from 'react'
import { useEffect } from 'react'

import Button from '@mui/joy/Button'
import ButtonGroup from '@mui/joy/ButtonGroup'
import Divider from '@mui/joy/Divider'
import Grid from '@mui/joy/Grid'
import Modal from '@mui/joy/Modal'
import ModalClose from '@mui/joy/ModalClose'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { ACTIONPOPAUTH } from '../../constants/global'

// EtsyAuthModalComponent
function EtsyAuthModalComponent() {
  const [open, setOpen] = React.useState<boolean>(false)
  const [cb, setCb] = React.useState<Function>(() => () => console.log('default shouldnt happen'))

  // receiveComponentAction
  function receiveComponentAction(request: any, _: any, sendResponse: any) {
    return new Promise(function (resolve, reject) {
      switch (request.action) {
        case ACTIONPOPAUTH:
          setOpen(true)
          setCb(() => (tx: any) => {
            resolve(sendResponse(tx))
          })
          break
      }
    })
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(receiveComponentAction)
    return () => {
      chrome.runtime.onMessage.removeListener(receiveComponentAction)
    }
  }, [])

  function handleClose() {
    setOpen(false)
  }

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={handleClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 500,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography id="modal-title" level="h2">
          Access Shop Data
        </Typography>
        <Divider orientation="horizontal" />
        <Typography id="modal-desc" level="body-md">
          This action requires permission for your computer to retrieve information from the
          official Etsy API. At no point is this information accessible to the author of this
          extension, it's strictly between you and Etsy.
        </Typography>
        <br />
        <Grid container justifyContent="flex-end">
          <ButtonGroup>
            <Button
              color="primary"
              onClick={() => {
                cb('simple debug message back to caller')
                handleClose()
              }}
              variant="soft"
              startDecorator={<LockOpenIcon />}
            >
              Authenticate With Etsy
            </Button>
            <Button color="neutral" onClick={handleClose} variant="soft">
              Cancel
            </Button>
          </ButtonGroup>
        </Grid>
      </Sheet>
    </Modal>
  )
}

export default EtsyAuthModalComponent
