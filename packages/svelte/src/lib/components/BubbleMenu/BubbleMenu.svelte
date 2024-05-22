<script lang="ts">
  // Icons
  import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Link,
    Superscript,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    SquareCode,
    Quote
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
    'NextlintCodeBlock',
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
      $editor.isActive('heading', {level: 1}) && 'Heading',
      $editor.isActive('heading', {level: 2}) && 'Heading2',
      $editor.isActive('heading', {level: 3}) && 'Heading3',
      $editor.isActive('bulletList') && 'BulletList',
      $editor.isActive('orderedList') && 'OrderedList',
      $editor.isActive('codeBlock') && 'CodeBlock',
      $editor.isActive('blockquote') && 'Blockquote',
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
    flex flex-col min-w-max items-center gap-1 rounded-md bg-background text-foreground
    px-2 py-1 shadow-md`)}
  >
    <div class="flex items-center gap-1">
      <button
        class="item"
        class:active={$fontValues.has('Bold')}
        on:click={() => {
          $editor.chain().focus().toggleBold().run();
        }}
      >
        <Bold size={20} />
      </button>
      <button
        class={cn('item')}
        class:active={$fontValues.has('Italic')}
        on:mousedown={() => {
          $editor.chain().focus().toggleItalic().run();
        }}
      >
        <Italic size={20} />
      </button>
      <button
        class={cn('item')}
        class:active={$fontValues.has('Strike')}
        on:mousedown={() => {
          $editor.chain().focus().toggleStrike().run();
        }}
      >
        <Strikethrough size={20} />
      </button>
      <button
        class={cn('item')}
        class:active={$fontValues.has('Superscript')}
        on:mousedown={() => {
          $editor.chain().focus().toggleSuperscript().run();
        }}
      >
        <Superscript size={20} />
      </button>
      <button
        class={cn('item')}
        class:active={$fontValues.has('Heading')}
        on:mousedown={() => {
          $editor.chain().focus().toggleHeading({level: 1}).run();
        }}
      >
        <Heading1 size={20} />
      </button>
      <button
        class={cn('item')}
        class:active={$fontValues.has('Heading2')}
        on:mousedown={() => {
          $editor.chain().focus().toggleHeading({level: 2}).run();
        }}
      >
        <Heading2 size={20} />
      </button>
      <button
        class={cn('item')}
        class:active={$fontValues.has('Heading3')}
        on:mousedown={() => {
          $editor.chain().focus().toggleHeading({level: 3}).run();
        }}
      >
        <Heading3 size={20} />
      </button>
    </div>
    <div class="flex items-center gap-1">
      <LinkButtonProps let:trigger let:link>
        <button
          use:melt={trigger}
          class={cn('item')}
          class:active={link ? true : false}
        >
          <Link size={20} />
        </button>
      </LinkButtonProps>
      <button
        class={cn('item')}
        class:active={$fontValues.has('BulletList')}
        on:mousedown={() => {
          $editor.chain().focus().toggleBulletList().run();
        }}
      >
        <List size={20} />
      </button>
      <button
        class={cn('item')}
        class:active={$fontValues.has('OrderedList')}
        on:mousedown={() => {
          $editor.chain().focus().toggleOrderedList().run();
        }}
      >
        <ListOrdered size={20} />
      </button>

      <div class="separator" />
      
      <button
        class={cn('item')}
        class:active={$fontValues.has('Blockquote')}
        on:mousedown={() => {
          $editor.chain().focus().toggleBlockquote().run();
        }}
      >
        <Quote size={20} />
      </button>
      <button
        class={cn('item')}
        class:active={$fontValues.has('Code')}
        on:mousedown={() => {
          $editor.chain().focus().toggleCode().run();
        }}
      >
        <Code size={20} />
      </button>
      <button
        class={cn('item')}
        class:active={$fontValues.has('CodeBlock')}
        on:mousedown={() => {
          $editor.chain().focus().toggleCodeBlock().run();
        }}
      >
        <SquareCode size={20} />
      </button>
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

    &.active {
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
