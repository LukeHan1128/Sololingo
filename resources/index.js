function getPlayIcon(data){
    var result = '';
    result = '<svg xmlns="http://www.w3.org/2000/svg" width="10%" fill="currentColor" class="bi bi-play align-middle playExample" viewBox="0 0 16 16" data-value="' + data + '">';
    result += '<path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>';
    result += '</svg>';
    return result;
}

function shuffle(array){
    array.sort(() => Math.random() - 0.5);
}

function fntPlaySample(text){
    var msg = new SpeechSynthesisUtterance();
    msg.voice = speechSynthesis.getVoices()[15];
    msg.lang = 'ko';
    msg.text = text;
    window.speechSynthesis.speak(msg);
}

function initializing(){
    shuffle(list);
    document.querySelector('#content').innerHTML = content;

    var example = '';
    for(var i=0; i<list.length ;++i){
        example += '<div class="col-12 mb-3 text-start">';
        example += '  <input type="button" value="' + (i+1) + '"';
        example += '    class="btn btn-info fw-bold text-light align-middle selectNumber"';
        example += '    data-value="' + list[i] + '">';
        example += '  <span class="align-middle"> ' + list[i] + '</span>';
        example += getPlayIcon(list[i]);
        example += '</div>';
    };
    document.querySelector('#buttons').innerHTML = example;

    document.querySelectorAll('.playExample').forEach((e)=>{
        e.addEventListener('click', ()=>{
            fntPlaySample(e.dataset.value);
        });
    });
    document.querySelector('.playContent').addEventListener('click', ()=>{fntPlaySample(content);});

    document.querySelectorAll('.selectNumber').forEach((e)=>{
        e.addEventListener('click', ()=>{
            var result = '<span class="fw-bold fs-1 text-danger">X</span>';

            if(e.dataset.value == correct){
                result = '<span class="fw-bold fs-1 text-success">O</span>';
            }
            document.querySelector('#answer').innerHTML = result + '<br/><span class="text-light">' + correct + '</span>';

            document.querySelectorAll('.selectNumber').forEach((e)=>{
                e.disabled = true;
                document.querySelector('input[value=Next]').hidden = false;
            });
        });
    });
    document.querySelector('input[value=Next]').addEventListener('click', ()=>{ console.log('next');});
}

window.addEventListener('load', function(event){
    initializing()
})