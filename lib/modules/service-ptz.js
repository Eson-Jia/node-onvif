/* ------------------------------------------------------------------
* node-onvif - service-ptz.js
*
* Copyright (c) 2016 - 2017, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2017-08-30
* ---------------------------------------------------------------- */
'use strict';
const mUrl = require('url');
const mOnvifSoap = require('./soap.js');

/* ------------------------------------------------------------------
* Constructor: OnvifServicePtz(params)
* - params:
*    - xaddr   : URL of the entry point for the media service
*                (Required)
*    - user  : User name (Optional)
*    - pass  : Password (Optional)
*    - time_diff: ms
* ---------------------------------------------------------------- */
function OnvifServicePtz(params) {
	this.xaddr = '';
	this.user = '';
	this.pass = '';

	let err_msg = '';

	if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
		throw new Error('The value of "params" was invalid: ' + err_msg);
	}

	if ('xaddr' in params) {
		if (err_msg = mOnvifSoap.isInvalidValue(params['xaddr'], 'string')) {
			throw new Error('The "xaddr" property was invalid: ' + err_msg);
		} else {
			this.xaddr = params['xaddr'];
		}
	} else {
		throw new Error('The "xaddr" property is required.');
	}

	if ('user' in params) {
		if (err_msg = mOnvifSoap.isInvalidValue(params['user'], 'string', true)) {
			throw new Error('The "user" property was invalid: ' + err_msg);
		} else {
			this.user = params['user'] || '';
		}
	}

	if ('pass' in params) {
		if (err_msg = mOnvifSoap.isInvalidValue(params['pass'], 'string', true)) {
			throw new Error('The "pass" property was invalid: ' + err_msg);
		} else {
			this.pass = params['pass'] || '';
		}
	}

	this.oxaddr = mUrl.parse(this.xaddr);
	if (this.user) {
		this.oxaddr.auth = this.user + ':' + this.pass;
	}

	this.time_diff = params['time_diff'];
	this.name_space_attr_list = [
		'xmlns:ter="http://www.onvif.org/ver10/error"',
		'xmlns:xs="http://www.w3.org/2001/XMLSchema"',
		'xmlns:tt="http://www.onvif.org/ver10/schema"',
		'xmlns:tptz="http://www.onvif.org/ver20/ptz/wsdl"'
	];
}

OnvifServicePtz.prototype._createRequestSoap = function (body) {
	let soap = mOnvifSoap.createRequestSoap({
		'body': body,
		'xmlns': this.name_space_attr_list,
		'diff': this.time_diff,
		'user': this.user,
		'pass': this.pass
	});
	return soap;
};

