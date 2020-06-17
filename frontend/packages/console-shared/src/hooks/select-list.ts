import * as React from 'react';
import * as _ from 'lodash';
import { OnSelect } from '@patternfly/react-table';
import { K8sResourceCommon } from '@console/internal/module/k8s';

export const useSelectList = <R extends K8sResourceCommon>(
  data: R[],
  visibleRows: string[],
  onRowSelected: (rows: R[]) => void,
): {
  onSelect: OnSelect;
  selectedRows: string[];
  updateSelectedRows: (rows: R[]) => void;
} => {
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  const onSelect = React.useCallback(
    (_event, isSelected, rowIndex, rowData) => {
      let uniqueUIDs = [];
      if (rowIndex === -1) {
        if (isSelected) {
          uniqueUIDs = _.uniq([...visibleRows, ...selectedRows]);
        } else {
          uniqueUIDs = _.uniq(selectedRows.filter((uid) => !visibleRows.includes(uid)));
        }
      } else {
        uniqueUIDs = _.xor(selectedRows, [rowData?.props?.id]);
      }
      setSelectedRows(uniqueUIDs);
      onRowSelected(data.filter((row) => uniqueUIDs.includes(row.metadata.uid)));
    },
    [data, onRowSelected, selectedRows, visibleRows],
  );

  const updateSelectedRows = React.useCallback(
    (rows: R[]) => {
      onRowSelected(rows);
      setSelectedRows(rows.map((row) => row.metadata.uid));
    },
    [onRowSelected],
  );

  return {
    onSelect,
    selectedRows,
    updateSelectedRows,
  };
};
