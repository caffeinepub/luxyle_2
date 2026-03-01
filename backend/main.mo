import Set "mo:core/Set";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type FeedbackStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Feedback = {
    id : Nat;
    name : Text;
    rating : Nat;
    review : Text;
    status : FeedbackStatus;
    submittedAt : Time.Time;
  };

  public type AppointmentStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Appointment = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    message : Text;
    date : Text;
    time : Text;
    status : AppointmentStatus;
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let adminUsername = "Luxyle Indore";
  let adminPassword = "Luxyle1234";

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var feedbackCounter = 0;
  var appointmentCounter = 0;

  let feedbackMap = Map.empty<Nat, Feedback>();
  let appointmentMap = Map.empty<Nat, Appointment>();
  let blockedDates = Set.empty<Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async Bool {
    username == adminUsername and password == adminPassword;
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func submitFeedback(name : Text, rating : Nat, review : Text) : async () {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let feedback : Feedback = {
      id = feedbackCounter;
      name;
      rating;
      review;
      status = #pending;
      submittedAt = Time.now();
    };

    feedbackMap.add(feedbackCounter, feedback);
    feedbackCounter += 1;
  };

  // Admin-only: approve a specific feedback submission
  public shared ({ caller }) func approveFeedback(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve feedback");
    };

    switch (feedbackMap.get(id)) {
      case (null) {
        Runtime.trap("Feedback not found");
      };
      case (?feedback) {
        if (feedback.status != #pending) {
          Runtime.trap("Only pending feedback can be approved");
        };

        let updatedFeedback : Feedback = {
          feedback with status = #approved
        };
        feedbackMap.add(id, updatedFeedback);
      };
    };
  };

  // Admin-only: get all feedback regardless of status
  public query ({ caller }) func getAllFeedback() : async [Feedback] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all feedback");
    };
    feedbackMap.values().toArray();
  };

  // Admin-only: get feedback filtered by any status
  public query ({ caller }) func getFeedbackByStatus(status : FeedbackStatus) : async [Feedback] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can filter feedback by status");
    };
    let feedbackList = List.empty<Feedback>();
    for ((_, feedback) in feedbackMap.entries()) {
      if (feedback.status == status) {
        feedbackList.add(feedback);
      };
    };
    feedbackList.toArray();
  };

  // Admin-only: update feedback status (approve/reject/pending)
  public shared ({ caller }) func updateFeedbackStatus(id : Nat, status : FeedbackStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update feedback status");
    };
    switch (feedbackMap.get(id)) {
      case (null) { Runtime.trap("Feedback not found") };
      case (?feedback) {
        let updatedFeedback : Feedback = {
          feedback with status;
        };
        feedbackMap.add(id, updatedFeedback);
      };
    };
  };

  // Public-facing query: only returns explicitly approved feedback for display on the main site
  public query ({ caller }) func getApprovedFeedback() : async [Feedback] {
    let feedbackList = List.empty<Feedback>();
    for ((_, feedback) in feedbackMap.entries()) {
      if (feedback.status == #approved) {
        feedbackList.add(feedback);
      };
    };
    feedbackList.toArray();
  };

  public shared ({ caller }) func bookAppointment(name : Text, phone : Text, email : Text, message : Text, date : Text, time : Text) : async () {
    if (blockedDates.contains(date)) {
      Runtime.trap("Selected date is blocked for appointments");
    };

    let appointment : Appointment = {
      id = appointmentCounter;
      name;
      phone;
      email;
      message;
      date;
      time;
      status = #pending;
      createdAt = Time.now();
    };

    appointmentMap.add(appointmentCounter, appointment);
    appointmentCounter += 1;
  };

  // Admin-only: get all appointments (contains personal data)
  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all appointments");
    };
    appointmentMap.values().toArray();
  };

  // Admin-only: get appointments filtered by status (contains personal data)
  public query ({ caller }) func getAppointmentsByStatus(status : AppointmentStatus) : async [Appointment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can filter appointments by status");
    };
    let appointmentList = List.empty<Appointment>();
    for ((_, appointment) in appointmentMap.entries()) {
      if (appointment.status == status) {
        appointmentList.add(appointment);
      };
    };
    appointmentList.toArray();
  };

  // Admin-only: update appointment status
  public shared ({ caller }) func updateAppointmentStatus(id : Nat, status : AppointmentStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update appointment status");
    };
    switch (appointmentMap.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) {
        let updatedAppointment : Appointment = {
          appointment with status;
        };
        appointmentMap.add(id, updatedAppointment);
      };
    };
  };

  // Admin-only: block a date
  public shared ({ caller }) func blockDate(date : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can block dates");
    };
    blockedDates.add(date);
  };

  // Admin-only: unblock a date
  public shared ({ caller }) func unblockDate(date : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can unblock dates");
    };
    blockedDates.remove(date);
  };

  // Public: anyone needs to know which dates are blocked when booking
  public query ({ caller }) func getBlockedDates() : async [Text] {
    blockedDates.toArray();
  };
};
