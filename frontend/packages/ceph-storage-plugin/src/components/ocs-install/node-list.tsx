import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import {
  sortable,
  SortByDirection,
  ISortBy,
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';
import { tableFilters } from '@console/internal/components/factory/table-filters';
import { Alert, Button, ActionGroup } from '@patternfly/react-core';
import { ButtonBar } from '@console/internal/components/utils/button-bar';
import { history } from '@console/internal/components/utils/router';
import { SelectorInput } from '@console/internal/components/utils/index';
import {
  getNodeRoles,
  K8sResourceKind,
  K8sKind,
  k8sCreate,
  k8sPatch,
  NodeKind,
  referenceForModel,
  Status,
} from '@console/internal/module/k8s';
import { NodeModel } from '@console/internal/models';
import { ResourceLink, humanizeBinaryBytes } from '@console/internal/components/utils/index';
import { getNodeRoles, K8sResourceKind, NodeKind } from '@console/internal/module/k8s';
import { OCSContext } from './create-form';

import { Tooltip } from '@console/internal/components/utils/tooltip';
import { OCSServiceModel } from '../../models';
import { OCSStorageClassDropdown } from './storage-class-dropdown';
import {
  minSelectedNode,
  labelObj,
  ocsRequestData,
  taintObj,
} from '../../constants/ocs-install';

const ocsLabel = "cluster.ocs.openshift.io/openshift-storage";

const getConvertedUnits = (value, initialUnit) => {
  return (
    humanizeBinaryBytes(_.slice(value, 0, value.length - 2).join(''), initialUnit)
      .string || '-'
  );
};

const tableColumnClasses = [
  classNames('col-md-1', 'col-sm-1', 'col-xs-2'),
  classNames('col-md-5', 'col-sm-6', 'col-xs-8'),
  classNames('col-md-2', 'col-sm-3', 'col-xs-2'),
  classNames('col-md-2', 'hidden-sm', 'hidden-xs'),
  classNames('col-md-2', 'col-sm-2', 'hidden-xs'),
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

// return an empty array when there is no data
const getRows = (nodes) => {
  const c = nodes.map((node) => {
    const roles = getNodeRoles(node).sort();
    const obj = { cells: [], selected: false, id: node.metadata.name, labels: node.metadata.labels, taints: node.spec.taints };
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
        title: `${getConvertedUnits(_.get(node.status, 'allocatable.memory'), 'KiB')}`,
        props: { className: tableColumnClasses[4] },

      },
    ];
    return obj;
  });

  return c;
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

const stateToProps = ({ UI }, {
  data = [],
  filters = {},
  staticFilters = [{}],
  rowFilters = [] }) => {
  const allFilters = staticFilters ? Object.assign({}, filters, ...staticFilters) : filters;
  const newData = getFilteredRows(allFilters, rowFilters, data);
  return {
    data: newData,
    unfilteredData: data,
  };
}

const SelectableTable = ({ data, loaded, ocsProps }) => {
  const columns = getColumns();
  const [nodes, setNodes] = React.useState([]);
  const [sortBy, setSortBy] = React.useState<ISortBy>({ index: 0, direction: 'asc' });
  const [error, setError] = React.useState('');
  const [inProgress, setProgress] = React.useState(false);
  const [storageClass, setStorageClass] = React.useState('');
  const [selectedNodesCnt, setSelectedNodesCnt] = React.useState(0);
  // const [nodes, setNodes] = React.useState([]);

  React.useEffect(() => {
    const selectedNode = _.filter(nodes, 'selected').length;
    setSelectedNodesCnt(selectedNode);
  }, [nodes]);

  React.useEffect(() => {
    const formattedNodes = getRows(data);
    // pre-selection of nodes
    if (loaded && !nodes.length) {
      getPreSelectedNodes(formattedNodes);
      setNodes(formattedNodes);
    }
    // for getting nodes
    else if (formattedNodes.length) {
      nodes.forEach((row) => {
        if (row.selected) {
          const index = formattedNodes.findIndex((r) => r.id === row.id);
          formattedNodes[index].selected = true;
        }
      });
      setNodes(formattedNodes);
    }
  }, [data, loaded]);

  const onSort = (e, index, direction) => {
    e.preventDefault();
    const sortedNodes = nodes.sort((n1, n2) => (n1.id < n2.id ? -1 : n1.id > n2.id ? 1 : 0));
    setNodes(direction === SortByDirection.asc ? sortedNodes : sortedNodes.reverse());
    setSortBy({ index, direction });
  };

  const onSelect = (e, isSelected, rowId) => {
    e.stopPropagation();
    let newnodes;
    if (rowId === -1) {
      newnodes = nodes.map((oneRow) => {
        oneRow.selected = isSelected;
        return oneRow;
      });
    } else {
      newnodes = [...nodes];
      newnodes[rowId].selected = isSelected;
    }
    setNodes(newnodes);
  };

  const handleStorageClass = (sc) => {
    setStorageClass(_.get(sc, 'metadata.name'));
  };

  // labeling the selected nodes
  const labelNodes = (selectedNode: NodeKind[]) => {

    const labelPath = '/metadata/labels';
    const labelData = selectedNode.map((node: NodeKind) => {
      const labels = SelectorInput.arrayify(_.get(node, labelPath.split('/').slice(1)));
      const lblVal = {...SelectorInput.objectify(labels), ...labelObj }
      const patch = [
        {
          op: labels.length ? 'replace' : 'add',
          value: lblVal,
          path: labelPath,
        },
      ];
      patch[0].value = { ...patch[0].value, ...labelObj };
      return k8sPatch(NodeModel, node, patch);
    })
    return labelData;
};

  // tainting the selected nodes
  const taintNodes = (selectedNode: NodeKind[]) => {
    const taintData = selectedNode
      .filter((node: NodeKind) => {
        const roles = getNodeRoles(node);
        // don't taint master nodes as its already tainted
        return roles.indexOf('master') === -1;
      })
      .map((node) => {
        const taints = node.spec && node.spec.taints
          ? [...node.spec.taints, taintObj]
          : [taintObj];
        const patch = [
          {
            value: taints,
            path: '/spec/taints',
            op: node.spec.taints ? 'replace' : 'add',
          },
        ];
        return k8sPatch(NodeModel, node, patch);
      })
      
      return taintData;
  };

  const submit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    setProgress(true);
    setError('');

    const selectedData = _.filter(nodes, 'selected');
    const promises = [];

    promises.push(...labelNodes(selectedData));
    promises.push(...taintNodes(selectedData));

    const obj = _.cloneDeep(ocsRequestData);
    obj.spec.dataDeviceSet.storageClassName = storageClass;
    promises.push(k8sCreate(OCSServiceModel, obj));

    Promise.all(promises)
      .then(() => {
        history.push(
          `/k8s/ns/${ocsProps.namespace}/clusterserviceversions/${
            ocsProps.clusterServiceVersion.metadata.name
          }/${referenceForModel(OCSServiceModel)}/${obj.metadata.name}`,
        );
        setProgress(false);
        setError('');
      })
      .catch((err: Status) => {
        setProgress(false);
        setError(err.message);
      });
  };

  return (
    <>
      <Table
        onSelect={onSelect}
        cells={columns}
        rows={nodes}
        sortBy={sortBy}
        onSort={onSort}
        variant={TableVariant.compact}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <p className="control-label help-block" id="nodes-selected">
        {selectedNodesCnt} node(s) selected
      </p>
      <div className="form-group">
        <Tooltip content="The Storage Class will be used to request storage from the underlying infrastructure to create the backing persistent volumes that will be used to provide the OpenShift Container Storage (OCS) service">
          <OCSStorageClassDropdown
            onChange={handleStorageClass}
            id="storageclass-dropdown"
            required={false}
            name="storageClass"
          />
        </Tooltip>
      </div>
      <ButtonBar errorMessage={error} inProgress={inProgress}>
        <ActionGroup className="pf-c-form">
          <Button type="button" variant="primary" onClick={submit} isDisabled={selectedNodesCnt < minSelectedNode}>
            Create
          </Button>
          <Button type="button" variant="secondary" onClick={history.goBack}>
            Cancel
          </Button>
        </ActionGroup>
      </ButtonBar>
    </>
  );
};

export const MyTable = connect(stateToProps)(SelectableTable);

// export const NodeList = (props) => <MyTable {...props} />;
