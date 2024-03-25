<script lang="ts" setup>
import type { Ref } from 'vue'
import { inject, ref } from 'vue'

import { Cross1Icon, HamburgerMenuIcon, PlusIcon, SizeIcon } from '@radix-icons/vue'
import { Item, findParentElementWithClass } from '../utils'

const props = defineProps<{
  children: Item[]
}>()

const tab = ref(0)

const dragid = inject('dragid') as Ref<string>

function dragstart(e: DragEvent) {
  dragid.value = (e.target as HTMLElement).getAttribute('data-uuid')!
}

const move = inject('move') as (to: string, how: string) => void
function onDrop(e: DragEvent) {
  const target = e.target as HTMLElement

  let tmp = findParentElementWithClass(target, 'v-dock-tab')
  if (tmp) {
    tmp.classList.remove('v-dock-drop')
    move(tmp.getAttribute('data-uuid')!, 'before_tab')
    return
  }

  tmp = findParentElementWithClass(target, 'v-dock-panel')
  if (tmp) {
    tmp.classList.remove('v-dock-drop')
    move(tmp.getAttribute('data-uuid')!, 'into_panel')
  }
}

const deleteItemById = inject('deleteItemById') as (id: string) => void
function deleteTab(id: number) {
  if (id < tab.value || tab.value === props.children.length - 1)
    tab.value = tab.value - 1

  deleteItemById(props.children[id].id)
}
</script>

<template>
  <div class="v-dock-tabbed">
    <div class="v-dock-tabs-and-actions">
      <div class="v-dock-tab-group v-dock-tab-actions">
        <div>
          <HamburgerMenuIcon />
        </div>
      </div>
      <div class="v-dock-tabs">
        <div v-for="(c, i) in children" :key="i" :data-uuid="c.id" draggable="true" class="v-dock-tab" :class="{ active: tab === i }" @drop="onDrop" @dragstart="dragstart" @click="tab = i">
          <span class="v-dock-tab-content">{{ c.title }}</span>
          <span class="action" @click.stop="deleteTab(i)"><Cross1Icon class="h-6 w-6 text-blue-500" /></span>
        </div>
      </div>
      <div class="v-dock-tab-group v-dock-tab-add">
        <div>
          <PlusIcon />
        </div>
      </div>
      <div class="v-dock-void" @drop="onDrop" @pointerleave="($event) => ($event.target as HTMLDivElement).classList.remove('v-dock-drop')" />
      <div class="v-dock-tab-group v-dock-tab-actions">
        <div>
          <SizeIcon />
        </div>
        <div>
          <Cross1Icon />
        </div>
      </div>
    </div>

    <div class="v-dock-tab-body">
      <div v-for="(c, i) in children" :key="c.id" :style="`display: ${tab === i ? 'flex' : 'none'}; width: 100%; height: 100%;`">
        <component :is="c.component" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.v-dock-tabbed {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.v-dock-tabs-and-actions {
  position: relative;
  z-index: 10;
}

.v-dock-tab-body {
  display: flex;
  height: 100%;
}
</style>
