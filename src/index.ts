import { WidgetOption } from "./types";
import { init, openWidget, turnOffVisibility } from "./utils";

export { WidgetOption, MessageEvents, WidgetResponse } from "./types";

export default class CorePackage {
  private options = {} as WidgetOption;
  private isSetup: boolean;

  constructor(props: WidgetOption) {
    if (typeof window === "undefined") {
      throw new Error("CorePackage should only be used on the client side.");
    }
    this.options = props;
    this.isSetup = false;
  }
  setup() {
    init(this.options);
    this.isSetup = true;
  }
  close() {
    turnOffVisibility();
  }

  /**
   * Ensure you add the below check to additional methods you will be adding
   * The setup method has to be invoked before any other method.
   */
  open() {
    if (!this.isSetup) {
      throw new Error("Call 'setup' method before invoking open");
    }

    openWidget(this.options);
  }
}
