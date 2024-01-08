export interface Training {
    id: string,
    challenge: string
    currentChallengeFailed: boolean
    currentLevel: number
    currentCount: number
    stats: Stats
    challengeStats: ChallengeStats
    created: string
    updated: string
}

export interface Stats {
    total: number
    passed: number
    failed: number
    currentAttempts: number
}

export interface ChallengeStats {
    total: number
    initial: number
    proceeding: number
    done: number
}