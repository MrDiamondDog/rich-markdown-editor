"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const Node_1 = __importDefault(require("./Node"));
const isList_1 = __importDefault(require("../queries/isList"));
const isInList_1 = __importDefault(require("../queries/isInList"));
const getParentListItem_1 = __importDefault(require("../queries/getParentListItem"));
const customSplitListItem_1 = require("../commands/customSplitListItem");
const prosemirror_utils_1 = require("@knowt/prosemirror-utils");
class ListItem extends Node_1.default {
    get name() {
        return "list_item";
    }
    get defaultOptions() {
        return {
            includeDrag: true,
        };
    }
    get schema() {
        return {
            content: "paragraph block*",
            defining: true,
            draggable: this.options.includeDrag,
            parseDOM: [{ tag: "li" }],
            toDOM: () => [
                "li",
                this.options.includeDrag ? {
                    class: this.options.includeDrag ? 'drag' : ''
                } : {},
                0
            ],
        };
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                state: {
                    init() {
                        return prosemirror_view_1.DecorationSet.empty;
                    },
                    apply: (tr, set, oldState, newState) => {
                        if (this.options.includeDrag) {
                            const action = tr.getMeta("li");
                            if (!action && !tr.docChanged) {
                                return set;
                            }
                            set = set.map(tr.mapping, tr.doc);
                            switch (action === null || action === void 0 ? void 0 : action.event) {
                                case "mouseover": {
                                    const result = prosemirror_utils_1.findParentNodeClosestToPos(newState.doc.resolve(action.pos), (node) => node.type.name === this.name ||
                                        node.type.name === "checkbox_item");
                                    if (!result) {
                                        return set;
                                    }
                                    const list = prosemirror_utils_1.findParentNodeClosestToPos(newState.doc.resolve(action.pos), (node) => isList_1.default(node, this.editor.schema));
                                    if (!list) {
                                        return set;
                                    }
                                    const start = list.node.attrs.order || 1;
                                    let listItemNumber = 0;
                                    list.node.content.forEach((li, _, index) => {
                                        if (li === result.node) {
                                            listItemNumber = index;
                                        }
                                    });
                                    const counterLength = String(start + listItemNumber).length;
                                    return set.add(tr.doc, [
                                        prosemirror_view_1.Decoration.node(result.pos, result.pos + result.node.nodeSize, {
                                            class: `hovering`,
                                        }, {
                                            hover: true,
                                        }),
                                        prosemirror_view_1.Decoration.node(result.pos, result.pos + result.node.nodeSize, {
                                            class: `counter-${counterLength}`,
                                        }),
                                    ]);
                                }
                                case "mouseout": {
                                    const result = prosemirror_utils_1.findParentNodeClosestToPos(newState.doc.resolve(action.pos), (node) => node.type.name === this.name ||
                                        node.type.name === "checkbox_item");
                                    if (!result) {
                                        return set;
                                    }
                                    return set.remove(set.find(result.pos, result.pos + result.node.nodeSize, (spec) => spec.hover));
                                }
                                default:
                            }
                            return set;
                        }
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                    handleDOMEvents: {
                        mouseover: (view, event) => {
                            if (this.options.includeDrag) {
                                const { state, dispatch } = view;
                                const target = event.target;
                                const li = target === null || target === void 0 ? void 0 : target.closest("li");
                                if (!li) {
                                    return false;
                                }
                                if (!view.dom.contains(li)) {
                                    return false;
                                }
                                const pos = view.posAtDOM(li, 0);
                                if (!pos) {
                                    return false;
                                }
                                dispatch(state.tr.setMeta("li", {
                                    event: "mouseover",
                                    pos,
                                }));
                                return false;
                            }
                        },
                        mouseout: (view, event) => {
                            if (this.options.includeDrag) {
                                const { state, dispatch } = view;
                                const target = event.target;
                                const li = target === null || target === void 0 ? void 0 : target.closest("li");
                                if (!li) {
                                    return false;
                                }
                                if (!view.dom.contains(li)) {
                                    return false;
                                }
                                const pos = view.posAtDOM(li, 0);
                                if (!pos) {
                                    return false;
                                }
                                dispatch(state.tr.setMeta("li", {
                                    event: "mouseout",
                                    pos,
                                }));
                                return false;
                            }
                        },
                    },
                },
            }),
        ];
    }
    keys({ type }) {
        return {
            Enter: customSplitListItem_1.customSplitListItem(type),
            Tab: prosemirror_schema_list_1.sinkListItem(type),
            "Shift-Tab": prosemirror_schema_list_1.liftListItem(type),
            "Mod-]": prosemirror_schema_list_1.sinkListItem(type),
            "Mod-[": prosemirror_schema_list_1.liftListItem(type),
            "Shift-Enter": (state, dispatch) => {
                if (!isInList_1.default(state))
                    return false;
                if (!state.selection.empty)
                    return false;
                const { tr, selection } = state;
                dispatch(tr.split(selection.to));
                return true;
            },
            "Alt-ArrowUp": (state, dispatch) => {
                if (!state.selection.empty)
                    return false;
                const result = getParentListItem_1.default(state);
                if (!result)
                    return false;
                const [li, pos] = result;
                const $pos = state.doc.resolve(pos);
                if (!$pos.nodeBefore ||
                    !["list_item", "checkbox_item"].includes($pos.nodeBefore.type.name)) {
                    console.log("Node before not a list item");
                    return false;
                }
                const { tr } = state;
                const newPos = pos - $pos.nodeBefore.nodeSize;
                dispatch(tr
                    .delete(pos, pos + li.nodeSize)
                    .insert(newPos, li)
                    .setSelection(prosemirror_state_1.TextSelection.near(tr.doc.resolve(newPos))));
                return true;
            },
            "Alt-ArrowDown": (state, dispatch) => {
                if (!state.selection.empty)
                    return false;
                const result = getParentListItem_1.default(state);
                if (!result)
                    return false;
                const [li, pos] = result;
                const $pos = state.doc.resolve(pos + li.nodeSize);
                if (!$pos.nodeAfter ||
                    !["list_item", "checkbox_item"].includes($pos.nodeAfter.type.name)) {
                    console.log("Node after not a list item");
                    return false;
                }
                const { tr } = state;
                const newPos = pos + li.nodeSize + $pos.nodeAfter.nodeSize;
                dispatch(tr
                    .insert(newPos, li)
                    .setSelection(prosemirror_state_1.TextSelection.near(tr.doc.resolve(newPos)))
                    .delete(pos, pos + li.nodeSize));
                return true;
            },
            Backspace: (state, dispatch) => {
                var _a, _b;
                const { tr, selection, schema } = state;
                const parentList = prosemirror_utils_1.findParentNode((node) => isList_1.default(node, schema))(selection);
                const parentParagraph = prosemirror_utils_1.findParentNode((node) => node.type.name === 'paragraph')(selection);
                if (parentList) {
                    if (parentList.node.content.childCount === 1 &&
                        ((_b = (_a = parentList.node.content) === null || _a === void 0 ? void 0 : _a.firstChild) === null || _b === void 0 ? void 0 : _b.textContent) === '') {
                        const p = schema.nodes.paragraph.create();
                        dispatch(prosemirror_utils_1.replaceParentNodeOfType(parentList.node.type, p)(tr));
                        return true;
                    }
                    else if (parentParagraph &&
                        parentParagraph.node.textContent &&
                        selection.from === selection.to &&
                        parentParagraph.start === selection.from) {
                        const parentListItem = prosemirror_utils_1.findParentNode((node) => node.type.name === 'list_item' || node.type.name === 'checkbox_item')(selection);
                        if (parentListItem) {
                            return prosemirror_schema_list_1.liftListItem(parentListItem.node.type)(state, dispatch);
                        }
                    }
                }
            }
        };
    }
    toMarkdown(state, node) {
        state.renderContent(node);
    }
    parseMarkdown() {
        return { block: "list_item" };
    }
}
exports.default = ListItem;
//# sourceMappingURL=ListItem.js.map