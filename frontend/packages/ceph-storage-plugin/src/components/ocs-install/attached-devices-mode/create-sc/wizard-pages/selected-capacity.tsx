import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@patternfly/react-core';
import { ChartDonut, ChartLabel } from '@patternfly/react-charts';

import { calculateRadius, Modal } from '@console/shared';
import { convertToBaseValue, humanizeBinaryBytes } from '@console/internal/components/utils/';
import { NodeModel } from '@console/internal/models';
import { ListPage } from '@console/internal/components/factory';
import { getNodesByHostNameLabel } from '@console/local-storage-operator-plugin/src/utils';
import {
  DISK_TYPES,
  deviceTypeDropdownItems,
  LABEL_OPERATOR,
} from '@console/local-storage-operator-plugin/src/constants';
import { NodesTable } from '@console/local-storage-operator-plugin/src/components/tables/select-nodes-table';
import {
  useK8sWatchResource,
  WatchK8sResource,
} from '@console/internal/components/utils/k8s-watch-hook';
import { referenceForModel } from '@console/internal/module/k8s';
import { LABEL_SELECTOR } from '@console/local-storage-operator-plugin/src/constants/disks-list';
import { LocalVolumeDiscoveryResult } from '@console/local-storage-operator-plugin/src/models';
import {
  DiskMetadata,
  LocalVolumeDiscoveryResultKind,
} from '@console/local-storage-operator-plugin/src/components/disks-list/types';
import { DiskType } from '@console/local-storage-operator-plugin/src/components/local-volume-set/types';
import { AVAILABLE } from '@console/ceph-storage-plugin/src/constants';
import '../../attached-devices.scss';
import { DiskListModal } from './disk-list-modal';
import { State } from '../state';
import { DiscoveredDisk } from 'packages/ceph-storage-plugin/src/types';

const getTotalCapacity = (disks: DiscoveredDisk[]) =>
  disks.reduce((total: number, disk: DiskMetadata) => total + disk.size, 0);

const isAvailableDisk = (disk: DiskMetadata | DiscoveredDisk) =>
  (disk?.status?.state === AVAILABLE && disk.type === DiskType.RawDisk) ||
  disk.type === DiskType.Partition;

const isValidSize = (disk: DiscoveredDisk, minSize: number, maxSize: number) =>
  Number(disk.size) >= minSize && (maxSize ? Number(disk.size) <= maxSize : true);

const isValidDiskProperty = (disk: DiscoveredDisk, property: DiskMetadata['property']) =>
  property ? property === disk.property : true;

const isValidDeviceType = (disk: DiscoveredDisk, types) =>
  types.includes(deviceTypeDropdownItems[disk.type.toUpperCase()]);

