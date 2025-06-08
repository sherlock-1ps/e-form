// MUI Imports
import type { StepIconProps } from '@mui/material/StepIcon'

// Third-party Imports
import classnames from 'classnames'

// Style Imports
import styles from './styles.module.css'

type CustomStepIconProps = StepIconProps & { index?: number }

const StepperCustomDot = (props: CustomStepIconProps) => {
  const { active, completed, error, index } = props

  const isStart = index === 0

  if (error) {
    return <i className='tabler-alert-triangle-filled text-xl scale-[1.2] text-error' />
  } else if (completed) {
    return (
      <div
        className={classnames(styles.stepperCustomDot, 'flex items-center justify-center', {
          [styles.completedStepperCustomDot]: completed,
          ' bg-success border-success': isStart
        })}
      >
        <i className='tabler-check text-sm text-white' />
      </div>
    )
  } else {
    return (
      <div
        className={classnames(styles.stepperCustomDot, {
          [styles.activeStepperCustomDot]: active
        })}
      />
    )
  }
}

export default StepperCustomDot
