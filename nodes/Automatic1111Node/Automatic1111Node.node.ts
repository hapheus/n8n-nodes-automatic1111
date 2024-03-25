import {
	IExecuteFunctions, ILoadOptionsFunctions,
	INodeExecutionData, INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Automatic1111Node implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Automatic1111 Node',
		name: 'automatic1111Node',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:20920490.png',
		group: ['transform'],
		version: 1,
		description: 'Automatic1111 Node',
		defaults: {
			name: 'Automatic1111 Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'automatic1111CredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Model Name or ID',
				name: 'model',
				type: 'options',
				description: 'Choose from the list. Choose from the list, or specify an model using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				default: '',
				placeholder: 'Model',
				required: true,
				typeOptions: {
					loadOptionsMethod: 'loadModels',
				},
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				default: '',
				placeholder: 'void, nebula, storm, sun, purple, pink, centered, painted, intricate, volumetric lighting, beautiful, rich deep colors masterpiece, sharp focus, ultra detailed, in the style of dan mumford and marc simonetti, astrophotography, magnificent, celestial, ethereal, epic, magical, dreamy, chiaroscuro, atmospheric lighting,',
				required: true,
			},
			{
				displayName: 'Negative Prompt',
				name: 'negative_prompt',
				type: 'string',
				default: '',
				placeholder: 'bad quality, worst quality, text, username, watermark, blurry, ',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 512,
				required: true,
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 512,
				required: true,
			},
			{
				displayName: 'Steps',
				name: 'steps',
				type: 'number',
				default: 20,
				required: true,
			},
			{
				displayName: 'Cfg Scale',
				name: 'cfg_scale',
				type: 'number',
				default: 7,
				required: true,
			},
			{
				displayName: 'Seed',
				name: 'seed',
				type: 'number',
				default: -1,
				required: true,
			},
		],
	};

	methods = {
		loadOptions: {
			async loadModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				let credentials;
				try {
					credentials = await this.getCredentials('automatic1111CredentialsApi');
				} catch (e) {
					return [];
				}

				await this.helpers.requestWithAuthentication.call(this, 'automatic1111CredentialsApi', {
					method: 'POST',
					uri: credentials.host + '/sdapi/v1/refresh-checkpoints',
				});
				const models = await this.helpers.requestWithAuthentication.call(this, 'automatic1111CredentialsApi', {
					method: 'GET',
					uri: credentials.host + '/sdapi/v1/sd-models',
					json: true,
				});
				for (const model of models) {
					returnData.push({
						name: model.model_name,
						value: model.model_name
					});
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const credentials = await this.getCredentials('automatic1111CredentialsApi');
		let item: INodeExecutionData;
		let model: string;
		let prompt: string;
		let negative_prompt: string;
		let width: number;
		let height: number;
		let steps: number;
		let cfg_scale: number;
		let seed: number;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				model = this.getNodeParameter('model', itemIndex) as string;
				prompt = this.getNodeParameter('prompt', itemIndex) as string;
				negative_prompt = this.getNodeParameter('negative_prompt', itemIndex) as string;
				width = this.getNodeParameter('width', itemIndex) as number;
				height = this.getNodeParameter('height', itemIndex) as number;
				steps = this.getNodeParameter('steps', itemIndex) as number;
				cfg_scale = this.getNodeParameter('cfg_scale', itemIndex) as number;
				seed = this.getNodeParameter('seed', itemIndex) as number;

				item = items[itemIndex];

				await this.helpers.requestWithAuthentication.call(this, 'automatic1111CredentialsApi', {
					method: 'POST',
					uri: credentials.host + '/sdapi/v1/options',
					json: true,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({"sd_model_checkpoint": model}),
				});

				const response = await this.helpers.requestWithAuthentication.call(this, 'automatic1111CredentialsApi', {
					method: 'POST',
					uri: credentials.host + '/sdapi/v1/txt2img',
					json: true,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"prompt": prompt,
						"negative_prompt": negative_prompt,
						"steps": steps,
						"cfg_scale": cfg_scale,
						"width": width,
						"height": height,
						"seed": seed
					}),
				});

				const binaryData = await this.helpers.prepareBinaryData(Buffer.from(response.images[0], 'base64'));
				binaryData.mimeType = "image/jpg";
				binaryData.fileExtension = "jpg";
				binaryData.fileType = "image";
				binaryData.fileName = "image.jpg";

				item.binary = {
					data: binaryData
				};
				item.json = response.parameters;
				item.json.info = JSON.parse(response.info);

			} catch (error) {
				if (this.continueOnFail()) {
					items.push({json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex});
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}
