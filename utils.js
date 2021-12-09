const { networkInterfaces } = require('os');
const fs = require('fs');

function getNetworkInterfaces() {
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.cidr);
      }
    }
  }

  return results;
}

function getServerInfo(req) {
  var resObj = {};

  resObj.networkInterfaces = getNetworkInterfaces();
  resObj.clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  resObj.process = {
    platform: process.platform,
    pid: process.pid,
    ppid: process.ppid,
    release: process.release
  };

  if(process.platform == 'linux'){
    resObj.process = Object.assign({
      uid: process.getuid(),
      euid: process.geteuid(),
      gid: process.getgid(),    
      egid: process.getegid()
    }, resObj.process);
  }

  resObj.httpHeaders = req.headers;
  resObj.envVars = process.env;

  return resObj;
}

function setHealthState(state) {
  fs.writeFileSync('health-status.txt', state);
}

function getHealthState() {
  const filename = 'health-status.txt';
  const fileExists = fs.existsSync(filename);

  if (fileExists) {
    return fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }) === 'true';
  }

  return true;

}

function setMemIterationCount(count) {
  fs.writeFileSync('mem-iteration-count.txt', count);
}

function getMemIterationCount() {
  const filename = 'mem-iteration-count.txt';
  const fileExists = fs.existsSync(filename);

  if (fileExists) {
    return parseInt(fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }));
  }

  return 10000;

}


function consumeMem() {

  var arr = [];

  for (let i = 0; i < getMemIterationCount(); i++) {
    var num1 = Math.random() * 100000000;
    var num2 = Math.random() * 100000000;

    // arr.push((num1 * num2)+'');
    arr.push(num1+'');

  }

  var arr2 = arr.slice().sort();
  var arr2 = arr.slice().sort();

  return arr;
}

function consumeMemv2(sizeInMB) {

  console.log(`sizeInMb: ${sizeInMB}`);

  var arr = [];

  var sizeInBytes = parseInt(sizeInMB) * 1024 * 1024;

  for (let i = 0; i < sizeInBytes; i+=2) {

    arr.push('a');

  }

  global.testArr = arr;

}


module.exports = {
  getServerInfo: getServerInfo,
  setHealthState: setHealthState,
  getHealthState: getHealthState,
  consumeMem: consumeMem,
  consumeMemv2: consumeMemv2,
  setMemIterationCount: setMemIterationCount
};