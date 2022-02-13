import { createElement } from '../common';
import { createCard, createTeamsTable } from './common';
import { createScrimmagesMetric, createStreakMetric, Metric, MetricValue, scoreMetric } from './metrics';
import { showTeamsModal } from './modal';

export function buildRankingCard(row: HTMLElement, title: string, data: TeamsData, metric: Metric): void {
  const metricByTeam: { [id: string]: MetricValue } = {};
  for (const id of Object.keys(data.teams)) {
    metricByTeam[id] = metric(data.teams[id]);
  }

  const sortedTeams = Object.values(data.teams)
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => metricByTeam[b.id][0] - metricByTeam[a.id][0]);

  const column = createElement(row, 'div');
  column.classList.add('col-lg-4');

  const card = createCard(column, title);

  createTeamsTable(card, sortedTeams.slice(0, 10), data, false, metric);

  const footer = createElement(card, 'div');
  footer.classList.add('card-footer');

  const seeMore = createElement(footer, 'a');
  seeMore.href = 'javascript:void(0)';
  seeMore.textContent = 'More...';
  seeMore.addEventListener('click', () => showTeamsModal(title, sortedTeams, data, metric));
}

export function buildRankings(grid: HTMLElement, data: TeamsData): void {
  const row1 = createElement(grid, 'div');
  row1.classList.add('row');

  buildRankingCard(row1, 'Scrimmages Played', data, createScrimmagesMetric(true, true));
  buildRankingCard(row1, 'Ranked Scrimmages Played', data, createScrimmagesMetric(true, false));
  buildRankingCard(row1, 'Unranked Scrimmages Played', data, createScrimmagesMetric(false, true));

  const row2 = createElement(grid, 'div');
  row2.classList.add('row');

  buildRankingCard(row2, 'Score', data, scoreMetric);
  buildRankingCard(row2, 'Longest Ranked Win Streak', data, createStreakMetric(true));
  buildRankingCard(row2, 'Longest Ranked Lose Streak', data, createStreakMetric(false));
}
