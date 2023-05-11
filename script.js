/*
    Guide
    --> First Declaration Variables
    --> Selector
        -- QS
        -- GetBy
    --> Add Event Listener
        -- With Function Inside
        -- Just Event Listener
    --> Function
        ### Unorganized Function
        ### Super function for counting CIDR and VLSM
            $1. Counting with CIDR
                +++ Methods for counting CIDR
            $2. Counting with VLSM
                +++ Methods for counting VLSM
        ### Super function for sh0wResult CIDR and VLSM
            $1. Show Result from CIDR subneting
                +++ Methods for counting CIDR
            $2. Show Result from VLSM subneting
                +++ Methods for counting VLSM
*/

//--> First Declaration Variables
var allowedChar = [1,2,3,4,5,6,7,8,9,0,'0','1','2','3','4','5','6','7','8','9',',','Backspace','Enter'];
var arrPrefix = [24, 25, 26, 27, 28, 29, 30],
    arrNet = [1, 2, 4, 8, 16, 32, 64],
    arrTotHost = [254, 126, 62, 30, 14, 6, 2];
var opt = 'cidr',
    basicIP = '192.168.1.',
    resultOption = 'simple';
// var isTableFilled = false;
var messages = [
    "Our sistem just could to count subneting IPv4 C Class (from /24 until /30)"
], simpleMessages = [
    ["Sorry", "I'm sorry", "Forgive me"],
    ["Success", "Great"],
    ["Invalid", "Error", "Whoops"],
    ["Yeay", "Hore"]
], errors = [
    'Invalid keyword, please fill it like example above', 
    'Invalid, can\'t put 0 for first number digit', 
    "Invalid, can't put ',' for first character", 
    "Invalid, Don't let the column empety",
    "Error! Don't paste invalid string",
    "Sorry, some text is deleted. Text allowed is :"     
];
var results = [
    "No data can be shown",
    "Try to count it by VLSM",
    "Too many host <br/> Maybe you should count the subnet by IP Address B or A Class Subneting Option. <br/> But unfortunately, it is not available on my sistem in this version"
];
var arrIPNet = [], 
    arrIPHP = [], 
    arrIPHT = [], 
    arrIPBrd = [];
var lastChar;
var arrHostInputed = []; // This is important variable that store what user want

// --> Selector
    // -- QS
const hostInput = document.querySelector('.host-input');
const err = document.querySelector('.err');
const timer4s = document.querySelector('.timer4s');
const startSubneting = document.querySelector('.startSubneting');
const errText = document.querySelector('.err-text');
const result = document.querySelector('.result');
const selectMethod = document.querySelector('#methodSelected');
const resultOpt = document.querySelector('#resultOpt');

    // -- GetBy

// --> Add Event Listener
    // -- With the function inside

    // -- Just event listener
startSubneting.addEventListener('click', startSubnetingFun);
document.addEventListener('DOMContentLoaded', defaultCon);
selectMethod.addEventListener('click', chooseOption)
resultOpt.addEventListener('click', changeResult);

// --> Function
function defaultCon() {
    // This is function for default condition, or after document relod
    hostInput.focus(); 
    isTableFilled=false; 
    result.innerHTML = results[0]; 
    hostInput.value='';
    defaultAppearance();
}

function defaultAppearance() {
    resultOpt.classList.add('disapear');
    result.classList.add('fs-result');
    result.classList.remove('result-table');
}

function limitChars(e) {
    // To detect what char is on the end of the string
    var hostInp = document.querySelector('#hostInp').value;
    lastChar = hostInp.substr(hostInp.length-1);

    // Prevent all char except allowedChar
    if (allowedChar.indexOf(e.key) == -1) {
        errText.innerHTML = errors[0];
        err.classList.remove('disapear');
        timer4s.classList.add('animate1');
        timer4s.addEventListener('transitionend', function () {
            err.classList.add('disapear');
            timer4s.classList.remove('animate1');
        });
        return false;
    } else {
        if (hostInp == '' || lastChar == ',') {
            // Prevent zero 
            if (e.key == 0) {
                errText.innerHTML = errors[1];
                err.classList.remove('disapear');
                timer4s.classList.add('animate1');
                timer4s.addEventListener('transitionend', function () {
                    err.classList.add('disapear');
                    timer4s.classList.remove('animate1');
                });
                return false;   
            // Prevent ','
            } else if (e.key == ',') {
                errText.innerHTML = errors[2];
                err.classList.remove('disapear');
                timer4s.classList.add('animate1');
                timer4s.addEventListener('transitionend', function () {
                    err.classList.add('disapear');
                    timer4s.classList.remove('animate1');
                });
                return false;   
            // Prevent enter if it is still empety
            } else if (hostInp == '' && e.key == 'Enter') {
                defaultAppearance();
                result.innerHTML = results[0];
                errText.innerHTML = errors[3];
                err.classList.remove('disapear');
                timer4s.classList.add('animate1');
                timer4s.addEventListener('transitionend', function () {
                    err.classList.add('disapear');
                    timer4s.classList.remove('animate1');
                });
                return false;   
            } else {                
                // Except all chars has been prevented, allow it
                return true;
            }
        }        
    }
}

