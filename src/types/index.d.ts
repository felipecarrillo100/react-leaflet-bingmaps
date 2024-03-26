import * as L from "leaflet";

declare module "leaflet" {
    namespace TileLayer {
        interface BingLayer extends L.TileLayer {
            setBingKey(v: string): void;
            setImagerySet(v?: string): void;
        }
        interface BingLayerOptions  {
            imagerySet?: "AerialWithLabels" | "Road" | "Aerial";
            bingmapsKey: string;
        }
        function bingLayer(options?: L.TileLayer.BingLayerOptions): BingLayer;
    }
}
