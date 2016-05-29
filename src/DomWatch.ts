/// <reference path="./SingleElementFinder.ts"/>

/** Calls other functions when an element changes in the DOM. */
class DomWatch {
  private htmlFinder: SingleElementFinder;

  constructor() {
    this.htmlFinder = new SingleElementFinder();
  }

  /**
    Insert all the elements from nodeList, and their children, into
    the elements array.
  */
  private addElementNodesAndChildren(elements: Element[], nodeList: NodeList): void {
    for (let i = 0; i < nodeList.length; i++) {
      let node: Node = nodeList.item(i);

      if (node.nodeType == Node.ELEMENT_NODE) {
        elements.push(node as Element);

        this.addElementNodesAndChildren(elements, node.childNodes);
      }
    }
  }

  private getChangedElements(records: MutationRecord[]): Element[] {
    let elements: Element[] = [];

    for (let i = 0; i < records.length; i++) {
      let record: MutationRecord = records[i];

      this.addElementNodesAndChildren(elements, record.addedNodes);

      let nodeTarget = record.target;
      if (nodeTarget.nodeType == Node.ELEMENT_NODE) {
        elements.push(nodeTarget as Element);
      }
    }

    return elements;
  }

  private createAllElementObserver(callback: MutationCallback): void {
    let observer: MutationObserver = new MutationObserver(callback);
    let observerSettings: MutationObserverInit = {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    };
    observer.observe(this.htmlFinder.getHtmlElement(), observerSettings);
  }

  callForAnyChange(callback: (Element) => void): void {
    this.createAllElementObserver((records: MutationRecord[]) => {
      let changedElements: Element[] = this.getChangedElements(records);

      changedElements.forEach((element: Element) => {
        callback(element);
      });
    });
  }
}
