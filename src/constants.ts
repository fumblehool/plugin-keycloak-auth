import { join } from "path";

export const staticsPath = join(__dirname, "static");
export const templatesPath = join(__dirname, "templates");


import { CreateServerDockerComposeParams } from "@amplication/code-gen-types";

export const updateDockerComposeProperties: CreateServerDockerComposeParams["updateProperties"] =
  [
    {
      services: {
        keycloak: {
          image: "quay.io/keycloak/keycloak",
          command: "start-dev", // --import-realm",
          restart: "always",
          ports: ["${KC_PORT}:8080"],
          environment: {
            KEYCLOAK_ADMIN: "${KC_ADMIN_USER}",
            KEYCLOAK_ADMIN_PASSWORD: "${KC_ADMIN_PASSWORD}"
          }
        }
      },
    }
  ];

export const updateDockerComposeDevProperties: CreateServerDockerComposeParams["updateProperties"] =
  [
    {
      services: {
        keycloak: {
          image: "quay.io/keycloak/keycloak",
          command: "start-dev", // --import-realm",
          restart: "always",
          ports: ["${KC_PORT}:8080"],
          environment: {
            KEYCLOAK_ADMIN: "${KC_ADMIN_USER}",
            KEYCLOAK_ADMIN_PASSWORD: "${KC_ADMIN_PASSWORD}"
          }
        }
      },
    },
  ];

export const AUTH_ENTITY_ERROR = "Authentication entity does not exist";
export const AUTH_ENTITY_LOG_ERROR =
  "Authentication entity does not exist. Have you configured the authentication entity in the Resource Settings?";
