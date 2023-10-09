import { MessageEvents, WidgetOption, WidgetResponse } from "./types";
var eventVariable: any;
const origin = `https://simple-packages.vercel.app`;

export function turnOnVisibility() {
  var container = document.getElementById("embeddable--widget-div");
  var frame = document.getElementById("embeddable--frame-id");
  if (container && frame) {
    container.style.display = "flex";
    frame.style.display = "block";
    container.style.visibility = "visible";
    frame.style.visibility = "visible";
  }
}

export function init(config: WidgetOption) {
  /**
   * @description Add Event that will listen for Parent Message
   * @param config.onEvent
   */
  getEvent(config.onEvent);

  /**
   * @description Add Class that the loader will use if sdk is visible
   */
  addLoaderStyles();

  // check if container and iframe is already rendered on the DOM
  if (
    document.getElementById("embeddable--widget-div") &&
    document.getElementById("embeddable--frame-id")
  ) {
    document.getElementById("embeddable--widget-div")?.remove();
  }

  var container = document.createElement("div");
  container.setAttribute("id", "embeddable--widget-div");
  container.setAttribute("style", containerStyle);
  document.body.insertBefore(container, document.body.childNodes[0]);

  /**
   * Prepare the source URL for displaying content in an iframe.
   *
   * This function creates a URL based on the provided origin and attaches query parameters
   * to it using the `searchParams.append` method. You can add custom query parameters by
   * appending keys and values to `searchParams.append`
   *
   * @param {string} origin - The base URL origin.
   * @param {string} config.publicKey - The publicKey to append as a search parameter.
   * @param {Object} config.meta - The meta object to append as a JSON-encoded search parameter.
   */
  var source = new URL(origin);
  source.searchParams.append("publicKey", config.publicKey);
  source.searchParams.append("meta", JSON.stringify(config.meta));

  /**
   * Creates and configures an iframe element for embedding content.
   *
   * @param {Object} config - Configuration object.
   * @param {HTMLAnchorElement} config.source - The source link for the iframe.
   * @param {string} config.iframeStyle - Inline CSS styles for the iframe.
   * @param {function} config.onEvent - Callback function to handle events.
   */
  var iframe = document.createElement("IFRAME") as HTMLIFrameElement;
  iframe.src = source.href;
  iframe.setAttribute("style", iframeStyle);
  iframe.setAttribute("id", "embeddable--frame-id");
  iframe.setAttribute("allowfullscreen", "true");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("title", "Embeddable Example");
  iframe.setAttribute(
    "sandbox",
    "allow-forms allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups"
  );

  iframe.onload = function () {
    /**
     * Hides the loader if iframe is loaded and iframe is visible
     */
    if (iframe.style.visibility === "visible") {
      var loader = document.getElementById("@aycom366/web-sdk-template-loader");
      if (loader) loader.style.display = "none";
    }

    /**
     *  Dispatches the iframe loaded event for consumers to consume
     */
    config.onEvent(MessageEvents.WIDGET_LOADED, {
      message: "Widget loaded successfully",
      timeStamps: new Date().toISOString(),
    });
  };

  iframe.onerror = () => {
    turnOffVisibility();
    if (config.onEvent)
      config.onEvent(MessageEvents.WIDGET_LOAD_ERROR, {
        message: "Widget failed to load",
        timeStamps: new Date().toISOString(),
      });
  };

  var loader = createLoader();
  document.getElementById("embeddable--widget-div")?.appendChild(loader);
  document.getElementById("embeddable--widget-div")?.appendChild(iframe);
}

export type IFrameMessage = {
  event: MessageEvent;
  data: WidgetResponse;
};

/**
 * Adds an event listener for receiving messages from the parent window.
 *
 * This function listens for messages sent to the current window and invokes the
 * specified callback when specific message events occur.
 *
 * @param {function} onEvent - A callback function to handle received events.
 */
export function getEvent(onEvent: any) {
  eventVariable = window.addEventListener("message", function (event) {
    if (event.origin !== origin) return;
    var data: IFrameMessage = JSON.parse(event.data);
    switch (data.event as any) {
      case MessageEvents.WIDGET_CLOSED:
        onEvent(MessageEvents.WIDGET_CLOSED, data.data);
        turnOffVisibility();
        break;
      case MessageEvents.WIDGET_OPENED:
        onEvent(MessageEvents.WIDGET_OPENED, data.data);
        break;
      case MessageEvents.WIDGET_LOAD_ERROR:
        onEvent(MessageEvents.WIDGET_LOAD_ERROR, data.data);
        turnOffVisibility();
        break;
    }
  });
}

export function turnOffVisibility() {
  var container = document.getElementById("embeddable--widget-div");
  var frame = document.getElementById("embeddable--frame-id");
  if (container && frame) {
    container.style.display = "none";
    frame.style.display = "none";
    container.style.visibility = "hidden";
    frame.style.visibility = "hidden";
  }
  window.removeEventListener("message", eventVariable);
}

