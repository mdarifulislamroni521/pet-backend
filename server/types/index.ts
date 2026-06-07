import { NextFunction, Request, Response } from "express";

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
