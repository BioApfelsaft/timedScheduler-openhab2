<template>
    <div class="timeline">
        <div class="available-values">
            <div
                class="entry"
                v-for="(entry, i) in appStore.availableValues"
                v-bind:class="{ 'selected-available-value': selectedAvailableValueIndex == i }"
                v-on:click.left="_changeSelectedAvailableValue(i)"
            >
                <span class="lable">{{ entry.display }}</span>
                <span class="color" :style="{ 'background-color': entry.color }"></span>
            </div>
        </div>

        <div class="wrapper">
            <div class="lables">
                <div class="time-row"></div>
                <div class="value-row" v-for="(entry, i) in appStore.dayValues">
                    {{ _getLineInfoByDayKey(entry.dayKey).display }}
                </div>
            </div>
            <div class="values">
                <div class="time-row flex-row">
                    <div class="time-section" v-for="i in 24"> {{ i - 1 }} </div>
                </div>
                <div class="value-row flex-row" v-for="(entry, i) in appStore.dayValues">
                    <div
                        class="value-section"
                        v-for="(availableValueIndex, i) in entry.valueIndices"
                        v-on:mousedown.left="_sectionMouseDown(entry.dayKey, i)"
                        v-on:mouseup.left="_sectionMouseUp(entry.dayKey, i)"
                        v-on:mousemove="_sectionMouseMove(entry.dayKey, i)"
                        :style="{ 'background-color': appStore.getAvailableValue_ColorByIndex(availableValueIndex) }"
                    >
                        <div class="ruler-line" v-bind:class="{ 'low': i % 2 != 0, 'mid': i % 2 == 0, 'high': i % 4 == 0 }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import Notifications from "vue-notification";

import { AppStore } from "../store/index";
import { Constants, ILineInfo } from "../common";
import { IDayValues } from "../store/types";

Vue.use(Notifications);

let sharedStore: AppStore = getModule(AppStore);

@Component
export default class Timeline extends Vue {

    appStore: AppStore = sharedStore;

    sectionsPerDay: number = Constants.SECTIONS_PER_DAY;
    selectedAvailableValueIndex: number = 0;
    isDragging : boolean = false;

    _getLineInfoByDayKey(dayKey: string) : ILineInfo {
        return Constants.getLineInfoByDayKey(dayKey);
    }

    _changeSelectedAvailableValue(index: number) : void {
        this.selectedAvailableValueIndex = index;
    }

    _sectionMouseDown(dayKey: string, index : number) {
        this.isDragging = true;
        this.appStore.setDayValue({ dayKey, index, availableValueIndex: this.selectedAvailableValueIndex });
    }

    _sectionMouseUp() {
        this.isDragging = false;
    }

    _sectionMouseMove(dayKey: string, index : number) {
        if (this.isDragging)
            this.appStore.setDayValue({ dayKey, index, availableValueIndex: this.selectedAvailableValueIndex });
    }
}

</script>

<style scoped lang="less">
.daytime-linepicker {
    width: 100%;
    height: auto;
}

.available-values {
    margin: 8px 0px;
}
.available-values .entry {
    display: inline-block;
    margin-right: 8px;
    padding: 4px;
}
.available-values .lable {
    padding-right: 8px;
}
.available-values .color {
    display: inline-block;
    width: 10px;
    height: 10px;
}
.selected-available-value {
    background-color: lightgreen;
}

.wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: stretch;
    align-items: flex-start;
}

.lables { flex-grow: 0; }
.values { flex-grow: 1; }

.flex-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: stretch;
    align-items: flex-start;
}

.time-row {
    height: 30px;
    line-height: 30px;
}
.time-section {
    width: calc(100% / 24);
    vertical-align: bottom;
}

.value-row {
    height: 50px;
    line-height: 50px;
}
.value-section {
    width: calc(100% / 96);
    height: 100%;

    position: relative;
}

.ruler-line {
    position: absolute;
    bottom: 0px;
    left: -0.5px;

    width: 1px;

    background-color: #333333;
}
.ruler-line.low {
    height: 20%;
}
.ruler-line.mid {
    height: 35%;
}
.ruler-line.high {
    height: 50%;
}

</style>
