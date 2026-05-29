// Al læringsdata samlet et sted. Dansk parafrase — ingen lange citater fra Sofies Verden.

/** Gamle symbol-id'er fra tidligere versioner → nye detektivstile */
const SYMBOL_LEGACY_IDS = {
  lup: 'spormagnet',
  stjerne: 'idegnist',
  bog: 'notatninja',
  kompas: 'tradjaeger',
}

export const SYMBOLS = [
  {
    id: 'spormagnet',
    label: 'Spormagnet',
    image: 'spormagnet.png',
    tagline: 'Finder det skjulte i billedet',
    hint: 'Du opdager små spor i billedet, som andre overser.',
    passFocus: '50% 74%',
    accent: '#357fc4',
    accentSoft: '#dcecf8',
  },
  {
    id: 'idegnist',
    label: 'Idegnist',
    image: 'idegnist.png',
    tagline: 'Stiller spørgsmål der åbner sagen',
    hint: 'Du får de spørgsmål, der åbner sagen i stedet for gæt.',
    passFocus: '50% 73%',
    accent: '#d4a52f',
    accentSoft: '#fff2b8',
  },
  {
    id: 'notatninja',
    label: 'Notatninja',
    image: 'notatninja.png',
    tagline: 'Skriver spor ned så du husker dem',
    hint: 'Du skriver spor og svar ned, så intet forsvinder.',
    passFocus: '50% 74%',
    accent: '#7161a8',
    accentSoft: '#ebe8f4',
  },
  {
    id: 'tradjaeger',
    label: 'Trådjæger',
    image: 'tradjaeger.png',
    tagline: 'Ser hvordan spor hænger sammen',
    hint: 'Du ser, hvordan spor, tid og vidner hænger sammen.',
    passFocus: '50% 75%',
    accent: '#b84a4a',
    accentSoft: '#f8e8e8',
  },
]

export function normalizeSymbolId(symbolId) {
  if (typeof symbolId !== 'string' || !symbolId) return SYMBOLS[0].id
  const mapped = SYMBOL_LEGACY_IDS[symbolId] || symbolId
  return SYMBOLS.some((s) => s.id === mapped) ? mapped : SYMBOLS[0].id
}

// 5 spor i scenen — barnet finder dem ved at trykke på hotspots i et "billede"
export const CLUES = [
  {
    id: 'clue-1',
    title: 'Et frosset øjeblik',
    text: 'Billedet viser kun et øjeblik.',
    hotspot: { x: 50, y: 15 },
    miloLine: 'Vent lidt… ser vi hele sagen her?',
  },
  {
    id: 'clue-2',
    title: 'Før billedet',
    text: 'Vi ved ikke, hvad der skete før.',
    hotspot: { x: 73, y: 23, size: 'lg' },
    miloLine: 'Det der lugter af en skygge!',
  },
  {
    id: 'clue-3',
    title: 'Efter billedet',
    text: 'Vi ved ikke, hvad der skete efter.',
    hotspot: { x: 49, y: 75, size: 'lg' },
    miloLine: 'Godt spor!',
  },
  {
    id: 'clue-4',
    title: 'Kun en delte',
    text: 'Kun en person har delt billedet.',
    hotspot: { x: 32, y: 52 },
    miloLine: 'Hmm. Kun en vinkel?',
  },
  {
    id: 'clue-5',
    title: 'Gæt uden svar',
    text: 'Nogle gætter uden at spørge.',
    hotspot: { x: 66, y: 89 },
    miloLine: 'Det er et gæt, ikke et bevis.',
  },
]

// 4 kategorier — barnet skal placere kortene rigtigt
export const SORT_CATEGORIES = [
  { id: 'gæt', label: 'Gæt', color: 'warning', hint: 'Noget vi tror, men ikke ved.' },
  { id: 'spor', label: 'Spor', color: 'milo-blue', hint: 'En detalje vi har set.' },
  { id: 'bevis', label: 'Bevis', color: 'evidence-green', hint: 'Noget der kan tjekkes.' },
  { id: 'spørgsmål', label: 'Stort spørgsmål', color: 'question-purple', hint: 'Et spørgsmål der åbner sagen.' },
]

