const _ = require('underscore');
const axios = require('axios').default;
require('dotenv').config();

const downloadDps = async (_encId, _spec) => {
  const baseUrl = 'https://www.fflogs.com:443/v1/rankings/encounter/';
  const apiKey = process.env.LOGSAPI;
  const term = `${_encId}?metric=dps&class=1&spec=${_spec}`;
  const logsUrl = `${baseUrl}${term}&api_key=${apiKey}`;

  return axios.get(logsUrl)
    .then((res) => res.data)
    .then((json) => json)
    .catch(() => null);
};

const getTopClassDps = async (_spec = 3) => {
  let avgDps = 0;
  const queue = []; // Array of promises

  for (let i = 73; i <= 77; i += 1) {
    queue.push(downloadDps(i, _spec));
    // Loop and add the promises(method containing axios) to the array
  }

  const data = await Promise.all(queue); // Get all the resolved promises in an array

  for (let i = 0; i < data.length; i += 1) {
    if (data[i] == null) return null;
    avgDps += data[i].rankings[0].total; // Process it
  }

  avgDps /= 5;

  return avgDps;
};

const getRanking = async () => {
  let ranking = [];
  const queue = [];

  for (let i = 0; i < 17; i += 1) {
    queue.push(getTopClassDps(i + 1));
  }

  const data = await Promise.all(queue);

  for (let i = 0; i < data.length; i += 1) {
    if (data[i] == null) return null;
    ranking[i] = {
      spec: i + 1,
      dps: data[i].toFixed(1),
    };

    switch ((i + 1)) {
      case 1: ranking[i].name = 'Astrologian'; break;
      case 2: ranking[i].name = 'Bard'; break;
      case 3: ranking[i].name = 'Black Mage'; break;
      case 4: ranking[i].name = 'Dark Knight'; break;
      case 5: ranking[i].name = 'Dragoon'; break;
      case 6: ranking[i].name = 'Machinist'; break;
      case 7: ranking[i].name = 'Monk'; break;
      case 8: ranking[i].name = 'Ninja'; break;
      case 9: ranking[i].name = 'Paladin'; break;
      case 10: ranking[i].name = 'Scholar'; break;
      case 11: ranking[i].name = 'Summoner'; break;
      case 12: ranking[i].name = 'Warrior'; break;
      case 13: ranking[i].name = 'White Mage'; break;
      case 14: ranking[i].name = 'Red Mage'; break;
      case 15: ranking[i].name = 'Samurai'; break;
      case 16: ranking[i].name = 'Dancer'; break;
      case 17: ranking[i].name = 'Gunbreaker'; break;
      default: ranking[i].name = 'Error'; break;
    }
  }

  ranking = _.sortBy(ranking, 'dps').reverse();

  const obj = { ranking };

  return obj;
};

module.exports.getRanking = getRanking;
