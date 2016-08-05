import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    const auth = this.get('session.session.content.authenticated');
    return this.store.findAll('member').then(members => {
      const member = members.findBy('username', auth.username);
      return this.store.findAll('team').then(teams => {
        const team = teams.findBy('ownerId', member.id);

        member.set('team', team);
        return member;
      });
    });
  }
});
