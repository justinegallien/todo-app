import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
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

export async function createTodo(todo) {
  await docClient.send(new PutCommand({ TableName: "todo_app", Item: todo }));
}

export async function deleteToDo(id) {
  await docClient.send(
    new DeleteCommand({ TableName: "todo_app", Key: { id } })
  );
}

export async function toggleCompleted(id, completed) {
  await docClient.send(
    new UpdateCommand({
      TableName: "todo_app",
      Key: { id },
      UpdateExpression: "SET #done = :val",
      ExpressionAttributeNames: { "#done": "completed" },
      ExpressionAttributeValues: { ":val": completed },
    })
  );
}
