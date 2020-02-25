import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import moment from 'moment';
import { isEqual } from 'lodash';

import './Map.scss';
import asteroid from '../assets/asteroid-s.png';
import { defaultMapProps, defaultMapOptions, dateFormat } from '../config';

const InfoWindow = props => {
  const { data, setMeteoriteShowFlag } = props;

  return (
    <div className="info-window">
      <h5 className="iw-title">Meteorite info</h5>
      <div className="marker-main">
        <div>Name: {data.name}</div>
        <div>Year: {moment(data.year).format(dateFormat)}</div>
        <div>Class: {data.recclass}</div>
        <div>Mass: {data.mass}</div>
      </div>
      <div className="marker-buttons">
        <button className="btn btn-primary btn-sm">Edit</button>
        <button className="btn btn-primary btn-sm" onClick={_ => setMeteoriteShowFlag(data, false)}>
          Close
        </button>
      </div>
    </div>
  );
};

const MeteoriteMarker = ({ show, data, setMeteoriteShowFlag }) => (
  <React.Fragment>
    <span onClick={_ => setMeteoriteShowFlag(data)} style={{ cursor: 'pointer' }}>
      <img src={asteroid} alt={data.name} />
    </span>
    {show && <InfoWindow data={data} setMeteoriteShowFlag={setMeteoriteShowFlag} />}
  </React.Fragment>
);

class Map extends Component {
  constructor(props) {
    super(props);
    this.setMeteoriteShowFlag = props.handleSetMeteoriteShowFlag;
  }

  createMapOptions() {
    return defaultMapOptions;
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.meteorites, this.props.meteorites);
  }

  render() {
    return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GMAP_API_KEY || '' }}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        options={this.createMapOptions}
      >
        {this.renderMeteorites()}
      </GoogleMapReact>
    );
  }

  renderMeteorites() {
    const meteorites = this.props.meteorites || [];
    return meteorites.map((meteorite, i) => {
      const { reclat: lat, reclong: long, show } = meteorite;
      if (lat === undefined || long === undefined) {
        return null;
      }
      return (
        <MeteoriteMarker
          key={`met-${i}`}
          lat={lat}
          lng={long}
          show={show}
          data={meteorite}
          setMeteoriteShowFlag={this.setMeteoriteShowFlag}
        />
      );
    });
  }
}

Map.defaultProps = defaultMapProps;

export default Map;
