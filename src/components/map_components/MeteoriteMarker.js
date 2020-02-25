import React from 'react';

import asteroid from '../../assets/asteroid-s.png';

import InfoWindow from './InfoWindow';

function MeteoriteMarker({ show, data, setMeteoriteShowFlag }) {
  return (
    <React.Fragment>
      <span onClick={_ => setMeteoriteShowFlag(data)} style={{ cursor: 'pointer' }}>
        <img src={asteroid} alt={data.name} />
      </span>
      {show && <InfoWindow data={data} setMeteoriteShowFlag={setMeteoriteShowFlag} />}
    </React.Fragment>
  );
}

export default MeteoriteMarker;
