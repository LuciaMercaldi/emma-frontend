export const welcome = `
   <p class="my-2">
                Ti ringraziamo per voler dedicare qualche minuto alla compilazione del questionario spostamenti
                casa/lavoro.
            </p>
            <p>
                L'azienda, nell'ambito iniziative di welfare e miglioramento della qualità ambientale, ha individuato un
                Mobility Manager Aziendale, che ha lo scopo di migliorare l'utilizzo dei mezzi di trasporto che usiamo
                per venire al lavoro, facilitare la vita dei dipendenti e ridurre l'impatto sull'ambiente dei nostri
                spostamenti, individuare eventuali situazioni critiche e, dove è possibile, intervenire per apportare
                delle migliorie.
            </p>
            <p>
                <b>
                    Procedendo dai il consenso per il trattamento dei dati che inserirai nel questionario. I dati
                    verranno usati solo per questioni legate agli spostamenti casa-lavoro, sono memorizzati su server
                    Europei da MobilitySquare per conto del committente e non vengono comunicati a terzi se non in forma
                    anonima o aggregata.
                </b>                                
            </p>

            <p class="small">
                Ai sensi del GDPR ti ricordiamo che non stai fornendo dati sensibili (cioè quelli che rivelano l'origine
                razziale od etnica, le convinzioni religiose, filosofiche, le opinioni politiche, l'appartenenza
                sindacale, relativi alla salute o alla vita sessuale), in particolare il tuo indirizzo è un dato di cui
                il tuo datore di lavoro dispone già. [<a
                    href="https://www.garanteprivacy.it/home/diritti/cosa-intendiamo-per-dati-personali"
                    target="_blank"
                    >Garante Privacy</a
                >]
            </p>
            <p class="small">
                Questa attività viene svolta ai sensi del Decreto interministeriale Mobilità sostenibile nelle aree
                urbane del 27/03/1998 (conosciuto come decreto Ronchi) e del successivo Decreto Rilancio approvato dal
                Consiglio dei Ministri il 13 maggio 2020.
            </p>
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
