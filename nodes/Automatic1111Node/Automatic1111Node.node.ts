import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Automatic1111Node implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Automatic1111 Node',
		name: 'automatic1111Node',
		group: ['transform'],
		version: 1,
		description: 'Automatic1111 Node',
		defaults: {
			name: 'Automatic1111 Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				default: '',
				placeholder: 'void, nebula, storm, sun, purple, pink, centered, painted, intricate, volumetric lighting, beautiful, rich deep colors masterpiece, sharp focus, ultra detailed, in the style of dan mumford and marc simonetti, astrophotography, magnificent, celestial, ethereal, epic, magical, dreamy, chiaroscuro, atmospheric lighting,',
				description: 'The prompt',
				required: true,
			},
			{
				displayName: 'Negative Prompt',
				name: 'negative_prompt',
				type: 'string',
				default: '',
				placeholder: 'bad quality, worst quality, text, username, watermark, blurry, ',
				description: 'The negative prompt',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 512,
				description: 'The width',
				required: true,
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 512,
				description: 'The height',
				required: true,
			},
			{
				displayName: 'Steps',
				name: 'steps',
				type: 'number',
				default: 20,
				description: 'The steps',
				required: true,
			},
			{
				displayName: 'Cfg scale',
				name: 'cfg_scale',
				type: 'number',
				default: 7,
				description: 'The cfg scale',
				required: true,
			},
			{
				displayName: 'Seed',
				name: 'seed',
				type: 'number',
				default: -1,
				description: 'The seed',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let prompt: string;
		let negative_prompt: string;
		let width: number;
		let height: number;
		let steps: number;
		let cfg_scale: number;
		let seed: number;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				prompt = this.getNodeParameter('prompt', itemIndex, '') as string;
				negative_prompt = this.getNodeParameter('negative_prompt', itemIndex, '') as string;
				width = this.getNodeParameter('width', itemIndex) as number;
				height = this.getNodeParameter('height', itemIndex) as number;
				steps = this.getNodeParameter('steps', itemIndex) as number;
				cfg_scale = this.getNodeParameter('cfg_scale', itemIndex) as number;
				seed = this.getNodeParameter('seed', itemIndex) as number;

				item = items[itemIndex];

				 item.json['prompt'] = prompt;
				 item.json['negative_prompt'] = negative_prompt;
				 item.json['width'] = width;
				 item.json['height'] = height;
				 item.json['steps'] = steps;
				 item.json['cfg_scale'] = cfg_scale;
				 item.json['seed'] = seed;

			} catch (error) {
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
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
