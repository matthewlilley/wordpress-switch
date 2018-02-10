import "../css/popup.css";

Array.prototype.alphanumSort = function(caseInsensitive) {
    for (var z = 0, t; t = this[z]; z++) {
        this[z] = [];
        var x = 0, y = -1, n = 0, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
            var m = (i == 46 || (i >=48 && i <= 57));
            if (m !== n) {
                this[z][++y] = "";
                n = m;
            }
            this[z][y] += j;
        }
    }

    this.sort(function(a, b) {
        for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
            if (caseInsensitive) {
                aa = aa.toLowerCase();
                bb = bb.toLowerCase();
            }
            if (aa !== bb) {
                var c = Number(aa), d = Number(bb);
                if (c == aa && d == bb) {
                    return c - d;
                } else return (aa > bb) ? 1 : -1;
            }
        }
        return a.length - b.length;
    });

    for (var z = 0; z < this.length; z++)
        this[z] = this[z].join("");
}
chrome.tabs.getSelected(null, function(tab) {
    function addOptionsLink() {
        var a = document.createElement('a');
        a.innerHTML = 'Options';
        a.href = '#';
        a.className = 'options';
        a.addEventListener('click', function() {
            chrome.tabs.create({url: chrome.extension.getURL('options.html'), index: tab.index+1});
        });
        document.body.appendChild(a);
    }
    if(localStorage.length == ('__sf_id' in localStorage ? 1 : 0)) {
        document.body.innerHTML = 'There are no sites configured.<br>';
        addOptionsLink();
        return;
    }
    var sites = Object.keys(localStorage).filter(function(x){return x!='__sf_id';});
    sites.alphanumSort(true);
    for(var i = 0; i < sites.length; i++) {
        var site = sites[i];
        if(!site) {
            delete localStorage[site];
            continue;
        }
        var users = JSON.parse(localStorage[site]), userKeys = Object.keys(users);
        userKeys.alphanumSort(true);
        var oneUser = userKeys.length == 1;
        document.body.appendChild(document.createTextNode(oneUser ? 'Login on ' : 'Login on '+site+' as:'));
        !oneUser && document.body.appendChild(document.createElement('br'));
        for(var j = 0; j < userKeys.length; j++) {
            var a = document.createElement('a');
            a.addEventListener('click', function() {
                chrome.extension.sendRequest(this, close.bind(window));
            }.bind([tab.id, site, userKeys[j], users[userKeys[j]]]));
            a.innerHTML = oneUser ? site : userKeys[j];
            a.href = '#';
            document.body.appendChild(a);
            document.body.appendChild(document.createElement('br'));
        }
    }
    document.body.appendChild(document.createElement('br'));
    addOptionsLink();
}); 
