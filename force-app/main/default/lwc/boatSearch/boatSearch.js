 // imports
 import { LightningElement, wire } from 'lwc';
 import { NavigationMixin } from 'lightning/navigation';
 import getBoats from '@salesforce/apex/BoatDataService.getBoats';
 import { refreshApex } from '@salesforce/apex';

 export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
    boatTypeId;
    boats = [];
    error;
    wiredResponse;

    get boatIds(){
        return this.boats.map(boat => boat.Id);
    }

    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wiredBoats(response){
        this.wiredResponse = response;
        const data = response.data;
        const error = response.error;
        if(data){
            this.boats = data;
            this.isLoading = false;
            this.handleDoneLoading();
        }
        if(error){
            this.error = error;
            console.error(error.body.message);
        }
    }

    connectedCallback(){
        this.handleLoading();
    }

    // Handles loading event
    handleLoading() { 
        console.log(`handleLoading() fired`);
        this.isLoading = true;
    }
    
    // Handles done loading event
    handleDoneLoading() { 
        console.log(`handleDoneLoading() fired`);
        this.isLoading = false;
    }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) {
        this.boatTypeId = event.detail.boatTypeId;
        console.log(`boatTypeId from search form: ${this.boatTypeId}`);
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
    
    refresh(){
        console.log(`refresh() fired`);
        return refreshApex(this.wiredResponse);
    }

  }
  