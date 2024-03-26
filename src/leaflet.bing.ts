/* eslint-disable  @typescript-eslint/no-explicit-any */
import * as Leaf from "leaflet";

function fetchAPIMeta(url:string, onSuccess: (value:any)=>void, onError: (value:any)=>void) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            const json = JSON.parse(this.responseText);
            if (typeof onSuccess === "function") onSuccess(json);
        } else {
            if (typeof onError === "function") onError({status: 401})
        }
    };
    request.onerror = function () {
        if (typeof onError === "function") onError({status: 0});
    }
    request.send();
}

interface BingLayerOptions extends Leaf.TileLayerOptions {
    bingmapsKey: string;
}

const BingDefaultType = 'Aerial';
function extendLeafletWithBingLayer(L:any) {
    L.TileLayer.BingLayer = L.TileLayer.extend({
        options: {
            subdomains: [0, 1, 2, 3],
            imagerySet: BingDefaultType,
            attribution: 'Bing',
            culture: '',
            style: ''
        },

        initialize: function (options: BingLayerOptions) {
            L.Util.setOptions(this, options);
            this._bingkey = options.bingmapsKey;
            this._url = null;
            this._providers = [];
            this.metaRequested = false;
        },

        tile2quad: function (x:number, y:number, z:number) {
            let quad = '';
            for (let i = z; i > 0; i--) {
                let digit = 0;
                const mask = 1 << (i - 1);
                if ((x & mask) !== 0) digit += 1;
                if ((y & mask) !== 0) digit += 2;
                quad = quad + digit;
            }
            return quad;
        },

        getTileUrl: function (tilePoint: {x:number, y: number}) {
            const zoom = this._getZoomForUrl();
            const subdomains = this.options.subdomains,
                s = this.options.subdomains[Math.abs((tilePoint.x + tilePoint.y) % subdomains.length)];
            return this._url.replace('{subdomain}', s)
                .replace('{quadkey}', this.tile2quad(tilePoint.x, tilePoint.y, zoom))
                .replace('{culture}', this.options.culture);
        },

        loadMetadata: function (reload?: boolean) {
            if (!reload && this.metaRequested) return;
            this.metaRequested = true;
            const binmapsAPI =
                `https://dev.virtualearth.net/REST/v1/Imagery/Metadata/${this.options.imagerySet}?key=${this._bingkey}&include=ImageryProviders`;
            fetchAPIMeta(binmapsAPI, (meta: any)=> {
                if (meta.errorDetails) {
                    console.log(meta.errorDetails);
                    return;
                }
                this.initMetadata(meta);
                if (reload) this.redraw();
            }, ()=>{

            });
        },

        initMetadata: function (meta:any) {
            const r = meta.resourceSets[0].resources[0];
            this.options.subdomains = r.imageUrlSubdomains;
            this._url = r.imageUrl;
            if (r.imageryProviders) {
                for (let i = 0; i < r.imageryProviders.length; i++) {
                    const p = r.imageryProviders[i];
                    for (let j = 0; j < p.coverageAreas.length; j++) {
                        const c = p.coverageAreas[j];
                        const coverage = {zoomMin: c.zoomMin, zoomMax: c.zoomMax, active: false} as any;
                        coverage.bounds = new L.LatLngBounds(
                            new L.LatLng(c.bbox[0] + 0.01, c.bbox[1] + 0.01),
                            new L.LatLng(c.bbox[2] - 0.01, c.bbox[3] - 0.01)
                        );
                        coverage.attrib = p.attribution;
                        this._providers.push(coverage);
                    }
                }
            }
            this._update();
        },

        _update: function () {
            if (this._url === null || !this._map) return;
            this._update_attribution();
            L.TileLayer.prototype._update.apply(this, []);
        },

        _update_attribution: function () {
            const bounds = this._map.getBounds();
            const zoom = this._map.getZoom();
            for (let i = 0; i < this._providers.length; i++) {
                const p = this._providers[i];
                if ((zoom <= p.zoomMax && zoom >= p.zoomMin) &&
                    bounds.intersects(p.bounds)) {
                    if (!p.active && this._map.attributionControl)
                        this._map.attributionControl.addAttribution(p.attrib);
                    p.active = true;
                } else {
                    if (p.active && this._map.attributionControl)
                        this._map.attributionControl.removeAttribution(p.attrib);
                    p.active = false;
                }
            }
        },

        onAdd: function (map: any) {
            this.loadMetadata();
            L.TileLayer.prototype.onAdd.apply(this, [map]);
        },

        onRemove: function (map:any) {
            for (let i = 0; i < this._providers.length; i++) {
                const p = this._providers[i];
                if (p.active && this._map.attributionControl) {
                    this._map.attributionControl.removeAttribution(p.attrib);
                    p.active = false;
                }
            }
            L.TileLayer.prototype.onRemove.apply(this, [map]);
        },

        setImagerySet: function (imagerySet:string) {
            this.options.imagerySet = imagerySet ? imagerySet : BingDefaultType;
            this.setUrl(null);
            this.metaRequested = false;
            this.loadMetadata(true);
        },

        setBingKey: function (key:string) {
            this._bingkey = key;
            this.setUrl(null);
            this.metaRequested = false;
            this.loadMetadata(true);
        },
    });

    L.TileLayer.bingLayer = function (options: BingLayerOptions) {
        return new L.TileLayer.BingLayer(options);
    };

    return L;
}

extendLeafletWithBingLayer(Leaf);