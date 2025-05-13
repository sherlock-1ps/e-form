export function cleanPayload<T extends Record<string, any>>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        !(Array.isArray(value) && value.length === 0) &&
        value !== ''
    )
  ) as T
}
