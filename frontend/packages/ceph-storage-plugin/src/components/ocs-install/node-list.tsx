import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import {
  getName,
  getNodeRoles,
  getNodeCPUCapacity,
  getNodeAllocatableMemory,
} from '@console/shared';
import { humanizeCpuCores, ResourceLink } from '@console/internal/components/utils/';
import { NodeKind } from '@console/internal/module/k8s';
import './ocs-install.scss';
import { hasOCSTaint, hasTaints, getConvertedUnits } from '../../utils/install';
import { Table } from '@console/internal/components/factory';
import { OCS_LABEL } from '../../constants/ocs-install';

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

const getRows = ({ componentProps, customData }): NodeRow[] => {
  const { data: filteredData } = componentProps;
  const { selectedNodes, setVisibleRows, visibleRows } = customData;

  const isSelected = (selected: NodeKind[], nodeUID: string) =>
    selected.map((node) => node.metadata.uid).includes(nodeUID);

  const rows = filteredData
    .filter((node) => hasOCSTaint(node) || !hasTaints(node))
    .map((node) => {
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
        selected: selectedNodes
          ? isSelected(selectedNodes, node.metadata.uid)
          : _.has(node, ['metadata', 'labels', OCS_LABEL]),
        nodeObject: node,
        cpuSpec,
        memSpec,
        id: node.metadata.uid,
      };
    });

  if (filteredData.length !== visibleRows?.length) {
    setVisibleRows(filteredData);
  }
  return rows;
};

const CustomNodeTable: React.FC<CustomNodeTableProps> = (props) => {
  const { selectedNodes, setSelectedNodes, visibleRows } = props.customData;

  const onSelect = (_event, isSelected, rowIndex, rowData) => {
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
      const uniqueUIDs = _.xor(selectedUIDs, [rowData.id]);
      setSelectedNodes(visibleRows.filter((node) => uniqueUIDs.includes(node.metadata.uid)));
    }
  };
  return (
    <>
      <div className="ceph-node-list__max-height">
        <Table
          aria-label="node list table"
          {...props}
          Rows={getRows}
          Header={getColumns}
          virtualize={false}
          onSelect={onSelect}
        />
      </div>
    </>
  );
};

export const NodeList = CustomNodeTable;

type CustomNodeTableProps = {
  data: NodeKind[];
  customData: {
    selectedNodes: NodeKind[];
    setSelectedNodes: React.Dispatch<React.SetStateAction<NodeKind[]>>;
    visibleRows: NodeKind[];
    setVisibleRows: React.Dispatch<React.SetStateAction<NodeKind[]>>;
  };
  filters: { name: string; label: { all: string[] } };
};

type NodeRow = {
  cells: {
    [key: string]: React.ReactText | React.ReactElement;
  }[];
  selected: boolean;
  nodeObject: NodeKind;
  cpuSpec: string;
  memSpec: string;
  id: string;
};
