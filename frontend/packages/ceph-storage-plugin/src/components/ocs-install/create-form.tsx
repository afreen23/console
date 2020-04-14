import * as React from 'react';
import * as _ from 'lodash';
import { match } from 'react-router';
import { Alert, Title, ActionGroup, Button } from '@patternfly/react-core';
import { NodeKind, k8sPatch, k8sCreate, referenceForModel } from '@console/internal/module/k8s';
import { ListPage } from '@console/internal/components/factory';
import { NodeModel } from '@console/internal/models';
import { hasLabel, getName } from '@console/shared';
import {
  withHandlePromise,
  HandlePromiseProps,
  history,
  FieldLevelHelp,
  ButtonBar,
} from '@console/internal/components/utils';
import { ocsRequestData, labelTooltip, minSelectedNode } from '../../constants/ocs-install';
import { OCSServiceModel } from '../../models';
import { OCSStorageClassDropdown } from '../modals/storage-class-dropdown';
import { OSDSizeDropdown } from '../../utils/osd-size-dropdown';
import NodeTable from './node-list';
import './ocs-install.scss';
import { cephStorageLabel } from '../../selectors';

const makeLabelNodesRequest = (selectedNodes: NodeKind[]): Promise<NodeKind>[] => {
  const patch = [
    {
      op: 'add',
      path: '/metadata/labels/cluster.ocs.openshift.io~1openshift-storage',
      value: '',
    },
  ];
  return _.reduce(
    selectedNodes,
    (accumulator, node) => {
      return hasLabel(node, cephStorageLabel)
        ? accumulator
        : [...accumulator, k8sPatch(NodeModel, node, patch)];
    },
    [],
  );
};

const makeOCSRequest = (
  selectedData: NodeKind[],
  storageClass: string,
  osdSize: string,
): Promise<any> => {
  const promises = makeLabelNodesRequest(selectedData);
  const ocsObj = _.cloneDeep(ocsRequestData);
  ocsObj.spec.storageDeviceSets[0].dataPVCTemplate.spec.storageClassName = storageClass;
  ocsObj.spec.storageDeviceSets[0].dataPVCTemplate.spec.resources.requests.storage = osdSize;

  return Promise.all(promises).then(() => {
    return k8sCreate(OCSServiceModel, ocsObj);
  });
};

export const CreateOCSServiceForm = withHandlePromise<
  CreateOCSServiceFormProps & HandlePromiseProps
>((props) => {
  const {
    handlePromise,
    errorMessage,
    inProgress,
    match: {
      params: { appName, ns },
    },
  } = props;
  const [selectedNodes, setSelectedNodes] = React.useState<NodeKind[]>(null);
  const [visibleRows, setVisibleRows] = React.useState<NodeKind[]>(null);
  const [osdSize, setOSDSize] = React.useState('2Ti');
  const [storageClass, setStorageClass] = React.useState<string>(null);

  const submit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    return handlePromise(makeOCSRequest(selectedNodes, storageClass, osdSize)).then(() => {
      history.push(
        `/k8s/ns/${ns}/clusterserviceversions/${appName}/${referenceForModel(
          OCSServiceModel,
        )}/${getName(ocsRequestData)}`,
      );
    });
  };

  return (
    <form className="co-m-pane__body-group">
      <div className="form-group co-create-route__name">
        <Title headingLevel="h5" size="lg" className="ceph-install-select-node__title">
          Select Nodes
        </Title>
        <p className="co-m-pane__explanation">
          Selected nodes will be labeled with
          <code>cluster.ocs.openshift.io/openshift-storage=&quot;&quot;</code> to create the OCS
          Service.
        </p>
        <Alert
          className="co-alert"
          variant="info"
          title="A bucket will be created to provide the OCS Service."
          isInline
        />
        <p className="co-legend" data-test-id="warning">
          Select at least 3 nodes in different failure domains with minimum requirements of 16 CPUs
          and 64 GiB of RAM per node.
        </p>
        <p>
          3 selected nodes are used for initial deployment. The remaining selected nodes will be
          used by OpenShift as scheduling targets for OCS scaling.
        </p>
        <ListPage
          kind={NodeModel.kind}
          showTitle={false}
          ListComponent={NodeTable}
          customData={{ selectedNodes, setSelectedNodes, visibleRows, setVisibleRows }}
        />
        <div className="ceph-ocs-install__ocs-service-capacity--dropdown">
          <OCSStorageClassDropdown onChange={setStorageClass} data-test-id="ocs-dropdown" />
        </div>
        <div className="ceph-ocs-install__ocs-service-capacity">
          <label className="control-label" htmlFor="ocs-service-capacity-dropdown">
            OCS Service Capacity
            <FieldLevelHelp>{labelTooltip}</FieldLevelHelp>
          </label>
          <OSDSizeDropdown
            className="ceph-ocs-install__ocs-service-capacity--dropdown"
            selectedKey={osdSize}
            onChange={setOSDSize}
            data-test-id="osd-dropdown"
          />
        </div>
        <ButtonBar errorMessage={errorMessage} inProgress={inProgress}>
          <ActionGroup className="pf-c-form">
            <Button
              type="button"
              variant="primary"
              onClick={submit}
              isDisabled={(selectedNodes?.length ?? 0) < minSelectedNode}
            >
              Create
            </Button>
            <Button type="button" variant="secondary" onClick={history.goBack}>
              Cancel
            </Button>
          </ActionGroup>
        </ButtonBar>
      </div>
    </form>
  );
});

type CreateOCSServiceFormProps = {
  match: match<{ appName: string; ns: string }>;
};
