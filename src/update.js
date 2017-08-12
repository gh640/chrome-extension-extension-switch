/**
 * Generates notification message for installation/update.
 */
chrome.runtime.onInstalled.addListener((details) => {
  const appId = chrome.runtime.id;

  chrome.management.get(appId, (app) => {
    const icon = get_icon(app);
    let options;

    options = null;
    if (details.reason === 'install') {
      options = get_install_message_option(icon);
    } else if (details.reason === 'update') {
      options = get_update_message_option(details.previousVersion, icon);
    }

    if (options) {
      chrome.notifications.clear('extensionUpdated', (wasCleared) => {
        chrome.notifications.create('extensionUpdated', options);
      });
    }
  });
});

/**
 * Get the icon url of an app.
 */
function get_icon(app) {
  return app.icons[app.icons.length - 1].url;
}

/**
 * Generates options for installation notification message.
 */
function get_install_message_option(icon) {
  const options = {
    type: 'basic',
    iconUrl: icon,
    title: 'Extension Switch',
    message: 'Extension Switch has been successfully installed.'
  };

  return options;
}

/**
 * Generates options for update notification message.
 */
function get_update_message_option(previousVersion, icon) {
  const messages = {
    // Message for 1.2.0. The previous version needs to be specified.
    '1.1.0': {
      title: 'Extension Switch is updated',
      message: '',
      items: [
        {
          title: 'new',
          message:  'An option to exclude extensions is added.'
        }
      ]
    }
  };

  if (messages[previousVersion]) {
    const m = messages[previousVersion];
    return {
      type: 'list',
      iconUrl: icon,
      title: m.title,
      message: m.message,
      items: m.items
    };
  } else {
    return null;
  }
}
