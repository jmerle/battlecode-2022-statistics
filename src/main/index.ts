import { createElement } from '../common';
import { buildHeader } from './header';
import { buildPerformance } from './performance';
import { buildRankings } from './rankings';
import { buildStatistics } from './statistics';

export function buildPage(root: HTMLElement, data: TeamsData): void {
  const container = createElement(root, 'div');
  container.classList.add('container-xl');

  const grid = createElement(container, 'div');
  grid.classList.add('grid');

  buildHeader(grid, data);
  buildPerformance(grid, data);
  buildStatistics(grid, data);
  buildRankings(grid, data);
}
