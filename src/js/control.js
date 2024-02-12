let stopButtonClicked = false
let recognizing = false

function getTimeForConsoleLog(){
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    return(`${year}-${month}-${day}-${hours}:${minutes}:${seconds}`); 
}


Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

function onSocketClose() {
    console.log("WS client: Websocket closed.");
    copyIntoClipboard(getTimeForConsoleLog() + " WS client: Websocket closed.")

}

/* Logovací funkce ASR*/
function hlogAsr(text) {
    $("#logASR").append("<div>" + text + "<br/></div>");
}

/* Logovací funkce SLU*/
function hlogSlu(text) {
    $("#logSLU").append("<div>" + text + "<br/></div>");
}

const animals = ["mamut", "kráva", "aberdeen", "aberdín", "aberdýn", "adax", "chrt", "afrička", "agama", "agapornis", "aguti", "erdelteriér", "teriér", "akita", "akita inu", "akita_inu", "alexandr", "aligátor", "malamut", "alka", "alkoun", "brakýř", "alter real", "amazoňan", "jestřáb", "los", "prase", "kobylka", "kozlíček", "vodomil", "amazónek", "babirusa", "plochuska", "makadlovka", "amejva", "buldok", "kůň", "pony", "poník", "klusák", "kokršpaněl", "stafordšírský teriér", "amroksky", "voláč", "anakonda", "anatolský pastevecký pes", "anatol", "pes", "andulka", "beran", "plnokrevník", "setr", "špringršpaněl", "toy teriér", "holub", "angloarab", "koza", "králík", "slepice", "anoa", "anolis", "anténovec", "antilopa", "vousáči", "vousáč", "vousáč", "appaloosa", "salašnický pes", "salaš", "ara", "arara", "arasari", "aratinga", "araukany", "argali", "doga", "baset", "slepice", "australky", "kelpie", "ohař", "axis", "axolotl", "aymara", "ajmara", "skot", "azavak", "azteca", "azteka", "babočka", "bahnivec", "kočka", "bandikut", "bantamky", "banteng", "barbet", "boloňáček", "baribal černý", "baribal", "barnard", "barneveldky", "basenži", "baset", "batolec", "bavlnice", "barvář", "teplokrevník", "bazilišek", "bázlivec", "bažant", "bearded kolie", "bírdid kolie", "kolie", "beauceron", "bejlomorka", "bekasína", "bekyně", "belásek", "belgické modrobílé", "grifonek", "belgický obr", "ovčák", "bělokaz", "bělokur", "bělopásek", "bělořit", "bělozubka", "běluha", "bércoun", "bernardýn", "bublák", "berneška", "salašnický pes", "salaš", "varan", "beruška", "běžník", "bičochvost", "bičovka", "bígl", "bichir", "binturong", "birma", "bišonek", "bizon", "blatnice", "blecha", "bloodhound", "bladhaund", "blýskáček", "bobr", "bobruška", "bobtail", "bobtejl", "bodalka", "bodlín", "bodlok", "bojga", "bojovnice", "bolen", "boloňský psík", "boloň", "bonobo", "doga", "border kolie", "bordérka", "bourovčík", "bourovec", "lýkožrout", "alexandr", "psohlavec", "korela", "delfín", "mrož", "kavka", "chroust", "brabantík", "brahmánky", "bramborníček", "bráněnka", "fila", "brhlík", "briard", "brkoslav", "brumby", "grifonek", "bruslařka", "břehouě", "břehule", "budníček", "bukač", "bukáček", "bulbul", "bulmastif", "chladnokrevník", "bulteriér", "burunduk", "buřňáček", "buřňák", "buvol", "buvolec", "bzikavka", "bzučivka", "bzunka jecna", "cairn", "candát", "cejn", "cejnek", "cikáda", "cistovník", "hnšdák", "coton de tuléar", "criollo", "retrívr", "cvrček", "cvrčilka", "chachalaka", "chaluha", "chameleon", "chápan", "charmozín", "charolais", "charza", "chesapeake bay", "chluponožka", "chobotnice", "chocholatka", "chocholouš", "chrobák", "chrostík", "chroust", "chrouster", "chřástal", "chřestýš", "chvostan", "křeček", "džungar", "liška", "kobylka", "kozlíček", "čalounice", "čáp", "čau čau", "čečetka", "čejka", "čelistnatka", "čepcol", "černopáska", "černoproužka", "červenka", "červotoč", "bagdeta", "vlčák", "albín", "holub", "stavák", "skot", "čichavec", "činčila", "čipmank", "čírka", "čivava", "čížek", "čmelák", "čolek", "čukvala", "ďábel", "dalmatín", "daman", "damascén", "daněk", "datel", "datlík", "deerhound", "dírhaund", "delfínec", "delfínovec", "dhoul", "dikdik", "dikobraz", "dingo", "diviznáček", "dlask", "dlouhohlávka", "dlouhokrčka", "dlouhoretka", "dlouhošíjka", "dlouhozobka", "dobrman", "donsky kun", "drabčík", "dragoun", "drakoun velky", "drápatečka", "drápatka", "drop", "eklektus", "elo", "emu", "eurasier", "falabella", "faraón", "faverolky", "felsuma", "felzuma", "fenek", "field španěl", "španěl", "chladnokrevník", "špic", "flanderský bouvier", "flander", "bouvier", "forverky", "fosa", "foxhound", "foxteriér", "buldoček", "klusák", "honič", "frček", "frederiksborg", "fret", "fryna", "furioso", "galiceňo", "galloway", "gaur", "gaviál", "gazela", "gekon", "gekončík", "gepard", "gibon lar", "gidran", "gigant", "glosofága", "gordonsetr", "gorila", "gottingen", "grizon", "guan", "gueréza", "hackney", "hakny", "hafling", "halančík", "hamburčanka", "barvář", "psík", "havran", "hedvábnička", "hempšírky", "hereford", "hlavatka", "hlavec", "hlodoun", "hnedopáska", "hnojník", "hohol", "hoholka", "hoko", "koza", "králík", "pudl", "holokrčky", "holoubek", "racek", "holub", "hořavka duhova", "hovawart", "hrabáč", "hrabalka", "hrabatka", "hraboš", "hrabošík", "hrachovka ricni", "hrbáč", "hrdlička", "hrobařík", "hroch", "hrošík", "hrotař", "hrotnokřídlec", "hrouzek", "hroznýš", "hroznýšek", "hroznýšovec", "hryzec", "hřbetozubec", "hřbenule", "hucul", "hudánky", "hulman", "husa", "myš", "plymutka", "lori", "ovce", "hyl", "zákeřnice", "zlatoočka", "husice", "hutia konga", "hutia", "hvízdák", "hyena", "hyenka", "hýl", "ibis", "ibizský podengo", "podengo", "impala", "indián", "indicky běžec", "indri", "irbis", "irena", "setr", "hunter", "vlkodav", "chrtík", "spinone", "jack russell teriér", "jaguár", "jaguarundi", "jak", "japonky čabo", "čabo", "bobtail", "čin", "špic", "jasoň", "jazyk", "jehlanka", "jehlice", "jehlozobka", "jelec", "jelen", "jelenec", "jepice", "skot", "jeřáb", "jeřábek", "jeseter", "jespak", "ještěrka", "jěštěrkovec", "jetelovka", "jezevčík", "jezevec", "ježdík", "ježek", "ježura", "jiřička", "kabar", "kahau", "kachna", "kachnička", "kajka", "kajman", "kajmánek", "kajmanka", "kakadu", "katalanka", "krecek dzungarsky", "liska obecna", "varan ostnoocasy", "jestrab kratkoprsty", "los evropsky", "vietnamske prase", "vietnamske prase", "kobylka zelena", "kozlicek dazule", "kakadu", "kakapo", "kakariki", "kalandra", "kaloň", "kalous", "kameňáček", "kamzík", "kančík", "kančil", "káně", "kanic", "kapr", "kapustňák", "kapybara", "karakal", "karas obecny", "karetka", "kariér", "kastorex", "katalánka", "kavče", "kavka", "keporkak", "kerry", "king", "kladivoun", "klešťanka", "katalanka", "klikoroh", "klínatka", "klíněnka", "klístě", "klokan", "klokánek", "klokanomyš", "klopuška", "kněžice", "knírač", "koala", "kobra", "skřivan", "kobylka", "kočinky", "kočkodan", "kodulka", "kogie", "kogna", "kohoutek", "kojot", "kokrháč", "kolie", "koliha", "koljuška", "kolpík", "komár", "komba", "komondor", "konipas", "konopka", "kooikerhondje", "kopřivka", "korálovka", "korat", "korela", "kormorán", "kornyška", "koroptev", "korovnice", "katalanka", "grifon", "kos", "kosatka", "kosman", "kotul", "kovařík", "kovolesklec", "koza", "kozlíček", "kozorožec", "kozojed", "krahujec", "krajník", "krajta", "krakatice", "králíček", "králík", "krasec", "kraska", "krátkonožka", "krevkérka", "krkavec", "krocan", "krokodýl", "kromforländer", "kromforlander", "krtek", "krtonožka", "kruhochvost", "krunýřovec", "krůta", "krutihlav", "krysa", "krytonosec", "kreček", "křečík", "křepelka", "křísek", "křivka", "křižák", "ksukol", "kuandu", "kubalaje", "kudlanka", "kudrnáč", "kudu", "kukačka", "kuklice", "kulík", "kulíšek", "kulohlavec", "kuna", "kuňka", "kunovec", "kuska", "kuskus", "kusu", "kutilka", "kuvas", "kvakoš", "květilka", "květolib", "květomil", "kyjatka", "kynkažu", "", "labrador", "labuť", "laflešky", "lachtan", "lakeland", "lejklend", "lakenfeldky", "lejkenfeltky", "lalokonosec", "lama", "landseer", "lendsír", "langšanka", "langur", "lasice", "latam", "ledňáček", "ledňák", "leghornka", "leguán", "leguánek", "lejsek", "lelek", "lemur", "lenec", "lenochod", "leonberger", "lepoještěr", "leskoptev", "lesoň", "létavec", "létavka", "letoun", "letucha", "lev", "levhart", "lhasa apso", "lín", "linduška", "linsang", "lipan", "lipicán", "listokaz", "listonos", "listopas", "listovnice", "lišaj", "liška", "loděnka", "lodivod", "lopatonos", "lori", "loríček", "lorikul", "los", "losos", "lovčík", "lumčík", "lumek", "lumík", "luňák", "luněc", "luptouš", "lusitano", "luskoun", "bojovnice", "lvíček", "lýkohub", "lýkožrout", "lyska", "lyskonoh", "lžičák", "máčka", "mada", "maikong", "majka", "makak", "mak", "mákovka", "makrela", "malajka", "maločlenec", "malpa", "psík", "mandelík", "mandelinka", "mandril", "mangabej", "mangalarga", "mangusta", "mantela", "mara", "maransky", "maremmano", "martináč", "masařka", "mastif", "matamata", "mečoun", "mečovka", "medojed", "medosavka", "medovnice", "medvěd", "megaderma", "mera", "naháč", "mihule", "bulteriér", "minorky", "mirikina", "missouri fox trotter", "mločík", "mlok", "mlynařík", "mník", "mníšek", "mnohonožka", "mnohopilák", "modena", "modenka", "modrásek", "baset", "gaskoň", "moloch", "molovka", "momot", "monden", "mops", "morčák", "morče", "morgan", "moták", "motýlice", "motýl", "moudivláček", "moucha", "mravencojed", "mravenec", "mravenečník", "mravkolev", "mrchožrout", "mrož", "mršník", "mřenka", "mšice", "mudi", "muflon", "muchnice", "muntžak", "můřice", "mustang", "myš", "myšák", "myšice", "myšivka", "myška", "mýval", "nahur", "nandej", "nandu", "nártoun", "narval", "mastin", "boxer", "křepelák", "pinc", "špic", "neoféma", "neonka", "nestor", "nesytka", "netopýr", "netopýrek", "new forest pony", "ňů forest pouny", "nilgau", "noháč", "nonius", "norek", "kob", "norník", "lundehund", "nosál", "nosatčík", "nosatec", "nosorožec", "nosorožík", "novozélandský červený", "nutrie", "nyala", "obaleč", "ocelot", "octomilka", "okáč", "okapi", "okenáč", "okoun", "okounek", "oliheň", "olingo", "ondatra", "opice", "opičí pinč", "pinč", "orangutan", "oravky", "orcela", "orebice", "orel", "oribi", "orlík", "orlosup", "orlovec", "orlovky", "klusák", "orpingtonky", "ořešník", "osel", "osenice", "osmák", "ostralka", "ostroretka", "ostruháček", "ostruhák", "ostruhovník", "ostrucha", "ostříž", "otakárek", "ouhorlík", "ouklej", "ouklejka", "outloň", "ovád", "ovce", "ovíječ", "pablatnice nosata", "pačolek", "paduánky", "pagekon", "páchník", "paint horse", "pejnt hors", "paještěrka", "paježura", "paka", "pakudlanka", "pakůň", "paličatka", "pancéřníček", "panda", "paovce", "papillon a phaléne", "papoušek", "papoušíček", "papuchalk", "parma", "parosnička", "parukář", "paso fino", "pásovec", "páteříček", "páv", "pavián", "peja", "pekari", "pelikán", "pěnice", "pěnkava", "penkavák", "pěnodějka", "perepel", "perleťovec", "perleťovka", "perlička", "perlín", "perlorodka", "perlovka", "arab", "péřovka", "pestrokrovečník", "pestrokřídlec", "pestruška", "pestřenec", "pestřenka", "pěvec", "pěvuška", "píďalka", "pika", "pilatka", "pilořitka", "pilous", "pipa", "pisík", "pisila", "pískomil", "pískorypka", "piskoř pruhovany", "pišťucha", "pižmoň", "plameňák", "plamenoskvrnka", "plejtvák", "plejtvákovec", "plch", "plískavice", "plodomorka", "plochojester", "plochuška", "makadlovka", "ploskohřbetka", "ploskorep", "ploskoroh", "ploskoroh", "plotice obecna", "plšík", "plymutka", "podoustev nosák", "podoustev", "nosák", "pointer", "pokoutník", "polák", "poletucha", "poletuška", "polník", "zelenonožky", "ogar", "podengo", "possum", "poštolka", "pošvatka", "potápka", "potáplice", "potápník", "potemníček", "potemník", "potkan", "poto", "pottok", "pouzdrovníček", "pralesnička", "prase", "divočák", "rejdič", "promyka", "prskavec", "přástevník", "předivka", "přímorožec", "psohlavec", "psoun", "pstruh", "pštros", "ptakopysk", "pták", "pudl", "pudlpointer", "puchýřník", "puklice", "puli", "puma", "pumi", "puštík", "mastin", "pyrura", "pytlonoš", "racek", "ragdoll", "rájovec", "rak", "rákosníček", "rákosnička", "rákosník", "raroh", "ratufa", "redkap", "rehek", "rejnok", "rejsec", "rejsek", "rejskovec", "ridgeback", "rocky mountain", "rodajlendka", "roháč", "roháček", "rohatka", "ropucha", "rorýs", "rosela", "rosnice", "rosnička", "rosomák", "rotvajler", "ruměnice", "rus", "rušník", "rybák", "rybenka", "rýhonosec", "rypoš", "rypouš", "rys", "říman", "sajga", "salerno", "sambar", "sametka", "samojed", "saranče", "sasexky", "satyr", "scink", "sebritky", "sedmihlásek", "sekáč", "sekavec", "sekavka", "sépie", "serval", "shiba", "schi tzu", "siamang", "husky", "sifaka maly", "síh", "sitatunga", "síťnatka", "siven", "skalára", "skalník", "skálolez", "sklípkan", "skokan", "skorec", "skřivan", "skrivánek", "skunk", "skvrnopasník", "slavík", "slepec", "slepýš", "slíďák", "slípka", "slizoun", "slon", "sloughi", "čuvač", "kopov", "slučka", "sluka", "slunéčko", "slunečnice", "slunka", "smolák", "smrtník", "smrtonoš", "sněhule", "sněžnice", "sob", "sobol", "sojka", "sojkovec", "sokol", "sorraia", "sosnokaz", "soumračník", "sova", "sovice", "splešťule", "srnec", "srpice", "srpokřídlec", "srstín", "sršeň", "bulterier", "stehlík", "stepnice", "stepník", "stepokur", "stonožka", "straka", "strakáč", "strakapoud", "strnad", "stromovnice", "střechatka", "střevle", "střevlíček", "střevlík", "střízlík", "stužkonoska", "sulmtálky", "sultánky", "sumec", "sumeček", "sup", "surikata", "svštluška", "svinka", "sviňucha", "svišť", "svižník", "sýc", "sýček", "sýkora", "sýkořice", "sysel", "šakal", "šarpej", "šeltie", "šídélko", "šídlo", "šimpanz", "šiperka", "širokohlavec", "škeble", "škvor", "barevnohlávek", "šoupalek", "špaček", "galgo", "štětconoš", "štětinatec", "štětkoun", "štika", "štír", "štírek", "štítenka", "štítonoš", "štítovec", "brakýř", "šumavanky", "šváb", "tadarida", "tahr", "tamarín", "kalimiko", "tana", "tangalunga", "tangara", "tapír", "tarbík", "tarbíkomyš", "taricha", "tarpan", "teju", "tenkozobec", "mimochodník", "terej", "tesařík", "tetra", "tetřev", "tetřívek", "tchoř", "tchořík", "tilikva", "tiplice", "tirika", "titi", "tlamovec", "tmavoskvrnáč", "toko", "tomistoma", "travařka", "tricha", "trnorep", "kropenka", "truběnka", "třásněnka", "ťuhýk", "tui", "tukan", "tuleň", "tuňák", "tuponosec", "turako", "banánovec", "angora", "turpan", "tygr", "uakari", "úhoř", "upír", "urzon", "ústřičník", "úžovka", "vačice", "vačínek", "vakokrt", "vakomyš", "vakonoš", "vakoplch", "vakoplšík", "vakorejsek", "vakovec", "vakoveverka", "varan", "vaza", "vážka", "včela", "včelojed", "vejcožrout", "vějířovka", "velbloud", "veleštír", "velevrub", "velryba", "velsumky", "velškorgi cardigan", "velškorgi kardigan", "velššpringršpaněl", "velšteriér", "veš", "veverka", "rejdič", "vidloroh", "víkonos", "vini", "vipet", "vírník", "viskača", "činčila", "vlaška", "vlaštovka", "vlček", "vlha", "vlk", "vlnatka", "vodomil", "vodouch", "vodouš", "voduška", "bublák", "volavka", "vombat", "vorvaň", "vorvaňovec", "vosa", "vosík", "vousák", "vrabec", "vrána", "vranka", "vranohlávky", "vrápenec", "vrbař", "vroubenka", "vrtalka", "vrubozubec", "vřešťan", "vřetenuška", "všenka", "vydra", "vydrař", "vychuchol", "výr", "výreček", "vyza", "vztyčnořitka", "wäller", "veler", "pembroke", "pembrouk", "wyandotka", "zajíc", "zákeřnice", "beran", "lajka", "zavíječ", "závojnatka", "zdobenec", "zdobnatka", "zebra", "zedníček", "zelenuška", "zlatěnka", "zlatohlávek", "zlatokrt", "zlatoočka", "retrívr", "zmije", "znakoplavka", "zobec", "zoborožec", "zorila", "zrnokaz", "zrzohlávka", "zubr", "zvonek", "zvonohlík", "žahalka", "žako", "žebrovník", "želva", "ženetka", "žerzejstí obři", "žirafa", "živorodka", "žlabatka", "žluna", "žluťásek", "žluva", "žralok"];