function preventCopas(e) {
    var validStr = true;
    var paste = e.clipboardData && e.clipboardData.getData ?
        e.clipboardData.getData('text/plain') :
        window.clipboardData && window.clipboardData.getData ?
        window.clipboardData.getData('Text') :
        false;
    var arrPaste = paste.split(',');
    arrPaste = arrPaste.map(item => {return parseInt(item)});

    arrPaste.forEach(function (el, i) {
        if (!el) {
            validStr = false;
            arrPaste.splice(i, 1);
        } 
    });

    if (!validStr) {                            
        if (arrPaste.length) {
            errText.innerHTML = errors[5] + arrPaste.join();
            err.classList.remove('disapear');
            timer4s.classList.add('animate1');
            timer4s.addEventListener('transitionend', function () {
                err.classList.add('disapear');
                timer4s.classList.remove('animate1');
            });      
            if (lastChar == ',' || hostInput.value == '') {
                hostInput.value += arrPaste.join();
                return false;
            } else {
                hostInput.value += ',' + arrPaste.join();
                return false;
            } 
        } else {
            errText.innerHTML = errors[4];
            err.classList.remove('disapear');
            timer4s.classList.add('animate1');
            timer4s.addEventListener('transitionend', function () {
                err.classList.add('disapear');
                timer4s.classList.remove('animate1');
            });     
            return false;
        }  
    } else {
        return true;
    }
}

function changeResult(e) {
    if (resultOption == 'simple') {
        resultOption = 'advanced';
        startSubnetingFun(e);
        resultOpt.innerText = 'Show Simple Information';
        resultOpt.classList.add('simpleOpt');
        resultOpt.classList.remove('advanceOpt');
        return;
    } else {
        resultOption = 'simple';
        startSubnetingFun(e);
        resultOpt.innerText = 'Show More Informations';
        resultOpt.classList.remove('simpleOpt');
        resultOpt.classList.add('advanceOpt');
        return;
    }
}

function chooseOption(e) {
    opt = e.target.value;
    if (!hostInput.value) {
        return;
    } else {
        startSubnetingFun(e);        
    }
}

function startSubnetingFun(e) {
    e.preventDefault();
    var strInput = hostInput.value;
    if (!strInput) {
        defaultAppearance();
        result.innerHTML = results[0]; 
        errText.innerHTML = errors[3];
                err.classList.remove('disapear');
                timer4s.classList.add('animate1');
                timer4s.addEventListener('transitionend', function () {
                    err.classList.add('disapear');
                    timer4s.classList.remove('animate1');
                });
                return false;
    }
    var arrInputStr = strInput.split(',');
    var arrInpInt = arrInputStr.map(item => {return parseInt(item)});
    console.log(arrInpInt)
    // Bagian untuk menyelesaikan masalah kasus 12, atau ,12 --Tidk ditulis angka selanjutnya atau sebelumnya
    arrInpInt.forEach((el, i) => {
        if (!el) {
            console.log('It is run on index: '+ i, '\n', "its value is; "+el);
            // Membuang semua nilai array yang punya nilai falsy (NaN, 0, '')
            arrInpInt.splice(i, 1);
    console.log(arrInpInt)

        }
    });
    console.log(arrInpInt)
    
    // sekarang defaultnya adalah subneting kelas C, jika nanti sudah pengembangan maka redirect fungsi lain yang bisa menghitung class A,B dan lainnya
    var allHost = 0;
    arrInpInt.forEach((el) => {allHost += el});
    if (allHost > 254) {
        defaultAppearance();
        result.classList.add('err');
        result.innerHTML = results[2];
        return;
    }

    // return;
    arrHostInputed = arrInpInt;
    if (selectMethod.value == 'cidr') {
        if (!isTableFilled) {
            startCIDR(arrInpInt);        
        } else {
            resultBody.remove();
            startCIDR(arrInpInt);        
        }
    } else {
        startVLSM(arrInpInt);
    }
}

    // ### Super function for counting CIDR and VLSM
        // $1. Counting with CIDR
