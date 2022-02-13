import { createElement } from '../common';
import { createCard } from './common';

export function buildHeader(grid: HTMLElement, data: TeamsData): void {
  const row = createElement(grid, 'div');
  row.classList.add('row');

  const column = createElement(row, 'div');
  column.classList.add('col-lg-12');

  const card = createCard(column, document.title);

  const cardBody = createElement(card, 'div');
  cardBody.classList.add('card-body');

  const dataTimestamp = new Date(data.timestamp);

  const paragraph1 = createElement(cardBody, 'p');
  paragraph1.innerHTML = `Based on data scraped from the Battlecode 2022 API on ${dataTimestamp.toDateString()} at ${dataTimestamp.toTimeString()}.`;

  const paragraph2 = createElement(cardBody, 'p');
  paragraph2.classList.add('mb-0');
  paragraph2.innerHTML = `The source code and raw data are available in the <a href="https://github.com/jmerle/battlecode-2022-statistics" target="_blank">jmerle/battlecode-2022-statistics</a> GitHub repository.`;
}
