import {useEffect, useReducer, useState} from "react";
import { useParams } from "react-router";
import { patch, json } from "../utils/fetch-utils";
import {Link, useNavigate} from "react-router-dom"
import { Training } from "./model";
import {ProgressBar, ProgressChallengeStats, ProgressPercentage, ProgressStats} from "./progress.widgets";
import {getSpaceUntilMaxLength} from "@testing-library/user-event/dist/utils";

interface Option {
    id: string, 
    text: string
}

interface Question {
    id: string
    text: string
    choices: Option[]
    media: string[]
}

interface ToggleOptionAction {
    option: Option
    submit: boolean
    reset: boolean
}

interface SelectionState {
    options: Option[]
    submit: boolean

}

const initialSelectionState : SelectionState = {submit: false, options: [] as Option[]}

export default function TrainingPage() {
   
    const {trainingId} = useParams() 
    const navigate = useNavigate()

    const [status, setStatus] = useState<number>(0);
    const [training, setTraining] = useState<Training|undefined>(undefined);
    const [question, setQuestion] = useState<Question|undefined>(undefined);
    const [wrongAnswers, setWrongAnswers] = useState<Option[]>([]);
    const [selectionState, setSelectionState] = useState<SelectionState>(initialSelectionState);


    useEffect(() => {
        fetch(`/api/trainings/${trainingId}`)
            .then(r => {
                setStatus(r.status)
                return r.json()
            }).then(setTraining)
    }, [trainingId]);

    useEffect(() => {
        if (training) {
            fetch(`/api/questions/${training.challenge}`)
                .then(r => r.json())
                .then(setQuestion)
        }        
        setWrongAnswers([])
    }, [training]);

    useEffect(() => {
       console.warn(selectionState)
       if (selectionState.submit) {
           fetch(`/api/trainings/${training!.id}`, patch(json({answer: selectionState.options.map(c => c.id)})))
               .then(r => r.json())
               .then(r => {
                   setSelectionState(initialSelectionState)
                   if (r.success){
                       setTraining(r)
                   } else {
                       setWrongAnswers(wrongAnswers.concat(selectionState.options))
                   }
               });
       }
    }, [selectionState]);


    function toggleOption(option :Option , execSubmit: boolean) {
        setSelectionState({
            options: selectionState.options.includes(option)
                ? selectionState.options.filter(opt => opt !== option)
                : selectionState.options.concat(option)
            ,
            submit: execSubmit
        })
    }

    function runValidation() {
        setSelectionState(Object.assign({} as SelectionState, selectionState, {
            submit: true
        }))
    }

    function renderOption(option: Option) {
        const elementClasses = `question-option button${wrongAnswers.includes(option) ? " wrong": ""}${(selectionState.options.includes(option))?" logged":""}`
        return <div key={option.id} className={elementClasses}>
            <div className="option-text" onClick={e => toggleOption(option, true)} >{option.text}</div>
            <span className="option-check" onClick={e => toggleOption(option, false)}>[{selectionState.options.includes(option) ? 'x' : '_'}]</span>
        </div>
    }

    if (status === 0) {
        return <div>Loading</div>
    } else if (status === 404) {
        return <>
            <h2>Not Found</h2>
            <p>
                Das gesuchte Training existiert leider nicht oder nicht mehr.
                Möglicherweise wurde sie aufgrund von Inaktivität beendet.
            </p>
            <button className="button" onClick={e => navigate("/")}>Zum Start</button> 
        </>
    } else if (status >= 400 ) {
        return <div>Beim Laden der Training ist ein Problem ({status})aufgetreten</div>
    }
    if (!training || !question) {
        return <div>Loading</div>
    }

    function openHistory() {
        if (training!.stats!.total > 1) {
            navigate(`/training/${trainingId}/history`)
        }
    }
    function renderMedia(media: string) {
        return  <div key={media} ><img alt="Ein Bild zu der Frage." src={`/api/media/${media}`} /></div>
    }

    return <div>
                <div className="progress">
                    <ProgressBar stats={training.stats} />
                </div>
                <div className="training-nav">
                    <div className="button" onClick={e => openHistory()}>&lt;</div>
                    <div className="button" onClick={e => navigate("/")}>Home</div> 
                    <div><ProgressChallengeStats stats={training.challengeStats} /> </div>
                </div>
                <div className="question">
                    <div className="question-text">{question.text}</div>

                    <div className="question-media">{question.media.map(renderMedia)}</div>

                    <div className="question-options">

                        {question.choices.map(renderOption)}

                        {selectionState.options.length > 0 ?
                            <div className="margin-top-extend question-option button">
                                <div className="option-text" onClick={e => runValidation()} >validate selected answer</div>
                            </div> : ''}
                    </div>

                    <div className="footer">
                        <div className="challenge-footer">
                            <small>level: {training.currentLevel}, count: {training.currentCount}</small> | <Link to={`/question/${question.id}/editor`}>edit</Link>
                        </div>
                        <div className="training">
                            <small><ProgressPercentage stats={training.stats} /></small>
                        </div>
                    </div>


                </div>
            </div>
     
}

