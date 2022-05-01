import { Aws, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  Distribution,
  OriginProtocolPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class WuChatInfraStack extends Stack {
  bucket: Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.bucket = new Bucket(this, "WebsiteBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const certificate = Certificate.fromCertificateArn(
      this,
      "ImportedCertificate",
      `arn:aws:acm:us-east-1:${Aws.ACCOUNT_ID}:certificate/016aa238-6ed2-469c-acc7-d88ea6ccd6af`
    );

    new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new HttpOrigin(
          "bbksjf5oissyvfrtwalazkh4km0ortbc.lambda-url.us-east-1.on.aws",
          {
            protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
          }
        ),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        "/_nuxt/**": { origin: new S3Origin(this.bucket) },
      },
      domainNames: ["wu.chat"],
      certificate,
    });
  }
}
