/// <reference path="./AllElementMarkers.ts"/>

/**
  Marks certain elements that cannot be selected by CSS alone. Uses a delay so
    multiple requests to mark within a short period of time only trigger
    a single marking pass.
*/
class DelayedAllElementMarkers {
  private markDelay: number;
  private markers: AllElementMarkers;
  private markTimeoutId: boolean|number;

  constructor() {
    this.markers = new AllElementMarkers();
    this.markTimeoutId = false;

    // Time in miliseconds to wait before scanning and marking when requested.
    this.markDelay = 100;
  }


  markElementsForCss(): void {
    if (!this.markTimeoutId) {
      var that = this;

      this.markTimeoutId = window.setTimeout(
        function() {
          that.markers.markElementsForCss();
          that.markTimeoutId = false;
        },
        this.markDelay
      );
    }
  };
}
