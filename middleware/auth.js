export default function({ app, store }) {
  if (!store.$auth.loggedIn) {
    return app.context.redirect(`/`);
  }
}

