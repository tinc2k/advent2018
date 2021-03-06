// https://adventofcode.com/2018/day/4

const fs = require('fs');
const moment = require('moment');

let start = (new Date).getTime();
let rows = fs.readFileSync('04input.txt', 'utf8').split('\n');
let logs = [];
for (let row of rows) {
  let timestamp = moment.utc(row.slice(1,17));
  let event = row.slice(19, row.length);
  logs.push({ timestamp, event });
}
logs = logs.sort((a,b) => a.timestamp >= b.timestamp ? 1 : -1);

let kurcici = {};
let guardId = 0;
for (let i = 0; i < logs.length; i++) {
  let log = logs[i];
  let nextLog = logs[i+1]; // lol
  //console.log(`${log.timestamp.toISOString()} ${log.event}`);
  if (log.event[0] === 'G') {
    guardId = log.event.split('#')[1].split(' ')[0];
    if (!kurcici[`${guardId}`]) {
      kurcici[`${guardId}`] = new Array(60);
    }
  } else if (log.event[0] === 'f') {
    let asleep = moment.utc(log.timestamp);
    let awake = moment.utc(nextLog.timestamp);
    for (let i = asleep.minutes(); i < awake.minutes(); i++) {
      if (kurcici[`${guardId}`][i]) {
        kurcici[`${guardId}`][i] += 1;
      } else {
        kurcici[`${guardId}`][i] = 1;
      }
    }
  }
}

let id = findGuardMostOftenAsleep();
let highestMinute = findHighestMinute(kurcici[id])[0];
console.log('most asleep', id);
console.log('most asleep minute', highestMinute);
console.log(`done in ${(new Date).getTime() - start}ms.`);

function findGuardMostOftenAsleep() {
  let minutesAsleep = 0;
  let guardId = null;
  for (let id in kurcici) {
    let minutes = sumMinutes(kurcici[id]);
    if (minutes > minutesAsleep) {
      minutesAsleep = minutes;
      guardId = id;
    }
  }
  return guardId;
}

function sumMinutes(minutes) {
  let sum = 0;
  for (let i = 0; i < minutes.length; i++) {
    if (minutes[i] !== undefined && minutes[i] > 0) {
      sum += minutes[i];
    }
  }
  return sum;
}

function findHighestMinute(minutes) {
  let amount = 0;
  let index = 0;
  for (let i = 0; i < minutes.length; i++) {
    if (minutes[i] > amount) {
      amount = minutes[i];
      index = i;
    }
  }
  return [index, amount];
}



