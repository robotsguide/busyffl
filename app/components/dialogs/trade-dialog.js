import Ember from 'ember';
import setRoster from 'busyffl/utils/set-roster';
import moment from 'moment';

export default Ember.Component.extend({

	session: Ember.inject.service('session'),
	store: Ember.inject.service('store'),

	model: null,
	players: null,
	teams: null,

	selsectedTeam: null,

	showPicks: false,
	showSummary: false,
	showSuccess: false,

	tradeOwnedPlayers: null,
	tradePlayers: null,

	tradeOwnedPicks: null,
	tradePicks: null,

	isTeamPageTrade: false,

	init() {
		this._super(...arguments);

		this.set('tradeOwnedPlayers', []);

		this.loadTeams();
	},

	loadTeams() {
		this.get('store').findAll('team').then(teams => {
			const myTeam = teams.findBy('ownerId', this.get('session.session.authenticated.id'));
			this.loadRoster(myTeam);
			this.set('model', myTeam);

			this.set('teams', teams);
		});
	},

	loadRoster(team) {
		Ember.RSVP.hash({
			picks: this.get('store').findAll('draft-pick'),
			rosters: this.get('store').findAll('team-roster'),
			players: this.get('store').findAll('player')
		}).then(data => {
				const roster = data.rosters.filterBy('teamId', team.id).sortBy('rosterPosition');
				const picks = data.picks.filterBy('teamId', team.id).sortBy('roundNumber');

				setRoster(roster, data.players);

				team.set('draftPicks', picks);
				team.set('teamRosters', roster);

				this.set('tradePlayers', []);
		});
	},

	resetPicks() {
		this.get('selectedTeam.draftPicks').forEach(item => {
			item.set('selected', false);
		});

		this.get('model.draftPicks').forEach(item => {
			item.set('selected', false);
		});
	},

	resetTrades() {
		this.get('selectedTeam.teamRosters').forEach(item => {
			item.set('selected', false);
		});

		this.get('model.teamRosters').forEach(item => {
			item.set('selected', false);
		});
	},

	actions: {
		submitTrade() {
			const fromPlayer = [];
			const toPlayer = [];
			const fromPick = [];
			const toPick = [];

			this.get('tradeOwnedPlayers').forEach(item => fromPlayer.push(item.get('playerId')));
			this.get('tradePlayers').forEach(item => toPlayer.push(item.get('playerId')));
			this.get('tradeOwnedPicks').forEach(item => fromPick.push(item.id));
			this.get('tradePicks').forEach(item => toPick.push(item.id));

			const trade = this.get('store').createRecord('trade-request', {
				fromTeamId: this.get('model.id'),
				toTeamId: this.get('selectedTeam.id'),
				fromPlayer: fromPlayer.join(','),
				toPlayer: toPlayer.join(','),
				fromPick: fromPick.join(','),
				toPick: toPick.join(','),
				submittedOn: moment().unix()
			});

			trade.save().then(() => window.location = "/").catch((err) => this.showError(err));
		},

		closeTrade() {
			this.resetPicks();
			this.resetTrades();
			this.set('showSuccess', false);
			this.set('showSummary', false);
			this.set('showPicks', false);
			this.set('selectedTeam', null);
		},

		closeAction() {
			this.sendAction('onClose');
		},

		pickTeam(team) {
			this.set('selectedTeam', team);
			this.loadRoster(team);
		},

		selectTradePlayer(player) {
			if (this.get('tradePlayers').indexOf(player) === -1) {
				this.get('tradePlayers').pushObject(player);
			} else {
				this.get('tradePlayers').removeObject(player);
			}
		},

		selectOwnedPlayer(player) {
			if (this.get('tradeOwnedPlayers').indexOf(player) === -1) {
				this.get('tradeOwnedPlayers').pushObject(player);
			} else {
				this.get('tradeOwnedPlayers').removeObject(player);
			}
		},

		selectTradePick(pick) {
			if (this.get('tradePicks').indexOf(pick) === -1) {
				this.get('tradePicks').pushObject(pick);
			} else {
				this.get('tradePicks').removeObject(pick);
			}
		},

		selectOwnedPick(pick) {
			if (this.get('tradeOwnedPicks').indexOf(pick) === -1) {
				this.get('tradeOwnedPicks').pushObject(pick);
			} else {
				this.get('tradeOwnedPicks').removeObject(pick);
			}
		},

		openTradePicks() {
			this.set('tradeOwnedPicks', []);
			this.set('tradePicks', []);
			this.set('showPicks', true);
		},

		openSummary() {
			this.set('showSummary', true);
		},

		closeSummary() {
			this.set('showSummary', false);
		},

		closeTradePicks() {
			this.set('showPicks', false);
			this.resetPicks();
		},

		cancelSelectedTeam() {
			this.resetTrades();
			if (this.get('isTeamPageTrade')) {
				this.sendAction('onClose');
			}
			else {
				this.set('selectedTeam', null);
			}
		}
	}
});
