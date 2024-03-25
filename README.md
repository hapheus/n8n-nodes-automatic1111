# n8n-nodes-automatic1111

This is an n8n community node. It lets you use Automatic1111 in your n8n workflows.

Automatic1111 is a web UI for Stable Diffusion, enabling users to generate images from text descriptions through a powerful AI model.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- **Generate Image**: Convert text descriptions into images using the Automatic1111 API.

## Credentials

To use the Automatic1111 node, you need to connect to the Automatic1111 API.

Currently, the system is designed to allow the specification of a single host where the API can be accessed. It's important to note that, as of the latest version, the integration of API keys or tokens is the primary method for authentication. However, the platform is evolving, and there is planned support for additional authentication mechanisms, including Basic Auth, in future updates. This enhancement aims to provide users with more flexibility and security options for their API interactions. Stay tuned for these updates to ensure you can take full advantage of the expanded authentication features as they become available.

## Usage

This node is straightforward to use within your n8n workflows. After installing the node, simply drag it into your workflow and configure it with your Automatic1111 credentials. Then, input your text description and let the node generate an image for you.

For users new to n8n or those who need a refresher, you can start with the [Try it out](https://docs.n8n.io/try-it-out/) documentation.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Automatic1111 documentation](https://github.com/Automatic1111/stable-diffusion-webui)

## Version history

Version 0.1.0: Initial release, featuring the ability to generate images from text descriptions using the Automatic1111 API.
