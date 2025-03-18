'use client';

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getAccessToken } from './utils/auth';


const Map = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getAccessToken();

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const defaultCenter = {
    lat: sites.length > 0 ? parseFloat(sites[0].latitude) : -1.3024426,
    lng: sites.length > 0 ? parseFloat(sites[0].longitude) : 36.8382320,
  };

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch(
          'https://api.waterhub.africa/api/v1/client/sites',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          setSites(data[0] || []);
          setLoading(false);
        } else {
          console.error('Error response:', response);
        }
      } catch (error) {
        console.error('Error fetching sites:', error);
      }
    };

    fetchSites();
  }, [token]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={7}
      >
        {sites.map((site) => (
          <Marker
            key={site.id}
            position={{
              lat: parseFloat(site.latitude),
              lng: parseFloat(site.longitude),
            }}
            title={site.site_location}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
