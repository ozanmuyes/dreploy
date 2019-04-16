#!/usr/bin/env node

'use strict';

const Client = require('ssh2').Client;

// #region Project config

const getProjectConfig = require('../src/getConfig/getProjectConfig');

const projectInfo = {
  lang: 'nodejs',
  root: 'D:\\Code\\tmp\\dreploy-test-dirs\\nodejs',
};

const projectConfig = getProjectConfig(projectInfo);

// #endregion Project config

const defaultConnectConfig = {
  host: '127.0.0.1',
  port: 22,
  //
};

const config = Object.assign({}, defaultConnectConfig,
  (projectConfig && projectConfig.remote) || {});


const conn = new Client();

// conn.on('ready', () => {
//   console.log('Client ready');

//   // Command 1
//   //
//   conn.exec('uptime', (err, stream) => {
//     if (err) throw err;
//     stream.on('close', (code, signal) => {
//       console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);
//       conn.end();
//     }).on('data', (data) => {
//       console.log(`STDOUT: ${data}`);
//     }).stderr.on('data', (data) => {
//       console.log(`STDERR: ${data}`);
//     });
//   });

//   // Command 2
//   //
//   conn.exec('sha256sum /srv/ema-tech-api/index.js /srv/ema-tech-api/package-lock.json', (err, stream) => {
//     if (err) throw err;
//     stream.on('close', (code, signal) => {
//       console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);
//       conn.end();
//     }).on('data', (data) => {
//       console.log(`STDOUT: ${data}`);
//     }).stderr.on('data', (data) => {
//       console.log(`STDERR: ${data}`);
//     });
//   });

//   // Command 3...
// });

conn.connect(config);


// TODO TR komutlar remote'da sequential olarak nasıl çalıştırılır?

// NOTE Normalized means project root relative filepaths converted to absolute paths
//      and globs converted to real filepaths (e.g. 'src/*' -> ['src/foo.js', 'src/baz.js'])
//      IMPORTANT TR sadece yukarıda belirtilenler yapılacak, hash check'leri başka fonksiyon yapacak
const normalizedLocalFiles = [
  'D:/Code/tmp/dreploy-test-dirs/nodejs/src/index.js',
  // NO 'D:/Code/tmp/dreploy-test-dirs/nodejs/src/some-module/*' - due to no 'src/**/*', just 'src/*'
  'D:/Code/tmp/dreploy-test-dirs/nodejs/package-lock.json',
];
const remotePath = '/src/dreploy/nodejs';
// NOTE Bu `deployment.json`'dan gelecek
const lastDeploymentInfo = {
  // ... bişiler
  remoteFiles: [
    // NOTE TR bu deployment'tan sonra remote path'teki dosyalar listesi
    'src/index.js',
    'package-lock.json',
  ],
  hashAlgorithm: 'sha256',
  hashes: [
    { // 'src/index.js'
      local: '...',
      remote: '...',
    },
    { // 'package-lock.json'
      local: '...',
      remote: '...',
    },
    // NOTE TR buradaki sıralama remoteFiles'daki sıralamayla aynı
  ],
};

function synchronizeFiles() {
  // TODO gerekli işlemleri yaptıktan sonra dosyaları remote'a gönder
}

synchronizeFiles(normalizedLocalFiles, remotePath, lastDeploymentInfo)
  .then((result) => {
    // `result` bir array ve `normalizedLocalFiles` array'indeki her kayıt (local dosya yolu) için sonuç belirtir
  })
  .catch((error) => {
    // TODO
  });
