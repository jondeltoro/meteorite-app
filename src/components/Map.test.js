import React from 'react';
import { mount } from 'enzyme';

import Map from './Map';
import MeteoriteMarker from './map_components/MeteoriteMarker';

jest.mock('google-map-react', _ => {
  return props => (
    <div className="dummy-map" options={props.options()}>
      {props.children}
    </div>
  );
});

jest.mock('./map_components/MeteoriteMarker.js', _ => {
  return props => (
    <div className="dummy-marker" onClick={_ => props.setMeteoriteShowFlag()} onChange={props.changeMeteoriteData}>
      {`${props.lat},${props.lng}`}
    </div>
  );
});

describe('Map component', () => {
  let mapProps = {
    meteorites: [],
    handleSetMeteoriteShowFlag: jest.fn(),
    handleChangeMeteoriteData: jest.fn(),
  };
  const meteoritesData = [
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
    {
      id: '4',
      name: 'M4',
      recclass: 'L4',
      mass: '4000',
      year: '2014-01-01',
      reclat: undefined,
      reclong: undefined,
      show: false,
    },
  ];

  beforeEach(() => {
    mapProps = {
      meteorites: [],
      handleSetMeteoriteShowFlag: jest.fn(),
      handleChangeMeteoriteData: jest.fn(),
    };
  });

  describe('Integration tests', () => {
    it('Should render', () => {
      mount(<Map {...mapProps} />);
    });

    it('Should render an empty map', () => {
      const wrapper = mount(<Map {...mapProps} />);
      wrapper.setProps({ meteorites: null });
      expect(wrapper.find('.dummy-map').text()).toBe('');
    });

    it('Should render a map with markers', () => {
      const wrapper = mount(<Map {...mapProps} />);
      wrapper.setProps({ meteorites: meteoritesData });
      const dummyMarkers = wrapper.find('.dummy-marker');
      expect(dummyMarkers.length).toBe(3);
      expect(dummyMarkers.at(0).text()).toBe(`${meteoritesData[0].reclat},${meteoritesData[0].reclong}`);
      expect(dummyMarkers.at(1).text()).toBe(`${meteoritesData[1].reclat},${meteoritesData[1].reclong}`);
      expect(dummyMarkers.at(2).text()).toBe(`${meteoritesData[2].reclat},${meteoritesData[2].reclong}`);
    });

    describe('Event tests', () => {
      it('Should trigger handleSetMeteoriteShowFlag', () => {
        const wrapper = mount(<Map {...mapProps} />);
        wrapper.setProps({ meteorites: meteoritesData });
        const dummyMarker0 = wrapper.find(MeteoriteMarker).at(0);
        const dummyMarker1 = wrapper.find(MeteoriteMarker).at(1);
        const dummyMarker2 = wrapper.find(MeteoriteMarker).at(2);
        expect(mapProps.handleSetMeteoriteShowFlag).toHaveBeenCalledTimes(0);

        dummyMarker0.simulate('click');
        expect(mapProps.handleSetMeteoriteShowFlag).toHaveBeenCalledTimes(1);
        expect(mapProps.handleSetMeteoriteShowFlag).toHaveBeenCalledWith();

        dummyMarker1.simulate('click');
        expect(mapProps.handleSetMeteoriteShowFlag).toHaveBeenCalledTimes(2);
        expect(mapProps.handleSetMeteoriteShowFlag).toHaveBeenCalledWith();

        dummyMarker2.simulate('click');
        expect(mapProps.handleSetMeteoriteShowFlag).toHaveBeenCalledTimes(3);
        expect(mapProps.handleSetMeteoriteShowFlag).toHaveBeenCalledWith();
      });

      it('Should trigger handleChangeMeteoriteData', () => {
        const wrapper = mount(<Map {...mapProps} />);
        wrapper.setProps({ meteorites: meteoritesData });
        const dummyMarker0 = wrapper.find(MeteoriteMarker).at(0);
        const dummyMarker1 = wrapper.find(MeteoriteMarker).at(1);
        const dummyMarker2 = wrapper.find(MeteoriteMarker).at(2);
        expect(mapProps.handleChangeMeteoriteData).toHaveBeenCalledTimes(0);

        dummyMarker0.simulate('change');
        expect(mapProps.handleChangeMeteoriteData).toHaveBeenCalledTimes(1);
        expect(mapProps.handleChangeMeteoriteData).toHaveBeenCalledWith(expect.any(Object));

        dummyMarker1.simulate('change');
        expect(mapProps.handleChangeMeteoriteData).toHaveBeenCalledTimes(2);
        expect(mapProps.handleChangeMeteoriteData).toHaveBeenCalledWith(expect.any(Object));

        dummyMarker2.simulate('change');
        expect(mapProps.handleChangeMeteoriteData).toHaveBeenCalledTimes(3);
        expect(mapProps.handleChangeMeteoriteData).toHaveBeenCalledWith(expect.any(Object));
      });
    });
  });
});
