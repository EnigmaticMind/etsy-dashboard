import packageData from '../../package.json'
import './Popup.css'
import { Card, CardContent, Divider, Sheet, Typography } from '@mui/joy'

const isDev = process.env.NODE_ENV == 'development'

export const Popup = () => {
  return (
    <Card variant="soft">
      <CardContent>
        <Typography level="title-md">{`${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`}</Typography>
        <Divider />
        <Typography gutterBottom>
          Welcome to Clipsy! Visit{' '}
          <a href="https://www.etsy.com/your/shops/me/tools/listings" target="_blank">
            your listings
          </a>{' '}
          to find your new import & export CSV buttons.
        </Typography>
        <Typography gutterBottom>
          Please direct any suggestions you may have towards&nbsp;
          <a href="mailto: EnigmaticMind567+clipsy@gmail.com" target="_blank">
            EnigmaticMind567+clipsy@gmail.com
          </a>
          .
        </Typography>
        <Typography level="body-sm">
          The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not
          endorsed or certified by Etsy, Inc.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Popup
