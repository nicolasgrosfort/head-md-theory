(
s.waitForBoot({
// Define a simple synth
SynthDef(\sine, { |freq = 440, amp = 0.5, gate = 1|
var sig, env;
env = EnvGen.kr(Env.perc(0.01, 0.5), doneAction: 2);
sig = SinOsc.ar(freq) _ env _ amp;
Out.ar(0, sig ! 2);
}).add;

    // Listen for OSC message '/play'
    OSCdef(\playNote, { |msg|
        var freq = msg[1];
        ("Received freq: " ++ freq).postln;
        Synth(\sine, [\freq, freq]);
    }, '/play');

    "Ready to receive OSC on /play".postln;

});
)
