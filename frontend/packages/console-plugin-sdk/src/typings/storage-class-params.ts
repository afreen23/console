import { Extension } from './base';

namespace ExtensionProperties {
  export interface StorageClassProviosner {
    getStorageClassProvisoner: () => any;
  }
}

export interface StorageClassProviosner
  extends Extension<ExtensionProperties.StorageClassProviosner> {
  type: 'StorageClass/Proviosner';
}

export function isStorageClassProvisioner(e: Extension): e is StorageClassProviosner {
  return e.type === 'StorageClass/Proviosner';
}
