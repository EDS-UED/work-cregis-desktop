<script setup lang="ts">
import { computed } from 'vue';
import {
  EgButton,
  EgConfirmPopover,
  EgIcon,
  POPOVER_PRESET_WIDTH_BASE,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import { riskControlAmlRecordDetailOverlayRegistry } from './riskControlAmlRecordDetailOverlayContext';
import styles from './RiskControlAmlRecordDetailExceptionHandling.module.css';
import triggerStyles from './riskControlAmlActionPopoverTrigger.module.css';

const props = withDefaults(
  defineProps<{
    /** 嵌入 RiskProfileTabAppend 时去掉独立 append 壳。 */
    embedded?: boolean;
    /** 指定处理人异常已处置完成。 */
    actionsDisabled?: boolean;
  }>(),
  { embedded: false, actionsDisabled: false },
);

const { ui } = useAppI18n();

const overlay = computed(() => riskControlAmlRecordDetailOverlayRegistry.value);
</script>

<template>
  <section
    :class="[embedded ? styles.hostEmbedded : detailChromeStyles.appendSection, styles.host]"
    data-aml-exception-handling
  >
    <div :class="styles.sectionBody">
      <div :class="styles.handlingIntro">
        <h3
          :class="[
            'typography-body-small-strong',
            detailChromeStyles.sectionTitle,
            styles.handlingSectionTitle,
          ]"
        >
          {{ ui('AML exception handling title') }}
        </h3>
        <p :class="styles.handlingLead">
          {{ ui('AML exception handling lead') }}
        </p>
      </div>

      <div :class="styles.actionCardRow">
        <div :class="styles.actionCard">
          <div :class="styles.actionCardHead">
            <span :class="styles.actionCardIconShell">
              <span :class="styles.actionCardIconGlyph">
                <EgIcon name="eds-aml-search-fill" fit fill-tone="primary" />
              </span>
            </span>
            <div :class="styles.actionCardCopy">
              <span :class="styles.actionTitle">
                {{ ui('AML exception action retry') }}
              </span>
              <span :class="styles.actionDesc">
                {{ ui('AML exception action retry desc') }}
              </span>
            </div>
          </div>
          <div :class="styles.actionCardAction">
            <span v-if="props.actionsDisabled" :class="triggerStyles.triggerHost">
              <EgButton variant="solid" tone="decor" size="md" disabled>
                {{ ui('AML exception action retry') }}
              </EgButton>
            </span>
            <EgConfirmPopover
              v-else
              :title="ui('Warm reminder')"
              :message="ui('AML record confirm retry')"
              :confirm-label="ui('Confirm')"
              :close-label="ui('Close')"
              placement="top"
              :width="POPOVER_PRESET_WIDTH_BASE"
              @confirm="overlay?.confirmRetry()"
            >
              <template #trigger="{ onClick, active }">
                <span
                  :class="[
                    triggerStyles.triggerHost,
                    active && triggerStyles.triggerDecorSolidPressed,
                  ]"
                >
                  <EgButton
                    variant="solid"
                    tone="decor"
                    size="md"
                    :aria-expanded="active"
                    @click="onClick"
                  >
                    {{ ui('AML exception action retry') }}
                  </EgButton>
                </span>
              </template>
            </EgConfirmPopover>
          </div>
        </div>

        <div :class="styles.actionCard">
          <div :class="styles.actionCardHead">
            <span :class="styles.actionCardIconShell">
              <span :class="styles.actionCardIconGlyph">
                <EgIcon name="eds-enable-fill" fit fill-tone="primary" />
              </span>
            </span>
            <div :class="styles.actionCardCopy">
              <span :class="styles.actionTitle">
                {{ ui('AML exception action pass') }}
              </span>
              <span :class="styles.actionDesc">
                {{ ui('AML exception action pass desc') }}
              </span>
            </div>
          </div>
          <div :class="styles.actionCardAction">
            <span v-if="props.actionsDisabled" :class="triggerStyles.triggerHost">
              <EgButton variant="solid" tone="decor" size="md" disabled>
                {{ ui('AML exception action pass') }}
              </EgButton>
            </span>
            <EgConfirmPopover
              v-else
              :title="ui('Warm reminder')"
              :message="ui('AML record confirm pass')"
              :confirm-label="ui('Confirm')"
              :close-label="ui('Close')"
              placement="top"
              :width="POPOVER_PRESET_WIDTH_BASE"
              @confirm="overlay?.confirmPass()"
            >
              <template #trigger="{ onClick, active }">
                <span
                  :class="[
                    triggerStyles.triggerHost,
                    active && triggerStyles.triggerDecorSolidPressed,
                  ]"
                >
                  <EgButton
                    variant="solid"
                    tone="decor"
                    size="md"
                    :aria-expanded="active"
                    @click="onClick"
                  >
                    {{ ui('AML exception action pass') }}
                  </EgButton>
                </span>
              </template>
            </EgConfirmPopover>
          </div>
        </div>

        <div :class="styles.actionCard">
          <div :class="styles.actionCardHead">
            <span
              :class="[styles.actionCardIconShell, styles.actionCardIconShellReject]"
            >
              <span :class="styles.actionCardIconGlyph">
                <EgIcon name="eds-close-circle-fill" fit fill-tone="primary" />
              </span>
            </span>
            <div :class="styles.actionCardCopy">
              <span :class="styles.actionTitle">
                {{ ui('AML exception action reject') }}
              </span>
              <span :class="styles.actionDesc">
                {{ ui('AML exception action reject desc') }}
              </span>
            </div>
          </div>
          <div :class="styles.actionCardAction">
            <span v-if="props.actionsDisabled" :class="triggerStyles.triggerHost">
              <EgButton variant="solid" tone="danger" size="md" disabled>
                {{ ui('AML exception action reject') }}
              </EgButton>
            </span>
            <EgConfirmPopover
              v-else
              :title="ui('Warm reminder')"
              :message="ui('AML record confirm reject')"
              :confirm-label="ui('Confirm')"
              :close-label="ui('Close')"
              placement="top"
              :width="POPOVER_PRESET_WIDTH_BASE"
              @confirm="overlay?.confirmReject()"
            >
              <template #trigger="{ onClick, active }">
                <span
                  :class="[
                    triggerStyles.triggerHost,
                    active && triggerStyles.triggerDangerSolidPressed,
                  ]"
                >
                  <EgButton
                    variant="solid"
                    tone="danger"
                    size="md"
                    :aria-expanded="active"
                    @click="onClick"
                  >
                    {{ ui('AML exception action reject') }}
                  </EgButton>
                </span>
              </template>
            </EgConfirmPopover>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
