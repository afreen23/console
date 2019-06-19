import * as React from 'react';
// import { Icon } from 'patternfly-react';
import { LoadingInline } from '../../utils';
import { DashboardCardHelp } from '../dashboard-card';

// import { ObjectDataReductionItemStatus } from './providers-item-status';

const prefixedId = (idPrefix, id) => {
  return idPrefix && id ? `${idPrefix}-${id}` : null;
};

const ObjectDataReductionRowTitle = ({title}) => (
  <div className="co-object-data-reduction-card__row-title">{title}</div>
);

const ObjectDataReductionRow = ({title, count}) => (
  <div className="co-object-data-reduction-card__row-status-item">
    <span className="co-object-data-reduction-card__row-status-item-text">{count}</span>
    <DashboardCardHelp>{`help for ${title}`}</DashboardCardHelp>
  </div>
);

export const ObjectDataReductionItem = ({title, count}) => (
  <div id={prefixedId('data-reduction', title.toLowerCase())} className="co-object-data-reduction-card__row">
    <ObjectDataReductionRowTitle title={title} />
    {count != null ? <ObjectDataReductionRow count={count} title={title} key="status" /> : <LoadingInline />}
  </div>
);

