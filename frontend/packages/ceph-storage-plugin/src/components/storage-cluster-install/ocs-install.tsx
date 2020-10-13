import * as React from 'react';
import * as cx from 'classnames';
import {
  Alert,
  FormGroup,
  Switch,
  AlertProps,
  AlertVariant,
  Checkbox,
} from '@patternfly/react-core';
import { ListPage } from '@console/internal/components/factory';
import { NodeModel } from '@console/internal/models';
import { FieldLevelHelp } from '@console/internal/components/utils';
import { StorageClassResourceKind } from '@console/internal/module/k8s';
import { TechPreviewBadge } from '@console/shared';
import { OCSStorageClassDropdown } from '../modals/storage-class-dropdown';
import { storageClassTooltip } from '../../constants/ocs-install';
import '../components/create-/ocs-install.scss';

export const VALIDATIONS = {
  MINIMAL: {
    variant: AlertVariant.warning,
    title: (
      <div className="ceph-minimal-deployment-alert__header">
        A minimal cluster deployment will be performed.
        <TechPreviewBadge />
      </div>
    ),
    text:
      'The selected nodes do not match the OCS storage cluster recommended requirements of an aggregated 42 CPUs and 102 GiB of RAM. If the selection cannot be modified, a minimal cluster will be deployed.',
  },
};

export const Validation: React.FC<AlertProps> = ({ className, variant, title, children }) => (
  <Alert className={cx('co-alert', className)} variant={variant} title={title} isInline>
    {children}
  </Alert>
);

export const EncryptionSection: React.FC<EncryptionSectionProps> = ({ isChecked, onChange }) => (
  <FormGroup fieldId="configure-encryption" label="Encryption">
    <Checkbox
      id="configure-encryption"
      isChecked={isChecked}
      label="Enable Encryption"
      aria-label="Checkbox with description example"
      description="Data encryption for block and file storage. Object storage is always encrypted."
      onChange={onChange}
    />
  </FormGroup>
);

type EncryptionSectionProps = {
  onChange: (checked: boolean) => void;
  isChecked: boolean;
};

type SelectNodesSectionProps = {
  table: React.ComponentType<any>;
  customData?: any;
  children?: React.ReactChild;
  nameFilterPlaceholder?: string;
  labelFilterPlaceholder?: string;
};

type StorageClassSectionProps = {
  handleStorageClass: (sc: StorageClassResourceKind) => void;
  filterSC: (sc: StorageClassResourceKind) => boolean;
  children?: React.ReactElement;
};
