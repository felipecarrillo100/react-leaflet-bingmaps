/// <reference types="react" />
import { LayerProps } from '@react-leaflet/core';
import * as L from "leaflet";
import "./leaflet.bing";
interface Props extends LayerProps {
    bingmapsKey: string;
    imagerySet?: "AerialWithLabels" | "Road" | "Aerial";
}
export declare const BingMapsLayer: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<L.TileLayer.BingLayer>>;
export {};
