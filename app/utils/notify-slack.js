import Ember from 'ember';

export default function notifySlack(channel, text) {
	const webHook = 'https://hooks.slack.com/services/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';

	const data = {
		channel: channel,
		username: "busyffl.com",
		attachments: [text]
	};

	return new Ember.RSVP.Promise((resolve, reject) => {
		Ember.$.ajax({
			url: webHook,
			data: JSON.stringify(data),
			type: 'POST',
			crossDomain: true,
			success: function(result) {
				Ember.run(null, resolve, result);
			},
			error: function(err) {
				Ember.run(null, reject, err);
			},
		});
	});
}
