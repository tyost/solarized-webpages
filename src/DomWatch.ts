/** Calls other functions when something changes in the DOM. */
class DomWatch {
  callForAnyChange(callback: MutationCallback): void {
    let htmlFinder: SingleElementFinder = new SingleElementFinder();
    let observer: MutationObserver = new MutationObserver(callback);
    let observerSettings: MutationObserverInit = {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    };
    observer.observe(htmlFinder.getHtmlElement(), observerSettings);
  }
}
