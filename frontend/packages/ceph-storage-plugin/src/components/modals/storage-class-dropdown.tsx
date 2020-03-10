import * as React from 'react';
import * as _ from 'lodash';
import { StorageClassDropdown } from '@console/internal/components/utils/storage-class-dropdown';
import { FieldLevelHelp } from '@console/internal/components/utils';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { storageClassTooltip } from '../../constants/ocs-install';
import './storage-class-dropdown.scss';


export const OCSStorageClassDropdown: React.FC<OCSStorageClassDropdownProps> = (props) => {
  const { onChange, defaultClass } = props;

  const getFilteredStorageClasses = (sc: K8sResourceKind) => {
    const cephStorageProvisioners = [
      'ceph.rook.io/block',
      'cephfs.csi.ceph.com',
      'rbd.csi.ceph.com',
    ];
    return cephStorageProvisioners.every(
      (provisioner: string) => !_.get(sc, 'provisioner').includes(provisioner),
    );
  }

  const handleStorageClass = (sc: K8sResourceKind) => {
    onChange(sc.metadata.name);
  };

  return <>
    <label className="control-label" htmlFor="storageClass">
      Storage Class
    <FieldLevelHelp>{storageClassTooltip}</FieldLevelHelp>
    </label>
    <StorageClassDropdown
      onChange={handleStorageClass}
      name={defaultClass}
      defaultClass={defaultClass}
      filter={getFilteredStorageClasses}
      hideClassName="ceph-sc-dropdown__hide-default"
      required
    />
  </>
};

type OCSStorageClassDropdownProps = {
  onChange: React.Dispatch<React.SetStateAction<string>>;
  defaultClass?: string;
};
