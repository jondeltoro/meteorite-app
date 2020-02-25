import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { isEqual } from 'lodash';

import { defaultMapProps, defaultMapOptions } from '../config';

import MeteoriteMarker from './map_components/MeteoriteMarker';

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
