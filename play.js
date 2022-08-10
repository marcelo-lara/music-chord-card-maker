const d_measure = document.querySelectorAll("div.measure");

const player = {
    current: 0,
    tempo: 110,
    timer: undefined,
    timer_ms: 0,
    next: (_idx) => {
        d_measure[player.current].classList.remove('on');
        player.current++;
        if (_idx) player.current = _idx;
        if (player.current > d_measure.length - 1) player.current = 0;
        d_measure[player.current].classList.add('on');
        player.timer = setTimeout(player.next, player.timer_ms);
    },
    play: () => {
        player.current = d_measure.length - 1
        player.bpm_set(110);
        player.next(0);
    },
    bpm_set: (bpm) => {
        player.tempo = bpm;
        player.timer_ms = (60000 / player.tempo) * 4;
        document.querySelector("span.tempo").innerHTML = player.tempo + " bpm";
    },
    bpm_up: () => {
        player.tempo++;
        player.bpm_set(player.tempo);
    },
    bpm_down: () => { 
        player.tempo--;
        player.bpm_set(player.tempo);

    },

};

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    switch (event.key) {
        case "ArrowUp":
            player.bpm_up();
            break;

        case "ArrowDown":
            player.bpm_down();
            break;

        default:
            console.log(`Key pressed ${keyName}`);
            break;
    }
}, false);

(() => { player.play(); })()