import * as React from 'react';
import { TableData } from '@console/internal/components/factory';
import { KebabOption, Kebab } from '@console/internal/components/utils';
import { diskReplacementModal } from './disk-replacement-modal';
import { OCSStateAction, OCSState } from './state-reducer';

const startDiskReplacementAction = (diskName, diskInfo, isRebalancing, dispatch): KebabOption => ({
  label: 'Start Disk Replacement',
  callback: () =>
    diskReplacementModal({
      diskName,
      diskInfo,
      isRebalancing,
      dispatch,
    }),
});

export const OCSKebabOptions: React.FC<OCSKebabOptionsProps> = ({
  diskName,
  ocsState,
  dispatch,
}) => {
  const { diskOsdMap, isRebalancing } = ocsState;
  const diskInfo = diskOsdMap[diskName];
  const kebabOptions: KebabOption[] = [
    startDiskReplacementAction(diskName, diskInfo, isRebalancing, dispatch),
  ];

  return (
    <TableData className={Kebab.columnClass}>
      {/* Disable options for non OCS based disks */}
      <Kebab options={kebabOptions} isDisabled={!!diskInfo.osdName} />
    </TableData>
  );
};

type OCSKebabOptionsProps = {
  diskName: string;
  dispatch: React.Dispatch<OCSStateAction>;
  ocsState: OCSState;
};