function startCIDR(arrInputInt) {
    var net;
    var isNetDiscovered = 0;
    var jumNet = arrInputInt.length;
    var maxUserInputed = Math.max.apply(null, arrInputInt);
    arrNet.forEach(function (el, ind) {
        if ((jumNet <= el) && isNetDiscovered == 0) {
            net = ind;
            isNetDiscovered = 1;
        }
    });
    
    var maxUserAllowed = arrTotHost[net];
    if (maxUserInputed > maxUserAllowed) {
        var ableVLSM = startVLSM(arrInputInt, false);
        defaultAppearance();
        if (ableVLSM) {
            result.innerHTML = results[1];
            result.classList.add('info');
        } else {
            result.classList.add('err');
            result.innerHTML = results[2];
        }
        return;
    }

    // Here i use method 3
    // countCIDRMethod1(arrNet[net]); 
    // countCIDRMethod2(arrNet[net]); //Notes arrNet[net] return value jumlah network fixed according to array that has declared above
    countCIDRMethod3(arrNet[net], arrInputInt); 
}

            // +++ Methods for counting CIDR
// Method 1
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
    
    var currentBrd = lastIPNet+arrTotHost[arrNet.indexOf(knownNet)];
    arrIPHT.push(currentBrd);
    lastIPHT = currentBrd;
    
    arrIPBrd.push(lastIPHT+1);
    lastIPBrd = lastIPHT+1;
    }
}

// Method 2
function countCIDRMethod2(knownNet) {
    var host = arrTotHost[arrNet.indexOf(knownNet)],
        totalIP = host+2;
    var lastIPNet;
    for (var i = 0; i < knownNet; i++) {
        if (i == 0) {
            arrIPNet.push(0);
            lastIPNet = 0;
        } else {
            arrIPNet.push(lastIPNet+totalIP);
            lastIPNet = lastIPNet+totalIP;
        }
    }
    // Maping from singular array (arrIPNet)
        arrIPHP = arrIPNet.map(item => { return item + 1; });
        arrIPHT = arrIPNet.map(item => { return item + host; });
        arrIPBrd = arrIPHT.map(item => { return item + 1; });

    showSimpleResult(knownNet, arrIPNet, arrIPHP, arrIPHT, arrIPBrd);
}

// Method 3
function countCIDRMethod3(knownNet, hostInputed) {
    var isHostDiscovered = 0;
    var index_host;
    var maxHost = Math.max.apply(null, hostInputed);
    arrTotHost.forEach(function (el, ind) {
        if ((maxHost > el) && isHostDiscovered == 0) {
            index_host = ind-1;
            isHostDiscovered = 1;
        } else if (maxHost == 2 || maxHost == 1) {
            index_host = 6;
        }             
    });
    
    var maxHostAllowed = arrTotHost[index_host];
    var totalIP = maxHostAllowed+2;
    var lastIPNet;
    for (var i = 0; i < hostInputed.length; i++) {
        if (i == 0) {
            arrIPNet.push(0);
            lastIPNet = 0;
        } else {
            arrIPNet.push(lastIPNet+totalIP);
            lastIPNet = lastIPNet+totalIP;
        }
    }
    // Maping from singular array (arrIPNet)
        arrIPHP = arrIPNet.map(item => { return item + 1; });
        arrIPHT = arrIPNet.map(item => { return item + maxHostAllowed; });
        arrIPBrd = arrIPHT.map(item => { return item + 1; });

    knownNet = arrNet[index_host];
    if (resultOption == 'simple') {        
        showSimpleResult(knownNet, arrIPNet, arrIPHP, arrIPHT, arrIPBrd);
    } else {        
        showAdvancedResult(knownNet, arrIPNet, arrIPHP, arrIPHT, arrIPBrd);
    }
}

    // $2. Counting with VLSM
function startVLSM(arrInpInt, show = true) {
    arrInpInt.sort(function (a, b) {
        return a - b;
    });
    arrInpInt.reverse();
    if (show) {
        countVLSMMethod1(arrInpInt, show);        
    } else {
        return countVLSMMethod1(arrInpInt, false);
    }
}
        // +++ Methods for counting VLSM
