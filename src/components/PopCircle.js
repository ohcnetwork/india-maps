import React, { useState, useEffect } from "react";
import { Marker } from "react-leaflet";

export default class PopCircle extends Marker {
  componentDidMount() {
    // Call the Marker class componentDidMount (to make sure everything behaves as normal)
    super.componentDidMount();

    // Access the marker element and open the popup.
    this.leafletElement.openPopup();
  }
}
