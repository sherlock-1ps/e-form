'use client'
import React, { useRef } from 'react'
import { useFormStore } from '@/store/useFormStore'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import Theme from '@/lexcial/Theme'
import ToolbarPlugin from '@/lexcial/plugins/ToolbarPlugin'

const EditorForm = ({ item, parentKey, boxId }: any) => {
  const updateDetails = useFormStore(state => state.updateDetails)
  const selectedField = useFormStore(state => state.selectedField)
  const placeholder = 'Enter some rich text...'
  const editorConfig = {
    // html: {
    //   export: exportMap,
    //   import: constructImportMap(),
    // },
    namespace: 'test ja',
    // nodes: [ParagraphNode, TextNode],
    onError(error: Error) {
      throw error
    },
    theme: Theme
  }

  return (
    <div className=' overflow-auto'>
      <LexicalComposer initialConfig={editorConfig}>
        <div className='editor-container'>
          <ToolbarPlugin />
          <div className='editor-inner'>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className='editor-input'
                  aria-placeholder={placeholder}
                  placeholder={<div className='editor-placeholder'>{placeholder}</div>}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            {/* <TreeViewPlugin /> */}
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
}

export default EditorForm
