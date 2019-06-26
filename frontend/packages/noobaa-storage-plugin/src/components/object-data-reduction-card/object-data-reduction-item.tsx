import * as React from 'react';
import { LoadingInline } from '@console/internal/components/utils';
import { DashboardCardHelp } from '@console/internal/components/dashboard/dashboard-card';
import * as _ from 'lodash';

const ObjectDataReductionRowTitle = ({ title }) => (
  <div className="co-object-data-reduction-card__row-title">{title}</div>
);

const EfficiencyRow = ({ value, infoText }) => {
  const text = _.isNil(value) ? 'No data' : `${Number(value).toFixed(1)}:1`;
  return (
    <div className="co-object-data-reduction-card__row-status-item">
      <span className="co-object-data-reduction-card__row-status-item-text">{text}</span>
      <DashboardCardHelp>{infoText}</DashboardCardHelp>
    </div>
  );
};

const SavingsRow = ({ value, infoText }) => {
  let text;
  if (_.isNil(value)) text = 'No data';
  else {
    text = `${value}Pi(${value}%)`;
  }
  return (
    <div className="co-object-data-reduction-card__row-status-item">
      <span className="co-object-data-reduction-card__row-status-item-text">{text}</span>
      <DashboardCardHelp>{infoText}</DashboardCardHelp>
    </div>
  );
};

export const ObjectDataReductionItem = ({ title, value, infoText, isLoading }) => (
  <div className="co-object-data-reduction-card__row">
    <ObjectDataReductionRowTitle title={title} />
    {isLoading ? (
      <LoadingInline />
    ) : title === 'Effeciency Ratio' ? (
      <EfficiencyRow value={value} infoText={infoText} />
    ) : (
      <SavingsRow value={value} infoText={infoText} />
    )}
  </div>
);
