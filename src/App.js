import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import { generateMeteoritesURL, defaultStartDate, defaultEndDate } from './config';
import Map from './components/Map';

import './App.scss';

// import './App.css';
class App extends Component {
  state = { meteorites: [], startDate: defaultStartDate, endDate: defaultEndDate };
  render() {
    return (
      <div className="App d-flex flex-column border-d">
        <div className="border-d">
          <span>choose date:</span>
          <span>
            start date <input value={defaultStartDate} onChange={() => {}} />
          </span>
          <span>
            end date <input value={defaultEndDate} onChange={() => {}} />
          </span>
          <button>Apply</button>
        </div>
        <Map meteorites={this.state.meteorites}></Map>
        <footer className="container-fluid border-d">
          <hr />
          <span>© 2020 Jonathan Del Toro</span>
          <hr />
        </footer>
      </div>
    );
  }

  componentDidMount() {
    this.queryMeteorites();
  }

  queryMeteorites() {
    axios
      .get(generateMeteoritesURL(this.state.startDate, this.state.endDate))
      .then(({ data }) => {
        this.setState({
          meteorites: data.filter(m => m.year !== undefined && m.reclat !== undefined && m.reclong !== undefined),
        });
        console.log(
          'data',
          data
            .filter(m => m.year !== undefined && m.reclat !== undefined && m.reclong !== undefined)
            .reduce((ac, e) => {
              if (e.year.substr(0, 4) < 1000) {
                console.log(e);
              }
              ac[e.year.substr(0, 4)] = ac[e.year.substr(0, 4)] ? ac[e.year.substr(0, 4)] + 1 : 1;
              return ac;
            }, {})
        );
      })
      .catch(e => console.error(e));
  }

  filterMeteoritesByDate() {
    return this.state.meteorites.filter(meteorite => {
      const year = moment(meteorite.year.substr(0, 10));
      return year.isSameOrAfter(this.state.startDate) && year.isSameOrBefore(this.state.endDate);
    });
  }
}

export default App;
