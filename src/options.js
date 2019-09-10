import Vue from 'vue/dist/vue.esm.js';
import optionsStyle from './sass/options.scss';
import {
  get_extensions,
  get_excluded_extention_ids,
  switch_excluded_status,
  item_style,
} from './utils.js';

(function ($) {

'use strict';

init();

/**
 * Initializes the extension.
 */
function init() {

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
      // Check if the extension is excluded.
      isExcluded(extension) {
        return this.excludedIds.includes(extension.id);
      },
      // Provide `style` for an extension item.
      style(extension) {
        return item_style(extension);
      },
      // Switch `excluded` status of an extension.
      switchExcludedStatus(extension) {
        switch_excluded_status(extension.id, this.excludedIds);
      },
    },
  });

}

})();
