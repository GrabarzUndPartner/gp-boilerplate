import Controller from '../../base/Controller';
import DomModel from '../../base/DomModel';

export default Controller.extend({
  modelConstructor: DomModel.extend({
    session: {
      name: {
        type: 'string',
        required: true,
        default: 'bla'
      }
    }
  }),

  bindings: {
    'model.name': {
      type: 'innerHTML',
      hook: 'name'
    }
  },

  initialize () {
    Controller.prototype.initialize.apply(this, arguments);
  }
});
