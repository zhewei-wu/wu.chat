import { Stack } from "aws-cdk-lib";
import {
  Code,
  Function,
  FunctionUrlAuthType,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export interface Assets {
  bucket: Bucket;
}

export class WuChatAssetStack extends Stack {
  constructor(scope: Construct, id: string, assets: Assets) {
    super(scope, id);

    new BucketDeployment(this, "BucketDeployment", {
      sources: [Source.asset("app/.output/public")],
      destinationBucket: assets.bucket,
    });

    const fn = new Function(this, "Function", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("app/.output"),
      handler: "server/index.handler",
    });

    fn.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });
  }
}
