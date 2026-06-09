import { ENextFunction, ERequest, EResponse } from "./types";
import auth from "./middlewares/auth";
const dev = process.env.NODE_ENV === "development" ? true : false;

async function getCookieHost(host: string) {
  const domainRegex =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  const ipv4Regex =
    /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  if (domainRegex.test(host) || ipv4Regex.test(host)) {
    return host;
  } else {
    return "localhost";
  }
}

const initialize = async (
  req: ERequest,
  res: EResponse,
  next: ENextFunction
) => {
  try {
    req.authResponse = null;
    req.host_name = `${await getCookieHost(String(req.get("host")))}`;
    req.req_domain = `${
      req.host_name === "localhost" ? "http" : "https"
    }://${req.get("host")}`.replace(/^\/+|\/+$/g, "");

    const device = String(req.headers?.["device"]);
    if (device === "web" || device === undefined) {
      try {
        const receivedCookies = req.cookies || {};
        Object.keys(receivedCookies).forEach((cookieName) => {
          const cookieValue = receivedCookies[cookieName];
          res.cookie(cookieName, cookieValue, {
            maxAge: 30 * (24 * 60 * 60 * 1000), // 30 Days
            secure: true,
            sameSite: "none",
            domain: `${req.host_name}`,
          });
        });
      } catch {}
    } else if (device === "mobile") {
      await auth.reqHeaderInit(req, res);
    }

    next();
  } catch {
    const receivedCookies = req.cookies || {};
    Object.keys(receivedCookies).forEach((cookieName) => {
      const cookieValue = receivedCookies[cookieName];
      res.cookie(cookieName, cookieValue, {
        maxAge: 30 * (24 * 60 * 60 * 1000), // 30 Days
        secure: true,
        sameSite: "none",
        domain: `${req.host_name}`,
      });
    });
    return res.status(500).json({
      message: "500 Server Error! becuase of initial props",
    });
  }
};

export default initialize;
