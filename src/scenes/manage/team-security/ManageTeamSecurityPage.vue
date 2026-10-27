<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  EgAvatar,
  EgDivider,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgIcon,
  EgIconProButton,
  EgLayout,
  EgListFieldOverflowText,
  EgToolBar,
  closeAllAnchoredTooltips,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useCopyableValue } from '@/composables/useCopyableValue';
import DetailValueActionIcon from '@/scenes/tasks/shared/DetailValueActionIcon.vue';
import ManageTeamSecurityChecklistRow from './ManageTeamSecurityChecklistRow.vue';
import {
  MANAGE_TEAM_SECURITY_CHECKLIST,
  MANAGE_TEAM_SECURITY_DEMO_TEAM_NAME,
  MANAGE_TEAM_SECURITY_DEMO_TEAM_NUMBER,
} from './manageTeamSecurityDemo';
import styles from './ManageTeamSecurityPage.module.css';

const { ui } = useAppI18n();
const { copied, copyValue } = useCopyableValue();

const enterpriseShowsUpgrade = ref(false);

const COPY_BOUNDARY = '.app-preview';

async function onCopyTeamNumber(event?: MouseEvent) {
  await copyValue(MANAGE_TEAM_SECURITY_DEMO_TEAM_NUMBER, event);
}

function onCopyTeamNumberKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  void onCopyTeamNumber();
}

function onMoreOpen() {
  closeAllAnchoredTooltips();
}

function onChecklistAction(itemId: string) {
  if (itemId === 'enterprise-verification' && !enterpriseShowsUpgrade.value) {
    enterpriseShowsUpgrade.value = true;
  }
}

const checklistItems = computed(() => {
  const base = MANAGE_TEAM_SECURITY_CHECKLIST[0];
  const enterprise = enterpriseShowsUpgrade.value
    ? { ...base, showUpgradeTag: true, actionLabelKey: 'Upgrade' }
    : base;
  return [enterprise, ...MANAGE_TEAM_SECURITY_CHECKLIST.slice(1)];
});
</script>

<template>
  <div :class="styles.page">
    <EgLayout type="empty" show-toolbar>
      <template #toolbar>
        <EgToolBar
          :title="ui('Team Security')"
          :show-operation="true"
          :show-divider="true"
        >
          <template #operation>
            <EgFlotation
              placement="bottom"
              align="end"
              flip
              boundary-selector=".app-preview"
              width-mode="adaptive"
              height-mode="adaptive"
              :show-add="false"
              :show-menu-divider="false"
              close-on-scroll
              @open="onMoreOpen"
            >
              <template #trigger="{ expanded }">
                <EgIconProButton
                  :label="ui('More')"
                  :active="expanded"
                  :aria-expanded="expanded"
                >
                  <EgIcon name="eds-option-horizontal" size="sm" />
                </EgIconProButton>
              </template>
              <template #content="{ close }">
                <EgFlotationMenu
                  panel-radius="radius-md"
                  width-mode="adaptive"
                  height-mode="adaptive"
                  :scrollable="false"
                  :show-add="false"
                  :show-divider="false"
                >
                  <EgFlotationMenuItem
                    box-type="symbol-text"
                    :label="ui('Edit Team Info')"
                    symbol-icon="eds-editor"
                    :show-tag="false"
                    @click="close()"
                  />
                  <EgFlotationMenuItem
                    box-type="symbol-text"
                    :label="ui('Dissolve Team')"
                    :show-tag="false"
                    danger
                    @click="close()"
                  >
                    <template #leading>
                      <EgIcon name="eds-recycle" size="sm" fit :class="styles.dissolveIcon" />
                    </template>
                  </EgFlotationMenuItem>
                </EgFlotationMenu>
              </template>
            </EgFlotation>
          </template>
        </EgToolBar>
      </template>

      <div :class="styles.scrollBody">
        <div class="desktopTokens" :class="styles.content">
          <header :class="styles.teamHeader">
            <EgAvatar size="2xl" :name="MANAGE_TEAM_SECURITY_DEMO_TEAM_NAME" />
            <div :class="styles.teamMeta">
              <p class="typography-title-small">{{ MANAGE_TEAM_SECURITY_DEMO_TEAM_NAME }}</p>
              <div
                :class="styles.teamNumberRow"
                role="button"
                tabindex="0"
                data-project-settings-copy=""
                @click="onCopyTeamNumber"
                @keydown="onCopyTeamNumberKeydown"
              >
                <span class="typography-body-small" :class="styles.teamNumberLabel">
                  {{ ui('Team Number') }}:
                </span>
                <EgListFieldOverflowText
                  :text="MANAGE_TEAM_SECURITY_DEMO_TEAM_NUMBER"
                  variant="secondary"
                  tabular
                />
                <span :class="styles.teamNumberCopy" @click.stop>
                  <DetailValueActionIcon
                    :label="ui('Copy')"
                    :icon="copied ? 'eds-enable-fill' : 'eds-copy'"
                    :boundary-selector="COPY_BOUNDARY"
                    tooltip-align="end"
                    @click="onCopyTeamNumber"
                  />
                </span>
              </div>
            </div>
          </header>

          <div :class="styles.sectionDivider">
            <EgDivider type="page" direction="horizontal" />
          </div>

          <section :class="styles.checklist">
            <template v-for="(item, index) in checklistItems" :key="item.id">
              <ManageTeamSecurityChecklistRow
                :icon="item.icon"
                :title-key="item.titleKey"
                :description-key="item.descriptionKey"
                :status="item.status"
                :action-label-key="item.actionLabelKey"
                :action-tone="item.actionTone"
                :show-upgrade-tag="item.showUpgradeTag"
                @action="onChecklistAction(item.id)"
              />
              <div
                v-if="index < checklistItems.length - 1"
                :class="styles.rowDivider"
              >
                <EgDivider type="page" direction="horizontal" />
              </div>
            </template>
          </section>
        </div>
      </div>
    </EgLayout>
  </div>
</template>
