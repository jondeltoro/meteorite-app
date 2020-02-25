import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import './App.scss';
import logo from './meteorite.svg';
import { generateMeteoritesURL, defaultStartDate, defaultEndDate, timeStampFormat } from './config';

import Map from './components/Map';
import Controls from './components/Controls';
import ChangeTable from './components/ChangeTable';

class App extends Component {
  state = {
    meteorites: [],
    changeLog: [],
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    pendingRequest: false,
    showChangeHistory: false,
  };

  render() {
    const filterProps = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      pendingRequest: this.state.pendingRequest,
      handleChangeDate: this.changeDate.bind(this),
      handleQueryMeteorites: this.queryMeteorites.bind(this),
      handleToggleChangeHistory: this.toggleChangeHistory.bind(this),
      changeLogIsEmpty: this.state.changeLog.length <= 0,
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

        <main className="container-fluid">
          <div className="row">
            <div className={`map-wrapper ${this.state.showChangeHistory ? 'col-6' : 'col-12'}`}>
              <Map meteorites={this.state.meteorites}></Map>
            </div>
            <div className={`change-log-wrapper ${this.state.showChangeHistory ? 'col-6' : 'd-none'}`}>
              <ChangeTable changeLog={this.state.changeLog}></ChangeTable>
            </div>
          </div>
        </main>

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
      })
      .catch(e => console.error(e))
      .finally(_ => this.setState({ pendingRequest: false }));
  }

  addChangeToHistory(oldRecord, newRecord) {
    const changeLog = this.state.changeLog;
    const trimRecord = ({ name, recclass, mass }) => {
      return {
        name,
        class: recclass,
        mass,
      };
    };
    changeLog.push({
      timestamp: moment().format(timeStampFormat),
      id: oldRecord.id,
      oldRecord: trimRecord(oldRecord),
      newRecord: trimRecord(newRecord),
    });
    this.setState({ changeLog });
  }

  toggleChangeHistory() {
    this.setState({ showChangeHistory: !this.state.showChangeHistory });
  }
}

export default App;
