import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { isEqual } from 'lodash';

import 'react-datepicker/dist/react-datepicker.css';
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

  applyButtonDisabled() {
    return !this.props.startDate || !this.props.endDate;
  }

  render() {
    return (
      <div className="controls container-fluid">
        <div className="col d-flex align-items-center justify-content-center">
          <label>Start date</label>
          <DatePicker
            required
            maxDate={this.props.endDate}
            selected={this.props.startDate}
            onChange={date => this.changeDate('startDate', date)}
          ></DatePicker>
        </div>
        <div className="col d-flex align-items-center justify-content-center">
          <label htmlFor="end-date">&nbsp;End date&nbsp;</label>
          <DatePicker
            required
            minDate={this.props.startDate}
            selected={this.props.endDate}
            onChange={date => this.changeDate('endDate', date)}
          ></DatePicker>
        </div>
        <div className="col-2 d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="btn btn-primary btn-sm btn-query"
            disabled={this.props.pendingRequest || this.applyButtonDisabled()}
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
