import { Aws, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  Distribution,
  LambdaEdgeEventType,
  experimental,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class WuChatStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "WebsiteBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const edgeFunction = new experimental.EdgeFunction(this, "EdgeFunction", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("app/.output"),
      handler: "server/index.handler",
    });

    new HostedZone(this, "HostedZone", {
      zoneName: "wu.chat",
    });

    const certificate = Certificate.fromCertificateArn(
      this,
      "ImportedCertificate",
      `arn:aws:acm:us-east-1:${Aws.ACCOUNT_ID}:certificate/016aa238-6ed2-469c-acc7-d88ea6ccd6af`
    );

    new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new S3Origin(bucket),
        edgeLambdas: [
          {
            functionVersion: edgeFunction.currentVersion,
            eventType: LambdaEdgeEventType.VIEWER_REQUEST,
          },
        ],
      },
      defaultRootObject: "index.html",
      domainNames: ["wu.chat"],
      certificate,
    });

    new BucketDeployment(this, "BucketDeployment", {
      sources: [Source.asset("app/.output/public")],
      destinationBucket: bucket,
    });
  }
}
