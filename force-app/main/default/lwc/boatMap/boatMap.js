import { api, LightningElement, track, wire } from 'lwc';
import { MessageContext, subscribe, APPLICATION_SCOPE } from 'lightning/messageService';
import { getRecord } from 'lightning/uiRecordApi';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const LONGITUDE_FIELD = 'Boat__c.Geolocation__Longitude__s';
const LATITUDE_FIELD = 'Boat__c.Geolocation__Latitude__s';
const BOAT_FIELDS = [ LONGITUDE_FIELD, LATITUDE_FIELD ];

export default class BoatMap extends LightningElement {  
  //public
  @api error = undefined;
  @api mapMarkers = [];

  // private
  @track subscription = null;
  @track boatId;

  // Getter and Setter to allow for logic to run on recordId change
  // this getter must be public
  @api 
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute('boatId', value);
    this.boatId = value;
  }


  // Initialize messageContext for Message Service
  @wire(MessageContext)
  messageContext;

  // Getting record's location to construct map markers using recordId
  // Wire the getRecord method using ('$boatId')
  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
  wiredRecord({ error, data }) {
    // Error handling
    if (data) {
      this.error = undefined;
      const latitude = data.fields.Geolocation__Latitude__s.value;
      const longitude = data.fields.Geolocation__Longitude__s.value;
      this.updateMap(latitude, longitude);
    } else if (error) {
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }

  // Runs when component is connected, subscribes to BoatMC
  connectedCallback() {
    // recordId is populated on Record Pages, and this component
    // should not update when this component is on a record page.
    if (this.subscription || this.recordId) {
      return;
    }
    // Subscribe to the message channel to retrieve the recordID and assign it to boatId.
    const subscriberOptions = { scope: APPLICATION_SCOPE }
    this.subscription = subscribe( this.messageContext, BOATMC, (message) => {
        this.handleMessage(message);
    }, subscriberOptions);
  }

  // Creates the map markers array with the current boat's location for the map.
  updateMap(latitude, longitude) {
        this.mapMarkers = [];
        const location = { location: { Latitude: latitude, Longitude: longitude }}
        this.mapMarkers.push(location);
        console.log(`mapMarkers: ${JSON.stringify(this.mapMarkers)}`);
  }

  // Getter method for displaying the map component, or a helper method.
  get showMap() {
    return this.mapMarkers.length > 0;
  }

  handleMessage(message){
      console.log(`message received: ${JSON.stringify(message)}`);
      this.recordId = message.recordId;
  }

}