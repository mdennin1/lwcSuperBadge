import { api, LightningElement, wire } from 'lwc';
import BOATREVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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
        //event.preventDefault();
        const fields = event.detail.fields;
        fields.Rating__c = this.rating;
        fields.Boat__c = this.boatId;
        console.log(`fields: ${JSON.stringify(fields)}`);
        return this.template.querySelector('lightning-record-edit-form').submit(fields);
     }
    
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess(event) {
      console.log(`${JSON.stringify(event.detail)}`)
      console.log(`handleSuccess() fired`);
      // TODO: dispatch the custom event and show the success message
      this.dispatchEvent(new CustomEvent('createreview'));  
      this.dispatchEvent(new ShowToastEvent({
          title: TOAST_TITLE,
          variant: TOAST_SUCCESS_VARIANT
      }));
      this.handleReset(event);
    }
    
    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    handleReset(event) {
      console.log(`handleReset() fired: ${JSON.stringify(event.detail)}`);
      this.rating = 0;
      const inputFields = this.template.querySelectorAll(
          'lightning-input-field'
      );
      if (inputFields) {
          inputFields.forEach(field => {
              field.reset();
          });
      }
   }
}
   