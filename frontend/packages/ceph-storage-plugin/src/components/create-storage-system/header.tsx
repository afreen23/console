import * as React from 'react';
import { TFunction } from 'i18next';
import {
  TextVariants,
  Text,
  TextContent,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';
import './create-storage-system.scss';

export const CreateStorageSystemHeader: React.FC<CreateStorageSystemHeaderProps> = ({
  appName,
  url,
  t,
}) => (
  <div className="odf-create-storage-system__header">
    <Breadcrumb className="odf-create-storage-system__breadcrumb">
      <BreadcrumbItem to={url.replace('/~new', '')}>{appName}</BreadcrumbItem>
      <BreadcrumbItem>{t('ceph-storage-plugin~Create StorageSystem')}</BreadcrumbItem>
    </Breadcrumb>
    <TextContent>
      <Text component={TextVariants.h1}>{t('ceph-storage-plugin~Create StorageSystem')}</Text>
      <Text component={TextVariants.small}>
        {t(
          'ceph-storage-plugin~StorageSystem is an entity of OpenShift Data Foundation. It represents all of the required storage and compute resources.',
        )}
      </Text>
    </TextContent>
  </div>
);

type CreateStorageSystemHeaderProps = {
  t: TFunction;
  appName: string;
  url: string;
};
