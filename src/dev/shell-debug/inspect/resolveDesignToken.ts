const TOKEN_PREFIXES = [
  '--spacing-',
  '--radius-',
  '--text-',
  '--material-',
  '--event-',
  '--status-',
  '--eds-',
  '--icon-',
  '--avatar-',
  '--graphic-',
  '--weight-',
  '--box-',
  '--effect-',
  '--motion-',
  '--stroke-',
  '--scale-',
  '--blur-',
  '--depth-',
  '--corner-',
] as const;

const NON_TOKEN_COMMENT = '非 token';

let cachedRoot: Element | null = null;
let cachedTokenNames: string[] | null = null;
const computedTokenCache = new Map<string, string>();

function resolveTokenRoot(preview: Element): Element {
  return preview.querySelector('.desktopTokens') ?? preview;
}

export function listDesignTokenNames(preview: Element): string[] {
  const root = resolveTokenRoot(preview);
  if (cachedRoot === root && cachedTokenNames) {
    return cachedTokenNames;
  }

  const style = getComputedStyle(root);
  const names: string[] = [];
  for (let index = 0; index < style.length; index += 1) {
    const name = style[index];
    if (!name.startsWith('--')) continue;
    if (!TOKEN_PREFIXES.some((prefix) => name.startsWith(prefix))) continue;
    names.push(name);
  }

  cachedRoot = root;
  cachedTokenNames = names.sort((left, right) => left.localeCompare(right));
  computedTokenCache.clear();
  return cachedTokenNames;
}

function normalizeCssValue(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

type CssProbeProperty = 'width' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'fontFamily' | 'color';

/** 将 token 解析为 computed 值（支持 var 链），用于与 getComputedStyle 结果比对。 */
function getComputedTokenValue(
  preview: Element,
  tokenName: string,
  cssProperty: CssProbeProperty = 'width',
): string {
  const cacheKey = `${preview.isConnected ? 'live' : 'detached'}::${cssProperty}::${tokenName}`;
  const cached = computedTokenCache.get(cacheKey);
  if (cached) return cached;

  const root = resolveTokenRoot(preview);
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.top = '0';
  probe.style.left = '0';
  probe.style[cssProperty] = `var(${tokenName})`;
  root.appendChild(probe);
  const computed = normalizeCssValue(getComputedStyle(probe)[cssProperty]);
  root.removeChild(probe);
  computedTokenCache.set(cacheKey, computed);
  return computed;
}

/** 将 computed 值反查为 Desktop token 名（精确匹配 computed 值）。 */
export function resolveTokenNameForValue(
  preview: Element,
  rawValue: string,
  filter?: (name: string) => boolean,
  cssProperty: CssProbeProperty = 'width',
): string | null {
  const normalized = normalizeCssValue(rawValue);
  if (!normalized || normalized === 'none' || normalized === 'normal') {
    return null;
  }

  for (const name of listDesignTokenNames(preview)) {
    if (filter && !filter(name)) continue;
    const tokenValue = getComputedTokenValue(preview, name, cssProperty);
    if (tokenValue && tokenValue === normalized) {
      return name;
    }
  }
  return null;
}

export const INSPECT_TOKEN_FILTERS = {
  spacing: (name: string) => name.startsWith('--spacing-'),
  scale: (name: string) => name.startsWith('--scale-'),
  textColor: (name: string) => name.startsWith('--text-'),
  fontFamily: (name: string) => name.startsWith('--eds-family-'),
  typographySize: (name: string) => name.startsWith('--eds-') && name.endsWith('-size'),
  typographyWeight: (name: string) =>
    (name.startsWith('--eds-') && name.endsWith('-weight')) || name.startsWith('--weight-'),
  typographyLineHeight: (name: string) => name.startsWith('--eds-') && name.endsWith('-line-height'),
  material: (name: string) =>
    name.startsWith('--material-') || name.startsWith('--box-') || name.startsWith('--event-'),
  radius: (name: string) => name.startsWith('--radius-'),
};

export function formatCssDeclaration(
  preview: Element,
  property: string,
  rawValue: string,
  options: {
    filter?: (name: string) => boolean;
    cssProperty?: CssProbeProperty;
    comment?: string | null;
    allowLiteral?: boolean;
  } = {},
): string | null {
  const raw = normalizeCssValue(rawValue);
  if (!raw || raw === 'none' || raw === 'normal' || raw === 'auto') return null;

  const cssProperty = options.cssProperty ?? 'width';
  const token = resolveTokenNameForValue(preview, raw, options.filter, cssProperty);
  if (token) {
    const tokenVar = formatTokenVar(token);
    return options.comment
      ? `${property}: ${tokenVar}; /* ${options.comment} */`
      : `${property}: ${tokenVar};`;
  }

  if (options.allowLiteral) {
    return options.comment
      ? `${property}: ${raw}; /* ${options.comment} */`
      : `${property}: ${raw};`;
  }

  const comment = options.comment ?? NON_TOKEN_COMMENT;
  return `${property}: ${raw}; /* ${comment} */`;
}

export function formatTokenVar(token: string): string {
  return `var(${token})`;
}

export function formatValueWithToken(
  preview: Element,
  rawValue: string,
  filter?: (name: string) => boolean,
): { display: string; token: string | null } {
  const value = normalizeCssValue(rawValue);
  const token = resolveTokenNameForValue(preview, value, filter);
  if (!token) {
    return { display: value, token: null };
  }
  return { display: `${formatTokenVar(token)} · ${value}`, token };
}

export function invalidateDesignTokenCache() {
  cachedRoot = null;
  cachedTokenNames = null;
  computedTokenCache.clear();
}
