import { Plugin, PluginKey } from '@tiptap/pm/state';
import { FloatingMenuView as FloatingMenuViewInterface, default as FloatingMenu, type FloatingMenuViewProps } from '@tiptap/extension-floating-menu';
import type { ComponentType } from 'svelte';

export declare type FloatingMenuViewOptions = FloatingMenuViewProps & {
  component: ComponentType;
};

export const FloatingMenuExtension = FloatingMenu.extend<{ component: ComponentType }>({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        view: view => new FloatingMenuView({
          pluginKey: new PluginKey("FloatingMenu"),
          element: document.createElement("div"),
          editor: this.editor,
          component: this.options.component,
          view
        })
      })
    ]
  }
})

class FloatingMenuView extends FloatingMenuViewInterface {
  constructor(options: FloatingMenuViewOptions) {
    const { component, element, editor } = options;
    new component({
      target: element,
      props: {
        editor
      }
    });

    document.body.appendChild(element);
    super(options);
  }
}