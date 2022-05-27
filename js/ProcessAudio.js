var delayTime = 0;
var synth = null;
function playDelay() {
    var melody = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
    var timeMenu = document.getElementById("delay");
    delayTime = Number(timeMenu.options[timeMenu.selectedIndex].value) / 1000;
    if (!synth) {
        synth = new Tone.Synth().toMaster();
        //        synth = new Tone.Synth().toDestination();
    }
    var pattern = new Tone.Pattern(function (time, note) {
        //the order of the notes passed in depends on the pattern
        synth.triggerAttackRelease(note, "4n", time);
    }, melody, "alternateDown").start(0);

    //    var synth2 = new Tone.Synth().toDestination();
    var synth2 = new Tone.Synth().toMaster();
    var pattern2 = new Tone.Pattern(function (time, note) {
        //the order of the notes passed in depends on the pattern
        synth2.triggerAttackRelease(note, "4n", time);
    }, melody, "alternateDown").start(delayTime);

    var tempo = 120;
    Tone.Transport.bpm.value = tempo
    Tone.Transport.start("+0.1");
}

function updateDelayTime() {
    stopIt();
    var timeMenu = document.getElementById("delay");
    delayTime = Number(timeMenu.options[timeMenu.selectedIndex].value) / 1000;
    playDelay();
}

function stopIt() {
    if (document.getElementById("soundGif") !== null) {
        document.getElementById('soundGif').style.visibility = 'hidden';
    }
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    if (synth) {
        synth.dispose();
        synth = null;
    }
    //   if(piano) {
    //       piano.dispose();
    //       piano = null;
    //   }
    if (kick) {
        kick.dispose();
        kick = null;
    }
    if (snare) {
        snare.dispose();
        snare = null;
    }
    if (conga) {
        conga.dispose();
        conga = null;
    }

    

}

function updateTempo() {
    var tempo = document.myForm.tempo.value;
    Tone.Transport.bpm.value = tempo
}


function updateVolume() {
    kick.volume.value = document.myForm.volumeKick.value;
    snare.volume.value = document.myForm.volumeSnare.value;
    conga.volume.value = document.myForm.volumeConga.value;
    closedHiHat.volume.value = document.myForm.volumeHiHat.value;
}

function updateMute() {
    var muteKickBoolean = document.myForm.muteKick.checked;
    var muteSnareBoolean = document.myForm.muteSnare.checked;
    var muteCongaBoolean = document.myForm.muteConga.checked;
    var muteHiHatBoolean = document.myForm.muteHiHat.checked;

    kickPart.mute = muteKickBoolean ? true : false;
    snarePart.mute = muteSnareBoolean ? true : false;
    congaPart.mute = muteCongaBoolean ? true : false;
    hiHatPart.mute = muteHiHatBoolean ? true : false;
}

