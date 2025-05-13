export const getTagPlayerGradient = (tag: number | string): string => {
  const gradients: Record<number | string, string> = {
    1: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
    2: 'linear-gradient(90deg, #00C853, #00E676, #00C853)',
    3: 'linear-gradient(90deg, #8A2BE2, #4B0082, #8A2BE2)',
    4: 'linear-gradient(90deg, #FB6328, #CB0962, #FB6328)',
    5: 'linear-gradient(90deg, #5B86EE, #111880, #5B86EE)',
  }

  return gradients[tag] || 'linear-gradient(90deg, #CCCCCC, #AAAAAA, #CCCCCC)'
}


export const getTagLabelPlayer = (tag: number | string): string => {
  const tagLabels: Record<number | string, string> = {
    1: 'Top Player',
    2: 'Top Spender',
    3: 'Slot Addict',
    4: 'Casino Addict',
    5: 'Sport Addict',
  }

  return tagLabels[tag] || 'Unknown'
}
