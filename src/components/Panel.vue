<script setup lang="ts">
import type { Ref } from 'vue'
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import Splitter from './Splitter.vue'
import Tabs from './Tabs.vue'
import { findParentElementWithClass } from '~/utils'

const props = withDefaults(defineProps<{
  id?: string
  variant?: 'split' | 'tabs'
  orientation?: 'horizontal' | 'vertical'
  children?: unknown[]
  width?: string
  height?: string
}>(), {
  variant: 'split',
  orientation: 'horizontal',
  children: () => [],
  width: undefined,
  height: undefined,
})

const uuid = ref(uuidv4())
const panel = ref<HTMLDivElement | null>(null)

const mouse = ref('')
const mouseoverDiv = ref({ left: 0, top: 0, width: 0, height: 0 })

function resize() {
  // todo: not needed anymore
}

function pxOrPctToPct(value: string, parentSize: number) {
  if (value.endsWith('px'))
    return Number.parseFloat(value) / parentSize * 100

  else if (value.endsWith('%'))
    return Number.parseFloat(value)

  else
    return Number.parseFloat(value)
}

onMounted(() => {
  if (props.id)
    uuid.value = props.id

  // width is a string of percentage or px or number (px)
  if (props.width)
    panel.value!.style.width = `${pxOrPctToPct(props.width, panel.value!.parentElement!.offsetWidth)}%`

  // height is a string of percentage or px or number (px)
  if (props.height)
    panel.value!.style.height = `${pxOrPctToPct(props.height, panel.value!.parentElement!.offsetHeight)}%`

  if (props.width || props.height)
    panel.value!.style.flexShrink = '0'

  // requestAnimationFrame(resize)
})

function endDrag() {
  mouseoverDiv.value.left = 0
  mouseoverDiv.value.top = 0
  mouseoverDiv.value.width = 0
  mouseoverDiv.value.height = 0
}

onMounted(() => {
  window.addEventListener('resize', resize)
  document.addEventListener('drop', endDrag)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  document.removeEventListener('drop', endDrag)
})

const dropaction = inject('dropaction') as Ref<string>

function dragover(e: DragEvent) {
  e.preventDefault()

  // relative coords in the element (-1,1)
  const rect = panel.value!.getBoundingClientRect()
  const tabs = panel.value!.querySelector('.v-dock-tabs-and-actions')!.getBoundingClientRect()

  const x = (e.clientX - rect.left) / rect.width * 2 - 1
  const y = (e.clientY - rect.top) / rect.height * 2 - 1

  if (!(tabs.top < e.clientY && e.clientY < tabs.bottom)) {
    if (x < -0.4) {
      mouseoverDiv.value.left = 0
      mouseoverDiv.value.top = 0
      mouseoverDiv.value.width = rect.width / 2
      mouseoverDiv.value.height = rect.height

      mouse.value = 'left'
      dropaction.value = 'before_panel'
    }

    else if (x > 0.4) {
      mouseoverDiv.value.left = rect.width / 2
      mouseoverDiv.value.top = 0
      mouseoverDiv.value.width = rect.width / 2
      mouseoverDiv.value.height = rect.height
      mouse.value = 'right'
      dropaction.value = 'after_panel'
    }

    else if (y < -0.4) {
      mouseoverDiv.value.left = 0
      mouseoverDiv.value.top = 0
      mouseoverDiv.value.width = rect.width
      mouseoverDiv.value.height = rect.height / 2
      mouse.value = 'top'
      dropaction.value = 'above_panel'
    }

    else if (y > 0.4) {
      mouseoverDiv.value.left = 0
      mouseoverDiv.value.top = 0 + rect.height / 2
      mouseoverDiv.value.width = rect.width
      mouseoverDiv.value.height = rect.height / 2
      mouse.value = 'bottom'
      dropaction.value = 'below_panel'
    }

    else {
      mouseoverDiv.value.left = 0
      mouseoverDiv.value.top = 0
      mouseoverDiv.value.width = rect.width
      mouseoverDiv.value.height = rect.height
      mouse.value = 'center'
      dropaction.value = 'into_panel'
    }
  }

  // Delete all hovers
  for (const e of document.getElementsByClassName('v-dock-drop'))
    e.classList.remove('v-dock-drop')

  let target = findParentElementWithClass(e.target as HTMLElement, 'v-dock-void')
  if (target)
    return target.classList.add('v-dock-drop')

  target = findParentElementWithClass(e.target as HTMLElement, 'v-dock-tab')
  if (target)
    return target.classList.add('v-dock-drop')
}
</script>

<template>
  <template v-if="props.variant === 'split'">
    <div ref="panel" :data-uuid="uuid" class="v-dock-panel" :class="`v-dock-${orientation}`">
      {{ mouse }}
      <template v-if="children.length > 0">
        <template v-for="(c, i) in children" :key="c.id">
          <Panel :id="c.id" :width="c.width" :height="c.height" :variant="c.variant" :orientation="c.orientation" :children="c.children" />
          <Splitter v-if="i !== children.length - 1" />
        </template>
      </template>
      <template v-else>
        {{ id }}
      </template>
    </div>
  </template>
  <template v-else>
    <div ref="panel" :data-uuid="uuid" class="v-dock-panel" :class="`v-dock-${orientation}`" @dragover="dragover($event)">
      <div class="v-mouse-placement-effect" :style="`left: ${mouseoverDiv.left}px; top: ${mouseoverDiv.top}px; width: ${mouseoverDiv.width}px; height: ${mouseoverDiv.height}px;`" @dragleave="endDrag" />
      <Tabs ref="panel" :children="children" />
    </div>
  </template>
</template>

<style>

</style>
