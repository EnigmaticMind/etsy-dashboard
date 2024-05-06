import EtsyAuthModalComponent from './etsyAuthModalComponent'
import SnackbarComponent from '../listings/snackbarComponent'

// ContentListeners main entry point
function ContentListenersComponent() {
  return (
    <div>
      <EtsyAuthModalComponent />
      <SnackbarComponent />
    </div>
  )
}

export default ContentListenersComponent
