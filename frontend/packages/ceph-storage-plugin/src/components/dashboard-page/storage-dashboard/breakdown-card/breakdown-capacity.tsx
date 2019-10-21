import * as React from 'react';
import './breakdown-card.scss';

export const TotalCapacityBody: React.FC<TotalCapacityBodyProps> = ({ value, classname }) => {
  return <p className={'ceph-capacity-breakdown-capacity-body ' + (classname ? classname : '')}>{value}</p>;
};

type TotalCapacityBodyProps = {
  value: string;
  classname?: string;
};
