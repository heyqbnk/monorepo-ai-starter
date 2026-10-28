<script lang="ts" setup>
const { t } = useI18n({
  messages: {
    en: {
      counter: {
        clicked: 'Clicked {count} times',
        increment: 'Click me',
        reset: 'Reset',
      },
      title: 'Home',
      welcome: {
        description: 'This is the home page of the starter.',
        heading: 'Welcome',
      },
    },
    ru: {
      counter: {
        clicked: 'Нажатий: {count}',
        increment: 'Нажми меня',
        reset: 'Сбросить',
      },
      title: 'Главная',
      welcome: {
        description: 'Это главная страница стартера.',
        heading: 'Добро пожаловать',
      },
    },
  },
});

const count = ref(0);
</script>

<template>
  <main class="grid min-h-dvh place-content-center gap-4 text-center">
    <h1 class="text-3xl font-semibold">
      {{ t('title') }}
    </h1>
    <section>
      <h2 class="text-xl font-medium">
        {{ t('welcome.heading') }}
      </h2>
      <p>{{ t('welcome.description') }}</p>
    </section>
    <section class="grid gap-3">
      <p>{{ t('counter.clicked', { count }) }}</p>
      <VButton size="large" class="w-full" @click="count++">
        <template #icon>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </template>
        {{ t('counter.increment') }}
      </VButton>
      <VButton variant="secondary" size="small" :disabled="count === 0" @click="count = 0">
        {{ t('counter.reset') }}
      </VButton>
    </section>
  </main>
</template>
