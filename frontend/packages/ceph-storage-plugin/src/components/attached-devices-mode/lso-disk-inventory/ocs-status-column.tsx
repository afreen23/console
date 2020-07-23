import * as React from 'react';
import { TableData } from '@console/internal/components/factory';

export const OCSStatus: React.FC<{
  status: string;
  className: string;
}> = ({ status, className }) => {
  return <TableData className={className}>{status || '-'}</TableData>;
};
