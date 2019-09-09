import cash from 'cash-dom';
import popupStyle from './sass/popup.scss';

(function ($) {

'use strict';

const EXTENSION_ID = 'extension-id';
const EXTENSION_NAME = 'extension-name';
const SELECTOR_LISTS = '.extensions';
const SELECTOR_SEARCH = '#search';

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
  $(SELECTOR_LISTS).on('click', 'li', (event) => {
    switch_extension($(event.target).data(EXTENSION_ID));
    event.stopPropagation();
  });

  // Add incremental search function.
  $(SELECTOR_SEARCH).on('keyup', event => {
    const value =  event.target.value.toLowerCase();
    const $items = $(SELECTOR_LISTS).find('li');

    if (value) {
      $items.each(function (el, index) {
        if (!el.innerHTML.toLowerCase().match(value)) {
          $(el).addClass('hidden');
        } else {
          $(el).removeClass('hidden');
        }
      });
    } else {
      $items.each(function (el, index) {
        $(el).removeClass('hidden');
      });
    }
  });
}

/**
 * Insert extensions to the lists.
 */
function insert_extensions_to_lists() {
  chrome.management.getAll((apps) => {
    chrome.storage.sync.get('extensionsExcluded', (result) => {
      const ids = result.extensionsExcluded ? result.extensionsExcluded : [];
      const ownId = chrome.runtime.id;
      const apps_enabled = [];
      const apps_disabled = [];

      for (let i = 0; i < apps.length; i++) {
        const app = apps[i];

        if (app.type === 'extension' &&
          ids.indexOf(app.id) === -1 && app.id !== ownId) {
          const $item = gen_list_item(app);

          if (app.enabled) {
            apps_enabled.push($item);
          } else {
            apps_disabled.push($item);
          }
        }
      }

      if (apps_enabled.length) {
        get_target_list(true)
          .append(apps_enabled.sort(data_comparator(EXTENSION_NAME)));
      }
      if (apps_disabled.length) {
        get_target_list(false)
          .append(apps_disabled.sort(data_comparator(EXTENSION_NAME)));
      }
    });
  });
}

/**
 * Generates a list item for an extension.
 */
function gen_list_item(app) {
  const name = (app.name.length > 30) ? app.name.slice(0, 30) + "..." :  app.name;
  const $el = $('<li>');

  $el.data(EXTENSION_ID, app.id)
    .data(EXTENSION_NAME, app.name)
    .text(name);
  if (app.icons) {
    const icon = app.icons[app.icons.length - 1].url
    $el.css('background-image', `url(${icon})`);
  }

  return $el;
}

/**
 * Moves the extension li to the new list.
 */
function move_extension_in_list(app) {
  const $el = $(SELECTOR_LISTS).find('li');

  // The argument is different from one in jQuery.
  const $appLi = $el.filter(function (el) {
    return $(el).data(EXTENSION_ID) === app.id;
  });

  const $list = get_target_list(app.enabled);

  $appLi.appendTo($list);

  const $items = sort($list.find('li'), data_comparator(EXTENSION_NAME));
  $items.appendTo($list);
}

/**
 * Switches on/off a chrome extension.
 */
function switch_extension(id) {
  chrome.management.get(id, (app) => {
    chrome.management.setEnabled(app.id, !app.enabled, function () {

      // Fetch the updated app.
      chrome.management.get(app.id, (app_updated) => {
        move_extension_in_list(app_updated);

        // This notification is a little annoying...
        // const icon = app_updated.icons[app_updated.icons.length - 1].url;
        // const status = app_updated.enabled ? 'enabled' : 'disabled';
        // const options = {
        //   type: 'basic',
        //   iconUrl: icon,
        //   title: 'Extension is switched',
        //   message: `${app_updated.name} is ${status}`
        // };
        // chrome.notifications.clear('changed', (wasCleared) => {
        //   chrome.notifications.create('changed', options);
        // });
      });
    });
  });
}

/**
 * Gets the enabled or disabled list.
 */
function get_target_list(enabled) {
  const list = enabled ? $('.extensions-enabled') : $('.extensions-disabled');
  return list.first();
}

/**
 * Helper function: Sorts an items list.
 */
function sort($items, comparator) {
  return Array.prototype.sort.call($items, comparator);
}

/**
 * Helper function: Generates a comparison function with data() for sort.
 */
function data_comparator(key) {
  return (a, b) => {
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

})(cash);
