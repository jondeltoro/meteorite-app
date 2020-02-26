import React, { useState } from 'react';

import './InfoWindow.scss';

function InfoWindow(props) {
  const { data, setMeteoriteShowFlag, changeMeteoriteData } = props;
  const [editMode, setEditMode] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [clonedData, setClonedData] = useState({ ...data });

  const changeInternalVal = (event, field) => {
    event.stopPropagation();
    setClonedData({ ...clonedData, [field]: event.currentTarget.value });
  };

  const displayContent = () => {
    if (editMode) {
      return (
        <form>
          <div className="m-input">
            <span className="field-name"> Name</span>
            <input type="text" required value={clonedData.name} onChange={e => changeInternalVal(e, 'name')} />
          </div>
          <div className="m-input">
            <span className="field-name">Year</span>
            <input type="text" required value={clonedData.year} onChange={e => changeInternalVal(e, 'year')} />
          </div>
          <div className="m-input">
            <span className="field-name">Class</span>
            <input type="text" required value={clonedData.recclass} onChange={e => changeInternalVal(e, 'recclass')} />
          </div>
          <div className="m-input">
            <span className="field-name">Mass</span>
            <input type="text" required value={clonedData.mass} onChange={e => changeInternalVal(e, 'mass')} />
          </div>
          <div className="invalid-msg">{isInvalid ? 'All fields are required' : ''}</div>
        </form>
      );
    }
    return (
      <React.Fragment>
        <div className="m-data">
          <span className="field-name">Name:</span>
          <span className="field-value"> {data.name}</span>
        </div>
        <div className="m-data">
          <span className="field-name">Year:</span>
          <span className="field-value"> {data.year}</span>
        </div>
        <div className="m-data">
          <span className="field-name">Class:</span>
          <span className="field-value"> {data.recclass}</span>
        </div>
        <div className="m-data">
          <span className="field-name">Mass:</span>
          <span className="field-value"> {data.mass}</span>
        </div>
        <div className="place-holder"></div>
      </React.Fragment>
    );
  };

  const saveEditButtonAction = () => {
    const isValid = str => {
      return str.trim().length > 0;
    };
    if (!editMode) {
      setEditMode(!editMode);
    } else if (
      isValid(clonedData.name) &&
      isValid(clonedData.year) &&
      isValid(clonedData.recclass) &&
      isValid(clonedData.mass)
    ) {
      changeMeteoriteData(data, clonedData);
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
    }
  };

  return (
    <div className="info-window">
      <h5 className="iw-title">Meteorite info</h5>
      <div className="marker-main">{displayContent()}</div>
      <div className="marker-buttons">
        <button className="btn btn-primary btn-sm btn-edit" onClick={saveEditButtonAction}>
          {editMode ? 'Save' : 'Edit'}
        </button>
        <button className="btn btn-primary btn-sm btn-close" onClick={_ => setMeteoriteShowFlag(data, false)}>
          {editMode ? 'Cancel' : 'Close'}
        </button>
      </div>
    </div>
  );
}

export default InfoWindow;
