/**
 * Detects any html within note content.
 * BE CAREFUL when using this function as a precursor to parsing
 * note content as HTML since HTML can occur naturally within the note -
 * i.e -> computer science notes
 * This function is used for the backend quiz generation
 */
export const isHTML = (str) => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};

export const remToPx = (rem) => {
  return (
    parseFloat(rem) *
    parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  );
};

const isRem = (val) => {
  return typeof val === "string" && 
    ( val.includes("rem") || val.includes("em") );
};

// Converts string dimension to float (in px)
export const getParsedValue = (val) => {
  if (!val) return NaN;
  return isRem(val) ? remToPx(val) : parseFloat(val);
};

export const getHeadingLevelByFontSize = (fontSize) => {
  if (fontSize > 31) return 1;
  if (fontSize > 23) return 2;
  if (fontSize > 16) return 3;
  if (fontSize > 10) return 4;
};

// returns whether a heading tag with the given font size
// is considered as a heading of the given level
export const isValidHeading = (fontSize, level) => {
  switch (level) {
    case 1:
      return fontSize > 28;
    case 2:
      return fontSize > 20;
    case 3:
      return fontSize > 15;
    case 4:
      return fontSize > 10;
    default:
      return false;
  }
};

export const getStyleValue = (el, prop: string): number => {
  return el ? getParsedValue(window.getComputedStyle(el)[prop]) : 0;
};

export const replaceHeaderByStrong = (html: string) => {
  const findHeadersRegex =
    /<(\/?)h[1,2,3,4,5]\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gm;
  return html.replace(findHeadersRegex, "<$1strong$2>");
};
