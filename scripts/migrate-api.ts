import fs from 'fs';
import path from 'path';

const basePath = path.join(process.cwd(), 'app', 'api');
const serverPath = path.join(process.cwd(), 'server');

// Create base directories
const dirs = ['methods', 'routes', 'middlewares', 'helpers', 'types', 'utils'];
dirs.forEach(d => fs.mkdirSync(path.join(serverPath, d), { recursive: true }));

// 1. Write core types
const typesContent = `import { NextFunction, Request, Response } from "express";

export interface ERequest extends Request {
  authResponse?: {
    tokenID?: string;
    userID?: string;
    email?: string;
    role?: string;
  } | null;
  req_domain?: string;
  host_name?: string;
  authenticated?: Boolean;
  tokenId?: String;
}

export interface EResponse extends Response {}
export interface ENextFunction extends NextFunction {}

export interface responseInterface {
  (req: ERequest, res: EResponse): any;
}

export interface authInterface {
  (req: ERequest, res: EResponse, next: ENextFunction): void;
}

export interface ERoutes {
  method: "get" | "post" | "patch" | "put" | "delete";
  path: string;
  response: responseInterface;
  auth?: authInterface;
}

export interface cpauthInterface {
  (req: ERequest, res: EResponse, next: ENextFunction): void;
}
`;
fs.writeFileSync(path.join(serverPath, 'types', 'index.ts'), typesContent);

// 2. Write handlers.ts
const handlersContent = `import express from "express";

const handlers = {
  cpRoutesHandler: express.Router(),
};

export default handlers;
`;
fs.writeFileSync(path.join(serverPath, 'handlers.ts'), handlersContent);

// 3. Write startup.ts
const startupContent = `import handlers from "./handlers";
import main_routes from "./routes/main";
import initialize from "./initialize";
import formJsonParser from "./middlewares/formJsonParser";

const routes = [
  {
    routes: main_routes,
    routesHandler: handlers.cpRoutesHandler,
  },
];

const ServerStartup = () => {
  routes.forEach((routesV) => {
    routesV.routes.forEach((route) => {
      try {
        const isPath = typeof route.path === "string";
        const isResponse = typeof route.response === "function";
        const isAuth = typeof route?.auth === "function";

        if (isResponse && isPath) {
          const response = [route.response];
          const auth = isAuth && route.auth ? [route.auth] : [];

          routesV.routesHandler[route.method](route.path, [
            initialize,
            ...auth,
            formJsonParser,
            ...response,
          ]);
        }
      } catch (routeError) {
        console.log(\`\${route?.path} route error \`, routeError);
      }
    });
  });
  console.log("router setup done");
};

export default ServerStartup;
`;
fs.writeFileSync(path.join(serverPath, 'startup.ts'), startupContent);

// 4. Write initialize.ts
const initContent = `import { ENextFunction, ERequest, EResponse } from "./types";
import authMiddleware from "./middlewares/auth";

const initialize = async (req: ERequest, res: EResponse, next: ENextFunction) => {
  try {
    req.authResponse = null;
    req.host_name = "localhost";
    next();
  } catch {
    return res.status(500).json({ message: "Init error" });
  }
};

export default initialize;
`;
fs.writeFileSync(path.join(serverPath, 'initialize.ts'), initContent);

// 5. Write formJsonParser.ts
const parserContent = `import { ENextFunction, ERequest, EResponse } from "../types";

const formJsonParser = async (req: ERequest, res: EResponse, next: ENextFunction) => {
  try {
    if (req.is("multipart/form-data")) {
      const parsedBody: any = { ...req.body };
      for (const key in req.body) {
        try { parsedBody[key] = JSON.parse(req.body[key]); } catch {}
      }
      req.body = parsedBody;
    }
    return next();
  } catch { return next(); }
};

export default formJsonParser;
`;
fs.writeFileSync(path.join(serverPath, 'middlewares', 'formJsonParser.ts'), parserContent);

// 6. Write Auth Middlewares
const authMiddlewareContent = `import { ENextFunction, ERequest, EResponse } from "../types";

const authMiddleware = {
  UserValidator: (req: ERequest, res: EResponse, next: ENextFunction) => {
    if (req.authResponse && req.authResponse.email) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized access." });
    }
  }
};
export default authMiddleware;
`;
fs.writeFileSync(path.join(serverPath, 'middlewares', 'auth.ts'), authMiddlewareContent);

const validationContent = `import { cpauthInterface, ENextFunction, ERequest, EResponse } from "../types";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export const authValidator: { (roles?: string[]): cpauthInterface } = (roles = ["Administrator", "Veterinarian", "Staff", "Receptionist"]) => {
  return async (req: ERequest, res: EResponse, next: ENextFunction) => {
    try {
      const access_token = req.cookies?.["token"] || req.headers.authorization?.split(" ")[1];
      if (access_token) {
        const decoded = jwt.verify(access_token, JWT_SECRET) as any;
        if (decoded && roles.includes(decoded.role)) {
          req.authResponse = decoded;
          req.authenticated = true;
          return next();
        }
      }
      return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
`;
fs.writeFileSync(path.join(serverPath, 'helpers', 'validation.ts'), validationContent);

// 7. Migration logic
interface RouteDefinition {
  method: string;
  path: string;
  exportName: string;
  routeFile: string;
}

const allRoutes: RouteDefinition[] = [];

