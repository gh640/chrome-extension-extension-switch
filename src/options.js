import Vue from 'vue/dist/vue.esm.js';
import optionsStyle from './sass/options.scss';
import {
  get_extensions,
  get_excluded_extention_ids,
  switch_excluded_status,
  item_style,
  get_name_display,
} from './utils.js';

(function ($) {

'use strict';

init();

/**
 * Initialize the extension.
 */
function init() {

  // Define a component for an extension `<li>` with a different name from
  // `extension-item` in `popup.js`.
  Vue.component('extension-row', {
    props: {
      extension: Object,
      excluded: Boolean,
    },
    template: `<li @click="onClick">
      <input type="checkbox" :checked="excluded">
      <span :style="style"> {{ name }} </span>
    </li>`,
    computed: {
      // Provide `style` for an extension item.
      style() {
        return item_style(this.extension);
      },
      name() {
        const MAX_SIZE = 50;
        return get_name_display(this.extension, MAX_SIZE);
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
      excludedIds: [],
    },
    created() {
      this.refresh();
    },
    methods: {
      // Refresh the list.
      async refresh() {
        this.extensions = await get_extensions(true);
        this.excludedIds = await get_excluded_extention_ids();
      },
      // Switch `excluded` status of an extension.
      switchExcludedStatus(extension) {
        switch_excluded_status(extension.id, this.excludedIds);
      },
    },
  });

}

})();
