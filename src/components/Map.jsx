import './Map.css'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api'
import { useState, useEffect } from "react"
import StateSelection from './StateSelection'
let center = {lat: -24.01636, lng: 134.05129}
let zoom = 5

export default function Map() {
    const { isLoaded } = useJsApiLoader({ 
        id: 'google-map-script', 
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY 
    })

    const [stations, setStations] = useState([])
    const [chosenState, setChosenState] = useState('All')
    const [chosenStation, setChosenStation] = useState(null)
    const [variables, setVariables] = useState(null)
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch('/api/stations/all')
            .then(res => res.json())
            .then(stations => setStations(stations.filter(station => {
                if (chosenState === "NSW") {
                    center = {lat: -31.84, lng: 145.61}
                    zoom = 6
                    return station.state === "NSW"
                } else if (chosenState === "QLD") {
                    center = {lat: -20.92, lng: 142.70}
                    zoom = 6
                    return station.state === "QLD"
                } else if (chosenState === "SA") {
                    center = {lat: -30, lng: 136.21}
                    zoom = 6
                    return station.state === "SA"
                } else if (chosenState === "VIC") {
                    center = {lat: -37.02, lng: 144.96}
                    zoom = 6
                    return station.state === "VIC"
                } else {
                    center = {lat: -24.01636, lng: 134.05129}
                    zoom = 5
                    return station
                }
            })))
            handleClose()
    },[chosenState])

    function handleChange(evt) {
        setChosenState(evt.target.value)
    }

    function handleOpen(stationId) {
        let infoWindowStation = stations.find(({ id }) => id === stationId)
        setChosenStation(infoWindowStation)
        fetch(`/api/variables/${stationId}`)
            .then(res => res.json())
            .then(variables => setVariables(variables))
        fetch(`/api/data/${stationId}`)
            .then(res => res.json())
            .then(data => setData(data[0]))
    }

    function handleClose() {
        setChosenStation(null)
        setData(null)
        setVariables(null)
    }

    return isLoaded ? (
        <div className='map'>
            <StateSelection onChange={handleChange}/>

            <GoogleMap
                zoom={zoom}
                center={center}
                mapContainerClassName='google-map'
            >
                
                {stations.map(station => {
                    return <MarkerF
                                key={station.id}
                                position={{ lat: station.latitude, lng: station.longitude }}
                                onClick={() => handleOpen(station.id)}>
                           </MarkerF>
                })}

                {data && (
                    <InfoWindow
                        position={{ lat: chosenStation.latitude,
                                    lng: chosenStation.longitude }}
                        options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                        onCloseClick={handleClose}>
                        <div>
                            <h2>Name: {chosenStation.ws_name}</h2>
                            <h3>Site: {chosenStation.site}</h3>
                            <h3>Portfolio: {chosenStation.portfolio}</h3>
                            {variables &&
                                <>
                                    {variables.length < 2 ? <h4>{variables[0].long_name}: {data.value1} {variables[0].unit}</h4>
                                                        : <>
                                                                <h4>{variables[0].long_name}: {data.value1} {variables[0].unit}</h4>
                                                                <h4>{variables[1].long_name}: {data.value2} {variables[1].unit}</h4>
                                                            </>
                                    }
                                    <h4>Last measurement at {data.timestamp}</h4>
                                </>
                            }
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    ) : <></>
}