import { Stats } from "./model";

function total(stats: Stats) {
    console.warn('status', stats)
    return stats!.failed + stats!.passed
}

export function ProgressBar(props: {stats: Stats}) {
    const t = total(props.stats);
    function progress() {        
        return t === 0 ? 0 : Math.round((props.stats!.failed * (100 / t)))
    }
    return <div className="progress-bar">
        <div className="progress-bar-indicator" style={{width: `${progress()}%`}}/>
    </div>
}

export function ProgressPercentage(props: {stats: Stats}) {
    const t = total(props.stats)
    const progressInPercent =  100 - (t === 0 ? 0 : Math.round((props.stats!.failed * (100 / t))))

    return <>{progressInPercent}%</>
}

export function ProgressStats(props: {stats: Stats}) {
    const t = total(props.stats);
    return <>{props.stats!.passed}/{t} (<ProgressPercentage stats={props.stats}></ProgressPercentage>)</>
}


