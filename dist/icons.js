"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnderlineIcon = exports.ChevronIcon = exports.RemoveIcon = exports.CircleIcon = void 0;
const react_1 = __importDefault(require("react"));
const outline_icons_1 = require("outline-icons");
const CircleIcon = (_a) => {
    var { color, size } = _a, rest = __rest(_a, ["color", "size"]);
    return (react_1.default.createElement(outline_icons_1.Icon, { color: color, size: size },
        react_1.default.createElement("circle", Object.assign({}, rest))));
};
exports.CircleIcon = CircleIcon;
const RemoveIcon = ({ color, size, }) => (react_1.default.createElement("div", { style: { marginTop: 4, marginLeft: 4 } },
    react_1.default.createElement(outline_icons_1.Icon, { color: color, size: size },
        react_1.default.createElement("svg", { width: "19px", height: "16px", viewBox: "0 0 19 16", version: "1.1", xmlns: "http://www.w3.org/2000/svg" },
            react_1.default.createElement("title", null, "icon"),
            react_1.default.createElement("g", { stroke: "none", strokeWidth: "1", fill: "none", fillRule: "evenodd" },
                react_1.default.createElement("g", { transform: "translate(-70.000000, -56.000000)", fill: "#FFFFFF" },
                    react_1.default.createElement("g", { transform: "translate(70.000000, 56.000000)" },
                        react_1.default.createElement("path", { d: "M15,0 C15.5128358,0 15.9355072,0.38604019 15.9932723,0.88337888 L16,1 L16,5.61483519 C16,5.69690861 15.9966323,5.77881993 15.9899356,5.8603674 C15.9966912,5.90581613 16,5.95252166 16,6 C16,6.1805703 15.9521405,6.3499624 15.8684145,6.4961832 C15.8658881,6.5018105 15.864041,6.5077569 15.8621752,6.513698 L15.7854301,6.7290072 L14,11.191 L14,15 C14,15.5128358 13.6139598,15.9355072 13.1166211,15.9932723 L13,16 L1,16 C0.44771525,16 0,15.5522847 0,15 C0,14.4871642 0.38604019,14.0644928 0.88337888,14.0067277 L1,14 L8,14 L8,11.194 L6.2145699,6.7290072 C6.1839016,6.6523364 6.1564596,6.5745518 6.1322835,6.495859 C6.0478595,6.3499624 6,6.1805703 6,6 C6,5.95252166 6.0033088,5.90581613 6.0097083,5.86010142 C6.0095959,5.85466244 6.0091437,5.84895569 6.0087078,5.84324723 L6,5.61483519 L6,1 C6,0.44771525 6.4477152,0 7,0 C7.5128358,0 7.9355072,0.38604019 7.9932723,0.88337888 L8,1 L8,5 L14,5 L14,1 C14,0.44771525 14.4477153,0 15,0 Z M12,12 L10,12 L10,14 L12,14 L12,12 Z M13.522,7 L8.477,7 L9.677,10 L12.322,10 L13.522,7 Z", fillRule: "nonzero" }),
                        react_1.default.createElement("path", { d: "M-0.593312439,6.65971037 L18.8153832,6.65971037 C19.2187912,6.65971037 19.545818,6.98673716 19.545818,7.39014515 C19.545818,7.79355314 19.2187912,8.12057994 18.8153832,8.12057994 L-0.593312439,8.12057994 C-0.99672043,8.12057994 -1.32374722,7.79355314 -1.32374722,7.39014515 C-1.32374722,6.98673716 -0.99672043,6.65971037 -0.593312439,6.65971037 Z", transform: "translate(9.111035, 7.390145) rotate(35.000000) translate(-9.111035, -7.390145) " }))))))));
exports.RemoveIcon = RemoveIcon;
const ChevronIcon = ({ fill, width = 10, }) => {
    return (react_1.default.createElement("svg", { fill: fill, width: width, x: "0px", y: "0px", viewBox: "0 0 1000 1000" },
        react_1.default.createElement("g", { transform: "translate(0.000000,511.000000) scale(0.100000,-0.100000)" },
            react_1.default.createElement("path", { d: "M2608.4,4961.2c-156.9-68.9-317.7-264.1-348.3-424.9c-61.2-344.5-134-260.3,2024.8-2419.1L6283,115.3L4284.9-1882.7C2122.3-4053,2195-3961.2,2263.9-4313.3c34.4-187.5,264.1-417.2,451.7-451.6c356-68.9,233.5-168.4,2713.9,2308.1C7446.7-435.8,7718.4-156.4,7737.5-26.3c65.1,356,164.6,237.3-2269.8,2683.2C4177.8,3950.7,3167.3,4930.6,3098.4,4961.2C2945.3,5026.3,2757.7,5026.3,2608.4,4961.2z" }))));
};
exports.ChevronIcon = ChevronIcon;
const UnderlineIcon = ({ color, width = 18 }) => {
    return (react_1.default.createElement("svg", { width: width, fill: color, viewBox: "0 0 380 380" },
        react_1.default.createElement("g", { transform: "translate(19.23086, 338.214052)" },
            react_1.default.createElement("path", { d: "M 139.8125 5.53125 C 119.550781 5.53125 101.957031 0.742188 87.03125 -8.828125 C 72.113281 -18.410156 60.691406 -31.488281 52.765625 -48.0625 C 44.847656 -64.644531 40.890625 -82.882812 40.890625 -102.78125 L 40.890625 -259.71875 C 40.890625 -266.71875 43.375 -272.613281 48.34375 -277.40625 C 53.320312 -282.195312 59.3125 -284.59375 66.3125 -284.59375 C 73.3125 -284.59375 79.207031 -282.195312 84 -277.40625 C 88.789062 -272.613281 91.1875 -266.71875 91.1875 -259.71875 L 91.1875 -108.3125 C 91.1875 -63.363281 111.445312 -40.890625 151.96875 -40.890625 C 170.382812 -40.890625 186.867188 -45.675781 201.421875 -55.25 C 215.972656 -64.832031 229.695312 -77.726562 242.59375 -93.9375 L 242.59375 -259.71875 C 242.59375 -266.71875 245.078125 -272.613281 250.046875 -277.40625 C 255.023438 -282.195312 261.015625 -284.59375 268.015625 -284.59375 C 275.015625 -284.59375 280.910156 -282.195312 285.703125 -277.40625 C 290.492188 -272.613281 292.890625 -266.71875 292.890625 -259.71875 L 292.890625 -22.65625 C 292.890625 -15.65625 290.492188 -9.664062 285.703125 -4.6875 C 280.910156 0.28125 275.015625 2.765625 268.015625 2.765625 C 261.015625 2.765625 255.023438 0.28125 250.046875 -4.6875 C 245.078125 -9.664062 242.59375 -15.65625 242.59375 -22.65625 L 242.59375 -45.3125 C 228.59375 -29.84375 213.488281 -17.5 197.28125 -8.28125 C 181.070312 0.925781 161.914062 5.53125 139.8125 5.53125 Z M 139.8125 5.53125" }))));
};
exports.UnderlineIcon = UnderlineIcon;
//# sourceMappingURL=icons.js.map