interface GoogleTranslateElementInit {
  pageLanguage?: string;
  includedLanguages?: string;
  layout?: number;
  autoDisplay?: boolean;
}

declare namespace google.translate {
  class TranslateElement {
    constructor(options: GoogleTranslateElementInit, elementId: string);
    static InlineLayout: {
      SIMPLE: number;
      HORIZONTAL: number;
      VERTICAL: number;
    };
  }
}

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: typeof google.translate.TranslateElement;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

export {};
