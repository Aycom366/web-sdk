export type WidgetOption = {
  publicKey: string;
  onEvent: (event: MessageEvents, data: WidgetResponse) => void;
  meta?: any;
};

export type WidgetResponse = {
  message: string;
  timeStamps: string;
  meta?: any;
};

export enum MessageEvents {
  WIDGET_OPENED = "WIDGET_OPENED",
  WIDGET_CLOSED = "WIDGET_CLOSED",
  WIDGET_LOAD_ERROR = "WIDGET_LOAD_ERROR",
  WIDGET_LOADED = "WIDGET_LOADED",
}
