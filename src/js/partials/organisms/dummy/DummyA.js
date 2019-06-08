import Dummy from '../Dummy';

export default Dummy.extend({
  modelConstructor: Dummy.prototype.modelConstructor.extend({
    session: {
      name: {
        type: 'string',
        required: true,
        default () {
          return 'Dummy A';
        }
      }
    }
  })
});
