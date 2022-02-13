import axios from 'axios';
import * as localForage from 'localforage';
import { createElement } from '../common';

const STORAGE_PREFIX = 'battlecode-2022-statistics-';
const DATA_KEY = STORAGE_PREFIX + 'data';
const DATA_TIMESTAMP_KEY = STORAGE_PREFIX + 'data-timestamp';

function createSpinner(root: HTMLElement): (newStatus: string) => void {
  const container = createElement(root, 'div');
  container.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'min-vh-100');

  const spinner = createElement(container, 'div');
  spinner.classList.add('spinner-border');

  const status = createElement(container, 'b');
  status.classList.add('mt-3');

  return newStatus =>
    new Promise<void>(resolve => {
      status.innerText = newStatus;

      // The status element needs a few milliseconds to render the new status
      setTimeout(() => resolve(), 10);
    });
}

export async function loadData(root: HTMLElement): Promise<TeamsData> {
  const updateStatus = createSpinner(root);

  const timestamp = Date.now();

  await updateStatus('Checking whether cache is up-to-date');

  const localTimestamp = await localForage.getItem(DATA_TIMESTAMP_KEY);
  const latestTimestamp = (await axios.get(`data-timestamp.txt?${timestamp}`, { responseType: 'text' })).data;

  if (localTimestamp === latestTimestamp) {
    await updateStatus('Cache is up-to-date, reading data from cache');
    const localData = await localForage.getItem<TeamsData>(DATA_KEY);
    if (localData !== null) {
      return localData;
    }
  }

  await updateStatus('Retrieving latest data');
  const data = (await axios.get(`data.json?${timestamp}`, { responseType: 'json' })).data;

  await updateStatus('Caching latest data');
  await localForage.setItem(DATA_KEY, data);
  await localForage.setItem(DATA_TIMESTAMP_KEY, latestTimestamp);

  return data;
}
