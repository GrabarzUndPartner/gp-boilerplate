'use strict';

import ScrollDirectionObserver from 'gp-module-scroll/DirectionObserver';

export default ScrollDirectionObserver.extend({
    outOfViewport: false,
    handler: null,
    tween: null,

    modelConstructor: ScrollDirectionObserver.prototype.modelConstructor.extend({
        session: {
            isHide: {
                type: 'boolean',
                required: true,
                default: false
            }
        }
    }),

    bindings: {
        'model.isHide': {
            type: 'booleanClass',
            name: 'js--is-hide'
        }
    },

    initialize() {
        ScrollDirectionObserver.prototype.initialize.apply(this, arguments);
    },

    updateClass(flag) {
        this.model.isHide = !flag;
    },

    isOutOfViewport(viewportBounds) {
        return viewportBounds.min.y < this.bounds.max.y - this.bounds.min.y;
    },

    onInit(info) {
        this.updateClass(info.min.y === 0);
    },

    onUp() {
        this.updateClass(true);
    },

    onDown(viewportBounds) {
        this.updateClass(this.isOutOfViewport(viewportBounds));
    }
});
