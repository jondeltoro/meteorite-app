import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { isEqual } from 'lodash';

import './App.scss';
import logo from './assets/meteorite.svg';

import { generateMeteoritesURL, defaultStartDate, defaultEndDate, timeStampFormat, dateFormat } from './config';

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
    activeMeteorite: null,
  };

  render() {
    const filterProps = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      pendingRequest: this.state.pendingRequest,
      handleChangeDate: this.changeDate.bind(this),
      handleQueryMeteorites: this.queryMeteorites.bind(this),
      handleToggleChangeHistoryPanel: this.toggleChangeHistoryPanel.bind(this),
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
              <Map
                meteorites={this.state.meteorites}
                handleSetMeteoriteShowFlag={this.setMeteoriteShowFlag.bind(this)}
                handleChangeMeteoriteData={this.changeMeteoriteData.bind(this)}
              ></Map>
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

  changeDate(auxDateName, newDate) {
    this.setState({ [auxDateName]: newDate });
  }

  queryMeteorites() {
    if (this.state.pendingRequest) {
      return false;
    }

    this.setState({ pendingRequest: true });

    axios
      .get(generateMeteoritesURL(this.state.startDate, this.state.endDate))
      .then(({ data }) => {
        const processedDataset = data.map(m => ((m.year = moment(m.year).format(dateFormat)) && (m.show = false)) || m);

        this.setState({
          meteorites: processedDataset,
          activeMeteorite: null,
        });
      })
      .catch(e => console.error('Error trying to fetch dataset', e))
      .finally(_ => this.setState({ pendingRequest: false }));
  }

  toggleChangeHistoryPanel() {
    this.setState({ showChangeHistory: !this.state.showChangeHistory });
  }

  addChangeToHistory(oldRecord, newRecord) {
    const changeLog = [...this.state.changeLog];
    const trimRecord = ({ name, recclass, mass, year }) => {
      return {
        name,
        class: recclass,
        mass,
        year,
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

  changeMeteoriteData(oldRecord, newRecord) {
    if (isEqual(oldRecord, newRecord)) {
      return this.setMeteoriteShowFlag(oldRecord, false);
    }

    this.setState(state => {
      const meteorites = [...state.meteorites];
      const index = state.activeMeteorite;
      meteorites[index] = { ...newRecord, show: false };
      return { meteorites, activeMeteorite: null };
    });

    this.addChangeToHistory(oldRecord, newRecord);
  }

  setMeteoriteShowFlag(meteorite, flag = true) {
    this.setState(state => {
      const meteorites = [...state.meteorites];
      const activeMeteorite = state.activeMeteorite;
      const index = meteorites.indexOf(meteorite);
      if (flag && activeMeteorite !== null) {
        meteorites[activeMeteorite].show = false;
      }
      meteorites[index] = { ...meteorites[index], show: flag };
      return { meteorites, activeMeteorite: flag ? index : null };
    });
  }
}

export default App;
