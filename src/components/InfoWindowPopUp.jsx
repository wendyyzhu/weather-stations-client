import { InfoWindow } from "@react-google-maps/api"

export default function InfoWindowPopUp({ data, variables, chosenStation, onClose }) {
    return (
        <InfoWindow
            position={{ lat: chosenStation.latitude,
                        lng: chosenStation.longitude }}
            options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
            onCloseClick={onClose}>
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
    )
}