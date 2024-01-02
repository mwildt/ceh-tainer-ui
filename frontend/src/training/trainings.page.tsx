import moment from "moment";
import {useEffect, useState, ReactElement} from "react";
import {Link} from "react-router-dom"
import {Training} from "./model"
import { ProgressBar, ProgressStats } from "./progress.widgets";

export default function TrainingsPage() {

    const [trainings, setTrainings] = useState<Training[]|undefined>(undefined);
     
    useEffect(() => {
        fetch("/api/trainings/")
            .then(r => r.json())
            .then(setTrainings)
    }, []);

    if (undefined === trainings) {   
        return <>
            <h2>Existierende Trainings</h2>
            <p>... daten werden geladen</p>
        </>
    }

    function renderTraining(training: Training): ReactElement {

        const created = moment(training.created);
        const updated = moment(training.updated);
        const link = `/training/${training.id}`
        return <div className="training-item" key="{training.id}">
            <ProgressBar stats={training.stats} />
            <div>
                <Link to={link} >{training.id}</Link> <ProgressStats stats={training.stats}/>
            </div>
            <small className="label info">started: {created.fromNow()}</small>
            <small className="label info">updated: {updated.fromNow()}</small>
        </div>
    }

    return <>
            <h2>Existierende Trainings</h2>
            <div className="training-list">{trainings.map(renderTraining)}</div>
        </>
     
}