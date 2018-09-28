import TenantModel from '../../../models/tenant-administration/tenant';
import DS from 'ember-data';

export function initialize( /* application */ ) {
	// application.inject('route', 'foo', 'service:foo');
	TenantModel.reopen({
		'features': DS.hasMany('tenant-administration/feature-manager/tenant-feature', {
			'async': true,
			'inverse': 'tenant'
		})
	});
}

export default {
	initialize
};
