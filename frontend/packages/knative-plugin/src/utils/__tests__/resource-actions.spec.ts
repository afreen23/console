import { ServiceModel } from '@console/internal/models';
import {
  ModifyApplication,
  EditApplication,
} from '@console/dev-console/src/actions/modify-application';
<<<<<<< HEAD:frontend/packages/knative-plugin/src/utils/__tests__/resource-actions.spec.ts
import { getResourceActions } from '../resource-actions';
=======
import { getKebabActions } from '../kebab-actions';
>>>>>>> Migrate KebabActions extension:frontend/packages/knative-plugin/src/utils/__tests__/kebab-actions.spec.ts
import { setTrafficDistribution } from '../../actions/traffic-splitting';
import { setSinkSource } from '../../actions/sink-source';
import { EventSourceContainerModel, ServiceModel as knSvcModel } from '../../models';

describe('kebab-actions: ', () => {
<<<<<<< HEAD:frontend/packages/knative-plugin/src/utils/__tests__/resource-actions.spec.ts
  it('kebab action should have "Edit Application Grouping" and "Move Sink" option for EventSourceContainerModel', () => {
    const modifyApplication = getResourceActions(EventSourceContainerModel);
    expect(modifyApplication).toEqual([ModifyApplication, setSinkSource]);
  });

  it('kebab action should have "setTrafficDistribution", "Edit Application Grouping" and "Edit Application" option for knSvcModel', () => {
    const modifyApplication = getResourceActions(knSvcModel);
=======
  it('kebab action should have "Edit Application Grouping" option for EventSourceContainerModel', () => {
    const modifyApplication = getKebabActions(EventSourceContainerModel);
    expect(modifyApplication).toEqual([ModifyApplication]);
  });

  it('kebab action should have "setTrafficDistribution", "Edit Application Grouping" and "Edit Application" option for knSvcModel', () => {
    const modifyApplication = getKebabActions(knSvcModel);
>>>>>>> Migrate KebabActions extension:frontend/packages/knative-plugin/src/utils/__tests__/kebab-actions.spec.ts
    expect(modifyApplication).toEqual([ModifyApplication, setTrafficDistribution, EditApplication]);
  });

  it('kebab action should not have "Edit Application Grouping" option for ServiceModel', () => {
<<<<<<< HEAD:frontend/packages/knative-plugin/src/utils/__tests__/resource-actions.spec.ts
    const modifyApplication = getResourceActions(ServiceModel);
=======
    const modifyApplication = getKebabActions(ServiceModel);
>>>>>>> Migrate KebabActions extension:frontend/packages/knative-plugin/src/utils/__tests__/kebab-actions.spec.ts
    expect(modifyApplication).toEqual([]);
  });
});
