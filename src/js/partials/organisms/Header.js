import Controller from '../../base/Controller';
import DomModel from '../../base/DomModel';

export default Controller.extend({
    modelConstructor: DomModel.extend({
        session: {
        }
    }),

    bindings: {
    },

    initialize () {
        Controller.prototype.initialize.apply(this, arguments);
    }
});
