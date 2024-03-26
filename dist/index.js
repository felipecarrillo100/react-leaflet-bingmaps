"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingMapsLayer = void 0;
/* eslint-disable  @typescript-eslint/no-explicit-any */
var core_1 = require("@react-leaflet/core");
var L = __importStar(require("leaflet"));
require("./leaflet.bing");
var createWebGisLayer = function (props, context) {
    var instance = L.TileLayer.bingLayer(__assign({}, props));
    return { instance: instance, context: context };
};
var updateWebGisLayer = function (instance, props, prevProps) {
    if (prevProps.bingmapsKey !== props.bingmapsKey) {
        if (instance.setBingKey)
            instance.setBingKey(props.bingmapsKey);
    }
    if (prevProps.imagerySet !== props.imagerySet) {
        if (instance.setImagerySet)
            instance.setImagerySet(props.imagerySet);
    }
};
exports.BingMapsLayer = (0, core_1.createLayerComponent)(createWebGisLayer, updateWebGisLayer);
