import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";



actor {
  public type PasswordHash = Text;

  // User record with only a password hash for simplicity
  type User = {
    passwordHash : PasswordHash;
  };

  // Map of username to User record
  var users = Map.empty<Text, User>();

  // Map of username to history status
  var history = Map.empty<Text, Bool>();

  // Register a new user
  // Inputs:
  //   username : Text - user provided username
  //   passwordHash : Text - SHA-256 password hash (hex string) provided by frontend
  // Returns: async () on success
  // Throws: "Username already taken" if username is already registered
  public shared ({ caller }) func registerUser(username : Text, passwordHash : PasswordHash) : async () {
    if (users.containsKey(username)) {
      Runtime.trap("Username already taken");
    };
    let user = {
      passwordHash;
    };
    users.add(username, user);
  };

  // Log in a user - match username and password hash
  // Inputs:
  //   username : Text - user provided username
  //   passwordHash : Text - SHA-256 password hash (hex string) provided by frontend
  // Returns: async () on success
  // Throws: "User not found" if username does not exist
  // Throws: "Incorrect password" if password hash does not match
  public query ({ caller }) func login(username : Text, passwordHash : PasswordHash) : async () {
    switch (users.get(username)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?user) {
        if (user.passwordHash == passwordHash) {
          ();
        } else {
          Runtime.trap("Incorrect password");
        };
      };
    };
  };

  // Add an assessment to the history
  // Inputs:
  //   username : Text - user provided username
  // Returns: async () on success (does not indicate if user previously had history)
  // Throws: "User not found" if username does not exist
  public shared ({ caller }) func addAssessmentHistory(username : Text) : async () {
    if (not users.containsKey(username)) {
      Runtime.trap("User not found");
    };
    history.add(username, true);
  };

  // Check if a user has any assessment history
  // Inputs:
  //   username : Text - user provided username
  // Returns: async Bool - true if user has history, false if not
  // Throws: "User not found" if username does not exist
  public query ({ caller }) func hasHistory(username : Text) : async Bool {
    if (not users.containsKey(username)) {
      Runtime.trap("User not found");
    };
    switch (history.get(username)) {
      case (?hasHistory) { hasHistory };
      case (null) { false };
    };
  };
};
