import * as React from 'react';
// import * as classNames from 'classnames';
import { sortable } from '@patternfly/react-table';
import {
  Table,
  TableRow,
  TableData,
  ListPage,
  RowFunction,
} from '@console/internal/components/factory';
import { ResourceLink } from '@console/internal/components/utils';
import { referenceForModel, NodeKind } from '@console/internal/module/k8s';
import { NodeModel } from '@console/internal/models';
import { getUID, getName } from '@console/shared';
import './node-selection-list.scss';

const tableColumnClasses = ['', '', '', ''];

// @TODO: fix classes
const NodeTableHeader = () => {
  return [
    {
      title: 'Name',
      sortField: 'metadata.name',
      transforms: [sortable],
      props: { className: tableColumnClasses[0] },
    },
    {
      title: 'CPU',
      props: { className: tableColumnClasses[1] },
    },
    {
      title: 'Memory',
      props: { className: tableColumnClasses[2] },
    },
    {
      title: 'Location',
      props: { className: tableColumnClasses[3] },
    },
  ];
};
NodeTableHeader.displayName = 'NodeTableHeader';

const NodesTableRow: RowFunction<NodeKind> = ({ obj, index, key, style }) => {
  const nodeName = getName(obj);
  const nodeUID = getUID(obj);

  return (
    <TableRow id={nodeUID} index={index} trKey={key} style={style}>
      <TableData className={tableColumnClasses[0]}>
        <ResourceLink kind={referenceForModel(NodeModel)} name={nodeName} title={nodeUID} />
      </TableData>
      <TableData className={tableColumnClasses[1]}>cpu</TableData>
      <TableData className={tableColumnClasses[2]}>memory</TableData>
      <TableData className={tableColumnClasses[3]}>location</TableData>
    </TableRow>
  );
};

const NodesSelectionTable: React.FC = (props) => {
  return (
    <div className="mine">
      <Table
        {...props}
        aria-label="Nodes"
        Header={NodeTableHeader}
        Row={NodesTableRow}
        virtualize
      />
    </div>
  );
};

export const NodesSelectionList: React.FC<{ className: string }> = (props) => {
  return (
    <ListPage
      {...props}
      showTitle={false}
      hideTextFilter
      kind="Node"
      ListComponent={NodesSelectionTable}
    />
  );
};
