const player = {
    beats: 0,
    current: 0,
    tempo: 110,
    timer: undefined,
    timer_ms: 0,
    staff_wrapper: undefined,
    playing: false,
    init: () => {
        fetch("cantaloop.json")
        .then(response => response.json())
        .then(player.load);
    },
    load: (data)=> {

        //get song data
        player.bpm_set(parseInt(data.bpm??100));
        player.title_set(data.title??'unknown');

        //split measures
        const _measures = [];
        let _m = [];
        let _dur = 0;
        for(const n of data.staff){
            n.dur = parseInt(n.dur);
            _m.push(n);
            
            _dur += n.dur;
            if (_dur >= 4 ){
                _measures.push(_m);
                _m = [];
                _dur=0;
            }
        }

        //render
        let _beat=0;
        player.staffwrapper = document.querySelector("div.sheet")
        for(const m of _measures){
            const measure = document.createElement('div');
            measure.classList = 'measure';
            
            for(const n of m){
                const note = document.createElement('span');
                note.innerHTML = n.note;
                note.className = 'note';
                for (let _b = 0; _b < n.dur; _b++) {
                    note.classList.add( 'b'+(_b + _beat) );
                }
                _beat = _beat + n.dur;
                measure.appendChild(note);
            }
            player.staffwrapper.appendChild(measure);
        }
        player.beats = _beat;

        //arm player
        player.current = -1;

       //  player.next();
    },
    next: (_idx) => {
        clearTimeout(player.timer);
        if (_idx) player.current = _idx;

        //get elems
        const _current = player.staffwrapper.querySelector('.b'+player.current);
        player.current++;
        if (player.current > (player.beats -  1)) player.current = 0;
        const _next = player.staffwrapper.querySelector('.b'+player.current);

        //set state
        _next.classList.add('on');
        if(_current!=_next && _current){
            _current.classList.remove('on');
        }

        //show pos
        const _m = parseInt(player.current / 4)+1
        const _b = ((player.current)- ((_m-1) *4))+1
        document.querySelector('.pos.m').innerHTML = _m;
        document.querySelector('.pos.b').innerHTML = _b;

        //schedule next
        player.timer = setTimeout(player.next, player.timer_ms);
    },
    play: () => {
        player.next(-1);
        player.playing = true;
    },
    stop: () => {
        clearTimeout(player.timer);
        player.playing = false;
        player.staffwrapper.querySelector('.on').classList.remove('on');  
    },
    bpm_set: (bpm) => {
        player.tempo = bpm;
        player.timer_ms = (60000 / player.tempo);
        document.querySelector("span.tempo").innerHTML = "@" + player.tempo + " bpm";
    },
    bpm_up: () => {
        player.tempo++;
        player.bpm_set(player.tempo);
    },
    bpm_down: () => { 
        player.tempo--;
        player.bpm_set(player.tempo);

    },
    title_set: (title) => {
        document.querySelector("div.title").innerHTML = title;
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


        case " ":
            if(player.playing){
                player.stop()
            }else{
                player.play();
            }
            break;
    
        default:
            console.log(`Key pressed [${keyName}]`);
            break;
    }
}, false);

(() => { player.init(); })()