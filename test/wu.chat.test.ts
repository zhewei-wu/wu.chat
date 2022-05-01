import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { WuChatInfraStack } from "../lib/wu.chat-infra-stack";

describe("CloudFormation Stack", () => {
  const app = new App();
  const stack = new WuChatInfraStack(app, "MyTestStack");

  test("Website bucket is created", () => {
    Template.fromStack(stack).hasResourceProperties("AWS::S3::Bucket", {});
  });
});
