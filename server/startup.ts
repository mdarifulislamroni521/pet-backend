import handlers from "./handlers";
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
        console.log(`${route?.path} route error `, routeError);
      }
    });
  });
  console.log("router setup done");
};

export default ServerStartup;
