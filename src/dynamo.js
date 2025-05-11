import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

export async function scanTodos() {
  const { Items } = await docClient.send(
    new ScanCommand({ TableName: "todo_app" })
  );
  return Items || [];
}

export async function createTodo(item) {
  await docClient.send(new PutCommand({ TableName: "todo_app", Item: item }));
}
