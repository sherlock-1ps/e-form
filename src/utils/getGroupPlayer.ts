export const getGroupPlayerGradient = (tier: number): string => {
  const gradients: Record<number, string> = {
    1: 'linear-gradient(90deg, #D8E8FF, #FFC8E3, #D8E8FF)',
    2: 'linear-gradient(90deg, #EEF7BE, #9EF7F1, #EEF7BE)',
    3: 'linear-gradient(90deg, #FFB0C2, #FFDFE1, #FFB0C2)',
    4: 'linear-gradient(90deg, #FAD1D9, #FBF5BB, #FAD1D9)',
  }

  return gradients[tier] || gradients[1]
}


export const getGroupLabelPlayer = (tier: number): string => {
  const tierLabels: Record<number, string> = {
    1: 'New User',
    2: 'Common User',
    3: 'Professional',
    4: 'VIP',
  }

  return tierLabels[tier] || 'Unknown'
}