export function openWidget(config: WidgetOption) {
  var container = document.getElementById("embeddable--widget-div");
  var loader = document.getElementById("@aycom366/web-sdk-template-loader");
  var frame = document.getElementById("embeddable--frame-id");
  if (container && loader && frame) {
    container.style.visibility = "visible";
    container.style.display = "flex";
    loader.style.display = "block";
    setTimeout(() => {
      turnOnVisibility();
      frame!.focus({ preventScroll: false });
      container!.focus({ preventScroll: false });
      config.onEvent(MessageEvents.WIDGET_OPENED, {
        message: "Widget opened",
        timeStamps: new Date().toISOString(),
      });
    }, 2000);
  }
}

export function createLoader() {
  let loaderDiv = document.createElement("div");
  let childDiv = document.createElement("div");
  loaderDiv.setAttribute("id", "@aycom366/web-sdk-template-loader");
  loaderDiv.classList.add("app-loader");
  childDiv.classList.add("app-loader__spinner");

  for (let i = 0; i < 12; i++) {
    let div = document.createElement("div");
    childDiv.appendChild(div);
  }
  loaderDiv.appendChild(childDiv);
  return loaderDiv;
}

export function addLoaderStyles() {
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = loaderStyles;
  document.head.appendChild(styleSheet);
}

const containerStyle =
  "position:fixed;overflow: hidden;display: none;justify-content: center;align-items: center;z-index: 999999999;height: 100%;width: 100%;color: transparent;background: rgba(0, 0, 0, 0.6);visibility:hidden;margin: 0;top:0;right:0;bottom:0;left:0;";

const iframeStyle =
  "position: fixed;display: none;overflow: hidden;z-index: 999999999;width: 100%;height: 100%;transition: opacity 0.3s ease 0s;visibility:hidden;margin: 0;top:0;right:0;bottom:0;left:0;";

const loaderStyles = `.app-loader {
  text-align: center;
  color: white;
  margin-right: -30px;
  width: 100%;
  position: fixed;
}

@-webkit-keyframes app-loader__spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.app-loader__spinner {
  position: relative;
  display: inline-block;
  width: fit-content;
}

.app-loader__spinner div {
  position: absolute;
  -webkit-animation: app-loader__spinner linear 1s infinite;
  animation: app-loader__spinner linear 1s infinite;
  background: white;
  width: 10px;
  height: 30px;
  border-radius: 40%;
  -webkit-transform-origin: 5px 65px;
  transform-origin: 5px 65px;
}

.app-loader__spinner div:nth-child(1) {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-animation-delay: -0.916666666666667s;
  animation-delay: -0.916666666666667s;
}

.app-loader__spinner div:nth-child(2) {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  -webkit-animation-delay: -0.833333333333333s;
  animation-delay: -0.833333333333333s;
}

.app-loader__spinner div:nth-child(3) {
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
  -webkit-animation-delay: -0.75s;
  animation-delay: -0.75s;
}

.app-loader__spinner div:nth-child(4) {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -webkit-animation-delay: -0.666666666666667s;
  animation-delay: -0.666666666666667s;
}

.app-loader__spinner div:nth-child(5) {
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  -webkit-animation-delay: -0.583333333333333s;
  animation-delay: -0.583333333333333s;
}

.app-loader__spinner div:nth-child(6) {
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}

.app-loader__spinner div:nth-child(7) {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-animation-delay: -0.416666666666667s;
  animation-delay: -0.416666666666667s;
}

.app-loader__spinner div:nth-child(8) {
  -webkit-transform: rotate(210deg);
  transform: rotate(210deg);
  -webkit-animation-delay: -0.333333333333333s;
  animation-delay: -0.333333333333333s;
}

.app-loader__spinner div:nth-child(9) {
  -webkit-transform: rotate(240deg);
  transform: rotate(240deg);
  -webkit-animation-delay: -0.25s;
  animation-delay: -0.25s;
}

.app-loader__spinner div:nth-child(10) {
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
  -webkit-animation-delay: -0.166666666666667s;
  animation-delay: -0.166666666666667s;
}

.app-loader__spinner div:nth-child(11) {
  -webkit-transform: rotate(300deg);
  transform: rotate(300deg);
  -webkit-animation-delay: -0.083333333333333s;
  animation-delay: -0.083333333333333s;
}

.app-loader__spinner div:nth-child(12) {
  -webkit-transform: rotate(330deg);
  transform: rotate(330deg);
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

.app-loader__spinner {
  -webkit-transform: translate(-20px, -20px) scale(0.2) translate(20px, 20px);
  transform: translate(-20px, -20px) scale(0.2) translate(20px, 20px);
}
`;
