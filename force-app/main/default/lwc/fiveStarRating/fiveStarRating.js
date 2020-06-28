import { api, LightningElement, wire } from 'lwc';
//import fivestar static resource, call it fivestar
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import fivestar from '@salesforce/resourceUrl/fivestar';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'


// add constants here
const EDITABLE_CLASS = 'c-rating';
const ERROR_VARIANT = 'error';
const READ_ONLY_CLASS = 'readonly c-rating';
const TOAST_ERROR_TITLE = 'Error loading five-star';

export default class FiveStarRating extends LightningElement {
  //initialize public readOnly and value properties
  @api readOnly = false;
  @api value = null;

  editedValue;
  isRendered;

  //getter function that returns the correct class depending on if it is readonly
  get starClass() {
      return this.readOnly ? READ_ONLY_CLASS : EDITABLE_CLASS;
  }

  // Render callback to load the script once the component renders.
  renderedCallback() {
    if (this.isRendered) {
      return;
    }
    this.loadScript();
    this.isRendered = true;
    //
    //this.initializeRating();
    //
  }

  //Method to load the 3rd party script and initialize the rating.
  //call the initializeRating function after scripts are loaded
  //display a toast with error message if there is an error loading script
  loadScript() {
      PromiseRejectionEvent.all([
          loadStyle(this, fivestar +'/rating.css'),
          loadScript(this, fivestar+'/rating.js')
      ]).then(()=>{
          //do stuff
          console.log(`.css and .js files loaded baby`);
          this.initializeRating();
      }).catch(error=>{
          console.error(error.body.message);
          this.dispatchEvent(new ShowToastEvent({
              title: TOAST_ERROR_TITLE,
              message: error.body.message,
              variant: ERROR_VARIANT
          }));
      });
  }

  initializeRating() {
    let domEl = this.template.querySelector('ul');
    let maxRating = 5;
    let self = this;
    let callback = function (rating) {
      self.editedValue = rating;
      self.ratingChanged(rating);
    };
    this.ratingObj = window.rating(
      domEl,
      this.value,
      maxRating,
      callback,
      this.readOnly
    );
  }

  // Method to fire event called ratingchange with the following parameter:
  // {detail: { rating: CURRENT_RATING }}); when the user selects a rating
  ratingChanged(rating) {
      this.dispatchEvent(new CustomEvent('ratingchange', { detail: { rating }}));
  }
}