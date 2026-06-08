declare module "@novnc/novnc/lib/rfb" {
  export default RFB;
}

declare module "@novnc/novnc/core/rfb" {
  export default RFB;
}

interface RFBEventMap {
  connect: CustomEvent;
  disconnect: CustomEvent<{ clean: boolean }>;
  credentialsrequired: CustomEvent;
  securityfailure: CustomEvent<{ status: number; reason: string }>;
  desktopname: CustomEvent<{ name: string }>;
  clipboard: CustomEvent<{ text: string }>;
  bell: CustomEvent;
}

declare class RFB {
  constructor(target: HTMLElement, url: string, options?: { shared?: boolean; repeaterID?: string; credentials?: { password?: string } });

  scaleViewport: boolean;
  resizeSession: boolean;
  viewOnly: boolean;
  background: string;

  disconnect(): void;
  clipboardPasteFrom(text: string): void;

  addEventListener<K extends keyof RFBEventMap>(
    type: K,
    listener: (event: RFBEventMap[K]) => void
  ): void;
}
