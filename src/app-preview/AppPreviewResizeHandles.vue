<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import {
  applyPreviewWindowSize,
  initPreviewWindowMode,
  previewWindowSize,
} from './previewWindowSize';
import styles from './AppPreviewResizeHandles.module.css';

type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const EDGES: readonly ResizeEdge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

type DragState = {
  edge: ResizeEdge;
  centerX: number;
  centerY: number;
  pointerId: number;
};

let drag: DragState | null = null;

function setResizeCursor(edge: ResizeEdge | null) {
  const root = document.documentElement;
  if (!edge) {
    root.removeAttribute('data-preview-resize');
    root.classList.remove('is-preview-resizing');
    return;
  }
  root.setAttribute('data-preview-resize', edge);
  root.classList.add('is-preview-resizing');
}

function sizeFromPointer(edge: ResizeEdge, clientX: number, clientY: number, centerX: number, centerY: number) {
  const current = previewWindowSize;
  let width = current.value.width;
  let height = current.value.height;
  if (edge.includes('e')) width = 2 * (clientX - centerX);
  if (edge.includes('w')) width = 2 * (centerX - clientX);
  if (edge.includes('s')) height = 2 * (clientY - centerY);
  if (edge.includes('n')) height = 2 * (centerY - clientY);
  return { width, height };
}

function onPointerMove(event: PointerEvent) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  event.preventDefault();
  const next = sizeFromPointer(drag.edge, event.clientX, event.clientY, drag.centerX, drag.centerY);
  applyPreviewWindowSize(next.width, next.height);
}

function onPointerUp(event: PointerEvent) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const target = event.currentTarget;
  if (target instanceof HTMLElement && target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId);
  }
  drag = null;
  setResizeCursor(null);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
}

function onPointerDown(event: PointerEvent, edge: ResizeEdge) {
  if (event.button !== 0) return;
  const preview = document.querySelector('.app-preview');
  if (!(preview instanceof HTMLElement)) return;
  const rect = preview.getBoundingClientRect();
  drag = {
    edge,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
    pointerId: event.pointerId,
  };
  event.preventDefault();
  event.stopPropagation();
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  setResizeCursor(edge);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
}

onMounted(() => {
  initPreviewWindowMode();
  window.addEventListener('resize', onViewportResize);
});

function onViewportResize() {
  applyPreviewWindowSize(previewWindowSize.value.width, previewWindowSize.value.height);
}

onBeforeUnmount(() => {
  drag = null;
  setResizeCursor(null);
  window.removeEventListener('resize', onViewportResize);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
});
</script>

<template>
  <div class="app-preview-resize-host" :class="styles.host" aria-hidden="true">
    <div
      v-for="edge in EDGES"
      :key="edge"
      :class="[styles.handle, styles[edge]]"
      @pointerdown="onPointerDown($event, edge)"
    />
  </div>
</template>
