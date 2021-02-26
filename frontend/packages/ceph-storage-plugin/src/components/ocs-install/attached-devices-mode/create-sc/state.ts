import { diskModeDropdownItems, KMSEmptyState } from '../../../../constants';
import { deviceTypeDropdownItems } from '@console/local-storage-operator-plugin/src/constants';
import { StorageClassResourceKind, NodeKind } from '@console/internal/module/k8s';
import { EncryptionType, KMSConfig, NetworkType } from '../../../../types';

export const initialState: State = {
  // states for step 2
  volumeSetName: '',
  storageClassName: '',
  showNodesListOnLVS: false,
  isValidDiskSize: true,
  diskType: 'All',
  diskMode: diskModeDropdownItems.BLOCK,
  deviceType: [deviceTypeDropdownItems.DISK, deviceTypeDropdownItems.PART],
  maxDiskLimit: '',
  minDiskSize: '1',
  maxDiskSize: '',
  diskSizeUnit: 'Gi',
  isValidMaxSize: true,
  showConfirmModal: false,

  // states for step 3-5
  enableMinimal: false,
  enableFlexibleScaling: false,
  storageClass: { provisioner: '', reclaimPolicy: '' },
  nodes: [],
  // Encryption state initialization
  encryption: {
    clusterWide: false,
    storageClass: false,
    advanced: false,
    hasHandled: true,
  },
  // KMS object state
  kms: {
    name: {
      value: '',
      valid: true,
    },
    token: {
      value: '',
      valid: true,
    },
    address: {
      value: '',
      valid: true,
    },
    port: {
      value: '',
      valid: true,
    },
    backend: '',
    caCert: null,
    tls: '',
    clientCert: null,
    clientKey: null,
    providerNamespace: '',
    hasHandled: true,
    caCertFile: '',
    clientCertFile: '',
    clientKeyFile: '',
  },
  networkType: NetworkType.DEFAULT,
  clusterNetwork: '',
  publicNetwork: '',
  stretchClusterChecked: false,
  selectedArbiterZone: '',
  // Local volume Discovery
  lvdIsSelectNodes: false,
  lvdAllNodes: [],
  lvdSelectNodes: [],
  lvdError: '',
  lvdInProgress: false,
  // Local volume Set
  lvsIsSelectNodes: false,
  lvsAllNodes: [],
  lvsSelectNodes: [],
};

export type State = {
  volumeSetName: string;
  storageClassName: string;
  showNodesListOnLVS: boolean;
  isValidDiskSize: boolean;
  diskType: string;
  diskMode: string;
  deviceType: string[];
  maxDiskLimit: string;
  minDiskSize: string;
  maxDiskSize: string;
  diskSizeUnit: string;
  isValidMaxSize: boolean;
  showConfirmModal: boolean;

  enableMinimal: boolean;
  enableFlexibleScaling: boolean;
  storageClass: StorageClassResourceKind;
  nodes: NodeKind[];
  // Encryption state declare
  encryption: EncryptionType;
  kms: KMSConfig;
  networkType: NetworkType;
  clusterNetwork: string;
  publicNetwork: string;
  stretchClusterChecked: boolean;
  selectedArbiterZone: string;
  // Local volume Discovery
  lvdIsSelectNodes: boolean;
  lvdAllNodes: NodeKind[];
  lvdSelectNodes: NodeKind[];
  lvdInProgress: boolean;
  lvdError: string;
  // Local volume Set
  lvsIsSelectNodes: boolean;
  lvsAllNodes: NodeKind[];
  lvsSelectNodes: NodeKind[];
};

