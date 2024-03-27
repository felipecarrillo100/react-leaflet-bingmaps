# react-leaflet-bingmaps

This library is a React Typescript module that provides a BingMapsLayer for React-Leaflet.
The current Version of react-leaflet-bingmaps 1.x.x is compatible with React-Leaflet 2.x.x

## How to install:
npm install react-leaflet-bingmaps

## How to include
### Step 1: Import the component
```javascript
import {BingMapsLayer} from "react-leaflet-bingmaps";
```
## To use
Create A react-leaflet maps and add the layer
 
Example:
```javascript
  <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} >
      <LayersControl position='topright'>
          <BaseLayer checked name='Bing Maps Aerial'>
              <BingMapsLayer bingmapsKey={bing_key} imagerySet="Aerial"/>
          </BaseLayer>
          <BaseLayer name='Bing Maps Roads'>
              <BingMapsLayer bingmapsKey={bing_key} imagerySet="Road"/>
          </BaseLayer>
          <BaseLayer name='Bing Maps Hybrid'>
              <BingMapsLayer bingmapsKey={bing_key} imagerySet="AerialWithLabels"/>
          </BaseLayer>
          <BaseLayer  name="OpenStreeMap">
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
          </BaseLayer>
      </LayersControl>
  </MapContainer>
```  

A small example is provided here: https://codesandbox.io/p/sandbox/react-leaflet-bingmaps-l9mgdz?file=%2Fsrc%2FApp.jsx%3A11%2C11 

## Donations
Creating these libraries is my hobie. If you consider my work useful to you, please consider buying me a coffee. Your contribution keeps me motivated to created and maintain these useful libraries.


[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate/?business=7X3JAPNBQTXZG&amount=5&no_recurring=0&item_name=NPM%2FGitHub+libraries&currency_code=USD)

[![QR](https://raw.githubusercontent.com/felipecarrillo100/bankgreen/main/QR_Code_5Euro.png)](https://www.paypal.com/donate/?business=7X3JAPNBQTXZG&amount=5&no_recurring=0&item_name=NPM%2FGitHub+libraries&currency_code=USD)



