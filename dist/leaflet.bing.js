"use strict";
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
/* eslint-disable  @typescript-eslint/no-explicit-any */
var Leaf = __importStar(require("leaflet"));
function fetchAPIMeta(url, onSuccess, onError) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var json = JSON.parse(this.responseText);
            if (typeof onSuccess === "function")
                onSuccess(json);
        }
        else {
            if (typeof onError === "function")
                onError({ status: 401 });
        }
    };
    request.onerror = function () {
        if (typeof onError === "function")
            onError({ status: 0 });
    };
    request.send();
}
var BingDefaultType = 'Aerial';
function extendLeafletWithBingLayer(L) {
    L.TileLayer.BingLayer = L.TileLayer.extend({
        options: {
            subdomains: [0, 1, 2, 3],
            imagerySet: BingDefaultType,
            attribution: 'Bing',
            culture: '',
            style: ''
        },
        initialize: function (options) {
            L.Util.setOptions(this, options);
            this._bingkey = options.bingmapsKey;
            this._url = null;
            this._providers = [];
            this.metaRequested = false;
        },
        tile2quad: function (x, y, z) {
            var quad = '';
            for (var i = z; i > 0; i--) {
                var digit = 0;
                var mask = 1 << (i - 1);
                if ((x & mask) !== 0)
                    digit += 1;
                if ((y & mask) !== 0)
                    digit += 2;
                quad = quad + digit;
            }
            return quad;
        },
        getTileUrl: function (tilePoint) {
            var zoom = this._getZoomForUrl();
            var subdomains = this.options.subdomains, s = this.options.subdomains[Math.abs((tilePoint.x + tilePoint.y) % subdomains.length)];
            return this._url.replace('{subdomain}', s)
                .replace('{quadkey}', this.tile2quad(tilePoint.x, tilePoint.y, zoom))
                .replace('{culture}', this.options.culture);
        },
        loadMetadata: function (reload) {
            var _this = this;
            if (!reload && this.metaRequested)
                return;
            this.metaRequested = true;
            var binmapsAPI = "https://dev.virtualearth.net/REST/v1/Imagery/Metadata/".concat(this.options.imagerySet, "?key=").concat(this._bingkey, "&include=ImageryProviders");
            fetchAPIMeta(binmapsAPI, function (meta) {
                if (meta.errorDetails) {
                    console.log(meta.errorDetails);
                    return;
                }
                _this.initMetadata(meta);
                if (reload)
                    _this.redraw();
            }, function () {
            });
        },
        initMetadata: function (meta) {
            var r = meta.resourceSets[0].resources[0];
            this.options.subdomains = r.imageUrlSubdomains;
            this._url = r.imageUrl;
            if (r.imageryProviders) {
                for (var i = 0; i < r.imageryProviders.length; i++) {
                    var p = r.imageryProviders[i];
                    for (var j = 0; j < p.coverageAreas.length; j++) {
                        var c = p.coverageAreas[j];
                        var coverage = { zoomMin: c.zoomMin, zoomMax: c.zoomMax, active: false };
                        coverage.bounds = new L.LatLngBounds(new L.LatLng(c.bbox[0] + 0.01, c.bbox[1] + 0.01), new L.LatLng(c.bbox[2] - 0.01, c.bbox[3] - 0.01));
                        coverage.attrib = p.attribution;
                        this._providers.push(coverage);
                    }
                }
            }
            this._update();
        },
        _update: function () {
            if (this._url === null || !this._map)
                return;
            this._update_attribution();
            L.TileLayer.prototype._update.apply(this, []);
        },
        _update_attribution: function () {
            var bounds = this._map.getBounds();
            var zoom = this._map.getZoom();
            for (var i = 0; i < this._providers.length; i++) {
                var p = this._providers[i];
                if ((zoom <= p.zoomMax && zoom >= p.zoomMin) &&
                    bounds.intersects(p.bounds)) {
                    if (!p.active && this._map.attributionControl)
                        this._map.attributionControl.addAttribution(p.attrib);
                    p.active = true;
                }
                else {
                    if (p.active && this._map.attributionControl)
                        this._map.attributionControl.removeAttribution(p.attrib);
                    p.active = false;
                }
            }
        },
        onAdd: function (map) {
            this.loadMetadata();
            L.TileLayer.prototype.onAdd.apply(this, [map]);
        },
        onRemove: function (map) {
            for (var i = 0; i < this._providers.length; i++) {
                var p = this._providers[i];
                if (p.active && this._map.attributionControl) {
                    this._map.attributionControl.removeAttribution(p.attrib);
                    p.active = false;
                }
            }
            L.TileLayer.prototype.onRemove.apply(this, [map]);
        },
        setImagerySet: function (imagerySet) {
            this.options.imagerySet = imagerySet ? imagerySet : BingDefaultType;
            this.setUrl(null);
            this.metaRequested = false;
            this.loadMetadata(true);
        },
        setBingKey: function (key) {
            this._bingkey = key;
            this.setUrl(null);
            this.metaRequested = false;
            this.loadMetadata(true);
        },
    });
    L.TileLayer.bingLayer = function (options) {
        return new L.TileLayer.BingLayer(options);
    };
    return L;
}
extendLeafletWithBingLayer(Leaf);
