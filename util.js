const $ = (id) => {
    if (id.indexOf('#') > -1) {
        return document.querySelector(id);
    } else {
        return document.querySelectorAll(id);
    }
};