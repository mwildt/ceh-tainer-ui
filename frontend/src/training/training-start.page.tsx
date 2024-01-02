import { useNavigate } from "react-router-dom"
import { post } from "../utils/fetch-utils";

export default function TrainingStartPage() {
   
    const navigate = useNavigate();
     
    function create() {
            fetch("/api/trainings/", post())
                .then(r => r.json())
                .then(training => navigate(`/training/${training.id}`))
    }

    return <>
                <h2>Neue Training starten</h2>

                <p> 
                    Hier kann eine neue Training begonnen werden.
                    Diese ist später nur noch über die Id verfügbar.
                    Bitte also den Link Bookmarken, falls ein späterer Zugriff stattfinden soll.
                </p>

                <p> 
                    Eine Verschlüsselung oder ein Schutz der Training über andere Elemente findet nicht statt.
                </p>

                <button className="button" onClick={e => create()}>Training Starten</button>

            </>
     
}