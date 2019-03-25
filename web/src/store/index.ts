
import Vue from 'vue'
import Vuex from 'vuex'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import * as Types from './types'
import { Constants } from '../common';

Vue.use(Vuex)

export const store = new Vuex.Store({});

export interface Payload_EditAvailableValue {
    index: number;
    key: string;
    newValue: string;
}

export interface Payload_SetDayValue {
    dayKey: string;
    index: number;
    availableValueIndex: number;
}

export interface Payload_EditItemName {
    index: number;
    itemName: string;
}

@Module({ dynamic: true, store, name: 'AppStore' })
export class AppStore extends VuexModule {

    mode: Number = 0;

    availableValues: Types.IAvailableValue[] = [];
    itemNames: string[] = [];

    dayValues : Types.IDayValues[] = [];

    //mode

    @Mutation
    public setMode(mode : Number) : void {
        this.mode = mode;
    }

    //availableValues

    @Mutation
    public setAvailableValue(availableValues : Types.IAvailableValue[]) : void {
        this.availableValues = availableValues;
    }

    @Mutation
    public addNewAvailableValue() : void {
        this.availableValues.push({ display: '<display>', value: '<value>', color: '#<color>'});
    }

    @Mutation
    public editAvailableValue(payload: Payload_EditAvailableValue) : void {
        const newEntry = this.availableValues.slice(payload.index)[0];

        if(payload.key == 'display')
            newEntry.display = payload.newValue;
        else if(payload.key == 'value')
            newEntry.value = payload.newValue;
        else if(payload.key == 'color')
            newEntry.color = payload.newValue;
        else 
            console.error('Invalid key (' + payload.key + ')');

        Vue.set(this.availableValues, payload.index, newEntry);
    }

    @Mutation
    public removeAvailableValue(index: number) : void {
        this.availableValues.splice(index, 1);
        
        for(let i = 0; i < this.dayValues.length; i++)
        {
            for(let j = 0; j < Constants.SECTIONS_PER_DAY; j++)
            {
                let oldValueIndex = this.dayValues[i].valueIndices[j];

                if(oldValueIndex == index)
                {
                    Vue.set(this.dayValues[i].valueIndices, j, 0);
                }
                else if(this.dayValues[i].valueIndices[j] > index)
                {
                    Vue.set(this.dayValues[i].valueIndices, j, oldValueIndex - 1);
                }
            }
        }
    }

    get getAvailableValue_ValueByIndex() {
        return (index : number) : string => {
            if(index < this.availableValues.length)
                return this.availableValues[index].value;

            console.error('getAvailableValue_ValueByIndex - index not found (' + index + ')');
            return "";
        };
    }

    get getAvailableValue_ColorByIndex() {
        return (index : number) : string => {
            if(index < this.availableValues.length)
                return this.availableValues[index].color;

            console.error('getAvailableValue_ColorByIndex - index not found (' + index + ')');
            return "black";
        };
    }

    //itemNames

    @Mutation
    public setItemNames(itemNames : string[]) : void {
        this.itemNames = itemNames;
    }

    @Mutation
    public addNewItemName() : void {
        this.itemNames.push('<itemName>');
    }

    @Mutation
    public editItemName(payload: Payload_EditItemName) : void {
        Vue.set(this.itemNames, payload.index, payload.itemName);
    }

    @Mutation
    public removeItemName(index: number) : void {
        this.itemNames.splice(index, 1);
    }

    //dayValues

    @Mutation
    public setDayValues(dayValues: Types.IDayValues[]) : void {
        this.dayValues = dayValues;
    }

    @Mutation
    public setDayValue(payload : Payload_SetDayValue) : void {
        for(var i = 0; i < this.dayValues.length; i++) {
            if(this.dayValues[i].dayKey == payload.dayKey)
            {
                Vue.set(this.dayValues[i].valueIndices, payload.index, payload.availableValueIndex);
                return;
            }
        }

        throw 'setDayValue() - value not set (' + payload + ')';
    }

    get getDayValuesByDayKey() {
        return (dayKey : string) : Types.IDayValues => {
            for(var i = 0; i < this.dayValues.length; i++) {
                if(this.dayValues[i].dayKey == dayKey)
                    return this.dayValues[i];
            }

            throw 'getDayValuesByDayKey() - dayKey not found (' + dayKey + ')';
        };
    }

    //persistence

    @Action
    public async saveState(saveFunc : Function) {
        saveFunc(this.context.state);   //#TODO error handling
    }

    @Action
    public async loadState(loadFunc : Function) {
        var json = await loadFunc();

        //
        let mode : Number = typeof json.mode == 'number' ? json.mode : 0;
        let availableValues : Types.IAvailableValue[] = json.availableValues instanceof Array ? json.availableValues : [];
        let dayValues : Types.IDayValues[] = json.dayValues instanceof Array ? json.dayValues : [];
        let itemNames : string[] = json.itemNames instanceof Array ? json.itemNames : [];

        //
        for(let i = 0; i < Constants.LINE_INFOS.length; i++) {

            var lineInfo = Constants.LINE_INFOS[i];

            var found : boolean = false;
            for(let j = 0; j < dayValues.length; j++) {
                if(dayValues[j].dayKey == lineInfo.dayKey) {
                    found = true;
                    break;
                }
            }

            if(!found)
            {
                let defaultDayValues : Types.IDayValues = { dayKey : lineInfo.dayKey, valueIndices: [] };
                for(let j = 0; j < Constants.SECTIONS_PER_DAY; j++)
                    defaultDayValues.valueIndices.push(0);

                dayValues[i] = defaultDayValues;
            }
        }

        //
        this.setMode(mode);
        this.setAvailableValue(availableValues);
        this.setDayValues(dayValues);
        this.setItemNames(itemNames);
    }
}
