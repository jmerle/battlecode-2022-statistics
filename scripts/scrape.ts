import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

async function get(url: string): Promise<any> {
  console.log(`GET ${url}`);
  const response = await axios.get(url, { responseType: 'json' });
  return response.data;
}

async function run(): Promise<void> {
  const dataFile = path.resolve(__dirname, '../build/data.json');
  const timestampFile = path.resolve(__dirname, '../build/data-timestamp.txt');

  if (!process.argv.includes('--force') && fs.existsSync(dataFile) && fs.existsSync(timestampFile)) {
    console.log("Data has already been scraped, run 'yarn scrape --force' to scrape again");
    return;
  }

  const data: TeamsData = {
    timestamp: new Date().toISOString(),
    teams: {},
  };

  const teamsResponse = await get('https://play.battlecode.org/api/0/team/?format=json&ordering=name');
  for (const team of teamsResponse) {
    data.teams[team.id] = team;

    if (team.score > -1e6) {
      data.teams[team.id].history = await get(`https://play.battlecode.org/api/0/team/${team.id}/history/?format=json`);
      data.teams[team.id].history.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    } else {
      data.teams[team.id].history = [];
    }
  }

  fs.mkdirSync(path.dirname(dataFile), { recursive: true });

  fs.writeFileSync(dataFile, JSON.stringify(data));
  fs.writeFileSync(timestampFile, data.timestamp);

  console.log(`Successfully scraped latest data to '${dataFile}'`);
}

(async () => {
  try {
    await run();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
