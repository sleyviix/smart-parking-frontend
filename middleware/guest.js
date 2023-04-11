export default function({app}) {
  if (app.$auth.loggedIn) {
    return app.context.redirect(`/`);
  }
}

