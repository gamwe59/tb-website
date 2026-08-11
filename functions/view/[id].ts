export const onRequest: PagesFunction = async (context) => {
  const assetUrl = new URL("/view.html", context.request.url);
  const response = await context.env.ASSETS.fetch(assetUrl);
  
  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
};
