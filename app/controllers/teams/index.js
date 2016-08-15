import Ember from 'ember';

export default Ember.Controller.extend({

	showTradeDialog: false,
	tradeTeam: null,
	currentTeam: null,

	setCurrentTeam: Ember.observer('model', function() {
		this.get('model').forEach((team) => {
			if (team.get('isCurrentTeam')) {
				this.set('currentTeam', team);
			}
		});
	}),

	actions: {
		trade(team) {
			this.set('showTradeDialog', true);
			this.set('tradeTeam', team);
		},

		cancelTrade() {
			this.set('showTradeDialog', false);
		}
	}
});
