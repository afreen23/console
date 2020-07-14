import { coFetch } from '@console/internal/co-fetch';
import { overrideSharedModules } from '../../../dynamic-plugin-prototype/dynamic-plugin-sdk/src/shared-modules';
import { ConsolePluginManifestJSON } from '../../../dynamic-plugin-prototype/dynamic-plugin-sdk/src/schema/plugin-manifest';
import { resolveEncodedCodeRefs } from '../../../dynamic-plugin-prototype/dynamic-plugin-sdk/src/coderefs/coderef-resolver';
import { RemoteEntryModule } from '../../../dynamic-plugin-prototype/dynamic-plugin-sdk/src/types';
import { PluginStore } from './store';

type ConsolePluginData = {
  /** The manifest containing plugin metadata and extension declarations. */
  manifest: ConsolePluginManifestJSON;
  /** Indicates if `window.loadPluginEntry` callback has been fired for this plugin. */
  entryCallbackFired: boolean;
};

let pluginEntryCallbackRegistered = false;

const pluginMap = new Map<string, ConsolePluginData>();

const getPluginID = (m: ConsolePluginManifestJSON) => `${m.name}@${m.version}`;

export const fetchPluginManifest = async (baseURL: string) => {
  const url = new URL('plugin-manifest.json', baseURL).toString();
  const response = await coFetch(url, { method: 'GET' });
  return response.json() as ConsolePluginManifestJSON;
  // TODO(vojtech): validate the manifest
};

export const loadDynamicPlugin = (baseURL: string, manifest: ConsolePluginManifestJSON) => {
  debugger; // TODO TEST

  const existingPluginData = Array.from(pluginMap.values()).find(
    (p) => p.manifest.name === manifest.name,
  );

  if (existingPluginData) {
    console.error(`Attempt to reload plugin ${getPluginID(existingPluginData.manifest)}`);
    return;
  }

  pluginMap.set(getPluginID(manifest), { manifest, entryCallbackFired: false });

  const script = document.createElement('script');
  script.src = new URL('plugin-entry.js', baseURL).toString();
  script.async = true;

  document.head.appendChild(script);
};

export const registerPluginEntryCallback = (pluginStore: PluginStore) => {
  if (pluginEntryCallbackRegistered) {
    throw new Error('Plugin entry callback is already registered');
  }

  pluginEntryCallbackRegistered = true;

  window.loadPluginEntry = (pluginID: string, entryModule: RemoteEntryModule) => {
    debugger; // TODO TEST

    if (!pluginMap.has(pluginID)) {
      console.error(`Received callback for unknown plugin ${pluginID}`);
      return;
    }

    const pluginData = pluginMap.get(pluginID);

    if (pluginData.entryCallbackFired) {
      console.error(`Received callback for already loaded plugin ${pluginID}`);
      return;
    }

    pluginData.entryCallbackFired = true;

    try {
      overrideSharedModules(entryModule);
    } catch (error) {
      console.error(`Failed to override shared modules for plugin ${pluginID}`, error);
      return;
    }

    const resolvedExtensions = resolveEncodedCodeRefs(
      pluginData.manifest.extensions,
      entryModule,
      pluginID,
      () => pluginStore.setDynamicPluginEnabled(pluginID, false),
    );

    pluginStore.addDynamicPlugin(pluginID, pluginData.manifest, resolvedExtensions);
    console.info(`Loaded plugin ${pluginID} (${resolvedExtensions.length} extensions)`);
  };
};
