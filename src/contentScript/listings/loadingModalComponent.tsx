import { FC } from 'react'

import Modal from '@mui/joy/Modal'
import Sheet from '@mui/joy/Sheet'

import './loadingModalComponent.css'

// LoadingModalComponent
const LoadingModalComponent: FC<{ isLoading: boolean }> = function ({ isLoading }) {
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={isLoading}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <div className="loading-bar-container">
          <div className="loading"></div>
          <div id="loading-text">loading</div>
        </div>
      </Sheet>
    </Modal>
  )
}

export default LoadingModalComponent
