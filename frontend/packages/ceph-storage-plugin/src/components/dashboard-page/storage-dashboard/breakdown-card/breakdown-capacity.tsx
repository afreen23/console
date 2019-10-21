import * as React from 'react';
import './breakdown-card.scss';

export const TotalCapacityBody: React.FC<TotalCapacityBodyProps> = ({ value, classname }) => {
  return <p className={`ceph-breakdown-capacity-body ${classname || ''}`}>{value}</p>;
};

type TotalCapacityBodyProps = {
  value: string;
  classname?: string;
};
