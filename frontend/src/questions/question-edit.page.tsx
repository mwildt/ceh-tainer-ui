import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom"
import {header, json, patch} from "../utils/fetch-utils";

interface Option {
    id: string
    text: string
}

interface Question {
    id: string
    text: string
    choices: Option[]
}

export default function QuestionEditPage() {
   
    const {questionId} = useParams()
    const navigate = useNavigate()

    const [status, setStatus] = useState<number>(0);
    const [question, setQuestion] = useState<Question|undefined>(undefined);
    const [selectedChoice, setSelectedChoice] = useState<string|undefined>(undefined);
    const [apiKey, setApiKey] = useState<string|undefined>(undefined);
    const [lock, setLock] = useState<boolean>(false);
    const [error, setError] = useState<string|undefined>(undefined);

    useEffect(() => {
        fetch(`/api/questions/${questionId}`)
            .then(r => {
                setStatus(r.status)
                return r.json()
            }).then(setQuestion)
    }, [questionId]);

    function save() {
        fetch(`/api/questions/${questionId}`, patch(json(question, header({'x-api-key': btoa(apiKey!)}))),)
            .then(response => {
                if (!response.ok) {
                    setError("Beim Speichern ist leider ein Fehler aufgetretn.")
                } else {
                    navigate(-1)
                }
            })
    }
    
    function renderOption(option: Option) {
        return <div key={option.id}>
            <input type="text"
                   disabled={lock}
                   className="form-control"
                   value={option.text}
                   onChange={e => setOption(option, e.target.value)}
        /></div>
    }

    function setText(value: string) {
        setQuestion(Object.assign({}, question, {text: value}))
    }

    function setOption(option: Option, text: string) {
        option.text = text
        setQuestion(Object.assign({}, question, {
            options: question?.choices?.map(c => c.id == option.id ? option : c)
        }))
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
    if (!question) {
        return <div>Loading</div>
    }

    function renderSelectOption(option: Option) {
        const elementClasses = `question-option ${lock ? "" : "button"} ${(selectedChoice === option.id)?" logged":""}`
        return <div key={option.id} className={elementClasses} onClick={e => updateChoice(option.id)}>{option.text}</div>
    }

    function updateChoice(value : string|undefined) {
        if (!lock) {
            setSelectedChoice(value)
        }
    }

    return <div>
            <div className="question-editor">
                    {lock ? <>
                        <div className="question-text">{question.text}</div>
                    </> : <>
                        Frage:
                        <div className=""><textarea
                            className="form-control"
                            value={question.text}
                            disabled={lock}
                            onChange={e => setText(e.target.value)}
                            rows={4}
                            cols={40}
                        ></textarea></div>

                        Antwortoptionen
                        <div className="question-options">
                            {question.choices.map(renderOption)}
                        </div>

                        Welche Option ist die richtige?
                    </>}
                    <div className="question-options">
                        {question.choices.map(renderSelectOption)}
                        {lock ? '' : <>
                            Sicher? Oder die richtige Antwort so lassen wie bisher?
                            <div className={ `question-option ${lock ? "" : "button"} ${(!selectedChoice)?" logged":""}`} onClick={e => updateChoice(undefined)}>DO NOT UPDATE</div>
                        </>}
                    </div>

                 </div>

                {lock ?  <>
                    Und wir brauchen noch einen Schlüssel für die Änderung...
                    <div>
                        <input className="form-control" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} />
                    </div>

                    {error ? <div className="error-container">
                        <span>{error}</span>
                    </div> : ''}
                    <button className="button" onClick={e => setLock(false)}>Abbrechen</button>
                    <button className="button" onClick={e => save()}>Ja, wirklich</button>
                </> : <button className="button" onClick={e => setLock(true)}>Speichern</button>}
    </div>


}

