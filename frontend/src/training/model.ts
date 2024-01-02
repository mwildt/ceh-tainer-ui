export interface Training {
    id: string,
    challenge: string
    stats: Stats
    created: string
    updated: string
}

export interface Stats {
    total: number
    passed: number
    failed: number
    currentAttempts: number
}