<script lang="ts" setup>
import type { Component } from 'vue';

const { as = 'button' } = defineProps<{
  /**
   * A tag or a component to render, such as `NuxtLink`. A component must render a single
   * root element.
   * @default 'button'
   */
  as?: string | Component;
}>();

const cn = useCssModule('cn');
</script>

<template>
  <!-- A native button submits forms by default, so it is a plain one unless `type` is passed. -->
  <component :is="as" :type="as === 'button' ? 'button' : undefined" :class="cn.root">
    <slot/>
  </component>
</template>

<style lang="scss" module="cn">
// A sublayer of the components layer: utilities passed through `class` override these rules,
// and so do the rules of components built on ButtonBase, which live in the components layer
// itself. Unlike overriding by source order, this holds whatever order the build puts the
// stylesheets in.
@layer components.button-base {
  .root {
    // The scale of a pressed button. A parent tunes it through `class`:
    // `<VButton class="[--button-base-pressed-scale:1]">`.
    --button-base-pressed-scale: 0.97;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    text-decoration: none;
    cursor: pointer;
    appearance: none;
    transition-property: color, background-color, opacity, scale;
    transition-duration: 150ms;

    &:active {
      scale: var(--button-base-pressed-scale);
    }

    &:focus-visible {
      outline: 2px solid var(--accent-color);
      outline-offset: 2px;
    }

    &:disabled {
      cursor: default;
      opacity: 0.5;
      scale: none;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
}
</style>
