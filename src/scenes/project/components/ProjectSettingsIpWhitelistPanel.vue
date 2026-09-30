<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  EgButton,
  EgIcon,
  EgIconButton,
  EgStreamer,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  IP_WHITELIST_DEMO_GROUPS,
  type ProjectSettingsIpWhitelistGroup,
} from '@/scenes/project/components/projectSettingsIpWhitelistDemo';
import styles from './ProjectSettingsIpWhitelistPanel.module.css';

const props = withDefaults(
  defineProps<{
    empty?: boolean;
  }>(),
  {
    empty: false,
  },
);

const { ui } = useAppI18n();

const groups = ref<ProjectSettingsIpWhitelistGroup[]>(
  IP_WHITELIST_DEMO_GROUPS.map((group) => ({ ...group, ips: [...group.ips] })),
);

watch(
  () => props.empty,
  (isEmpty) => {
    if (isEmpty) return;
    groups.value = IP_WHITELIST_DEMO_GROUPS.map((group) => ({
      ...group,
      ips: [...group.ips],
    }));
  },
);

function toggleGroup(groupId: string) {
  groups.value = groups.value.map((group) => {
    if (group.id === groupId) {
      return { ...group, expanded: !group.expanded };
    }
    return { ...group, expanded: false };
  });
}

function expandIconName(expanded: boolean) {
  return expanded ? 'eds-arrow-up-mini-ios' : 'eds-arrow-down-mini-ios';
}
</script>

<template>
  <div :class="styles.ipPanel">
    <div v-if="empty" :class="styles.emptyWrap">
      <div :class="styles.emptyCard">
        <div :class="styles.emptyDataBox">
          <EgIcon :class="styles.emptyIcon" name="eds-business-7" size="lg" />
          <div :class="styles.emptyTextBlock">
            <span :class="styles.emptyTitle">{{ ui('No data') }}</span>
            <span :class="styles.emptyDescription">
              {{ ui('API whitelist empty description') }}
            </span>
          </div>
        </div>
        <EgButton tone="decor" variant="solid" size="sm">
          {{ ui('Create Group') }}
        </EgButton>
      </div>
    </div>

    <template v-else>
      <div :class="styles.streamerWrap">
        <EgStreamer
          type="info"
          visual="brand"
          :text="ui('API whitelist empty description')"
        />
      </div>

      <div :class="styles.groupList">
        <div
          v-for="group in groups"
          :key="group.id"
          :class="styles.groupBlock"
        >
          <div
            :class="[
              styles.groupRow,
              group.expanded && styles.groupRowExpanded,
            ]"
            role="button"
            tabindex="0"
            :aria-expanded="group.expanded"
            @click="toggleGroup(group.id)"
            @keydown.enter.prevent="toggleGroup(group.id)"
            @keydown.space.prevent="toggleGroup(group.id)"
          >
            <div :class="styles.groupTitle">
              <EgIcon
                :class="styles.folderIcon"
                name="eds-floder-ip"
                size="sm"
              />
              <span :class="styles.groupName">{{ group.name }}</span>
            </div>
            <div :class="styles.groupActions" @click.stop>
              <EgButton
                tone="danger"
                variant="text"
                size="xs"
              >
                {{ ui('Delete') }}
              </EgButton>
              <EgButton
                tone="subtle"
                variant="text"
                size="xs"
              >
                {{ ui('Edit') }}
              </EgButton>
              <EgIconButton
                shape="rectangular"
                size="sm"
                :label="group.expanded ? ui('Collapse') : ui('Expand')"
                :aria-expanded="group.expanded"
                @click="toggleGroup(group.id)"
              >
                <EgIcon
                  :class="styles.iconStrokeLg"
                  :name="expandIconName(group.expanded)"
                  size="sm"
                />
              </EgIconButton>
            </div>
          </div>

          <div v-if="group.expanded" :class="styles.ipPanelBody">
            <span :class="styles.ipBid" aria-hidden="true" />
            <div :class="styles.ipList">
              <div
                v-for="ip in group.ips"
                :key="`${group.id}-${ip}`"
                :class="styles.ipRow"
              >
                <span :class="styles.ipValue">{{ ip }}</span>
                <EgIconButton
                  :class="styles.deleteIpButton"
                  shape="rectangular"
                  size="sm"
                  :label="ui('Delete')"
                >
                  <EgIcon
                    :class="[styles.iconStrokeLg, styles.deleteIpIcon]"
                    name="eds-recycle"
                    size="sm"
                  />
                </EgIconButton>
              </div>
              <div :class="styles.addIpRow">
                <EgButton tone="subtle" variant="outline" size="xs">
                  <template #icon>
                    <EgIcon :class="styles.iconStrokeLg" name="eds-add" fit />
                  </template>
                  {{ ui('Add IP') }}
                </EgButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
