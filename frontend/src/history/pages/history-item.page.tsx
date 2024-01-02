import  { useEffect, useState } from "react";
import { useParams } from "react-router";
import {useNavigate} from "react-router-dom"

interface Option {
    id: string, 
    text: string
}

interface Question {
    id: string
    text: string
    choices: Option[]
}

interface History {
    id: string
    total: number
}

interface HistoryItem {
    challengeId: string
    solvingAnswer: string
    givenAnswers: string[]
}

export default function HistoryItemPage() {
   
    const {trainingId} = useParams()
    const navigate = useNavigate()

    const [status, setStatus] = useState<number>(0);
    const [question, setQuestion] = useState<Question|undefined>(undefined);
    const [index, setIndex] = useState<number>(0);
    const [history, setHistory] = useState<History|undefined>(undefined);
    const [historyItem, setHistoryItem] = useState<HistoryItem|undefined>(undefined);

    useEffect(() => {
        fetch(`/api/history/${trainingId}`)
            .then(r => {
                setStatus(r.status)
                return r.json()
            }).then(setHistory)
    }, [trainingId]);
     
    useEffect(() => {
        if (history) {
            fetch(`/api/history/${history.id}/${index}`)
                .then(r => r.json())
                .then(setHistoryItem)
        }        
    }, [history, index]);

    useEffect(() => {
        if (historyItem) {
            fetch(`/api/questions/${historyItem.challengeId}`)
                .then(r => r.json())
                .then(setQuestion)
        }        
    }, [historyItem]);


    if (status === 0) {
        return <div>Loading</div>
    } else if (status === 404) {
        return <>
            <h2>Not Found</h2>
        </>
    } else if (status >= 400 ) {
        return <div>Beim Laden der Session ist ein Problem ({status})aufgetreten</div>
    }

    if (!history) {
        return <p>Es konnte keine Session gefunden werden.</p>        
    }

    if (!historyItem) {
        return <p>Das History Item existiert nicht.</p>
    }

    if (!question) {
        return <p>Es konnte keine Challenge zur Historie ermittelt werden.</p>
    }

    function renderOption(option: Option) {
        let elementClasses = `question-option button`

        if (historyItem!.solvingAnswer === option.id) {
            elementClasses += " right"
        } else if (historyItem!.givenAnswers.includes(option.id)) {
            elementClasses += " wrong"
        }
        return <div key={option.id} className={elementClasses}>{option.text}</div>
    }

    return <>
        <div className="session-nav">
            <div className="button" onClick={e => setIndex(Math.min(history?.total, index + 1))}>&lt;</div>
            <div className="button" onClick={e => navigate(`/training/${history?.id}`)}>X</div>
            <div className="button" onClick={e => setIndex(Math.max(index - 1, 0))}>&gt;</div> 
        </div>
        <div className="question">
            <div className="question-text">{question.text}</div>    
            <div className="question-options">{question.choices.map(renderOption)}</div>
        </div>
    </>
     
}

