import { PrometheusResponse } from '@console/internal/components/graphs';
import * as _ from 'lodash';

export const getResiliencyProgress = (results: PrometheusResponse): number => {
  /**
   * Possible values for progress:
   *   - A float value of String type
   *   - 'NaN'
   *   - undefined
   */
  const progress: string = _.get(results, 'data.result[0].value[1]');
  return parseFloat(progress);
};
