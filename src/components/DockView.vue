<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { Item, addItem, deleteItem, findParentElementWithClass, getItemRecursive } from '../utils'
import Panel from './Panel.vue'

const model = defineModel<Item>({required: true, type: Object})
provide('model', model)

const dragid = ref('')
provide('dragid', dragid)

const dropaction = ref('')
provide('dropaction', dropaction)

function move(to: string, how: string) {
  if (dragid.value === to)
    return

  if (how === 'before_tab') {
    const orig = deleteItem(model.value, dragid.value)
    if(!orig)
      return

    addItem(model.value!, to, orig)
  }
  else if (how === 'into_panel') {
    const orig = deleteItem(model.value, dragid.value)
    if (!orig)
      return

    const item = getItemRecursive(model.value, to)
    if (!item)
      return

    if (item) {
      if ('children' in item)
        item.children!.push(orig)
      else
        item.children = [orig]
    }
  }

  // Delete all hovers
  for (const e of document.getElementsByClassName('v-dock-drop'))
    e.classList.remove('v-dock-drop')
}

provide('move', move)

function endDrag(e: Event) {
  const target = findParentElementWithClass(e.target as HTMLElement, 'v-dock-panel')
  if (!target)
    return

  move(target.getAttribute('data-uuid')!, dropaction.value)
}

onMounted(() => {
  document.addEventListener('drop', endDrag)
})

onUnmounted(() => {
  document.removeEventListener('drop', endDrag)
})

function deleteItemById(id: string) {
  deleteItem(model.value, id)
}

provide('deleteItemById', deleteItemById)
</script>

<template>
  <div class="v-dock-view">
    <Panel :children="modelValue.children" />
  </div>
</template>
../utils/management
