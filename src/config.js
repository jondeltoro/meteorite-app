import moment from 'moment';

export const maxResults = 10000;
export const dateFormat = 'MM/DD/YYYY';
export const apiDateFormat = 'YYYY-MM-DD';
export const timeStampFormat = 'MM/DD/YYYY HH:mm:ss';
export const generateMeteoritesURL = (startDate, endDate) => {
  const startYear = moment(startDate, dateFormat).format(apiDateFormat);
  const endYear = moment(endDate, dateFormat).format(apiDateFormat);
  return `https://data.nasa.gov/resource/y77d-th95.json?$select=id,name,recclass,mass,year,reclat,reclong&$where=year>=%27${startYear}T00:00:00.000%27%20and%20year<=%27${endYear}T00:00:00.000%27&$limit=${maxResults}`;
};
export const defaultStartDate = '01/01/2010';
export const defaultEndDate = moment().format(dateFormat);
export const defaultMapProps = {
  center: {
    lat: 35.85,
    lng: -100,
  },
  zoom: 4,
};
export const defaultMapOptions = {
  fullscreenControl: false,
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
