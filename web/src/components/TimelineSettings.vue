<template>
    <div class="timeline-settings">

        <div class="available-values">
            <label>Available values: </label>
            <br/>

            <div class="header">
                <button type="button" v-on:click="_addAvailableValue()">Add</button>
            </div>

            <div class="table">
                <div class="header-row" style="grid-row: 1; grid-column: 1"></div>
                <div class="header-row" style="grid-row: 1; grid-column: 2">Display</div>
                <div class="header-row" style="grid-row: 1; grid-column: 3">Value</div>
                <div class="header-row" style="grid-row: 1; grid-column: 4">Color</div>

                <div class="remove-row" v-for="(entry, i) in appStore.availableValues" :style="{ 'grid-row': i + 2 }">
                    <button  type="button" v-on:click="_removeAvailableValue(i)">-</button>
                </div>
                <div class="display" v-for="(entry, i) in appStore.availableValues" :style="{ 'grid-row': i + 2 }">
                    <input type="text" :value="entry.display" v-on:input="_editAvailableValue(i, 'display', $event.target.value);"/>
                </div>
                <div class="value" v-for="(entry, i) in appStore.availableValues" :style="{ 'grid-row': i + 2 }">
                    <input type="text" :value="entry.value" v-on:input="_editAvailableValue(i, 'value', $event.target.value)"/>
                </div>
                <div class="color" v-for="(entry, i) in appStore.availableValues" :style="{ 'grid-row': i + 2 }">
                    <input type="text" :value="entry.color" v-on:input="_editAvailableValue(i, 'color', $event.target.value);"/>
                </div>
            </div>
        </div>
        
        <hr>

        <div class="item-names">
            <label>Item names: </label>
            <br/>

            <div class="header">
                <button type="button" v-on:click="_addItemName()">Add</button>
            </div>

            <div class="table">
                <div class="header-row" style="grid-row: 1; grid-column: 1"></div>
                <div class="header-row" style="grid-row: 1; grid-column: 2">Itemname</div>

                <div class="remove-row" v-for="(itemName, i) in appStore.itemNames" :style="{ 'grid-row': i + 2 }">
                    <button  type="button" v-on:click="_removeItemName(i)">-</button>
                </div>
                <div class="value" v-for="(itemName, i) in appStore.itemNames" :style="{ 'grid-row': i + 2 }">
                    <input type="text" :value="itemName" v-on:input="_editItemName(i, $event.target.value)"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";;
import { getModule } from 'vuex-module-decorators';

import { AppStore } from '../store/index';

let sharedStore : AppStore = getModule(AppStore);

@Component
export default class TimelineSettings extends Vue {

    appStore: AppStore = sharedStore;

    _addAvailableValue() : void {
        this.appStore.addNewAvailableValue();
    }

    _editAvailableValue(index: number, key: string, newValue: string): void {
        this.appStore.editAvailableValue({ index, key, newValue });
    }

    _removeAvailableValue(index: number) : void {
        this.appStore.removeAvailableValue(index);
    }

    _addItemName() : void {
        this.appStore.addNewItemName();
    }

    _editItemName(index: number, itemName: string): void {
        this.appStore.editItemName({ index, itemName });
    }

    _removeItemName(index: number) : void {
        this.appStore.removeItemName(index);
    }
}

</script>

<style scoped lang="less">

.available-values {}
.available-values .table {
    display: grid;
    grid-template-columns: min-content auto auto auto;
}
.available-values .header-row {
    font-weight: bold;
}
.available-values .remove-row {
    grid-column: 1;
    padding-right: 20px;
}
.available-values .display {
    grid-column: 2;
}
.available-values .value {
    grid-column: 3;
}
.available-values .color {
    grid-column: 4;
}

.item-names {}
.item-names .table {
    display: grid;
    grid-template-columns: min-content auto;
}
.item-names .header-row {
    font-weight: bold;
}
.item-names .remove-row {
    grid-column: 1;
    padding-right: 20px;
}
.item-names .value {
    grid-column: 2;
}

</style>
