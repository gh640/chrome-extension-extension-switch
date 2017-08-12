import jQuery from 'jquery';
import optionsStyle from './sass/options.scss';

(function ($) {

'use strict';

const EXTENSION_NAME = 'extension-name';
const SELECTOR_LISTS = '.extensions';
const SELECTOR_CHECKS = ':checkbox';

init();

/**
 * Initializes the extension.
 */
function init() {

  // Insert list items with checkboxes which have default values.
  insert_extensions_to_lists();

  // Add event handlers.
  add_checkbox_event_handler();
  make_lines_clickable();
}

/**
 * Inserts extensions to the lists.
 */
function insert_extensions_to_lists() {
  chrome.management.getAll((apps) => {
    const ownId = chrome.runtime.id;
    let app_items;

    app_items = [];
    for (let i = 0; i < apps.length; i++) {
      const app = apps[i];

      if (app.type === 'extension' && app.id != ownId) {
        let $item = gen_list_item(app);

        app_items.push($item);
      }
    }

    app_items.sort(data_comparator(EXTENSION_NAME));

    $(SELECTOR_LISTS).append(app_items);

    restore_settings();
  });
}

/**
 * Adds event handler to checkboxes.
 */
function add_checkbox_event_handler() {
  $(SELECTOR_LISTS).on('change', SELECTOR_CHECKS, update_settings);
}

/**
 * Makes the whole line clickable.
 */
function make_lines_clickable() {
  $(SELECTOR_LISTS).on('click', 'li', (event) => {
    const $checkbox = $(event.target).find(SELECTOR_CHECKS).first();

    $checkbox.prop('checked', !$checkbox.prop('checked'));
    $checkbox.trigger('change');
  });
}

/**
 * Restores the excluded extensions.
 */
function restore_settings() {
  chrome.storage.sync.get('extensionsExcluded', (result) => {
    const ids = result.extensionsExcluded ? result.extensionsExcluded : [];
    const $checkboxes = $(SELECTOR_CHECKS, SELECTOR_LISTS);

    $checkboxes.each(function () {
      const $this = $(this);

      if (ids.indexOf($this.prop('id')) !== -1) {
        $this.prop('checked', true);
      }
    });
  });
}

/**
 * Saves the excluded extensions.
 */
function update_settings() {
  const $checkBoxesChecked = $(`${SELECTOR_CHECKS}:checked`, SELECTOR_LISTS);

  const ids = $checkBoxesChecked.map(function () {
    return $(this).prop('id');
  }).toArray();

  const setting = {
    extensionsExcluded: ids
  };

  chrome.storage.sync.set(setting, () => {});
}

/**
 * Generates a list item for an extension.
 */
function gen_list_item(app) {
  const name = (app.name.length > 40) ? app.name.slice(0, 40) + "..." :  app.name;

  const $item = $('<li>')
    .data(EXTENSION_NAME, app.name);

  const $checkbox = $('<input>')
    .prop('type', 'checkbox')
    .prop('id', app.id)
    .appendTo($item);

  const $label = $('<label>')
    .prop('for', app.id)
    .text(name)
    .appendTo($item);

  if (app.icons) {
    let icon = app.icons[app.icons.length - 1].url
    $label.css('background-image', `url(${icon})`);
  }

  return $item;
}

/**
 * Helper function: Generates a comparison function with data() for sort.
 */
function data_comparator(key) {
  return function (a, b) {
    const $a = $(a);
    const $b = $(b);

    if ($a.data(key) < $b.data(key)) {
      return -1;
    } else if ($a.data(key) > $b.data(key)) {
      return 1;
    }
    return 0;
  };
}

})(jQuery);
