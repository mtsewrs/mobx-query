export function deflateHelper(data: any) {
  function deflate(data: any): any {
    if (!data || typeof data !== 'object') return data
    if (Array.isArray(data)) return data.map(deflate)
    // GQL object with non-root type, return object with all props deflated
    const snapshot: any = {}
    for (const key in data) {
      snapshot[key] = deflate(data[key])
    }
    return snapshot
  }

  return deflate(data)
}
