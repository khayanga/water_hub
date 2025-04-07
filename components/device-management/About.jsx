
import React from 'react'
import { Card ,CardContent} from '../ui/card';

const About = ({deviceData}) => {
    const formattedDeviceData = {
        serialNumber: deviceData?.device_serial ?? "N/A",
        noOfTaps: deviceData?.no_of_tap ?? "N/A",
        valveType: deviceData?.valve_type ?? "N/A",
        clientName: deviceData?.user?.client ?? "N/A",
        clientEmail: deviceData?.user?.client_email ?? "N/A",
        siteName: deviceData?.site?.site_name ?? "N/A",
        siteCountry: deviceData?.site?.country ?? "N/A",
      };
  return (
    <Card className="w-[400px] py-2">
      <CardContent>
        <p>Serial Number: {formattedDeviceData.serialNumber}</p>
        <p>No of Taps: {formattedDeviceData.noOfTaps}</p>
        <p>Valve Type: {formattedDeviceData.valveType}</p>
        <p>Client Name: {formattedDeviceData.clientName}</p>
        <p>Client Email: {formattedDeviceData.clientEmail}</p>
        <p>Site Name: {formattedDeviceData.siteName}</p>
        <p>Site Country: {formattedDeviceData.siteCountry}</p>
      </CardContent>
    </Card>
  )
}

export default About
