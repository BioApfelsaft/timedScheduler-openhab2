<template>
    <div id="app">
        <notifications group="toasts" />

        <div class="header">
            <button type="button" v-on:click="_loadStore()">Load</button>
            <button type="button" v-on:click="_saveStore()">Save</button>
            <button type="button" v-on:click="_resetStore()">Reset</button>
            <button type="button" v-on:click="displaySettings = !displaySettings">
                <span v-if="!displaySettings">show settings</span>
                <span v-if="displaySettings">hide settings</span>
            </button>
        </div>

        <TimelineSettings v-if="displaySettings"/>

        <Timeline/>
    </div>
</template>

<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import { getModule } from 'vuex-module-decorators';
import Notifications from 'vue-notification'
import axios from 'axios';

import TimelineSettings from "./components/TimelineSettings.vue";
import Timeline from "./components/Timeline.vue";
import { AppStore } from './store/index';

Vue.use(Notifications)

let sharedStore : AppStore = getModule(AppStore);

@Component({
    components: {
        TimelineSettings,
        Timeline
    }
})

export default class App extends Vue {

    appStore: AppStore = sharedStore;

    openHabRestEndpoint: string = '';
    storageItemName: string = '';
    getDataEndpoint: string = '';
    postDataEndpoint: string = '';

    displaySettings: boolean = true;

    mounted() {
        //
        this.openHabRestEndpoint = 'http://' + window.location.host + '/rest/items';
        this.getDataEndpoint = this.openHabRestEndpoint + '/' + this.storageItemName + '/state';
        this.postDataEndpoint = this.openHabRestEndpoint + '/' + this.storageItemName

        //
        var params = new URLSearchParams(window.location.search);

        var tmp = params.get('storageItemName');
        if(tmp == null)
            throw "storageItemName not set!";

        tmp = params.get('displaySettings');
        if(tmp != null)
            this.displaySettings = tmp === 'true' ? true : false

        this.storageItemName = tmp;

        this._loadStore();
    }
    
    _loadStore() : void {
        this.appStore.loadState(
            process.env.NODE_ENV == 'development'
            ? this._loadFromLocalStorage
            : this._loadFromOpenHabItem
        );

        this.$notify({
            group: 'toasts',
            type: 'toast-success',
            text: 'Loading done',
            duration: 3000
        });

        //#TODO validate and fix values
    }

    async _loadFromLocalStorage() : Promise<Object> {
        return localStorage.appStore ? JSON.parse(localStorage.appStore) : {};
    }

    async _loadFromOpenHabItem() : Promise<Object> {
        try {
            var requestUrl = this.openHabRestEndpoint + '/' + this.storageItemName + '/state';

            var response = await axios.get(requestUrl);

            if(typeof response.data !== 'object') {
                console.error('typeof response.data !== "object"');
                return {};
            }
            
            return response.data;
        } catch(e) {
            console.log(e);
        }

        return {};
    }

    _saveStore() : void {
        this.appStore.saveState(
            process.env.NODE_ENV == 'development'
            ? this._saveToLocalStorage
            : this._saveToOpenHabItem
        );

        this.$notify({
            group: 'toasts',
            type: 'toast-success',
            text: 'Saving done',
            duration: 3000
        });
    }

    async _saveToLocalStorage(json : Object) {
        localStorage.appStore = JSON.stringify(json);
    }

    async _saveToOpenHabItem(json: Object) {
        var requestUrl = this.openHabRestEndpoint + '/' + this.storageItemName;
        axios
            .post(
                requestUrl,
                JSON.stringify(json),
                { 
                    headers: {
                        "Accept": "application/json",
                        "content-type": "text/plain"
                    }
                })
            .then(response => {
                //#TODO view error in gui
            });
    }

    _resetStore() : void {
        this.appStore.loadState(function() {
            return {};
        });
    }
}

</script>

<style lang="less">

// #app {
//     font-family: "Avenir", Helvetica, Arial, sans-serif;
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//     text-align: center;
//     color: #2c3e50;
//     margin-top: 60px;
// }

#app {

}

body {
    font-family: 'Roboto', Helvetica, Arial, sans-serif
}

.toast-success {
    background-color: #68cd86;
}

.toast-warning {
    background-color: #ffb648;
}

.toast-error {
    background-color: #e54d42;
}

.toast-info {
    background-color: #02ccba;
}

</style>
