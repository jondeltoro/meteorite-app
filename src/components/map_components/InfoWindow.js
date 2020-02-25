import React, { useState } from 'react';

import './InfoWindow.scss';

function InfoWindow(props) {
  const { data, setMeteoriteShowFlag } = props;
  const [editMode, setEditMode] = useState(false);
  const [clonedData, setClonedData] = useState({ ...data });

  const changeInternalVal = (event, field) => {
    event.stopPropagation();
    setClonedData({ ...clonedData, [field]: event.currentTarget.value });
  };

  const displayContent = () => {
    if (editMode) {
      return (
        <form>
          <div>
            <span className="field-name"> Name</span>
            <input type="text" required value={clonedData.name} onChange={e => changeInternalVal(e, 'name')} />
          </div>
          <div>
            <span className="field-name">Year</span>
            <input type="text" required value={clonedData.year} onChange={e => changeInternalVal(e, 'year')} />
          </div>
          <div>
            <span className="field-name">Class</span>
            <input type="text" required value={clonedData.recclass} onChange={e => changeInternalVal(e, 'recclass')} />
          </div>
          <div>
            <span className="field-name">Mass</span>
            <input type="text" required value={clonedData.mass} onChange={e => changeInternalVal(e, 'mass')} />
          </div>
        </form>
      );
    }
    return (
      <React.Fragment>
        <div>
          <span className="field-name">Name:</span> {data.name}
        </div>
        <div>
          <span className="field-name">Year:</span> {data.year}
        </div>
        <div>
          <span className="field-name">Class:</span> {data.recclass}
        </div>
        <div>
          <span className="field-name">Mass:</span> {data.mass}
        </div>
      </React.Fragment>
    );
  };

  const saveEditButtonAction = () => {
    setEditMode(!editMode);
  };
  return (
    <div className="info-window">
      <h5 className="iw-title">Meteorite info</h5>
      <div className="marker-main">{displayContent()}</div>
      <div className="marker-buttons">
        <button className="btn btn-primary btn-sm" onClick={saveEditButtonAction}>
          {editMode ? 'Save' : 'Edit'}
        </button>
        <button className="btn btn-primary btn-sm" onClick={_ => setMeteoriteShowFlag(data, false)}>
          {editMode ? 'Cancel' : 'Close'}
        </button>
      </div>
    </div>
  );
}

export default InfoWindow;
