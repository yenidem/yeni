import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
(globalThis as unknown as Record<string, unknown>)['__dirname'] = __dirname;
(globalThis as unknown as Record<string, unknown>)['__filename'] = __filename;
(global as unknown as Record<string, unknown>)['__dirname'] = __dirname;
(global as unknown as Record<string, unknown>)['__filename'] = __filename;

import {
  BootstrapContext,
  bootstrapApplication,
} from '@angular/platform-browser';
import {App} from './app/app';
import {config} from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);

export default bootstrap;
