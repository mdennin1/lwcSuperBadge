import { api, LightningElement, track, wire } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// imports
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement {
    @api boatTypeId;
    mapMarkers = [];
    isLoading = true;
    isRendered;
    latitude;
    longitude;
    
    // Add the wired method from the Apex Class
    // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
    // Handle the result and calls createMapMarkers
    @wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId'})
    wiredBoatsJSON({error, data}) {
        if(data){
            this.createMapMarkers(data);
        }
        if(error){
            const errorToast = new ShowToastEvent({
                title: ERROR_TITLE,
                message: error.body.message,
                variant: ERROR_VARIANT
            });
            this.dispatchEvent(errorToast);
        }
     }
    
    // Controls the isRendered property
    // Calls getLocationFromBrowser()
    renderedCallback() { 
        this.isRendered ? '' : this.getLocationFromBrowser();
    }
    
    // Gets the location from the Browser
    // position => {latitude and longitude}
    getLocationFromBrowser() { 
        navigator.geolocation.getCurrentPosition(position =>{
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
        });
        this.isRendered = true;
    }
    
    // Creates the map markers
    createMapMarkers(boatData) { 
        const records = JSON.parse(boatData);
        this.mapMarkers = records.map(record =>{
            return { location: { Latitude: record.Geolocation__Latitude__s, Longitude: record.Geolocation__Longitude__s }, title: record.Name };
        });
        this.mapMarkers.unshift({ location: { Latitude: this.latitude, Longitude: this.longitude}, title: LABEL_YOU_ARE_HERE, icon: ICON_STANDARD_USER });
        console.log(`mapMarkers: ${JSON.stringify(this.mapMarkers)}`);
        
        this.isLoading = false;
    }
}