function startButton() {
    if (!recognizing){
        console.log("starting asr recognizing...")
        speechCloud.asr_recognize()
        recognizing = true
        startTimer()
    }
}

function stopButton() {
    if(recognizing){
        console.log("stopping asr recognizing...")
        speechCloud.asr_pause()
        stopButtonClicked = true  
        recognizing = false  
    }
    
}

function startTimer() {

    var duration = 30 // can be changed
    let countdown_name = "countdown"
    display = document.querySelector('#' + countdown_name);
    var timer = duration, seconds;

    var countdown = setInterval(function () {
        seconds = parseInt(timer % 60, 10);

        //seconds = seconds < 10 ? "0" + seconds : seconds;
        timer = timer < 10 ? "0" + timer : timer;
        //display.textContent = seconds + "s";
        display.textContent = timer + "s";
        if(stopButtonClicked){
            clearInterval(countdown);
        }
        if (--timer < 0) {
            console.log(`duration done..`)   
            clearInterval(countdown);
            appReset()
            }
    }, 1000);}

    function appReset() {

        Swal.fire({
            title: 'Konec testu',
            text: 'Po stisknutí OK se refreshne stránka',
            position: 'top',
            customClass: 'custom-swal-modal', // Apply your custom class
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).then(() => {
            location.reload()
          });
    }