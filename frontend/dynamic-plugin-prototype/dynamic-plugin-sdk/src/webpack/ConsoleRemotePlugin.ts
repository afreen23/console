import * as webpack from 'webpack';
import * as readPkg from 'read-pkg';
import * as _ from 'lodash';
import { ConsoleAssetPlugin } from './ConsoleAssetPlugin';
import { ConsolePackageJSON, validatePackageFile } from '../schema/plugin-package';
import { sharedVendorModules } from '../shared-modules';

const ReplaceSource = require('webpack-sources').ReplaceSource;

const remoteEntryLibraryType = 'jsonp';
const remoteEntryCallback = 'window.loadPluginEntry';
const remoteEntryFile = 'plugin-entry.js';

export class ConsoleRemotePlugin {
  private readonly pkg: ConsolePackageJSON;

  constructor() {
    this.pkg = readPkg.sync({ normalize: false }) as ConsolePackageJSON;
    validatePackageFile(this.pkg).reportToConsole(true);
  }

  apply(compiler: webpack.Compiler) {
    if (!compiler.options.output.enabledLibraryTypes.includes(remoteEntryLibraryType)) {
      compiler.options.output.enabledLibraryTypes.push(remoteEntryLibraryType);
    }

    // Apply relevant webpack plugins
    compiler.hooks.afterPlugins.tap(ConsoleRemotePlugin.name, () => {
      new webpack.container.ContainerPlugin({
        name: this.pkg.name,
        library: { type: remoteEntryLibraryType, name: remoteEntryCallback },
        filename: remoteEntryFile,
        exposes: this.pkg.consolePlugin.exposedModules || {},
        overridables: sharedVendorModules,
      }).apply(compiler);
      new ConsoleAssetPlugin(this.pkg).apply(compiler);
    });

    // Post-process generated remote entry source
    compiler.hooks.emit.tap(ConsoleRemotePlugin.name, (compilation) => {
      compilation.updateAsset(remoteEntryFile, (source) => {
        const newSource = new ReplaceSource(source);
        newSource.insert(
          remoteEntryCallback.length + 1,
          `'${this.pkg.name}@${this.pkg.version}', `,
        );
        return newSource;
      });
    });

    // Skip processing config.entry option if it's missing or empty
    if (_.isPlainObject(compiler.options.entry) && _.isEmpty(compiler.options.entry)) {
      compiler.hooks.entryOption.tap(ConsoleRemotePlugin.name, () => {
        return true;
      });
    }
  }
}
