import Map "mo:core/Map";
import Array "mo:core/Array";

module {
  // Old types from previous backend (classical persistence with B-tree internals)
  type PasswordHash = Text;
  type OldUser = { passwordHash : PasswordHash };

  // Old B-tree node types (needed to consume old stable fields)
  type Nat_ = Nat;
  type Data<K, V> = { var count : Nat_; kvs : [var ?(K, V)] };
  type Leaf<K, V> = { data : Data<K, V> };
  type Internal<K, V> = { children : [var ?Node<K, V>]; data : Data<K, V> };
  type Node<K, V> = { #internal : Internal<K, V>; #leaf : Leaf<K, V> };
  type BTreeMap<K, V> = { var root : Node<K, V>; var size : Nat_ };

  // Old actor stable state
  type OldActor = {
    var userEntries : [(Text, OldUser)];
    var historyEntries : [(Text, Bool)];
    var users : BTreeMap<Text, OldUser>;
    var history : BTreeMap<Text, Bool>;
  };

  // New types
  type NewUser = { passwordHash : PasswordHash };

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

  // New actor stable state (enhanced orthogonal persistence)
  type NewActor = {
    users : Map.Map<Text, NewUser>;
    history : Map.Map<Text, Bool>;
    consultations : Map.Map<Text, [ConsultationResult]>;
  };

  public func run(old : OldActor) : NewActor {
    // Rebuild users map from the serialized entries array
    let userPairs = old.userEntries.map<(Text, OldUser), (Text, NewUser)>(
      func(entry : (Text, OldUser)) : (Text, NewUser) {
        let k = entry.0;
        let v = entry.1;
        (k, { passwordHash = v.passwordHash })
      }
    );
    let newUsers = Map.fromArray<Text, NewUser>(userPairs);

    // Rebuild history map from the serialized entries array
    let newHistory = Map.fromArray(old.historyEntries);

    {
      users = newUsers;
      history = newHistory;
      consultations = Map.empty();
    };
  };
};
