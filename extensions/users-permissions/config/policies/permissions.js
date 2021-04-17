"use strict";

const _ = require("lodash");

module.exports = async (ctx, next) => {
  let role;

  if (ctx.state.user) {
    // request is already authenticated in a different way
    return next();
  }

  if (
    (ctx.request && ctx.request.header && ctx.request.header.authorization) ||
    (ctx.request && ctx.request.header && ctx.request.header.token) ||
    (ctx.request.query && ctx.request.query.token)
  ) {
    try {
      // init `id` and `isAdmin` outside of validation blocks
      let id;

      // normal authorization
      if (
        ctx.request &&
        ctx.request.header &&
        ctx.request.header.authorization
      ) {
        // use the current system with JWT in the header
        const decrypted = await strapi.plugins[
          "users-permissions"
        ].services.jwt.getToken(ctx);

        id = decrypted.id;
      }

      // get token from query_string or header
      if (!id) {
        const tokenStr = ctx.request.header.token || ctx.request.query.token;
        // find the token entry that match the token from the request
        const [token] = await strapi.query("token").find({ token: tokenStr });

        if (!token) {
          throw new Error(`Invalid token: This token doesn't exist`);
        } else {
          if (token.user && typeof token.token === "string") {
            id = token.user.id;
          }
        }

        // if ctx.request.query.token is present
        delete ctx.request.query.token;
      }

      // this is the line that already exist in the code
      if (id === undefined) {
        throw new Error("Invalid token: Token did not contain required fields");
      }

      // fetch authenticated user
      ctx.state.user = await strapi.plugins[
        "users-permissions"
      ].services.user.fetchAuthenticatedUser(id);
    } catch (err) {
      return handleErrors(ctx, err, "unauthorized");
    }

    if (!ctx.state.user) {
      return handleErrors(ctx, "User Not Found", "unauthorized");
    }

    role = ctx.state.user.role;

    if (role.type === "root") {
      return await next();
    }

    const store = await strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
    });

    if (
      _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
      !ctx.state.user.confirmed
    ) {
      return handleErrors(
        ctx,
        "Your account email is not confirmed.",
        "unauthorized"
      );
    }

    if (ctx.state.user.blocked) {
      return handleErrors(
        ctx,
        "Your account has been blocked by the administrator.",
        "unauthorized"
      );
    }
  }

  // Retrieve `public` role.
  if (!role) {
    role = await strapi
      .query("role", "users-permissions")
      .findOne({ type: "public" }, []);
  }

  const route = ctx.request.route;
  const permission = await strapi
    .query("permission", "users-permissions")
    .findOne(
      {
        role: role.id,
        type: route.plugin || "application",
        controller: route.controller,
        action: route.action,
        enabled: true,
      },
      []
    );

  if (!permission) {
    return handleErrors(ctx, undefined, "forbidden");
  }

  // Execute the policies.
  if (permission.policy) {
    return await strapi.plugins["users-permissions"].config.policies[
      permission.policy
    ](ctx, next);
  }

  // Execute the action.
  await next();
};

const handleErrors = (ctx, err = undefined, type) => {
  throw strapi.errors[type](err);
};