// Method1
function countVLSMMethod1(arrHostInputed, show) {
    var arrMaxHostAllowed = [];
    arrHostInputed.forEach(function (hostInputed, ind) {
        var isHostDiscovered = 0;
        arrTotHost.forEach(function (totalHost, indexLoop) {
            if ((hostInputed > totalHost) && isHostDiscovered == 0) {
                index_host = indexLoop-1;
                isHostDiscovered = 1;
                arrMaxHostAllowed.push(arrTotHost[index_host]);
                return;
            } else if (hostInputed <= 2 && isHostDiscovered == 0) {
                index_host = 6;
                isHostDiscovered = 1;
                arrMaxHostAllowed.push(arrTotHost[index_host]);
                return;
            } else {
                // it is execute when user just 1. create another function of it
            } 
        });        
    });
    
    // Fix prolem too many host 
    var arrNetSegment = [];
    arrMaxHostAllowed.forEach((el, ind) => {
        arrNetSegment.push(arrNet[arrTotHost.indexOf(el)]);
    });
    arrNetSegment = arrNetSegment.map(it => {return 1/it});
    var allNet = 0;
    arrNetSegment.forEach((el) => {allNet += el});
    if (allNet > 1) {
        defaultAppearance();
        result.classList.add('err');
        result.innerHTML = results[2];
        return false;
    } else {        
        if (!show) {
            return true;
        }
        var arrPrefDiscovered = [];
        var lastIPNet;
        for (var i = 0; i < arrHostInputed.length; i++) {
            var totalIP = arrMaxHostAllowed[i-1]+2;
            if (i == 0) {
                arrIPNet.push(0);
                lastIPNet = 0;
                arrIPHT.push(lastIPNet+arrMaxHostAllowed[i])
            } else {
                arrIPNet.push(lastIPNet+totalIP);
                lastIPNet = lastIPNet+totalIP;
                arrIPHT.push(lastIPNet+arrMaxHostAllowed[i])
            }
            arrPrefDiscovered.push(arrTotHost.indexOf(arrMaxHostAllowed[i]))
        }
        arrIPHP = arrIPNet.map(item => { return item + 1; });
        arrIPBrd = arrIPHT.map(item => { return item + 1; });
        if (resultOption == 'simple') {        
            showSimpleResult(arrPrefDiscovered, arrIPNet, arrIPHP, arrIPHT, arrIPBrd);
        } else {        
            showAdvancedResult(arrPrefDiscovered, arrIPNet, arrIPHP, arrIPHT, arrIPBrd);
        }
    }
    // console.log('Host Inputed: '+arrHostInputed, '\n', 'Array max host allowed: ' + arrMaxHostAllowed, '\n', 'Array IP Net: '+arrIPNet, '\n', 'Arr Ip hp: '+ arrIPHP, '\n', 'Arr Ip ht: '+ arrIPHT, '\n', 'Arr Ip Brd: '+ arrIPBrd)
}

// ### Super function for sh0wResult CIDR and VLSM
// Creting table
function createTable(type) {
    var resTab = document.createElement('table');
    resTab.border = "1";
    var trh = document.createElement('tr');

    var thSimpleTable = ['Subnet', 'Prefix', 'IP Network', 'IP Host Pertama', 'IP Host Terakhir', 'IP Broadcast'];
    if (type = 'simple') {
        for (let i = 0; i < thSimpleTable.length; i++) {
            var th = document.createElement('th');
            th.innerText = thSimpleTable[i];
            trh.appendChild(th);
        }

        resTab.appendChild(trh);
        result.appendChild(resTab);
        return resTab;
    }
}

// $1. Show Result from CIDR subneting
    // +++ Show simple Result CIDR
// row creator
function showSimpleResult(superIndex, listIP_Net, listIP_HP, listIP_HT, listIP_Brd) {
    hostInput.value = arrHostInputed.join();
    result.classList.remove('err');
    result.classList.remove('info');

    var resTab = createTable('simple');
    var allIP = [listIP_Net, listIP_HP, listIP_HT, listIP_Brd];

    var tbody = document.createElement('tbody');
    tbody.id = 'resultBody';
    listIP_Net.forEach(function (el, i) {
        var trow = document.createElement('tr');

        var tdSubnet = document.createElement('td');
        tdSubnet.innerText = i+1;
        tdSubnet.classList.add('tfields');
        trow.appendChild(tdSubnet);

        var tdPrefix = document.createElement('td');
        if (selectMethod.value == 'cidr') {
            tdPrefix.innerText = '/'+arrPrefix[arrNet.indexOf(superIndex)];            
        } else {
            tdPrefix.innerText = '/'+arrPrefix[superIndex[i]];
        }
        tdPrefix.classList.add('tfields');
        trow.appendChild(tdPrefix);

            // Looping for creating td and append it to tr
            for (let col = 0; col < allIP.length; col++) {
                var td = document.createElement('td'); 
                td.classList.add('tfields');                    
                td.innerText = basicIP+allIP[col][i];
                trow.appendChild(td);
            }
        
            tbody.appendChild(trow);
    });
    resTab.appendChild(tbody);
    arrInputInt = [];
    arrIPNet = [];
    arrIPHP = [];
    arrIPHT = [];
    arrIPBrd = [];
    result.innerHTML = '';
    result.classList.remove('fs-result');
    result.classList.add('result-table');
    result.appendChild(resTab);
    resultOpt.classList.remove('disapear');
}
        
