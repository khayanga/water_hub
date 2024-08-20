import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const Country = ({ id, value, onChange }) => {
    
  return (
    <Select  id={id} value={value} onValueChange={onChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="DZ">Algeria</SelectItem>
      <SelectItem value="AO">Angola</SelectItem>
      <SelectItem value="BJ">Benin</SelectItem>
      <SelectItem value="BW">Botswana</SelectItem>
      <SelectItem value="BF">Burkina Faso</SelectItem>
      <SelectItem value="BI">Burundi</SelectItem>
      <SelectItem value="CV">Cape Verde</SelectItem>
      <SelectItem value="CM">Cameroon</SelectItem>
      <SelectItem value="CF">Central African Republic</SelectItem>
      <SelectItem value="TD">Chad</SelectItem>
      <SelectItem value="KM">Comoros</SelectItem>
      <SelectItem value="CG">Congo (Brazzaville)</SelectItem>
      <SelectItem value="CD">Congo (Kinshasa)</SelectItem>
      <SelectItem value="CI">Côte d’Ivoire</SelectItem>
      <SelectItem value="DJ">Djibouti</SelectItem>
      <SelectItem value="EG">Egypt</SelectItem>
      <SelectItem value="GQ">Equatorial Guinea</SelectItem>
      <SelectItem value="ER">Eritrea</SelectItem>
      <SelectItem value="SZ">Eswatini</SelectItem>
      <SelectItem value="ET">Ethiopia</SelectItem>
      <SelectItem value="GA">Gabon</SelectItem>
      <SelectItem value="GM">Gambia</SelectItem>
      <SelectItem value="GH">Ghana</SelectItem>
      <SelectItem value="GN">Guinea</SelectItem>
      <SelectItem value="GW">Guinea-Bissau</SelectItem>
      <SelectItem value="KE">Kenya</SelectItem>
      <SelectItem value="LS">Lesotho</SelectItem>
      <SelectItem value="LR">Liberia</SelectItem>
      <SelectItem value="LY">Libya</SelectItem>
      <SelectItem value="MG">Madagascar</SelectItem>
      <SelectItem value="MW">Malawi</SelectItem>
      <SelectItem value="ML">Mali</SelectItem>
      <SelectItem value="MR">Mauritania</SelectItem>
      <SelectItem value="MU">Mauritius</SelectItem>
      <SelectItem value="MA">Morocco</SelectItem>
      <SelectItem value="MZ">Mozambique</SelectItem>
      <SelectItem value="NA">Namibia</SelectItem>
      <SelectItem value="NE">Niger</SelectItem>
      <SelectItem value="NG">Nigeria</SelectItem>
      <SelectItem value="RW">Rwanda</SelectItem>
      <SelectItem value="ST">São Tomé and Príncipe</SelectItem>
      <SelectItem value="SN">Senegal</SelectItem>
      <SelectItem value="SC">Seychelles</SelectItem>
      <SelectItem value="SL">Sierra Leone</SelectItem>
      <SelectItem value="SO">Somalia</SelectItem>
      <SelectItem value="ZA">South Africa</SelectItem>
      <SelectItem value="SS">South Sudan</SelectItem>
      <SelectItem value="SD">Sudan</SelectItem>
      <SelectItem value="TZ">Tanzania</SelectItem>
      <SelectItem value="TG">Togo</SelectItem>
      <SelectItem value="TN">Tunisia</SelectItem>
      <SelectItem value="UG">Uganda</SelectItem>
      <SelectItem value="ZM">Zambia</SelectItem>
      <SelectItem value="ZW">Zimbabwe</SelectItem>
    </SelectContent>
  </Select>
  )
}

export default Country