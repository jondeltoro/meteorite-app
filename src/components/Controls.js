import React, { Component } from 'react';

import './Controls.scss';

class Controls extends Component {
  constructor(props) {
    super(props);
    this.changeDate = props.handleChangeDate;
    this.queryMeteorites = props.handleQueryMeteorites;
  }

  render() {
    return (
      <div className="controls container-fluid">
        <div className="col d-flex align-items-center justify-content-center">
          <label htmlFor="start-date">Start date</label>
          <input
            id="start-date"
            className="date-element"
            value={this.props.startDate}
            onChange={e => this.changeDate('startDate', e.currentTarget.value)}
          />
        </div>
        <div className="col d-flex align-items-center justify-content-center">
          <label htmlFor="end-date">&nbsp;End date&nbsp;</label>
          <input
            id="end-date"
            className="date-element"
            value={this.props.endDate}
            onChange={e => this.changeDate('endDate', e.currentTarget.value)}
          />
        </div>
        <div className="col-2 d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ minWidth: '90px' }}
            disabled={this.props.pendingRequest}
            onClick={_ => this.queryMeteorites()}
          >
            Apply filter
          </button>
        </div>
        <div className="col d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ minWidth: '110px' }}
            disabled={this.props.pendingRequest}
            onClick={_ => this.queryMeteorites()}
          >
            Toggle history
          </button>
        </div>
      </div>
    );
  }
}

export default Controls;