// 6 sorteringskort — hver hører til en kategori
export const SORT_CARDS = [
  { id: 'sc-1', text: 'Alle ved, hvad der skete.', correct: 'gæt' },
  { id: 'sc-2', text: 'Billedet viser kun en vinkel.', correct: 'spor' },
  { id: 'sc-3', text: 'Vi har spurgt tre personer, der så situationen.', correct: 'bevis' },
  { id: 'sc-4', text: 'Hvordan ved vi, om billedet viser hele sandheden?', correct: 'spørgsmål' },
  { id: 'sc-5', text: 'Hvis mange tror det, må det være sandt.', correct: 'gæt' },
  { id: 'sc-6', text: 'Der mangler information om, hvad der skete før.', correct: 'spor' },
]

// 4 spørgsmålsnøgler — kun en er den rigtige nøgle
export const QUESTION_KEYS = [
  { id: 'q-1', text: 'Hvor mange likes fik billedet?', correct: false, hint: 'Tal fortæller os ikke, hvad der er sandt.' },
  { id: 'q-2', text: 'Hvem delte det først?', correct: false, hint: 'Det er et spor — men ikke det filosofiske spørgsmål.' },
  { id: 'q-3', text: 'Hvordan ved vi, om billedet viser hele sandheden?', correct: true, hint: 'Det åbner sagen!' },
  { id: 'q-4', text: 'Kan jeg bare tro på det?', correct: false, hint: 'Et godt spørgsmål, men ikke det skarpeste.' },
]

// 4 brikker — barnet bygger forklaringen i rigtig rækkefølge
export const EXPLANATION_PIECES = [
  { id: 'p-1', text: 'Vi så et billede.', order: 1, role: 'Start' },
  { id: 'p-2', text: 'Billedet viste kun en del.', order: 2, role: 'Vinkel' },
  { id: 'p-3', text: 'Mange gættede på resten.', order: 3, role: 'Skygge' },
  { id: 'p-4', text: 'Derfor skulle vi undersøge mere.', order: 4, role: 'Indsigt' },
]

// Tre vidner — barnet vælger spørgsmål og lærer at åbne spørgsmål giver mere sandhed end ledende.
export const WITNESSES = [
  {
    id: 'w-jonas',
    name: 'Jonas',
    role: 'Klassekammerat',
    distance: 'Stod ved hjørnet — lidt for langt væk.',
    avatar: 'jonas',
    image: 'milo-klassekammerat.png',
    portrait: { skin: '#f6cfae', hair: '#3a2615', accessory: 'cap', accessoryColor: '#357fc4' },
    intro: 'Jeg så det ovre fra basket-banen. Det så vildt ud!',
    truth: 'Han hørte ikke det, der blev sagt. Han gættede ud fra det, han troede han så.',
    questions: [
      { id: 'q-jonas-1', text: 'Var du tæt nok på til at høre noget?', good: true, answer: 'Tjaa… ikke helt. Jeg så bare arme og en latter.' },
      { id: 'q-jonas-2', text: 'Hvorfor stoppede du dem ikke?', good: false, answer: 'Hvad? Jeg ved ikke engang, om det skulle stoppes.' },
      { id: 'q-jonas-3', text: 'Hvad så du helt præcist?', good: true, answer: 'En arm op i luften. Jeg troede, det var et skub. Men det kan også have været et high-five.' },
    ],
  },
  {
    id: 'w-olivia',
    name: 'Olivia',
    role: 'Lærer',
    distance: 'Hørte om sagen i lærerværelset.',
    avatar: 'olivia',
    image: 'milo-lærer.png',
    portrait: { skin: '#e6b591', hair: '#a14b2a', accessory: 'glasses', accessoryColor: '#1f2933' },
    intro: 'Jeg har hørt om sagen fra to elever. Men jeg så det ikke selv.',
    truth: 'Hun har kun rygtet — ikke spor. Hun ved, hun bør spørge videre, før hun dømmer.',
    questions: [
      { id: 'q-olivia-1', text: 'Var det dig, der så det selv?', good: true, answer: 'Nej. Jeg har det fra en elev, som har det fra en anden elev.' },
      { id: 'q-olivia-2', text: 'Hvorfor straffer du dem ikke bare?', good: false, answer: 'Jeg straffer ingen baseret på rygter. Det ville være urimeligt.' },
      { id: 'q-olivia-3', text: 'Hvor kommer historien fra?', good: true, answer: 'Det startede som et opslag i en gruppe. Tre elever har retweetet det. Ingen har set det selv.' },
    ],
  },
  {
    id: 'w-sara',
    name: 'Sara',
    role: 'Ven til en på billedet',
    distance: 'Var helt tæt på, men er parti.',
    avatar: 'sara',
    image: 'milo-ven.png',
    portrait: { skin: '#f8d6b3', hair: '#1f2933', accessory: 'braids', accessoryColor: '#d99058' },
    intro: 'Det er ikke som det ser ud. Jeg var lige der.',
    truth: 'Hun har set det hele — men forsvarer sin ven. Hendes vinkel er nær, men ikke neutral.',
    questions: [
      { id: 'q-sara-1', text: 'Hvad skete der set fra din side?', good: true, answer: 'Vi grinte. Han fortalte en joke. Den arm var et high-five — ikke et skub.' },
      { id: 'q-sara-2', text: 'Lyver du for at hjælpe din ven?', good: false, answer: 'Det er ikke fair. Du beder mig forsvare mig før du har lyttet.' },
      { id: 'q-sara-3', text: 'Hvad lavede I lige før billedet?', good: true, answer: 'Vi snakkede om matchen. Han havde en sjov historie. Det er det, der bliver fanget i billedet.' },
    ],
  },
]

