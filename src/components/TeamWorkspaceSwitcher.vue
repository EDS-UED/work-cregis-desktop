<script setup lang="ts">
import {
  EgDivider,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgNavBarCorporation,
  EgTag,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  teamWorkspaceMark,
  useAppTeamWorkspace,
  type TeamWorkspaceOption,
} from '@/composables/appTeamWorkspace';
import styles from './TeamWorkspaceSwitcher.module.css';

const TEAM_SWITCH_MENU_WIDTH = 272;
const TEAM_LIST_MENU_WIDTH = 280;

const { ui } = useAppI18n();
const { options, activeTeam, corporationMark, switchTeam } = useAppTeamWorkspace(ui);

function onSelectTeam(teamId: string, closeRoot: () => void, closeSub?: () => void) {
  switchTeam(teamId);
  closeSub?.();
  closeRoot();
}

function teamRowLabel(team: TeamWorkspaceOption) {
  return team.name;
}
</script>

<template>
  <EgFlotation
    :class="styles.root"
    placement="bottom"
    align="start"
    width-mode="fixed"
    :width="TEAM_SWITCH_MENU_WIDTH"
    :show-add="false"
    :show-menu-divider="false"
    boundary-selector=".app-preview"
    flip
    close-on-scroll
  >
    <template #trigger="{ expanded }">
      <button
        type="button"
        :class="styles.corporationTrigger"
        :aria-label="ui('Switch Team')"
        :aria-expanded="expanded"
      >
        <EgNavBarCorporation
          :label="corporationMark"
          :title="activeTeam.name"
          :subtitle="ui(activeTeam.planLabelKey)"
        />
      </button>
    </template>

    <template #content="{ close: closeRoot }">
      <EgFlotationMenu
        :class="['desktopTokens', styles.menu]"
        data-no-corner-smoothing
        panel-radius="radius-md"
        width-mode="fixed"
        :width="TEAM_SWITCH_MENU_WIDTH"
        height-mode="adaptive"
        :scrollable="false"
        :show-add="false"
        :show-divider="false"
      >
        <header :class="styles.teamHeader">
          <span :class="styles.teamHeaderAvatar" aria-hidden="true">
            {{ teamWorkspaceMark(activeTeam.name) }}
          </span>
          <p :class="styles.teamHeaderName">{{ activeTeam.name }}</p>
          <EgTag family="system" system-type="stroke-subtle" size="sm">
            {{ ui(activeTeam.planLabelKey) }}
          </EgTag>
        </header>

        <EgDivider type="module" direction="horizontal" />

        <EgFlotation
          :class="styles.switchTeamFlotation"
          placement="right"
          align="start"
          trigger="click"
          width-mode="fixed"
          :width="TEAM_LIST_MENU_WIDTH"
          :show-add="false"
          :show-menu-divider="false"
          boundary-selector=".app-preview"
          flip
          close-on-scroll
        >
          <template #trigger="{ expanded: switchExpanded }">
            <div :class="styles.switchTeamRow" data-eds-trigger-metrics>
              <EgFlotationMenuItem
                host-tag="div"
                box-type="text"
                :label="ui('Switch Team')"
                :show-tag="false"
                show-cascader
                :focused="switchExpanded"
              />
            </div>
          </template>
          <template #content="{ close: closeSub }">
            <EgFlotationMenu
              :class="['desktopTokens', styles.teamListMenu]"
              data-no-corner-smoothing
              panel-flush
              panel-radius="radius-md"
              width-mode="fixed"
              :width="TEAM_LIST_MENU_WIDTH"
              height-mode="adaptive"
              :max-height="360"
              list-scroll
              :scrollable="true"
              :show-add="false"
              :show-divider="false"
            >
              <EgFlotationMenuItem
                v-for="team in options"
                :key="team.id"
                host-tag="button"
                box-type="text"
                :label="teamRowLabel(team)"
                :mode-tag="ui(team.planLabelKey)"
                :show-tag="false"
                :focused="team.id === activeTeam.id"
                @click="onSelectTeam(team.id, closeRoot, closeSub)"
              >
                <template #leading>
                  <span :class="styles.teamRowAvatar" aria-hidden="true">
                    {{ teamWorkspaceMark(team.name) }}
                  </span>
                </template>
              </EgFlotationMenuItem>
            </EgFlotationMenu>
          </template>
        </EgFlotation>

        <EgDivider type="module" direction="horizontal" />

        <EgFlotationMenuItem
          box-type="text"
          :label="ui('Web3 Wallet')"
          :show-tag="false"
          @click="closeRoot"
        />
        <EgFlotationMenuItem
          box-type="text"
          :label="ui('Create a Team')"
          :show-tag="false"
          @click="closeRoot"
        />
      </EgFlotationMenu>
    </template>
  </EgFlotation>
</template>