/* ------------------------------------------------------------------
* Method: setAuth(user, pass)
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.setAuth = function (user, pass) {
	this.user = user || '';
	this.pass = pass || '';
	if (this.user) {
		this.oxaddr.auth = this.user + ':' + this.pass;
	} else {
		this.oxaddr.auth = '';
	}
};

/* ------------------------------------------------------------------
* Method: getNodes([callback])
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.getNodes = function (callback) {
	let promise = new Promise((resolve, reject) => {
		let soap_body = '<tptz:GetNodes/>';
		let soap = this._createRequestSoap(soap_body);
		mOnvifSoap.requestCommand(this.oxaddr, 'GetNodes', soap).then((result) => {
			try {
				let d = result['data']['PTZNode'];
				if (!Array.isArray(d)) {
					result['data']['PTZNode'] = [d];
				}
			} catch (e) { }
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: getNode(params[, callback])
* - params:
*   - NodeToken | String | required | a token of the targeted PTZ node
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.getNode = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['NodeToken'], 'string')) {
			reject(new Error('The "NodeToken" property was invalid: ' + err_msg));
			return;
		}

		let soap_body = '';
		soap_body += '<tptz:GetNode>';
		soap_body += '<tptz:NodeToken>' + params['NodeToken'] + '</tptz:NodeToken>';
		soap_body += '</tptz:GetNode>';
		let soap = this._createRequestSoap(soap_body);
		mOnvifSoap.requestCommand(this.oxaddr, 'GetNode', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: getConfigurations([callback])
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.getConfigurations = function (callback) {
	let promise = new Promise((resolve, reject) => {
		let soap_body = '<tptz:GetConfigurations/>';
		let soap = this._createRequestSoap(soap_body);
		mOnvifSoap.requestCommand(this.oxaddr, 'GetConfigurations', soap).then((result) => {
			try {
				let d = result['data']['PTZConfiguration'];
				if (!Array.isArray(d)) {
					result['data']['PTZConfiguration'] = [d];
				}
			} catch (e) { }
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};


/* ------------------------------------------------------------------
* Method: getConfiguration(params[, callback])
* - params:
*   - ConfigurationToken | String | required | a token of the targeted PTZ node
*
* No device I own does not work well for now.
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.getConfiguration = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ConfigurationToken'], 'string')) {
			reject(new Error('The "ConfigurationToken" property was invalid: ' + err_msg));
			return;
		}
		let soap_body = '';
		soap_body += '<tptz:GetConfiguration>';
		soap_body += '<tptz:PTZConfigurationToken>' + params['ConfigurationToken'] + '</tptz:PTZConfigurationToken>';
		soap_body += '</tptz:GetConfiguration>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'GetConfiguration', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: getConfigurationOptions(params[, callback])
* - params:
*   - ConfigurationToken | String | required | a token of the targeted PTZ node
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.getConfigurationOptions = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ConfigurationToken'], 'string')) {
			reject(new Error('The "ConfigurationToken" property was invalid: ' + err_msg));
			return;
		}

		let soap_body = '';
		soap_body += '<tptz:GetConfigurationOptions>';
		soap_body += '<tptz:ConfigurationToken>' + params['ConfigurationToken'] + '</tptz:ConfigurationToken>';
		soap_body += '</tptz:GetConfigurationOptions>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'GetConfigurationOptions', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: getStatus(params[, callback])
* - params:
*   - ProfileToken | String | required |
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.getStatus = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		let soap_body = '';
		soap_body += '<tptz:GetStatus>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';
		soap_body += '</tptz:GetStatus>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'GetStatus', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: continuousMove(params[, callback])
* - params:
*   - ProfileToken | String  | required | 
*   - Velocity     | Object  | required | pan, tilt and zoom
*     - x          | Float   | required |
*     - y          | Float   | required |
*     - x          | Float   | required |
*   - Timeout      | Integer | optional | timeout (seconds)
*
* {
*   'ProfileToken': 'Profile1',
*   'Velocity': {'x': 0.5, 'y': 1.0, 'z': 1.0},
*   'Timeout': 5
* }
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.continuousMove = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['Velocity'], 'object')) {
			reject(new Error('The "Velocity" property was invalid: ' + err_msg));
			return;
		}

		let klist = ['x', 'y', 'z'];
		for (let i = 0; i < klist.length; i++) {
			let k = klist[i];
			let v = params['Velocity'][k];
			if (err_msg = mOnvifSoap.isInvalidValue(v, 'float')) {
				reject(new Error('The "' + k + '" property was invalid: ' + err_msg));
				return;
			}
		}

		if ('Timeout' in params) {
			if (err_msg = mOnvifSoap.isInvalidValue(params['Timeout'], 'integer')) {
				reject(new Error('The "Timeout" property was invalid: ' + err_msg));
				return;
			}
		}

		let soap_body = '';
		soap_body += '<tptz:ContinuousMove>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';
		soap_body += '<tptz:Velocity>';
		soap_body += '<tt:PanTilt x="' + params['Velocity']['x'] + '" y="' + params['Velocity']['y'] + '"></tt:PanTilt>';
		if (params['Velocity']['z']) {
			soap_body += '<tt:Zoom x="' + params['Velocity']['z'] + '"></tt:Zoom>';
		}
		soap_body += '</tptz:Velocity>';
		if (params['Timeout']) {
			soap_body += '<tptz:Timeout>PT' + params['Timeout'] + 'S</tptz:Timeout>';
		}
		soap_body += '</tptz:ContinuousMove>';
		let soap = this._createRequestSoap(soap_body);
		mOnvifSoap.requestCommand(this.oxaddr, 'ContinuousMove', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: absoluteMove(params[, callback])
* - params:
*   - ProfileToken | String  | required |
*   - Position     | Object  | required | pan, tilt and zoom
*     - x          | Float   | required |
*     - y          | Float   | required |
*     - x          | Float   | required |
*   - Speed        | Object  | optional | pan, tilt and zoom
*     - x          | Float   | required |
*     - y          | Float   | required |
*     - x          | Float   | required |
*
* {
*   'ProfileToken': cam['ProfileToken'],
*   'Position'    : {'x': 0.5, 'y': -1, 'z': 0.5},
*   'Speed'       : {'x': 1, 'y': 1, 'z': 1}
* }
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.absoluteMove = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['Position'], 'object')) {
			reject(new Error('The "Position" property was invalid: ' + err_msg));
			return;
		}

		let klist = ['x', 'y', 'z'];

		for (let i = 0; i < klist.length; i++) {
			let k = klist[i];
			let v = params['Position'][k];
			if (err_msg = mOnvifSoap.isInvalidValue(v, 'float')) {
				reject(new Error('The "' + k + '" property was invalid: ' + err_msg));
				return;
			}
		}

		if ('Speed' in params) {
			if (err_msg = mOnvifSoap.isInvalidValue(params['Speed'], 'object')) {
				reject(new Error('The "Speed" property was invalid: ' + err_msg));
				return;
			}
			for (let i = 0; i < klist.length; i++) {
				let k = klist[i];
				let v = params['Speed'][k];
				if (err_msg = mOnvifSoap.isInvalidValue(v, 'float')) {
					reject(new Error('The "' + k + '" property was invalid: ' + err_msg));
					return;
				}
			}
		}

		let soap_body = '';
		soap_body += '<tptz:AbsoluteMove>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';

		soap_body += '<tptz:Position>';
		soap_body += '<tt:PanTilt x="' + params['Position']['x'] + '" y="' + params['Position']['y'] + '" />';
		soap_body += '<tt:Zoom x="' + params['Position']['z'] + '"/>';
		soap_body += '</tptz:Position>';

		if (params['Speed']) {
			soap_body += '<tptz:Speed>';
			soap_body += '<tt:PanTilt x="' + params['Speed']['x'] + '" y="' + params['Speed']['y'] + '" />';
			soap_body += '<tt:Zoom x="' + params['Speed']['z'] + '"/>';
			soap_body += '</tptz:Speed>';
		}

		soap_body += '</tptz:AbsoluteMove>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'AbsoluteMove', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: relativeMove(params[, callback])
* - params:
*   - ProfileToken | String  | required | 
*   - Translation  | Object  | required | pan, tilt and zoom
*     - x          | Float   | required |
*     - y          | Float   | required |
*     - x          | Float   | required |
*   - Speed        | Object  | optional | pan, tilt and zoom
*     - x          | Float   | required |
*     - y          | Float   | required |
*     - x          | Float   | required |
*
* {
*   'ProfileToken': 'Profile1',
*   'Translation' : {'x': 0.5, 'y': 1.0, 'z': 1.0},
*   'Speed'       : {'x': 1, 'y': 1, 'z': 1}
* }
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.relativeMove = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['Translation'], 'object')) {
			reject(new Error('The "Translation" property was invalid: ' + err_msg));
			return;
		}

		let klist = ['x', 'y', 'z'];
		for (let i = 0; i < klist.length; i++) {
			let k = klist[i];
			let v = params['Translation'][k];
			if (err_msg = mOnvifSoap.isInvalidValue(v, 'float')) {
				reject(new Error('The "' + k + '" property was invalid: ' + err_msg));
				return;
			}
		}

		let soap_body = '';
		soap_body += '<tptz:RelativeMove>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';
		soap_body += '<tptz:Translation>';
		soap_body += '<tt:PanTilt x="' + params['Translation']['x'] + '" y="' + params['Translation']['y'] + '"/>';
		soap_body += '<tt:Zoom x="' + params['Translation']['z'] + '"/>';
		soap_body += '</tptz:Translation>';
		soap_body += '</tptz:RelativeMove>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'RelativeMove', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: stop(params[, callback])
* - params:
*   - ProfileToken | String  | required | a token of the targeted PTZ node
*   - PanTilt      | Boolean | optional | true or false
*   - Zoom         | Boolean | optional | true or false
*
* {
*   'ProfileToken': 'Profile1',
*   'PanTilt': true,
*   'Zoom': true
* }
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.stop = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		if ('PanTilt' in params) {
			if (err_msg = mOnvifSoap.isInvalidValue(params['PanTilt'], 'boolean')) {
				reject(new Error('The "PanTilt" property was invalid: ' + err_msg));
				return;
			}
		}

		if ('Zoom' in params) {
			if (err_msg = mOnvifSoap.isInvalidValue(params['Zoom'], 'boolean')) {
				reject(new Error('The "Zoom" property was invalid: ' + err_msg));
				return;
			}
		}

		let soap_body = '';
		soap_body += '<tptz:Stop>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';
		if ('PanTilt' in params) {
			soap_body += '<tptz:PanTilt>' + params['PanTilt'] + '</tptz:PanTilt>';
		}
		if ('Zoom' in params) {
			soap_body += '<tptz:Zoom>' + params['Zoom'] + '</tptz:Zoom>';
		}
		soap_body += '</tptz:Stop>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'Stop', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: gotoHomePosition(params[, callback])
* - params:
*   - ProfileToken | String | required |
*   - Speed        | Float  | optional |
*
* {
*   'ProfileToken': 'Profile1',
*   'Speed': 0.5
* }
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.gotoHomePosition = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		if ('Speed' in params) {
			if (err_msg = mOnvifSoap.isInvalidValue(params['Speed'], 'float')) {
				reject(new Error('The "Speed" property was invalid: ' + err_msg));
				return;
			}
		}

		let soap_body = '';
		soap_body += '<tptz:GotoHomePosition>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';
		if ('Speed' in params) {
			soap_body += '<tptz:Speed>' + params['Speed'] + '</tptz:Speed>';
		}
		soap_body += '</tptz:GotoHomePosition>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'GotoHomePosition', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: setHomePosition(params[, callback])
* - params:
*   - ProfileToken | String | required |
*
* {
*   'ProfileToken': 'Profile1'
* }
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.setHomePosition = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		let soap_body = '';
		soap_body += '<tptz:SetHomePosition>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';
		soap_body += '</tptz:SetHomePosition>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'SetHomePosition', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: setPreset(params[, callback])
* - params:
*   - ProfileToken | String | required | a token of the targeted PTZ node
*   - PresetToken  | String | optional |
*   - PresetName   | String | optional |
*
* {
*   'ProfileToken': 'Profile1',
*   'PresetName'  : 'Preset1'
* }
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.setPreset = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		if ('PresetToken' in params) {
			if (err_msg = mOnvifSoap.isInvalidValue(params['PresetToken'], 'string')) {
				reject(new Error('The "PresetToken" property was invalid: ' + err_msg));
				return;
			}
		}

		if ('PresetName' in params) {
			if (err_msg = mOnvifSoap.isInvalidValue(params['PresetName'], 'string')) {
				reject(new Error('The "PresetName" property was invalid: ' + err_msg));
				return;
			}
		}

		if (!('PresetToken' in params) && !('PresetName' in params)) {
			reject('Either the "ProfileToken" or the "PresetName" property must be specified.');
			return;
		}

		let soap_body = '';
		soap_body += '<tptz:SetPreset>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';
		if ('PresetToken' in params) {
			soap_body += '<tptz:PresetToken>' + params['PresetToken'] + '</tptz:PresetToken>';
		}
		if ('PresetName' in params) {
			soap_body += '<tptz:PresetName>' + params['PresetName'] + '</tptz:PresetName>';
		}
		soap_body += '</tptz:SetPreset>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'SetPreset', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: getPresets(params[, callback])
* - params:
*   - ProfileToken | String | required | a token of the targeted PTZ node
*
* {
*   'ProfileToken': 'Profile1'
* }
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.getPresets = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		let soap_body = '';
		soap_body += '<tptz:GetPresets>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';
		soap_body += '</tptz:GetPresets>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'GetPresets', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: gotoPreset(params[, callback])
* - params:
*   - ProfileToken | String  | required | 
*   - PresetToken  | String  | required | 
*   - Speed        | Object  | optional | pan, tilt and zoom
*     - x          | Float   | required |
*     - y          | Float   | required |
*     - x          | Float   | required |
*
* {
*   'ProfileToken': 'Profile1',
*   'PresetToken' : 'Preset1',
*   'Speed'       : {'x': 0.5, 'y': 1.0, 'z': 0.5}
* }
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.gotoPreset = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['PresetToken'], 'string')) {
			reject(new Error('The "PresetToken" property was invalid: ' + err_msg));
			return;
		}

		let klist = ['x', 'y', 'z'];
		if ('Speed' in params) {
			if (err_msg = mOnvifSoap.isInvalidValue(params['Speed'], 'object')) {
				reject(new Error('The "Speed" property was invalid: ' + err_msg));
				return;
			}
			for (let i = 0; i < klist.length; i++) {
				let k = klist[i];
				let v = params['Speed'][k];
				if (err_msg = mOnvifSoap.isInvalidValue(v, 'float')) {
					reject(new Error('The "' + k + '" property was invalid: ' + err_msg));
					return;
				}
			}
		}

		let soap_body = '';
		soap_body += '<tptz:GotoPreset>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';
		soap_body += '<tptz:PresetToken>' + params['PresetToken'] + '</tptz:PresetToken>';
		if (params['Speed']) {
			soap_body += '<tptz:Speed>';
			soap_body += '<tt:PanTilt x="' + params['Speed']['x'] + '" y="' + params['Speed']['y'] + '" />';
			soap_body += '<tt:Zoom x="' + params['Speed']['z'] + '"/>';
			soap_body += '</tptz:Speed>';
		}
		soap_body += '</tptz:GotoPreset>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'GotoPreset', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

/* ------------------------------------------------------------------
* Method: removePreset(params[, callback])
* - params:
*   - ProfileToken | String | required | a token of the targeted PTZ node
*   - PresetToken  | String | required |
*
* {
*   'ProfileToken': 'Profile1',
*   'PresetToken' : 'Preset1'
* }
* ---------------------------------------------------------------- */
OnvifServicePtz.prototype.removePreset = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
		let err_msg = '';
		if (err_msg = mOnvifSoap.isInvalidValue(params, 'object')) {
			reject(new Error('The value of "params" was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['ProfileToken'], 'string')) {
			reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
			return;
		}

		if (err_msg = mOnvifSoap.isInvalidValue(params['PresetToken'], 'string')) {
			reject(new Error('The "PresetToken" property was invalid: ' + err_msg));
			return;
		}

		let soap_body = '';
		soap_body += '<tptz:RemovePreset>';
		soap_body += '<tptz:ProfileToken>' + params['ProfileToken'] + '</tptz:ProfileToken>';
		soap_body += '<tptz:PresetToken>' + params['PresetToken'] + '</tptz:PresetToken>';
		soap_body += '</tptz:RemovePreset>';
		let soap = this._createRequestSoap(soap_body);

		mOnvifSoap.requestCommand(this.oxaddr, 'RemovePreset', soap).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
	if (callback) {
		promise.then((result) => {
			callback(null, result);
		}).catch((error) => {
			callback(error);
		});
	} else {
		return promise;
	}
};

OnvifServicePtz.prototype.getPresetTours = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
	  let err_msg = "";
	  if ((err_msg = mOnvifSoap.isInvalidValue(params, "object"))) {
		reject(new Error('The value of "params" was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["ProfileToken"], "string"))
	  ) {
		reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
		return;
	  }
  
	  let soap_body = "";
	  soap_body += "<tptz:GetPresetTours>";
	  soap_body +=
		"<tptz:ProfileToken>" + params["ProfileToken"] + "</tptz:ProfileToken>";
	  soap_body += "</tptz:GetPresetTours>";
	  let soap = this._createRequestSoap(soap_body);
  
	  mOnvifSoap
		.requestCommand(this.oxaddr, "GetPresetTours", soap)
		.then(result => {
		  resolve(result);
		})
		.catch(error => {
		  reject(error);
		});
	});
	if (callback) {
	  promise
		.then(result => {
		  callback(null, result);
		})
		.catch(error => {
		  callback(error);
		});
	} else {
	  return promise;
	}
  };
  
  /* ------------------------------------------------------------------
   * Method: operatePresetTour(params[, callback])
   * - params:
   *   - ProfileToken | String | required | a token of the targeted PTZ node
   *   - PresetTourToken   | String | required |
   *		- Operation | String | required | enum { 'Start', 'Stop', 'Pause', 'Extended' }
   *
   * {
   *   'ProfileToken': 'Profile1',
   *   'PresetTourToken ' : 'PresetTour1',
   *   'Operation' : 'Start'
   * }
   * ---------------------------------------------------------------- */
  OnvifServicePtz.prototype.operatePresetTour = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
	  let err_msg = "";
	  if ((err_msg = mOnvifSoap.isInvalidValue(params, "object"))) {
		reject(new Error('The value of "params" was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["ProfileToken"], "string"))
	  ) {
		reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["PresetTourToken"], "string"))
	  ) {
		reject(
		  new Error('The "PresetTourToken" property was invalid: ' + err_msg)
		);
		return;
	  }
  
	  if (
		(err_msg =
		  mOnvifSoap.isInvalidValue(params["Operation"], "string") &&
		  params["Operation"] !== "Start" &&
		  params["Operation"] !== "Stop" &&
		  params["Operation"] !== "Pause" &&
		  params["Operation"] !== "Extended")
	  ) {
		reject(new Error('The "Operation" property was invalid: ' + err_msg));
		return;
	  }
  
	  let soap_body = "";
	  soap_body += "<tptz:OperatePresetTour>";
	  soap_body +=
		"<tptz:ProfileToken>" + params["ProfileToken"] + "</tptz:ProfileToken>";
	  soap_body +=
		"<tptz:PresetTourToken>" +
		params["PresetTourToken"] +
		"</tptz:PresetTourToken>";
	  soap_body += "<tptz:Operation>" + params["Operation"] + "</tptz:Operation>";
	  soap_body += "</tptz:OperatePresetTour>";
	  let soap = this._createRequestSoap(soap_body);
  
	  mOnvifSoap
		.requestCommand(this.oxaddr, "OperatePresetTour", soap)
		.then(result => {
		  resolve(result);
		})
		.catch(error => {
		  reject(error);
		});
	});
	if (callback) {
	  promise
		.then(result => {
		  callback(null, result);
		})
		.catch(error => {
		  callback(error);
		});
	} else {
	  return promise;
	}
  };
  
  /* ------------------------------------------------------------------
   * Method: removePresetTour(params[, callback])
   * - params:
   *   - ProfileToken | String | required | a token of the targeted PTZ node
   *   - PresetTourToken   | String | required |
   *
   * {
   *   'ProfileToken': 'Profile1',
   *   'PresetTourToken ' : 'PresetTour1',
   * }
   * ---------------------------------------------------------------- */
  OnvifServicePtz.prototype.removePresetTour = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
	  let err_msg = "";
	  if ((err_msg = mOnvifSoap.isInvalidValue(params, "object"))) {
		reject(new Error('The value of "params" was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["ProfileToken"], "string"))
	  ) {
		reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["PresetTourToken"], "string"))
	  ) {
		reject(
		  new Error('The "PresetTourToken" property was invalid: ' + err_msg)
		);
		return;
	  }
  
	  let soap_body = "";
	  soap_body += "<tptz:RemovePresetTour>";
	  soap_body +=
		"<tptz:ProfileToken>" + params["ProfileToken"] + "</tptz:ProfileToken>";
	  soap_body +=
		"<tptz:PresetTourToken>" +
		params["PresetTourToken"] +
		"</tptz:PresetTourToken>";
	  soap_body += "</tptz:RemovePresetTour>";
	  let soap = this._createRequestSoap(soap_body);
  
	  mOnvifSoap
		.requestCommand(this.oxaddr, "RemovePresetTour", soap)
		.then(result => {
		  resolve(result);
		})
		.catch(error => {
		  reject(error);
		});
	});
	if (callback) {
	  promise
		.then(result => {
		  callback(null, result);
		})
		.catch(error => {
		  callback(error);
		});
	} else {
	  return promise;
	}
  };
  
  /* ------------------------------------------------------------------
   * Method: getPresetTour(params[, callback])
   * - params:
   *   - ProfileToken | String | required | a token of the targeted PTZ node
   *   - PresetTourToken   | String | required |
   *
   * {
   *   'ProfileToken': 'Profile1',
   *   'PresetTourToken ' : 'PresetTour1',
   * }
   * ---------------------------------------------------------------- */
  OnvifServicePtz.prototype.getPresetTour = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
	  let err_msg = "";
	  if ((err_msg = mOnvifSoap.isInvalidValue(params, "object"))) {
		reject(new Error('The value of "params" was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["ProfileToken"], "string"))
	  ) {
		reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["PresetTourToken"], "string"))
	  ) {
		reject(
		  new Error('The "PresetTourToken" property was invalid: ' + err_msg)
		);
		return;
	  }
  
	  let soap_body = "";
	  soap_body += "<tptz:GetPresetTour>";
	  soap_body +=
		"<tptz:ProfileToken>" + params["ProfileToken"] + "</tptz:ProfileToken>";
	  soap_body +=
		"<tptz:PresetTourToken>" +
		params["PresetTourToken"] +
		"</tptz:PresetTourToken>";
	  soap_body += "</tptz:GetPresetTour>";
	  let soap = this._createRequestSoap(soap_body);
  
	  mOnvifSoap
		.requestCommand(this.oxaddr, "GetPresetTour", soap)
		.then(result => {
		  resolve(result);
		})
		.catch(error => {
		  reject(error);
		});
	});
	if (callback) {
	  promise
		.then(result => {
		  callback(null, result);
		})
		.catch(error => {
		  callback(error);
		});
	} else {
	  return promise;
	}
  };
  
  /* ------------------------------------------------------------------
   * Method: getPresetTourOptions(params[, callback])
   * - params:
   *   - ProfileToken | String | required | a token of the targeted PTZ node
   *   - PresetTourToken   | String | required |
   *
   * {
   *   'ProfileToken': 'Profile1',
   *   'PresetTourToken ' : 'PresetTour1',
   * }
   * ---------------------------------------------------------------- */
  OnvifServicePtz.prototype.getPresetTourOptions = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
	  let err_msg = "";
	  if ((err_msg = mOnvifSoap.isInvalidValue(params, "object"))) {
		reject(new Error('The value of "params" was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["ProfileToken"], "string"))
	  ) {
		reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["PresetTourToken"], "string"))
	  ) {
		reject(
		  new Error('The "PresetTourToken" property was invalid: ' + err_msg)
		);
		return;
	  }
  
	  let soap_body = "";
	  soap_body += "<tptz:GetPresetTourOptions>";
	  soap_body +=
		"<tptz:ProfileToken>" + params["ProfileToken"] + "</tptz:ProfileToken>";
	  soap_body +=
		"<tptz:PresetTourToken>" +
		params["PresetTourToken"] +
		"</tptz:PresetTourToken>";
	  soap_body += "</tptz:GetPresetTourOptions>";
	  let soap = this._createRequestSoap(soap_body);
  
	  mOnvifSoap
		.requestCommand(this.oxaddr, "GetPresetTourOptions", soap)
		.then(result => {
		  resolve(result);
		})
		.catch(error => {
		  reject(error);
		});
	});
	if (callback) {
	  promise
		.then(result => {
		  callback(null, result);
		})
		.catch(error => {
		  callback(error);
		});
	} else {
	  return promise;
	}
  };
  
  /* ------------------------------------------------------------------
   * Method: createPresetTour(params[, callback])
   * - params:
   *   - ProfileToken | String | required | a token of the targeted PTZ node
   *
   * {
   *   'ProfileToken': 'Profile1'
   * }
   * ---------------------------------------------------------------- */
  OnvifServicePtz.prototype.createPresetTour = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
	  let err_msg = "";
	  if ((err_msg = mOnvifSoap.isInvalidValue(params, "object"))) {
		reject(new Error('The value of "params" was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["ProfileToken"], "string"))
	  ) {
		reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
		return;
	  }
  
	  let soap_body = "";
	  soap_body += "<tptz:CreatePresetTour>";
	  soap_body +=
		"<tptz:ProfileToken>" + params["ProfileToken"] + "</tptz:ProfileToken>";
	  soap_body += "</tptz:CreatePresetTour>";
	  let soap = this._createRequestSoap(soap_body);
  
	  mOnvifSoap
		.requestCommand(this.oxaddr, "CreatePresetTour", soap)
		.then(result => {
		  resolve(result);
		})
		.catch(error => {
		  reject(error);
		});
	});
	if (callback) {
	  promise
		.then(result => {
		  callback(null, result);
		})
		.catch(error => {
		  callback(error);
		});
	} else {
	  return promise;
	}
  };
  
  /* ------------------------------------------------------------------
   * Method: modifyPresetTour(params[, callback])
   * - params:
   *   - ProfileToken | String | required | a token of the targeted PTZ node
   *		- PresetTour | Object | required |
   *			- token | String | required |
   *			- Name | String | optional |
   *			- AutoStart | boolean | required |
   *			- StartingCondition | Object | required |
   *				- RandomPresetOrder | boolean | required |
   *				- RecurringTime | number | optional |
   *				- Direction | string | optional | enum { 'Forward', 'Backward', 'Extended' }
   *			- TourSpot | Object | required |
   *				- PresetDetail | object | required |
   *					- PresetToken | array | required | string[]
   *					- StayTime | string | required | duration
   *
   * {
   *   'ProfileToken': 'Profile1'
   *		'PresetTour': {
   *
   *		}
   * }
   * ---------------------------------------------------------------- */
  OnvifServicePtz.prototype.modifyPresetTour = function (params, callback) {
	let promise = new Promise((resolve, reject) => {
	  let err_msg = "";
	  if ((err_msg = mOnvifSoap.isInvalidValue(params, "object"))) {
		reject(new Error('The value of "params" was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(params["ProfileToken"], "string"))
	  ) {
		reject(new Error('The "ProfileToken" property was invalid: ' + err_msg));
		return;
	  }
  
	  if ((err_msg = mOnvifSoap.isInvalidValue(params["PresetTour"], "object"))) {
		reject(new Error('The "PresetTour" property was invalid: ' + err_msg));
		return;
	  }
  
	  if (
		(err_msg = mOnvifSoap.isInvalidValue(
		  params["PresetTour"]["token"],
		  "string"
		))
	  ) {
		reject(new Error('The "token" property was invalid: ' + err_msg));
		return;
	  }
  
	  let soap_body = "";
	  soap_body += "<tptz:ModifyPresetTour>";
	  soap_body +=
		"<tptz:ProfileToken>" + params["ProfileToken"] + "</tptz:ProfileToken>";
	  if (mOnvifSoap.isInvalidValue(params["PresetTourToken"], "string") === "") {
		soap_body +=
		  "<tptz:PresetTourToken>" +
		  params["PresetTourToken"] +
		  "</tptz:PresetTourToken>";
	  }
	  soap_body += `<tptz:PresetTour token="${params["PresetTour"]["token"]}">`;
	  if (
		mOnvifSoap.isInvalidValue(params["PresetTour"]["Name"], "string") === ""
	  ) {
		soap_body += `<tt:Name>${params["PresetTour"]["Name"]}</tt:Name>`;
	  }
	  if (
		mOnvifSoap.isInvalidValue(
		  params["PresetTour"]["AutoStart"],
		  "boolean"
		) === ""
	  ) {
		soap_body += `<tt:AutoStart>${params["PresetTour"]["AutoStart"]}</tt:AutoStart>`;
	  }
	  if (
		mOnvifSoap.isInvalidValue(
		  params["PresetTour"]["StartingCondition"],
		  "object"
		) === ""
	  ) {
		let StartingCondition = params["PresetTour"]["StartingCondition"];
		if (
		  mOnvifSoap.isInvalidValue(
			StartingCondition["RandomPresetOrder"],
			"boolean"
		  ) === ""
		) {
		  soap_body += `<tt:StartingCondition RandomPresetOrder="${StartingCondition["RandomPresetOrder"]}">`;
		} else {
		  soap_body += "<tt:StartingCondition>";
		}
		if (
		  mOnvifSoap.isInvalidValue(
			StartingCondition["RecurringTime"],
			"integer"
		  ) === ""
		) {
		  soap_body += `<tt:RecurringTime>${StartingCondition["RecurringTime"]}</tt:RecurringTime>`;
		}
		if (
		  mOnvifSoap.isInvalidValue(
			StartingCondition["RecurringDuration"],
			"string"
		  ) === "" ||
		  mOnvifSoap.isInvalidValue(
			StartingCondition["RecurringDuration"],
			"integer"
		  ) === ""
		) {
		  soap_body += `<tt:RecurringDuration>PT${StartingCondition["RecurringDuration"]}S</tt:RecurringDuration>`;
		}
		if (
		  mOnvifSoap.isInvalidValue(StartingCondition["Direction"], "string") ===
		  ""
		) {
		  soap_body += `<tt:Direction>${StartingCondition["Direction"]}</tt:Direction>`;
		}
		soap_body += "</tt:StartingCondition>";
	  }
	  function processTourSpot(mOnvifSoap, TourSpot, soap_body) {
		if (mOnvifSoap.isInvalidValue(TourSpot, "object") === "") {
		  soap_body += "<tt:TourSpot>";
		  if (
			mOnvifSoap.isInvalidValue(TourSpot["PresetDetail"], "object") === ""
		  ) {
			soap_body += "<tt:PresetDetail>";
			if (
			  mOnvifSoap.isInvalidValue(
				TourSpot["PresetDetail"]["PresetToken"],
				"array"
			  ) === ""
			) {
			  for (
				let i = 0;
				i < TourSpot["PresetDetail"]["PresetToken"].length;
				i++
			  ) {
				let PresetToken = TourSpot["PresetDetail"]["PresetToken"][i];
				soap_body += `<tt:PresetToken>${PresetToken}</tt:PresetToken>`;
			  }
			} else if (
			  mOnvifSoap.isInvalidValue(
				TourSpot["PresetDetail"]["PresetToken"],
				"string"
			  ) === ""
			) {
			  let PresetToken = TourSpot["PresetDetail"]["PresetToken"];
			  soap_body += `<tt:PresetToken>${PresetToken}</tt:PresetToken>`;
			}
			soap_body += "</tt:PresetDetail>";
		  }
		  if (mOnvifSoap.isInvalidValue(TourSpot["Speed"], "object") === "") {
			soap_body += "<tt:Speed>";
			if (
			  mOnvifSoap.isInvalidValue(
				TourSpot["Speed"]["PanTilt"],
				"object"
			  ) === ""
			) {
			  soap_body += `<tt:PanTilt${
				TourSpot["Speed"]["PanTilt"]["x"] !== undefined
				  ? ` x="${TourSpot["Speed"]["PanTilt"]["x"]}"`
				  : ""
				}${
				TourSpot["Speed"]["PanTilt"]["y"] !== undefined
				  ? ` y="${TourSpot["Speed"]["PanTilt"]["y"]}"`
				  : ""
				}></tt:PanTilt>`;
			}
			if (
			  mOnvifSoap.isInvalidValue(TourSpot["Speed"]["Zoom"], "object") ===
			  ""
			) {
			  soap_body += `<tt:Zoom${
				TourSpot["Speed"]["Zoom"]["x"] !== undefined
				  ? ` x="${TourSpot["Speed"]["Zoom"]["x"]}"`
				  : ""
				}></tt:Zoom>`;
			}
			soap_body += "</tt:Speed>";
		  }
		  if (
			mOnvifSoap.isInvalidValue(TourSpot["StayTime"], "string") === "" ||
			mOnvifSoap.isInvalidValue(TourSpot["StayTime"], "integer") === ""
		  ) {
			soap_body += `<tt:StayTime>PT${TourSpot["StayTime"]}S</tt:StayTime>`;
		  }
		  // if (mOnvifSoap.isInvalidValue(TourSpot['StayTime'], 'string') === '' ||
		  // 	mOnvifSoap.isInvalidValue(TourSpot['StayTime'], 'integer') === '') {
		  // 	let StayTime = TourSpot['StayTime']
		  // 	soap_body +=   `<tt:StayTime><tt:Min>PT${StayTime}S</tt:Min><tt:Max>PT${StayTime}S</tt:Max></tt:StayTime>`
		  // } else if (mOnvifSoap.isInvalidValue(TourSpot['StayTime'], 'object') === ''){
		  // 	soap_body +=  `<tt:StayTime><tt:Min>PT${TourSpot['StayTime']['Min']}S</tt:Min><tt:Max>PT${TourSpot['StayTime']['Max']}S</tt:Max></tt:StayTime>`
		  // }
		  soap_body += "</tt:TourSpot>";
		}
		return soap_body;
	  }
	  if (
		mOnvifSoap.isInvalidValue(params["PresetTour"]["TourSpot"], "array") ===
		""
	  ) {
		for (let i = 0; i < params["PresetTour"]["TourSpot"].length; i++) {
		  soap_body = processTourSpot(
			mOnvifSoap,
			params["PresetTour"]["TourSpot"][i],
			soap_body
		  );
		}
	  } else {
		soap_body = processTourSpot(
		  mOnvifSoap,
		  params["PresetTour"]["TourSpot"],
		  soap_body
		);
	  }
	  soap_body += "</tptz:PresetTour>";
	  soap_body += "</tptz:ModifyPresetTour>";
	  let soap = this._createRequestSoap(soap_body);
  
	  mOnvifSoap
		.requestCommand(this.oxaddr, "ModifyPresetTour", soap)
		.then(result => {
		  resolve(result);
		})
		.catch(error => {
		  reject(error);
		});
	});
	if (callback) {
	  promise
		.then(result => {
		  callback(null, result);
		})
		.catch(error => {
		  callback(error);
		});
	} else {
	  return promise;
	}
  };

module.exports = OnvifServicePtz;