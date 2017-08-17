function sarafanGetPageData() {
    var metaTags=document.getElementsByTagName("meta");

    var productContent = {
        image: '',
        title: '',
        description: '',
        url: '',
        isEmpty: true,
    };

    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute('property') === 'og:image') {
            productContent.image = metaTags[i].getAttribute("content");
            if (productContent.image) {
            productContent.isEmpty = false; 
            }
        }

        if (metaTags[i].getAttribute('property') === 'og:description') {
            productContent.description = metaTags[i].getAttribute("content");
            if (productContent.description) {
            productContent.isEmpty = false; 
            }
        }

        if (metaTags[i].getAttribute('property') === 'og:title') {
            productContent.title = metaTags[i].getAttribute("content");
            if (productContent.title) {
            productContent.isEmpty = false; 
            }
        }

        if (metaTags[i].getAttribute('property') === 'og:url') {
            productContent.url = metaTags[i].getAttribute("content");
            if (productContent.url) {
            productContent.isEmpty = false; 
            }
        }
    }

    return productContent;
}

function sarafancheckLogin(data) {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open('POST', baseUrl + '/api/share/external/checklogin');
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.withCredentials = true;
    xmlhttp.send(JSON.stringify(data));
}

function sarafanLogin(data) {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open('POST', baseUrl + '/api/share/external/login');
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.withCredentials = true;
    xmlhttp.send(JSON.stringify(data));
}

function sarafanSharePage(data) {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open('POST', baseUrl + '/api/share/external/page');
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.withCredentials = true;
    xmlhttp.send(JSON.stringify(data));
}

console.log(productContent);