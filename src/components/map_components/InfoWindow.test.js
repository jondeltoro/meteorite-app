import React from 'react';
import { mount, shallow } from 'enzyme';

import InfoWindow from './InfoWindow';

describe('InfoWindow component', () => {
  let infoWindowProps = {
    data: { name: '', year: '', mass: '', recclass: '' },
    setMeteoriteShowFlag: jest.fn(),
    changeMeteoriteData: jest.fn(),
  };

  beforeEach(() => {
    infoWindowProps = {
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
    it('Should render correctly', () => {
      const wrapper = mount(<InfoWindow {...infoWindowProps} />);
      const data = infoWindowProps.data;
      const dataElements = wrapper.find('.marker-main > .m-data');
      expect(dataElements.length).toBe(4);
      expect(dataElements.at(0).text()).toBe(`Name: ${data.name}`);
      expect(dataElements.at(1).text()).toBe(`Year: ${data.year}`);
      expect(dataElements.at(2).text()).toBe(`Class: ${data.recclass}`);
      expect(dataElements.at(3).text()).toBe(`Mass: ${data.mass}`);

      const buttons = wrapper.find('button');
      expect(buttons.length).toBe(2);
      expect(buttons.at(0).text()).toBe('Edit');
      expect(buttons.at(1).text()).toBe('Close');
    });

    it('Should render correctly when editing is true', () => {
      let wrapper = shallow(<InfoWindow {...infoWindowProps} />);
      const data = infoWindowProps.data;

      // trigger edit mode
      wrapper.find('.btn-edit').simulate('click');

      const dataElements = wrapper.find('.marker-main > form > .m-input');
      expect(dataElements.length).toBe(4);
      const dataElement1 = dataElements.at(0);
      const dataElement2 = dataElements.at(1);
      const dataElement3 = dataElements.at(2);
      const dataElement4 = dataElements.at(3);
      expect(dataElement1.text().trim()).toBe('Name');
      expect(dataElement2.text().trim()).toBe('Year');
      expect(dataElement3.text().trim()).toBe('Class');
      expect(dataElement4.text().trim()).toBe('Mass');

      expect(dataElement1.find('input').props().value).toBe(data.name);
      expect(dataElement2.find('input').props().value).toBe(data.year);
      expect(dataElement3.find('input').props().value).toBe(data.recclass);
      expect(dataElement4.find('input').props().value).toBe(data.mass);

      const buttons = wrapper.find('button');
      expect(buttons.length).toBe(2);
      expect(buttons.at(0).text()).toBe('Save');
      expect(buttons.at(1).text()).toBe('Cancel');
    });

    it('Should display an error when trying to save and any field is empty', () => {
      let wrapper = shallow(<InfoWindow {...infoWindowProps} />);
      const emptyStringFakeEvent = {
        stopPropagation: () => {},
        currentTarget: { value: '' },
      };

      // trigger edit mode
      wrapper.find('.btn-edit').simulate('click');

      const dataElements = wrapper.find('.marker-main > form > .m-input > input');
      expect(dataElements.length).toBe(4);

      dataElements.at(0).simulate('change', emptyStringFakeEvent);

      const firstInput = wrapper.find('.marker-main > form > .m-input > input').first();
      expect(firstInput.props().value).toBe('');
      expect(wrapper.find('.invalid-msg').text()).toBe('');

      // trigger save
      wrapper.find('.btn-edit').simulate('click');
      expect(wrapper.find('.invalid-msg').text()).toBe('All fields are required');
    });

    describe('Event tests', () => {
      it('Should trigger setMeteoriteShowFlag when clicking the close button', () => {
        const wrapper = mount(<InfoWindow {...infoWindowProps} />);

        expect(infoWindowProps.setMeteoriteShowFlag).toHaveBeenCalledTimes(0);

        wrapper.find('.btn-close').simulate('click');
        expect(infoWindowProps.setMeteoriteShowFlag).toHaveBeenCalledTimes(1);
        expect(infoWindowProps.setMeteoriteShowFlag).toHaveBeenCalledWith(infoWindowProps.data, false);
      });

      it('Should trigger changeMeteoriteData when saving', () => {
        const wrapper = mount(<InfoWindow {...infoWindowProps} />);
        const newRecord = infoWindowProps.data;
        const oldRecord = infoWindowProps.data;

        expect(infoWindowProps.changeMeteoriteData).toHaveBeenCalledTimes(0);
        // trigger edit mode
        wrapper.find('.btn-edit').simulate('click');
        // trigger save
        wrapper.find('.btn-edit').simulate('click');
        expect(infoWindowProps.changeMeteoriteData).toHaveBeenCalledTimes(1);

        expect(infoWindowProps.changeMeteoriteData).toHaveBeenCalledWith(oldRecord, newRecord);
      });
    });

    it('Should fail when trying to save with all empty inputs', () => {
      const wrapper = shallow(<InfoWindow {...infoWindowProps} />);
      const emptyStringFakeEvent = {
        stopPropagation: () => {},
        currentTarget: { value: '' },
      };

      // trigger edit mode
      wrapper.find('.btn-edit').simulate('click');

      const inputs = wrapper.find('input');

      inputs.at(0).simulate('change', emptyStringFakeEvent);
      inputs.at(1).simulate('change', emptyStringFakeEvent);
      inputs.at(2).simulate('change', emptyStringFakeEvent);
      inputs.at(3).simulate('change', emptyStringFakeEvent);

      // try to save
      wrapper.find('.btn-edit').simulate('click');

      expect(wrapper.find('.invalid-msg').text()).toBe('All fields are required');
      expect(infoWindowProps.setMeteoriteShowFlag).toHaveBeenCalledTimes(0);
      expect(infoWindowProps.changeMeteoriteData).toHaveBeenCalledTimes(0);
    });
  });
});
