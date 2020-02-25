import React, { Component } from 'react';
import axios from 'axios';

import logo from './meteorite.svg';
import { generateMeteoritesURL, defaultStartDate, defaultEndDate } from './config';

import Map from './components/Map';
import Controls from './components/Controls';

import './App.scss';

// import './App.css';
class App extends Component {
  state = { meteorites: [], startDate: defaultStartDate, endDate: defaultEndDate, pendingRequest: false };

  render() {
    const filterProps = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      pendingRequest: this.state.pendingRequest,
      handleChangeDate: this.changeDate.bind(this),
      handleQueryMeteorites: this.queryMeteorites.bind(this),
    };

    return (
      <div className="app d-flex flex-column border-d">
        <header className="border-d container-fluid">
          <div className="row">
            <div className="title-wrapper col-4 d-flex align-items-center">
              <img src={logo} className="logo" alt="logo" />
              <span>Meteorite Landings</span>
            </div>
            <div className="controls-wrapper col d-flex align-items-center">
              <Controls {...filterProps}></Controls>
            </div>
          </div>
        </header>
        <Map meteorites={this.state.meteorites}></Map>
        <footer className="container-fluid d-flex border-d">
          <div className="content">© 2020 Jonathan Del Toro</div>
        </footer>
      </div>
    );
  }

  componentDidMount() {
    this.queryMeteorites();
  }

  changeDate(auxDateName = '', newDate) {
    this.setState({ [auxDateName]: newDate });
  }

  queryMeteorites() {
    if (this.pendingRequest) {
      return false;
    }

    this.setState({ pendingRequest: true });

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
      .catch(e => console.error(e))
      .finally(_ => this.setState({ pendingRequest: false }));
  }

}

export default App;
