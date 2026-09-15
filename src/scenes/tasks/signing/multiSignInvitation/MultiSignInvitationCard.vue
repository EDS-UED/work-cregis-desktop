<script setup lang="ts">
import {
  EgAvatar,
  EgButton,
  EgListFieldOverflowText,
  EgTag,
  EgTooltipOverflow,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import batchStyles from '../batch/batchSigning.shared.module.css';
import type { MultiSignInvitation } from './types';
import styles from './MultiSignInvitationCard.module.css';

defineProps<{
  invitation: MultiSignInvitation;
}>();

const emit = defineEmits<{
  join: [id: string];
}>();

const { ui } = useAppI18n();

function formatInviterLine(invitation: MultiSignInvitation): string {
  return ui('{name} invites you to sign').replace('{name}', invitation.inviterName);
}

function formatInviterSuffix(invitation: MultiSignInvitation): string {
  const line = formatInviterLine(invitation);
  const name = invitation.inviterName;
  return line.startsWith(name) ? line.slice(name.length).trimStart() : line.trimStart();
}

function formatInviterTooltip(invitation: MultiSignInvitation): string {
  return `${invitation.inviterName} (${invitation.inviterEmailMasked})`;
}

function formatAmountPrimary(invitation: MultiSignInvitation): string {
  return `${invitation.amountDisplay} ${invitation.amountSymbol}`;
}

function truncateAddressMiddle(value: string, head = 6, tail = 6): string {
  if (!value || value.includes('...')) return value;
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

function addressCopyLabel(address: string): string {
  return `${ui('Copy address')} ${address}`.trim();
}
</script>

<template>
  <article :class="styles.card">
    <div :class="styles.cardHeadlineRow">
      <span :class="styles.taskAvatar">
        <EgAvatar
          size="lg"
          :name="invitation.inviterName"
          :color-index="invitation.taskAvatarColorIndex"
          :color-seed="invitation.id"
        />
      </span>
      <div :class="styles.cardHeadline">
        <p :class="styles.inviterLine">
          <span :class="styles.inviterNameHost">
            <EgListFieldOverflowText
              :text="formatInviterTooltip(invitation)"
              :display-text="invitation.inviterName"
              variant="primary"
              tooltip-trigger="hover"
              boundary-selector=".multi-sign-invitation-panel-root"
            />
          </span>
          <span :class="styles.inviterSuffix">{{ formatInviterSuffix(invitation) }}</span>
        </p>
        <time :class="styles.invitedAt" :datetime="invitation.invitedAtDisplay">
          {{ invitation.invitedAtDisplay }}
        </time>
      </div>
      <EgButton
        tone="decor"
        variant="solid"
        size="md"
        :class="styles.cardHeadlineAction"
        @click="emit('join', invitation.id)"
      >
        {{ ui('Join') }}
      </EgButton>
    </div>

    <div :class="[batchStyles.detailHeadlineMenu, styles.detailHeadlineMenu]">
      <div :class="batchStyles.detailHeadlineBid" aria-hidden="true">
        <span :class="batchStyles.detailHeadlineBidBar" />
      </div>
      <div :class="batchStyles.detailHeadlineMenuBody">
        <div :class="batchStyles.detailHeadlineDataBox">
          <div :class="[batchStyles.detailHeadlineList, styles.detailHeadlineList]">
            <div :class="[styles.detailListRow, styles.detailListRowAddress]">
              <span :class="[batchStyles.detailHeadlineRowLabel, styles.detailRowLabel]">
                {{ ui('Amount:') }}
              </span>
              <span :class="[styles.rowValueCluster, styles.rowValueClusterAddress]">
                <span :class="styles.amountPrimary">{{ formatAmountPrimary(invitation) }}</span>
                <EgTag
                  family="system"
                  system-type="stroke-subtle"
                  size="sm"
                >
                  {{ invitation.networkLabel }}
                </EgTag>
              </span>
            </div>

            <div :class="[styles.detailListRow, styles.detailListRowAddress]">
              <span :class="[batchStyles.detailHeadlineRowLabel, styles.detailRowLabel]">
                {{ ui('Sender:') }}
              </span>
              <span :class="[styles.rowValueCluster, styles.rowValueClusterAddress]">
                <span :class="styles.addressValueLine">
                  <EgTag
                    v-if="invitation.sender.alias"
                    :class="styles.addressAliasTag"
                    family="system"
                    system-type="solid-brand"
                    size="sm"
                  >
                    {{ invitation.sender.alias }}
                  </EgTag>
                  <EgTooltipOverflow
                    :tooltip-text="invitation.sender.address"
                    :copy-value="invitation.sender.address"
                    :copy-label="addressCopyLabel(invitation.sender.address)"
                    show-tooltip-copy
                    semantic-truncated
                    target-tone="secondary"
                    defer-hover-target
                    :typography-class="styles.addressTextMeasure"
                    :measure-class="styles.addressTextMeasure"
                    :host-class="styles.addressOverflowHost"
                    tooltip-trigger="hover"
                    boundary-selector=".multi-sign-invitation-panel-root"
                  >
                    <span
                      :class="[
                        styles.addressHoverTarget,
                        'eds-hover-tooltip-trigger__target',
                        'eds-hover-tooltip-trigger__target--secondary',
                      ]"
                    >
                      {{ truncateAddressMiddle(invitation.sender.address) }}
                    </span>
                  </EgTooltipOverflow>
                </span>
              </span>
            </div>

            <div :class="[styles.detailListRow, styles.detailListRowAddress]">
              <span :class="[batchStyles.detailHeadlineRowLabel, styles.detailRowLabel]">
                {{ ui('Receiver:') }}
              </span>
              <span :class="[styles.rowValueCluster, styles.rowValueClusterAddress]">
                <span :class="styles.addressValueLine">
                  <EgTag
                    v-if="invitation.receiver.alias"
                    :class="styles.addressAliasTag"
                    family="system"
                    system-type="solid-brand"
                    size="sm"
                  >
                    {{ invitation.receiver.alias }}
                  </EgTag>
                  <EgTooltipOverflow
                    :tooltip-text="invitation.receiver.address"
                    :copy-value="invitation.receiver.address"
                    :copy-label="addressCopyLabel(invitation.receiver.address)"
                    show-tooltip-copy
                    semantic-truncated
                    target-tone="secondary"
                    defer-hover-target
                    :typography-class="styles.addressTextMeasure"
                    :measure-class="styles.addressTextMeasure"
                    :host-class="styles.addressOverflowHost"
                    tooltip-trigger="hover"
                    boundary-selector=".multi-sign-invitation-panel-root"
                  >
                    <span
                      :class="[
                        styles.addressHoverTarget,
                        'eds-hover-tooltip-trigger__target',
                        'eds-hover-tooltip-trigger__target--secondary',
                      ]"
                    >
                      {{ truncateAddressMiddle(invitation.receiver.address) }}
                    </span>
                  </EgTooltipOverflow>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
