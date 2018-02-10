import "../css/options.css";

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

function addUser(site, user, pass) {
    var users = (site in localStorage) ? JSON.parse(localStorage[site]) : {};
    users[user] = pass;
    localStorage[site] = JSON.stringify(users);

}
function removeUser(site, user) {
    if(site in localStorage) {
        var users = JSON.parse(localStorage[site]);
        delete users[user];
        if(!Object.keys(users).length)
            delete localStorage[site];
        else
            localStorage[site] = JSON.stringify(users);
    }
}
function makeEntry(siteVal, userVal, passVal) {
    var site = document.createElement('input'), user = document.createElement('input'), pass = document.createElement('input');
    site.value = siteVal, user.value = userVal, pass.value = passVal;
    site.spellcheck = false, user.spellcheck = false, pass.spellcheck = false;
    pass.type = 'password';
    siteVal || (site.className = 'no-val');
    userVal || (user.className = 'no-val');
    passVal || (pass.className = 'no-val');
    var tr = document.createElement('tr');
    [site, user, pass].forEach(function(x) {
        var td = document.createElement('td');
        td.appendChild(x);
        tr.appendChild(td);
    });

    function touch() {
        if(site.value != siteVal || user.value != userVal)
            siteVal && userVal && removeUser(siteVal, userVal);
        if(!site.value && !user.value && !pass.value) {
            if(tr != tr.parentNode.children[tr.parentNode.children.length-1])
                tr.parentNode.removeChild(tr);
        } else {
            if(site.value && user.value)
                addUser(site.value, user.value, pass.value);
            if(tr == tr.parentNode.children[tr.parentNode.children.length-1])
                tr.parentNode.appendChild(makeEntry('', '', ''));
        }
    }

    site.addEventListener('keyup', function() {
        var val = site.value.trim().replace(/https?:\/\/(?:www\.)?/g, '');
        if(site.value != val)
            site.value = val;
        site.className = site.value ? '' : 'no-val';
        touch();
        siteVal = site.value;
    });
    user.addEventListener('keyup', function() {
        var val = user.value.trim();
        if(user.value != val)
            user.value = val;
        user.className = user.value ? '' : 'no-val';
        touch();
        userVal = user.value;
    });
    pass.addEventListener('keyup', function() {
        pass.className = pass.value ? '' : 'no-val';
        touch();
        passVal = pass.value;
    });

    return tr;
}
var rows = document.getElementById('rows'), sites = Object.keys(localStorage).filter(function(x){return x!='__sf_id';});

sites.alphanumSort(true);
for(var i = 0; i < sites.length; i++) {
    var site = sites[i];
    if(!site) {
        delete localStorage[site];
        continue;
    }
    var users = JSON.parse(localStorage[site]), userKeys = Object.keys(users);
    userKeys.alphanumSort(true);
    for(var j = 0; j < userKeys.length; j++)
        rows.appendChild(makeEntry(site, userKeys[j], users[userKeys[j]]));
}
rows.appendChild(makeEntry('', '', ''));

document.body.addEventListener('dragover', function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
}, true);
document.body.addEventListener('drop', function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    var files = ev.dataTransfer.files;
    for(var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.onload = function(ev) {
            ev.target.result.split(/[\r\n]+/).forEach(function(x) {
                x = x.split(',');
                if(x.length < 3)
                    return;
                addUser(x[0], x[1], x[2]);
                rows.insertBefore(makeEntry(x[0], x[1], x[2]), rows.children[rows.children.length-1]);
            });
        };
        reader.readAsText(files[i]);
    }
}, true);