// Show advanced result
function showAdvancedResult(superIndex, listIP_Net, listIP_HP, listIP_HT, listIP_Brd) {
    hostInput.value = arrHostInputed.join();
    result.classList.remove('err');
    result.classList.remove('info');

    var resTab = createTable('simple');
    var allIP = [listIP_Net, listIP_HP, listIP_HT, listIP_Brd];

    var tbody = document.createElement('tbody');
    tbody.id = 'resultBody';
    listIP_Net.forEach(function (el, i) {
        var trow = document.createElement('tr');

        var tdSubnet = document.createElement('td');
        tdSubnet.rowSpan = "2";
        tdSubnet.innerText = i+1;
        tdSubnet.classList.add('tfields');
        trow.appendChild(tdSubnet);
        
        var tdPrefix = document.createElement('td');
        tdPrefix.rowSpan = "2";
        if (selectMethod.value == 'cidr') {
            tdPrefix.innerText = '/'+arrPrefix[arrNet.indexOf(superIndex)];            
        } else {
            tdPrefix.innerText = '/'+arrPrefix[superIndex[i]];
        }
        tdPrefix.classList.add('tfields');
        trow.appendChild(tdPrefix);

            // Looping for creating td and append it to tr
            for (let col = 0; col < allIP.length; col++) {
                var td = document.createElement('td'); 
                td.classList.add('tfields');                    
                td.innerText = basicIP+allIP[col][i];
                trow.appendChild(td);
            }
        
        tbody.appendChild(trow);

        var trow2 = document.createElement('tr');
        var tdAllocated = document.createElement('td');
        tdAllocated.colSpan = "4";
        var str = 'Allocated: '+arrHostInputed[i]+' IP <br>';
        if (selectMethod.value == 'cidr') {
            var maxHost = arrTotHost[arrNet.indexOf(superIndex)];            
        } else {
            var maxHost = arrTotHost[superIndex[i]];
        }
        var presentase = Math.round(arrHostInputed[i]/maxHost*100);
        if (arrHostInputed[i] > 2) {
            str+= '<b class="gr">1</b> Gateway: <b class="gr">'+basicIP+arrIPHP[i]+'</b>,<br><b class="gr">'+(arrHostInputed[i]-1)+'</b> Address give out: <b class="gr">'+basicIP+(arrIPHP[i]+1)+' - '+basicIP+(arrIPNet[i]+arrHostInputed[i])+'</b> >> <span class="pr-blue"> ('+presentase+' %)</span>';
        } else {
            if (arrHostInputed[i] == 2) {
                str+= '<b class="gr">1</b> Gateway: <b class="gr">'+basicIP+arrIPHP[i]+'</b>,<br><b class="gr">'+(arrHostInputed[i]-1)+'</b> Address give out: <b class="gr">'+basicIP+(arrIPHP[i]+1)+'</b> >> <span class="pr-blue"> ('+presentase+' %)</span>';
            } else {
                str+= '<b class="gr">1</b> Gateway: <b class="gr">'+basicIP+arrIPHP[i]+'</b>,<br><b class="gr">'+(arrHostInputed[i]-1)+'</b> Address give out: <b class="gr">'+'None'+'</b> >> <span class="pr-blue"> ('+presentase+' %)</span>';
            }
        }
        tdAllocated.innerHTML = str;
        tdAllocated.classList.add('td-allocated');        

        trow2.appendChild(tdAllocated);

        tbody.appendChild(trow2);
    });
    resTab.appendChild(tbody);
    arrInputInt = [];
    arrIPNet = [];
    arrIPHP = [];
    arrIPHT = [];
    arrIPBrd = [];
    result.innerHTML = '';
    result.classList.remove('fs-result');
    result.classList.add('result-table');
    result.appendChild(resTab);
    resultOpt.classList.remove('disapear');
}