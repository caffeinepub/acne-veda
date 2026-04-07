import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  public type PasswordHash = Text;

  type User = {
    passwordHash : PasswordHash;
  };

  type ConsultationResult = {
    flowType : Text; // "skin" or "hair"
    conditionScore : Nat;
    primaryConcern : Text;
    severity : Text;
    doshaImbalance : Text;
    rootCauses : Text;
    reportJson : Text; // full JSON blob of answers + recommendations
    timestamp : Int;
  };

  // Stable storage so data survives canister upgrades
  stable var userEntries : [(Text, User)] = [];
  stable var historyEntries : [(Text, Bool)] = [];
  stable var consultationEntries : [(Text, [ConsultationResult])] = [];

  // Working maps rebuilt from stable storage
  var users : Map.Map<Text, User> = Map.fromArray(userEntries);
  var history : Map.Map<Text, Bool> = Map.fromArray(historyEntries);
  var consultations : Map.Map<Text, [ConsultationResult]> = Map.fromArray(consultationEntries);

  system func preupgrade() {
    userEntries := users.toArray();
    historyEntries := history.toArray();
    consultationEntries := consultations.toArray();
  };

  system func postupgrade() {
    users := Map.fromArray(userEntries);
    history := Map.fromArray(historyEntries);
    consultations := Map.fromArray(consultationEntries);
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

  // Save a consultation result
  public shared func saveConsultationResult(
    username : Text,
    flowType : Text,
    conditionScore : Nat,
    primaryConcern : Text,
    severity : Text,
    doshaImbalance : Text,
    rootCauses : Text,
    reportJson : Text,
    timestamp : Int
  ) : async () {
    if (not users.containsKey(username)) {
      Runtime.trap("User not found");
    };
    let result : ConsultationResult = {
      flowType;
      conditionScore;
      primaryConcern;
      severity;
      doshaImbalance;
      rootCauses;
      reportJson;
      timestamp;
    };
    switch (consultations.get(username)) {
      case (null) {
        consultations.add(username, [result]);
      };
      case (?existing) {
        consultations.add(username, Array.append(existing, [result]));
      };
    };
    // Also mark as having history
    history.add(username, true);
  };

  // Get consultation results for a user (latest first, max 10)
  public query func getConsultationResults(username : Text) : async [ConsultationResult] {
    switch (consultations.get(username)) {
      case (null) { [] };
      case (?results) {
        let size = results.size();
        if (size <= 10) { results } else {
          // Return last 10
          var out : [ConsultationResult] = [];
          var i = size - 10;
          while (i < size) {
            out := Array.append(out, [results[i]]);
            i += 1;
          };
          out
        };
      };
    };
  };
};
