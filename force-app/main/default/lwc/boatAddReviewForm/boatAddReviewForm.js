import { api, LightningElement, wire } from 'lwc';
import BOATREVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord, generateRecordInputForCreate, getRecordCreateDefaults } from 'lightning/uiRecordApi';

const TOAST_TITLE = 'Review Created!';
const TOAST_SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    boatId;
    rating = 0;
    recordInput = { apiName: 'BoatReview__c', fields: {}};
    
    // Public Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() { }
    set recordId(value) {
      //sets boatId attribute
      this.setAttribute('boatId', value);
      //sets boatId assignment
      this.boatId = value;
    }

    get objectApiName(){
        console.log(`BOATREVIEW_OBJECT.objectApiName: ${BOATREVIEW_OBJECT.objectApiName}`);
        return BOATREVIEW_OBJECT.objectApiName;
    }

    @wire(getRecordCreateDefaults, { objectApiName: BOATREVIEW_OBJECT })
    //recordCreateDefaults;
    getRecordInput({ data, error }){
      if(data){
        const objectInfo = data.objectInfos[BOATREVIEW_OBJECT.objectApiname];
        const recordDefaults = data.record;
        console.log(`recordDefaults: ${JSON.stringify(recordDefaults)}`);
        const recordInput = generateRecordInputForCreate(recordDefaults, objectInfo);
        console.log(`recordInput: ${JSON.stringify(recordInput)}`);
        //this.recordInput = {...recordInput};
      }
      if(error){
        this.dispatchEvent(new ShowToastEvent({
          title: 'Error',
          message: error.body.message,
          variant: 'error'
        }));
      }
    }
    
    // Gets user rating input from stars component
    handleSubjectChange(event){
      this.recordInput.fields.Name = event.detail.value;
    }


    handleRatingChanged(event) { 
        this.rating = event.detail.rating;
    }
    
    handleCommentChange(event){
      this.recordInput.fields.Comment__c = event.detail.value;
    }

    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) {
        console.log(`submit event: ${JSON.stringify(event.detail)}`);
        console.log(`submit button clicked`);
        this.recordInput.fields.Boat__c = this.boatId;
        this.recordInput.fields.Rating__c = this.rating;
        console.log(`record to be created: ${JSON.stringify(this.recordInput)}`);

        createRecord(this.recordInput)
        .then(data =>{
          console.log(`record created: ${JSON.stringify(data)}`);
          this.handleSuccess();
        })
        .catch(error =>{
          console.error(error.body.message);
        });
     }
    
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
      // TODO: dispatch the custom event and show the success message
      this.dispatchEvent(new CustomEvent('reviewcreate'));  
      this.dispatchEvent(new ShowToastEvent({
          title: TOAST_TITLE,
          variant: TOAST_SUCCESS_VARIANT
      }));
      this.handleReset();
    }
    
    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    handleReset() { 
      this.rating = null;
      this.boatId = null;
    }
  }