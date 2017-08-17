var baseUrl = 'http://sarafan.online';
var sarafan_attribute = 'sarafan';
var sarafan_order_attribute = 'sarafan-order-value';
var elems;
var sarafan_order_value;

function updateSarafanElemnts() {
    elems = getElementsByAttribute(sarafan_attribute);
    sarafan_order_value = getElementsByAttribute(sarafan_order_attribute)[0];

    elems.forEach(function (item) {
        if (item.tagName === 'FORM') {
            item.addEventListener('submit', clickElem, false);
        } else {
            item.addEventListener('click', clickElem, false);
        }
    });
}

function getElementsByAttribute(attribute) {
    var nodeList = document.getElementsByTagName('*');
    var nodeArray = [];
    var iterator = 0;
    var node = null;
    while (node = nodeList[iterator++]) {
        if (node.getAttribute(attribute)) nodeArray.push(node);
    }

    return nodeArray;
}

function clickElem(event) {
    var target = event.target;
    var value = 0;
    if (sarafan_order_value) {
        var summ_regex = /[-]{0,1}[\d,]*[\d]+/g;
        var summ_text = sarafan_order_value.innerHTML.replace(" ", "");
        value = summ_text.match(summ_regex)[0];
    }
    console.log('send target', target.getAttribute(sarafan_attribute));
    sendTarget({ targetId: target.getAttribute(sarafan_attribute), value: value | 0 });
};

function sendTarget(data) {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open('POST', baseUrl + '/api/target/execute');
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.withCredentials = true;
    xmlhttp.send(JSON.stringify(data));
}

function addSarafanNotifer() {
    var leftSide = '<a id="sarafan-wigget" href="http://sarafan.online/show/site"' +
        'onMouseOver="this.style.background=\'#ffae00\'"' +
        'onMouseOut="this.style.background=\'#6EBF33\'"' +
        'style="text-decoration:none;position: fixed;top: 40vh;width: 40px;padding: 16px 0;border-top-right-radius: 10px;border-bottom-right-radius: 10px;transition: all 0.4s ease;background:#6EBF33">' +
        '<div style="display: -webkit-flex;display: -ms-flex;display: flex; z-index: 9999999999999999; flex-direction: column;align-items: center;"><div>' +
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAnCAYAAABwtnr/AAADnElEQVRYhc2YT2gdVRSHvzzT2qI2KWpNdaEWXBSLpgsLpYpSVGxFF6KLYrEutIIFhSAKhYKC6CIoolYQEVGKKIoiXSn+qYKKbgpi1UI1NtWmKWqsosE0zefivjHzJm/mzvPNe8kHF96bc2fOb+6ce+69B5WKW4+6Rf1RnVA3dMAHNaplDbAPeBW4EOgHtlbsI1DRCPSpT6nTNnJCXd+JEa8iLO5Qx53LK+p5nRDdrvC16mdNBO9Xr+yU4HaEL1d3q6cygifUHeppnRbdqvCaerf6S0bwjPqCuqIbgpPWoxbN3VXARcC5wBCwLmOfAp4Evqg4Z0wCo8BBYKZpjyZvs1R9UD3k/DOuPqGeYyRUBtUf5klkERPqzeaEyhrgU2BZJhS+Av6qOBRiLAFWZ7TMALcA7wD/jXiv+m3qDafUneqZtjGB2myL1W3qryldf6gDpkJle8p4Ur1+HgVn2yU2ZrLn0sLTC8nwAhCbbVtT+n5XF/WoS4C/gZ56LK0CRroXzqXoBY4Dy+v/19WA85kV/ScLTzTANPB16v8FvTTO3N8yNywCrgHOKOngMLC/ZN+zCZnjLOAI8A15i81cbf29kYe/BNxeUkjCbcCbBfbLgceAG6DhPDBGWIWfJqThQmIHiUtjD2jC6gLbFuBLYHMT3yuBYeB9oC/mJDbi9wI7CZ+zDN8Du3NsG4CXCeFXxFWEE9SNRZ1iwj8Hbor0KcszxEUnbK773ZvXISYc4GJKfLo6o8yd4ACXAWtLPiPhTtoQPgw80IKzKWAT8GHmenY7XIYrioyxybmpRWeLCekzS9k5kmZZkTE24rsIqWtpSWdHgBebXB8reX+aY0XGmPC3661dPgFkdoUuw0dFxqoLQnkcBV5vof8p4NmiDjHh9wP/EEarTBsjZJBmDBFeoAyPAAfaEX4PYcKVZQC4Ncc2BmwkHIDzEHgYeDTmKCb8eeBk7CEpjgFvFdgPEr7IfYTFbZKwsfqJsC8aJIx2YekBIDkgJ4wugENDXtub0rmtBoyn3mMF3ZuwrTKQ+n28RjhZTNYvnM7/W+U6TT9hO5wwUiOknndTF3fRWr7tBg8xu0EbAb5L4mejjTxuKCHPd1wnB+V0gXVIGytZb2TEf2yoHnW1mFlv/erV6msZTQcM9ZaGSlYf8B4LM8YBfiZs4A5BYwY5AVxLOKXE82h3+QBYT100kFtmHgTuAq4jlJlbWT2rYJqw0u4D9hAioYF/AU5+oH9rWiZuAAAAAElFTkSuQmCC" alt="" style="width: 23px;height: auto;object-fit: contain;margin-bottom: 8px;"></div>' +
    '   <div style="font-size: 12.9px;text-transform: uppercase; -ms-writing-mode: vertical-rl;-webkit-writing-mode: vertical-rl;writing-mode: vertical-rl;color: white;letter-spacing: 1px;font-family:Helvetica Nue,sans-serif;font-weight: 300">Зарабатывайте с нами!</div></div></a>';
    var fragment = document.createRange().createContextualFragment(leftSide);
    document.body.appendChild(fragment);
}


document.addEventListener('DOMNodeInserted', function (event) {
    updateSarafanElemnts();
}, false);

addSarafanNotifer();
console.log('load sarafan');
