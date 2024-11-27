import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  CodeToggle,
  InsertCodeBlock,
  codeBlockPlugin,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  ListsToggle,
  linkDialogPlugin,
  CreateLink,
  InsertImage,
  InsertTable,
  tablePlugin,
  imagePlugin,
  codeMirrorPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  Separator,
  InsertThematicBreak,
  diffSourcePlugin,
  MDXEditorMethods,
} from '@mdxeditor/editor';
import { useTheme } from 'next-themes';
import { Ref } from 'react';

import '@mdxeditor/editor/style.css';
import './dark-editor.css';

interface Props {
  value: string;
  editorRef: Ref<MDXEditorMethods> | null;
  fieldChange: (value: string) => void;
}

const Editor = ({ value, editorRef, fieldChange }: Props) => {
  const { resolvedTheme } = useTheme();
  const themeExtension = resolvedTheme === 'dark' ? ['dark'] : [];

  return (
    <div className='w-full border border-gray-300 rounded-md'>
      {/* Wrapper div only for content height control */}
      <div className='min-h-[400px] max-h-[600px] overflow-y-auto'>
        <MDXEditor
          key={resolvedTheme}
          markdown={value}
          ref={editorRef}
          onChange={fieldChange}
          className='background-light800_dark200 light-border-2 dark-editor w-full'
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            quotePlugin(),
            markdownShortcutPlugin(),
            tablePlugin(),
            imagePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                'css': 'css',
                'txt': 'txt',
                'sql': 'sql',
                'html': 'html',
                'sass': 'sass',
                'scss': 'scss',
                'bash': 'bash',
                'json': 'json',
                'js': 'javascript',
                'ts': 'typescript',
                '': 'unspecified',
                'tsx': 'TypeScript (React)',
                'jsx': 'JavaScript (React)',
              },
              autoLoadLanguageSupport: true,
            }),
            diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
            toolbarPlugin({
              toolbarContents: () => (
                <ConditionalContents
                  options={[
                    {
                      when: (editor) => editor?.editorType === 'codeblock',
                      contents: () => <ChangeCodeMirrorLanguage />,
                    },
                    {
                      fallback: () => (
                        <>
                          <UndoRedo />
                          <Separator />
                          <BoldItalicUnderlineToggles />
                          <CodeToggle />
                          <Separator />
                          <ListsToggle />
                          <Separator />
                          <CreateLink />
                          <InsertImage />
                          <Separator />
                          <InsertTable />
                          <InsertThematicBreak />
                          <Separator />
                          <InsertCodeBlock />
                        </>
                      ),
                    },
                  ]}
                />
              ),
            }),
          ]}
        />
      </div>
    </div>
  );
};

export default Editor;