/*-----------------------------------------------
//	PIANO
    var piano = new Tone.PolySynth(Tone.Synth, {
        "volume" : -5,
        "oscillator" : {
            "partials" : [1, 2, 5],
        },
        "portamento" : 0.006
    }).toMaster()

    function processDurationNotation(duration_array) {
        var isRest = false;
        var nextIsRest = false;
        var restValue = '';
        var t = Tone.Time("0");
        var t_array = [];
        t_array.push(t.toNotation());
        var accum = "";  // holds the accumulated time for associated note's start time (notes and durations are parallel array)  
        var rest_accum = Tone.Time("0");  // holds the current rest's accumlated time (i.e. 2 or more rests in a row)

        // the first element is the duration of the first note, but that note starts at time zero which as
        // already been added to t_array so the value of duration_array[0]
        // is the start time of notes[1] (if there aren't any rest to consider).
        // in other words duration_array[i] is setting the start time for NEXT note (i+1 of the parallel notes array)
        // this is tricky.
        for(let i=0; i<duration_array.length; i++) {

            // if the next element in the array is a rest
            if(i<(duration_array.length-2) && duration_array[i+1].includes("r") ) {
                nextIsRest = true;
            } else {
                nextIsRest = false;  
            }

            // if current loop isn't rest
            if(duration_array[i].includes("r") === false) {
                isRest = false;
                // if there is rest accumulation prior to this note the add it to accum
//                if(rest_accum.toNotation != "0") {
//                    accum = t.add( rest_accum.toNotation() );
//                }
                // add the current value to the accum
                accum = t.add(duration_array[i]);
                console.log('typeof(t.add)='+typeof(t.add) );
                console.log("t.add("+duration_array[i]+") accum.toNotation()="+accum.toNotation());
                
                // if the next element in the array isn't a rest add accum to t_array
                if( !nextIsRest ) {
                    // add accum to t_array, reset for repeat
                    t_array.push( accum.toNotation() );
                    t = Tone.Time( accum.valueOf() );
                    rest_accum.set("0");
                } else {
                    t = Tone.Time( accum.valueOf() );
                }
            } else if(duration_array[i].includes("r") === true && i===0) { // first duration is a rest
                restValue = processRestNotation(duration_array[i]);
                t = Tone.Time(restValue);
                t_array = [];
                t_array.push(t.toNotation());

            } else { // current loop is a rest
                isRest = true;
                restValue = processRestNotation(duration_array[i]);
                accum = accum.add(restValue);
                if( !nextIsRest ) {
                    t_array.push( accum.toNotation() );
                }
                t = Tone.Time( accum.valueOf() );
                restValue = "";
            }
        }
        return t_array;
    }

    function mergeDurationsAndPitch(durations, pitches) {
        if(pitches == "")
            return undefined;
	
        var melody = [];
        var time_array = processDurationNotation(durations);
        var j = 0;
        for(var i=0; i<pitches.length; i++) {
            var oneNote = {};
            // loop thru the rhythm array until the pitch array is completed.
            j = j % time_array.length; 
            rhythmValue = time_array[j];

            Object.defineProperties(oneNote, {
              'time': {
                value: rhythmValue,
              },
              'note': {
                value: pitches[i],
              },
              'duration': {
                value: durations[i],
              }
            });

            melody.push(oneNote);
            j++;
        }
        return melody;
    }
//-----------------------------------------------------*/
var piano = null;
function Maria() {
    //        stopIt();
    var mariaPitches = ["Eb4", "A4", "Bb4", "Eb4", "A4", "Bb4", "C5", "A4", "Bb4", "C5", "A4", "Bb4", "Bb4", "A4", "G4", "F4", "Eb4", "F4", "Bb4", "Ab4", "G4", "F4", "Eb4", "F4", "Eb4", "G4",
        "Eb4", "A4", "Bb4", "Eb4", "A4", "Bb4", "C5", "A4", "Bb4", "C5",
        "D5", "Bb4", "D5", "Eb5", "D5", "C5", "Bb4", "D5", "D5", "Eb5", "D5", "C5", "Bb4", "D5", "Eb5", "F5"];

    var mariaDurations = ["8n", "8n", "2n + 4n", "8n", "4t", "4t", "4t", "4t", "4t", "4t", "8n", "2n + 4n", "8n", "8n", "8n", "8n", "8n", "4n + 8n", "8n", "8n", "8n", "8n", "8n", "4n", "4n", "2n+4n+8n", "8n", "8n", "2n + 4n", "8n", "4t", "4t", "4t", "4t", "4t", "4t", "8n", "2n + 4n", "8n", "8n", "8n", "8n", "8n", "4n + 8n", "8n", "8n", "8n", "8n", "8n", "4n", "4n", "2n+4n+8n"];
    var mariaTempo = 100;
    var mariaMelody = Rhythm.mergeDurationsAndPitch(mariaDurations, mariaPitches);
    var melodyTime = Math.ceil((mariaMelody[mariaMelody.length - 1].time + 0.25) * 1000 * (mariaTempo/60));
    var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    var stopAfterTime = async () => {
        await sleep(melodyTime)
        stopIt();
    }
    document.getElementById('soundGif').style.visibility = 'visible';
    console.log(mariaMelody);
    if (!piano) {
        //			piano = new Tone.PolySynth(Tone.Synth, {
        piano = new Tone.PolySynth(4, Tone.Synth, {
            "volume": -5,
            "oscillator": {
                "partials": [1, 2, 5],
            },
            "portamento": 0.006
        }).toMaster();
        //			}).toDestination();
    }

    var melodyPart = new Tone.Part(function (time, value) {
        piano.triggerAttackRelease(value.note, value.duration, time)
    }, mariaMelody).start(0);

    //TRANSPORT
    Tone.Transport.loopStart = "0";
    Tone.Transport.loopEnd = "12:0";
    Tone.Transport.loop = false;
    //	    var tempo = document.myForm.tempo.value;
    Tone.Transport.bpm.value = tempo;
    stopAfterTime();
    Tone.Transport.start("+0.2");

}


var kick = null;
var snare = null;
var conga = null;
//	KICK
function makeKick() {
    var kick = new Tone.MembraneSynth({
        "volume": -1,
        "envelope": {
            "sustain": 0.1,
            "attack": 0.005,
            "decay": 0.8
        },
        "octaves": 5
    }).toMaster();
    //	}).toDestination();
    return kick;
}



//	SNARE
function makeSnare() {
    var snare = new Tone.NoiseSynth({
        "volume": -7,
        "envelope": {
            "attack": 0.001,
            "decay": 0.5,
            "sustain": 0.01,
            "release": 0.02
        },
        "filterEnvelope": {
            "attack": 0.001,
            "decay": 0.1,
            "sustain": 0.01,
            "release": 0.2
        }
    }).toMaster();
    //	}).toDestination();
    return snare;
}

