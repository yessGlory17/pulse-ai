"use client";
import { useChat } from "@ai-sdk/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import createToken, {
  CREATE_TOKEN_KEY,
} from "~/services/endpoint/mutations/CreateEndpoint";
import GetEndpoints, {
  GET_ENDPOINTS_KEY,
} from "~/services/endpoint/queries/GetEndpoints";

export default function Home() {
  const tokenMutation = useMutation({
    mutationKey: [CREATE_TOKEN_KEY],
    mutationFn: createToken,
    onSuccess(data, variables, context) {
      console.log("TOKEN : ", data);
    },
  });

  const { data: endpoints } = useQuery({
    queryKey: [GET_ENDPOINTS_KEY],
    queryFn: GetEndpoints,
  });

  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      <button onClick={async () => await tokenMutation.mutate()}>
        Generate Token
      </button>

      <p>TOKEN: {tokenMutation.data?.token}</p>

      <h6>Endpoints</h6>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {endpoints?.data.map((endpoint) => {
          return (
            <div
              key={endpoint._id}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <p>{endpoint.hostname}</p>
              <p>{endpoint.username}</p>
            </div>
          );
        })}
      </div>

      <hr />

      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}

      <input type="text" onChange={handleInputChange} value={input} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
