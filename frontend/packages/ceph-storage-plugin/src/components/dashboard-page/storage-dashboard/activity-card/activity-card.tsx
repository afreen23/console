import * as React from 'react';
import * as _ from 'lodash';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '@console/internal/components/dashboard/dashboard-card';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboards-page/with-dashboard-resources';
import { EventKind } from '@console/internal/module/k8s';
import { FirehoseResource, FirehoseResult } from '@console/internal/components/utils';
import {
  EventModel,
  PersistentVolumeClaimModel,
  PersistentVolumeModel,
} from '@console/internal/models';
import {
  ActivityBody,
  RecentEventsBody,
  OngoingActivityBody,
} from '@console/internal/components/dashboard/activity-card/activity-body';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { getNamespace } from '@console/shared';
import { CEPH_STORAGE_NAMESPACE } from '../../../../constants/index';
import { DATA_RESILIENCY_QUERIES } from '../../../../constants/queries';
import { isDataResiliencyActivity } from './activity';

const eventsResource: FirehoseResource = { isList: true, kind: EventModel.kind, prop: 'events' };

const ocsEventNamespaceKindFilter = (event: EventKind): boolean =>
  getNamespace(event) === CEPH_STORAGE_NAMESPACE ||
  _.get(event, 'involvedObject.kind') ===
    (PersistentVolumeClaimModel.kind || PersistentVolumeModel.kind);

const RecentEvent = withDashboardResources(
  ({ watchK8sResource, stopWatchK8sResource, resources }: DashboardItemProps) => {
    React.useEffect(() => {
      watchK8sResource(eventsResource);
      return () => {
        stopWatchK8sResource(eventsResource);
      };
    }, [watchK8sResource, stopWatchK8sResource]);
    return (
      <RecentEventsBody
        events={resources.events as FirehoseResult<EventKind[]>}
        filter={ocsEventNamespaceKindFilter}
      />
    );
  },
);

const OngoingActivity = withDashboardResources(
  ({ watchPrometheus, stopWatchPrometheusQuery, prometheusResults }: DashboardItemProps) => {
    React.useEffect(() => {
      Object.keys(DATA_RESILIENCY_QUERIES).forEach((key) =>
        watchPrometheus(DATA_RESILIENCY_QUERIES[key]),
      );
      return () =>
        Object.keys(DATA_RESILIENCY_QUERIES).forEach((key) =>
          stopWatchPrometheusQuery(DATA_RESILIENCY_QUERIES[key]),
        );
    }, [watchPrometheus, stopWatchPrometheusQuery]);

    const results: PrometheusResponse[] = Object.keys(DATA_RESILIENCY_QUERIES).map(
      (q) => prometheusResults.getIn([q, 'data']) as PrometheusResponse,
    );
    const queriesLoaded = Object.keys(DATA_RESILIENCY_QUERIES).every(
      (q) => prometheusResults.getIn([q, 'data']) || prometheusResults.getIn([q, 'loadError']),
    );
    const prometheusActivities = [];
    const resourceActivities = [];

    if (isDataResiliencyActivity(results)) {
      prometheusActivities.push({
        results,
        loader: () => import('./activity').then((m) => m.DataResiliencyAcivity),
      });
    }

    return (
      <OngoingActivityBody
        loaded={queriesLoaded}
        resourceActivities={resourceActivities}
        prometheusActivities={prometheusActivities}
      />
    );
  },
);

export const ActivityCard: React.FC<{}> = React.memo(() => (
  <DashboardCard>
    <DashboardCardHeader>
      <DashboardCardTitle>Activity</DashboardCardTitle>
    </DashboardCardHeader>
    <DashboardCardBody>
      <ActivityBody>
        <OngoingActivity />
        <RecentEvent />
      </ActivityBody>
    </DashboardCardBody>
  </DashboardCard>
));
