export interface MemoryStatus {
  deviceMemory: number,
  totalJSHeapSize: number | null,
  usedJSHeapSize: number | null,
  jsHeapSizeLimit: number | null
}

export function useMemoryStatus(initialMemoryStatus?: MemoryStatus): { unsupported: true } & Partial<MemoryStatus> |  {
  unsupported: false,
} & MemoryStatus
