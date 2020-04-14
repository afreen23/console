import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import {
  getName,
  getNodeRoles,
  getNodeCPUCapacity,
  getNodeAllocatableMemory,
} from '@console/shared';
<<<<<<< HEAD
import { humanizeCpuCores, ResourceLink, pluralize } from '@console/internal/components/utils/';
=======
import { humanizeCpuCores, ResourceLink } from '@console/internal/components/utils/';
>>>>>>> Refactored Node Selection Page for OCS Installation Flow
import { NodeKind } from '@console/internal/module/k8s';
import './ocs-install.scss';
import { hasOCSTaint, hasTaints, getConvertedUnits } from '../../utils/install';
import { Table } from '@console/internal/components/factory';
<<<<<<< HEAD
import { IRowData, IRow } from '@patternfly/react-table';
import { cephStorageLabel } from '../../selectors';
=======
import { OCS_LABEL } from '../../constants/ocs-install';
>>>>>>> Refactored Node Selection Page for OCS Installation Flow

const tableColumnClasses = [
  classNames('col-md-1', 'col-sm-1', 'col-xs-1'),
  classNames('col-md-4', 'col-sm-8', 'col-xs-11'),
  classNames('col-md-2', 'col-sm-3', 'hidden-xs'),
  classNames('col-md-2', 'hidden-sm', 'hidden-xs'),
  classNames('col-md-1', 'hidden-sm', 'hidden-xs'),
  classNames('col-md-2', 'hidden-sm', 'hidden-xs'),
];

const getColumns = () => {
  return [
    {
      title: 'Name',
      props: { className: tableColumnClasses[1] },
    },
    {
      title: 'Role',
      props: { className: tableColumnClasses[2] },
    },
    {
      title: 'Location',
      props: { className: tableColumnClasses[3] },
    },
    {
      title: 'CPU',
      props: { className: tableColumnClasses[4] },
    },
    {
      title: 'Memory',
      props: { className: tableColumnClasses[5] },
    },
  ];
};

