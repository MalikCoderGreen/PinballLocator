import { useState, useEffect, FormEvent } from "react";
import PinballList from "@/components/PinballList";

// These interfaces help to type the lat and lon input from the user
interface FormElements extends HTMLFormControlsCollection {
  lat: HTMLInputElement;
  lon: HTMLInputElement;
}
interface LatLonFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

// Only want to extract these values from the response JSON.
export default function LatLonForm() {
  const [arcadeName, setArcadeName] = useState<string>("");
  const [pinballMachines, setMachines] = useState<string[]>([]);
  const [nearMe, setNearMe] = useState<boolean>(false);
  const [displayLoc, setDisplayLoc] = useState<boolean>(false);

  // Retreive data from pinballmap.com api by using user lat and lon.
  async function getData(lat: string | number, lon: string | number) {
    try {
      fetch(
        `https://pinballmap.com/api/v1/locations/closest_by_lat_lon?lat=${lat}&lon=${lon}`
      )
        .then((res) => res.json())
        .then((pinballData) => {
          setArcadeName(pinballData.location.name);
          setMachines(pinballData.location.machine_names);
        });
    } catch (e) {
      console.error(e);
    }
  }

  function handleSubmit(event: FormEvent<LatLonFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    getData(
      event.currentTarget.elements.lat.value,
      event.currentTarget.elements.lon.value
    );
  }

  // Hanldes getting the geolocation of a user when they click on 'Near Me'
  function success(position: GeolocationPosition) {
    setNearMe(true);
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getData(lat, lon);
  }

  function error() {
    console.error("Unable to obtain your position");
  }

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation is not supported");
    }
  }

  useEffect(() => {
    if (arcadeName !== "") {
      setDisplayLoc(true);
    }
  }, [arcadeName]);

  return (
    <div>
      <h1>Pinball Arcade Locator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label>latitude</label>
            <input
              type="text"
              id="lat"
              className="form-control"
              placeholder="Ex:-99.09"
            />
          </div>
          <div>
            <label>longitude</label>
            <input
              type="text"
              id="lon"
              className="form-control"
              placeholder="Ex:-99.09"
            />
          </div>
          <button type="submit" className="btn btn-primary margin-top">
            Search
          </button>
        </div>

        <div className="margin-top">
          {!nearMe ? (
            <h3>Click this button below to find the nearest Pinball spot </h3>
          ) : null}
          {!nearMe ? (
            <button
              type="button"
              className="btn btn-warning"
              onClick={getUserLocation}
            >
              Near Me
            </button>
          ) : null}
          {displayLoc === true ? (
            <h2>
              Pinball Location: <span className="arcadeName">{arcadeName}</span>
            </h2>
          ) : null}
          {displayLoc === true ? (
            <PinballList machineList={pinballMachines} />
          ) : null}
        </div>
      </form>
    </div>
  );
}
