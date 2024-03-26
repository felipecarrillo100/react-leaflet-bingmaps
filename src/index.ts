/* eslint-disable  @typescript-eslint/no-explicit-any */
import {createLayerComponent, LayerProps, LeafletContextInterface} from '@react-leaflet/core';
import * as L from "leaflet";
import "./leaflet.bing";


interface Props extends LayerProps  {
    bingmapsKey: string;
    imagerySet?: "AerialWithLabels" | "Road" | "Aerial";
}
const createWebGisLayer = (props:Props, context: LeafletContextInterface) => {
    const instance = L.TileLayer.bingLayer({...props})
    return { instance, context }
}

const updateWebGisLayer = (instance: L.TileLayer.BingLayer, props: Props, prevProps: Props) => {
    if (prevProps.bingmapsKey !== props.bingmapsKey) {
        if (instance.setBingKey) instance.setBingKey(props.bingmapsKey)
    }
    if (prevProps.imagerySet !== props.imagerySet) {
        if (instance.setImagerySet) instance.setImagerySet(props.imagerySet)
    }
}

export const BingMapsLayer = createLayerComponent(createWebGisLayer, updateWebGisLayer);
