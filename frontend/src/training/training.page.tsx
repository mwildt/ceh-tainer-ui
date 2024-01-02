import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { patch, json } from "../utils/fetch-utils";
import { useNavigate } from "react-router-dom"
import { Training } from "./model";
import { ProgressBar, ProgressStats } from "./progress.widgets";

interface Option {
    id: string, 
    text: string
}

interface Question {
    id: string
    text: string
    choices: Option[]
}

export default function TrainingPage() {
   
    const {trainingId} = useParams() 
    const navigate = useNavigate()

    const [status, setStatus] = useState<number>(0);
    const [training, setTraining] = useState<Training|undefined>(undefined);
    const [question, setQuestion] = useState<Question|undefined>(undefined);
    const [wrongAnswers, setWrongAnswers] = useState<Option[]>([]);
    const [selectedChoice, setSelectedChoice] = useState<Option|undefined>(undefined);

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
        setSelectedChoice(undefined)
    }, [training]);

    useEffect(() => {
        if (selectedChoice) {
            fetch(`/api/trainings/${training!.id}`, patch(json({answer: selectedChoice.id})))
                .then(r => r.json())
                .then(r => {
                    setSelectedChoice(undefined)
                    if (r.success){
                         setTraining(r)
                    } else {
                        setWrongAnswers(wrongAnswers.concat(selectedChoice))
                    }
                });    
        }
    }, [selectedChoice, training]);
    
    function renderOption(option: Option) {
        const elementClasses = `question-option button${wrongAnswers.includes(option) ? " wrong": ""}${(selectedChoice === option)?" logged":""}`
        return <div key={option.id} className={elementClasses} onClick={e => setSelectedChoice(option)}>{option.text}</div>
    }

    if (status === 0) {
        return <div>Loading</div>
    } else if (status === 404) {
        return <>
            <h2>Not Found</h2>
            <p>
                Die gesuchte Training existiert leider nicht oder nicht mehr.
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

    return <div>
                <div className="progress">
                    <ProgressBar stats={training.stats} />
                </div>
                <div className="training-nav">
                    <div className="button" onClick={e => navigate(`/training/${trainingId}/history`)}>&lt;</div>
                    <div className="button" onClick={e => navigate("/")}>Home</div> 
                    <div><ProgressStats stats={training.stats} /> </div>
                </div>
                <div className="question">
                    <div className="question-text">{question.text}</div>    
                    <div className="question-options">{question.choices.map(renderOption)}</div>
                </div>
            </div>
     
}

