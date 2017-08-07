import jQuery from 'jquery';
import popupStyle from './sass/popup.scss';

(function ($) {

'use strict';

const EXTENSION_ID = 'extension-id';
const EXTENSION_NAME = 'extension-name';
const SELECTOR_LISTS = '.extensions';

init();

/**
 * Initializes the extension.
 */
function init() {
  insert_extensions_to_lists();
  add_event_listeners();
}

/**
 * Add event listener.
 */
function add_event_listeners() {
  $(SELECTOR_LISTS).on('click', 'li', function (event) {
    switch_extension($(this).data(EXTENSION_ID));
    event.stopPropagation();
  });
}

/**
 * Insert extensions to the lists.
 */
function insert_extensions_to_lists() {
  chrome.management.getAll(function (apps) {
    let apps_enabled = [], apps_disabled = [];

    for (let i = 0; i < apps.length; i++) {
      let app = apps[i];

      if (app.type === 'extension' && app.name !== 'Extension Switch') {
        let $item = gen_list_item(app);

        if (app.enabled) {
          apps_enabled.push($item);
        } else {
          apps_disabled.push($item);
        }
      }
    }

    get_target_list(true).append(apps_enabled.sort(data_comparator(EXTENSION_NAME)));
    get_target_list(false).append(apps_disabled.sort(data_comparator(EXTENSION_NAME)));
  });
}

/**
 * Generates a list item for an extension.
 */
function gen_list_item(app) {
  let $el, name;

  name = (app.name.length > 30) ? app.name.slice(0, 30) + "..." :  app.name;

  $el = $('<li>');
  $el.data(EXTENSION_ID, app.id)
    .data(EXTENSION_NAME, app.name)
    .text(name);
  if (app.icons) {
    $el.css('background-image', `url(${app.icons[0].url})`);
  }

  return $el;
}

/**
 * Moves the extension li to the new list.
 */
function move_extension_in_list(app) {
  let $el, $list;

  $el = $('li', SELECTOR_LISTS).filter(function (i) {
    return $(this).data(EXTENSION_ID) === app.id;
  });

  $list = get_target_list(app.enabled);

  $el.detach()
    .appendTo($list);

  $list.find('li')
    .sort(data_comparator(EXTENSION_NAME))
    .detach()
    .appendTo($list);
}

/**
 * Switches on/off a chrome extension.
 */
function switch_extension(id) {
  chrome.management.get(id, function (app) {
    chrome.management.setEnabled(app.id, !app.enabled, function () {
      // Fetch the updated app.
      chrome.management.get(app.id, function (app2) {
        move_extension_in_list(app2);
      });
    });
  });
}

/**
 * Gets the enabled or disabled list.
 */
function get_target_list(enabled) {
  return enabled ? $('.extensions-enabled') : $('.extensions-disabled');
}

/**
 * Helper function: Generates a comparison function with data() for sort.
 */
function data_comparator(key) {
  return function (a, b) {
    let $a = $(a), $b = $(b);

    if ($a.data(key) < $b.data(key)) {
      return -1;
    } else if ($a.data(key) > $b.data(key)) {
      return 1;
    }
    return 0;
  };
}

})(jQuery);
