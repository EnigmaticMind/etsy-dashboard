import { useState, useEffect } from 'react'

import './Popup.css'
import { Sheet, Typography } from '@mui/joy'

export const Popup = () => {
  return (
    <main>
      <Typography id="modal-title" level="h2">
        Clipsy
      </Typography>
      <ul>
        <li>Etsy Disclaimer</li>
        <li>Subscription Info</li>
        <li>Support Info</li>
      </ul>
    </main>
    // <div>
    //
    // </div>
  )
}

export default Popup
