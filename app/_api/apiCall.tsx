export async function Api(url: string, body: any = {}) {
  try {
    const channelId =
      (localStorage.getItem("channel") &&
        JSON.parse(localStorage.getItem("channel") ?? "").channel_id) ||
      1;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
      headers: {
        "Content-Type": "application/json",
        "api-token": localStorage.getItem("api-token") ?? "",
        "app-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
        "app-riyaz": "riyazfrontend",
      },
      method: "POST",
      body: JSON.stringify({
        ...body,
        shop: localStorage.getItem("shop"),
        channel_id: channelId,
        store_id: localStorage.getItem("user_id"),
      }),
    });

    // Check HTTP status
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    // Parse JSON safely
    const result = await response.json();
    return result;
  } catch (err: any) {
    console.error("API call failed:", err);
    return { error: err.message || "Unknown API error" };
  }
}

export const copilotApi = async (uri: string, option: any, method = "POST") => {
  const channelId =
    (localStorage.getItem("channel") &&
      JSON.parse(localStorage.getItem("channel") ?? "").channel_id) ||
    1;
  console.log("copilotApi result first", uri);

  const response = await fetch(
    `https://revamp.seokart.com/seokart-bigcommerce-app/api/${uri}`,
    {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "api-token": localStorage.getItem("api-token") ?? "",
        "app-key": `${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({
        ...option,
        shop: localStorage.getItem("shop"),
        channel_id: channelId,
        store_id: localStorage.getItem("user_id"),
      }),
    },
  );
  console.log("copilotApi response", response);
  const result = await response.json();

  return result;
};

export async function InstallApi(url: any, body: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });
  console.log("InstallApi response", response);
  const result = await response.json();
  return result;
}
