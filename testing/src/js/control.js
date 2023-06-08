
$( document ).ready(function() {
    /* Stavová proměnná a funkce pro spuštění/pozastavení rozpoznávání */
    var recognizing = false;
    var asrPausedForTts = false;

    var dict_of_numbers = {"jedna":1, "dva": 2, "tři": 3, "čtyři": 4, "pět": 5, "šest": 6, "sedm": 7, "osm": 8, "devět": 9, "deset": 10}

    $("#send_message_empty").click(function () {
        data = {};
        speechCloud.dm_send_message({data: data});
        do_tts("Žiju a poslouchám", "Iva30")
    });

    $("#send_number").click(function () {
        var number_to_square = document.getElementById("number_to_calculate").value
        var number_to_say = number_to_square.toString()
        var number_squared = number_to_square*number_to_square
        var number_squared_to_say = number_squared.toString()
        do_tts("Druhá mocnina čísla " + number_to_say + " je " + number_squared_to_say, "Iva30")
        document.getElementById("number_to_calculate").value = 0
    });

    $("#asr_start_stop").click(function () {
        if (recognizing){
            console.log("stopping ASR")
            var btn = document.getElementById("asr_start_stop")
            btn.textContent = "Start ASR"
            do_pause()
        }
        else if (!recognizing){
            console.log("starting ASR")
            var btn = document.getElementById("asr_start_stop")
            btn.textContent = "Stop ASR"
            do_recognize()
        }
    });

    

    /* Logovací funkce */
    function hlog(text) {
        $("#log").prepend("<div>"+text+"<br/></div>");
        }


    function do_recognize() {
        if(!recognizing){
            speechCloud.asr_recognize();
            recognizing = true;
            
        }
            // document.getElementById("recognizeSpan").style.backgroundColor = "green"
    }

    function do_pause() {
        if(recognizing){
            setSignal(0, false);
            speechCloud.asr_pause();
            recognizing = false;
        
        }
            // document.getElementById("recognizeSpan").style.backgroundColor = "red"
        
    }

    /* Přerušení syntézy zasláním zprávy tts_stop */
    function do_tts_stop() {
        asrPausedForTts = false;
        console.log("Sending tts_stop");
        speechCloud.tts_stop();
    }

    /* Syntéza řeči */
    function do_tts(text, voice) {
        if (recognizing){
            asrPausedForTts = true;
            do_pause()
        }
        console.log("doing tts: ", text, voice)
        speechCloud.tts_synthesize({text: text, voice: voice});
    }

    var mainVolumeBar = $(".volume-gr");
    var redVolumeBar = $(".volume-rd");

    /**
     * display speech energy level
     * @param level
     * @param speech
     */
    function setSignal (level, speech) {
        console.log("set signal function")
        var val_gr, val_rd;
        var RED_SIGNAL = 5.1;

        var GREEN_YELLOW = 40;
        var RED_THRESHOLD = 70;

        var val = (level / RED_SIGNAL) * RED_THRESHOLD;

        if (val < RED_THRESHOLD) {
            val_gr = val;
            val_rd = 0;
        } else {
            val_gr = RED_THRESHOLD;
            val_rd = val - RED_THRESHOLD;
        }

        if (! speech) {
            mainVolumeBar.removeClass("progress-bar-success").addClass("progress-bar-default");
            mainVolumeBar.css('width', val+'%');
            redVolumeBar.css('width', 0+'%');
        } else {
            mainVolumeBar.addClass("progress-bar-success").removeClass("progress-bar-default");
            mainVolumeBar.css('width', val_gr+'%');
            redVolumeBar.css('width', val_rd+'%');
        }
    }

    /* Obsluha tlačítka Restart dialog */
    $("#dialog_restart").click(function () {
        location.reload(true);
    });

    /* Obsluha tlačítka Stop dialog*/
    $("#dialog_stop").click(function () {
        speechCloud.terminate();
    });

    var ignore_space = false;
    /* Po stisk mezerníku je totéž jako stisknutí tlačítka #send_message_empty */
    $(window).keydown(function(evt) {
        if (ignore_space) return;

        if (evt.keyCode == 32) {
            evt.preventDefault();
        };
    });

    $(window).keyup(function(evt) {
        if (ignore_space) return;

        if (evt.keyCode == 32) {
            setTimeout(function () {$("#asr_start_stop").click()}, 100);
            evt.preventDefault();
        };
    });

    /* Proměnná, do které se uloží timeout pro SIP zavolání */
    var call_timeout = null;

    var model_uri = " https://cak.zcu.cz:9443/v1/speechcloud/devel_polakf_mocniny"
    var options = {
        uri: model_uri,
        tts: "#audioout",
        disable_audio_processing: true
    }

    var speechCloud = new SpeechCloud(options);

    window.speechCloud = speechCloud

   
    speechCloud.on('_ws_session', function () {
        console.log("ws connected")
        hlog("<b>Inicializace...</b>");
        //hlog("\n");
    });
    speechCloud.on('asr_ready', function () {
        console.log("asr ready")
        hlog("<b>ASR ready</b>");
        //hlog("\n");
        // do_tts("Dobrý den, jsem vaše virtuální mocnina Karel. Zadejte číslo pro mocnění, nebo můžete stisknout otazník, abyste věděli, jestli Vás poslouchám.", "Iva30")
        do_tts("Dobrý den. Zadejte číslo, nebo zmáčkněte tlačítko ASR a řekněte číslo od jedné do deseti.", "Iva30")
        //document.getElementById("recognizeSpan").style.backgroundColor = "green"
    });

    /* Při příchodu ASR výsledku */
    speechCloud.on('asr_result', function (msg) {
        if (msg.partial_result) {
            console.log("ASR message: ", msg)
            return;
        }
        if(msg.result == ""){
            return;
        }
        else if(msg.result){
            console.log("ASR message with result: ", msg)
            hlog("<b>Rozpoznáno: </b>" + msg.result);
            //hlog("\n");
                if (msg.word_1best in dict_of_numbers){
                    var number_to_square = dict_of_numbers[msg.word_1best]
                    var number_to_say = number_to_square.toString()
                    var number_squared = number_to_square*number_to_square
                    var number_squared_to_say = number_squared.toString()
                    do_tts("Druhá mocnina čísla " + number_to_say + " je " + number_squared_to_say, "Iva30")
                    document.getElementById("number_to_calculate").value = 0
                }
                else {
                    
                    do_tts("Toto je demo, umím pouze čísla od jedničky do desítky.", "Iva30")
                }
            
        }

    });
    speechCloud.on('dm_display', function(msg){
        console.log(msg);
    });
    speechCloud.on('asr_paused', function(msg){
        setSignal(0, false)
    });


    speechCloud.on('tts_done', function(msg){
        console.log("tts done: ", msg)
        if(asrPausedForTts){
            asrPausedForTts = false;
            console.log("tts done - recognizing asr")
            do_recognize()
        }
        
    });

    speechCloud.on('asr_signal', function(msg){
        //console.log("SC: ", speechCloud)
        //console.log("ASR signal: ", msg)
        if (recognizing){
            setSignal(msg.level, msg.speech)
        }
        else{
            setSignal(0, false)
        }
        
    });


    
    speechCloud.init();

});