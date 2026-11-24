const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');

const java = process.env.JAVA_HOME
  ? path.join(process.env.JAVA_HOME, 'bin', process.platform === 'win32' ? 'java.exe' : 'java')
  : 'java';
const version = spawnSync(java, ['-version'], { encoding: 'utf8' });

if (version.error) {
  throw version.error;
}
if (version.status !== 0) {
  throw new Error(`Could not determine the Java version using ${java}`);
}

const versionOutput = `${version.stdout || ''}\n${version.stderr || ''}`;
const major = Number(versionOutput.match(/version "(\d+)/)?.[1]);
if (!Number.isFinite(major)) {
  throw new Error(`Could not parse the Java version from: ${versionOutput.trim()}`);
}

if (major >= 24) {
  const nativeAccessFlag = '--enable-native-access=ALL-UNNAMED';
  const options = (process.env.JAVA_TOOL_OPTIONS || '').split(/\s+/).filter(Boolean);
  if (!options.includes(nativeAccessFlag)) {
    options.push(nativeAccessFlag);
  }
  process.env.JAVA_TOOL_OPTIONS = options.join(' ');
}

const expoCli = require.resolve('expo/bin/cli');
const child = spawn(process.execPath, [expoCli, 'run:android', ...process.argv.slice(2)], {
  env: process.env,
  stdio: 'inherit',
});

child.on('error', (error) => {
  throw error;
});
child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exitCode = code ?? 1;
  }
});
