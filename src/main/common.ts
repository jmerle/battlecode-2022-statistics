import { createElement } from '../common';
import { Metric } from './metrics';

export function formatNumber(value: number, decimals: number = 0): string {
  let minimumFractionDigits = decimals;
  let maximumFractionDigits = decimals;

  if (decimals < 0) {
    minimumFractionDigits = undefined;
    maximumFractionDigits = undefined;
  }

  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

export function createCard(parent: HTMLElement, title: string): HTMLElement {
  const card = createElement(parent, 'div');
  card.classList.add('card');

  const header = createElement(card, 'h5');
  header.classList.add('card-header');
  header.textContent = title;

  return card;
}

export function createTable(parent: HTMLElement): HTMLElement {
  const tableContainer = createElement(parent, 'div');
  tableContainer.classList.add('table-responsive');

  const table = createElement(tableContainer, 'table');
  table.classList.add('table', 'table-sm', 'mb-0');

  return createElement(table, 'tbody');
}

export function createTeamsTable(
  parent: HTMLElement,
  teams: Team[],
  data: TeamsData,
  showBadges: boolean,
  metric: Metric,
): void {
  const tbody = createTable(parent);

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];

    const row = createElement(tbody, 'tr');

    const rankColumn = createElement(row, 'td');
    rankColumn.classList.add('text-end', 'team-number');
    rankColumn.textContent = `${formatNumber(i + 1)}.`;

    const linkColumn = createElement(row, 'td');
    const link = createElement(linkColumn, 'a');
    link.href = `https://play.battlecode.org/rankings/${team.id}`;
    link.target = '_blank';
    link.textContent = team.name;

    if (showBadges) {
      const badges: [string, string[]][] = [];
      if (team.student) {
        if (team.international) {
          badges.push(['International', ['bg-primary']]);
        } else {
          badges.push(['US', ['bg-dark']]);
        }
      } else {
        badges.push(['Non-student', ['bg-danger']]);
      }

      if (team.mit) {
        badges.push(['Newbie', ['bg-warning', 'text-dark']]);
      }

      if (team.high_school) {
        badges.push(['High School', ['bg-info', 'text-dark']]);
      }

      const badgeColumn = createElement(row, 'td');

      for (const [label, classes] of badges) {
        const badge = createElement(badgeColumn, 'span');
        badge.classList.add('badge', ...classes);
        badge.textContent = label;

        if (label !== badges[badges.length - 1][0]) {
          badgeColumn.appendChild(document.createTextNode(' '));
        }
      }
    }

    const metricValue = metric(team);
    if (metricValue !== null) {
      const metricColumn = createElement(row, 'td');
      metricColumn.classList.add('text-end', 'text-nowrap');
      metricColumn.textContent = `${formatNumber(metricValue[0])} ${metricValue[1]}`;
    }
  }
}
