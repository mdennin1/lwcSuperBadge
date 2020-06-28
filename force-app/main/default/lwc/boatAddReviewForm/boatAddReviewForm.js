import { api, LightningElement } from 'lwc';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    boatId;
    rating;
    
    // Public Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() { }
    set recordId(value) {
      //sets boatId attribute
      this.setAttribute('boatId', value);
      //sets boatId assignment
      this.boatId = value;
    }
    
    // Gets user rating input from stars component
    handleRatingChanged(event) { 
        console.log(`rating event: ${JSON.stringify(event.detail)}`);
        this.rating = event.detail;
    }
    
    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) {
        let record = event.detail;
        //add record.Rating__c = this.rating;
        //add record.Boat__c = this.boatId;
     }
    
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
      // TODO: dispatch the custom event and show the success message
      this.handleReset();
    }
    
    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    handleReset() { }
  }