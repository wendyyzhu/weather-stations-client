import './Map.css'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api'
import { useState, useEffect, useCallback } from "react"
const center = {lat: -24.01636, lng: 134.05129}

export default function Map() {
    const { isLoaded } = useJsApiLoader({ 
        id: 'google-map-script', 
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY 
    })

    const [stations, setStations] = useState([])

    useEffect(() => {
        fetch('/api/stations/all')
            .then(res => res.json())
            .then(stations => setStations(stations))
    },[])

    return isLoaded ? (
        <div className='map'>
            {/* <label>State</label>
            <select>
                <option value="All">All</option>
                <option value="NSW">New South Wales</option>
                <option value="QLD">Queensland</option>
                <option value="SA">South Australia</option>
                <option value="VIC">Victoria</option>
            </select> */}

            <GoogleMap
                zoom={5}
                center={center}
                mapContainerClassName='google-map'
            >
                
                {stations.map(station => {
                    return <MarkerF
                                key={station.id}
                                position={{ lat: station.latitude, lng: station.longitude }}>
                           </MarkerF>
                })}

                <MarkerF position={center}>
                </MarkerF>
            </GoogleMap>
        </div>
    ) : <></>
}