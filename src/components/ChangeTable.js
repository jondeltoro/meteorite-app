import React, { Component } from 'react';
import { isEqual } from 'lodash';

import './ChangeTable.scss';

class ChangeTable extends Component {
  formatObj(record) {
    return Object.keys(record).map((key, i) => <div key={`obj-${i}`}>{`${key}: ${record[key]}`}</div>);
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.changeLog, this.props.changeLog);
  }

  render() {
    return (
      <div className="change-table container-fluid d-flex align-items-center flex-column">
        <div className="row">
          <h4>Change History</h4>
        </div>
        <div className="row table-wrapper">
          <table className="table table-striped table-bordered table-dark">
            <thead>
              <tr>
                <th scope="col">Timestamp</th>
                <th scope="col">Id</th>
                <th scope="col">Original Data</th>
                <th scope="col">Updated Data</th>
              </tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </table>
        </div>
      </div>
    );
  }

  renderRows() {
    return this.props.changeLog.map((record, i) => (
      <tr key={`log-${i}`}>
        <td>{record.timestamp}</td>
        <td>{record.id}</td>
        <td>{this.formatObj(record.oldRecord)}</td>
        <td>{this.formatObj(record.newRecord)}</td>
      </tr>
    ));
  }
}

export default ChangeTable;
