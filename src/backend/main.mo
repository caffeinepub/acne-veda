import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type PasswordHash = Text;

  type User = {
    passwordHash : PasswordHash;
  };

  type ConsultationResult = {
    flowType : Text;
    conditionScore : Nat;
    primaryConcern : Text;
    severity : Text;
    doshaImbalance : Text;
    rootCauses : Text;
    reportJson : Text;
    timestamp : Int;
  };

  // State persists automatically via enhanced orthogonal persistence
  let users : Map.Map<Text, User> = Map.empty<Text, User>();
  let history : Map.Map<Text, Bool> = Map.empty<Text, Bool>();
  let consultations : Map.Map<Text, [ConsultationResult]> = Map.empty<Text, [ConsultationResult]>();

  // Register a new user
  public shared func registerUser(username : Text, passwordHash : PasswordHash) : async () {
    if (users.containsKey(username)) {
      Runtime.trap("Username already taken");
    };
    users.add(username, { passwordHash });
  };

  // Log in a user (called loginUser by the frontend)
  public query func loginUser(username : Text, passwordHash : PasswordHash) : async () {
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
  // Returns false for unknown users (no trap) so new users work correctly
  public query func hasHistory(username : Text) : async Bool {
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
        consultations.add(username, existing.concat([result]));
      };
    };
    // Also mark as having history
    history.add(username, true);
  };

  // Get consultation results for a user (max 10 most recent)
  public query func getConsultationResults(username : Text) : async [ConsultationResult] {
    switch (consultations.get(username)) {
      case (null) { [] };
      case (?results) {
        let size = results.size();
        if (size <= 10) {
          results
        } else {
          results.sliceToArray(size - 10, size)
        };
      };
    };
  };
};
