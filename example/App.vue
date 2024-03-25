<script setup lang="ts">
import { markRaw, reactive } from 'vue'
import DockView from '../src/components/DockView.vue'
import ExampleA from '../src/components/ExampleA.vue'
import ExampleB from '../src/components/ExampleB.vue'

import '../src/css/main.scss'

const panels = reactive({
  id: 'root',
  children: [
    { id: 'a', title: 'Some', component: markRaw(ExampleA), width: '20%', orientation: 'vertical', children: [
      { id: 'xaa', title: 'Fuck', component: markRaw(ExampleA), orientation: 'horizontal' },
      { id: 'xaaa', title: 'The', component: markRaw(ExampleB), orientation: 'horizontal' },
      { id: 'xaaaa', title: 'Hello world', component: markRaw(ExampleA), orientation: 'horizontal' },
    ] },
    { id: 'ct', title: 'Text', component: markRaw(ExampleB), width: '60%', orientation: 'vertical', children: [
      { id: 'c', title: 'Some', variant: 'tabs' },
      { id: 'cx', title: 'Paste', variant: 'tabs', height: '200px', children: [
        { id: 'aa', title: 'Fuck', component: markRaw(ExampleA), orientation: 'horizontal' },
        { id: 'aaa', title: 'The', component: markRaw(ExampleB), orientation: 'horizontal' },
        { id: 'aaaa', title: 'Hello world', component: markRaw(ExampleA), orientation: 'horizontal' },
      ] },
    ] },
    { id: 'b', title: 'Copy', component: markRaw(ExampleB), width: '20%', orientation: 'vertical' },
  ],
})
</script>

<template>
  <DockView v-model="panels" class="dockview-theme-light" style="width: 100dvw; height: 100dvh;" />
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
