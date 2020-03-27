import { INotify } from "./interfaces";

export interface IAlert {
  type: string;
  strong?: string;
  message: string;
  icon?: string;
  status: boolean;
}

export class ErrorAlert implements IAlert {
  icon?: string;
  type: string;
  status = false;

  constructor(public strong: string, public message: string) {
    this.type = "danger";
    this.icon = "objects_support-17";
  }
}

export class MessageAlert implements IAlert {
  icon?: string;
  type: string;
  status = false;

  constructor(public strong: string, public message: string) {
    this.type = "success";
    this.icon = "ui-2_like";
  }
}

export class Notify implements INotify {
  constructor(public type: string, public message: string) {}
}
