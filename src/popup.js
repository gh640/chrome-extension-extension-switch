import Vue from 'vue/dist/vue.esm.js';
import popupStyle from './sass/popup.scss';
import { get_extensions, switch_app, item_style } from './utils.js';

(function () {

'use strict';

init();

/**
 * Initialize the extension.
 */
function init() {

  // `extension-item` Vue component.
  Vue.component('extension-item', {
    props: {
      extension: Object,
    },
    template: `<li
      :style="style"
      @click="onClick"
    >
      {{ name }}
    </li>`,
    computed: {
      name() {
        const MAX_SIZE = 30;
        let name = this.extension.name;
        return name.length > MAX_SIZE ? name.slice(0, MAX_SIZE) + '...' : name;
      },
      style() {
        return item_style(this.extension);
      },
    },
    methods: {
      onClick() {
        this.$emit('click', this.extension);
      },
    },
  });

  // Main app.
  const app = new Vue({
    el: '#app',
    data: {
      enabledExtensions: [],
      disabledExtensions: [],
      search: '',
    },
    created() {
      this.refresh();
    },
    methods: {
      // Refresh the lists.
      async refresh() {
        const extensions = await get_extensions(false);
        this.enabledExtensions = extensions.filter(e => e.enabled);
        this.disabledExtensions = extensions.filter(e => !e.enabled);
      },
      // Switch on/off a chrome extension.
      async switchExtension(extension) {
        await switch_app(extension);
        this.refresh();
      },
      // Check if an extension item should be displayed.
      showItem(extension) {
        if (this.search.length < 1) {
          return true;
        }

        let key = this.search.toLowerCase();
        let name = extension.name.toLowerCase();
        return name.match(key) !== null;
      },
    },
  });
}

})();
