'use client'
import Grid from '@mui/material/Grid'
import CardCount from '@/components/card/CardCount'
import { useDictionary } from '@/contexts/DictionaryContext'
import {
  InsertDriveFileOutlined,
  Task,
  PushPin,
  ViewList,
  AssignmentTurnedIn,
  Add,
  DoneAll,
  PendingActions,
  Folder
} from '@mui/icons-material'
import { useAuthStore } from '@/store/useAuthStore'

const WorkLabel = ({ countList }: any) => {
  const { dictionary } = useDictionary()
  const profile = useAuthStore(state => state.profile)
  const isAdmin = profile && ['1006', '1026'].some(id => profile.USER_GROUP_LISTS_ID.includes(id))
  const workCountSpece = isAdmin ? 2.4 : 3

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={workCountSpece}>
        <CardCount
          title={dictionary?.documentsInProcess}
          count={countList?.result?.data[0]?.Total || 0}
          baseColor='rgba(116, 198, 250, 0.25)'
          textColor='rgb(116, 198, 250)'
          icon={Task}
          path='user/dashboard'
        />
      </Grid>
      <Grid item xs={12} md={workCountSpece}>
        <CardCount
          title={dictionary?.pendingDocuments}
          count={countList?.result?.data[1]?.Total || 0}
          baseColor='rgba(30, 107, 175, 0.25)'
          textColor='rgb(30, 107, 175)'
          icon={ViewList}
          path='user/allTask'
        />
      </Grid>

      <Grid item xs={12} md={workCountSpece}>
        <CardCount
          title={dictionary?.cardDoneWork}
          count={countList?.result?.data[2]?.Total || 0}
          baseColor='rgba(23, 87, 155, 0.25)'
          textColor='rgb(23, 87, 155)'
          icon={AssignmentTurnedIn}
          path='user/doneTask'
        />
      </Grid>

      <Grid item xs={12} md={workCountSpece}>
        <CardCount
          title={dictionary?.cardOwnWork}
          count={countList?.result?.data[3]?.Total || 0}
          baseColor='rgba(23, 87, 155, 0.25)'
          textColor='rgb(23, 87, 155)'
          icon={AssignmentTurnedIn}
          path='user/owner'
        />
      </Grid>

      {isAdmin ? (
        <Grid item xs={12} md={workCountSpece}>
          <CardCount
            title={dictionary?.allDocumentsInTheSystem}
            count={countList?.result?.data[4]?.Total || 0}
            baseColor='rgba(23, 87, 155, 0.25)'
            textColor='rgb(23, 87, 155)'
            icon={Folder}
            path='user/allSysDoc'
          />
        </Grid>
      ) : null}
    </Grid>
  )
}

export default WorkLabel
