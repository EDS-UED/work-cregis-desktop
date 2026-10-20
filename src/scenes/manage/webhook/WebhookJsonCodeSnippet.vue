<script setup lang="ts">
import { computed } from 'vue';
import { useAppI18n } from '@/composables/useAppI18n';
import { useCopyableValue } from '@/composables/useCopyableValue';
import DetailValueActionIcon from '@/scenes/tasks/shared/DetailValueActionIcon.vue';
import {
  splitWebhookJsonCodeLines,
  tokenizeWebhookJsonCodeLine,
  type WebhookJsonCodeTokenKind,
} from './tokenizeWebhookJsonCodeLine';
import styles from './WebhookJsonCodeSnippet.module.css';

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
    boundarySelector?: string;
  }>(),
  {
    language: 'JSON',
    boundarySelector: '.app-preview',
  },
);

const { ui } = useAppI18n();
const { copied, copyValue } = useCopyableValue();

const lines = computed(() =>
  splitWebhookJsonCodeLines(props.code).map((line, index) => ({
    key: index,
    line,
    tokens: tokenizeWebhookJsonCodeLine(line),
  })),
);

function tokenClass(kind: WebhookJsonCodeTokenKind): string {
  switch (kind) {
    case 'key':
      return styles.tokenKey;
    case 'string':
      return styles.tokenString;
    case 'number':
      return styles.tokenNumber;
    case 'boolean':
      return styles.tokenBoolean;
    case 'null':
      return styles.tokenNull;
    case 'punct':
      return styles.tokenPunct;
    default:
      return styles.tokenPlain;
  }
}

function copyIcon(copiedState: boolean) {
  return copiedState ? 'eds-enable-fill' : 'eds-copy';
}

async function onCopy(event?: MouseEvent) {
  const text = props.code.trim();
  if (!text) return;
  await copyValue(text, event);
}
</script>

<template>
  <div :class="styles.root" data-webhook-request-content-copy="">
    <div :class="styles.header">
      <span :class="styles.language">{{ language }}</span>
      <span :class="styles.copyHost" @click.stop>
        <span :class="[styles.copyAction, copied && styles.copyActionCopied]">
          <DetailValueActionIcon
            :label="ui('Copy')"
            :icon="copyIcon(copied)"
            :boundary-selector="boundarySelector"
            tooltip-align="end"
            @click="onCopy($event)"
          />
        </span>
      </span>
    </div>
    <div :class="styles.body">
      <code :class="styles.code">
        <span v-for="row in lines" :key="row.key" :class="styles.line">
          <span
            v-for="(token, tokenIndex) in row.tokens"
            :key="`${row.key}-${tokenIndex}`"
            :class="tokenClass(token.kind)"
          >{{ token.text }}</span>
        </span>
      </code>
    </div>
  </div>
</template>
