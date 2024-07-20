let score = { 'number': 0, 'score': 0, 'total': 0 }
let chapter = {
    '01': true
    ,'02': false
    ,'03': true
    ,'04': false
    ,'05': false
}

let sampleQuestions = [
    '(　　　　)에 들어갈 알맞은 것을 고르세요.<br/><hr/>',
    '밑줄 친 부분과 의미가 비슷한 것을 고르세요.<br/><hr/>',
    '밑줄 친 부분이 틀린 것을 고르세요.<br/><hr/>',
    '다음의 내용과 같은 것을 고르세요.<br/><hr/>',
    '다음 글에 대한 설명으로 옳은 것을 고르세요.<br/><hr/>',
    '다음 글에 대한 설명으로 옳지 않은 것을 고르세요.<br/><hr/>',
    '윗글의 중심 내용으로 옳은 것을 고르세요.<br/><hr/>',
]

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

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

//function makeCunksOfText(text){
//    const maxLength = 190;
//    let speechChunks = [];
//
//    // Split the text into chunks of maximum length maxLength without breaking words
//    while(text.length > 0){
//        if(text.length <= maxLength){
//            speechChunks.push(text);
//            break;
//        }
//        let chunk = text.substring(0, maxLength + 1);
//
//        let lastSpaceIndex = chunk.lastIndexOf(' ');
//        if(lastSpaceIndex !== -1){
//            speechChunks.push(text.substring(0, lastSpaceIndex));
//            text = text.substring(lastSpaceIndex + 1);
//        }
//        else{
//            // If there are no spaces in the chunk, split at the maxLength
//            speechChunks.push(text.substring(0, maxLength));
//            text = text.substring(maxLength);
//        }
//    }
//    return speechChunks
//}
//
//
//async function speakText(text){
//    const speechChunks = makeCunksOfText(text);
//    for(let i=0; i < speechChunks.length ;++i){
//        await new Promise((resolve, reject) => {
//            window.speechSynthesis.cancel();
//            let speech = new SpeechSynthesisUtterance(speechChunks[i]);
//            speech.voice = speechSynthesis.getVoices()[15];
//            window.speechSynthesis.speak(speech);
//            speech.onend = () => {
//                resolve();
//            };
//            speech.onerror = (error) => {
//                resolve();
//            };
//        });
//    }
//}

function fntPlaySample(text){
    speechSynthesis.cancel();
    text = text.replaceAll('<br/>','　').replaceAll('<hr/>','　').replaceAll('<u>','　').replaceAll('</u>','　');
    var msg = new SpeechSynthesisUtterance();
    msg.voice = speechSynthesis.getVoices()[15];
    msg.lang = 'ko';
    msg.text = text;
    speechSynthesis.speak(msg);
}

function reset(){
    document.querySelector('#answer').innerHTML = '';
    document.querySelector('input[value=Next]').hidden = true;
}

function getQuestion(){
    if(0 == list.length){
        var msg = 'Score : ' + ('' + (score.score / score.total * 100)).split('.')[0];
        msg += '\n' + score.score + ' / ' + score.total;
        msg += '\n\nComplete!';
        alert(msg);
        location.href = '../../index.html';
    }
    speechSynthesis.cancel();
    reset();
    shuffle(list);
    var obj = list[0];
    var eList = new Array();
    var correctNumber = 0;
    list.shift();
    score.number += 1
    document.querySelector('#number').innerHTML = score.number;

    shuffle(obj.list);
    eList.push(obj.list[0]);
    eList.push(obj.list[1]);
    eList.push(obj.list[2]);
    eList.push(obj.correct);
    shuffle(eList);

    document.querySelector('#content').innerHTML = obj.content;

    var example = '';
    for(var i=0; i<eList.length ;++i){
        example += '<div class="col-12 mb-3 text-start out-line">';
        example += '  <input type="button" value="' + (i+1) + '"';
        example += '    class="btn btn-info fw-bold text-light align-middle selectNumber"';
        example += '    data-value="' + eList[i] + '">';
        example += '  <div class="d-inline-block align-middle"> ' + eList[i] + '</div>';
        example += getPlayIcon(eList[i]);
        example += '</div>';
        if(obj.correct == eList[i]) correctNumber = i+1
    };
    document.querySelector('#buttons').innerHTML = example;

    document.querySelectorAll('.playExample').forEach((e)=>{
        e.addEventListener('click', ()=>{
            fntPlaySample(e.dataset.value);
//            speakText(e.dataset.value);
        });
    });

    document.querySelector('.playContent').innerHTML = getPlayIcon(obj.content);
    document.querySelector('.playContent > svg').addEventListener(
        'click'
        , () => {
            fntPlaySample(document.querySelector('.playContent > svg').dataset.value);
//            speakText(document.querySelector('.playContent > svg').dataset.value);
        }
    );

    document.querySelectorAll('.selectNumber').forEach((e)=>{
        e.addEventListener('click', ()=>{
            speechSynthesis.cancel();
            var result = '<span class="fw-bold fs-1 text-danger">X</span>';

            if(e.dataset.value == obj.correct){
                score.score += 1
                result = '<span class="fw-bold fs-1 text-success">O</span>';
            }
            document.querySelector('#answer').innerHTML = '<hr/>' + result + '<br/><div class="text-start text-light">' + correctNumber + '. ' + obj.correct + '</div>';

            document.querySelectorAll('.selectNumber').forEach((e)=>{
                e.disabled = true;
                document.querySelector('input[value=Next]').hidden = false;
            });
        });
    });
    document.querySelector('input[value=Next]').addEventListener('click', getQuestion);
}

window.addEventListener('load', function(event){
    if(undefined != document.querySelector('#answer')){
        score.total = list.length
        document.querySelector('#total').innerHTML = score.total;
        document.querySelector('#number').innerHTML = score.number;
        getQuestion()
    }
})