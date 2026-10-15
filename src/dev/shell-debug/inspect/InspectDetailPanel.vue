<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ElementInspectInfo } from './buildElementInspectInfo';
import { copyDevInspectText } from './copyDevInspectText';
import {
  resolveCodeLineMode,
  splitInspectCodeLines,
  tokenizeCodeLine,
  type InspectCodeToken,
} from './inspectCodeHighlight';

const props = defineProps<{
  info: ElementInspectInfo | null;
  embedded?: boolean;
}>();

const copyState = ref<'idle' | 'done' | 'error'>('idle');
const codeTab = ref<'layout' | 'style'>('layout');

const hasSelection = computed(() => props.info != null);

const propertyItems = computed(() => {
  if (!props.info) return [];
  if (props.info.edsComponent?.props.length) {
    return props.info.edsComponent.props;
  }
  return props.info.elementAttributes;
});

const showUsageSnippet = computed(() => {
  const snippet = props.info?.edsComponent?.usageSnippet?.trim();
  if (!snippet) return false;
  return !/^<Eg[A-Za-z]+\s*\/>$/.test(snippet);
});

const codeSections = computed(() => props.info?.codeSections ?? []);

const showCodeTabs = computed(
  () =>
    codeSections.value.length === 0
    && (props.info?.code.layout.length ?? 0) + (props.info?.code.style.length ?? 0) > 0,
);

const activeCodeItems = computed(() => {
  if (!props.info) return [];
  return codeTab.value === 'layout' ? props.info.code.layout : props.info.code.style;
});

function tokenClass(kind: InspectCodeToken['kind']): string {
  switch (kind) {
    case 'prop':
      return 'tokenProp';
    case 'keyword':
      return 'tokenKeyword';
    case 'function':
      return 'tokenFunction';
    case 'variable':
      return 'tokenVariable';
    case 'value':
      return 'tokenValue';
    case 'tag':
      return 'tokenTag';
    case 'attr':
      return 'tokenAttr';
    case 'string':
      return 'tokenString';
    case 'punct':
      return 'tokenPunct';
    default:
      return 'tokenPlain';
  }
}

function sectionLines(title: string, content: string) {
  const mode = resolveCodeLineMode(title);
  return splitInspectCodeLines(content).map((line, index) => ({
    number: index + 1,
    line,
    tokens: tokenizeCodeLine(line, mode),
  }));
}

async function onCopyLine(line: string) {
  if (!line.trim()) return;
  const ok = await copyDevInspectText(line);
  copyState.value = ok ? 'done' : 'error';
  window.setTimeout(() => {
    copyState.value = 'idle';
  }, 1400);
}
</script>

