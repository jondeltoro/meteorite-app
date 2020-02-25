import React from 'react';

import asteroid from '../../assets/asteroid-s.png';

import InfoWindow from './InfoWindow';

function MeteoriteMarker(props) {
  const { show, data, setMeteoriteShowFlag } = props;
  return (
    <React.Fragment>
      <span onClick={_ => setMeteoriteShowFlag(data)} style={{ cursor: 'pointer' }}>
        <img src={asteroid} alt={data.name} />
      </span>
      {show && <InfoWindow {...props} />}
    </React.Fragment>
  );
}

export default MeteoriteMarker;
