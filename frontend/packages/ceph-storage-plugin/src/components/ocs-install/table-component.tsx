import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { ResourceLink, humanizeBinaryBytes } from '@console/internal/components/utils/index';
import { getNodeRoles } from '@console/internal/module/k8s';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  ISortBy,
  SortByDirection,
} from '@patternfly/react-table';
import { tableFilters } from '@console/internal/components/factory/table-filters';

const getConvertedUnits = (value, initialUnit, preferredUnit) => {
  return (
    humanizeBinaryBytes(_.slice(value, 0, value.length - 2).join(''), initialUnit, preferredUnit)
      .string || '-'
  );
};

const tableColumnClasses = [
  classNames('col-md-1', 'col-sm-1', 'col-xs-1'),
  classNames('col-md-5', 'col-sm-6', 'col-xs-8'),
  classNames('col-md-2', 'col-sm-3', 'hidden-2'),
  classNames('col-md-2', 'hidden-sm', 'hidden-xs'),
  classNames('col-md-2', 'hidden-2', 'hidden-xs'),
];

const getColumns = () => {
  return [
    {
      title: 'Name',
      sortField: 'metadata.name',
      transforms: [sortable], // what is the use ?
      props: { className: tableColumnClasses[1] },
    },
    {
      title: 'Role',
      props: { className: tableColumnClasses[2] },
    },
    {
      title: 'CPU',
      props: { className: tableColumnClasses[3] },
    },
    {
      title: 'Memory',
      props: { className: tableColumnClasses[4] },
    },
  ];
};

const getRows = (nodes) => {
  return nodes.map((node) => {
    const roles = getNodeRoles(node).sort();
    const obj = { cells: [] };
    obj.cells = [
      {
        title: <ResourceLink kind="Node" name={node.metadata.name} title={node.metadata.uid} />,
      },
      {
        title: roles.join(', ') || '-',
      },
      {
        title: `${_.get(node.status, 'capacity.cpu') || '-'} CPU`,
      },
      {
        title: `${getConvertedUnits(_.get(node.status, 'allocatable.memory'), 'KiB', 'GiB')}`,
      },
    ];
    return obj;
  });
};

const rowFiltersToFilterFuncs = (rowFilters) => {
  return (rowFilters || [])
    .filter(f => f.type && _.isFunction(f.filter))
    .reduce((acc, f) => ({ ...acc, [f.type]: f.filter }), {});
};

const getAllTableFilters = (rowFilters) => ({
  ...tableFilters,
  ...rowFiltersToFilterFuncs(rowFilters),
});

const getFilteredRows = (_filters, rowFilters, objects) => {
  if (_.isEmpty(_filters)) {
    return objects;
  }

  const allTableFilters = getAllTableFilters(rowFilters);
  let filteredObjects = objects;
  _.each(_filters, (value, name) => {
    const filter = allTableFilters[name];
    if (_.isFunction(filter)) {
      filteredObjects = _.filter(filteredObjects, o => filter(value, o));
    }
  });

  return filteredObjects;
};

const stateToProps = ({UI}, {
  data = [],
  filters = {},
  staticFilters = [{}],
  rowFilters = []}) => {
  const allFilters = staticFilters ? Object.assign({}, filters, ...staticFilters) : filters;
  let newData = getFilteredRows(allFilters, rowFilters, data);
  return {
    data: newData,
    unfilteredData: data,
  };
};

const SelectableTable = (props) => {
  const columns = getColumns();
  const myrows = getRows(props.data);
  const [rows, setRows] = React.useState(myrows);
  const [sortBy, setSortBy] = React.useState<ISortBy>({ index: 0, direction: 'asc' });

  React.useEffect(() => {
    const myrow = getRows(props.data);
    setRows(myrow);
  }, [props.data]);

  const onSort = (e, index, direction) => {
    e.preventDefault();
    const sortedRows = rows.sort((a, b) =>
      a[index] < b[index] ? -1 : a[index] > b[index] ? 1 : 0,
    );
    setSortBy({ index, direction });
    setRows(direction === SortByDirection.asc ? sortedRows : sortedRows.reverse());
  };

  const onSelect = (event, isSelected, rowId) => {
    let newrows;
    if (rowId === -1) {
      newrows = rows.map((oneRow) => {
        oneRow.selected = isSelected;
        return oneRow;
      });
    } else {
      newrows = [...rows];
      newrows[rowId].selected = isSelected;
    }
    setRows(newrows);
  };

  return (
    <Table onSelect={onSelect} cells={columns} rows={rows} sortBy={sortBy} onSort={onSort}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};

const MyTable = connect(stateToProps)(SelectableTable);

export const NodeList = (props) => <MyTable {...props} />;