// Tidslinje — barnet ordner 5 begivenheder fra "før" til "efter" billedet
export const TIMELINE_EVENTS = [
  { id: 't-1', order: 1, time: '11:35', label: 'Frikvarteret starter', desc: 'Eleverne strømmer ud i skolegården.' },
  { id: 't-2', order: 2, time: '11:40', label: 'Vennerne mødes', desc: 'De to på billedet finder hinanden ved hegnet.' },
  { id: 't-3', order: 3, time: '11:42', label: 'Billedet tages', desc: 'Et øjeblik fanges. Kun et billede, kun en vinkel.', anchor: true },
  { id: 't-4', order: 4, time: '11:43', label: 'De griner', desc: 'En joke gør, at begge griner højt.' },
  { id: 't-5', order: 5, time: '11:48', label: 'Klokken ringer', desc: 'Frikvarteret er slut. Sagen er stadig åben.' },
]

// Platons to verdener — kort, børnevenlig forklaring
export const TWO_WORLDS = {
  ideas: {
    title: 'Ideernes verden',
    subtitle: 'Evig og perfekt',
    bullets: [
      'Her findes de perfekte former: den perfekte cirkel, det perfekte venskab, den perfekte retfærdighed.',
      'Intet slides, ændres eller går i stykker.',
      'Vi kan ikke røre den — men vi kan tænke os til den.',
    ],
  },
  senses: {
    title: 'Sanseverdenen',
    subtitle: 'I konstant forandring',
    bullets: [
      'Alt det vi ser, hører og rører ved.',
      'Træer vokser og visner. Venner skændes og bliver gode venner igen.',
      'Alt her er kun en kopi af noget perfekt i ideernes verden.',
    ],
  },
  bridge:
    'Platon mente, at det vi sanser, bare er skygger af det virkelige. Når vi tænker dybt, husker sjælen hjem til ideernes verden.',
}

// Ide/kopi-par — barnet matcher en perfekt ide med en hverdagskopi
export const PHILOSOPHY_PAIRS = [
  {
    id: 'pp-cirkel',
    idea: 'Den perfekte cirkel',
    ideaHint: 'En tanke. Ingen tegnet cirkel er helt rund.',
    copy: 'Min tegnede cirkel',
    copyHint: 'Lidt skæv. Linjen ryster. Stadig en cirkel.',
    insight: 'Vi genkender cirklen — også når den er skæv. Ideen findes i tanken.',
  },
  {
    id: 'pp-venskab',
    idea: 'Det perfekte venskab',
    ideaHint: 'Tillid, omsorg, plads til at være uenig.',
    copy: 'Et venskab i hverdagen',
    copyHint: 'Med op- og nedture. Sjov og skænderier.',
    insight: 'Selv når venskabet bøvler, har vi en ide om, hvad et godt venskab er.',
  },
  {
    id: 'pp-retfardighed',
    idea: 'Den perfekte retfærdighed',
    ideaHint: 'Alle bliver hørt. Ingen dømmes på rygter.',
    copy: 'En dom i skolegården',
    copyHint: 'Måske for hård. Måske for blød. Aldrig helt fair.',
    insight: 'Vi mærker, når noget er uretfærdigt — fordi vi kender ideen om retfærdighed.',
  },
  {
    id: 'pp-tra',
    idea: 'Det perfekte træ',
    ideaHint: 'Alt det, der gør et træ til et træ.',
    copy: 'Træet i parken',
    copyHint: 'Med en knækket gren og et fuglerede.',
    insight: 'Vi kalder det stadig et træ. Ideen ligger bag formen.',
  },
]

