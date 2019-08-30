import * as React from 'react';
import { Progress, ProgressSize } from '@patternfly/react-core';

export const ActivityProgress: React.FC<ActivityProgressProps> = ({ title, progress, children }) => (
  <>
    <Progress value={progress} title={title} size={ProgressSize.sm} className="co-activity-item__progress" />
    <div>{children}</div>
  </>
);

type ActivityProgressProps = {
  title: string;
  progress: number;
}
