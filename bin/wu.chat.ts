#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { WuChatStack } from "../lib/wu.chat-stack";

const app = new App();
new WuChatStack(app, "WuChatStack", { env: { region: "us-east-1" } });
