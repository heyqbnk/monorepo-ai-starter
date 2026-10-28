<script lang="ts" setup>
type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'small' | 'medium' | 'large';

const {
  size = 'medium',
  variant = 'primary',
} = defineProps<{
  variant?: ButtonVariant;
  size?: ButtonSize;
}>();

const slots = defineSlots<{
  default?: () => unknown;
  icon?: () => unknown;
}>();

const cn = useCssModule('cn');

const variantClasses: Record<ButtonVariant, string | undefined> = {
  primary: cn.rootPrimary,
  secondary: cn.rootSecondary,
};

const sizeClasses: Record<ButtonSize, string | undefined> = {
  large: cn.rootLarge,
  medium: cn.rootMedium,
  small: cn.rootSmall,
};
</script>

<template>
  <!-- Native attributes (`type`, `disabled`) and the `as` prop fall through to ButtonBase. -->
  <ButtonBase
    :class="[cn.root, variantClasses[variant], sizeClasses[size], slots.icon && cn.rootWithIcon]"
  >
    <span v-if="slots.icon" class="inline-flex shrink-0">
      <slot name="icon"/>
    </span>
    <slot/>
  </ButtonBase>
</template>

<style lang="scss" module="cn">
// The components layer lets utilities passed through `class` override these rules.
@layer components {
  .root {
    gap: 8px;
    border-radius: 12px;
    font-weight: 600;
  }

  .rootPrimary {
    background-color: var(--accent-color);
    color: var(--accent-contrast-color);

    &:active {
      background-color: var(--accent-pressed-color);
    }
  }

  .rootSecondary {
    background-color: var(--secondary-fill-color);
    color: var(--text-color);

    &:active {
      background-color: var(--secondary-fill-pressed-color);
    }
  }

  .rootSmall {
    min-height: 32px;
    padding: 0 12px;
    font-size: 14px;
  }

  .rootMedium {
    min-height: 40px;
    padding: 0 16px;
    font-size: 16px;
  }

  .rootLarge {
    min-height: 48px;
    padding: 0 20px;
    font-size: 18px;
  }

  // Declared after the sizes so that it overrides their start padding.
  .rootWithIcon {
    padding-inline-start: 12px;
  }
}
</style>
