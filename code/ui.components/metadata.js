// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

const metadata = {
    initialize: function(parentElement, productOnly) {
        const title = document.title;
        const version = sharedDefinitionSet.version;
        const years = sharedDefinitionSet.years;
        const meta = document.querySelectorAll("meta");
        let author = "", url = [];
        for (let element of meta) {
            if (element.name == "author")
                author = element.content;
            if (element.name == "url")
                url.push(element.content);
        } //loop
        if (url.length < 2) throw new Error("HTML urls are not found; the application needs product and author URLs");
        if (!author) throw new Error("HTML author not found");
        parentElement.title = document.title;
        parentElement.innerHTML = productOnly
            ? `<a href="${url[0]}">${title}</a> v.&thinsp;${version}`
            : `<a href="${url[0]}">${title}</a> v.&thinsp;${version}<span style="padding-left: 1em; padding-right: 1em">&bigstar;</span>Copyright &copy; ${years} <a href="${url[1]}">${author}</a>`;
    },
}; //metadata
