import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";

actor {
  // ── Types ────────────────────────────────────────────────────────────────

  public type PasswordHash = Text;

  type User = {
    passwordHash : PasswordHash;
  };

  public type ConsultationResult = {
    flowType : Text;
    conditionScore : Nat;
    primaryConcern : Text;
    severity : Text;
    doshaImbalance : Text;
    rootCauses : Text;
    reportJson : Text;
    timestamp : Int;
  };

  // ── State (persists via enhanced orthogonal persistence) ─────────────────

  let users : Map.Map<Text, User> = Map.empty<Text, User>();
  let history : Map.Map<Text, Bool> = Map.empty<Text, Bool>();

  // Store consultations as a flat array per user (compatible with previous [ConsultationResult] type)
  let consultations : Map.Map<Text, [ConsultationResult]> = Map.empty<Text, [ConsultationResult]>();

  // ── Public API ───────────────────────────────────────────────────────────

  /// Register a new user with a hashed password.
  public shared func registerUser(username : Text, passwordHash : PasswordHash) : async { #ok : Text; #err : Text } {
    if (username.size() == 0) {
      return #err("Username cannot be empty");
    };
    if (users.containsKey(username)) {
      return #err("Username already taken");
    };
    users.add(username, { passwordHash });
    #ok("Registration successful");
  };

  /// Authenticate a user. Returns ok on success, err on failure.
  public query func loginUser(username : Text, passwordHash : PasswordHash) : async { #ok : Text; #err : Text } {
    switch (users.get(username)) {
      case (null) { #err("User not found") };
      case (?user) {
        if (user.passwordHash != passwordHash) {
          #err("Incorrect password");
        } else {
          #ok("Login successful");
        };
      };
    };
  };

  /// Record that a user has completed an assessment.
  public shared func addAssessmentHistory(username : Text) : async { #ok; #err : Text } {
    if (not users.containsKey(username)) {
      return #err("User not found");
    };
    history.add(username, true);
    #ok;
  };

  /// Check whether a user has completed at least one assessment.
  /// Returns false (not an error) for unknown users so new-user flows work.
  public query func hasHistory(username : Text) : async Bool {
    switch (history.get(username)) {
      case (?h) { h };
      case (null) { false };
    };
  };

  /// Persist a consultation result and mark the user as having history.
  public shared func saveConsultationResult(
    username : Text,
    flowType : Text,
    conditionScore : Nat,
    primaryConcern : Text,
    severity : Text,
    doshaImbalance : Text,
    rootCauses : Text,
    reportJson : Text,
    timestamp : Int,
  ) : async { #ok; #err : Text } {
    if (not users.containsKey(username)) {
      return #err("User not found");
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
    let existing = switch (consultations.get(username)) {
      case (null) { [] };
      case (?arr) { arr };
    };
    // Append new result, keep last 20
    let combined = existing.concat([result]);
    let size = combined.size();
    let trimmed = if (size > 20) {
      Array.tabulate(20, func(i) { combined[size - 20 + i] });
    } else {
      combined;
    };
    consultations.add(username, trimmed);
    history.add(username, true);
    #ok;
  };

  /// Return all consultation results for a user (most recent 20).
  public query func getConsultationResults(username : Text) : async [ConsultationResult] {
    switch (consultations.get(username)) {
      case (null) { [] };
      case (?results) { results };
    };
  };
};
