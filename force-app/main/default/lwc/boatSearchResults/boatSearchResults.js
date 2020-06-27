import { api, LightningElement, wire } from 'lwc';
import { generateRecordInputForUpdate, getRecordUi, updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

export default class BoatSearchResults extends LightningElement {
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

        /*for(let x = 0; x < draftValues.length; x++){
            const draft = draftValues[x]
            const recordId = draft.Id;
            const recordInput = {...this.recordInputs[recordId]};
            const keys = Object.keys(draft);
            for(let z = 0; z < keys.length; z++){
                const key = keys[x];
                recordInput.fields[key] = draft[key];
            }
            console.log(`recordInput for update: ${JSON.stringify(recordInput)}`);
            await updateRecord(recordInput);
        }*/

        //return refreshApex(this.wiredResponse);
        this.dispatchEvent(new CustomEvent('refresh'));
    }

}