export const SelectedCapacity: React.FC<SelectedCapacityProps> = ({ ns, state }) => {
  const allLvsNodes = getNodesByHostNameLabel(state.lvsAllNodes);
  const selectedLvsNodes = getNodesByHostNameLabel(state.lvsSelectNodes);

  const lvdResultResource: WatchK8sResource = {
    kind: referenceForModel(LocalVolumeDiscoveryResult),
    namespace: ns,
    isList: true,
    selector: {
      matchExpressions: [
        {
          key: LABEL_SELECTOR,
          operator: LABEL_OPERATOR,
          values: [...allLvsNodes],
        },
      ],
    },
  };
  const { t } = useTranslation();
  const [lvdResults, lvdResultsLoaded, lvdResultsLoadError] = useK8sWatchResource<
    LocalVolumeDiscoveryResultKind[]
  >(lvdResultResource);
  const [showNodeList, setShowNodeList] = React.useState(false);
  const [showDiskList, setShowDiskList] = React.useState(false);

  let totalCapacity = 0;
  let selectedCapacity = 0;
  let allDiscoveredDisks: DiscoveredDisk[] = [];
  let chartDisks: DiscoveredDisk[] = [];

  const chartNodes: Set<string> = state.lvsIsSelectNodes ? selectedLvsNodes : allLvsNodes;
  const minSize: number = state.minDiskSize
    ? Number(convertToBaseValue(`${state.minDiskSize} ${state.diskSizeUnit}`))
    : 0;
  const maxSize: number = state.maxDiskSize
    ? Number(convertToBaseValue(`${state.maxDiskSize} ${state.diskSizeUnit}`))
    : undefined;

  if (allLvsNodes.size === lvdResults.length && !lvdResultsLoadError && lvdResultsLoaded) {
    allDiscoveredDisks = lvdResults.reduce((disks: DiscoveredDisk[], lvdr) => {
      const diskList = lvdr?.status?.discoveredDevices as DiscoveredDisk[];
      const lvdNode = lvdr?.spec?.nodeName;
      diskList.map((disk: DiscoveredDisk) => {
        if (isAvailableDisk(disk)) disk.node = lvdNode;
        return disk;
      });
      return [...diskList, ...disks];
    }, []);

    chartDisks = allDiscoveredDisks.filter((disk: DiscoveredDisk) => {
      if (chartNodes.has(disk.node)) {
        return (
          state.isValidDiskSize &&
          isValidSize(disk, minSize, maxSize) &&
          isValidDiskProperty(disk, DISK_TYPES[state.diskType]?.property) &&
          isValidDeviceType(disk, state.deviceType)
        );
      }
      return false;
    });
  }

  totalCapacity = getTotalCapacity(allDiscoveredDisks);
  selectedCapacity = getTotalCapacity(chartDisks);

  const donutData = [
    { x: 'Selected', y: selectedCapacity },
    {
      x: 'Available',
      y: Number(totalCapacity) - Number(selectedCapacity),
    },
  ];
  const { podStatusOuterRadius: radius } = calculateRadius(220);

  return (
    <div className="ceph-ocs-install__chart-wrapper">
      <div className="ceph-ocs-install_capacity-header">
        {t('ceph-storage-plugin~Selected Capacity')}
      </div>
      <div className="ceph-ocs-install__stats">
        <Button
          variant="link"
          isDisabled={!chartNodes.size}
          onClick={() => setShowNodeList(true)}
          className="ceph-ocs-install__node-list-btn"
        >
          {t('ceph-storage-plugin~{{nodes, number}} Node', {
            nodes: chartNodes.size,
            count: chartNodes.size,
          })}
        </Button>
        <div className="ceph-ocs-install_stats--divider" />
        <Button
          variant="link"
          isDisabled={!chartDisks.length}
          onClick={() => setShowDiskList(true)}
          className="ceph-ocs-install__disk-list-btn"
        >
          {t('ceph-storage-plugin~{{disks, number}} Disk', {
            disks: chartDisks.length,
            count: chartDisks.length,
          })}
        </Button>
      </div>
      <ChartDonut
        ariaDesc={t('ceph-storage-plugin~Selected versus Available Capacity')}
        ariaTitle={t('ceph-storage-plugin~Selected versus Available Capacity')}
        height={220}
        width={220}
        radius={radius}
        data={donutData}
        labels={({ datum }) => `${humanizeBinaryBytes(datum.y).string} ${datum.x}`}
        subTitle={t('ceph-storage-plugin~Out of {{capacity}}', {
          capacity: humanizeBinaryBytes(totalCapacity).string,
        })}
        title={humanizeBinaryBytes(selectedCapacity).string}
        constrainToVisibleArea
        subTitleComponent={
          <ChartLabel dy={5} style={{ fill: `var(--pf-global--palette--black-500)` }} />
        }
      />
      <DiskListModal
        showDiskList={showDiskList}
        disks={chartDisks}
        onCancel={() => setShowDiskList(false)}
      />
      <NodeListModal
        showNodeList={showNodeList}
        onCancel={() => setShowNodeList(false)}
        filteredNodes={[...chartNodes]}
      />
    </div>
  );
};

type SelectedCapacityProps = {
  state: State;
  ns: string;
};

const NodeListModal: React.FC<NodeListModalProps> = ({ filteredNodes, onCancel, showNodeList }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('ceph-storage-plugin~Selected Nodes')}
      isOpen={showNodeList}
      onClose={onCancel}
      className="ceph-ocs-install__filtered-modal"
      actions={[
        <Button key="confirm" variant="primary" onClick={onCancel}>
          {t('ceph-storage-plugin~Close')}
        </Button>,
      ]}
    >
      <ListPage
        kind={NodeModel.kind}
        showTitle={false}
        ListComponent={NodesTable}
        hideLabelFilter
        hideNameLabelFilters
        customData={{ filteredNodes, hasOnSelect: false }}
      />
    </Modal>
  );
};

type NodeListModalProps = {
  showNodeList: boolean;
  filteredNodes: string[];
  onCancel: () => void;
};
