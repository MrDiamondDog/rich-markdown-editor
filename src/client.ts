import { Schema, Node as ProsemirrorNode, DOMSerializer } from 'prosemirror-model';
import { MarkdownParser } from 'prosemirror-markdown';
import ExtensionManager from "./lib/ExtensionManager";
// marks
import Bold from "./marks/Bold";
import RedHighlight from "./marks/highlights/RedHighlight";
import OrangeHighlight from "./marks/highlights/OrangeHighlight";
import YellowHighlight from "./marks/highlights/YellowHighlight";
import GreenHighlight from "./marks/highlights/GreenHighlight";
import BlueHighlight from "./marks/highlights/BlueHighlight";
import { BlueBackground, RedBackground,
  OrangeBackground, YellowBackground,
  GreenBackground } from './marks/backgrounds';
import Italic from "./marks/Italic";
import Strikethrough from "./marks/Strikethrough";
import TemplatePlaceholder from "./marks/Placeholder";
import Underline from "./marks/Underline";
import Link from "./marks/Link";
import HardBreak from "./nodes/HardBreak";
// nodes
import Doc from "./nodes/Doc";
import Text from "./nodes/Text";
import Paragraph from "./nodes/Paragraph";
// plugins
import History from "./plugins/History";
import MaxLength from "./plugins/MaxLength";
import Placeholder from "./plugins/Placeholder";
import SmartText from "./plugins/SmartText";
import PasteHandler from "./plugins/PasteHandler";

export const getFlashcardSerializerExtensions = () => {
  return new ExtensionManager([
    new Doc(),
    new Paragraph(),
    new Text(),
    new BlueBackground(),
    new RedBackground(),
    new OrangeBackground(),
    new YellowBackground(),
    new GreenBackground(),
    new OrangeHighlight(),
    new YellowHighlight(),
    new BlueHighlight(),
    new GreenHighlight(),
    new RedHighlight(),
    new Underline(),
    new Strikethrough(),
    new Bold(),
    new Italic(),
    new Link(),
    new HardBreak(),
  ]);
}

export const getFlashCardMdToHtmlInput = () => {
  const extensions = getFlashcardSerializerExtensions();

  const schema = new Schema({
    nodes: extensions.nodes,
    marks: extensions.marks,
  });
  const domSerializer = DOMSerializer.fromSchema(schema);
  const markdownParser = extensions.parser({
    schema,
    plugins: extensions.rulePlugins,
  });

  return {
    domSerializer,
    markdownParser,
  }
}

type FlashcardMdToHtmlInput = {
  domSerializer: DOMSerializer;
  markdownParser: MarkdownParser;
  markdown: string;
}

export const flashcardMdToHTMLDoc = (input: FlashcardMdToHtmlInput) => {
  const { markdownParser, domSerializer, markdown } = input;
  const doc = markdownParser.parse(markdown) as ProsemirrorNode;

  return domSerializer.serializeFragment(doc.content, {
    document,
  });
}

export const flashcardDocToHtmlString = (doc: HTMLElement | DocumentFragment) => {
  const throwAwayDiv = document.createElement("div");
  throwAwayDiv.appendChild(doc);

  return throwAwayDiv.innerHTML;
}

export const flashcardMdToHtml = (
  input: FlashcardMdToHtmlInput,
) => {
  const doc = flashcardMdToHTMLDoc(input);
  return flashcardDocToHtmlString(doc);
}

export const flashcardMdToText = (input: FlashcardMdToHtmlInput) => {
  const doc = flashcardMdToHTMLDoc(input);

  let text = '';
  const traverseNodes = (nodes: NodeListOf<ChildNode>) => {
    Array.from(nodes).forEach( ( node ) => {
      text += node.textContent;
      
      if (node.childNodes) {
        traverseNodes(node.childNodes);
      }
    } );
    
    text += ' ';
  }

  if (doc.childNodes) {
    traverseNodes(doc.childNodes);
  }

  return text;
}

type GetFlashcardEditorExtensionsInput = {
  maxLength?: number;
  disableLinkPaste?: boolean;
  disableCodePaste?: boolean;
}

export const getFlashcardEditorExtensions = (
  input: GetFlashcardEditorExtensionsInput={},
) => {
  const { maxLength, 
    disableCodePaste=true,
    disableLinkPaste=true } = input;

  return {
      baseExtensions: [
        new Doc(),
        new Paragraph(),
        new Text(),
        // backgrounds take precedence over other marks
        // this makes all below marks wrapped inside the background mark
        // do not change order of these marks unless you know what you are doing
        new BlueBackground(),
        new RedBackground(),
        new OrangeBackground(),
        new YellowBackground(),
        new GreenBackground(),
        new OrangeHighlight(),
        new YellowHighlight(),
        new BlueHighlight(),
        new GreenHighlight(),
        new RedHighlight(), // the order matters here!! since it's the default marker
        new Underline(),
        new Strikethrough(),
        new Bold(),
        new Italic(),
        new TemplatePlaceholder(),
        new History(),
        new SmartText(),
        new PasteHandler({
          disableCodePaste,
          disableLinkPaste,
        }),
        new HardBreak(),
        new MaxLength({
          maxLength,
        }),
    ],
    getPlaceholderExtension: ( placeholder: string ) => (
      new Placeholder({
        placeholder,
      })
    ),
  }
}