//  CONGA
function makeConga() {
    var conga = new Tone.MembraneSynth({
        "pitchDecay": 0.008,
        "octaves": 2,
        "envelope": {
            "attack": 0.0006,
            "decay": 0.5,
            "sustain": 0
        }
    }).toMaster();
    //	}).toDestination();
    return conga;
}

var lowPass = new Tone.Filter({
    "frequency": 14000,
}).toMaster();
//	}).toDestination();

//  CLOSED HIHAT
var closedHiHat = new Tone.NoiseSynth({
    "volume": -14,
    "filter": {
        "Q": 1
    },
    "envelope": {
        "attack": 0.01,
        "decay": 0.15
    },
    "filterEnvelope": {
        "attack": 0.01,
        "decay": 0.03,
        "baseFrequency": 4000,
        "octaves": -2.5,
        "exponent": 4,

    }
}).connect(lowPass);

function getCongaPitches(patternString, corePitchesArray) {
    var patternArray = patternString.split(',');
    var count = 0;
    var pitches = [];
    for (let i = 0; i < patternArray.length; i++) {
        if (parseInt(patternArray[i]) > 0) {
            pitches.push(corePitchesArray[count % corePitchesArray.length])
            count++;
        }
    }
    return pitches;
}

var kickPart;
var snarePart;
var congaPart;
var hiHatPart;

function DrumMachine() {
    console.log("DrumMachine");
    // create kick drum part
    var kickMenu = document.getElementById("someRhythmsKD");
    var kickPattern = kickMenu.options[kickMenu.selectedIndex].value;

    Rhythm.setOnlyDurationString(kickPattern, 1);
    var kickRhythm = Rhythm.getTransportCode(1);
    console.log("kickRhythm=" + kickRhythm);
    if (!kick) {
        kick = makeKick();
    }
    kickPart = new Tone.Part(function (time, value) {
        kick.triggerAttackRelease("A2", "8n", time)
    }, kickRhythm).start(0, "1:0");
    //---------------------------------------------------

    // create snare drum part
    var snareMenu = document.getElementById("someRhythmsSD");
    var snarePattern = snareMenu.options[snareMenu.selectedIndex].value;

    Rhythm.setOnlyDurationString(snarePattern, 2);
    var snareRhythm = Rhythm.getTransportCode(2);
    console.log("snareRhythm=" + snareRhythm);
    if (!snare) {
        snare = makeSnare();
    }
    snarePart = new Tone.Part(function (time) {
        snare.triggerAttack(time)
    }, snareRhythm).start(0, "1:0");
    //------------------------------------------------*/

    // create conga drum part
    var congaMenu = document.getElementById("someRhythmsCD");
    var congaPattern = congaMenu.options[congaMenu.selectedIndex].value;
    var congaTones = ["G4", "Ab4", "F#4"]; //,"G4","Ab4","F#4","G4","Ab4","F#4","G4","Ab4","F#4","G4","Ab4","F#4"];
    var congaPitches = getCongaPitches(congaPattern, congaTones);

    Rhythm.setDurationString(congaPattern, congaPitches, 3);
    var congaMelody = Rhythm.getMelodyWithRhythm(3);

    var congaRhythm = Rhythm.getTransportCode(3);

    console.log("congaRhythm=" + congaRhythm);
    console.log("congaMelody=" + congaMelody);
    if (!conga) {
        conga = makeConga();
    }
    congaPart = new Tone.Part(function (time, note) {
        conga.triggerAttackRelease(note, "8n", time)
    }, congaMelody).start(0, "1:0");

    // create hihat part
    var hiHatMenu = document.getElementById("someRhythmsHH");
    var hiHatPattern = hiHatMenu.options[hiHatMenu.selectedIndex].value;

    Rhythm.setOnlyDurationString(hiHatPattern, 4);
    var hiHatRhythm = Rhythm.getTransportCode(4);

    //        var hiHatRhythm = Rhythm.createTransportTimeCode(hiHatArray);
    console.log("hiHatRhythm=" + hiHatRhythm);

    hiHatPart = new Tone.Part(function (time) {
        closedHiHat.triggerAttack(time);
    }, hiHatRhythm).start(0, "1:0");

    updateVolume();

    //TRANSPORT
    updateMute();
    Tone.Transport.loopStart = "0:0";
    Tone.Transport.loopEnd = "2:0";
    Tone.Transport.loop = true;
    var tempo = document.myForm.tempo.value;
    Tone.Transport.bpm.value = tempo
    Tone.Transport.start("+0.1");


}