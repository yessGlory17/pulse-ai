import { ApiResponse } from "~/lib/response";

export type Data = {
  _id: string;
  hostname: string;
  username: string;
};

type GetEndpointsResponse = ApiResponse & {
  data: Data[];
};

export const GET_ENDPOINTS_KEY = 'endpoints';

async function GetEndpoints(): Promise<GetEndpointsResponse> {
  const resp = await fetch(`/api/endpoint`);
  const passwords = await resp.json();

  return passwords;
}
export default GetEndpoints;
