import { api, LightningElement, wire } from 'lwc';
import { publish, MessageContext, subscribe } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class BoatTile extends LightningElement {
    @api boat;
    @api selectedBoatId;

    @wire(MessageContext)
    messageContext;
    
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() { 
        return `background-image: url(${this.boat.Picture__c})`;
    }
    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() { 
        return this.selectedBoatId === this.boat.Id ? TILE_WRAPPER_SELECTED_CLASS : TILE_WRAPPER_UNSELECTED_CLASS;
    }
    
    // Fires event with the Id of the boat that has been selected.
    selectBoat(event) { 
        console.log(`selectBoat() fired`);
        this.dispatchEvent(new CustomEvent('boatselect', { detail: { boatId: this.boat.Id }}));
        const message = { recordId: this.boat.Id };
        publish(this.messageContext, BOATMC, message);
    }

  }