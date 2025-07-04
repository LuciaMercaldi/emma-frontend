<template>
    <div class="container">
        <template>
            <b-breadcrumb :items="items"></b-breadcrumb>
        </template>
        <b-row>
            <b-col>
                <h1>Privacy Policy</h1>
                <h2>Titolare del trattamento</h2>
                Il titolare del trattamento dei dati è l'azienda committente a cui fanno riferimento i lavoratori o gli studenti coinvolti.

                <h2>Finalità del trattamento</h2>
                I dati caricati sullla piattaforma saranno trattati per il perseguimento delle seguenti finalità:
                <ul>
                    <li>servizio di redazione del PSCL,</li>
                    <li>erogazione del questionario,</li>
                    <li>elaborazione dell’analisi di accessibilità, ivi compreso trattamento di dati personali (non particolari) di dipendenti e collaboratori.</li>
                </ul>

                Il fine dell’indagine è di raccogliere informazioni sullo spostamento casa-lavoro dei dipendenti, come l’origine e destinazione, le modalità di spostamento,
                frequenza dello spostamento, ecc., con lo scopo di integrare il PSCL con ulteriori politiche virtuose sul tema di mobilità e quindi promuovere la mobilità
                sostenibile a livello aziendale. Verranno trattati i seguenti dati:
                <ul>
                    <li>età</li>
                    <li>indirizzo di origine dello spostamento casa-lavoro</li>
                    <li>luogo di lavoro</li>
                    <li>frequenza dello spostamento casa-lavoro</li>
                    <li>durata dello spostamento casa-lavoro</li>
                    <li>distanza dello spostamento casa-lavoro</li>
                    <li>spostamenti accessori legati allo spostamento casa-lavoro</li>
                    <li>costo mensile dello spostamento casa-lavoro</li>
                    <li>mezzo utilizzato per lo spostamento casa-lavoro</li>
                    <li>modalità di lavoro, es. smart working, turni, straordinario ecc.</li>
                </ul>

                <h2>Responsabile del trattamento</h2>
                Il trattamento sarà svolto dalla iMpronta di Massimo INFUNTI fino a revoca o conclusione del contratto principale.

                <h2>Utilizzo dei dati</h2>
                Il responsabile del trattamento tratterà i dati personali soltanto su istruzione documentata del titolare, anche in caso di trasferimento di dati personali verso un
                paese terzo o un’organizzazione internazionale, salvo che lo richieda una disposizione normativa;

                <h2>Accessi autorizzati</h2>
                Il Responsabile del trattamento garantisce che le persone autorizzate al trattamento dei dati personali siano impegnate alla riservatezza o abbiano un adeguato
                obbligo legale di riservatezza;
                <h2>Misure</h2>
                <p>Il Responsabile del trattamento adotta tutte le misure richieste ai sensi dell’art. 32 del Reg.UE 679/2016</p>
                <p>
                    Il Responsabile del trattamento si impegna ad assistere il titolare del trattamento con misure tecniche e organizzative adeguate, nella misura in cui ciò sia
                    possibile, al fine di soddisfare l'obbligo del titolare del trattamento di dare seguito alle richieste per l'esercizio dei diritti dell'interessato;
                </p>
                <p>
                    Il Responsabile del Trattamento si impegna ad assistere il titolare del trattamento nel garantire il rispetto degli obblighi di cui agli articoli da 32 a 36 del
                    Regolamento, tenendo conto della natura del trattamento e delle informazioni a sua disposizione;
                </p>
                <p>
                    Il Responsabile del Trattamento, al termine della prestazione contrattuale, si impegna a restituire tutti i dati personali relativi ai trattamenti effettuati,
                    nonché a cancellare le copie esistenti, salvo il caso in cui la conservazione da parte del Responsabile sia prevista dal diritto dell'Unione o degli Stati
                    membri. Non saranno eliminati i dati aggregati che non consento di risalire all’identità dei singoli lavoratori.
                </p>
                <p>
                    Il Responsabile del Trattamento metterà a disposizione del titolare del trattamento tutte le informazioni necessarie per dimostrare il rispetto degli obblighi
                    dell’art.28 Reg.UE 679/2016 e consentirà e contribuirà alle attività di revisione, comprese le ispezioni, realizzate dal titolare del trattamento o da un altro
                    soggetto da questi incaricato.
                </p>
                <p>
                    Il responsabile del trattamento informerà immediatamente il titolare del trattamento qualora, a suo parere, un'istruzione ricevuta violi il Regolamento
                    UE/679/2016 o altre disposizioni, nazionali o dell'Unione, relative alla protezione dei dati.
                </p>
                <p>
                    I dati trattati elettronicamente saranno sempre ospitati su server posizionati all’interno dell’UE, dotati delle consuete ed aggiornate misure di sicurezza
                    (accessi SSH, firewall, PCI compliance, antivirus). La trasmissione dei dati tra l’utilizzatore ed il sistema avverrà sempre su protocollo criptato (https).
                    Solo gli utenti dotati di opportune autorizzazioni possono accedere ai dati. Contatto in caso di Data Breach: moma@imrponta48.it
                </p>
            </b-col>
        </b-row>
    </div>
</template>
<script>
export default {
	name: "Privacy",
	data() {
		return {
			items: [
				{
					text: "Home",
					href: "/",
				},
				{
					text: "Privacy",
					active: true,
				},
			],
		};
	},
};
</script>
