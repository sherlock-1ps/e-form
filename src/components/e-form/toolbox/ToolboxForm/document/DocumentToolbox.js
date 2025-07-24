'use client'
import { Grid, Typography } from '@mui/material'

import ToolboxButtonContainer from './../../ToolboxContainer/ToolboxContainer'
import ToolboxGrid from './../../ToolboxContainer/ToolboxGrid'
import {
  toolboxLayoutMenu,
  toolboxDocumentBaseMenu,
  toolboxCreateformMenu,
  toolboxOptionMenu,
  toolboxGridMenu
} from '@/data/toolbox/toolboxMenu'

// import ToolboxForm from '@/components/e-form/toolbox/ToolboxForm'
import { useDictionary } from '@/contexts/DictionaryContext'

const DocumentToolbox = () => {
  const { dictionary } = useDictionary()
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Typography variant='h5'>{dictionary?.designDocument}</Typography>
      </Grid>
      <Grid item xs={12}>
        <ToolboxGrid menu={toolboxGridMenu} title={dictionary?.gridTool} />
      </Grid>
      <Grid item xs={12}>
        <ToolboxButtonContainer menu={toolboxDocumentBaseMenu} title={dictionary?.basicDocumentTools} />
      </Grid>
      <Grid item xs={12}>
        <ToolboxButtonContainer menu={toolboxCreateformMenu} title={dictionary?.formBuilderTools} />
      </Grid>
      <Grid item xs={12}>
        <ToolboxButtonContainer menu={toolboxOptionMenu} title={dictionary?.optionBuilderTool} />
      </Grid>
      {/* <ToolboxForm /> */}
    </Grid>
  )
}

export default DocumentToolbox
