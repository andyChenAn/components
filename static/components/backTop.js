class BackTop {
    constructor (element , options) {
        if (new.target !== BackTop) {
            throw new Error('该类只能通过new来调用');
        }
        this.element = element;
        this.options = options;
    }
    init () {
        this.element.addEventListener('click' , this.handle.bind(this));
    }
    handle (evt) {
        
    }
};

let backtop = new BackTop($('#backTop') , {
    
});
backtop.init();