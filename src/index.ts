import { createElement } from './common';
import { loadData } from './loader';
import { buildPage } from './main';

import 'bootstrap/js/dist/modal';
import './style.scss';

(async () => {
  try {
    const root = createElement(document.body, 'div');

    const data = await loadData(root);
    root.innerHTML = '';
    buildPage(root, data);
  } catch (err) {
    alert(`Something went wrong!\nSee the browser's console for the full error.\n${err}`);
    console.error(err);
  }
})();
