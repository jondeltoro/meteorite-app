import React from 'react';
import { mount } from 'enzyme';
import ReactDatePicker from 'react-datepicker';

import Controls from './Controls';

import { defaultStartDate, defaultEndDate } from '../config';

jest.mock('react-datepicker', _ => {
  return props => (
    <div className="dummy-date-picker" onChange={props.onChange}>
      {JSON.stringify(props.selected)}
    </div>
  );
});

describe('Controls component', () => {
  let controlsProps = {};

  beforeEach(() => {
    controlsProps = {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      pendingRequest: false,
      handleChangeDate: jest.fn(),
      handleQueryMeteorites: jest.fn(),
      handleToggleChangeHistoryPanel: jest.fn(),
      changeLogIsEmpty: true,
    };
  });

  describe('Integration tests', () => {
    it('Should render', () => {
      mount(<Controls {...controlsProps} />);
    });

    it('Should disable apply filter button when a request is pending', () => {
      const wrapper = mount(<Controls {...controlsProps} />);

      expect(wrapper.find('.btn-query').prop('disabled')).toBe(false);
      wrapper.setProps({ pendingRequest: true });
      expect(wrapper.find('.btn-query').prop('disabled')).toBe(true);
    });

    it('Should disable apply filter button when a date field is empty', () => {
      const wrapper = mount(<Controls {...controlsProps} />);

      expect(wrapper.find('.btn-query').prop('disabled')).toBe(false);
      wrapper.setProps({ startDate: undefined });
      expect(wrapper.find('.btn-query').prop('disabled')).toBe(true);
      wrapper.setProps({ startDate: new Date(), endDate: undefined });
      expect(wrapper.find('.btn-query').prop('disabled')).toBe(true);
      wrapper.setProps({ endDate: new Date() });
      expect(wrapper.find('.btn-query').prop('disabled')).toBe(false);
    });

    it('Should disable toggle button when changeLogIsEmpty is true', () => {
      const wrapper = mount(<Controls {...controlsProps} />);

      wrapper.setProps({ changeLogIsEmpty: false });
      expect(wrapper.find('.btn-toggle').prop('disabled')).toBe(false);
      wrapper.setProps({ changeLogIsEmpty: true });
      expect(wrapper.find('.btn-toggle').prop('disabled')).toBe(true);
    });

    it('Should set startDate and endDate datepicker values', () => {
      const wrapper = mount(<Controls {...controlsProps} />);
      const props = wrapper.props();
      expect(
        wrapper
          .find('.dummy-date-picker')
          .at(0)
          .text()
      ).toBe(JSON.stringify(props.startDate));
      expect(
        wrapper
          .find('.dummy-date-picker')
          .at(1)
          .text()
      ).toBe(JSON.stringify(props.endDate));
    });

    describe('Event tests', () => {
      it('Should trigger handleChangeDate', () => {
        const wrapper = mount(<Controls {...controlsProps} />);
        const datepickerS = wrapper.find(ReactDatePicker).at(0);
        const datepickerE = wrapper.find(ReactDatePicker).at(1);

        expect(controlsProps.handleChangeDate).toHaveBeenCalledTimes(0);
        datepickerS.simulate('change');
        expect(controlsProps.handleChangeDate).toHaveBeenCalledTimes(1);
        expect(controlsProps.handleChangeDate).toHaveBeenCalledWith('startDate', expect.any(Object));

        controlsProps.handleChangeDate.mockReset();

        expect(controlsProps.handleChangeDate).toHaveBeenCalledTimes(0);
        datepickerE.simulate('change');
        expect(controlsProps.handleChangeDate).toHaveBeenCalledTimes(1);
        expect(controlsProps.handleChangeDate).toHaveBeenCalledWith('endDate', expect.any(Object));
      });

      it('Should trigger handleQueryMeteorites', () => {
        const wrapper = mount(<Controls {...controlsProps} />);
        const btn = wrapper.find('.btn-query');

        expect(controlsProps.handleQueryMeteorites).toHaveBeenCalledTimes(0);
        btn.simulate('click');
        expect(controlsProps.handleQueryMeteorites).toHaveBeenCalledTimes(1);
      });

      it('Should trigger handleToggleChangeHistoryPanel', () => {
        const wrapper = mount(<Controls {...controlsProps} />);
        // to enable toggle button
        wrapper.setProps({ changeLogIsEmpty: false });
        const btn = wrapper.find('.btn-toggle');

        expect(controlsProps.handleToggleChangeHistoryPanel).toHaveBeenCalledTimes(0);
        btn.simulate('click');
        expect(controlsProps.handleToggleChangeHistoryPanel).toHaveBeenCalledTimes(1);
      });
    });
  });
});
