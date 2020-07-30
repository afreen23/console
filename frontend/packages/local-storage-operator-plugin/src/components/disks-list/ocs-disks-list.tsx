import * as React from 'react';
import * as cx from 'classnames';
import {
  Table,
  TableProps,
  TableRow,
  TableData,
  RowFunction,
} from '@console/internal/components/factory';
import { sortable } from '@patternfly/react-table';
import { humanizeBinaryBytes, Kebab } from '@console/internal/components/utils';
import { OCSKebabOptions } from '@console/ceph-storage-plugin/src/components/attached-devices-mode/lso-disk-inventory/ocs-kebab-options';
import { OCSStatus } from '@console/ceph-storage-plugin/src/components/attached-devices-mode/lso-disk-inventory/ocs-status-column';
import { useOCStateWatch } from '@console/ceph-storage-plugin/src/components/attached-devices-mode/lso-disk-inventory/use-ocs-state-watch';
import {
  OCSStateAction,
  OCSState,
} from '@console/ceph-storage-plugin/src/components/attached-devices-mode/lso-disk-inventory/state-reducer';
import { DiskMetadata } from './types';

export const tableColumnClasses = [
  '',
  '',
  cx('pf-m-hidden', 'pf-m-visible-on-xl'),
  cx('pf-m-hidden', 'pf-m-visible-on-2xl'),
  cx('pf-m-hidden', 'pf-m-visible-on-lg'),
  cx('pf-m-hidden', 'pf-m-visible-on-xl'),
  Kebab.columnClass,
];

const diskHeader = () => [
  {
    title: 'Name',
    sortField: 'path',
    transforms: [sortable],
    props: { className: tableColumnClasses[0] },
  },
  {
    title: 'Disk State',
    sortField: 'status.state',
    transforms: [sortable],
    props: { className: tableColumnClasses[1] },
  },
  {
    title: 'OCS Status',
    sortField: '',
    transforms: [],
    props: { className: tableColumnClasses[5] },
  },
  {
    title: 'Type',
    sortField: 'type',
    transforms: [sortable],
    props: { className: tableColumnClasses[2] },
  },
  {
    title: 'Model',
    sortField: 'model',
    transforms: [sortable],
    props: { className: tableColumnClasses[3] },
  },
  {
    title: 'Capacity',
    sortField: 'size',
    transforms: [sortable],
    props: { className: tableColumnClasses[4] },
  },
  {
    title: 'Filesystem',
    sortField: 'fstype',
    transforms: [sortable],
    props: { className: tableColumnClasses[5] },
  },
  {
    title: '',
    sortField: '',
    transforms: [],
    props: { className: tableColumnClasses[6] },
  },
];

const diskRow: RowFunction<DiskMetadata, OCSMetadata> = ({
  obj,
  index,
  key,
  style,
  customData,
}) => {
  const { ocsState, dispatch } = customData;
  const diskName = obj.path;
  const status = ocsState[diskName]?.status;
  return (
    <TableRow id={obj.deviceID} index={index} trKey={key} style={style}>
      <TableData className={tableColumnClasses[0]}>{obj.path}</TableData>
      <TableData className={tableColumnClasses[1]}>{obj.status.state}</TableData>
      <TableData className={tableColumnClasses[2]}>{obj.type || '-'}</TableData>
      <TableData className={cx(tableColumnClasses[3], 'co-break-word')}>
        {obj.model || '-'}
      </TableData>
      <TableData className={tableColumnClasses[4]}>
        {humanizeBinaryBytes(obj.size).string || '-'}
      </TableData>
      <TableData className={tableColumnClasses[5]}>{obj.fstype || '-'}</TableData>
      <OCSKebabOptions diskName={diskName} ocsState={ocsState} dispatch={dispatch} />
      <OCSStatus status={status} className={tableColumnClasses[1]} />
    </TableRow>
  );
};

export const OCSDisksList: React.FC<TableProps> = (props) => {
  const [ocsState, dispatch] = useOCStateWatch(props.customData.node);
  return (
    <Table
      {...props}
      aria-label="Disks List"
      Header={diskHeader}
      Row={diskRow}
      customData={{ ocsState, dispatch }}
      virtualize
    />
  );
};

type OCSMetadata = {
  ocsState: OCSState;
  dispatch: React.Dispatch<OCSStateAction>;
};
