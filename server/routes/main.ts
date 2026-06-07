import { authValidator } from "../helpers/validation";
import { ERoutes } from "../types";

import { GET as handler_0 } from "../methods/activity/_activity_GET";
import { GET as handler_7 } from "../methods/ai-models/_ai-models_active_GET";
import { POST as handler_8 } from "../methods/ai-models/_ai-models_active_POST";
import { DELETE as handler_12 } from "../methods/ai-models/_ai-models_DELETE";
import { GET as handler_9 } from "../methods/ai-models/_ai-models_GET";
import { POST as handler_10 } from "../methods/ai-models/_ai-models_POST";
import { PUT as handler_11 } from "../methods/ai-models/_ai-models_PUT";
import { GET as handler_13 } from "../methods/ai-models/_ai-models_test_GET";
import { POST as handler_14 } from "../methods/ai-models/_ai-models_test_POST";
import { GET as handler_15 } from "../methods/ai-results/_ai-results_debug_GET";
import { DELETE as handler_18 } from "../methods/ai-results/_ai-results_DELETE";
import { GET as handler_16 } from "../methods/ai-results/_ai-results_GET";
import { POST as handler_17 } from "../methods/ai-results/_ai-results_POST";
import { POST as handler_2 } from "../methods/ai/_ai_anthropic-vision_POST";
import { POST as handler_1 } from "../methods/ai/_ai_anthropic_POST";
import { POST as handler_4 } from "../methods/ai/_ai_google-vision_POST";
import { POST as handler_3 } from "../methods/ai/_ai_google_POST";
import { POST as handler_6 } from "../methods/ai/_ai_openai-vision_POST";
import { POST as handler_5 } from "../methods/ai/_ai_openai_POST";
import { GET as handler_22 } from "../methods/appointments/_appointments_GET";
import { DELETE as handler_21 } from "../methods/appointments/_appointments_P_id_DELETE";
import { GET as handler_19 } from "../methods/appointments/_appointments_P_id_GET";
import { PUT as handler_20 } from "../methods/appointments/_appointments_P_id_PUT";
import { POST as handler_23 } from "../methods/appointments/_appointments_POST";
import authLoginPOST from "../methods/auth/_auth_login_POST";
import authLogoutPOST from "../methods/auth/_auth_logout_POST";
import authMeGET from "../methods/auth/_auth_me_GET";
import { GET as handler_24 } from "../methods/dashboard/_dashboard_GET";
import { GET as handler_25 } from "../methods/demo-check/_demo-check_GET";
import { GET as handler_29 } from "../methods/owners/_owners_GET";
import { DELETE as handler_28 } from "../methods/owners/_owners_P_id_DELETE";
import { GET as handler_26 } from "../methods/owners/_owners_P_id_GET";
import { PUT as handler_27 } from "../methods/owners/_owners_P_id_PUT";
import { POST as handler_30 } from "../methods/owners/_owners_POST";
import { GET as handler_31 } from "../methods/owners/_owners_search_GET";
import { GET as handler_35 } from "../methods/patients/_patients_GET";
import { DELETE as handler_34 } from "../methods/patients/_patients_P_id_DELETE";
import { GET as handler_32 } from "../methods/patients/_patients_P_id_GET";
import { PUT as handler_33 } from "../methods/patients/_patients_P_id_PUT";
import { POST as handler_36 } from "../methods/patients/_patients_POST";
import { GET as handler_37 } from "../methods/patients/_patients_search_GET";
import { GET as handler_41 } from "../methods/pets/_pets_GET";
import { DELETE as handler_40 } from "../methods/pets/_pets_P_id_DELETE";
import { GET as handler_38 } from "../methods/pets/_pets_P_id_GET";
import { PUT as handler_39 } from "../methods/pets/_pets_P_id_PUT";
import { POST as handler_42 } from "../methods/pets/_pets_POST";
import { GET as handler_43 } from "../methods/pets/_pets_search_GET";
import { PUT as handler_44 } from "../methods/profile/_profile_password_PUT";
import { PUT as handler_45 } from "../methods/profile/_profile_PUT";
import { GET as handler_49 } from "../methods/reports/_reports_GET";
import { DELETE as handler_48 } from "../methods/reports/_reports_P_id_DELETE";
import { GET as handler_46 } from "../methods/reports/_reports_P_id_GET";
import { PUT as handler_47 } from "../methods/reports/_reports_P_id_PUT";
import { POST as handler_50 } from "../methods/reports/_reports_POST";
import { GET as handler_51 } from "../methods/settings/_settings_GET";
import { PUT as handler_52 } from "../methods/settings/_settings_PUT";
import { GET as handler_53 } from "../methods/test-db/_test-db_GET";
import { GET as handler_57 } from "../methods/users/_users_GET";
import { DELETE as handler_56 } from "../methods/users/_users_P_id_DELETE";
import { GET as handler_54 } from "../methods/users/_users_P_id_GET";
import { PUT as handler_55 } from "../methods/users/_users_P_id_PUT";
import { POST as handler_58 } from "../methods/users/_users_POST";
import { GET as handler_59 } from "../methods/veterinarians/_veterinarians_GET";
import { GET as handler_63 } from "../methods/workflows/_workflows_GET";
import { DELETE as handler_62 } from "../methods/workflows/_workflows_P_id_DELETE";
import { GET as handler_60 } from "../methods/workflows/_workflows_P_id_GET";
import { PUT as handler_61 } from "../methods/workflows/_workflows_P_id_PUT";
import { POST as handler_64 } from "../methods/workflows/_workflows_POST";
import { PUT as handler_65 } from "../methods/workflows/_workflows_PUT";

