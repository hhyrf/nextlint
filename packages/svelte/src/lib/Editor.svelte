<script lang="ts" context="module">
  export type PluginOptions = {
    dropCursor?: DropcursorOptions;
  };
</script>

<script lang="ts">
  import {createEditorContext} from '$lib/context';
  import {type Editor, type Content, type Extensions} from '@tiptap/core';

  import {LinkExtension} from '$lib/plugins/link';
  import {HighlightExtension} from '$lib/plugins/highlight';

  import {
    Dropcursor,
    type DropcursorOptions
  } from '@tiptap/extension-dropcursor';
  import {useProsemirrorAdapterProvider} from '@prosemirror-adapter/svelte';

  import BubbleMenu from './components/BubbleMenu/BubbleMenu.svelte';
  import {BubbleMenuExtension} from './plugins/bubbleMenu/bubbleMenu';
  import FloatingMenu from './components/floatingMenu/floatingMenu.svelte';
  import {FloatingMenuExtension} from './plugins/floatingMenu/index';
  import {CodeBlock} from '@tiptap/extension-code-block';

  import {SuperscriptExtension} from './plugins/superscript';

  useProsemirrorAdapterProvider();
  export let content: Content;
  export let placeholder = '';
  export let onChange: (editor: Editor) => void;
  export let onCreated = (_editor: Editor) => {};
  export let plugins: PluginOptions = {};
  export let extensions: Extensions = [];

  const {render} = createEditorContext({
    editable: true,
    content,
    onCreated,
    onChange,
    placeholder,
    //@ts-ignore
    extensions: [
      LinkExtension,
      HighlightExtension,
      Dropcursor.configure(plugins.dropCursor),
      CodeBlock,
      BubbleMenuExtension.configure({
        component: BubbleMenu
      }),
      SuperscriptExtension,
      FloatingMenuExtension.configure({
        component:FloatingMenu
      })
    ]
      .concat(extensions)
      .filter(Boolean)
  });
</script>

<div use:render />
