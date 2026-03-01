import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public type Feedback = {
    id : Nat;
    name : Text;
    rating : Nat;
    review : Text;
    status : { #pending; #approved; #rejected };
    submittedAt : Int;
  };

  public type Appointment = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    message : Text;
    date : Text;
    time : Text;
    status : { #pending; #approved; #rejected };
    createdAt : Int;
  };

  public type UserProfile = { name : Text };

  public type OldActor = {
    adminUsername : Text;
    adminPassword : Text;
    feedbackCounter : Nat;
    appointmentCounter : Nat;
    feedbackMap : Map.Map<Nat, Feedback>;
    appointmentMap : Map.Map<Nat, Appointment>;
    userProfiles : Map.Map<Principal, UserProfile>;
    blockedDates : Set.Set<Text>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    blockedDates : Set.Set<Text>;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      blockedDates = old.blockedDates;
    };
  };
};
