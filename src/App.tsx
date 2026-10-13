

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap,useMapEvents } from 'react-leaflet';
import './App.css';

function MapClick({onMapClick}: {
  onMapClick: (position: [number, number]) => void
}){
  useMapEvents({
    click(event) {
      onMapClick([event.latlng.lat, event.latlng.lng]);
    }
  });

  return null;
}

function CurrentLocationButton({
  onFound,
  onMessage,
}:{
  onFound: (position: [number, number]) => void
  onMessage: (message: string) => void
}) {
  const map = useMap();

  function findLocation() {
    navigator.geolocation.getCurrentPosition(({coords}) => {
      const position: [number, number] = [coords.latitude, coords.longitude];

      onFound(position);
      map.setView(position, 16);
    },
    () => {
        onMessage('現在地を取得できませんでした。位置情報を許可してください。');
      },
    );
  }

  return (
    <button
      onClick={findLocation}
      style={{position: 'absolute', top: '12px', right: '56px', zIndex: 1000}}
    >
      現在地へ移動
    </button>
  )
}
function FindLocationOnStart({
  onFound,
  onMessage,
}:{
  onFound: (position: [number, number]) => void
  onMessage: (message: string) => void
}) {
  const map = useMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({coords}) => {
      const position: [number, number] = [coords.latitude, coords.longitude];

      onFound(position);
      onMessage('');
      map.setView(position, 16);
    },
    () => {
      onMessage('現在地を取得できませんでした。位置情報を許可してください。');
    }
  );
}, [map, onFound, onMessage]);

  return null;
}

function App() {
  const [position, setPosition] = useState<[number, number]>([36.6433, 138.1889]);
  const [message, setMessage] = useState('');

  return (


    <MapContainer
      center={[36.6433, 138.1889]}
      zoom={16}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FindLocationOnStart
        onFound={setPosition}
        onMessage={setMessage}
      />

      <CurrentLocationButton 
        onFound={setPosition} 
        onMessage={setMessage} />

      {message && (
        <div 
          role='status'
          style={{
            position: 'absolute',
            bottom: 20,
            left: 12,
            zIndex: 1000,
            backgroundColor: 'white',
            padding: '10px 14px',
            borderRadius: 8,
          }}
        >
          {message}
        </div>
      )}

      <MapClick onMapClick={setPosition} />

      <Marker position={position}>
        <Popup>
          緯度: {position[0].toFixed(5)}
          <br />
          経度: {position[1].toFixed(5)}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default App;

