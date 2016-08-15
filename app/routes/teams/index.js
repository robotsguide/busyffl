import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import setRoster from 'busyffl/utils/set-roster';
import loadAll from 'busyffl/utils/load-all';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		const auth = this.get('session.session.content.authenticated');
		return loadAll(this.store).then(data => {
			const member = data.members.findBy('username', auth.username);
			data.teams.forEach((team) => {
				 const ros = data.teamRosters.filterBy('teamId', team.get('id')).sortBy('rosterPosition');

				 if (team.get('ownerId') === member.id) {
					 team.set('isCurrentTeam', true);
				 }

				 setRoster(ros, data.players);
				 team.set('teamRosters', ros);
			 });

			return data.teams.sortBy('name');
		});
	},

	currentTeam() {
		const auth = this.get('session.session.content.authenticated');
		return loadAll(this.store).then(data => {
			const member = data.members.findBy('username', auth.username);
			const team = data.teams.findBy('ownerId', member.id);

			return team;
		});
	},

	actions: {
		openTeam(team) {
			this.transitionTo('teams.team', team);
		}
	}
});
