import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  Distribution,
  SecurityPolicyProtocol,
  SSLMethod,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class WuChatStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "WebsiteBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new BucketDeployment(this, "DeployWebsite", {
      sources: [Source.asset("app/.output/public")],
      destinationBucket: bucket,
    });

    new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new S3Origin(bucket),
      },
      defaultRootObject: "index.html",
    });
  }
}