const main_routes: Array<ERoutes> = [
  {
    path: "/api/activity",
    method: "get",
    response: handler_0,
    auth: authValidator(),
  },
  {
    path: "/api/ai/anthropic",
    method: "post",
    response: handler_1,
    auth: authValidator(),
  },
  {
    path: "/api/ai/anthropic-vision",
    method: "post",
    response: handler_2,
    auth: authValidator(),
  },
  {
    path: "/api/ai/google",
    method: "post",
    response: handler_3,
    auth: authValidator(),
  },
  {
    path: "/api/ai/google-vision",
    method: "post",
    response: handler_4,
    auth: authValidator(),
  },
  {
    path: "/api/ai/openai",
    method: "post",
    response: handler_5,
    auth: authValidator(),
  },
  {
    path: "/api/ai/openai-vision",
    method: "post",
    response: handler_6,
    auth: authValidator(),
  },
  {
    path: "/api/ai-models/active",
    method: "get",
    response: handler_7,
    auth: authValidator(),
  },
  {
    path: "/api/ai-models/active",
    method: "post",
    response: handler_8,
    auth: authValidator(),
  },
  {
    path: "/api/ai-models",
    method: "get",
    response: handler_9,
    auth: authValidator(),
  },
  {
    path: "/api/ai-models",
    method: "post",
    response: handler_10,
    auth: authValidator(),
  },
  {
    path: "/api/ai-models",
    method: "put",
    response: handler_11,
    auth: authValidator(),
  },
  {
    path: "/api/ai-models",
    method: "delete",
    response: handler_12,
    auth: authValidator(),
  },
  {
    path: "/api/ai-models/test",
    method: "get",
    response: handler_13,
    auth: authValidator(),
  },
  {
    path: "/api/ai-models/test",
    method: "post",
    response: handler_14,
    auth: authValidator(),
  },
  {
    path: "/api/ai-results/debug",
    method: "get",
    response: handler_15,
    auth: authValidator(),
  },
  {
    path: "/api/ai-results",
    method: "get",
    response: handler_16,
    auth: authValidator(),
  },
  {
    path: "/api/ai-results",
    method: "post",
    response: handler_17,
    auth: authValidator(),
  },
  {
    path: "/api/ai-results",
    method: "delete",
    response: handler_18,
    auth: authValidator(),
  },
  {
    path: "/api/appointments/:id",
    method: "get",
    response: handler_19,
    auth: authValidator(),
  },
  {
    path: "/api/appointments/:id",
    method: "put",
    response: handler_20,
    auth: authValidator(),
  },
  {
    path: "/api/appointments/:id",
    method: "delete",
    response: handler_21,
    auth: authValidator(),
  },
  {
    path: "/api/appointments",
    method: "get",
    response: handler_22,
    auth: authValidator(),
  },
  {
    path: "/api/appointments",
    method: "post",
    response: handler_23,
    auth: authValidator(),
  },
  {
    path: "/api/dashboard",
    method: "get", 
    response: handler_24,
    auth: authValidator(),
  },
  {
    path: "/api/demo-check",
    method: "get",
    response: handler_25,
    auth: authValidator(),
  },
  {
    path: "/api/owners/:id",
    method: "get",
    response: handler_26,
    auth: authValidator(),
  },
  {
    path: "/api/owners/:id",
    method: "put",
    response: handler_27,
    auth: authValidator(),
  },
  {
    path: "/api/owners/:id",
    method: "delete",
    response: handler_28,
    auth: authValidator(),
  },
  {
    path: "/api/owners",
    method: "get",
    response: handler_29,
    auth: authValidator(),
  },
  {
    path: "/api/owners",
    method: "post",
    response: handler_30,
    auth: authValidator(),
  },
  {
    path: "/api/owners/search",
    method: "get",
    response: handler_31,
    auth: authValidator(),
  },
  {
    path: "/api/patients/:id",
    method: "get",
    response: handler_32,
    auth: authValidator(),
  },
  {
    path: "/api/patients/:id",
    method: "put",
    response: handler_33,
    auth: authValidator(),
  },
  {
    path: "/api/patients/:id",
    method: "delete",
    response: handler_34,
    auth: authValidator(),
  },
  {
    path: "/api/patients",
    method: "get",
    response: handler_35,
    auth: authValidator(),
  },
  {
    path: "/api/patients",
    method: "post",
    response: handler_36,
    auth: authValidator(),
  },
  {
    path: "/api/patients/search",
    method: "get",
    response: handler_37,
    auth: authValidator(),
  },
  {
    path: "/api/pets/:id",
    method: "get",
    response: handler_38,
    auth: authValidator(),
  },
  {
    path: "/api/pets/:id",
    method: "put",
    response: handler_39,
    auth: authValidator(),
  },
  {
    path: "/api/pets/:id",
    method: "delete",
    response: handler_40,
    auth: authValidator(),
  },
  {
    path: "/api/pets",
    method: "get",
    response: handler_41,
    auth: authValidator(),
  },
  {
    path: "/api/pets",
    method: "post",
    response: handler_42,
    auth: authValidator(),
  },
  {
    path: "/api/pets/search",
    method: "get",
    response: handler_43,
    auth: authValidator(),
  },
  {
    path: "/api/profile/password",
    method: "put",
    response: handler_44,
    auth: authValidator(),
  },
  {
    path: "/api/profile",
    method: "put",
    response: handler_45,
    auth: authValidator(),
  },
  {
    path: "/api/reports/:id",
    method: "get",
    response: handler_46,
    auth: authValidator(),
  },
  {
    path: "/api/reports/:id",
    method: "put",
    response: handler_47,
    auth: authValidator(),
  },
  {
    path: "/api/reports/:id",
    method: "delete",
    response: handler_48,
    auth: authValidator(),
  },
  {
    path: "/api/reports",
    method: "get",
    response: handler_49,
    auth: authValidator(),
  },
  {
    path: "/api/reports",
    method: "post",
    response: handler_50,
    auth: authValidator(),
  },
  {
    path: "/api/settings",
    method: "get",
    response: handler_51,
    auth: authValidator(),
  },
  {
    path: "/api/settings",
    method: "put",
    response: handler_52,
    auth: authValidator(),
  },
  {
    path: "/api/test-db",
    method: "get",
    response: handler_53,
    auth: authValidator(),
  },
  {
    path: "/api/users/:id",
    method: "get",
    response: handler_54,
    auth: authValidator(),
  },
  {
    path: "/api/users/:id",
    method: "put",
    response: handler_55,
    auth: authValidator(),
  },
  {
    path: "/api/users/:id",
    method: "delete",
    response: handler_56,
    auth: authValidator(),
  },
  {
    path: "/api/users",
    method: "get",
    response: handler_57,
    auth: authValidator(),
  },
  {
    path: "/api/users",
    method: "post",
    response: handler_58,
    auth: authValidator(),
  },
  {
    path: "/api/veterinarians",
    method: "get",
    response: handler_59,
    auth: authValidator(),
  },
  {
    path: "/api/workflows/:id",
    method: "get",
    response: handler_60,
    auth: authValidator(),
  },
  {
    path: "/api/workflows/:id",
    method: "put",
    response: handler_61,
    auth: authValidator(),
  },
  {
    path: "/api/workflows/:id",
    method: "delete",
    response: handler_62,
    auth: authValidator(),
  },
  {
    path: "/api/workflows",
    method: "get",
    response: handler_63,
    auth: authValidator(),
  },
  {
    path: "/api/workflows",
    method: "post",
    response: handler_64,
    auth: authValidator(),
  },
  {
    path: "/api/workflows",
    method: "put",
    response: handler_65,
    auth: authValidator(),
  },
  {
    path: "/api/auth/login",
    method: "post",
    response: authLoginPOST,
  },
  {
    path: "/api/auth/logout",
    method: "post",
    response: authLogoutPOST,
  },
  {
    path: "/api/auth/me",
    method: "get",
    response: authMeGET,
  },
];

export default main_routes;
