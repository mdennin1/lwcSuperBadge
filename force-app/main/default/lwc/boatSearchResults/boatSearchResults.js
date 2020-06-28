import { api, LightningElement, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { MessageContext, publish } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BoatSearchResults extends LightningElement {
    boatTypeId = '';
    boats;
    columns = [ { label: 'Name', fieldName: 'Name', editable: true },
                { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true },
                { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
                { label: 'Description', fieldName: 'Description__c', editable: true },
            ];

    isLoading = false;
    selectedBoatId;
    
    // wired message context
    @wire(MessageContext)
    messageContext;

    @wire(getBoats, { boatTypeId : '$boatTypeId' })
    wiredBoats(result) {
        this.isLoading = true
        this.notifyLoading(this.isLoading);
        this.boats = result;
        this.boats.data ? this.isLoading = false : this.isLoading = true;
        this.notifyLoading(this.isLoading);
     }
    
    // public function that updates the existing boatTypeId property
    // uses notifyLoading
    @api 
    searchBoats(boatTypeId) { 
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = boatTypeId;
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }
    
    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    @api
    async refresh() {
        console.log(`refresh() fired`);
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        await refreshApex(this.boats);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
     }
    
    // this function must update selectedBoatId and call sendMessageService
    /*updateSelectedTile(boatId) { 
        console.log(`updateSelectedTile() fired`);
        this.selectedBoatId = boatId;
        console.log(`selectedBoatId: ${this.selectedBoatId}`);
        this.sendMessageService(this.selectedBoatId);
    }*/
    updateSelectedTile(event){
        const boatId = event.detail.boatId;
        this.selectedBoatId = boatId;
        this.sendMessageService(boatId);
    }
    
    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {
        const message = { recordId: boatId}
        publish(this.messageContext, BOATMC, message);
    }

    handleBoatSelect(event){
        this.updateSelectedTile(event);
    }
    
    // This method must save the changes in the Boat Editor
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave(event) {
      const recordInputs = event.detail.draftValues.slice().map(draft => {
          const fields = {...draft}; //Object.assign({}, draft);
          return { fields };
      });
      const promises = recordInputs.map(recordInput => {
              //update boat record
              updateRecord(recordInput);
      });
      Promise.all(promises)
          .then(() => {
              this.dispatchEvent(new ShowToastEvent({
                  title: 'Success',
                  message: 'Ship It!',
                  variant: 'success'
              }));
          })
          .catch(error => {
              console.error(error.body.message);
              this.dispatchEvent(new ShowToastEvent({
                  title: 'Error',
                  message: error.body.message,
                  variant: 'error',
              }))
          })
          .finally(() => {
              this.refresh();
          });
    }

    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
        isLoading ? this.dispatchEvent(new CustomEvent('loading')) : this.dispatchEvent(new CustomEvent('doneloading'));
     }
  }
  