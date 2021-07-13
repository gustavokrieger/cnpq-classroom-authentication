import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Home.css";

export default function Home(): JSX.Element {
  const urlSearchParams = new URLSearchParams(useLocation().search);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [ip, setIp] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch("https://api64.ipify.org");
      setIp(await response.text());
    })();
    (async () => {
      const data = { temporary_token: urlSearchParams.get("temporary_token") };
      const response = await fetch("http://localhost:8000/token-exchange/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setToken(await response.text());
    })();
  }, [urlSearchParams]);

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
    <div className="Home">
      <header className="Home-header">
        <p>Token: {token}</p>
        <p>IP: {ip}</p>
        <p>-</p>
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
        <p>Accuracy: {accuracy}</p>
        <a
          className="Home-link"
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noreferrer"
        >
          See in Maps
        </a>
      </header>
    </div>
  );
}
