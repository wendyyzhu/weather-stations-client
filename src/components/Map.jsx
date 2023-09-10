import './Map.css'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api'
import { useState, useEffect, useCallback } from "react"
const center = {lat: -24.01636, lng: 134.05129}

export default function Map() {
    const { isLoaded } = useJsApiLoader({ 
        id: 'google-map-script', 
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY 
    })

    return isLoaded ? (
        <GoogleMap
            zoom={5}
            center={center}
            mapContainerClassName='google-map'
        >
            <MarkerF position={center}>
            </MarkerF>
        </GoogleMap>
    ) : <></>
}