import React from 'react';

import asteroid from '../../assets/asteroid-s.png';
import './MeteoriteMarker.scss';
import InfoWindow from './InfoWindow';

function MeteoriteMarker(props) {
  const { show, data, setMeteoriteShowFlag } = props;
  return (
    <React.Fragment>
      <span className="m-mark" onClick={_ => setMeteoriteShowFlag(data)}>
        <img src={asteroid} alt={data.name} />
      </span>
      {show && <InfoWindow {...props} />}
    </React.Fragment>
  );
}

export default MeteoriteMarker;
