<script lang="ts">
  import {Editor} from '@tiptap/core';
  import {ImagePlus, Film} from 'lucide-svelte';

  export let editor: Editor;
</script>

<div class="bg-background rounded-lg border border-gray-300">
  <button class="item" on:click={() => {}}>
    <ImagePlus size={20} />
  </button>
  <button class="item" on:click={() => {}}>
    <Film size={20} />
  </button>
</div>

<style lang="postcss">
  .item {
    padding: theme('spacing.1');
    border-radius: theme('borderRadius.md');

    &:hover {
      background-color: theme('colors.secondary.DEFAULT');
    }

    &.active {
      background-color: theme('colors.slate.300');
      color: theme('colors.slate.900');
    }

    &:focus {
      @apply ring-2 ring-slate-400;
    }
  }
</style>
