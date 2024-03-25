import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Automatic1111CredentialsApi implements ICredentialType {
	name = 'automatic1111CredentialsApi';
	displayName = 'Automatc1111 Credentials API';
	icon = 'file:20920490.png';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'http://localhost:7860',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Accept: 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.host}}',
			url: '/sdapi/v1/sd-models',
		},
	};
}
