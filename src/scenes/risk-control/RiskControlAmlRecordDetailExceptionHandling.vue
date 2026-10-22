<script setup lang="ts">
import { computed } from 'vue';
import { EgButton, EgIcon } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import { riskControlAmlRecordDetailOverlayRegistry } from './riskControlAmlRecordDetailOverlayContext';
import styles from './RiskControlAmlRecordDetailExceptionHandling.module.css';

const { ui } = useAppI18n();

const overlay = computed(() => riskControlAmlRecordDetailOverlayRegistry.value);
</script>

<template>
  <section
    :class="[detailChromeStyles.appendSection, styles.host]"
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
              <EgIcon
                name="eds-aml-search"
                size="md"
                fit
                fill-tone="primary"
              />
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
          <div :class="styles.actionCardFooter">
            <EgButton
              variant="solid"
              tone="decor"
              size="md"
              @click="overlay?.requestRetry()"
            >
              {{ ui('AML exception action retry') }}
            </EgButton>
          </div>
        </div>

        <div :class="styles.actionCard">
          <div :class="styles.actionCardHead">
            <span :class="styles.actionCardIconShell">
              <EgIcon
                name="eds-arrow-launch-circle"
                size="md"
                fit
                fill-tone="primary"
              />
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
          <div :class="styles.actionCardFooter">
            <EgButton
              variant="text"
              tone="subtle"
              size="md"
              @click="overlay?.requestPass()"
            >
              {{ ui('AML exception action pass') }}
            </EgButton>
          </div>
        </div>

        <div :class="styles.actionCard">
          <div :class="styles.actionCardHead">
            <span :class="styles.actionCardIconShell">
              <EgIcon
                name="eds-close-circle-fill"
                size="md"
                fit
                fill-tone="primary"
              />
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
          <div :class="styles.actionCardFooter">
            <EgButton
              variant="text"
              tone="danger"
              size="md"
              @click="overlay?.requestReject()"
            >
              {{ ui('AML exception action reject') }}
            </EgButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
