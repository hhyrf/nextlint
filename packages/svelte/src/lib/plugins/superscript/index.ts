import { Editor, Extension, isTextSelection } from '@tiptap/core';
import type { ComponentType } from 'svelte';

type Options = {
    component: ComponentType;
};

export const SuperscriptExtension = Extension.create<Options>({
    name: 'Superscript',
});