// Hulelignelsen i 4 trin — barnet klikker sig ud af hulen
export const CAVE_STAGES = [
  {
    id: 'cs-1',
    step: 1,
    title: 'I hulen',
    summary: 'Vi sidder bundet i en hule og ser kun skygger på væggen.',
    detail: 'Det er det eneste, vi har set hele livet. Vi tror, skyggerne er virkeligheden.',
    case: 'Da billedet blev delt, troede mange, det var hele sandheden. Det var skyggen.',
  },
  {
    id: 'cs-2',
    step: 2,
    title: 'Vi vender os om',
    summary: 'Bag os står et bål og nogle figurer. Skyggerne kommer derfra.',
    detail: 'Pludselig forstår vi: Det vi så på væggen, var ikke selve tingene — kun deres skygger.',
    case: 'Da vi afhørte vidnerne, opdagede vi, at billedet havde mange vinkler bag sig.',
  },
  {
    id: 'cs-3',
    step: 3,
    title: 'Vi går mod udgangen',
    summary: 'Lyset blænder. Det gør ondt i øjnene — men vi går videre.',
    detail: 'Det er svært at lære nyt. Vores gamle tanker vil tilbage i hulen, hvor det var trygt.',
    case: 'Det føles ubehageligt at indrømme, vi tog fejl. Men det er sådan, vi nærmer os sandheden.',
  },
  {
    id: 'cs-4',
    step: 4,
    title: 'Ude i solen',
    summary: 'Vi ser verden i solens lys. Sandheden lyser klart.',
    detail: 'Platon kaldte det filosofiens vej: fra skygger til sand viden. Og man skal gå tilbage og fortælle de andre.',
    case: 'Detektiven gør det samme: vender sig om, går ud, og fortæller hvad sagen virkelig handlede om.',
  },
]

// Citater og indsigter — vises efter trinene er gennemført
export const SOUL_INSIGHT = {
  title: 'Sjælen husker hjem',
  text: 'Platon mente, at vores sjæl egentlig hører til i ideernes verden. Når vi tænker dybt og spørger “hvad er retfærdighed?” eller “hvad er sandhed?”, husker sjælen noget, den allerede ved.',
  caseLink: 'Når du som detektiv spørger “er det her hele sandheden?” — så bruger du sjælens hukommelse.',
}

// Tre måder filosofien bruges på i hverdagen
export const PHILOSOPHY_TAKEAWAYS = [
  {
    id: 'pt-1',
    label: 'Når jeg ser et billede online',
    text: 'Spørg: Er det her hele sandheden — eller bare en skygge af den?',
  },
  {
    id: 'pt-2',
    label: 'Når mange er enige',
    text: 'Mange skygger er stadig kun skygger. Spørg, før du følger med.',
  },
  {
    id: 'pt-3',
    label: 'Når jeg er i tvivl',
    text: 'Stop op. Tænk. Sjælen kan huske mere, end vi tror.',
  },
]

