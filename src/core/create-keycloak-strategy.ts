/**
 * TODO:
 * fix this.
 * Adding this file as place-holder
 */

import { Module, DsgContext } from "@amplication/code-gen-types";
import { join } from "path";
import {
  AUTH_ENTITY_ERROR,
  AUTH_ENTITY_LOG_ERROR,
  templatesPath,
} from "../constants";
import { readFile } from "@amplication/code-gen-utils";
import {
  addImports,
  getClassDeclarationById,
  importNames,
  interpolate,
  removeTSClassDeclares,
  addInjectableDependency,
} from "../util/ast";
import { builders, namedTypes } from "ast-types";
import { print } from "@amplication/code-gen-utils";


const keycloakStrategyPath = join(templatesPath, "keycloak.strategy.template.ts");


export async function createKeycloakStrategy(
  dsgContext: DsgContext
): Promise<Module> {
  return await mapKeycloakStrategyTemplate(
    dsgContext,
    keycloakStrategyPath,
    "keycloak.strategy.template.ts"
  );
}

async function mapKeycloakStrategyTemplate(
  context: DsgContext,
  templatePath: string,
  fileName: string
): Promise<Module> {
  const { entities, resourceInfo, serverDirectories } = context;
  const authEntity = entities?.find(
    (x) => x.name === resourceInfo?.settings.authEntityName
  );
  if (!authEntity) {
    context.logger.error(AUTH_ENTITY_LOG_ERROR);
    throw new Error(AUTH_ENTITY_ERROR);
  }

  try {
    const entityServiceName = `${authEntity?.name}Service`;

    const template = await readFile(templatePath);
    const authServiceNameId = builders.identifier(entityServiceName);

    const entityNameToLower = authEntity?.name.toLowerCase();

    const entityServiceImport = importNames(
      [authServiceNameId],
      `../../${entityNameToLower}/${entityNameToLower}.service`
    );

    addImports(
      template,
      [entityServiceImport].filter(
        (x) => x //remove nulls and undefined
      ) as namedTypes.ImportDeclaration[]
    );

    const templateMapping = {
      ENTITY_SERVICE: builders.identifier(`${entityNameToLower}Service`),
    };

    const filePath = `${serverDirectories.authDirectory}/keycloak/${fileName}`;

    interpolate(template, templateMapping);

    const classDeclaration = getClassDeclarationById(
      template,
      builders.identifier("KeycloakStrategy")
    );

    const entityServiceIdentifier = builders.identifier(
      `${entityNameToLower}Service`
    );

    addInjectableDependency(
      classDeclaration,
      entityServiceIdentifier.name,
      builders.identifier(`${authEntity?.name}Service`),
      "protected"
    );

    removeTSClassDeclares(template);

    return {
      code: print(template).code,
      path: filePath,
    };
  } catch (error) {
    console.error(error);
    return { code: "", path: "" };
  }
}


/*
// Register the strategy with passport
passport.use(
  "keycloak",
  new KeycloakStrategy(
    {
      host: process.env.KEYCLOAK_HOST,
      realm: process.env.KEYCLOAK_REALM,
      clientID: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      callbackURL: `/api${AUTH_KEYCLOAK_CALLBACK}`
    },
    (accessToken, refreshToken, profile, done) => {
      // This is called after a successful authentication has been completed
      // Here's a sample of what you can then do, i.e., write the user to your DB
      User.findOrCreate({ email: profile.email }, (err, user) => {
        assert.ifError(err);
        user.keycloakId = profile.keycloakId;
        user.imageUrl = profile.avatar;
        user.name = profile.name;
        user.save((err, savedUser) => done(err, savedUser));
      });
    }
  )
);
*/