export type Action =
  | { type: 'setVolumeSetName'; name: string }
  | { type: 'setStorageClassName'; name: string }
  | { type: 'setShowNodesListOnLVS'; value: boolean }
  | { type: 'setIsValidDiskSize'; value: boolean }
  | { type: 'setDiskType'; value: string }
  | { type: 'setDeviceType'; value: string[] }
  | { type: 'setDiskMode'; value: string }
  | { type: 'setMaxDiskLimit'; value: string }
  | { type: 'setNodeNames'; value: string[] }
  | { type: 'setMinDiskSize'; value: number | string }
  | { type: 'setMaxDiskSize'; value: number | string }
  | { type: 'setDiskSizeUnit'; value: string }
  | { type: 'setIsValidMaxSize'; value: boolean }
  | { type: 'setShowConfirmModal'; value: boolean }
  | { type: 'setEnableMinimal'; value: boolean }
  | { type: 'setEnableFlexibleScaling'; value: boolean }
  | { type: 'setStorageClass'; value: StorageClassResourceKind }
  | { type: 'setNodes'; value: NodeKind[] }
  // Encryption state actions
  | { type: 'setEncryption'; value: EncryptionType }
  | { type: 'setKmsEncryption'; value: KMSConfig }
  | { type: 'clearKmsState' }
  | { type: 'setNetworkType'; value: NetworkType }
  | { type: 'setClusterNetwork'; value: string }
  | { type: 'setPublicNetwork'; value: string }
  | { type: 'setStretchClusterChecked'; value: boolean }
  | { type: 'setSelectedArbiterZone'; value: string }
  // Local volume discovery
  | { type: 'setLvdIsSelectNodes'; value: boolean }
  | { type: 'setLvdAllNodes'; value: NodeKind[] }
  | { type: 'setLvdSelectNodes'; value: NodeKind[] }
  | { type: 'setLvdError'; value: string }
  | { type: 'setLvdInProgress'; value: boolean }
  // Local volume set
  | { type: 'setLvsSelectNodes'; value: NodeKind[] }
  | { type: 'setLvsAllNodes'; value: NodeKind[] }
  | { type: 'setLvsIsSelectNodes'; value: boolean };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setVolumeSetName':
      return Object.assign({}, state, { volumeSetName: action.name });
    case 'setStorageClassName':
      return Object.assign({}, state, { storageClassName: action.name });
    case 'setShowNodesListOnLVS':
      return Object.assign({}, state, { showNodesListOnLVS: action.value });
    case 'setIsValidDiskSize':
      return Object.assign({}, state, { isValidDiskSize: action.value });
    case 'setDiskType':
      return Object.assign({}, state, { diskType: action.value });
    case 'setDiskMode':
      return Object.assign({}, state, { diskMode: action.value });
    case 'setDeviceType':
      return Object.assign({}, state, { deviceType: action.value });
    case 'setMaxDiskLimit':
      return Object.assign({}, state, { maxDiskLimit: action.value });
    case 'setNodeNames':
      return Object.assign({}, state, { nodeNames: action.value });
    case 'setMinDiskSize':
      return Object.assign({}, state, { minDiskSize: action.value });
    case 'setMaxDiskSize':
      return Object.assign({}, state, { maxDiskSize: action.value });
    case 'setDiskSizeUnit':
      return Object.assign({}, state, { diskSizeUnit: action.value });
    case 'setIsValidMaxSize':
      return Object.assign({}, state, { isValidMaxSize: action.value });

    case 'setShowConfirmModal':
      return Object.assign({}, state, { showConfirmModal: action.value });

    case 'setEnableMinimal':
      return Object.assign({}, state, { enableMinimal: action.value });
    case 'setEnableFlexibleScaling':
      return Object.assign({}, state, { enableFlexibleScaling: action.value });
    case 'setStorageClass':
      return Object.assign({}, state, { storageClass: action.value });
    case 'setNodes':
      return Object.assign({}, state, { nodes: action.value });
    // Encryption state reducer
    case 'setEncryption':
      return Object.assign({}, state, { encryption: action.value });
    // KMS state reducer
    case 'setKmsEncryption':
      return Object.assign({}, state, { kms: action.value });
    case 'clearKmsState':
      return Object.assign({}, state, { kms: { ...KMSEmptyState } });
    case 'setNetworkType':
      return Object.assign({}, state, { networkType: action.value });
    case 'setClusterNetwork':
      return Object.assign({}, state, { clusterNetwork: action.value });
    case 'setPublicNetwork':
      return Object.assign({}, state, { publicNetwork: action.value });
    // Arbiter state reducer
    case 'setStretchClusterChecked':
      return Object.assign({}, state, { stretchClusterChecked: action.value });
    case 'setSelectedArbiterZone':
      return Object.assign({}, state, { selectedArbiterZone: action.value });
    // Local volume discovery
    case 'setLvdIsSelectNodes':
      return Object.assign({}, state, { lvdIsSelectNodes: action.value });
    case 'setLvdAllNodes':
      return Object.assign({}, state, { lvdAllNodes: action.value });
    case 'setLvdSelectNodes':
      return Object.assign({}, state, { lvdSelectNodes: action.value });
    case 'setLvdError':
      return Object.assign({}, state, { lvdError: action.value });
    case 'setLvdInProgress':
      return Object.assign({}, state, { lvdInProgress: action.value });
    // Local volume set
    case 'setLvsAllNodes':
      return Object.assign({}, state, { lvsAllNodes: action.value });
    case 'setLvsSelectNodes':
      return Object.assign({}, state, { lvsSelectNodes: action.value });
    case 'setLvsIsSelectNodes':
      return Object.assign({}, state, { lvsIsSelectNodes: action.value });
    default:
      return initialState;
  }
};
