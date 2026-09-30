<script setup lang="ts">
import { ref } from 'vue';
import { EgAvatar, EgButton, EgLinkButton, EgSwitch } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  resolveNotificationDemoItems,
  NOTIFICATION_MEMBER_PREVIEW_LIMIT,
  type ProjectSettingsNotificationItem,
  type ProjectSettingsNotificationPreset,
} from '@/scenes/project/components/projectSettingsNotificationDemo';
import styles from './ProjectSettingsNotificationPanel.module.css';

const props = withDefaults(
  defineProps<{
    tabPreset?: ProjectSettingsNotificationPreset;
  }>(),
  {
    tabPreset: 'payment-engine',
  },
);

const { ui } = useAppI18n();

const items = ref<ProjectSettingsNotificationItem[]>(
  resolveNotificationDemoItems(props.tabPreset).map((item) => ({ ...item })),
);

const expandedMemberItemIds = ref<Record<string, boolean>>({});

function resolveAllMembers(item: ProjectSettingsNotificationItem) {
  return item.allMembers ?? item.members ?? [];
}

function overflowLabel(count: number) {
  return `${count}+`;
}

function hasMemberOverflow(item: ProjectSettingsNotificationItem) {
  return Boolean(item.overflowCount);
}

function isMembersExpanded(item: ProjectSettingsNotificationItem) {
  return Boolean(expandedMemberItemIds.value[item.id]);
}

function visibleMembers(item: ProjectSettingsNotificationItem) {
  const allMembers = resolveAllMembers(item);
  if (!hasMemberOverflow(item) || isMembersExpanded(item)) {
    return allMembers;
  }
  return allMembers.slice(0, NOTIFICATION_MEMBER_PREVIEW_LIMIT);
}

function expandMembers(item: ProjectSettingsNotificationItem) {
  expandedMemberItemIds.value[item.id] = true;
}

function collapseMembers(item: ProjectSettingsNotificationItem) {
  expandedMemberItemIds.value[item.id] = false;
}

function toggleMembersExpand(item: ProjectSettingsNotificationItem) {
  if (isMembersExpanded(item)) {
    collapseMembers(item);
  } else {
    expandMembers(item);
  }
}

function toggleNotifyItem(item: ProjectSettingsNotificationItem) {
  item.enabled = !item.enabled;
  if (!item.enabled) {
    collapseMembers(item);
  }
}

function showsNotifyExpandedBody(item: ProjectSettingsNotificationItem) {
  return item.enabled && resolveAllMembers(item).length > 0;
}
</script>

<template>
  <div :class="styles.notifyPanel">
    <div
      v-for="item in items"
      :key="item.id"
      :class="[
        styles.notifyItem,
        !showsNotifyExpandedBody(item) && styles.notifyItemCompact,
      ]"
    >
      <div :class="styles.notifyRowWrap">
        <div :class="styles.notifyRow" @click="toggleNotifyItem(item)">
          <div :class="styles.notifyCopy">
            <span :class="styles.notifyTitle">{{ ui(item.titleKey) }}</span>
          </div>
          <div :class="styles.notifyActions" @click.stop>
            <EgButton
              v-if="item.showEdit && item.enabled"
              tone="brand"
              variant="text"
              size="sm"
              type="button"
            >
              {{ ui('Edit') }}
            </EgButton>
            <EgSwitch v-model="item.enabled" size="md" />
          </div>
        </div>
      </div>

      <div v-if="showsNotifyExpandedBody(item)" :class="styles.membersWrap">
        <div
          :class="[
            styles.membersBox,
            hasMemberOverflow(item) && styles.membersBoxOverflow,
          ]"
          @click="hasMemberOverflow(item) && toggleMembersExpand(item)"
        >
          <div :class="styles.membersContent">
            <div :class="styles.membersList">
              <div
                v-for="member in visibleMembers(item)"
                :key="member.id"
                :class="styles.memberRow"
              >
                <EgAvatar
                  :name="member.name"
                  :color-index="member.colorIndex"
                  size="xl"
                />
                <div :class="styles.memberCopy">
                  <span :class="styles.memberName">{{ member.name }}</span>
                  <span :class="styles.memberEmail">{{ member.email }}</span>
                </div>
              </div>
            </div>
            <button
              v-if="hasMemberOverflow(item) && !isMembersExpanded(item)"
              type="button"
              :class="styles.overflowPill"
              @click.stop="expandMembers(item)"
            >
              {{ overflowLabel(item.overflowCount!) }}
            </button>
          </div>
          <div
            v-if="hasMemberOverflow(item) && isMembersExpanded(item)"
            :class="styles.collapseLinkWrap"
          >
            <EgLinkButton
              tone="brand"
              size="md"
              href="#"
              @click.stop.prevent="collapseMembers(item)"
            >
              {{ ui('Collapse') }}
            </EgLinkButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
