import * as React from 'react';
import * as _ from 'lodash';
import { Alert, Button, ActionGroup } from '@patternfly/react-core';
import { ButtonBar } from '@console/internal/components/utils/button-bar';
import { history } from '@console/internal/components/utils/router';
import {
  K8sResourceKind,
  K8sKind,
} from '@console/internal/module/k8s';
import { RequestSizeInput } from '@console/internal/components/utils/index';
import { ListPage } from '@console/internal/components/factory';
import { NodeModel } from '@console/internal/models';
import { ClusterServiceVersionKind } from '@console/internal/components/operator-lifecycle-manager/index';
import { StorageClassDropdown } from '@console/internal/components/utils/storage-class-dropdown';
import { Tooltip } from '@console/internal/components/utils/tooltip';
import { NodeList } from './table-component';

export const CreateOCSServiceForm: React.FC<CreateOCSServiceFormProps> = (props) => {
  const title = 'Create New OCS Service';
  const dropdownUnits = {
    TiB: 'TiB',
  };

  const [error, setError] = React.useState('');
  const [inProgress, setProgress] = React.useState(false);
  const [requestSizeUnit, setRequestSizeUnit] = React.useState(dropdownUnits.TiB); //no other unit should be allowed
  const [requestSizeValue, setRequestSizeValue] = React.useState('1');
  const [storageClass, setStorageClass] = React.useState('');
  const [createBtnDisabled, setCreateBtnDisabled] = React.useState(true);
  const [selectedNodesCnt, setSelectedNodesCnt] = React.useState(0);
  const [selectedNodeData, setSelectedNodeData] = React.useState([]);

  React.useEffect(() => {
    selectedNodesCnt >= 3 ? setCreateBtnDisabled(false) : setCreateBtnDisabled(true);
  }, [selectedNodesCnt]);

  const handleRequestSizeInputChange = obj => {
    setRequestSizeUnit(obj.unit);
    setRequestSizeValue(obj.value);
  };

  const handleStorageClass = storageClass => {
    setStorageClass(_.get(storageClass, 'metadata.name'));
  };

  return (
    <div className="ceph-ocs-install__form co-m-pane__body co-m-pane__form">
      <h1 className="co-m-pane__heading co-m-pane__heading--baseline">
        <div className="co-m-pane__name">{title}</div>
      </h1>
      <p className="co-m-pane__explanation">
        OCS runs as a cloud-native service for optimal integration with applications in need of
        storage, and handles the scenes such as provisioning and management.
      </p>
      <form className="co-m-pane__body-group" onSubmit={}>
        <div className="form-group co-create-route__name">
          <label className="co-required">Select Nodes</label>
          <div className="help-block" id="select-node-help">
            A minimum of 3 nodes needs to be labeled with <code>cluster.ocs.openshift.io/openshift-storage=""</code> in order to create the OCS Service.
          </div>
          <Alert
            className="co-alert ceph-ocs-info__alert"
            variant="info"
            title="An AWS bucket will be created to provide the OCS Service."
          />
          <p className="co-legend co-required ceph-ocs-desc__legend">
            Select at least 3 nodes you wish to use.
          </p>
          <ListPage
            kind={NodeModel.kind}
            showTitle={false}
            ListComponent={NodeList} />
          <p className="help-block" id="nodes-selected">
            {selectedNodesCnt} node(s) selected
          </p>
        </div>
        <h4>OCS Service Capacity</h4>
        <div className="form-group">
          <label className="control-label" htmlFor="request-size-input">
            Requested Capacity
          </label>
          <RequestSizeInput
            name="requestSize"
            required={false}
            onChange={handleRequestSizeInputChange}
            defaultRequestSizeUnit={requestSizeUnit}
            defaultRequestSizeValue={requestSizeValue}
            dropdownUnits={dropdownUnits}
          />
        </div>
        <div className="form-group">
          <Tooltip content="The Storage Class will be used to request storage from the underlying infrastructure to create the backing persistent volumes that will be used to provide the OpenShift Container Storage (OCS) service">
            <StorageClassDropdown
              onChange={handleStorageClass}
              id="storageclass-dropdown"
              required={false}
              name="storageClass"
            />
          </Tooltip>
        </div>
        <ButtonBar errorMessage={error} inProgress={inProgress}>
          <ActionGroup className="pf-c-form">
            <Button
              type="submit"
              variant="primary"
              isDisabled={createBtnDisabled}>
              Create
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={history.goBack}>
              Cancel
            </Button>
          </ActionGroup>
        </ButtonBar>
      </form>
    </div>
  );
};

type CreateOCSServiceFormProps = {
  operandModel: K8sKind;
  sample?: K8sResourceKind;
  namespace: string;
  clusterServiceVersion: ClusterServiceVersionKind;
};
