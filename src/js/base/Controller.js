import AmpersandView from 'ampersand-view';
import dataTypeDefinition from './dataTypeDefinition';

export default AmpersandView.extend(dataTypeDefinition, {
  initialize: function (options) {
    AmpersandView.prototype.initialize.apply(this, arguments);

    $(this.el).data('controller', this);

    const Model = this.modelConstructor;

    if (Model) {
      this.model = new Model($(this.el).data());
      this.listenTo(this.model, 'destroy', onDestroy.bind(this));
    }

    if (options.target && $(options.target).length) {
      const targetModel = $(options.target).data('controller').model;
      if (targetModel) {
        this.targetModel = targetModel;
      }
    }
    //        module.hot.dispose(function(data) {
    //            console.log('BOOM', arguments, this.firstName, this.toJSON());
    //            data.firstName = this.firstName;
    //        }.bind(this));
  },

  destroy: function () {
    this.model.destroy();
  }
});

function onDestroy () {
  this.unset('model');
  this.remove();
}
