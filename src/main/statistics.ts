import { createElement } from '../common';
import { createCard, createTable, formatNumber } from './common';
import { nullMetric } from './metrics';
import { showTeamsModal } from './modal';

type StatisticRow = [string, string, () => void];

function buildStatisticsTable(parent: HTMLElement, rows: StatisticRow[]): void {
  const tbody = createTable(parent);

  for (const [label, value, onClick] of rows) {
    const row = createElement(tbody, 'tr');

    const labelColumn = createElement(row, 'td');
    labelColumn.textContent = label;

    const valueColumn = createElement(row, 'td');
    valueColumn.classList.add('text-end');

    let valueHolder: HTMLElement;
    if (onClick !== null) {
      valueHolder = createElement(valueColumn, 'a');
      (valueHolder as HTMLLinkElement).href = 'javascript:void(0)';
      valueHolder.addEventListener('click', () => onClick());
    } else {
      valueHolder = createElement(valueColumn, 'span');
    }

    valueHolder.textContent = value;
  }
}

function buildStatisticsCard(
  title: string,
  row: HTMLElement,
  data: TeamsData,
  splitSubmissions: boolean,
  statisticFactory: (teams: Team[], titleSuffix: string) => StatisticRow[],
): void {
  const column = createElement(row, 'div');
  column.classList.add('col-lg-4');

  const card = createCard(column, title);

  const allTeams = Object.values(data.teams).sort((a, b) => a.name.localeCompare(b.name));

  if (!splitSubmissions) {
    buildStatisticsTable(card, statisticFactory(allTeams, ''));
    return;
  }

  const titleId = title.replace(/ /g, '-').toLowerCase();

  const tabs = createElement(card, 'ul');
  tabs.classList.add('nav', 'nav-tabs', 'nav-fill');

  const allTeamsTab = createElement(tabs, 'li');
  allTeamsTab.classList.add('nav-item');

  const allTeamsTabButton = createElement(allTeamsTab, 'button');
  allTeamsTabButton.classList.add('nav-link', 'active');
  allTeamsTabButton.dataset.bsToggle = 'tab';
  allTeamsTabButton.dataset.bsTarget = `#tab-${titleId}-all`;
  allTeamsTabButton.textContent = 'All teams';

  const teamsWithSubmissionsTab = createElement(tabs, 'li');
  teamsWithSubmissionsTab.classList.add('nav-item');

  const teamsWithSubmissionsTabButton = createElement(teamsWithSubmissionsTab, 'button');
  teamsWithSubmissionsTabButton.classList.add('nav-link');
  teamsWithSubmissionsTabButton.dataset.bsToggle = 'tab';
  teamsWithSubmissionsTabButton.dataset.bsTarget = `#tab-${titleId}-with-submissions`;
  teamsWithSubmissionsTabButton.textContent = 'Teams with submissions';

  const tabPanes = createElement(card, 'div');
  tabPanes.classList.add('tab-content');

  const allTeamsTabPane = createElement(tabPanes, 'div');
  allTeamsTabPane.classList.add('tab-pane', 'fade', 'show', 'active');
  allTeamsTabPane.id = `tab-${titleId}-all`;

  const teamsWithSubmissionsTabPane = createElement(tabPanes, 'div');
  teamsWithSubmissionsTabPane.classList.add('tab-pane', 'fade');
  teamsWithSubmissionsTabPane.id = `tab-${titleId}-with-submissions`;

  buildStatisticsTable(allTeamsTabPane, statisticFactory(allTeams, ''));
  buildStatisticsTable(
    teamsWithSubmissionsTabPane,
    statisticFactory(
      allTeams.filter(team => team.score > -1e6),
      ' with submissions',
    ),
  );
}

function buildScrimmageStatistics(row: HTMLElement, data: TeamsData): void {
  buildStatisticsCard('Scrimmage Statistics', row, data, false, teams => {
    const rows: StatisticRow[] = [];

    const historyTimestamps = new Set();
    for (const team of teams) {
      for (const item of team.history) {
        historyTimestamps.add(item.date);
      }
    }

    const scrimmagesPlayed = teams.reduce((acc, team) => acc + team.wins + team.losses + team.draws, 0) / 2;
    const rankedScrimmagesPlayed = historyTimestamps.size;
    const unrankedScrimmagesPlayed = scrimmagesPlayed - rankedScrimmagesPlayed;

    rows.push(['Scrimmages played', formatNumber(scrimmagesPlayed), null]);
    rows.push(['Ranked scrimmages played', formatNumber(rankedScrimmagesPlayed), null]);
    rows.push(['Unranked scrimmages played', formatNumber(unrankedScrimmagesPlayed), null]);

    return rows;
  });
}

function buildTeamStatistics(row: HTMLElement, data: TeamsData): void {
  buildStatisticsCard('Team Statistics', row, data, true, (teams, titleSuffix) => {
    const rows: StatisticRow[] = [];

    const memberCount = teams.reduce((acc, team) => acc + team.users.length, 0);
    rows.push(['Average team size', formatNumber(memberCount / teams.length, 2), null]);

    for (let i = 0; i < 50; i++) {
      const label = `${i}-person teams`;
      const teamsWithSize = teams.filter(team => team.users.length === i);

      if (teamsWithSize.length === 0 && (i < 1 || i > 4)) {
        continue;
      }

      rows.push([
        label,
        formatNumber(teamsWithSize.length),
        () => showTeamsModal(label + titleSuffix, teamsWithSize, data, nullMetric),
      ]);
    }

    return rows;
  });
}

function buildTeamDistribution(row: HTMLElement, data: TeamsData): void {
  buildStatisticsCard('Team Distribution', row, data, true, (teams, titleSuffix) => {
    const rows: StatisticRow[] = [];

    for (const [label, relevantTeams] of <[string, Team[]][]>[
      ['Teams', teams],
      ['US teams', teams.filter(team => team.student && !team.international)],
      ['International teams', teams.filter(team => team.student && team.international)],
      ['Newbie teams', teams.filter(team => team.student && team.mit)],
      ['High School teams', teams.filter(team => team.student && team.high_school)],
    ]) {
      rows.push([
        label,
        formatNumber(relevantTeams.length),
        () => showTeamsModal(label + titleSuffix, relevantTeams, data, nullMetric),
      ]);
    }

    return rows;
  });
}

export function buildStatistics(grid: HTMLElement, data: TeamsData): void {
  const row = createElement(grid, 'div');
  row.classList.add('row');

  buildScrimmageStatistics(row, data);
  buildTeamStatistics(row, data);
  buildTeamDistribution(row, data);
}
