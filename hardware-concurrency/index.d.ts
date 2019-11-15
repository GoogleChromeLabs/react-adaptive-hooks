export function useHardwareConcurrency(): { unsupported: true } | { unsupported: false, numberOfLogicalProcessors: number }
