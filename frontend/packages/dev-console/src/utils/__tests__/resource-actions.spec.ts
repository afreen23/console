import { DeploymentConfigModel, ReplicaSetModel } from '@console/internal/models';
<<<<<<< HEAD:frontend/packages/dev-console/src/utils/__tests__/resource-actions.spec.ts
import { getResourceActions } from '../resource-actions';
=======
import { getKebabActions } from '../kebab-actions';
>>>>>>> Migrate KebabActions extension:frontend/packages/dev-console/src/utils/__tests__/kebab-actions.spec.ts
import { ModifyApplication, EditApplication } from '../../actions/modify-application';

describe('kebab-actions: ', () => {
  it('kebab action should have "Edit Application Grouping" and "Edit Application" option for deploymentConfig', () => {
<<<<<<< HEAD:frontend/packages/dev-console/src/utils/__tests__/resource-actions.spec.ts
    const modifyApplication = getResourceActions(DeploymentConfigModel);
=======
    const modifyApplication = getKebabActions(DeploymentConfigModel);
>>>>>>> Migrate KebabActions extension:frontend/packages/dev-console/src/utils/__tests__/kebab-actions.spec.ts
    expect(modifyApplication).toEqual([ModifyApplication, EditApplication]);
  });

  it('kebab action should not have "Edit Application Grouping" option for replicaSet', () => {
<<<<<<< HEAD:frontend/packages/dev-console/src/utils/__tests__/resource-actions.spec.ts
    const modifyApplication = getResourceActions(ReplicaSetModel);
=======
    const modifyApplication = getKebabActions(ReplicaSetModel);
>>>>>>> Migrate KebabActions extension:frontend/packages/dev-console/src/utils/__tests__/kebab-actions.spec.ts
    expect(modifyApplication).toEqual([]);
  });
});
