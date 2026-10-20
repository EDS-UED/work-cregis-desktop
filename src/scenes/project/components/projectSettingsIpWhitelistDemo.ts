export type ProjectSettingsIpWhitelistGroup = {
  id: string;
  name: string;
  ips: string[];
  expanded: boolean;
};

/** QA: set `IP_WHITELIST_DEMO_EMPTY` to true for the empty-state screen. */
export const IP_WHITELIST_DEMO_EMPTY = false;

export const IP_WHITELIST_DEMO_GROUPS: ProjectSettingsIpWhitelistGroup[] = [
  { id: 'binance', name: 'Binance Whitelist', ips: [], expanded: false },
  { id: 'cadence', name: 'Cadence', ips: [], expanded: false },
  { id: 'cipher-core', name: 'Cipher Core', ips: [], expanded: false },
  {
    id: 'prism',
    name: 'Prism',
    ips: ['141.414.141.123', '0.0.0.0', '192.168.0.1', '192.168.0.6'],
    expanded: false,
  },
];
