import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  public type PasswordHash = Text;

  type User = {
    passwordHash : PasswordHash;
  };

  // Stable storage so data survives canister upgrades
  stable var userEntries : [(Text, User)] = [];
  stable var historyEntries : [(Text, Bool)] = [];

  // Working maps rebuilt from stable storage
  var users : Map.Map<Text, User> = Map.fromArray(userEntries);
  var history : Map.Map<Text, Bool> = Map.fromArray(historyEntries);

  system func preupgrade() {
    userEntries := users.toArray();
    historyEntries := history.toArray();
  };

  system func postupgrade() {
    users := Map.fromArray(userEntries);
    history := Map.fromArray(historyEntries);
  };

  // Register a new user
  public shared func registerUser(username : Text, passwordHash : PasswordHash) : async () {
    if (users.containsKey(username)) {
      Runtime.trap("Username already taken");
    };
    users.add(username, { passwordHash });
  };

  // Log in a user
  public query func login(username : Text, passwordHash : PasswordHash) : async () {
    switch (users.get(username)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        if (user.passwordHash != passwordHash) {
          Runtime.trap("Incorrect password");
        };
      };
    };
  };

  // Add an assessment to the history
  public shared func addAssessmentHistory(username : Text) : async () {
    if (not users.containsKey(username)) {
      Runtime.trap("User not found");
    };
    history.add(username, true);
  };

  // Check if a user has any assessment history
  public query func hasHistory(username : Text) : async Bool {
    if (not users.containsKey(username)) {
      Runtime.trap("User not found");
    };
    switch (history.get(username)) {
      case (?h) { h };
      case (null) { false };
    };
  };
};
