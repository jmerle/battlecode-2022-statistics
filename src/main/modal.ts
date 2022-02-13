import * as bootstrap from 'bootstrap';
import { createElement } from '../common';
import { createTeamsTable } from './common';
import { Metric } from './metrics';

let modal: bootstrap.Modal = null;
let modalElem: HTMLElement = null;

function buildModal(): void {
  modalElem = createElement(document.body, 'div');
  modalElem.classList.add('modal', 'fade');

  const dialog = createElement(modalElem, 'div');
  dialog.classList.add('modal-dialog', 'modal-dialog-scrollable', 'modal-lg');

  const content = createElement(dialog, 'div');
  content.classList.add('modal-content');

  const header = createElement(content, 'div');
  header.classList.add('modal-header');

  const title = createElement(header, 'h5');
  title.classList.add('modal-title');

  const headerCloseButton = createElement(header, 'button');
  headerCloseButton.classList.add('btn-close');
  headerCloseButton.dataset.bsDismiss = 'modal';

  const body = createElement(content, 'div');
  body.classList.add('modal-body', 'p-0');

  const footer = createElement(content, 'div');
  footer.classList.add('modal-footer');

  const footerCloseButton = createElement(footer, 'button');
  footerCloseButton.classList.add('btn', 'btn-secondary');
  footerCloseButton.dataset.bsDismiss = 'modal';
  footerCloseButton.textContent = 'Close';

  modal = new bootstrap.Modal(modalElem);
}

export function showTeamsModal(title: string, teams: Team[], data: TeamsData, metric: Metric): void {
  if (modal === null) {
    buildModal();
  }

  modalElem.querySelector('.modal-title').textContent = title;

  const table = modalElem.querySelector('.modal-body > .table-responsive');
  if (table !== null) {
    table.remove();
  }

  createTeamsTable(modalElem.querySelector('.modal-body'), teams, data, true, metric);

  modal.show();
}
