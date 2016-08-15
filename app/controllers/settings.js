import Ember from 'ember';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  errorMessage: '',
  showError: false,

  editSettings() {
    const username = Ember.$('.v-settings .username').val().trim();
    const firstName = Ember.$('.v-settings .first-name').val().trim();
    const lastName = Ember.$('.v-settings .last-name').val().trim();
    const teamName = Ember.$('.v-settings .team-name').val().trim();
    const slackName = Ember.$('.v-settings .slack-name').val().trim();
    const password = Ember.$('.v-settings .password').val().trim();
    const repass = Ember.$('.v-settings .retype-pass').val().trim();

    if (!Ember.isEmpty(username) && username !== this.get('model.username')) {
      this.set('model.username', username);
    }

    if (!Ember.isEmpty(firstName) && firstName !== this.get('model.firstName')) {
      this.set('model.firstName', firstName);
    }

    if (!Ember.isEmpty(lastName) && lastName !== this.get('model.lastName')) {
      this.set('model.lastName', lastName);
    }

    if (!Ember.isEmpty(teamName) && teamName !== this.get('model.team.name')) {
      this.set('model.team.name', teamName);
    }

    if (!Ember.isEmpty(slackName) && slackName !== this.get('model.team.slack')) {
      this.set('model.team.slack', slackName);
    }

    if (!Ember.isEmpty(password)) {
      if (!Ember.isEmpty(repass) && password === repass) {
        const pass = btoa(password);
        if (pass !== this.get('model.password')) {
          this.set('model.password', pass);
        }
      } else {
        this.set('errorMessage', 'Passwords do not match');
        this.set('showError', true);
        return Ember.RSVP.resolve(false);
      }
    }

    let modelPromise;
    if (this.get('model.hasDirtyAttributes')) {
      modelPromise = this.get('model').save();
    }

    let teamPromise;
    if(this.get('model.team.hasDirtyAttributes')) {
      teamPromise = this.get('model.team').save();
    }

    Ember.RSVP.hash({
      member: modelPromise,
      team: teamPromise
    }).then(data => {
      if(data.member) { this.set('model', data.member); }
      if(data.team) { this.set('model.team', data.team); }

      this.reauthorize(username, password);

      return true;
    });
  },

  reauthorize(username, password) {
    if(!Ember.isEmpty(username) || !Ember.isEmpty(password)) {
      this.get('session').invalidate('authenticator:basic');
      this.get('session').authenticate('authenticator:basic', { username: this.get('model.username'), password: atob(this.get('model.password')) });
      window.location = '/settings';
    }
  },

  actions: {
    submit() {
      this.editSettings();
    }
  }
});
