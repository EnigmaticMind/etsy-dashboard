import { FC } from 'react'
import Modal from '@mui/joy/Modal'

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
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </Modal>
    )
  }

export default TextualModalComponent
