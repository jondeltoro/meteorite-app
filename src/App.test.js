import React from 'react';
import { mount } from 'enzyme';
import mockAxios from './__mocks__/axios';

import App from './App';
import { generateMeteoritesURL, defaultStartDate, defaultEndDate } from './config';

jest.mock('./components/ChangeTable.js', _ => {
  return props => <div className="dummy-change-table">{props.changeLog.length}</div>;
});

jest.mock('./components/Map.js', _ => {
  return props => <div className="dummy-map">{props.meteorites.length}</div>;
});

jest.mock('./components/Controls.js', _ => {
  return props => <div className="dummy-controls">{props.startDate.toJSON()}</div>;
});

describe('App component', () => {
  let meteoritesData = [];
  beforeEach(() => {
    meteoritesData = [
      {
        id: '1',
        name: 'M1',
        recclass: 'L1',
        mass: '1000',
        year: '2011-01-01',
        reclat: '26.1',
        reclong: '106.1',
        show: false,
      },
      {
        id: '2',
        name: 'M2',
        recclass: 'L2',
        mass: '2000',
        year: '2012-01-01',
        reclat: '26.2',
        reclong: '106.2',
        show: false,
      },
      {
        id: '3',
        name: 'M3',
        recclass: 'L3',
        mass: '3000',
        year: '2013-01-01',
        reclat: '26.3',
        reclong: '106.3',
        show: false,
      },
    ];
  });
  afterEach(() => {
    mockAxios.reset();
  });

  describe('Integration tests', () => {
    it('Should render', () => {
      const wrapper = mount(<App />);
      let state = wrapper.state();
      const queryURL = generateMeteoritesURL(state.startDate, state.endDate);
      mockAxios.mockResponseFor({ url: queryURL }, { data: meteoritesData });
      wrapper.setState({ changeLog: [{}, {}] });
      state = wrapper.state();
      expect(
        wrapper
          .find('.dummy-change-table')
          .first()
          .text()
      ).toBe(state.changeLog.length.toString());
      expect(
        wrapper
          .find('.dummy-map')
          .first()
          .text()
      ).toBe(state.meteorites.length.toString());
      expect(
        wrapper
          .find('.dummy-controls')
          .first()
          .text()
      ).toBe(state.startDate.toJSON());
    });
  });

  describe('Unit tests', () => {
    describe('setMeteoriteShowFlag', () => {
      it('should change the state of meteorites and activeMeteorite', () => {
        const wrapper = mount(<App />);
        const meteorites = [...meteoritesData];
        const selectedMeteoriteIndex = 0;
        const selectedMeteorite = meteorites[selectedMeteoriteIndex];
        const selectedMeteorite2Index = 1;
        let selectedMeteorite2 = meteorites[selectedMeteorite2Index];
        wrapper.setState({ meteorites: meteorites });
        const instance = wrapper.instance();

        let state = wrapper.state();
        expect(state.meteorites[selectedMeteoriteIndex].show).toBe(false);
        expect(state.activeMeteorite).toBe(null);

        // we activate meteorite
        instance.setMeteoriteShowFlag(selectedMeteorite, true);
        state = wrapper.state();
        expect(state.meteorites[selectedMeteoriteIndex].show).toBe(true);
        expect(state.activeMeteorite).toBe(selectedMeteoriteIndex);

        // we activate meteorite 2
        instance.setMeteoriteShowFlag(selectedMeteorite2);
        state = wrapper.state();
        expect(state.meteorites[selectedMeteoriteIndex].show).toBe(false);
        expect(state.meteorites[selectedMeteorite2Index].show).toBe(true);
        expect(state.activeMeteorite).toBe(selectedMeteorite2Index);

        // we deactivate meteorite 2
        selectedMeteorite2 = state.meteorites[selectedMeteorite2Index];
        instance.setMeteoriteShowFlag(selectedMeteorite2, false);
        state = wrapper.state();
        expect(state.meteorites[selectedMeteoriteIndex].show).toBe(false);
        expect(state.meteorites[selectedMeteorite2Index].show).toBe(false);
        expect(state.activeMeteorite).toBe(null);
      });
    });

    describe('changeMeteoriteData', () => {
      it('should change the state of meteorites and activeMeteorite', () => {
        const spySetMeteoriteShowFlag = jest
          .spyOn(App.prototype, 'setMeteoriteShowFlag')
          .mockImplementationOnce(() => {});
        const spyAddChangeToHistory = jest.spyOn(App.prototype, 'addChangeToHistory').mockImplementationOnce(() => {});

        const wrapper = mount(<App />);
        const meteorites = [...meteoritesData];
        const selectedMeteoriteIndex = 0;
        const selectedMeteorite = meteorites[selectedMeteoriteIndex];
        const name = selectedMeteorite.name;
        const newName = 'new name';
        const equalMeteorite = { ...selectedMeteorite };
        const newMeteorite = { ...selectedMeteorite, name: newName };

        wrapper.setState({ meteorites: meteorites, activeMeteorite: selectedMeteoriteIndex });
        const instance = wrapper.instance();

        let state = wrapper.state();
        expect(state.meteorites[selectedMeteoriteIndex].name).toBe(name);
        expect(state.meteorites[selectedMeteoriteIndex]).toBe(selectedMeteorite);
        expect(state.activeMeteorite).toBe(selectedMeteoriteIndex);

        // we try changing meteorite with a record with same data
        instance.changeMeteoriteData(selectedMeteorite, equalMeteorite);
        state = wrapper.state();
        expect(spySetMeteoriteShowFlag).toBeCalled();
        expect(spyAddChangeToHistory).not.toBeCalled();
        expect(state.meteorites[selectedMeteoriteIndex]).toBe(selectedMeteorite);
        expect(state.meteorites[selectedMeteoriteIndex].name).toBe(name);
        expect(state.activeMeteorite).toBe(selectedMeteoriteIndex);

        // we try changing meteorite with a record with different data
        instance.changeMeteoriteData(selectedMeteorite, newMeteorite);
        state = wrapper.state();
        expect(spyAddChangeToHistory).toBeCalled();
        expect(state.meteorites[selectedMeteoriteIndex]).toEqual(newMeteorite);
        expect(state.meteorites[selectedMeteoriteIndex].name).toBe(newName);
        expect(state.activeMeteorite).toBe(null);
      });
    });

    describe('addChangeToHistory', () => {
      it('should change the state of changeLog', () => {
        const wrapper = mount(<App />);
        const meteorites = [...meteoritesData];
        const selectedMeteoriteIndex = 0;
        const selectedMeteorite = meteorites[selectedMeteoriteIndex];
        const newMeteorite = { ...selectedMeteorite, name: 'new name' };
        const meteoriteStructure = {
          name: expect.any(String),
          class: expect.any(String),
          mass: expect.any(String),
          year: expect.any(String),
        };
        const instance = wrapper.instance();

        let state = wrapper.state();
        expect(state.changeLog).toEqual([]);

        instance.addChangeToHistory(selectedMeteorite, newMeteorite);
        state = wrapper.state();
        expect(state.changeLog.length).toBe(1);
        expect(state.changeLog[0]).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            id: expect.any(String),
            oldRecord: expect.any(Object),
            newRecord: expect.any(Object),
          })
        );
        expect(state.changeLog[0].oldRecord).toEqual(expect.objectContaining(meteoriteStructure));
        expect(state.changeLog[0].newRecord).toEqual(expect.objectContaining(meteoriteStructure));
      });
    });

    describe('toggleChangeHistoryPanel', () => {
      it('should change the state of showChangeHistory', () => {
        const wrapper = mount(<App />);
        const instance = wrapper.instance();

        let state = wrapper.state();
        expect(state.showChangeHistory).toBe(false);

        instance.toggleChangeHistoryPanel();
        state = wrapper.state();
        expect(state.showChangeHistory).toBe(true);
      });
    });

    describe('changeDate', () => {
      it('should change the state of startDate and endDate', () => {
        const wrapper = mount(<App />);
        const instance = wrapper.instance();
        let state = wrapper.state();
        const newDate1 = new Date(2010, 3, 4);
        const newDate2 = new Date(2020, 1, 2);

        expect(state.startDate).toBe(defaultStartDate);
        expect(state.endDate).toBe(defaultEndDate);

        instance.changeDate('startDate', newDate1);
        instance.changeDate('endDate', newDate2);

        state = wrapper.state();
        expect(state.startDate).toBe(newDate1);
        expect(state.endDate).toBe(newDate2);
      });
    });

    describe('queryMeteorites', () => {
      it('should not execute GET method if pendingRequest state is true', () => {
        const spyGet = jest.spyOn(mockAxios, 'get');
        const wrapper = mount(<App />);
        const instance = wrapper.instance();
        wrapper.setState({ meteorites: [], activeMeteorite: null, pendingRequest: true });

        const result = instance.queryMeteorites();
        expect(result).toBe(false);
        expect(spyGet).toHaveBeenCalledTimes(1);
      });

      it('should execute GET method', () => {
        const spyGet = jest.spyOn(mockAxios, 'get').mockImplementationOnce(() => new Promise(() => {}));
        const wrapper = mount(<App />);
        const instance = wrapper.instance();
        wrapper.setState({ meteorites: [], activeMeteorite: meteoritesData[0], pendingRequest: false });
        let state = wrapper.state();

        const result = instance.queryMeteorites();
        const queryURL = generateMeteoritesURL(state.startDate, state.endDate);
        mockAxios.mockResponseFor({ url: queryURL }, { data: meteoritesData });

        state = wrapper.state();
        expect(result).toBe(undefined);
        expect(spyGet).toHaveBeenCalledTimes(2);
        expect(state.meteorites.length).toBe(meteoritesData.length);
        expect(state.activeMeteorite).toBe(null);
      });

      it('should execute GET method and get Error', () => {
        const spyGet = jest.spyOn(mockAxios, 'get').mockImplementationOnce(() => new Promise(() => {}));
        const wrapper = mount(<App />);
        const instance = wrapper.instance();
        wrapper.setState({ meteorites: [], activeMeteorite: meteoritesData[0], pendingRequest: false });
        let state = wrapper.state();

        const result = instance.queryMeteorites();
        // simulate an error when calling the GET method
        mockAxios.mockError({ error: true });

        state = wrapper.state();
        expect(result).toBe(undefined);
        expect(spyGet).toHaveBeenCalledTimes(2);
        expect(state.meteorites.length).toBe(0);
        expect(state.activeMeteorite).toBe(meteoritesData[0]);
      });
    });
  });
});
