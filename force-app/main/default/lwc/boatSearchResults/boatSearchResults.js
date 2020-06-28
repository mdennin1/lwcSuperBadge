import { api, LightningElement, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { MessageContext, publish } from 'lightning/messageService';

/*export default class BoatSearchResults extends LightningElement {
    //@api boatIds;
    @api boats;
    boatIds;
    error;
    recordInputs = {};
    recordUi;
    selectedBoatId;
    wiredResponse

    @wire(getRecordUi, { recordIds: '$boatIds', layoutTypes: ['Full'], modes: ['Edit']})
    getRecordUi(response){
        this.wiredResponse = response;
        const data = response.data;
        const error = response.error;
        if(data){
            this.recordUi = data;
            console.log(`recordUi: ${JSON.stringify(data)}`);
            let records = [];
            Object.keys(data.records).forEach(recordId =>{
                records.push(data.records[recordId]);
            });
            console.log(`records: ${JSON.stringify(records)}`);
            const objectInfo = data.objectInfos.Boat__c;
            this.recordInputs = records.reduce((recordInputs, record) => {
                const recordId = record.id;
                console.assert(recordId);
                recordInputs[recordId] = generateRecordInputForUpdate(record, objectInfo);
                return recordInputs;
            }, {});
            console.assert(Object.values(this.recordInputs));
        }
        if(error){
            this.error = error;
        }
    }

    get boatRecords(){
        if(this.recordUi){
            const records = Object.values(this.recordUi.records);
        }
        return records;
    }

    get columns(){
        return [ { label: 'Name', fieldName: 'Name', editable: true },
                 { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true },
                 { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
                 { label: 'Description', fieldName: 'Description__c', editable: true },
            ];
    }

    renderedCallback(){
        this.boatIds = this.boats.map(boat => boat.Id);
        console.log(`boatIds: ${this.boatIds}`);
    }

    handleBoatSelected(event){
        this.selectedBoatId = event.detail.boatId;
    }

    updateRecords(event){
        console.log(`updateRecord() fired`);
        const draftValues = event.detail.draftValues;
        console.log(`draftValues: ${JSON.stringify(draftValues)}`);
        
        draftValues.forEach(draft =>{
            const recordId = draft.Id;
            const recordInput = {...this.recordInputs[recordId]};
            Object.keys(draft).forEach(key =>{
                recordInput.fields[key] = draft[key];
            });
            updateRecord(recordInput);
        });

        //return refreshApex(this.wiredResponse);
        this.dispatchEvent(new CustomEvent('refresh'));
    }

}*/

// ...
export default class BoatSearchResults extends LightningElement {
    selectedBoatId;
    columns = [ { label: 'Name', fieldName: 'Name', editable: true },
                { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true },
                { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
                { label: 'Description', fieldName: 'Description__c', editable: true },
            ];
    @api boatTypeId = '';
    boats;
    isLoading = false;
    
    // wired message context
    @wire(MessageContext)
    messageContext;

    @wire(getBoats, { boatTypeId : '$boatTypeId' })
    wiredBoats(result) {
        this.isLoading = true
        this.notifyLoading(this.isLoading);
        this.boats = result;
        console.log(`wiredBoats response: ${JSON.stringify(this.boats.data)}`);
        this.boats.data ? this.isLoading = true : '';
        this.notifyLoading(this.isLoading);
     }
    
    // public function that updates the existing boatTypeId property
    // uses notifyLoading
    searchBoats(boatTypeId) { 
        this.notifyLoading(this.isLoading);
        this.refresh();
    }
    
    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    refresh() {this.isLoading = true;
        this.notifyLoading(this.isLoading);
        refreshApex(this.boats);
        this.boats.data ? this.isLoading = true : this.isLoading = false;
        this.notifyLoading(this.isLoading);
     }
    
    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) { 
        console.log(`updateSelectedTile() fired`);
        this.selectedBoatId = event.detail.boatId;
        console.log(`selectedBoatId: ${this.selectedBoatId}`);
        this.sendMessageService(this.selectedBoatId);
    }
    
    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {
        const message = { recordId: boatId}
        console.log(`message to be sent via LMS: ${JSON.stringify(message)}`);
        publish(this.messageContext, BOATMC, message);
     }
    
    // This method must save the changes in the Boat Editor
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave() {
      const recordInputs = event.detail.draftValues.slice().map(draft => {
          const fields = {...draft}; //Object.assign({}, draft);
          return { fields };
      });
      const promises = recordInputs.map(recordInput => {
              //update boat record
      });
      Promise.all(promises)
          .then(() => {})
          .catch(error => {
              console.error(error.body.message);
          })
          .finally(() => {
              this.refresh();
          });
    }

    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
        isLoading ? this.dispatchEvent(new CustomEvent('doneloading')) : this.dispatchEvent(new CustomEvent('loading'));
     }
  }
  