<template>
  <div
    v-if="hasSelection && info"
    :class="[$style.root, embedded && $style.rootEmbedded]"
    data-dev-inspect-copy
  >
    <div v-if="!embedded" :class="$style.header">
      <p :class="$style.meta">
        <span>{{ info.label }}</span>
      </p>
    </div>

    <section v-if="propertyItems.length > 0" :class="$style.section">
      <p :class="$style.sectionTitle">属性</p>
      <ul :class="$style.propRows">
        <li
          v-for="item in propertyItems"
          :key="`property-${item.label}`"
          :class="$style.propRow"
        >
          <button
            type="button"
            :class="$style.propButton"
            :disabled="!item.copyLine"
            @click="onCopyLine(item.copyLine)"
          >
            <span :class="$style.propLabel">{{ item.label }}</span>
            <span :class="$style.propValue">{{ item.value }}</span>
          </button>
        </li>
      </ul>
      <div v-if="showUsageSnippet && info.edsComponent" :class="$style.subBlock">
        <p :class="$style.sectionTitle">用法</p>
        <button
          type="button"
          :class="$style.usageSnippet"
          title="点击复制"
          @click="onCopyLine(info.edsComponent!.usageSnippet)"
        >
          {{ info.edsComponent!.usageSnippet }}
        </button>
      </div>
    </section>

    <section
      v-for="section in codeSections"
      :key="`code-section-${section.title}`"
      :class="$style.section"
    >
      <p :class="$style.sectionTitle">{{ section.title }}</p>
      <div :class="$style.codeBlockFrame">
        <ul :class="$style.codeLineRows">
          <li
            v-for="row in sectionLines(section.title, section.content)"
            :key="`${section.title}-${row.number}`"
            :class="$style.codeLineRow"
          >
            <button
              type="button"
              :class="$style.codeLineButton"
              title="点击复制"
              @click="onCopyLine(row.line)"
            >
              <span :class="$style.lineNumber">{{ row.number }}</span>
              <span :class="$style.lineContent">
                <span
                  v-for="(token, tokenIndex) in row.tokens"
                  :key="`${section.title}-${row.number}-${tokenIndex}`"
                  :class="$style[tokenClass(token.kind)]"
                >{{ token.text }}</span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </section>

    <section v-if="showCodeTabs" :class="$style.section">
      <div :class="$style.codeHeader">
        <p :class="$style.sectionTitle">代码</p>
        <div :class="$style.codeTabs">
          <button
            type="button"
            :class="[$style.codeTab, codeTab === 'layout' && $style.codeTabActive]"
            @click="codeTab = 'layout'"
          >
            布局
          </button>
          <button
            type="button"
            :class="[$style.codeTab, codeTab === 'style' && $style.codeTabActive]"
            @click="codeTab = 'style'"
          >
            样式
          </button>
        </div>
      </div>
      <ul v-if="activeCodeItems.length > 0" :class="$style.codeRows">
        <li v-for="item in activeCodeItems" :key="`${codeTab}-${item.label}`" :class="$style.codeRow">
          <button
            type="button"
            :class="$style.codeLine"
            title="点击复制"
            @click="onCopyLine(item.copyLine)"
          >
            {{ item.copyLine }}
          </button>
        </li>
      </ul>
      <p v-else :class="$style.codeEmpty">当前图层没有可映射的{{ codeTab === 'layout' ? '布局' : '样式' }} token。</p>
    </section>

    <p v-if="copyState === 'done'" :class="$style.copyToast">已复制</p>
  </div>

  <ul v-else :class="[$style.hint, embedded && $style.hintEntry]">
    <li :class="$style.hintEntryLine">点击元素查看 Dev 信息</li>
    <li :class="$style.hintEntryLine">再次点击退出 Dev 模式</li>
  </ul>
</template>

<style module>
.root {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  user-select: text;
}

.rootEmbedded {
  padding: 0;
}

.header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-025);
}

.meta {
  margin: 0;
  font-size: var(--eds-footnote-size);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-secondary);
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1-5);
}

.sectionTitle {
  margin: 0;
  font-size: var(--eds-footnote-size);
  font-weight: var(--eds-footnote-weight);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-primary);
}

.propRows {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: var(--spacing-5);
  row-gap: var(--spacing-025);
}

.codeRows,
.codeLineRows {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-025);
}

.propRow {
  display: contents;
  margin: 0;
}

.codeRow,
.codeLineRow {
  margin: 0;
}

.propButton,
.codeLineButton {
  margin: 0;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  composes: motion-ease is-hover from global;
}

.propButton {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: baseline;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-xs);
}

.codeLineButton {
  display: grid;
  width: 100%;
  grid-template-columns: var(--spacing-6) minmax(0, 1fr);
  gap: 0;
  padding: 0;
  border-radius: var(--radius-xs);
  align-items: stretch;
}

.propButton:disabled {
  cursor: default;
}

.propButton:hover,
.codeLine:hover,
.codeLineButton:hover,
.usageSnippet:hover {
  background: var(--event-hover);
}

.codeLineButton:hover {
  background: var(--event-hover);
}

.propLabel {
  white-space: nowrap;
  font-size: var(--eds-footnote-size);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-secondary);
}

