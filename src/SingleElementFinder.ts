 /**
  * Finds types of elements that usually exist once within a document.
  * For example, the body element usually exists once.
  */
class SingleElementFinder {
  getBody(): HTMLBodyElement {
    return document.getElementsByTagName('body')[0];
  };
}
