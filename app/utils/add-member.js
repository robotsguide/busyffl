

export default function addMember(app) {
  return function(username, password, firstName, lastName, teamName, draft) {
    const store = app.__container__.lookup('service:store');

    store.createRecord('member', {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: btoa(password),
    }).save().then(member => {
      store.createRecord('team', {
        name: teamName,
        ownerId: member.id,
        round1: draft,
        round2: draft+12,
        round3: draft+(12*2),
        round4: draft+(12*3),
        round5: draft+(12*4),
        round6: draft+(12*5),
        round7: draft+(12*6),
        round8: draft+(12*7),
        round9: draft+(12*8),
        round10: draft+(12*9),
        round11: draft+(12*10),
        round12: draft+(12*11),
        round13: draft+(12*12),
        round14: draft+(12*13),
      }).save().then(team => {
        store.createRecord('roster', {teamId: team.id}).save().then(roster => {
          window.console.log('success', member, team, roster);
        });
      });
    });
  };
}
