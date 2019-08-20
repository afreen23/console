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

const ocsLabel = "cluster.ocs.openshift.io/openshift-storage";

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
    const obj = { cells: [] , selected: false, id: node.metadata.name, labels: node.metadata.labels, taints: node.spec.taints };
    obj.cells = [
      {
        title: <ResourceLink kind="Node" name={node.metadata.name} title={node.metadata.uid} />,
        props: { className: tableColumnClasses[1] },
      },
      {
        title: roles.join(', ') || '-',
        props: { className: tableColumnClasses[2] },

      },
      {
        title: `${_.get(node.status, 'capacity.cpu') || '-'} CPU`,
        props: { className: tableColumnClasses[3] },

      },
      {
        title: `${getConvertedUnits(_.get(node.status, 'allocatable.memory'), 'KiB', 'GiB')}`,
        props: { className: tableColumnClasses[4] },

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

const getPreSelectedNodes = (nodes) => {
  nodes.forEach((node) => {
      node.selected = _.get(node, `labels['${ocsLabel}']`) !== undefined;
  });
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
  const [rows, setRows] = React.useState([]);
  const [sortBy, setSortBy] = React.useState<ISortBy>({ index: 0, direction: 'asc' });

  React.useEffect(() => {
    // pre-selection of nodes
    if(props.loaded && !rows.length) {
      const preRows = getRows(props.data);
      getPreSelectedNodes(preRows);
      setRows(preRows);
    }
    // for getting nodes
    else {
      const newRows = getRows(props.data);
      rows.forEach(row => {
         if(row.selected) {
           const index = newRows.findIndex(r => r.id === row.id);
           newRows[index].selected = true;
         }
       })
     setRows(newRows);
    }
  }, [props.data]);

  const onSort = (e, index, direction) => {
    e.preventDefault();
    const sortedRows = rows.sort((a, b) =>
      a.id < b.id ? -1 : a.id > b.id? 1 : 0,
    );
    setRows(direction === SortByDirection.asc ? sortedRows : sortedRows.reverse());
    setSortBy({ index, direction });
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
    // setIsNodesSelected(isSelected);
  };

  console.log("PROPS",props);

  return (
    <Table onSelect={onSelect} cells={columns} rows={rows} sortBy={sortBy} onSort={onSort}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};

const MyTable = connect(stateToProps)(SelectableTable);

export const NodeList = (props) => <MyTable {...props} />;
