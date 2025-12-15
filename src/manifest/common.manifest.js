module.exports = {
  manifest_version: 3,

  homepage_url: 'https://saladict.crimx.com/',

  minimum_chrome_version: '55',

  name: '__MSG_extension_name__',
  short_name: '__MSG_extension_short_name__',
  description: '__MSG_extension_description__',

  default_locale: 'zh_CN',

  icons: {
    '16': 'assets/icon-16.png',
    '24': 'assets/icon-24.png',
    '48': 'assets/icon-48.png',
    '128': 'assets/icon-128.png'
  },

  action: {
    default_title: '__MSG_command_open_quick_search__',
    default_icon: {
      '16': 'assets/icon-16.png',
      '24': 'assets/icon-24.png',
      '48': 'assets/icon-48.png',
      '128': 'assets/icon-128.png'
    },
    default_popup: 'popup.html' // keep popup for safari compatibility
  },

  commands: {
    'toggle-active': {
      description: '__MSG_command_toggle_active__'
    },
    'toggle-instant': {
      description: '__MSG_command_toggle_instant__'
    },
    'search-clipboard': {
      description: '__MSG_command_search_clipboard__'
    },
    'open-pdf': {
      description: '__MSG_command_open_pdf__'
    },
    'open-quick-search': {
      description: '__MSG_command_open_quick_search__'
    },
    'open-youdao': {
      description: '__MSG_command_open_youdao__'
    },
    'open-google': {
      description: '__MSG_command_open_google__'
    },
    'open-caiyun': {
      description: '__MSG_command_open_caiyun__'
    },
    'next-history': {
      description: '__MSG_command_next_history__'
    },
    'prev-history': {
      description: '__MSG_command_prev_history__'
    },
    'next-profile': {
      description: '__MSG_command_next_profile__'
    },
    'prev-profile': {
      description: '__MSG_command_prev_profile__'
    },
    'profile-1': {
      description: '__MSG_command_profile_1__'
    },
    'profile-2': {
      description: '__MSG_command_profile_2__'
    },
    'profile-3': {
      description: '__MSG_command_profile_3__'
    },
    'profile-4': {
      description: '__MSG_command_profile_4__'
    },
    'profile-5': {
      description: '__MSG_command_profile_5__'
    },
    'add-notebook': {
      description: '__MSG_command_add_notebook__'
    }
  },

  // web_accessible_resources: [
  //   'assets/*',
  //   'audio-control.html',
  //   'quick-search.html'
  // ],

  web_accessible_resources: [
    {
      resources: [
        'assets/*',
        'audio-control.html',
        'quick-search.html',
        'options.html',
        'popup.html',
        'notebook.html',
        'word-editor.html',
        'history.html'
      ],
      matches: ['<all_urls>']
    }
  ],

  permissions: [
    '<all_urls>',
    'alarms',
    'contextMenus',
    'cookies',
    'notifications',
    'storage',
    'tabs',
    'unlimitedStorage',
    'scripting'
  ],

  host_permissions: ['<all_urls>'],

  optional_permissions: ['clipboardRead', 'clipboardWrite'],

  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'"
  }
}
