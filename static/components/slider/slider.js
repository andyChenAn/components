function Slider (element , options) {
    if (!this instanceof Slider) {
        return new Slider(element , options);
    };
    var defaults = {

    };
    this.element = element;
    this.options = _.extend({} , defaults , options);

};