.propValue {
  min-width: 0;
  font-family: var(--eds-family-mono, ui-monospace, monospace);
  font-size: var(--eds-footnote-size);
  font-weight: var(--eds-footnote-weight);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-primary);
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subBlock {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.usageSnippet {
  display: block;
  width: 100%;
  margin: 0;
  padding: var(--spacing-1-5) var(--spacing-2);
  border: var(--stroke-sm) solid var(--material-decor-subtle);
  border-radius: var(--radius-sm);
  background: var(--box-page-subtle, transparent);
  font-family: var(--eds-family-mono, ui-monospace, monospace);
  font-size: var(--eds-footnote-size);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-secondary);
  text-align: left;
  cursor: pointer;
  word-break: break-all;
  composes: motion-ease is-hover from global;
}

.codeBlockFrame {
  box-sizing: border-box;
  padding: var(--spacing-1);
  border: var(--stroke-xs) solid var(--stroke-outline-shallow);
  border-radius: var(--radius-xs);
  overflow: hidden;
}

.lineNumber {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  box-sizing: border-box;
  min-width: var(--spacing-6);
  padding: var(--spacing-05) var(--spacing-2);
  border-right: var(--stroke-xs) solid var(--stroke-outline-shallow);
  font-family: var(--eds-family-mono, ui-monospace, monospace);
  font-size: var(--eds-footnote-size);
  font-weight: var(--eds-footnote-weight);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-tertiary, var(--text-base-secondary));
  text-align: right;
  user-select: none;
}

.lineContent {
  flex: 1 1 auto;
  min-width: 0;
  padding: var(--spacing-05) var(--spacing-3);
  font-family: var(--eds-family-mono, ui-monospace, monospace);
  font-size: var(--eds-footnote-size);
  font-weight: var(--eds-footnote-weight);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-primary);
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
}

.tokenProp,
.tokenPunct,
.tokenPlain {
  color: var(--text-base-primary);
}

.tokenKeyword,
.tokenFunction,
.tokenValue,
.tokenString {
  color: var(--text-base-primary);
}

.tokenVariable {
  color: var(--text-brand-primary);
  text-decoration: underline dashed color-mix(in srgb, var(--text-brand-primary) 55%, transparent);
  text-underline-offset: 2px;
}

.tokenAttr {
  color: var(--text-base-primary);
}

.tokenTag {
  color: var(--text-base-primary);
}

.codeHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
}

.codeTabs {
  display: inline-flex;
  gap: var(--spacing-025);
}

.codeTab {
  margin: 0;
  padding: var(--spacing-025) var(--spacing-1-5);
  border: none;
  border-radius: var(--radius-xs);
  background: transparent;
  font-size: var(--eds-footnote-size);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-secondary);
  cursor: pointer;
}

.codeTabActive {
  background: var(--event-hover);
  color: var(--text-base-primary);
}

.codeLine {
  display: block;
  width: 100%;
  margin: 0;
  padding: var(--spacing-1) var(--spacing-3);
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  font-family: var(--eds-family-mono, ui-monospace, monospace);
  font-size: var(--eds-footnote-size);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-primary);
  text-align: left;
  cursor: pointer;
  word-break: break-all;
  composes: motion-ease is-hover from global;
}

.codeEmpty {
  margin: 0;
  font-size: var(--eds-footnote-size);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-tertiary, var(--text-base-secondary));
}

.copyToast {
  margin: 0;
  font-size: var(--eds-footnote-size);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-secondary);
  text-align: center;
}

.hint {
  margin: 0;
  font-size: var(--eds-footnote-size);
  line-height: var(--eds-footnote-line-height);
  color: var(--text-base-secondary);
}

.hintEntry {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-05);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--eds-body-medium-size);
  font-weight: var(--eds-body-medium-weight);
  line-height: var(--eds-body-medium-line-height);
  color: var(--text-base-primary);
}

.hintEntryLine {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-1);
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.hintEntryLine::before {
  content: '○';
  flex: 0 0 auto;
  color: var(--text-base-secondary);
}
</style>
