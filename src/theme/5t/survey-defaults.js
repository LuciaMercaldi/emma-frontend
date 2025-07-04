export const welcome = `
   <p class="my-2">
     Benvenuto,
    </p>
    <p>
Il questionario che stai per compilare permetterà al Mobility manager "aziendale" o "scolastico" di valutare le modalità ed i mezzi che utilizzi per 
<b>IL TUO SPOSTAMENTO Casa-Lavoro o Casa-Scuola</b>, di redigere il Piano degli spostamenti Casa-Lavoro o Casa-Scuola della tua Organizzazione lavorativa o di studio in modo utile, preciso e puntuale.
</p>    <p>

Con l'obiettivo di ottimizzare e migliorare le abitudini del tuo spostamento riducendone il relativo impatto sull’ambiente, il PSCL o PSCS permetterà alla tua Organizzazione lavorativa o di studio di avviare iniziative e politiche di mobilità sostenibile, migliorare e razionalizzare gli spostamenti sistematici dei dipendenti o degli studenti e ridurre le emissioni inquinanti con lo scopo di migliorare la qualità della vita.
</p>    <p>
Le informazioni che inserirai nel questionario saranno utilizzate soltanto per le finalità descritte, trattate nel rispetto della vigente normativa in materia di privacy e dei principi di correttezza, liceità e tutela della riservatezza ed eventualmente conferite a terzi solo in forma anonima o aggregata secondo le modalità consentite dalla Legge.
</p>    <p>
Le informazioni inserite nel questionario confluiranno <b>pseudonimizzate</b> nella Piattaforma di Mobility Management denominata Emma che ha la funzione di facilitare le attività del Mobility Manager rese obbligatorie dalle norme vigenti e permettere all'Organizzazione lavorativa pubblica o privata di adottare il Piano di spostamento casa-lavoro o casa-studio. 
</p>    <p>
Questa attività è svolta ai sensi del Decreto "Rilancio" approvato dal Consiglio dei Ministri il 13 maggio 2020 e del successivo DECRETO 12 maggio 2021 "Modalità attuative delle disposizioni relative alla figura del Mobility Manager.
</p>    <p>
`;
export const welcome_eng = `
   <p class="my-2">Welcome,</p>
   <p><br>The questionnaire you are about to complete will allow the "company" or "school" mobility manager to assess the methods and means you use for <strong>your Home-Work or Home-School COMMUTE</strong>, to draw up the Home-Work or Home-School commute plan of your work or study organization in a useful, precise and accurate manner.</p>
   <p><br>With the aim of optimizing and improving your commute habits by reducing their impact on the environment, the HWCP or HSCP will enable your Work or Study Organization to set up sustainable mobility initiatives and policies, improve and streamline systematic employee or student commute, and reduce polluting emissions with the aim of improving the quality of life.</p>
   <p><br>The information you enter in the survey will be used only for the purposes described, processed in accordance with current privacy legislation and the principles of fairness, lawfulness and protection of confidentiality and possibly given to third parties only in anonymous or aggregate form in the manner permitted by Law.</p>
   <p><br>The information entered in the questionnaire will merge, pseudonymized, into the Mobility Management Platform called EMMA, which has the function of facilitating the activities of the Mobility Manager made mandatory by the regulations in force and allow the public or private Work Organization to adopt the Home-Work or Home-Study Commute Plan.</p>
   <p><br>This activity is carried out in accordance with the “Rilancio” Decree approved by the Council of Ministers on May 13, 2020 and the later Decree dated May 12, 2021 "Implementing Methods for the Provisions on the Figure of the Mobility Manager.</p><p>&nbsp;</p>
`;

export const invitation_tpl = `Gentile {{{nome}}}\r\r
ti ringraziamo per il tuo interesse nel questionario {{{titolo}}}\r\r
Per procedere con la compilazione usa il seguente link\r\r
{{{link}}}\r\r
Grazie`;

export const reminder_tpl = `Gentile {{{nome}}}\r\r
ad oggi risulta che non hai ancora compleato il questionario {{{titolo}}}\r\r
Per procedere con la compilazione usa il seguente link\r\r
{{{link}}}\r\r
Grazie`;

export const invitation_subject = "Questionario Mobility Manager - Invito";
export const reminder_subject = "Questionario Mobility Manager - Sollecito";

export const survey_components = {
		"questionario-generale-azienda": () => import("@/components/QuestionarioAzienda/Generale/Azienda.vue"),
		"questionario-generale-scuola": () => import("@/components/QuestionarioAzienda/Generale/Scuola.vue"),    
		"questionario-sede-azienda": () => import("@/components/QuestionarioAzienda/Sede/Azienda.vue"),
		"questionario-sede-scuola": () => import("@/components/QuestionarioAzienda/Sede/Scuola.vue"),
};
