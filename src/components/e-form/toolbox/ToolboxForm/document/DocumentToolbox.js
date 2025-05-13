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

const DocumentToolbox = () => {
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Typography variant='h5'>ออกแบบเอกสาร</Typography>
      </Grid>

      {/* <Grid item xs={12}>
        <ToolboxButtonContainer menu={toolboxLayoutMenu} title={'เครื่องมือเอกสารพื้นฐาน'} />
      </Grid> */}

      <Grid item xs={12}>
        <ToolboxGrid menu={toolboxGridMenu} title={'เครื่องมือ GRID'} />
      </Grid>
      <Grid item xs={12}>
        <ToolboxButtonContainer menu={toolboxDocumentBaseMenu} title={'เครื่องมือเอกสารพื้นฐาน'} />
      </Grid>
      <Grid item xs={12}>
        <ToolboxButtonContainer menu={toolboxCreateformMenu} title={'เครื่องมือสร้างแบบฟอร์ม'} />
      </Grid>
      <Grid item xs={12}>
        <ToolboxButtonContainer menu={toolboxOptionMenu} title={'เครื่องมือสร้างตัวเลือก'} />
      </Grid>
      {/* <ToolboxForm /> */}
    </Grid>
  )
}

export default DocumentToolbox
