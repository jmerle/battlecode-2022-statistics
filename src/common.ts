export function createElement<K extends keyof HTMLElementTagNameMap>(
  parent: Element,
  tag: K,
): HTMLElementTagNameMap[K] {
  const elem = document.createElement(tag);
  parent.appendChild(elem);
  return elem;
}
