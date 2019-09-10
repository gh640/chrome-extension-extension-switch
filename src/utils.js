/**
 * Get all the target extentions.
 */
export async function get_extensions() {
  const KEY = 'extensionsExcluded';
  const result = await get_storage(KEY);
  const excluded_ids = result[KEY] || [];
  const own_id = chrome.runtime.id;

  return (await get_apps())
    .filter(is_target)
    .sort(compare_name);

  // Check if the app is a target.
  function is_target(app) {
    return (
      app.type === 'extension' &&
      !excluded_ids.includes(app.id) &&
      app.id !== own_id
    );
  }

  // Comparator which uses `.name` property.
  function compare_name(e1, e2) {
    if (e1.name < e2.name) {
      return -1;
    } else if (e1.name > e2.name) {
      return 1;
    }

    return 0;
  }
}

/**
 * Get the apps using the Chrome API.
 */
async function get_apps() {
  return new Promise(resolve => {
    chrome.management.getAll(apps => {
      resolve(apps);
    });
  });
}

/**
 * Get a storage value.
 */
async function get_storage(key) {
  return new Promise(resolve => {
    chrome.storage.sync.get(key, result => {
      resolve(result);
    });
  });
}

/**
 * Get an app info.
 */
async function get_app(id) {
  return new Promise(resolve => {
    chrome.management.get(id, app => {
      resolve(app);
    });
  });
}

/**
 * Switch the state of an app.
 */
export async function switch_app(app) {
  return new Promise(resolve => {
    chrome.management.setEnabled(app.id, !app.enabled, () => {
      resolve();
    });
  });
}
