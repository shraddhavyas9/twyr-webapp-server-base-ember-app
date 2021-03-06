import BaseComponent from '../../framework/base-component';
import ExponentialBackoffPolicy from 'ember-concurrency-retryable/policies/exponential-backoff';

import { observer } from '@ember/object';
import { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';

const backoffPolicy = new ExponentialBackoffPolicy({
	'multiplier': 1.5,
	'minDelay': 30,
	'maxDelay': 400
});

export default BaseComponent.extend({
	classNames: ['flex-100', 'flex-gt-sm-50', 'flex-gt-md-40', 'flex-gt-lg-30'],
	editable: false,

	init() {
		this._super(...arguments);
		this.set('permissions', ['tenant-administration-read']);
	},

	onHasPermissionChange: observer('hasPermission', function() {
		const updatePerm = this.get('currentUser').hasPermission('tenant-administration-update');
		this.set('editable', updatePerm);
	}),

	save: task(function* () {
		yield this.get('model').save();
	}).drop().evented().retryable(backoffPolicy),

	saveSucceeded: on('save:succeeded', function() {
		this.get('notification').display({
			'type': 'success',
			'message': 'Tenant saved successfully'
		});
	}),

	saveErrored: on('save:errored', function(taskInstance, err) {
		this.get('notification').display({
			'type': 'error',
			'error': err
		});
	}),

	cancel: task(function* () {
		yield this.get('model').rollback();
	}).drop()
});
