import { K8sResourceCommon } from '@console/internal/module/k8s';

export type LocalVolumeDiscoveryResultKind = K8sResourceCommon & {
  spec: {
    nodeName: string;
  };
  status: {
    discoveredDevices: {
      deviceID: string;
      fstype: string;
      model: string;
      path: string;
      serial: string;
      size: string;
      status: {
        state: DiskStates;
      };
      type: string;
      vendor: string;
    };
  };
};

export type DiskMetadata = LocalVolumeDiscoveryResultKind['status']['discoveredDevices'];

export type DiskStates = 'Available' | 'Unknown' | 'NotAvailable';
