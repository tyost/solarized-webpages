 /**
  * Finds types of elements that usually exist once within a document.
  * For example, the body element usually exists once.
  */
class SingleElementFinder {
  getBody(): HTMLBodyElement {
    return document.getElementsByTagName('body')[0];
  };


  getHtmlElement(): HTMLElement {
    return document.getElementsByTagName('html')[0];
  };

  getHtmlId(): string {
    return this.getHtmlElement().getAttribute('id');
  };
}