export const BADGES = {
  'forste-spor': { id: 'forste-spor', label: 'Første spor', desc: 'Du fandt dit første spor.' },
  'skarpt-blik': { id: 'skarpt-blik', label: 'Skarpt blik', desc: 'Du fandt alle spor i scenen.' },
  'tre-vinkler': { id: 'tre-vinkler', label: 'Tre vinkler', desc: 'Du afhørte alle vidner og hørte deres perspektiver.' },
  'tidsdetektiv': { id: 'tidsdetektiv', label: 'Tidsdetektiv', desc: 'Du satte begivenhederne i rigtig rækkefølge.' },
  'godt-sporgsmal': { id: 'godt-sporgsmal', label: 'Godt spørgsmål', desc: 'Du fandt det filosofiske spørgsmål.' },
  'skyggeopklarer': { id: 'skyggeopklarer', label: 'Skyggeopklarer', desc: 'Du afslørede skyggen.' },
  'sporgsmalsmester': { id: 'sporgsmalsmester', label: 'Spørgsmålsmester', desc: 'Du forstod, hvorfor spørgsmål åbner sagen.' },
  'idernes-ven': { id: 'idernes-ven', label: 'Ideernes ven', desc: 'Du matchede alle ideer med deres hverdagskopier.' },
  'huleudfrier': { id: 'huleudfrier', label: 'Hulens udfrier', desc: 'Du fulgte vejen fra skygge til solens lys.' },
  'sjaelens-detektiv': { id: 'sjaelens-detektiv', label: 'Sjælens detektiv', desc: 'Du forstod Platons to verdener og sjælens hukommelse.' },
  'maagens-ven': { id: 'maagens-ven', label: 'Mågens ven', desc: 'Du fandt Milos hemmelige hilsen.' },
}

export const REPORT_CHIPS_SITUATION = [
  'Et rygte i klassen',
  'Et billede online',
  'Noget fra sociale medier',
  'Noget en ven sagde',
  'Noget i et spil',
]

export const REPORT_CHIPS_ACTION = [
  'Undersøge mere',
  'Spørge flere',
  'Tænke over kilden',
  'Vente med at dele',
  'Stille et bedre spørgsmål',
]

export const REPORT_CHIPS_RULE = [
  'Se efter flere vinkler',
  'Spørg før jeg deler',
  'Tjek om det er et bevis',
  'Vent med at dømme',
  'Led efter det gode spørgsmål',
]

export const CASE_TITLE = 'Skyggesagen'
export const CASE_SUBTITLE = 'Et filosofisk mysterium'
export const APP_TITLE = 'Milo: Skyggesagen'

export const TEACHER_INFO = {
  description:
    'Milo: Skyggesagen er et spilbaseret læringsforløb, der introducerer børn til Platons filosofi gennem et detektivmysterium. Forløbet dækker hulelignelsen, læren om de to verdener (sanseverdenen og ideernes verden), ideerne som de perfekte former, og tanken om at sjælen husker hjem til ideernes verden.',
  audience: '10-12 år',
  duration: '20-30 minutter',
  goals: [
    'Eleven kan forklare hulelignelsen i enkel form og sætte den i forhold til moderne situationer.',
    'Eleven kan beskrive Platons to verdener — sanseverdenen (i forandring) og ideernes verden (evig og perfekt).',
    'Eleven kan give eksempler på, at hverdagens ting er "kopier" af perfekte ideer.',
    'Eleven kan skelne mellem gæt, spor, beviser og filosofiske spørgsmål.',
    'Eleven kan forstå, at det man ser, ikke altid er hele sandheden.',
    'Eleven kan koble filosofien til digitale medier og hverdagsliv.',
  ],
  quickStart: [
    'Åbn startskærmen på fælles skærm, og lad eleverne gætte, hvad Skyggesagen handler om.',
    'Lad eleverne spille alene eller to og to på samme enhed.',
    'Saml op med spørgsmålene nederst på lærersiden.',
  ],
  classActivity:
    'Tal om moderne skygger: billeder, rygter, filtre, sociale medier og halve sandheder. Lad eleverne finde tre ting i klassen, der er "kopier" af en ide (en stol, en cirkel, en regel om retfærdighed).',
  discussionQuestions: [
    'Hvornår kan et billede vise noget rigtigt, men stadig mangle noget vigtigt?',
    'Hvad er forskellen på et gæt, et spor og et bevis?',
    'Hvilket spørgsmål ville du stille, før du delte noget videre?',
    'Hvad mener Platon, når han siger, at vi nogle gange kun ser "skygger" af virkeligheden?',
    'Kan I komme på noget i hverdagen, der er en "kopi" af en perfekt ide?',
    'Hvad betyder det, at "sjælen husker hjem" til ideernes verden?',
    'Hvorfor er det svært at gå ud af hulen — også i virkeligheden, når man opdager man tog fejl?',
  ],
  philosophyPrimer: [
    'Hulelignelsen: Mennesker er bundet i en hule og ser kun skygger på væggen. De tror, skyggerne er virkeligheden — indtil en vender sig om, ser bålet, og går ud til sollyset.',
    'De to verdener: Sanseverdenen (alt vi ser, hører, rører) er i konstant forandring. Ideernes verden (de perfekte former) er evig og uforanderlig.',
    'Kopier af ideer: Alt i naturen er kun en kopi af en perfekt ide. Et træ er en kopi af "ideen om et træ".',
    'Sjælen: Platon mente, at sjælen oprindeligt hører til i ideernes verden — og at vi "husker" ideerne, når vi tænker dybt.',
  ],
  privacy: 'Ingen login. Progression gemmes kun lokalt i browseren.',
}

