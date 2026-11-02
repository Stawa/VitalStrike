import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { handleRelay } from "~/utils/relay.server";

export const loader = ({ request, params }: LoaderFunctionArgs) =>
  handleRelay(request, params["*"] ?? "");

export const action = ({ request, params }: ActionFunctionArgs) =>
  handleRelay(request, params["*"] ?? "");
