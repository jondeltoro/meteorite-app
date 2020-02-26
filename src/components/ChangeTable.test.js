import React from 'react';
import { mount, render } from 'enzyme';

import ChangeTable from './ChangeTable';

jest.mock('react-datepicker', _ => {
  return props => (
    <div className="dummy-date-picker" onChange={props.onChange}>
      {JSON.stringify(props.selected)}
    </div>
  );
});

describe('ChangeTable component', () => {
  let changeTableProps = { changeLog: [] };

  beforeEach(() => {
    changeTableProps = {
      changeLog: [],
    };
  });

  describe('Integration tests', () => {
    it('Should render', () => {
      mount(<ChangeTable {...changeTableProps} />);
    });

    it('Should show an empty table', () => {
      const wrapper = mount(<ChangeTable {...changeTableProps} />);
      expect(wrapper.find('table>tbody>tr').length).toBe(0);
    });

    it('Should show a table with data', () => {
      const changeLogDataset = [
        {
          timestamp: '2010',
          id: '1',
          oldRecord: { name: 'name 1', baz: 'baz', foo: 'foo' },
          newRecord: { name: 'name 01', baz: 'baz', foo: 'foo' },
        },
        {
          timestamp: '2011',
          id: '2',
          oldRecord: { name: 'name 2', baz: 'baz', foo: 'foo' },
          newRecord: { name: 'name 02', baz: 'baz', foo: 'foo' },
        },
        {
          timestamp: '2012',
          id: '3',
          oldRecord: { name: 'name 3', baz: 'baz', foo: 'foo' },
          newRecord: { name: 'name 03', baz: 'baz', foo: 'foo' },
        },
        {
          timestamp: '2013',
          id: '4',
          oldRecord: { name: 'name 4', baz: 'baz', foo: 'foo' },
          newRecord: { name: 'name 04', baz: 'baz', foo: 'foo' },
        },
      ];

      const wrapper = mount(<ChangeTable {...changeTableProps} />);
      wrapper.setProps({ changeLog: changeLogDataset });
      const parseFunction = wrapper.instance().formatObj;

      expect(wrapper.find('table>tbody>tr').length).toBe(changeLogDataset.length);
      const firstRow = wrapper.find('table>tbody>tr').first();
      const columns = firstRow.find('td');
      expect(columns.length).toBe(4);
      expect(columns.at(0).text()).toBe(changeLogDataset[0].timestamp);
      expect(columns.at(1).text()).toBe(changeLogDataset[0].id);
      const oldRecordWrapper = render(<>{parseFunction(changeLogDataset[0].oldRecord)}</>);
      expect(columns.at(2).text()).toBe(oldRecordWrapper.text());
      const newRecordWrapper = render(<>{parseFunction(changeLogDataset[0].newRecord)}</>);
      expect(columns.at(3).text()).toBe(newRecordWrapper.text());
    });
  });
});
