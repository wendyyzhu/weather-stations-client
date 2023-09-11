import './Map.css'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api'
import { useState, useEffect } from "react"
const center = {lat: -24.01636, lng: 134.05129}

export default function Map() {
    const { isLoaded } = useJsApiLoader({ 
        id: 'google-map-script', 
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY 
    })

    const [stations, setStations] = useState([])
    const [chosenState, setChosenState] = useState('All')
    const [chosenStation, setChosenStation] = useState(null)

    useEffect(() => {
        fetch('/api/stations/all')
            .then(res => res.json())
            .then(stations => setStations(stations.filter(station => {
                if (chosenState === "NSW") {
                    return station.state === "NSW"
                } else if (chosenState === "QLD") {
                    return station.state === "QLD"
                } else if (chosenState === "SA") {
                    return station.state === "SA"
                } else if (chosenState === "VIC") {
                    return station.state === "VIC"
                } else {
                    return station
                }
            })))
    },[chosenState])

    function handleChange(evt) {
        setChosenState(evt.target.value)
    }

    function handleClick(stationId) {
        let infoWindowStation = stations.find(({ id }) => id === stationId)
        setChosenStation(infoWindowStation)
    }

    return isLoaded ? (
        <div className='map'>
            <label>State</label>
            <select onChange={handleChange}>
                <option value="All">All</option>
                <option value="NSW">New South Wales</option>
                <option value="QLD">Queensland</option>
                <option value="SA">South Australia</option>
                <option value="VIC">Victoria</option>
            </select>

            <GoogleMap
                zoom={5}
                center={center}
                mapContainerClassName='google-map'
            >
                
                {stations.map(station => {
                    return <MarkerF
                                key={station.id}
                                position={{ lat: station.latitude, lng: station.longitude }}
                                onClick={() => handleClick(station.id)}>
                           </MarkerF>
                })}

                {chosenStation && (
                    <InfoWindow
                        position={{ lat: chosenStation.latitude,
                                    lng: chosenStation.longitude }}
                        onCloseClick={() => setChosenStation(null)}>
                        <div>
                            <h2>Name: {chosenStation.ws_name}</h2>
                            <h3>Site: {chosenStation.site}</h3>
                            <h3>Portfolio: {chosenStation.portfolio}</h3>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    ) : <></>
}