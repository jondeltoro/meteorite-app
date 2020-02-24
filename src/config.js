import moment from 'moment';

export const generateMeteoritesURL = (startDate, endDate) => {
  const startYear = moment(startDate).format('YYYY');
  const endYear = moment(endDate).format('YYYY');
  return `https://data.nasa.gov/resource/y77d-th95.json?$select=name,recclass,mass,year,reclat,reclong&$where=year>=%27${startYear}-01-01T00:00:00.000%27%20and%20year<=%27${endYear}-01-01T00:00:00.000%27 &$limit=9999999`;
};
export const defaultStartDate = '01/01/2010';
export const defaultEndDate = moment().format('MM/DD/YYYY');
