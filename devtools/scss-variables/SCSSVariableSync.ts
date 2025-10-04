import { createReadStream, StatWatcher, watch } from 'node:fs';
import { readdir, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import nodeCleanup from 'node-cleanup';
import { v7 } from 'uuid';
import { ChildProcess } from '@figliolia/child-process';
/* eslint-disable @typescript-eslint/no-dynamic-delete */

export class SCSSVariableSync {
  public static ROOT = resolve(__dirname, '../../');
  public static stylesDirectory = join(this.ROOT, './src/Styles');
  public static variableFile = join(this.stylesDirectory, 'Variables.scss');
  private openReaders = new Map<string, () => void>();
  private observedFiles = new Map<string, StatWatcher>();
  private declarations = new Map<string, Record<string, string>>();
  constructor(private output: string) {}

  public async watch() {
    const directory = await readdir(SCSSVariableSync.stylesDirectory);
    for (const file of directory) {
      if (!this.observedFiles.has(file) && extname(file) === '.scss') {
        this.watchFile(join(SCSSVariableSync.stylesDirectory, file));
      }
    }
    nodeCleanup(() => {
      for (const [_, watcher] of this.observedFiles) {
        watcher.unref();
      }
      for (const [_, closer] of this.openReaders) {
        closer();
      }
    });
  }

  private watchFile(file: string) {
    if (this.observedFiles.has(file)) {
      return;
    }
    this.observedFiles.set(
      file,
      watch(
        file,
        {
          persistent: true,
        },
        (event, name) => {
          if (event === 'change') {
            if (file !== SCSSVariableSync.variableFile) {
              return void this.parseChanges(file);
            }
            void this.scanAllWatchers();
          } else if (event === 'rename' && name) {
            const watcher = this.observedFiles.get(file);
            const newFileTarget = join(SCSSVariableSync.stylesDirectory, name);
            if (watcher) {
              this.observedFiles.set(newFileTarget, watcher);
              this.observedFiles.delete(file);
            }
            const declarations = this.declarations.get(file);
            if (declarations) {
              this.declarations.set(newFileTarget, declarations);
              this.declarations.delete(file);
            }
          }
        },
      ),
    );
  }

  private async scanAllWatchers() {
    const promises: Promise<undefined | boolean>[] = [];
    for (const [file] of this.observedFiles) {
      if (file !== SCSSVariableSync.variableFile) {
        promises.push(this.parseChanges(file, false));
      }
    }
    const writes = await Promise.all(promises);
    if (writes.some((w) => !!w)) {
      void this.writeDeclarations();
    }
  }

  private async parseChanges(file: string, write = true) {
    let emit = false;
    let open = false;
    const seen = new Set<string>();
    const declarations = this.declarations.get(file) ?? {};
    await this.createReader(file, async (line, close) => {
      if (!open && line.trim().startsWith(':export {')) {
        open = true;
        return;
      }
      if (open) {
        if (line.trim() === '}') {
          open = false;
          close();
          return;
        }
        const tokens = line.split(':').map((v) => v.trim());
        const name = tokens[0];
        let value: string | undefined = tokens[1].slice(0, -1);
        if (!name) {
          return;
        }
        if (value.startsWith('Variables.')) {
          value = await this.extractFromVariables(name);
        }
        if (!value) {
          return;
        }
        seen.add(name);
        if (!(name in declarations) || declarations[name] !== value) {
          emit = true;
          declarations[name] = value;
        }
      }
    });
    for (const key in declarations) {
      if (!seen.has(key)) {
        emit = true;
        delete declarations[key];
      }
    }
    if (emit) {
      this.declarations.set(file, declarations);
      if (write) {
        void this.writeDeclarations();
      }
    }
    return emit;
  }

  private async createReader(
    file: string,
    onLine: (line: string, close: () => void) => void | Promise<void>,
  ) {
    const ID = v7();
    const fileStream = createReadStream(file);
    const reader = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    const close = () => {
      fileStream.close();
      reader.close();
      this.openReaders.delete(ID);
    };
    this.openReaders.set(ID, close);
    for await (const line of reader) {
      await onLine(line, close);
    }
    close();
  }

  private async writeDeclarations() {
    const master: Record<string, string> = {};
    for (const [_, declarations] of this.declarations) {
      for (const key in declarations) {
        master[key] = declarations[key];
      }
    }
    const keys = Object.keys(master);
    const sortedKeys = keys.sort((a, b) => a.localeCompare(b));
    const sortedDeclarations = sortedKeys.reduce<Record<string, string>>((acc, next) => {
      acc[next] = master[next];
      return acc;
    }, {});
    await writeFile(
      this.output,
      `${SCSSVariableSync.JSDOC}export const Variables = ${JSON.stringify(sortedDeclarations, null, 2)} as const;`,
    );
    await ChildProcess.execute(`npx eslint --fix '${this.output}'`);
  }

  private async extractFromVariables(name: string): Promise<string | undefined> {
    let result: string | undefined = undefined;
    await this.createReader(SCSSVariableSync.variableFile, (line, close) => {
      if (line.startsWith(`$${name}`)) {
        const tokens = line.split(':');
        result = tokens[1].trim().slice(0, -1);
        close();
      }
    });
    return result;
  }

  private static JSDOC = `/**
 * Variables
 *
 * FILE CREATED BY CODEGEN. DO NOT EDIT.
 *
 * This file contains any scss variables exported
 * by the Styles package in the src directory allowing
 * you to import them into your typescript files.
 *
 * This file is automatically regenerated any time an
 * exported variable is added, modified, or deleted.
 */
`;
}
