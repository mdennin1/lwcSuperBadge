import { api, LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { subscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import { NavigationMixin } from 'lightning/navigation';

// Custom Labels Imports
// import labelDetails for Details
//import WelcomeLabel from '@salesforce/label/c.WelcomeNoteLabel';
import labelDetails from '@salesforce/label/c.Details';
// import labelReviews for Reviews
import labelReviews from '@salesforce/label/c.Reviews';
// import labelAddReview for Add_Review
import labelAddReview from '@salesforce/label/c.Add_Review';
// import labelFullDetails for Full_Details
import labelFullDetails from '@salesforce/label/c.Full_Details';
// import labelPleaseSelectABoat for Please_select_a_boat
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';

//
import labelTest from '@salesforce/label/c.test';
//


// Boat__c Schema Imports
import BOAT_OBJECT from '@salesforce/schema/Boat__c';
// import BOAT_ID_FIELD for the Boat Id
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
// import BOAT_NAME_FIELD for the boat Name
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import TYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__c';
import LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';

const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  boatId;
  wiredRecord;
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };
  subscription;

  @wire(MessageContext)
  messageContext;

  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
  getWiredRecord(response){
    this.wiredRecord = response;
  }

  get typeField(){
    return TYPE_FIELD.fieldApiName;
  }

  get lengthField(){
    return LENGTH_FIELD.fieldApiName;
  }

  get priceField(){
    return PRICE_FIELD.fieldApiName;
  }

  get descriptionField(){
    return DESCRIPTION_FIELD.fieldApiName;
  }

  get objectApiName(){
    return 'Boat__c'; //BOAT_OBJECT.objectApiName;
  }

  
  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() {
      return this.wiredRecord ?  'utility:anchor' : null;
   }
  
  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() { 
      return this.wiredRecord ? getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD) : null;
  }
  
  // Private
  subscription = null;
  
  // Subscribe to the message channel
  subscribeMC() {
    const subscriberOptions = { scope: APPLICATION_SCOPE };
      this.subscription = subscribe(this.messageContext, BOATMC, (message) => {
          this.boatId = message.recordId;
          console.log(`boatId: ${this.boatId}`);
      }, subscriberOptions);
      console.assert(this.subscription);
  }
  
  // Calls subscribeMC()
  connectedCallback() { 
      this.subscribeMC();
  }
  
  // Navigates to record page
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
          recordId: this.boatId,
          objectApiName: this.objectApiName,
          actionName: 'view',
      },
  })
   }
  
  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() { 
      this.template.querySelector('lightning-tab-set').activeTabeValue = 'Reviews';
      //refresh reviews data
  }
}
