import { InputRule } from "prosemirror-inputrules";
import ReactDOM from "react-dom";
import * as React from "react";
import { Plugin } from "prosemirror-state";
import { isInTable } from "@knowt/prosemirror-tables";
import { findParentNode } from "@knowt/prosemirror-utils";
import { PlusIcon } from "outline-icons";
import { Decoration, DecorationSet, EditorView } from "prosemirror-view";
import Extension from "../lib/Extension";

const MAX_MATCH = 500;
const OPEN_REGEX = /^\/(\w+)?$|.*\s\/(\w+)?$/;
const CLOSE_REGEX = /\/(.*\s)$/;

// based on the input rules code in Prosemirror, here:
// https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/inputrules.js
export function run(view, from, to, regex, handler) {
  if (view.composing) {
    return false;
  }
  const state = view.state;
  const $from = state.doc.resolve(from);
  if ($from.parent.type.spec.code) {
    return false;
  }

  const textBefore = $from.parent.textBetween(
    Math.max(0, $from.parentOffset - MAX_MATCH),
    $from.parentOffset,
    null,
    "\ufffc"
  );

  const match = regex.exec(textBefore);
  const tr = handler(state, match, match ? from - match[0].length : from, to);
  if (!tr) return false;
  return true;
}

export default class BlockMenuTrigger extends Extension {
  get name() {
    return "blockmenu";
  }

  get plugins() {
    const button = document.createElement("button");
    button.className = "block-menu-trigger";
    button.type = "button";
    ReactDOM.render(<PlusIcon color="currentColor" />, button);

    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            contextmenu: (view: EditorView, event: MouseEvent) => {
              if (!view.hasFocus()) {
                return false;
              }

              const parent = findParentNode(
                (node) => node.type.name === "paragraph"
              )(view.state.selection);

              if (!parent || parent.node.content.size > 0) {
                return false;
              }

              event.preventDefault();
              this.options.onOpen();
              return true;
            },
          },
          handleKeyDown: (view, event) => {
            // Prosemirror input rules are not triggered on backspace, however
            // we need them to be evaluted for the filter trigger to work
            // correctly. This additional handler adds inputrules-like handling.
            if (event.key === "Backspace") {
              // timeout ensures that the delete has been handled by prosemirror
              // and any characters removed, before we evaluate the rule.
              setTimeout(() => {
                const { pos } = view.state.selection.$from;
                return run(view, pos, pos, OPEN_REGEX, (state, match) => {
                  if (match) {
                    this.options.onOpen(match[1] || "");
                  } else {
                    this.options.onClose();
                  }
                  return null;
                });
              });
            }

            const isSearchEmpty = document.getElementById( 'block-menu-container-empty' );

            // If the query is active and we're navigating the block menu then
            // just ignore the key events in the editor itself until we're done
            if (
              ( event.key === "Enter" && !isSearchEmpty ) ||
              event.key === "ArrowUp" ||
              event.key === "ArrowDown" ||
              event.key === "Tab"
            ) {
              const { pos } = view.state.selection.$from;

              return run(view, pos, pos, OPEN_REGEX, (state, match) => {
                // just tell Prosemirror we handled it and not to do anything
                return match ? true : null;
              });
            }

            return false;
          },
          decorations: (state) => {
            const parent = findParentNode(
              (node) => node.type.name === "paragraph"
            )(state.selection);

            if (!parent) {
              return;
            }

            const decorations: Decoration[] = [];
            const isEmpty = parent && parent.node.content.size === 0;
            const isSlash = parent && parent.node.textContent === "/";
            const isTopLevel = state.selection.$from.depth === 1;

            if (isTopLevel) {
              if (isEmpty) {
                decorations.push(
                  Decoration.widget(parent.pos, () => {
                    button.addEventListener("click", () => {
                      this.options.onOpen("");
                    });
                    return button;
                  })
                );

                decorations.push(
                  Decoration.node(
                    parent.pos,
                    parent.pos + parent.node.nodeSize,
                    {
                      class: "placeholder",
                      "data-empty-text": this.options.dictionary.newLineEmpty,
                    }
                  )
                );
              }

              if (isSlash) {
                decorations.push(
                  Decoration.node(
                    parent.pos,
                    parent.pos + parent.node.nodeSize,
                    {
                      class: "placeholder",
                      "data-empty-text": `  ${this.options.dictionary.newLineWithSlash}`,
                    }
                  )
                );
              }

              return DecorationSet.create(state.doc, decorations);
            }

            return;
          },
        },
      }),
    ];
  }

  inputRules() {
    return [
      new InputRule(OPEN_REGEX, (state, match) => {
        if (
          match &&
          state.selection.$from.parent.type.name === "paragraph" &&
          !isInTable(state)
        ) {
          this.options.onOpen(match[1] || match[2] || "");
        }
        return null;
      }),
      new InputRule(CLOSE_REGEX, (state, match) => {
        if (match) {
          this.options.onClose();
        }
        return null;
      }),
    ];
  }
}