<<<<<<< HEAD
const getRows = ({ componentProps, customData }): NodeTableRow[] => {
=======
const getRows = ({ componentProps, customData }): NodeRow[] => {
>>>>>>> Refactored Node Selection Page for OCS Installation Flow
  const { data } = componentProps;
  const { selectedNodes, setSelectedNodes, setVisibleRows, visibleRows } = customData;

  const isSelected = (selected: NodeKind[], nodeUID: string) =>
    selected.map((node) => node.metadata.uid).includes(nodeUID);
<<<<<<< HEAD

  const filteredData = data.filter((node: NodeKind) => hasOCSTaint(node) || !hasTaints(node));

  const rows = filteredData
    .filter((node: NodeKind) => hasOCSTaint(node) || !hasTaints(node))
    .map((node: NodeKind) => {
=======

  const filteredData = data.filter((node) => hasOCSTaint(node) || !hasTaints(node));

  const rows = filteredData
    .filter((node) => hasOCSTaint(node) || !hasTaints(node))
    .map((node) => {
>>>>>>> Refactored Node Selection Page for OCS Installation Flow
      const roles = getNodeRoles(node).sort();
      const cpuSpec: string = getNodeCPUCapacity(node);
      const memSpec: string = getNodeAllocatableMemory(node);
      const cells = [
        {
          title: <ResourceLink kind="Node" name={getName(node)} title={node.metadata.uid} />,
        },
        {
          title: roles.join(', ') || '-',
        },
        {
          title: node.metadata.labels?.['failure-domain.beta.kubernetes.io/zone'] || '-',
        },
        {
          title: `${humanizeCpuCores(cpuSpec).string || '-'}`,
        },
        {
          title: `${getConvertedUnits(memSpec)}`,
        },
      ];
      return {
        cells,
        selected: _.isArray(selectedNodes)
          ? isSelected(selectedNodes, node.metadata.uid)
<<<<<<< HEAD
          : _.has(node, ['metadata', 'labels', cephStorageLabel]),
=======
          : _.has(node, ['metadata', 'labels', OCS_LABEL]),
>>>>>>> Refactored Node Selection Page for OCS Installation Flow
        props: {
          id: node.metadata.uid,
        },
      };
    });

<<<<<<< HEAD
  if (!_.isEqual(filteredData, visibleRows)) {
    setVisibleRows(filteredData);
    if (!selectedNodes && filteredData.length) {
      const preSelected = filteredData.filter((row) =>
        _.has(row, ['metadata', 'labels', cephStorageLabel]),
=======
  if (JSON.stringify(filteredData) !== JSON.stringify(visibleRows)) {
    setVisibleRows(filteredData);
    if (!selectedNodes && filteredData.length) {
      const preSelected = filteredData.filter((row) =>
        _.has(row, ['metadata', 'labels', OCS_LABEL]),
>>>>>>> Refactored Node Selection Page for OCS Installation Flow
      );
      setSelectedNodes(preSelected);
    }
  }
  return rows;
};

<<<<<<< HEAD
const NodeTable: React.FC<NodeTableProps> = (props) => {
  const { selectedNodes, setSelectedNodes, visibleRows } = props.customData;

  const onSelect = (_event, isSelected: boolean, rowIndex: number, rowData: IRowData) => {
=======
const CustomNodeTable: React.FC<CustomNodeTableProps> = (props) => {
  const { selectedNodes, setSelectedNodes, visibleRows } = props.customData;

  const onSelect = (_event, isSelected, rowIndex, rowData) => {
>>>>>>> Refactored Node Selection Page for OCS Installation Flow
    const selectedUIDs = selectedNodes?.map((node) => node.metadata.uid) ?? [];
    const visibleUIDs = visibleRows?.map((row) => row.metadata.uid);
    if (rowIndex === -1) {
      if (isSelected) {
        const uniqueUIDs = _.uniq([...visibleUIDs, ...selectedUIDs]);
        setSelectedNodes(visibleRows.filter((node) => uniqueUIDs.includes(node.metadata.uid)));
      } else {
        const uniqueUIDs = _.xor(visibleUIDs, selectedUIDs);
        setSelectedNodes(visibleRows.filter((node) => uniqueUIDs.includes(node.metadata.uid)));
      }
    } else {
      const uniqueUIDs = _.xor(selectedUIDs, [rowData.props.id]);
      setSelectedNodes(visibleRows.filter((node) => uniqueUIDs.includes(node.metadata.uid)));
    }
  };
  return (
<<<<<<< HEAD
    <>
      <div className="ceph-node-list__max-height">
        <Table
          aria-label="Node Table"
          {...props}
          Rows={getRows}
          Header={getColumns}
          virtualize={false}
          onSelect={onSelect}
        />
      </div>
      <p className="control-label help-block" data-test-id="nodes-selected">
        {`${pluralize(selectedNodes?.length || 0, 'node', 'nodes')} selected`}
      </p>
    </>
  );
};

export default NodeTable;
=======
    <Table
      aria-label="node list table"
      {...props}
      Rows={getRows}
      Header={getColumns}
      virtualize={false}
      onSelect={onSelect}
    />
  );
};

export const NodeList = CustomNodeTable;
>>>>>>> Refactored Node Selection Page for OCS Installation Flow

type NodeTableProps = {
  data: NodeKind[];
  customData: {
    selectedNodes: NodeKind[];
    setSelectedNodes: React.Dispatch<React.SetStateAction<NodeKind[]>>;
    visibleRows: NodeKind[];
    setVisibleRows: React.Dispatch<React.SetStateAction<NodeKind[]>>;
  };
  filters: { name: string; label: { all: string[] } };
};

<<<<<<< HEAD
type NodeTableRow = {
  cells: Pick<IRow, 'cells'>;
=======
type NodeRow = {
  cells: {
    [key: string]: React.ReactText | React.ReactElement;
  }[];
>>>>>>> Refactored Node Selection Page for OCS Installation Flow
  props: {
    id: string;
  };
  selected: boolean;
};