function convertNextApiToExpress(sourceContent: string) {
  let converted = sourceContent
    .replace(/import \{ NextRequest, NextResponse \} from 'next\/server';/g, 'import { ERequest, EResponse } from "../../types";')
    .replace(/import \{ NextRequest \} from 'next\/server';/g, 'import { ERequest, EResponse } from "../../types";')
    .replace(/import \{ NextResponse \} from 'next\/server';/g, 'import { ERequest, EResponse } from "../../types";')
    .replace(/export async function (GET|POST|PUT|PATCH|DELETE)\(request: NextRequest, \{ params \}: \{ params: any \}\)/g, 'export default async function $1(req: ERequest, res: EResponse)')
    .replace(/export async function (GET|POST|PUT|PATCH|DELETE)\(request: NextRequest, \{ params \}: \{ params: \{ id: string \} \}\)/g, 'export default async function $1(req: ERequest, res: EResponse)')
    .replace(/export async function (GET|POST|PUT|PATCH|DELETE)\(request: NextRequest, context: any\)/g, 'export default async function $1(req: ERequest, res: EResponse)')
    .replace(/export async function (GET|POST|PUT|PATCH|DELETE)\(request: NextRequest\)/g, 'export default async function $1(req: ERequest, res: EResponse)')
    .replace(/export async function (GET|POST|PUT|PATCH|DELETE)\(\)/g, 'export default async function $1(req: ERequest, res: EResponse)')
    .replace(/const body = await request.json\(\);/g, 'const body = req.body;')
    .replace(/request\.nextUrl\.searchParams\.get\((.*?)\)/g, 'req.query[$1] as string')
    .replace(/request\.nextUrl\.searchParams/g, 'req.query')
    .replace(/params\.id/g, 'req.params.id')
    .replace(/return NextResponse\.json\((.*?)(?:,\s*\{(.*?)\})?\);/g, (match, p1, p2) => {
      if (p2 && p2.includes('status:')) {
        const statusMatch = p2.match(/status:\s*(\d+)/);
        const status = statusMatch ? statusMatch[1] : 200;
        return `return res.status(${status}).json(${p1});`;
      }
      return `return res.json(${p1});`;
    });

  converted = converted
    .replace(/import \{ getServerSession \} from 'next-auth\/next';\nimport \{ authOptions \} from '.*?';/g, '')
    .replace(/import \{ requireAuth, requirePermission, requireAnyPermission \} from '.*?';/g, '')
    .replace(/const session = await getServerSession\(authOptions\);/g, 'const user = req.authResponse;')
    .replace(/session\?\.user\?\.email/g, 'user?.email')
    .replace(/session\?.user\?.id/g, 'user?.userID')
    .replace(/session\?.user\?.role/g, 'user?.role');

  return converted;
}

function processDirectory(dir: string, baseRoute: string) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      let nextBaseRoute = baseRoute;
      if (item.startsWith('[') && item.endsWith(']')) {
        nextBaseRoute += '/:' + item.slice(1, -1);
      } else {
        nextBaseRoute += '/' + item;
      }
      processDirectory(fullPath, nextBaseRoute);
    } else if (item === 'route.ts') {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      methods.forEach(method => {
        if (content.includes(`export async function ${method}`)) {
          const folderName = baseRoute.split('/')[1] || 'general';
          const methodDirPath = path.join(serverPath, 'methods', folderName);
          fs.mkdirSync(methodDirPath, { recursive: true });
          
          let safeRouteName = baseRoute.replace(/\//g, '_').replace(/:/g, 'P_').replace(/\[|\]/g, '');
          if (safeRouteName === '_') safeRouteName = 'root';
          const fileName = `${safeRouteName}_${method}.ts`;
          
          let methodContent = convertNextApiToExpress(content);
          // Delete all export function that are NOT the current method
          methods.forEach(m => {
            if (m !== method) {
              methodContent = methodContent.replace(new RegExp(`export default async function ${m}[\\s\\S]*?^export default`, 'gm'), 'export default');
              methodContent = methodContent.replace(new RegExp(`export default async function ${m}[\\s\\S]*?$`), '');
            }
          });
          // Fix any leftovers of other methods
          methodContent += `\nexport default ${method};`;
          
          // Actually, our regex replacement already changed "export async function GET" to "export default async function GET"
          // Let's just do a simpler fix for the duplicate "export default" problem:
          // Just let it export the function, and we import it directly in main_routes if we want.
          // Let's write the raw converted content, but we need only one export default. 
          // Instead, let's keep them as named exports in the converted file and change the import.
          let finalContent = convertNextApiToExpress(content)
            .replace(/export default async function/g, 'export async function');
          
          fs.writeFileSync(path.join(methodDirPath, fileName), finalContent);
          
          allRoutes.push({
            method: method.toLowerCase(),
            path: baseRoute || '/',
            exportName: method,
            routeFile: path.join('methods', folderName, fileName),
          });
        }
      });
    }
  });
}

processDirectory(basePath, '');

// Create main_routes.ts
let mainRoutesContent = `import { ERoutes } from "../types";\nimport { authValidator } from "../helpers/validation";\n\n`;

allRoutes.forEach((r, idx) => {
  const relativePath = '../' + r.routeFile.replace(/\\/g, '/').replace('.ts', '');
  mainRoutesContent += `import { ${r.exportName} as handler_${idx} } from "${relativePath}";\n`;
});

mainRoutesContent += `\nconst main_routes: Array<ERoutes> = [\n`;

allRoutes.forEach((r, idx) => {
  mainRoutesContent += `  {
    path: "/api${r.path}",
    method: "${r.method}",
    response: handler_${idx},
    auth: authValidator(),
  },\n`;
});

mainRoutesContent += `];\n\nexport default main_routes;\n`;
fs.writeFileSync(path.join(serverPath, 'routes', 'main.ts'), mainRoutesContent);
