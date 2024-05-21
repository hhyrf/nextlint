<script lang="ts">
  // Icons
  import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Link,
    Superscript
  } from 'lucide-svelte';
  import {onDestroy, onMount} from 'svelte';
  import {writable} from 'svelte/store';

  import {cn} from '$lib/helpers';
  import {useEditor} from '$lib/context';
  import LinkButtonProps from '$lib/plugins/link/LinkButtonProps.svelte';
  import {melt} from '@melt-ui/svelte';

  const editor = useEditor();

  const fontValues = writable<Set<string>>(new Set());

  const IGNORE_BLOCK_MENU = [
    'figure',
    'NextlintCodeBlock',
    'selectImage',
    'doc'
  ];

  $: visibleNode = (() => {
    const resolver = $editor.state.selection.$from;
    if (!resolver) return;
    let node = resolver.node(resolver.depth);
    let i = resolver.depth - 1;
    while (i > 0) {
      const parent = resolver.node(i);
      if (parent.type.name === 'listItem') {
        i--;
        continue;
      }
      node = parent;
      break;
    }
    if (IGNORE_BLOCK_MENU.includes(node.type.name)) {
      return;
    }
    return node;
  })();

  const collectFontValues = () => {
    const values = [
      $editor.isActive('bold') && 'Bold',
      $editor.isActive('italic') && 'Italic',
      $editor.isActive('underline') && 'Underline',
      $editor.isActive('strike') && 'Strike',
      $editor.isActive('code') && 'Code',
      $editor.isActive('link') && 'Link',
      $editor.isActive('highlight') && 'Highlight',
      $editor.isActive('superscript') && 'Superscript',
    ].filter(Boolean) as Array<string>;

    fontValues.set(new Set(values));
  };

  const updateBubbleState = () => {
    collectFontValues();
  };

  onMount(() => {
    $editor!.on('update', updateBubbleState);
    $editor!.on('selectionUpdate', updateBubbleState);
  });
  onDestroy(() => {
    $editor!.off('update', updateBubbleState);
    $editor!.off('selectionUpdate', updateBubbleState);
  });
  $: {
  }
</script>

{#if visibleNode}
  <div
    class={cn(`border border-border
    flex min-w-max items-center gap-4 rounded-md bg-background text-foreground
    px-2 py-1 shadow-md`)}
  >
    <div class="flex items-center gap-1">
      <button
        class="item"
        data-state={$fontValues.has('Bold') ? 'on' : 'off'}
        on:click={() => {
          $editor.chain().focus().toggleBold().run();
        }}
      >
        <Bold size={20} />
      </button>
      <button
        class={cn('item')}
        data-state={$fontValues.has('Italic') ? 'on' : 'off'}
        on:mousedown={() => {
          $editor.chain().focus().toggleItalic().run();
        }}
      >
        <Italic size={20} />
      </button>
      <button
        class={cn('item')}
        data-state={$fontValues.has('Strike') ? 'on' : 'off'}
        on:mousedown={() => {
          $editor.chain().focus().toggleStrike().run();
        }}
      >
        <Strikethrough size={20} />
      </button>
      <button
        class={cn('item')}
        data-state={$fontValues.has('Superscript') ? 'on' : 'off'}
        on:mousedown={() => {
          $editor.chain().focus().toggleSuperscript().run();
        }}
      >
        <Superscript size={20} />
      </button>
      <button
        class={cn('item')}
        data-state={$fontValues.has('Code') ? 'on' : 'off'}
        on:mousedown={() => {
          $editor.chain().focus().toggleCode().run();
        }}
      >
        <Code size={20} />
      </button>
      <LinkButtonProps let:trigger let:link>
        <button
          use:melt={trigger}
          class={cn('item')}
          data-state={link ? 'on' : 'off'}
        >
          <Link size={20} />
        </button>
      </LinkButtonProps>
    </div>
  </div>
{/if}

<style lang="postcss">
  .item {
    padding: theme('spacing.1');
    border-radius: theme('borderRadius.md');

    &:hover {
      background-color: theme('colors.secondary.DEFAULT');
    }

    &[data-state='on'] {
      background-color: theme('colors.slate.300');
      color: theme('colors.slate.900');
    }

    &:focus {
      @apply ring-2 ring-slate-400;
    }
  }

  .separator {
    width: 1px;
    background-color: theme('colors.neutral.300');
    align-self: stretch;
  }
</style>
