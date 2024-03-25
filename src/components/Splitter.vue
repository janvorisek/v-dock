<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  //
}>()

const splitter = ref<HTMLDivElement | null>(null)
const dragging = ref(false)

function mouseMove(e: MouseEvent) {
  if (!dragging.value)
    return

  // Find which two elements do we split
  const parent = splitter.value?.parentElement as HTMLElement
  const e1 = splitter.value?.previousElementSibling as HTMLElement
  const e2 = splitter.value?.nextElementSibling as HTMLElement

  // old sizes
  const s1w = e1.offsetWidth
  const s2w = e2.offsetWidth
  const s1h = e1.offsetHeight
  const s2h = e2.offsetHeight

  // new sizes
  const orientation = parent.classList.contains('v-dock-horizontal') ? 'horizontal' : 'vertical'

  e1.style.flexShrink = '0'
  e2.style.flexShrink = '0'

  if (orientation === 'horizontal') {
    e1.style.width = `${(s1w + e.movementX) / parent.offsetWidth * 100}%`
    e2.style.width = `${(s2w - e.movementX) / parent.offsetWidth * 100}%`
  }
  else {
    e1.style.height = `${(s1h + e.movementY) / parent.offsetHeight * 100}px`
    e2.style.height = `${(s2h - e.movementY) / parent.offsetHeight * 100}px`
  }
}

function mouseUp() {
  dragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp)
})
</script>

<template>
  <div ref="splitter" class="v-dock-splitter" @mousedown="dragging = true" />
</template>

<style lang="scss">
.v-dock-splitter {
  z-index: 15;
  user-select: none;
}
</style>
