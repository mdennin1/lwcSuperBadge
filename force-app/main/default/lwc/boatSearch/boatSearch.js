 // imports
 import { LightningElement, wire } from 'lwc';
 import { NavigationMixin } from 'lightning/navigation';

 export default class BoatSearch extends NavigationMixin(LightningElement) {
    boatTypeId;
    isLoading = false;

    // Handles loading event
    handleLoading() { 
        this.isLoading = true;
    }
    
    // Handles done loading event
    handleDoneLoading() { 
        this.isLoading = false;
    }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) {
        this.boatTypeId = event.detail.boatTypeId;
        const searchResultsCmp = this.template.querySelector('c-boat-search-results');
        searchResultsCmp ? searchResultsCmp.searchBoats(this.boatTypeId) : '';
    }
    
    createNewBoat() { 
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            },
        });
    }

  }
  