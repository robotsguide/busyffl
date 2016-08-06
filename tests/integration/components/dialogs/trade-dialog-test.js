import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dialogs/trade-dialog', 'Integration | Component | dialogs/trade dialog', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{dialogs/trade-dialog}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#dialogs/trade-dialog}}
      template block text
    {{/dialogs/trade-dialog}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
