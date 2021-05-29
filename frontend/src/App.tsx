import { useState } from "react";
import "./App.css";

function App(): JSX.Element {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  function positionCallback(position: GeolocationPosition): void {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    setAccuracy(position.coords.accuracy);
  }

  function positionErrorCallback(
    positionError: GeolocationPositionError
  ): void {
    console.warn(`ERROR(${positionError.code}): ${positionError.message}`);
  }

  const positionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(
    positionCallback,
    positionErrorCallback,
    positionOptions
  );

  return (
    <div className="App">
      <header className="App-header">
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
        <p>Accuracy: {accuracy}</p>
      </header>
    </div>
  );
}

export default App;
