import Ember from 'ember';

export default Ember.Controller.extend({

  errorMessage: '',
  showError: false,

  actions: {
    submit() {
      const username = Ember.$('.v-settings .username').val().trim();
      const firstName = Ember.$('.v-settings .first-name').val().trim();
      const lastName = Ember.$('.v-settings .last-name').val().trim();
      const teamName = Ember.$('.v-settings .team-name').val().trim();
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

      if (!Ember.isEmpty(password)) {
        if (!Ember.isEmpty(repass) && password === repass) {
          const pass = btoa(password);
          if (pass !== this.get('model.password')) {
            this.set('model.password', pass);
          }
        } else {
          this.set('errorMessage', 'Passwords do not match');
          this.set('showError', true);
        }
      }

      if (this.get('model.hasDirtyAttributes')) {
        this.get('model').save().then(model => {
          if(this.get('model.team.hasDirtyAttributes')) {
            this.get('model.team').save().then(team => {
              model.set('team', team);
              this.set('model', model);
            });
          }
        });
      } else if (this.get('model.team.hasDirtyAttributes')) {
        this.get('model.team').save().then(team => {
          this.set('model.team', team);
        });
      }
    }
  }
});
