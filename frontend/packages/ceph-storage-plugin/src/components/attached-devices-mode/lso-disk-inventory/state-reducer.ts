import * as _ from 'lodash';

export enum ActionType {
  SET_DISK_OSD_MAP = 'SET_DISK_OSD_MAP',
  SET_IS_REPLACED_DISK = 'SET_IS_REPLACED_DISK',
  SET_IS_REBALANCED = 'SET_IS_REBALANCED',
  SET_OCS_DISK_STATUS = 'SET_OCS_DISK_STATUS',
}

export const initialState: OCSState = {
  replacingDisk: '',
  diskOsdMap: {},
  isRebalancing: false,
};

export const reducer = (state: OCSState, action: OCSStateAction) => {
  switch (action.type) {
    case ActionType.SET_DISK_OSD_MAP: {
      if (_.isEqual(action.payload, state.diskOsdMap)) {
        return state;
      }
      return {
        ...state,
        diskOsdMap: action.payload,
      };
    }
    case ActionType.SET_IS_REPLACED_DISK: {
      if (action.payload === state.replacingDisk) {
        return state;
      }
      return {
        ...state,
        replacingDisk: action.payload,
      };
    }
    case ActionType.SET_IS_REBALANCED: {
      if (action.payload === state.isRebalancing) {
        return state;
      }
      return {
        ...state,
        isRebalancing: action.payload,
      };
    }
    case ActionType.SET_OCS_DISK_STATUS: {
      if (action.payload.status === state.diskOsdMap[action.payload.diskName].status) return state;
      const diskOsdMap = { ...state.diskOsdMap };
      const { diskName, status } = action.payload;
      diskOsdMap[diskName].status = status;
      return {
        ...state,
        diskOsdMap,
      };
    }
    default:
      return state;
  }
};

export type OCSStateAction =
  | {
      type: ActionType.SET_DISK_OSD_MAP;
      payload: OCSState['diskOsdMap'];
    }
  | { type: ActionType.SET_IS_REPLACED_DISK; payload: string }
  | { type: ActionType.SET_IS_REBALANCED; payload: boolean }
  | { type: ActionType.SET_OCS_DISK_STATUS; payload: { diskName: string; status: OCSDiskStatus } };

export type OCSState = {
  replacingDisk: string;
  diskOsdMap: { [diskName: string]: DiskOSDState };
  isRebalancing: boolean;
};

export type DiskOSDState = { osdName: string; status: OCSDiskStatus };

type OCSDiskStatus =
  | 'Online'
  | 'Offline'
  | 'Not responding'
  | 'Preparing to replace'
  | 'Replacement Ready';
