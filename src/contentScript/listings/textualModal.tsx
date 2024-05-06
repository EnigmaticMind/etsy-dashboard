import React, { FC } from 'react'
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
import { popAuthAction } from '../../constants/global'

// TextualModalComponent
const TextualModalComponent: FC<{ children: JSX.Element; isOpen: boolean; setIsOpen: Function }> =
  function ({ children, isOpen, setIsOpen }) {
    const handleClose = function () {
      setIsOpen(false)
    }
    return (
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={isOpen}
        onClose={handleClose}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: '80%',
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          {children}
        </Sheet>
      </Modal>
    )
  }

export default TextualModalComponent
