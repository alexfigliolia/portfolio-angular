import { join } from 'path';
import { SCSSVariableSync } from './SCSSVariableSync';

(async () => {
  const synchronizer = new SCSSVariableSync(join(SCSSVariableSync.stylesDirectory, 'Variables.ts'));
  await synchronizer.watch();
})().catch(console.log);
