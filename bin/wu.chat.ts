#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { WuChatInfraStack } from "../lib/wu.chat-infra-stack";
import { WuChatAssetStack } from "../lib/wu.chat-asset-stack";

const app = new App();
const infraStack = new WuChatInfraStack(app, "wu-chat-infra-stack");
new WuChatAssetStack(app, "wu-chat-assets-stack", {
  bucket: infraStack.bucket,
});
