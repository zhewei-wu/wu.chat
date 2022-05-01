import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

export default defineEventHandler(async (event) => {
  const client = new DynamoDBClient({ region: "us-east-1" });
  const name = event.context.params.name;

  const command = new GetItemCommand({
    TableName: process.env.TABLE_NAME!,
    Key: { pk: { S: name } },
  });

  const { Item } = await client.send(command);

  console.log(Item);

  return {
    message: `Hi ${event.context.params.name}!`,
  };
});
