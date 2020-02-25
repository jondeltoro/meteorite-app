import React, { Component } from 'react';
import { isEqual } from 'lodash';

import './Controls.scss';

class Controls extends Component {
  constructor(props) {
    super(props);
    this.changeDate = props.handleChangeDate;
    this.queryMeteorites = props.handleQueryMeteorites;
    this.toggleChangeHistoryPanel = props.handleToggleChangeHistoryPanel;
  }

  shouldComponentUpdate(nextProps) {
    return !(
      isEqual(nextProps.startDate, this.props.startDate) &&
      isEqual(nextProps.endDate, this.props.endDate) &&
      isEqual(nextProps.pendingRequest, this.props.pendingRequest) &&
      isEqual(nextProps.changeLogIsEmpty, this.props.changeLogIsEmpty)
    );
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
            className="btn btn-primary btn-sm btn-query"
            disabled={this.props.pendingRequest}
            onClick={_ => this.queryMeteorites()}
          >
            Apply filter
          </button>
        </div>
        <div className="col d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-primary btn-sm btn-toggle"
            disabled={this.props.changeLogIsEmpty}
            onClick={_ => this.toggleChangeHistoryPanel()}
          >
            Toggle history
          </button>
        </div>
      </div>
    );
  }
}

export default Controls;
