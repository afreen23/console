import * as React from 'react';
import * as _ from 'lodash';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { cephBlockPoolResource } from '../constants/resources';
import { Dropdown } from '@patternfly/react-core/dist/js/components/Dropdown/Dropdown';
import { DropdownItem } from '@patternfly/react-core/dist/js/components/Dropdown/DropdownItem';
import { DropdownToggle } from '@patternfly/react-core/dist/js/components/Dropdown';
import { CaretDownIcon } from '@patternfly/react-icons';

const PoolResourceComponent: React.FC<PoolParams> = ({ onParamChange }) => {
  const [data, loaded, loadError] = useK8sWatchResource<K8sResourceKind[]>(cephBlockPoolResource);
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [poolName, setPoolName] = React.useState('');

  const handleDropdownChange = (e) => {
    setPoolName(e.currentTarget.id);
    onParamChange(e.currentTarget.id);
  };

  const poolDropdownItems = _.map(data, (pool, key) => (
    <DropdownItem
      key={key}
      component="button"
      id={pool?.metadata?.name}
      onClick={(e) => handleDropdownChange(e)}
    >
      {pool?.metadata?.name}
    </DropdownItem>
  ));

  const onToggle = () => {
    setOpen(!isOpen);
  };
  const onSelect = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <>
      {loaded && !loadError && (
        <div className="form-group">
          <label className="co-required" htmlFor="ocs-storage-pool">
            Pool
          </label>
          <Dropdown
            title="Select Pool"
            className="dropdown dropdown--full-width"
            toggle={
              <DropdownToggle id="toggle-id" onToggle={onToggle} iconComponent={CaretDownIcon}>
                {poolName || 'Select a Pool'}
              </DropdownToggle>
            }
            isOpen={isOpen}
            dropdownItems={poolDropdownItems}
            onSelect={onSelect}
            id="ocs-storage-pool"
          />
          <span className="help-block">Ceph pool into which volume data shall be stored</span>
        </div>
      )}
    </>
  );
};

type PoolParams = {
  onParamChange: Function;
};

export const StorageClassFormProvisoners = {
  csi: {
    'openshift-storage.rbd.csi.ceph.com': {
      title: 'Ceph RBD',
      provisioner: 'rbd.csi.ceph.com',
      parameters: {
        clusterID: {
          name: 'Cluster ID',
          hintText: 'The namespace where Ceph is deployed',
          value: 'openshift-storage',
          visible: () => false,
        },
        pool: {
          name: 'Pool',
          hintText: 'Ceph pool into which volume data shall be stored',
          required: true,
          Component: PoolResourceComponent,
        },
        imageFormat: {
          name: 'Image Format',
          hintText: 'RBD image format. Defaults to "2"',
          value: '2',
          visible: () => false,
        },
        imageFeatures: {
          name: 'Image Features',
          hintText: 'Ceph RBD image features',
          value: 'layering',
          visible: () => false,
        },
        'csi.storage.k8s.io/provisioner-secret-name': {
          name: 'Provisioner Secret Name',
          hintText: 'The name of provisioner secret',
          value: 'rook-csi-rbd-provisioner',
          visible: () => false,
        },
        'csi.storage.k8s.io/provisioner-secret-namespace': {
          name: 'Provisioner Secret Namespace',
          hintText: 'The namespace where provisioner secret is created',
          value: 'openshift-storage',
          visible: () => false,
        },
        'csi.storage.k8s.io/node-stage-secret-name': {
          name: 'Node Stage Secret Name',
          hintText: 'The name of Node Stage secret',
          value: 'rook-csi-rbd-node',
          visible: () => false,
        },
        'csi.storage.k8s.io/node-stage-secret-namespace': {
          name: 'Node Stage Secret Namespace',
          hintText: 'The namespace where provisioner secret is created',
          value: 'openshift-storage',
          visible: () => false,
        },
        'csi.storage.k8s.io/fstype': {
          name: 'Filesystem Type',
          hintText: 'Ceph RBD filesystem type. Default set to ext4',
          value: 'ext4',
          visible: () => false,
        },
      },
    },
    'openshift-storage.cephfs.csi.ceph.com': {
      title: 'Ceph FS',
      provisioner: 'cephfs.csi.ceph.com',
      parameters: {
        clusterID: {
          name: 'Cluster ID',
          hintText: 'The namespace where Ceph is deployed',
          value: 'openshift-storage',
          visible: () => false,
        },
        fsName: {
          name: 'Filesystem Name',
          hintText: 'CephFS filesystem name into which the volume shall be created',
          required: true,
        },
        'csi.storage.k8s.io/provisioner-secret-name': {
          name: 'Provisioner Secret Name',
          hintText: 'The name of provisioner secret',
          value: 'rook-csi-cephfs-provisioner',
          visible: () => false,
        },
        'csi.storage.k8s.io/provisioner-secret-namespace': {
          name: 'Provisioner Secret Namespace',
          hintText: 'The namespace where provisioner secret is created',
          value: 'openshift-storage',
          visible: () => false,
        },
        'csi.storage.k8s.io/node-stage-secret-name': {
          name: 'Node Stage Secret Name',
          hintText: 'The name of Node Stage secret',
          value: 'rook-csi-cephfs-node',
          visible: () => false,
        },
        'csi.storage.k8s.io/node-stage-secret-namespace': {
          name: 'Node Stage Secret Namespace',
          hintText: 'The namespace where provisioner secret is created',
          value: 'openshift-storage',
          visible: () => false,
        },
      },
    },
  },
};
