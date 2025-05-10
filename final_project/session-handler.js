let _session;

function setSession(session) {
  _session = session;
}

function getUsername() {
  if (_session) {
    console.log(_session.authorization.username);
  }
  return _session && _session.authorization ? _session.authorization.username : null;
}

module.exports = {
  setSession: setSession,
  getUsername: getUsername,
};