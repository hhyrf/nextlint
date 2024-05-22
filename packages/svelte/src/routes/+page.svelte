<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import SvelteEditor from '$lib/Editor.svelte';

  import {getContext, onDestroy} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {debounce} from 'radash';

  const editor: Writable<Editor> = getContext('editor');

  const handleUpload = async (file: File) => {
    const blob = new Blob([file]);
    const previewUrl = URL.createObjectURL(blob);
    return previewUrl;
  };
  const saveDraft = debounce({delay: 500}, (editor: Editor) => {
    const jsContent = editor.getJSON();
    localStorage.setItem('draft', JSON.stringify(jsContent));
  });
  const dispose = editor.subscribe(updated => {
    if (updated) {
      saveDraft(updated);
    }
  });

  onDestroy(dispose);
</script>

<div class="mt-10">
  <SvelteEditor
    content={''}
    placeholder="Press 'space' GPT support, type '/' for help"
    onCreated={createdEditor => {
      //@ts-ignore
      window.editor = createdEditor;
      editor.set(createdEditor);
      const jsonLoaded = localStorage.getItem('draft') || '';
      if (jsonLoaded) {
        createdEditor.commands.setContent(JSON.parse(jsonLoaded), false);
      }
    }}
    onChange={editor.set}
    plugins={{
      image: {
        handleUpload,
        unsplash: {
          accessKey: 'omv67BHUb-gbDEbf9UwFsvGbKdQHwnreJPAzgI0Mz5I'
        },
        triggerOnMount: false
      },
      codeBlock: {
        langs: ['c', 'sh', 'javascript', 'html', 'typescript'],
        themes: {
          dark: 'vitesse-dark',
          light: 'vitesse-light'
        }
      }
    }}
  />
</div>
