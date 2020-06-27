public class BoatDataService{
    @AuraEnabled(cacheable=true)
    public static list<Boat__c> getBoats(String boatTypeId){
        system.debug('boatTypeId: '+boatTypeId);
        if(boatTypeId != ''){
            return [SELECT Id, Name, BoatType__c, Boat_Image__c, Contact__c, Description__c, Geolocation__Longitude__s, Geolocation__Latitude__s, length__c, picture__c, price__c, year_built__c, Contact__r.Name, BoatType__r.Name, Owner__c FROM Boat__c WHERE BoatType__c =: boatTypeId];
        }else{
            return [SELECT Id, Name, BoatType__c, Boat_Image__c, Contact__c, Description__c, Geolocation__Longitude__s, Geolocation__Latitude__s, length__c, picture__c, price__c, year_built__c, Contact__r.Name, BoatType__r.Name, Owner__c FROM Boat__c];
        }
    }

    @AuraEnabled(cacheable=true)
    public static list<Boat__c> getSimilarBoats(Id boatId, String similarBy){
        return [SELECT Id, Name, BoatType__c, Boat_Image__c, Contact__c, Description__c, Geolocation__c, length__c, picture__c, price__c, year_built__c FROM Boat__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<BoatType__c> getBoatTypes(){
        return [SELECT Id, Name FROM BoatType__c];
    }

    @AuraEnabled
    public static list<BoatReview__c> getAllReviews(){
        return [SELECT Id, Boat__c, Name, Comment__c, Rating__c FROM BoatReview__c];
    }

    @AuraEnabled(cacheable=true)
    public static String getBoatsByLocation(String boatTypeId){
        if(boatTypeId != null){
            //return  [SELECT Id, Name, BoatType__c, Boat_Image__c, Contact__c, Description__c, Geolocation__c, length__c, picture__c, price__c, year_built__c FROM Boat__c WHERE BoatType__c =: boatTypeId];
        }else{
            //return [SELECT Id, Name, BoatType__c, Boat_Image__c, Contact__c, Description__c, Geolocation__c, length__c, picture__c, price__c, year_built__c FROM Boat__c];
        }
        String strTest = '';
        return strTest;
    }
}