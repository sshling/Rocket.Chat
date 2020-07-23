import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';

import { settings } from '../../settings';
import checkVersionUpdate from './functions/checkVersionUpdate';
import './methods/banner_dismiss';
import './addSettings';

const jobName = 'version_check';

if (SyncedCron.nextScheduledAtDate(jobName)) {
	SyncedCron.remove(jobName);
}

const addVersionCheckJob = () => {
	SyncedCron.add({
		name: jobName,
		schedule: (parser) => parser.text('at 2:00 am'),
		job() {
			checkVersionUpdate();
		},
	});
};


Meteor.startup(() => {
	checkVersionUpdate();
});

settings.get('Register_Server', (key, value) => {
	if (value && SyncedCron.nextScheduledAtDate(jobName)) {
		return;
	}

	if (value && settings.get('Update_EnableChecker')) {
		addVersionCheckJob();
		return;
	}

	SyncedCron.remove(jobName);
});
