'use strict';

load(Java.type("java.lang.System").getenv("OPENHAB_CONF")+'/automation/jsr223/jslib/JSRule.js');

var me = "TimedScheduler.js";
var LOG_ME = "TimedScheduler.js - ";

var DESCRIPTION = [
    "<StorageItemName(Type=String)>"
];

var DAY_KEYS = [ 'su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

JSRule({
	name: "TimedScheduler",
	triggers: [ 
		TimerTrigger("0/5 * * * * ?")
	],
	execute: function(module, input){
		for(var i = 0; i < DESCRIPTION.length; i++) {
            try {
                var storageItemName = DESCRIPTION[i];
                
                //
                var transferItem = getItem(storageItemName);    //#todo getItem -> catch 'org.eclipse.smarthome.core.items.ItemNotFoundException' ?
                var jsonAsString = transferItem.state;
                
                //
                var currentDate = new Date();
                var dayKey = DAY_KEYS[currentDate.getDay()];
                
                var minuteOfDay = (currentDate.getHours() * 60) + currentDate.getMinutes();
                var timeKey = Math.floor(minuteOfDay / 15);
                
                
                var json = JSON.parse(jsonAsString);
                
                //
                var itemNames = json['itemNames'];
                var availableValues = json['availableValues'];
                var dayValues = json['dayValues'];
                
                if( itemNames == null || itemNames.length <= 0 ||
                    availableValues == null || availableValues.length <= 0 ||
                    dayValues == null || dayValues.length <= 0)
                {
                    throw 'Invalid json (' + JSON.stringify(json) + ')';
                }
                
                //logInfo(JSON.stringify(itemNames));
                //logInfo(JSON.stringify(availableValues));
                //logInfo(JSON.stringify(dayValues));
                
                //
                var schedulerValues = null;
                for(var j = 0; j < dayValues.length; j++)
                {
                    if(dayValues[j]['dayKey'] == dayKey)
                    {
                        schedulerValues = dayValues[j]['valueIndices'];
                        continue;
                    }
                }

                if(schedulerValues == null)
                    throw 'dayKey not found in JSON (dayKey: "' + dayKey + '", JSON: "' + JSON.stringify(json) + '")';

                //
                if(schedulerValues[timeKey] >= availableValues.length)
                    throw 'schedulerValues[' + timeKey + '] has an invalid value (value: "' + schedulerValues[timeKey] + '", availableValues.length: "' + availableValues.length + '")';
                
                var newValue = availableValues[schedulerValues[timeKey]].value;

                //
                for(var j = 0; j < itemNames.length; j++) {
                    var itemName = itemNames[j];
                    var item = getItem(itemName);
                    
                    logInfo('Set ' + itemName + ' to ' + newValue);
                    sendCommand(item, newValue);
                }
			} catch (error) {
				logError(LOG_ME + 'Exception: ' + error);
				continue;
            }
		}
	}
});
