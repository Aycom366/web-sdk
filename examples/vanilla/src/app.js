import CorePackage, { MessageEvents } from "@aycom366/web-sdk-template";

const openWidget = document.getElementById("widget-open");
openWidget.addEventListener("click", () => {
  const widgetPackage = new CorePackage({
    onEvent(event, data) {
      switch (event) {
        case MessageEvents.WIDGET_LOADED:
          console.log("loaded", data);
          break;
        case MessageEvents.WIDGET_CLOSED:
          console.log("closed", data);
          break;
        case MessageEvents.WIDGET_OPENED:
          console.log("widget opened", data);
          break;
        case MessageEvents.WIDGET_LOAD_ERROR:
          console.log("widget load error", data);
          break;
      }
    },
    publicKey: "Ayomide",
    meta: {
      order_ref: "kjdjkdjkdjds",
      custom: "pass anything",
    },
  });
  widgetPackage.setup();
  widgetPackage.open();
});
