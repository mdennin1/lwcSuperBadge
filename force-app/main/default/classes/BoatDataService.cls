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
        return [SELECT Id, Name, BoatType__c, Boat_Image__c, Contact__c, Description__c, Geolocation__Latitude__s, Geolocation__Longitude__s, length__c, picture__c, price__c, year_built__c FROM Boat__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<BoatType__c> getBoatTypes(){
        return [SELECT Id, Name FROM BoatType__c];
    }

    @AuraEnabled
    public static list<BoatReview__c> getAllReviews(String boatId){
        return [SELECT Id, Boat__c, Name, Comment__c, Rating__c, createdDate, CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedBy.CompanyName  FROM BoatReview__c WHERE Boat__c =: boatId ORDER BY createdDate desc];
    }

    @AuraEnabled(cacheable=true)
    public static String getBoatsByLocation(Decimal latitude, Decimal longitude, String boatTypeId){
        system.debug('latitude: '+latitude+', longitude: '+longitude+', boatTypeId: '+boatTypeId);
        List<Boat__c> boatsNearMe = new List<Boat__c>();
        boatsNearMe = [SELECT Id, Name, BoatType__c, Boat_Image__c, Contact__c, Description__c, Geolocation__Longitude__s, Geolocation__Latitude__s, length__c, picture__c, price__c, year_built__c, Contact__r.Name, BoatType__r.Name, Owner__c FROM Boat__c WHERE BoatType__c =: boatTypeId AND DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'mi') < 150000 LIMIT 10];
        system.debug('boatsNearMe returned: '+boatsNearMe);
        Integer listLength = boatsNearMe.size();
        String boatsResultString = '[';
        for(Integer x = 0; x < listLength; x++){
            Boat__c boat = boatsNearMe[x];
            if(x < listLength - 1){
                boatsResultString += '{"Id":"' + boat.Id + '","Name" : "' + boat.Name + '","Geolocation__Latitude__s":' + String.valueOf(boat.Geolocation__Latitude__s) + ',"Geolocation__Longitude__s":' + String.valueOf(boat.Geolocation__Longitude__s) + '},';
            }else{
                boatsResultString += '{"Id":"' + boat.Id + '","Name" : "' + boat.Name + '","Geolocation__Latitude__s":' + String.valueOf(boat.Geolocation__Latitude__s) + ',"Geolocation__Longitude__s":' + String.valueOf(boat.Geolocation__Longitude__s) + '}';
            }
        }
        boatsResultString += ']';
        system.debug(boatsResultString);
        return boatsResultString;
    }
}