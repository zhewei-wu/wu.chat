import { Aws, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  CachePolicy,
  Distribution,
  OriginProtocolPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class WuChatInfraStack extends Stack {
  bucket: Bucket;
  table: Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.bucket = new Bucket(this, "WebsiteBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.table = new Table(this, "Table", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const certificate = Certificate.fromCertificateArn(
      this,
      "ImportedCertificate",
      `arn:aws:acm:us-east-1:${Aws.ACCOUNT_ID}:certificate/016aa238-6ed2-469c-acc7-d88ea6ccd6af`
    );

    const lambdaOrigin = new HttpOrigin(
      "bbksjf5oissyvfrtwalazkh4km0ortbc.lambda-url.us-east-1.on.aws",
      {
        protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
      }
    );

    new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: lambdaOrigin,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        "/_nuxt/**": { origin: new S3Origin(this.bucket) },
        "/api/**": {
          origin: lambdaOrigin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: CachePolicy.CACHING_DISABLED,
        },
      },
      domainNames: ["wu.chat"],
      certificate,
    });
  }
}
