import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  // Public user type including only the password hash
  public type PasswordHash = Text;
  public type User = {
    passwordHash : PasswordHash;
  };

  // Actor with stable variables for persistent storage
  type Actor = {
    users : Map.Map<Text, User>;
    history : Map.Map<Text, Bool>;
  };

  // Migration function that restores static variables from persistent storage
  public func run(old : Actor) : Actor {
    old;
  };
};
