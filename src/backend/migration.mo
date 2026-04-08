import Map "mo:core/Map";

module {
  // Old ConsultationResult had rootCauses : Text (single string)
  type OldConsultationResult = {
    flowType : Text;
    conditionScore : Nat;
    primaryConcern : Text;
    severity : Text;
    doshaImbalance : Text;
    rootCauses : Text;
    reportJson : Text;
    timestamp : Int;
  };

  type User = {
    passwordHash : Text;
  };

  // New ConsultationResult has rootCauses : [Text]
  type NewConsultationResult = {
    flowType : Text;
    conditionScore : Nat;
    primaryConcern : Text;
    severity : Text;
    doshaImbalance : Text;
    rootCauses : [Text];
    reportJson : Text;
    timestamp : Int;
  };

  type OldActor = {
    users : Map.Map<Text, User>;
    history : Map.Map<Text, Bool>;
    consultations : Map.Map<Text, [OldConsultationResult]>;
  };

  type NewActor = {
    users : Map.Map<Text, User>;
    history : Map.Map<Text, Bool>;
    consultations : Map.Map<Text, [NewConsultationResult]>;
  };

  public func run(old : OldActor) : NewActor {
    let newConsultations = old.consultations.map<Text, [OldConsultationResult], [NewConsultationResult]>(
      func(_username, results) {
        results.map<OldConsultationResult, NewConsultationResult>(
          func(r) {
            {
              r with
              rootCauses = [r.rootCauses];
            }
          }
        )
      }
    );
    {
      users = old.users;
      history = old.history;
      consultations = newConsultations;
    };
  };
};
