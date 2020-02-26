import React from 'react';
import { mount } from 'enzyme';

import MeteoriteMarker from './MeteoriteMarker';

jest.mock('./InfoWindow.js', _ => {
  return props => (
    <div className="dummy-info-window" onClick={_ => props.setMeteoriteShowFlag()} onChange={props.changeMeteoriteData}>
      {JSON.stringify(props.data)}
    </div>
  );
});

describe('MeteoriteMarker component', () => {
  let meteoriteMarkerProps = {
    show: false,
    data: { name: '', year: '', mass: '', recclass: '' },
    setMeteoriteShowFlag: jest.fn(),
    changeMeteoriteData: jest.fn(),
  };

  beforeEach(() => {
    meteoriteMarkerProps = {
      show: false,
      data: {
        id: '3',
        name: 'M3',
        recclass: 'L3',
        mass: '3000',
        year: '2013-01-01',
        reclat: '26.3',
        reclong: '106.3',
        show: false,
      },
      setMeteoriteShowFlag: jest.fn(),
      changeMeteoriteData: jest.fn(),
    };
  });

  describe('Integration tests', () => {
    it('Should render without info window', () => {
      const wrapper = mount(<MeteoriteMarker {...meteoriteMarkerProps} />);
      expect(wrapper.find('span.m-mark > img').prop('alt')).toBe(meteoriteMarkerProps.data.name);
      expect(wrapper.find('.dummy-info-window').length).toBe(0);
    });

    it('Should render with info window component correctly', () => {
      const wrapper = mount(<MeteoriteMarker {...meteoriteMarkerProps} />);
      wrapper.setProps({ show: true });
      expect(wrapper.find('span.m-mark > img').prop('alt')).toBe(meteoriteMarkerProps.data.name);
      expect(wrapper.find('.dummy-info-window').text()).toBe(JSON.stringify(meteoriteMarkerProps.data));
    });

    describe('Event tests', () => {
      it('Should trigger setMeteoriteShowFlag', () => {
        const wrapper = mount(<MeteoriteMarker {...meteoriteMarkerProps} />);

        expect(meteoriteMarkerProps.setMeteoriteShowFlag).toHaveBeenCalledTimes(0);

        wrapper.find('span.m-mark').simulate('click');
        expect(meteoriteMarkerProps.setMeteoriteShowFlag).toHaveBeenCalledTimes(1);
        expect(meteoriteMarkerProps.setMeteoriteShowFlag).toHaveBeenCalledWith(meteoriteMarkerProps.data);
      });
    });
  });
});
