import { execFileSync, spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createPrivateIdentityCheck } from './lib/private-identity.mjs';

const gitEnvironment = { ...process.env, GIT_NO_REPLACE_OBJECTS: '1' };
const git = (...args) => execFileSync('git', args, { env: gitEnvironment, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });

async function verify() {
  const check = createPrivateIdentityCheck();
  if (git('rev-parse', '--is-shallow-repository').trim() === 'true') {
    throw new Error('Privacy verification needs full Git history; fetch with depth 0');
  }
  const paths = git('ls-files', '-z').split('\0').filter(Boolean);
  for (const path of paths) {
    check(path, 'tracked filename');
    try { check(readFileSync(path), `tracked file ${path}`); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  const objects = git('rev-list', '--objects', '--all').trim().split('\n').filter(Boolean);
  const ids = objects.map(line => line.split(' ', 1)[0]);
  for (const line of objects) check(line.slice(41), 'historical filename');
  const child = spawn('git', ['cat-file', '--batch'], { env: gitEnvironment, stdio: ['pipe', 'pipe', 'pipe'] });
  child.stderr.resume();
  const completion = new Promise(resolve => {
    child.on('error', () => resolve(-1));
    child.on('close', resolve);
  });
  child.stdin.on('error', () => {});
  child.stdin.end(ids.join('\n') + '\n');
  let buffer = Buffer.alloc(0);
  let object = null;
  let count = 0;
  try {
    for await (const chunk of child.stdout) {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length) {
        if (!object) {
          const newline = buffer.indexOf(10);
          if (newline < 0) break;
          const [id, type, size] = buffer.subarray(0, newline).toString().split(' ');
          if (!/^[0-9]+$/.test(size)) throw new Error('Unable to read a Git object for privacy verification');
          object = { id, type, size: Number(size) };
          buffer = buffer.subarray(newline + 1);
        }
        if (buffer.length < object.size + 1) break;
        check(buffer.subarray(0, object.size), `${object.type} ${object.id}`);
        buffer = buffer.subarray(object.size + 1);
        object = null;
        count++;
      }
    }
    if (await completion !== 0 || object || buffer.length || count !== ids.length) {
      throw new Error('Git object privacy scan did not complete');
    }
  } finally {
    child.kill();
    await completion;
  }
  console.log(`Verified privacy in ${paths.length} tracked files and ${count} historical Git objects.`);
}

try { await verify(); } catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
