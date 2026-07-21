import { auth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.node.req.headers,
  });

  if (!session) {
    setResponseStatus(event, 401);
    return { error: "Unauthorized" };
  }

  setHeader(event, "X-Forwarded-User", session.user.email);
  
  return { 
    status: "OK", 
    user: session.user.email 
  };
});
