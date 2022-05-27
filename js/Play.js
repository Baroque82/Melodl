function playMelody() {
    //document.getElementById('soundGif').style.visibility = 'visible'; //Math.ceil(currMelody[currMelody.length-1].time*1000)
    var currMelody = Rhythm.mergeDurationsAndPitch(rhythm, pitches);
    //var tempo = 100;
    var melodyTime = Math.ceil((currMelody[currMelody.length - 1].time + 0.25) * 1000*(tempo/60));
    var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    var stopAfterTime = async () => {
        await sleep(melodyTime)
        stopIt();
    }

    document.getElementById('soundGif').style.visibility = 'visible';
    //console.log(currMelody);
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
    }, currMelody).start(0);

    //TRANSPORT
    Tone.Transport.loopStart = "0";
    Tone.Transport.loopEnd = "12:0";
    Tone.Transport.loop = false;
    //	    var tempo = document.myForm.tempo.value;
    //var tempo = 100;
    Tone.Transport.bpm.value = tempo;
    stopAfterTime();
    Tone.Transport.start("+0.2");
    //document.getElementById('soundGif').style.visibility = 'hidden';

}