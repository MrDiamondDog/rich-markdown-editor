import { InputRule } from "prosemirror-inputrules";
import Node from "./Node";
export default class BulletList extends Node {
    get name(): string;
    get schema(): {
        content: string;
        group: string;
        parseDOM: {
            tag: string;
        }[];
        toDOM: () => (string | number)[];
    };
    commands({ type, schema }: {
        type: any;
        schema: any;
    }): () => (state: import("prosemirror-state").EditorState, dispatch: (tr: import("prosemirror-state").Transaction) => void) => boolean;
    keys({ type, schema }: {
        type: any;
        schema: any;
    }): {
        "Shift-Ctrl-8": (state: import("prosemirror-state").EditorState, dispatch: (tr: import("prosemirror-state").Transaction) => void) => boolean;
    };
    inputRules({ type, schema }: {
        type: any;
        schema: any;
    }): InputRule[];
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
    };
}
//# sourceMappingURL=BulletList.d.ts.map