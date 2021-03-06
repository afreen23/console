// tslint:disable
/**
 * KubeVirt API
 * This is KubeVirt API an add-on for Kubernetes.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: kubevirt-dev@googlegroups.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * ServiceAccountVolumeSource adapts a ServiceAccount into a volume.
 * @export
 * @interface V1ServiceAccountVolumeSource
 */
export interface V1ServiceAccountVolumeSource {
  /**
   * Name of the service account in the pod\'s namespace to use. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
   * @type {string}
   * @memberof V1ServiceAccountVolumeSource
   */
  serviceAccountName?: string;
}