export const MILO_LINES = {
  start: 'Hej! En sag venter. Skal vi opklare den sammen?',
  profileIntro: 'Hej! Jeg er Milo. Vælg dit detektivnavn og din stil — så ved jeg, hvordan du løser mysterier bedst.',
  hub: 'Sagen ligger på bordet. Hvor skal vi begynde?',
  briefing: 'Det ligner en sandhed… men måske er det kun en skygge.',
  investigateIntro: 'Find sporene. Tryk på det, der ser mistænkeligt ud.',
  investigateAllFound: 'Vi har dem! Lad os snakke med vidnerne.',
  witnessIntro: 'Tre vidner. Tre vinkler. Vælg dine spørgsmål med omhu — gode spørgsmål åbner sagen, ledende spørgsmål lukker den.',
  witnessGood: 'Godt spørgsmål. Det får os tættere på sandheden.',
  witnessLeading: 'Hov — det spørgsmål gætter allerede på svaret. Prøv at åbne det op.',
  witnessAllDone: 'Vi har tre vinkler nu. Ingen af dem er hele sandheden — men sammen viser de mere.',
  timelineIntro: 'Billedet er kun et frosset øjeblik. Lad os se, hvad der skete før og efter.',
  timelineWrong: 'Hmm. Hvad sker der typisk først, og hvad bagefter?',
  timelineCorrect: 'Sådan! Nu kan vi se hele dagen — ikke bare det ene billede.',
  sortIntro: 'Hvad er gæt? Hvad er spor? Hvad er bevis? Og hvad er et stort spørgsmål?',
  sortCorrect: 'Godt sorteret! Det der hjælper sagen.',
  sortWrong: 'Hmm, den skal vi lige undersøge igen.',
  questionIntro: 'Sagen er låst. Vælg det spørgsmål, der åbner den.',
  questionWrong: 'Næsten… men det åbner ikke døren.',
  questionCorrect: 'Det er et ægte filosofisk spørgsmål!',
  explanationIntro: 'Saml forklaringen i rigtig rækkefølge.',
  explanationCorrect: 'Nu hænger sagen sammen!',
  revealIntro: 'Klar? Lad os løfte skyggen.',
  revealDone: 'Platon ville sige, at vi nogle gange kun ser skygger. En detektiv spørger videre.',
  philosophyIntro: 'Vent — før vi skriver rapporten. Platon havde en ide, der gør hele sagen større. Tør du følge mig ned i hulen?',
  philosophyTwoWorlds: 'Platon sagde: Der er to verdener. Den vi sanser — og den vi tænker.',
  philosophyMatchIntro: 'Match hver hverdagsting med dens perfekte ide. Ideen er det, vi tænker. Kopien er det, vi ser.',
  philosophyMatchHit: 'Sådan! Hverdagstingen er en kopi — ideen ligger i tanken.',
  philosophyMatchMiss: 'Hmm. Prøv igen — hvilken ide ligger bag denne hverdagsting?',
  philosophyCaveIntro: 'Klar til at gå ud af hulen? Tryk dig vej fra skyggerne mod solens lys.',
  philosophyCaveStep: 'Et skridt nærmere lyset. Husk: de andre i hulen tror stadig, skyggen er virkeligheden.',
  philosophyCaveDone: 'Du gjorde det. Du gik fra skygger til solens lys — og du kommer tilbage og fortæller de andre. Det er filosofiens vej.',
  philosophySoul: 'Sjælen husker hjem. Når du spørger “er det her hele sandheden?”, mærker du ideernes verden.',
  philosophyDone: 'Nu har du Platons værktøjer. Du kan se en skygge — og spørge bag den.',
  reportIntro: 'Nu er det din tur. Har du selv set en skygge i virkeligheden?',
  eggHello: '*hvisker* Godt set! Du opdager også de små ting. Det er det, en god detektiv gør.',
}
