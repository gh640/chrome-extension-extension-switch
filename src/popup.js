import Vue from 'vue/dist/vue.esm.js';
import popupStyle from './sass/popup.scss';
import {
  get_extensions,
  switch_extension,
  item_style,
  get_name_display,
} from './utils.js';

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
    template: `<li :style="style" @click="onClick">
      {{ name }}
    </li>`,
    computed: {
      name() {
        const MAX_SIZE = 30;
        return get_name_display(this.extension, MAX_SIZE);
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
      extensions: [],
      search: '',
    },
    created() {
      this.refresh();
    },
    computed: {
      enabledExtensions() {
        return this.extensions.filter(e => e.enabled);
      },
      disabledExtensions() {
        return this.extensions.filter(e => !e.enabled);
      },
    },
    methods: {
      // Refresh the lists.
      async refresh() {
        this.extensions = await get_extensions(false);
      },
      // Switch on/off a chrome extension.
      async switchExtension(extension) {
        await switch_extension(extension);
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
