import React from 'react'

import Snackbar from '@mui/joy/Snackbar'
import { ACTIONSNACKBAR } from '../../constants/global'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

import { useEffect } from 'react'
import { keyframes } from '@mui/system'

const inAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

const outAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`

function SnackbarComponent() {
  const vertical = 'top'
  const horizontal = 'right'
  const animationDuration = 600

  const [open, setOpen] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  const [cb, setCb] = React.useState<Function>(() => () => console.log('default shouldnt happen'))

  // receiveComponentAction
  function receiveSnack(request: any, _: any, sendResponse: any) {
    console.log(`Receiving component action: ${request.action}`)
    switch (request.action) {
      case ACTIONSNACKBAR:
        setOpen(true)
        setMessage(request.message)
        break
    }

    return true
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(receiveSnack)
    return () => {
      chrome.runtime.onMessage.removeListener(receiveSnack)
    }
  }, [])

  function handleClose() {
    setOpen(false)
  }
  return (
    <Snackbar
      color="danger"
      variant="soft"
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      key={vertical + horizontal}
      autoHideDuration={4000}
      animationDuration={animationDuration}
      sx={{
        ...(open && {
          animation: `${inAnimation} ${animationDuration}ms forwards`,
        }),
        ...(!open && {
          animation: `${outAnimation} ${animationDuration}ms forwards`,
        }),
      }}
    >
      <ErrorOutlineIcon />
      {message}
    </Snackbar>
  )
}

export default SnackbarComponent
