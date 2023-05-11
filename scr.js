var show = document.querySelector('.show');
var con = document.querySelector('.con');

var arrPrefix = [24, 25, 26, 27, 28, 29, 30];

var arrNet = [1, 2, 4, 8, 16, 32, 64];
var arrHost = [254, 126, 62, 30, 14, 6, 2];

var knownNet = 4;

var arrIPNet = [];
var arrIPHP = [];
var arrIPHT = [];
var arrIPBrd = [];

function countCIDRMethod1(knownNet) {
    var lastIPNet, lastIPHP, lastIPHT, lastIPBrd;
    for (var i = 0; i < knownNet; i++) {
    if (i == 0) {
        arrIPNet.push(0);
        lastIPNet = 0;
    } else {
        arrIPNet.push(lastIPBrd+1);
        lastIPNet = lastIPBrd+1;
    }
    
    arrIPHP.push(lastIPNet+1);
    lastIPHP = lastIPNet+1;
    
    var currentBrd = lastIPNet+arrHost[arrNet.indexOf(knownNet)];
    arrIPHT.push(currentBrd);
    lastIPHT = currentBrd;
    
    arrIPBrd.push(lastIPHT+1);
    lastIPBrd = lastIPHT+1;
    }
}


var str = JSON.stringify(arrIPNet);

show.innerText = str;

var texts = document.createElement('p');
   texts.innerText = nextBrd;
   con.appendChild(texts);