import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { WuChatStack } from "../lib/wu.chat-stack";

describe("CloudFormation Stack", () => {
  const app = new App();
  const stack = new WuChatStack(app, "MyTestStack");

  test("Website bucket is created", () => {
    Template.fromStack(stack).hasResourceProperties("AWS::S3::Bucket", {});
  });
});
