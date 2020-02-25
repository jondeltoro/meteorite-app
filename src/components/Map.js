import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { isEqual } from 'lodash';

const AnyReactComponent = ({ text }) => <div className="c-meteorite">{text}</div>;

class Map extends Component {
  createMapOptions(maps) {
    return {
      fullscreenControl: false,
      // panControl: false,
      // mapTypeControl: false,
      // scrollwheel: false,
      styles: [
        {
          featureType: 'administrative.land_parcel',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'administrative.neighborhood',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'poi',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'transit',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
      ],
    };
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props);
  }

  renderMeteorites() {
    const meteorites = this.props.meteorites || [];
    return meteorites.map((meteorite, i) => {
      const { reclat: lat, reclong: long } = meteorite;
      if (lat === undefined || long === undefined) {
        return null;
      }
      return <AnyReactComponent key={`met-${i}`} lat={lat} lng={long} text="*" />;
    });
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
}

Map.defaultProps = {
  center: {
    lat: 35.85,
    lng: -100,
  },
  zoom: 4,
};

export default Map;
